'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { markBooted } from '@/lib/boot'

// Ported from ../depthmap/parallax-demo: the forest photo displaced by its depth map, duotone
// filter cycling purple <-> red, and glowing wisps ("fairies") flying in and out of the trees.

const COLOR_URL = '/scenes/forest/color.avif'
const DEPTH_URL = '/scenes/forest/depth.png'

const STRENGTH = 0.04   // cursor parallax amount
const TINT = 0.5        // 0 = photo, 1 = full duotone
const DITHER = 4        // ordered dither, levels per channel (0 = off)
const PAN = 0.06, TILT = 0.08   // scroll: image slides / near things shift more than far
const RENDER_SCALE = 0.5        // canvas pixels per CSS pixel; upscaled without smoothing

// Vignette: black, over everything in the canvas (photo, wisps, crystals), with the same 4x4
// ordered dither as the photo so the gradient stays pixelly
const VIGNETTE = 0.85                  // darkness at the corners, 0..1
const VIGNETTE_START = 0.45            // where it begins: 0 = centre, 1 = edge midpoints

const VIGNETTE_FRAG = `
uniform vec2 u_buf;
void main() {
  vec2 q = (gl_FragCoord.xy / u_buf - 0.5) * 2.0;   // -1..1 across the screen, corners ~1.41
  float a = smoothstep(${VIGNETTE_START.toFixed(2)}, 1.45, length(q)) * ${VIGNETTE.toFixed(2)};
  const mat4 BAYER = mat4(0.,8.,2.,10., 12.,4.,14.,6., 3.,11.,1.,9., 15.,7.,13.,5.) / 16.;
  ivec2 p = ivec2(gl_FragCoord.xy) % 4;
  a = floor(a * ${DITHER - 1}.0 + BAYER[p.x][p.y]) / ${DITHER - 1}.0;   // dithered to the photo's levels
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}`

// Boot: the screen starts black behind the grid lines, then each grid cell switches on like a
// display (flicker, flash, settle), spreading from the top-left corner: slow at first, then
// accelerating across the screen (the front grows exponentially). Cells are computed in CSS px
// from the drifting .grid-overlay's own animation clock, so they line up with its lines.
const BOOT_SPREAD = 1.3     // s, corner-to-corner delay
const BOOT_GROWTH = 25      // how sharply the spread accelerates
const BOOT_RANDOM = 0.25    // s, extra random delay per cell
const BOOT_FLICKER = 0.18   // s of flicker before a cell holds
const BOOT_END = BOOT_SPREAD + BOOT_RANDOM + BOOT_FLICKER + 0.6
const GRID_LOOP_MS = 3000   // .grid-overlay drifts one cell per loop (globals.css)

const BOOT_FRAG = `
uniform vec2 u_buf, u_view, u_off;
uniform float u_ratio, u_cell, u_t;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 css = vec2(gl_FragCoord.x, u_buf.y - gl_FragCoord.y) / u_ratio;   // CSS px, y down
  vec2 cell = floor((css - u_off) / u_cell);
  // distance from the top-left (0..1 across the diagonal); time = log(1 + k d) makes the front
  // crawl out of the corner and then race across
  float d = length((cell + 0.5) * u_cell + u_off) / length(u_view);
  float delay = log(1.0 + ${BOOT_GROWTH.toFixed(1)} * d) / log(${(BOOT_GROWTH + 1).toFixed(1)}) * ${BOOT_SPREAD.toFixed(2)} + hash(cell) * ${BOOT_RANDOM.toFixed(2)};
  float tt = u_t - delay;
  float off = 1.0, flash = 0.0;
  if (tt >= ${BOOT_FLICKER.toFixed(2)}) { off = 0.0; flash = exp(-(tt - ${BOOT_FLICKER.toFixed(2)}) * 10.0) * 0.5; }
  else if (tt >= 0.0) { off = step(0.45, hash(cell + floor(tt * 40.0))); flash = (1.0 - off) * 0.4; }
  gl_FragColor = off > 0.5 ? vec4(0.0, 0.0, 0.0, 1.0) : vec4(1.0, 1.0, 1.0, flash);
}`

