import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Shared bits for the glossy "3D person" figures driven by pose tracks baked from video
// (MediaPipe). Tracks are flat [x, y, z] per joint per frame, in image-height units, y up.
// Every clip is played by the same character (src/data/character.json, edited at /dev/character).

export type Clip = { fps: number; joints: string[]; frames: number[][]; scale?: number }

// Proportions are in shoulder widths of the clip being played, so the same character fits a
// close-up and a full-body clip. Limb lengths are multipliers on the filmed ones (1 = as
// filmed): retargeting keeps each bone's direction from the video and rescales its length.
export type Character = {
  headSize: number       // head radius
  neck: number           // shoulder midpoint -> head centre
  shoulderWidth: number  // multiplier
  hipWidth: number       // multiplier
  torsoLength: number    // multiplier
  torsoWidth: number     // half-width at the shoulders
  upperArm: number; forearm: number; thigh: number; shin: number; foot: number   // multipliers
  armThickness: number; legThickness: number; handSize: number   // radii; handSize x armThickness
  color: string; metalness: number; roughness: number
  // PS2-era look: render at 1/pixelSize resolution, quantise to colorLevels per channel
  // (0 = off) with ordered dithering, low-poly flat shading, and vertex snapping (wobble)
  pixelSize: number; colorLevels: number; dither: boolean; lowPoly: boolean; snap: boolean
}

type Joint = 'head' | 'ls' | 'rs' | 'le' | 're' | 'lw' | 'rw' | 'lh' | 'rh' | 'lk' | 'rk' | 'la' | 'ra' | 'lf' | 'rf'
export type Pose = Partial<Record<Joint, THREE.Vector3>>

// flat joint array at a fractional frame, interpolated; wraps at the end of the clip
export function sampleClip(clip: Clip, frame: number, out: number[]) {
  const n = clip.frames.length
  const i = Math.floor(frame), s = frame - i
  const a = clip.frames[((i % n) + n) % n], b = clip.frames[(((i + 1) % n) + n) % n]
  const k = 1 / (clip.scale ?? 1)
  for (let j = 0; j < a.length; j++) out[j] = (a[j] + (b[j] - a[j]) * s) * k
}

export function toPose(clip: Clip, flat: number[], pose: Pose = {}) {
  clip.joints.forEach((j, i) => (pose[j as Joint] ??= new THREE.Vector3()).fromArray(flat, i * 3))
  return pose
}

const median = (xs: number[]) => xs.sort((a, b) => a - b)[xs.length >> 1]

// Rebuild every frame with the character's bone lengths. ground: per frame, put the lowest
// leg joint on y = 0 (smoothed over ~1.5 s), for clips filmed at an angle where the floor
// drifts in the image. Returns an unscaled clip plus the shoulder width everything is sized by.
export function retarget(clip: Clip, c: Character, { ground = false } = {}) {
  const k = 1 / (clip.scale ?? 1)
  const has = (j: Joint) => clip.joints.includes(j)
  const at = (f: number[], j: Joint) => new THREE.Vector3().fromArray(f, clip.joints.indexOf(j) * 3).multiplyScalar(k)
  const mid = (f: number[], a: Joint, b: Joint) => at(f, a).add(at(f, b)).multiplyScalar(0.5)

  const sw = median(clip.frames.map(f => at(f, 'ls').distanceTo(at(f, 'rs'))))
  const neckRatio = (c.neck * sw) / median(clip.frames.map(f => mid(f, 'ls', 'rs').distanceTo(at(f, 'head'))))
  const legs = has('lh')

  const frames = clip.frames.map(f => {
    const P = (j: Joint) => at(f, j)
    const out: Pose = {}
    const sh = mid(f, 'ls', 'rs')
    const across = P('rs').sub(P('ls')).multiplyScalar(0.5 * c.shoulderWidth)
    out.ls = sh.clone().sub(across)
    out.rs = sh.clone().add(across)
    out.head = P('head').sub(sh).multiplyScalar(neckRatio).add(sh)
    // child = parent + filmed bone vector x multiplier
    const chain = (root: THREE.Vector3, joints: Joint[], mults: number[]) => {
      let prev = root
      joints.slice(1).forEach((j, i) => {
        prev = out[j] = P(j).sub(P(joints[i])).multiplyScalar(mults[i]).add(prev)
      })
    }
    chain(out.ls, ['ls', 'le', 'lw'], [c.upperArm, c.forearm])
    chain(out.rs, ['rs', 're', 'rw'], [c.upperArm, c.forearm])
    if (legs) {
      const hip = mid(f, 'lh', 'rh').sub(sh).multiplyScalar(c.torsoLength).add(sh)
      const hipAcross = P('rh').sub(P('lh')).multiplyScalar(0.5 * c.hipWidth)
      out.lh = hip.clone().sub(hipAcross)
      out.rh = hip.clone().add(hipAcross)
      chain(out.lh, ['lh', 'lk', 'la', 'lf'], [c.thigh, c.shin, c.foot])
      chain(out.rh, ['rh', 'rk', 'ra', 'rf'], [c.thigh, c.shin, c.foot])
    }
    return clip.joints.flatMap(j => out[j as Joint]!.toArray())
  })

  if (ground && legs) {
    const low = clip.joints.flatMap((j, i) => (/^[lr][hkaf]$/.test(j) ? [i * 3 + 1] : []))
    const lowest = frames.map(f => Math.min(...low.map(i => f[i])))
    const n = lowest.length, win = Math.round(clip.fps * 0.75)
    const smooth = lowest.map((_, i) => {
      let sum = 0
      for (let d = -win; d <= win; d++) sum += lowest[(i + d + n) % n]   // wraps: the clip loops
      return sum / (2 * win + 1)
    })
    frames.forEach((f, i) => { for (let j = 1; j < f.length; j += 3) f[j] -= smooth[i] })
  }

  return { clip: { ...clip, scale: undefined, frames } as Clip, sw }
}

