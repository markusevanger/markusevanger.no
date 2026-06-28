'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Punchy, saturated greens for a cartoon look — dark root, bright tip.
const TIP_GREEN = '#8fe05a'
const BASE_GREEN = '#2f8a33'
const CORE_GREEN = '#2f8a33'

const CORE_RADIUS = 1.3
const BLADE_RADIUS = 1.27 // sink blade bases slightly into the core
const BLADE_COUNT = 14000

// A single tapered, gently curved blade — base at origin, pointing +Y.
// uv.y runs 0 (base) → 1 (tip) and drives both wind bend and the color gradient.
function makeBladeGeometry() {
  const segments = 4
  const height = 0.32
  const width = 0.045
  const curve = 0.1 // baked forward arc

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const y = t * height
    const w = width * (1 - t * 0.85) // taper to a point
    const z = t * t * curve
    positions.push(-w, y, z, w, y, z)
    uvs.push(0, t, 1, t)
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2
    const b = i * 2 + 1
    const c = (i + 1) * 2
    const d = (i + 1) * 2 + 1
    indices.push(a, c, b, b, c, d)
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

function GrassGlobe() {
  const group = useRef<THREE.Group>(null)

  const { mesh, uniforms } = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uBase: { value: new THREE.Color(BASE_GREEN) },
      uTip: { value: new THREE.Color(TIP_GREEN) },
    }

    // Stepped gradient map → hard cel-shaded light bands.
    const steps = new Uint8Array([70, 140, 200, 255])
    const gradientMap = new THREE.DataTexture(steps, steps.length, 1, THREE.RedFormat)
    gradientMap.minFilter = THREE.NearestFilter
    gradientMap.magFilter = THREE.NearestFilter
    gradientMap.generateMipmaps = false
    gradientMap.needsUpdate = true

    const material = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap,
      side: THREE.DoubleSide,
    })

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.uniforms.uBase = uniforms.uBase
      shader.uniforms.uTip = uniforms.uTip

      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uTime;
           attribute float aPhase;
           varying float vH;`,
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           vH = uv.y;
           float bend = pow(uv.y, 1.5);
           vec4 wp = instanceMatrix * vec4(transformed, 1.0);
           float w1 = sin(uTime * 1.4 + aPhase + wp.x * 1.6 + wp.z * 1.3);
           float w2 = sin(uTime * 2.7 + aPhase * 1.7) * 0.4;
           float sway = (w1 + w2) * 0.07 * bend;
           transformed.x += sway;
           transformed.z += sway * 0.5;`,
        )

      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
           varying float vH;
           uniform vec3 uBase;
           uniform vec3 uTip;`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
           diffuseColor.rgb = mix(uBase, uTip, clamp(vH, 0.0, 1.0));`,
        )
    }

    const geom = makeBladeGeometry()
    const count = BLADE_COUNT
    const inst = new THREE.InstancedMesh(geom, material, count)

    const up = new THREE.Vector3(0, 1, 0)
    const normal = new THREE.Vector3()
    const spin = new THREE.Quaternion()
    const lean = new THREE.Quaternion()
    const leanAxis = new THREE.Vector3()
    const q = new THREE.Quaternion()
    const dummy = new THREE.Object3D()
    const golden = Math.PI * (3 - Math.sqrt(5))
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      normal.set(Math.cos(theta) * r, y, Math.sin(theta) * r).normalize()

      q.setFromUnitVectors(up, normal)
      spin.setFromAxisAngle(up, Math.random() * Math.PI * 2)
      q.multiply(spin)
      const a = Math.random() * Math.PI * 2
      leanAxis.set(Math.cos(a), 0, Math.sin(a))
      lean.setFromAxisAngle(leanAxis, Math.random() * 0.5)
      q.multiply(lean)

      const w = 0.6 + Math.random() * 0.5
      const h = 0.6 + Math.random() * 0.8
      dummy.position.copy(normal).multiplyScalar(BLADE_RADIUS)
      dummy.quaternion.copy(q)
      dummy.scale.set(w, h, w)
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)

      phases[i] = Math.random() * Math.PI * 2
    }
    inst.instanceMatrix.needsUpdate = true
    geom.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1))

    return { mesh: inst, uniforms }
  }, [])

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime
    if (group.current) group.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={group} rotation={[0.35, 0, 0]}>
      <mesh>
        <sphereGeometry args={[CORE_RADIUS, 64, 64]} />
        <meshToonMaterial color={CORE_GREEN} />
      </mesh>
      <primitive object={mesh} />
    </group>
  )
}

export default function WindowAnimation() {
  return (
    <div className="w-[320px] h-[320px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <hemisphereLight args={['#ffffff', '#2f5e2c', 0.6]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} />
        <GrassGlobe />
      </Canvas>
    </div>
  )
}