// Background: the photo, displaced by the depth map. It also writes the depth map into the
// depth buffer, so the wisps are hidden wherever the scene is nearer than they are.
const VERT = `
in vec3 position;
in vec2 uv;
out vec2 v_uv;
void main() {
  v_uv = vec2(uv.x, 1.0 - uv.y);
  gl_Position = vec4(position.xy, 0, 1);
}`

const FRAG = `
precision highp float;
uniform sampler2D u_color, u_depth;
uniform vec2 u_offset, u_resolution;
uniform float u_pan, u_tint, u_cycle, u_dither;
in vec2 v_uv;
out vec4 fragColor;

vec3 ramp(vec3 s[5], float x) {
  float p = clamp(x, 0.0, 1.0) * 4.0;
  int i = min(int(p), 3);
  return mix(s[i], s[i + 1], p - float(i)) / 255.0;
}

// dark -> bright
const vec3 PURPLE[5] = vec3[5](vec3(12,4,28), vec3(60,16,110), vec3(140,50,190), vec3(205,130,240), vec3(245,225,255));
const vec3 RED[5]    = vec3[5](vec3(24,2,6), vec3(100,10,20), vec3(190,30,40), vec3(245,110,90), vec3(255,225,215));

const mat4 BAYER = mat4(0.,8.,2.,10., 12.,4.,14.,6., 3.,11.,1.,9., 15.,7.,13.,5.) / 16.;

void main() {
  // cover-fit the image to the viewport, with a little zoom so edges never show
  vec2 img = vec2(textureSize(u_color, 0));
  float ri = img.x / img.y, rf = u_resolution.x / u_resolution.y;
  vec2 uv = v_uv - 0.5;
  if (rf > ri) uv.y *= ri / rf; else uv.x *= rf / ri;
  uv = uv * 0.92 + 0.5;
  uv.y += u_pan;   // scroll pans the whole image

  float depth = texture(u_depth, uv).r;   // white = near
  vec2 suv = uv + u_offset * depth;
  vec3 col = texture(u_color, suv).rgb;

  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 tint = mix(ramp(PURPLE, luma), ramp(RED, luma), u_cycle);
  col = mix(col, tint, u_tint);  // duotone: photo brightness -> colour ramp

  // 4x4 Bayer: nudge each pixel by its matrix threshold, then quantise to u_dither levels
  if (u_dither > 1.0) {
    float step = 1.0 / (u_dither - 1.0);
    ivec2 p = ivec2(gl_FragCoord.xy) % 4;
    col += (BAYER[p.x][p.y] - 0.5) * step;
    col = floor(col * (u_dither - 1.0) + 0.5) / (u_dither - 1.0);
  }

  fragColor = vec4(col, 1);
  gl_FragDepth = 1.0 - texture(u_depth, suv).r;   // near = 0, far = 1
}`

// Wisps: glowing points on looping paths, diving in and out of depth so they pass behind trunks.
// Each one draws a fading trail made of its own position sampled a little back in time.
const WISP_COUNT = 10, TRAIL = 32, TRAIL_DT = 0.018

const WISP_VERT = `
attribute float a_size, a_alpha;
uniform float u_px;
varying float v_alpha;
void main() {
  v_alpha = a_alpha;
  gl_PointSize = a_size * u_px;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const WISP_FRAG = `
