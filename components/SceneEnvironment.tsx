'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Stars } from '@react-three/drei'

export default function SceneEnvironment() {
  const envRef = useRef<any>(null)

  // Optimized environment settings
  const environmentConfig = useMemo(() => ({
    preset: 'city' as const,
    background: false,
    blur: 0.2,
    intensity: 0.6
  }), [])

  useFrame((state) => {
    // Subtle environment animation
    if (envRef.current) {
      envRef.current.rotation.y += 0.001
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#4a5568" />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#ffffff"
        castShadow={false}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.4}
        color="#818cf8"
      />
      
      {/* Point light for accents */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.5}
        color="#6366f1"
        distance={50}
        decay={2}
      />

      {/* Environment for reflections */}
      <Environment
        ref={envRef}
        {...environmentConfig}
      />
      
      {/* Background stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={1000} 
        factor={4} 
        saturation={0.5}
        fade
        speed={0.5}
      />
      
      {/* Background gradient */}
      <mesh position={[0, 0, -50]} scale={[100, 100, 1]}>
        <planeGeometry />
        <meshBasicMaterial 
          color="#0f0f23"
          transparent
          opacity={0.8}
        />
      </mesh>
    </>
  )
}