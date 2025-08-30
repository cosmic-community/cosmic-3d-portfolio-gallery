'use client'

import { Environment, Stars } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

export default function SceneEnvironment() {
  const starsRef = useRef<Group>(null)

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005
      starsRef.current.rotation.x += 0.0002
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#4f46e5"
      />
      
      {/* Point lights for accent */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.5}
        color="#8b5cf6"
        distance={20}
      />
      
      {/* Environment lighting */}
      <Environment
        preset="city"
        background={false}
        blur={0.8}
      />
      
      {/* Animated stars */}
      <group ref={starsRef}>
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </group>
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0f0f23', 30, 100]} />
    </>
  )
}