// Soft white glow behind the figures, following their silhouette (the canvas is transparent)
const GLOW = 'drop-shadow(0 0 10px rgb(255 255 255 / 0.35))'

// Transparent canvas with studio reflections and an orthographic camera.
export function createStage(host: HTMLElement, width: number, height: number) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.domElement.style.filter = GLOW
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -5, 5)
  const key = new THREE.DirectionalLight(0xffffff, 2)
  key.position.set(-1, 2, 3)
  scene.add(key)

  // frame a box (image-height units) so it fits the canvas, keeping its bottom on the bottom edge
  const frame = (minX: number, maxX: number, minY: number, maxY: number) => {
    const aspect = width / height
    const h = Math.max(maxY - minY, (maxX - minX) / aspect), w = h * aspect
    const cx = (minX + maxX) / 2
    camera.left = cx - w / 2; camera.right = cx + w / 2
    camera.bottom = minY; camera.top = minY + h
    camera.updateProjectionMatrix()
  }

  // retro resolution: fewer canvas pixels, upscaled without smoothing
  const setPixelSize = (px: number) => {
    renderer.setPixelRatio(px > 1 ? 1 / px : Math.min(devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.domElement.style.imageRendering = px > 1 ? 'pixelated' : ''
  }

  const render = () => renderer.render(scene, camera)
  const dispose = () => {
    renderer.setAnimationLoop(null)
    env.dispose()
    pmrem.dispose()
    renderer.dispose()
    renderer.forceContextLoss()   // free the WebGL context now, not at GC: browsers cap them (~16)
    renderer.domElement.remove()
  }
  return { renderer, scene, camera, frame, setPixelSize, render, dispose }
}

export type Stage = ReturnType<typeof createStage>

// Where a character draws: a Stage, or any scene/group in another renderer (e.g. the forest).
// Pixel size only applies when the target owns its canvas.
type Target = { scene: THREE.Object3D; renderer: THREE.WebGLRenderer; setPixelSize?: (px: number) => void }

// Chrome material with the PS2-era options patched into three's standard shader.
function retroMaterial(c: Character, target: Target, snapGrid: THREE.Vector2) {
  const material = new THREE.MeshStandardMaterial({
    color: c.color, metalness: c.metalness, roughness: c.roughness, flatShading: c.lowPoly,
  })
  material.onBeforeCompile = shader => {
    shader.uniforms.u_levels = { value: c.colorLevels }
    shader.uniforms.u_dither = { value: c.dither ? 1 : 0 }
    shader.uniforms.u_snap = { value: c.snap ? 1 : 0 }
    shader.uniforms.u_res = { value: snapGrid }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float u_snap;\nuniform vec2 u_res;')
      .replace('#include <project_vertex>', `#include <project_vertex>
        // snap to the (low-res) pixel grid: the PS1/PS2 vertex wobble
        if (u_snap > 0.5) gl_Position.xy = floor(gl_Position.xy / gl_Position.w * u_res * 0.5 + 0.5) / (u_res * 0.5) * gl_Position.w;`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float u_levels, u_dither;')
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
        if (u_levels > 1.0) {
          // 4x4 Bayer threshold, then quantise each channel to u_levels steps
          const mat4 BAYER = mat4(0.,8.,2.,10., 12.,4.,14.,6., 3.,11.,1.,9., 15.,7.,13.,5.) / 16.;
          ivec2 p = ivec2(gl_FragCoord.xy) % 4;
          float step = 1.0 / (u_levels - 1.0);
          vec3 c = gl_FragColor.rgb + (u_dither > 0.5 ? (BAYER[p.x][p.y] - 0.5) * step : 0.0);
          gl_FragColor.rgb = floor(c * (u_levels - 1.0) + 0.5) / (u_levels - 1.0);
        }`)
  }
  return material
}

// The character's meshes. bust: the clip has no hips (close-up), so the torso hangs straight
// down from the shoulders, follows the shoulder line, and runs off the bottom of the frame.
export function createCharacter(target: Target, c: Character, sw: number, { bust = false } = {}) {
  target.setPixelSize?.(c.pixelSize)
  // vertex snapping: one grid cell per drawn pixel of the canvas
  const snapGrid = target.renderer.getDrawingBufferSize(new THREE.Vector2())
  const material = retroMaterial(c, target, snapGrid)
  const seg = c.lowPoly ? 0.25 : 1
  const geometries = new Set<THREE.BufferGeometry>()
  const meshes: THREE.Mesh[] = []
  const mesh = (g: THREE.BufferGeometry) => {
    geometries.add(g)
    const m = new THREE.Mesh(g, material)
    target.scene.add(m)
    meshes.push(m)
    return m
  }
  const UP = new THREE.Vector3(0, 1, 0), DOWN = new THREE.Vector3(0, -1, 0)
  const dir = new THREE.Vector3(), sh = new THREE.Vector3(), hip = new THREE.Vector3(), across = new THREE.Vector3()
  const sphere = (r: number) => new THREE.SphereGeometry(r, Math.max(6, 32 * seg), Math.max(4, 20 * seg))

  // a chain of joints: open cylinders between them (scaled only along their length, so no
  // squashed caps) with a sphere at each joint to round it off
  const limb = (radius: number, radii: number[]) => {
    const boneGeo = new THREE.CylinderGeometry(radius, radius, 1, Math.max(5, 24 * seg), 1, true)
    const joints = radii.map(r => mesh(sphere(r)))
    const bones = radii.slice(1).map(() => mesh(boneGeo))
    return (points: THREE.Vector3[]) => {
      points.forEach((p, i) => joints[i].position.copy(p))
      bones.forEach((bone, i) => {
        const a = points[i], b = points[i + 1]
        dir.subVectors(b, a)
        bone.position.addVectors(a, b).multiplyScalar(0.5)
        bone.scale.set(1, dir.length(), 1)
        bone.quaternion.setFromUnitVectors(UP, dir.normalize())
      })
    }
  }

  const headR = c.headSize * sw, armR = c.armThickness * sw, legR = c.legThickness * sw
  const head = mesh(sphere(headR))

  // torso: revolved profile, shoulder line at y = 0, hips at y = -length; rounded cap on top
  const r = c.torsoWidth * sw, cap = 0.16 * sw
  const length = bust ? 6 * sw : 1   // full body: unit length, stretched to the spine each frame
  const profile = [[0, cap], [0.5 * r, 0.9 * cap], [0.85 * r, 0.4 * cap], [r, -0.12 * sw]]
    .concat(bust
      ? [[r * 1.02, -length]]
      : [[0.94 * r, -0.6], [0.9 * r, -0.92], [0.62 * r, -1.06], [0, -1.1]])
    .map(([x, y]) => new THREE.Vector2(x, y))
  const torso = mesh(new THREE.LatheGeometry(profile, Math.max(6, 40 * seg)))

  const hand = [armR, armR, armR * c.handSize]
  const arms = [limb(armR, hand), limb(armR, hand)]
  const legs = bust ? [] : [limb(legR, [legR, legR, legR * 0.9, legR * 0.7]), limb(legR, [legR, legR, legR * 0.9, legR * 0.7])]

  // pull limb roots in a little so they grow out of the torso, not off its edge
  const inward = (p: THREE.Vector3, mid: THREE.Vector3) => p.clone().lerp(mid, 0.15)

  const update = (p: Pose) => {
    sh.addVectors(p.ls!, p.rs!).multiplyScalar(0.5)
    head.position.copy(p.head!)
    if (bust) {
      across.subVectors(p.rs!, p.ls!)
      torso.position.set(sh.x, sh.y, sh.z - r * 0.5)
      torso.scale.set(1, 1, 1)
      torso.rotation.set(0, Math.atan2(-across.z, across.x), Math.atan2(across.y, across.x))
    } else {
      hip.addVectors(p.lh!, p.rh!).multiplyScalar(0.5)
      dir.subVectors(hip, sh)
      torso.position.copy(sh)
      torso.scale.set(1, dir.length(), 1)
      torso.quaternion.setFromUnitVectors(DOWN, dir.normalize())
      legs[0]([inward(p.lh!, hip), p.lk!, p.la!, p.lf!])
      legs[1]([inward(p.rh!, hip), p.rk!, p.ra!, p.rf!])
    }
    arms[0]([inward(p.ls!, sh), p.le!, p.lw!])
    arms[1]([inward(p.rs!, sh), p.re!, p.rw!])
  }

  const dispose = () => {
    meshes.forEach(m => target.scene.remove(m))
    geometries.forEach(g => g.dispose())
    material.dispose()
  }
  return { update, dispose, headR, material }
}
