'use client'

import { useRef } from 'react'
import { Environment, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

export default function SceneEnvironment() {
  const starsRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += delta * 0.02
      starsRef.current.rotation.y += delta * 0.01
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#4a5568" />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.5}
        color="#4299e1"
      />

      {/* Point lights for cosmic effect */}
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#667eea" />
      <pointLight position={[20, 10, -10]} intensity={0.6} color="#764ba2" />
      <pointLight position={[-20, -10, 10]} intensity={0.4} color="#f093fb" />

      {/* Environment with cosmic city preset - removed ref prop */}
      <Environment
        preset="city"
        background={false}
        blur={0.8}
        intensity={0.6}
      />

      {/* Animated stars */}
      <group ref={starsRef}>
        <Stars
          radius={300}
          depth={60}
          count={1000}
          factor={6}
          saturation={0.8}
          fade
          speed={0.5}
        />
      </group>

      {/* Cosmic fog effect */}
      <fog attach="fog" args={['#0f0f23', 30, 200]} />
    </>
  )
}