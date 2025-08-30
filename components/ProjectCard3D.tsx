'use client'

import { useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { Project } from '@/types'

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
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Animation
  useFrame((state) => {
    if (meshRef.current && groupRef.current) {
      const time = state.clock.elapsedTime + animationDelay
      
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3
      
      // Rotation based on interaction
      if (hovered) {
        meshRef.current.rotation.y = Math.sin(time * 2) * 0.1
        meshRef.current.scale.setScalar(1.05)
      } else {
        meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.02
        meshRef.current.scale.setScalar(1)
      }
      
      // Click animation
      if (clicked) {
        meshRef.current.scale.setScalar(0.95)
      }
    }
  })

  const handleClick = (event: any) => {
    event.stopPropagation()
    setClicked(true)
    setTimeout(() => setClicked(false), 150)
    onClick(project)
  }

  const handlePointerOver = (event: any) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (event: any) => {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  // Get project image or use placeholder
  const imageUrl = project.metadata?.image?.imgix_url
  const hasImage = Boolean(imageUrl)

  return (
    <group 
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
    >
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        {/* Card base */}
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial 
          color={project.metadata?.color || '#1f2937'}
          metalness={0.1}
          roughness={0.2}
          transparent
          opacity={hovered ? 0.9 : 0.8}
        />
        
        {/* Project image or placeholder */}
        <mesh position={[0, 0.3, 0.051]}>
          <planeGeometry args={[2.6, 1.2]} />
          {hasImage ? (
            <meshStandardMaterial transparent opacity={0.9}>
              <primitive 
                attach="map" 
                object={useLoader(TextureLoader, `${imageUrl}?w=400&h=240&fit=crop&auto=format`)} 
              />
            </meshStandardMaterial>
          ) : (
            <meshStandardMaterial 
              color="#374151" 
              transparent 
              opacity={0.6}
            />
          )}
        </mesh>
        
        {/* Project title */}
        <Text
          position={[0, -0.5, 0.051]}
          fontSize={0.2}
          maxWidth={2.5}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff"
          color="#ffffff"
        >
          {project.title}
        </Text>
        
        {/* Technology tags */}
        {project.metadata?.technologies && project.metadata.technologies.length > 0 && (
          <Text
            position={[0, -0.8, 0.051]}
            fontSize={0.12}
            maxWidth={2.5}
            lineHeight={1}
            letterSpacing={0.01}
            textAlign="center"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff"
            color="#9ca3af"
          >
            {project.metadata.technologies.slice(0, 3).join(' • ')}
          </Text>
        )}
      </mesh>
      
      {/* Hover tooltip */}
      {hovered && (
        <Html
          position={[0, 1.5, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-w-xs">
            <h3 className="font-semibold text-foreground mb-1">{project.title}</h3>
            {project.metadata?.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.metadata.description}
              </p>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}