uniform vec3 u_color;
varying float v_alpha;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float glow = exp(-d * d * 5.0) * (1.0 - d);
  float core = smoothstep(0.35, 0.0, d);
  gl_FragColor = vec4(mix(u_color, vec3(1.0), core) * glow * v_alpha, 1.0);
}`

type Wisp = { f: number[]; p: number[]; pulse: number }

// Heavily blurred depth map: the rough shape of the scene with thin things (trunks, branches)
// averaged away. Wisps fly relative to it, so they hug the scene and slip behind thin near objects.
function smoothDepthSampler(depthImg: HTMLImageElement | ImageBitmap) {
  const c = document.createElement('canvas')
  c.width = 32
  c.height = Math.max(1, Math.round((32 * depthImg.height) / depthImg.width))
  const ctx = c.getContext('2d')!
  ctx.filter = 'blur(3px)'
  ctx.drawImage(depthImg, 0, 0, c.width, c.height)
  const px = ctx.getImageData(0, 0, c.width, c.height).data
  const at = (i: number, j: number) =>
    px[(Math.min(Math.max(j, 0), c.height - 1) * c.width + Math.min(Math.max(i, 0), c.width - 1)) * 4] / 255
  return (x: number, y: number) => {   // bilinear, so z changes smoothly along a path
    const fx = x * c.width - 0.5, fy = y * c.height - 0.5
    const i = Math.floor(fx), j = Math.floor(fy), a = fx - i, b = fy - j
    return (at(i, j) * (1 - a) + at(i + 1, j) * a) * (1 - b) + (at(i, j + 1) * (1 - a) + at(i + 1, j + 1) * a) * b
  }
}

// two sines per axis with random frequencies/phases -> looping but irregular flight
function makeWisp(): Wisp {
  const r = (a: number, b: number) => a + Math.random() * (b - a)
  return {
    f: [r(0.25, 0.6), r(0.9, 1.8), r(0.2, 0.5), r(0.8, 1.6), r(0.15, 0.4)],
    p: Array.from({ length: 5 }, () => r(0, 6.28)),
    pulse: r(0, 6.28),
  }
}

function wispAt(w: Wisp, t: number, smoothDepth: (x: number, y: number) => number) {
  const { f, p } = w
  const x = 0.5 + 0.36 * Math.sin(t * f[0] + p[0]) + 0.09 * Math.sin(t * f[1] + p[1])
  const y = 0.45 + 0.24 * Math.sin(t * f[2] + p[2]) + 0.07 * Math.sin(t * f[3] + p[3])
  // from a little behind the scene's rough surface to well in front of it
  const z = Math.min(Math.max(smoothDepth(x, y) + 0.08 + 0.16 * Math.sin(t * f[4] + p[4]), 0.02), 0.98)
  return [x, y, z] as const
}

// Image uv (after parallax shift) -> world position, inverting the background's cover-fit.
function imageToWorld(qx: number, qy: number, imgAspect: number, aspect: number) {
  let fx = 1, fy = 1
  if (aspect > imgAspect) fy = imgAspect / aspect
  else fx = aspect / imgAspect
  const vx = (qx - 0.5) / (fx * 0.92) + 0.5
  const vy = (qy - 0.5) / (fy * 0.92) + 0.5
  return [(vx * 2 - 1) * aspect, 1 - vy * 2] as const
}

// 0 = purple, 1 = red: hold 30s, fade 15s, hold 30s, fade 15s, repeat
const HOLD = 30, FADE = 15
function colourCycle(t: number) {
  t %= 2 * (HOLD + FADE)
  const ease = (x: number) => x * x * (3 - 2 * x)
  if (t < HOLD) return 0
  if (t < HOLD + FADE) return ease((t - HOLD) / FADE)
  if (t < 2 * HOLD + FADE) return 1
  return 1 - ease((t - 2 * HOLD - FADE) / FADE)
}
// Fairies: every wisp carries a small spinning crystal that glitches on purpose: its vertices
// snap to a coarse screen grid and hop by random amounts a few times a second. The shape is
// non-indexed (each face has its own corners), so faces jitter apart into shards.
const FAIRY_PX = 24        // crystal size on screen at mid depth
const FAIRY_SNAP_PX = 4    // snap grid cell, CSS px
const FAIRY_JITTER = 1.5   // max random hop, in grid cells
const FAIRY_RATE = 8       // jitter re-rolls per second

const FAIRY_VERT_HEAD = `
uniform vec2 u_grid;
uniform float u_time;`
const FAIRY_VERT_GLITCH = `
{
  float seed = float(gl_VertexID) + float(gl_InstanceID) * 37.0 + floor(u_time * ${FAIRY_RATE.toFixed(1)}) * 101.0;
  vec2 hop = vec2(fract(sin(seed * 12.9898) * 43758.5453), fract(sin(seed * 78.233) * 43758.5453)) - 0.5;
  gl_Position.xy += hop * ${FAIRY_JITTER.toFixed(2)} * (2.0 / u_grid) * gl_Position.w;
  gl_Position.xy = floor(gl_Position.xy / gl_Position.w * u_grid * 0.5 + 0.5) / (u_grid * 0.5) * gl_Position.w;
}`

const DECOR_PURPLE = new THREE.Color('#cd82f0')
const DECOR_RED = new THREE.Color('#f56e5a')

export default function ForestScene() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current!
    let disposed = false

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const touch = matchMedia('(pointer: coarse)').matches
    renderer.setPixelRatio(RENDER_SCALE)
    host.appendChild(renderer.domElement)

    // Orthographic camera looking down -z with near 0 / far 1, so a point at z = -(1 - d)
    // lands at depth-buffer value 1 - d, the same scale the background writes.
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const scene = new THREE.Scene()

    const bgMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        u_color: { value: null }, u_depth: { value: null },
        u_offset: { value: new THREE.Vector2() }, u_pan: { value: 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_tint: { value: TINT }, u_cycle: { value: 0 }, u_dither: { value: DITHER },
      },
    })
    const bgGeo = new THREE.PlaneGeometry(2, 2)
    const bg = new THREE.Mesh(bgGeo, bgMaterial)
    bg.frustumCulled = false
    bg.renderOrder = -1
    scene.add(bg)

    const gridEl = document.querySelector<HTMLElement>('.grid-overlay')
    const bootUniforms = {
      u_buf: { value: new THREE.Vector2() }, u_view: { value: new THREE.Vector2() }, u_off: { value: new THREE.Vector2() },
      u_ratio: { value: RENDER_SCALE }, u_cell: { value: 48 }, u_t: { value: 0 },
    }
    const bootMaterial = new THREE.ShaderMaterial({
      uniforms: bootUniforms,
      vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: BOOT_FRAG,
      transparent: true, depthTest: false, depthWrite: false,
    })
    const vignetteMaterial = new THREE.ShaderMaterial({
      uniforms: { u_buf: bootUniforms.u_buf },
      vertexShader: 'void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: VIGNETTE_FRAG,
      transparent: true, depthTest: false, depthWrite: false,
    })
    const vignette = new THREE.Mesh(bgGeo, vignetteMaterial)
    vignette.frustumCulled = false
    vignette.renderOrder = 998   // after the scene, under the boot cells
    scene.add(vignette)

    const boot = new THREE.Mesh(bgGeo, bootMaterial)
    boot.frustumCulled = false
    boot.renderOrder = 999
    scene.add(boot)

    const wispGeo = new THREE.BufferGeometry()
    wispGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(WISP_COUNT * TRAIL * 3), 3))
    wispGeo.setAttribute('a_size', new THREE.BufferAttribute(new Float32Array(WISP_COUNT * TRAIL), 1))
    wispGeo.setAttribute('a_alpha', new THREE.BufferAttribute(new Float32Array(WISP_COUNT * TRAIL), 1))
    const wispColor = new THREE.Vector3(1, 1, 1)   // sRGB, the shader writes it straight out
    const wispMaterial = new THREE.ShaderMaterial({
      uniforms: { u_color: { value: wispColor }, u_px: { value: 1 } },
      vertexShader: WISP_VERT,
      fragmentShader: WISP_FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const wispLayer = new THREE.Points(wispGeo, wispMaterial)
    wispLayer.frustumCulled = false
    scene.add(wispLayer)
    const wisps = Array.from({ length: WISP_COUNT }, makeWisp)

    // fairies need light: studio reflections plus a key light (the photo and wisps ignore both)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    const key = new THREE.DirectionalLight(0xffffff, 2)
    key.position.set(-1, 2, 3)
    scene.add(key)
    const fairyUniforms = { u_grid: { value: new THREE.Vector2(1, 1) }, u_time: { value: 0 } }
    const fairyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6, roughness: 0.3, flatShading: true })
    fairyMaterial.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, fairyUniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>' + FAIRY_VERT_HEAD)
        .replace('#include <project_vertex>', '#include <project_vertex>' + FAIRY_VERT_GLITCH)
    }
    const fairyGeo = new THREE.OctahedronGeometry(1, 0)
    const fairyMesh = new THREE.InstancedMesh(fairyGeo, fairyMaterial, WISP_COUNT)
    fairyMesh.frustumCulled = false
    scene.add(fairyMesh)
    const spins = wisps.map(() => ({ axis: new THREE.Vector3().randomDirection(), speed: 1 + Math.random() * 2 }))
    const fairyMatrix = new THREE.Matrix4(), fairyQuat = new THREE.Quaternion(), fairyPos = new THREE.Vector3(), fairyScale = new THREE.Vector3()

    // mouse target + eased current value
    const target = { x: 0.5, y: 0.5 }, mouse = { x: 0.5, y: 0.5 }
    let turbo = 0, turboTarget = 0
    let scroll = 0.5   // eased scroll progress, 0 = top, 1 = bottom

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return   // touch drags scroll the page; tilt drives touch instead
      target.x = e.clientX / innerWidth
      target.y = e.clientY / innerHeight
    }
    // hold mouse = turbo
    const onPointerDown = (e: PointerEvent) => { if (e.pointerType !== 'touch') turboTarget = 1 }
    const onPointerUp = () => { turboTarget = 0 }
    // Touch devices: tilting the phone moves the view. iOS needs a permission prompt from a tap.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      target.x = Math.min(Math.max(0.5 + e.gamma / 60, 0), 1)          // left/right, ±30°
      target.y = Math.min(Math.max(0.5 + (e.beta - 45) / 60, 0), 1)    // around a 45° hold
    }
    const requestTilt = () => {
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
      DOE.requestPermission?.().then(r => r === 'granted' && addEventListener('deviceorientation', onTilt))
    }

    addEventListener('pointermove', onPointerMove)
    addEventListener('pointerdown', onPointerDown)
    addEventListener('pointerup', onPointerUp)
    if (touch) {
      if ('requestPermission' in DeviceOrientationEvent) addEventListener('click', requestTilt, { once: true })
      else addEventListener('deviceorientation', onTilt)
    }

    const resize = () => {
      renderer.setSize(innerWidth, innerHeight)
      const aspect = innerWidth / innerHeight
      camera.left = -aspect
      camera.right = aspect
      camera.updateProjectionMatrix()
      renderer.getDrawingBufferSize(bgMaterial.uniforms.u_resolution.value)
      renderer.getDrawingBufferSize(bootUniforms.u_buf.value)
      bootUniforms.u_view.value.set(innerWidth, innerHeight)
      if (gridEl) bootUniforms.u_cell.value = parseFloat(getComputedStyle(gridEl).getPropertyValue('--cell')) || 48
      fairyUniforms.u_grid.value.set(innerWidth / FAIRY_SNAP_PX, innerHeight / FAIRY_SNAP_PX)
    }
    addEventListener('resize', resize)
    resize()

    const loadTexture = (url: string) =>
      new THREE.TextureLoader().loadAsync(url).then(t => {
        t.flipY = false
        t.minFilter = t.magFilter = THREE.LinearFilter
        t.generateMipmaps = false
        return t
      })

    let textures: THREE.Texture[] = []
    Promise.all([loadTexture(COLOR_URL), loadTexture(DEPTH_URL)]).then(async ([colorTex, depthTex]) => {
      textures = [colorTex, depthTex]
      if (disposed) return textures.forEach(t => t.dispose())
      const u = bgMaterial.uniforms
      u.u_color.value = colorTex
      u.u_depth.value = depthTex
      // upload the textures and compile every shader before the first frame (in parallel where
      // the browser supports it), so the boot sweep doesn't stall on them
      renderer.initTexture(colorTex)
      renderer.initTexture(depthTex)
      await renderer.compileAsync(scene, camera)
      if (disposed) return
      const imgAspect = colorTex.image.width / colorTex.image.height
      const smoothDepth = smoothDepthSampler(depthTex.image)

      const decorColor = new THREE.Color()
      const decorSRGB = { r: 0, g: 0, b: 0 }
      const pos = wispGeo.attributes.position.array as Float32Array
      const size = wispGeo.attributes.a_size.array as Float32Array
      const alpha = wispGeo.attributes.a_alpha.array as Float32Array
      const timer = new THREE.Timer()
      document.documentElement.dataset.ready = ''   // starts the UI fade-in (globals.css)

      renderer.setAnimationLoop(time => {
        timer.update(time)
        const dt = Math.min(timer.getDelta(), 0.05)
        const t = timer.getElapsed()
        const k = 1 - Math.exp(-8 * dt)   // frame-rate independent easing
        mouse.x += (target.x - mouse.x) * k
        mouse.y += (target.y - mouse.y) * k
        turbo += (turboTarget - turbo) * (1 - Math.exp(-4 * dt))
        const scrollTarget = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)
        scroll += (scrollTarget - scroll) * (1 - Math.exp(-6 * dt))
        const pan = (scroll - 0.5) * PAN

        const strength = STRENGTH * (1 + turbo * 3)
        const ox = (mouse.x * 2 - 1) * strength + Math.sin(t * 0.8) * 0.004   // + idle drift
        const oy = (mouse.y * 2 - 1) * strength + Math.cos(t * 0.6) * 0.003 + (scroll - 0.5) * TILT
        const cycle = colourCycle(t)

        u.u_offset.value.set(ox, oy)
        u.u_pan.value = pan
        u.u_cycle.value = cycle
        decorColor.copy(DECOR_PURPLE).lerp(DECOR_RED, cycle).getRGB(decorSRGB, THREE.SRGBColorSpace)
        wispColor.set(decorSRGB.r, decorSRGB.g, decorSRGB.b)
        wispMaterial.uniforms.u_px.value = renderer.getPixelRatio()

        // scene content at depth d appears shifted by -offset*d; wisps follow the same rule
        const aspect = innerWidth / innerHeight
        wisps.forEach((w, i) => {
          for (let j = 0; j < TRAIL; j++) {
            const [x, y, z] = wispAt(w, t - j * TRAIL_DT, smoothDepth)
            const [wx, wy] = imageToWorld(x - ox * z, y - oy * z - pan, imgAspect, aspect)
            const n = i * TRAIL + j, fade = 1 - j / TRAIL
            pos.set([wx, wy, -(1 - z)], n * 3)
            // the head glow is a halo around the crystal, small enough that the crystal reads
            size[n] = (j === 0 ? 40 : 26 * fade) * (0.4 + z)   // nearer = bigger
            alpha[n] = j === 0 ? 1.1 : 0.8 * fade * fade
          }
          // crystal on the wisp's head: nearer = bigger, stretched a little, spinning
          const z = 1 + pos[i * TRAIL * 3 + 2]
          const r = (FAIRY_PX * (0.4 + z)) / innerHeight
          fairyQuat.setFromAxisAngle(spins[i].axis, t * spins[i].speed)
          fairyMatrix.compose(fairyPos.fromArray(pos, i * TRAIL * 3), fairyQuat, fairyScale.set(r, r * 1.5, r))
          fairyMesh.setMatrixAt(i, fairyMatrix)
        })
        fairyMesh.instanceMatrix.needsUpdate = true
        fairyMaterial.emissive.copy(decorColor)
        fairyUniforms.u_time.value = t

        if (boot.visible) {
          // follow the grid's drift: its background moves from 0 to one cell per loop
          const ms = Number(gridEl?.getAnimations()[0]?.currentTime ?? 0)
          bootUniforms.u_off.value.setScalar(((ms % GRID_LOOP_MS) / GRID_LOOP_MS) * bootUniforms.u_cell.value)
          bootUniforms.u_t.value = t
          if (t >= BOOT_END) { boot.visible = false; markBooted() }   // lets the figure canvases start
        }
        for (const a of ['position', 'a_size', 'a_alpha']) wispGeo.attributes[a].needsUpdate = true

        renderer.render(scene, camera)
      })
    })

    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      removeEventListener('pointermove', onPointerMove)
      removeEventListener('pointerdown', onPointerDown)
      removeEventListener('pointerup', onPointerUp)
      removeEventListener('deviceorientation', onTilt)
      removeEventListener('click', requestTilt)
      removeEventListener('resize', resize)
      textures.forEach(t => t.dispose())
      bgGeo.dispose()
      bgMaterial.dispose()
      bootMaterial.dispose()
      vignetteMaterial.dispose()
      wispGeo.dispose()
      wispMaterial.dispose()
      fairyGeo.dispose()
      fairyMaterial.dispose()
      env.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} aria-hidden className="fixed inset-0 z-0 [&>canvas]:block [&>canvas]:[image-rendering:pixelated]" />
}
