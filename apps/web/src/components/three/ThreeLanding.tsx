'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Float,
  MeshDistortMaterial,
  OrbitControls,
} from '@react-three/drei'
import { Suspense, useRef } from 'react'
import type { Mesh } from 'three'

function Blob() {
  const mesh = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.x += delta * 0.15
    mesh.current.rotation.y += delta * 0.2
  })

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.4, 64]} />
        <MeshDistortMaterial
          color="#e63329"
          roughness={0.15}
          metalness={0.6}
          distort={0.45}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

export default function ThreeLanding() {
  return (
    <section className="relative h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Blob />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
          three.js playground
        </p>
      </div>
    </section>
  )
}
