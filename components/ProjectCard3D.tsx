'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import { Project } from '@/types'
import * as THREE from 'three'

interface ProjectCard3DProps {
  project: Project
  position: [number, number, number]
  onClick: (project: Project) => void
  animationDelay?: number
}

export default function ProjectCard3D({ 
  project, 
  position, 
  onClick, 
  animationDelay = 0 
}: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const time = state.clock.elapsedTime + animationDelay
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2
      
      // Rotation on hover
      if (hovered) {
        meshRef.current.rotation.y += 0.01
      }
      
      // Scale animation
      const targetScale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const handleClick = () => {
    setClicked(true)
    onClick(project)
    setTimeout(() => setClicked(false), 200)
  }

  // Get project color from metadata or use default
  const projectColor = project.metadata?.color || '#4f46e5'

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.5, 3, 0.2]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : '#1f2937'}
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.1}
        />
        
        {/* Project image plane */}
        <mesh position={[0, 0.3, 0.11]}>
          <planeGeometry args={[2, 1.5]} />
          <meshBasicMaterial 
            color={projectColor}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Project title */}
        <Text
          position={[0, -0.8, 0.11]}
          fontSize={0.15}
          color={hovered ? projectColor : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          font="/fonts/inter-bold.woff"
        >
          {project.title}
        </Text>
        
        {/* Technologies */}
        {project.metadata?.technologies && project.metadata.technologies.length > 0 && (
          <Text
            position={[0, -1.1, 0.11]}
            fontSize={0.08}
            color="#9ca3af"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.2}
          >
            {project.metadata.technologies.slice(0, 3).join(' • ')}
          </Text>
        )}
        
        {/* Hover indicator */}
        {hovered && (
          <Html
            position={[0, 1.8, 0]}
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            <div className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Click to explore
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Glow effect when hovered */}
      {hovered && (
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[3, 3.5, 0.1]} />
          <meshBasicMaterial 
            color={projectColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}