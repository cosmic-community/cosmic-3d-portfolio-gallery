'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function SceneEnvironment() {
  const starsRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
      starsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4f46e5" />
      <pointLight position={[10, -10, 10]} intensity={0.3} color="#7c3aed" />
      
      {/* Stars background - simplified to avoid drei dependency issues */}
      <Stars
        ref={starsRef}
        radius={200}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* Floating geometric shapes - removed Float component to reduce drei dependencies */}
      <mesh position={[-15, 8, -10]} castShadow>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial 
          color="#4f46e5" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      <mesh position={[15, -5, -15]} castShadow>
        <tetrahedronGeometry args={[1.5]} />
        <meshStandardMaterial 
          color="#7c3aed" 
          transparent 
          opacity={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      <mesh position={[0, 12, -20]} castShadow>
        <icosahedronGeometry args={[0.8]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.25}
          roughness={0.1}
          metalness={0.7}
        />
      </mesh>
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0f0f23', 20, 100]} />
    </>
  )
}