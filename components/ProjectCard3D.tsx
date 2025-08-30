'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'
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
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { camera } = useThree()

  // Safely access project metadata with proper fallbacks
  const projectTitle = project.title || 'Untitled Project'
  const projectDescription = project.metadata?.description || ''
  const projectColor = project.metadata?.color || '#3b82f6'
  const projectTechnologies = Array.isArray(project.metadata?.technologies) 
    ? project.metadata.technologies 
    : []

  // Safe category access with proper type checking
  const getCategoryValue = (): string => {
    const category = project.metadata?.category
    if (category && typeof category === 'object' && category !== null && 'value' in category) {
      const categoryValue = (category as { value: unknown }).value
      if (typeof categoryValue === 'string') {
        return categoryValue
      }
    }
    return 'General'
  }

  const categoryValue = getCategoryValue()

  // Animation state
  const targetPosition = useMemo(() => new Vector3(...position), [position])
  const currentPosition = useMemo(() => new Vector3(...position), [position])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Smooth animation to target position
    currentPosition.lerp(targetPosition, delta * 2)
    meshRef.current.position.copy(currentPosition)

    // Hover animations
    if (hovered) {
      meshRef.current.scale.setScalar(1.1)
      meshRef.current.rotation.y += delta * 0.5
    } else {
      meshRef.current.scale.setScalar(1)
      meshRef.current.rotation.y += delta * 0.1
    }

    // Click animation
    if (clicked) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 8) * 0.1
    }

    // Look at camera effect
    const distance = camera.position.distanceTo(meshRef.current.position)
    if (distance < 15 && hovered) {
      meshRef.current.lookAt(camera.position)
    }
  })

  const handleClick = (event: any) => {
    event.stopPropagation()
    setClicked(true)
    setTimeout(() => setClicked(false), 200)
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
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={position}>
      {/* Main project card */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : projectColor}
          transparent
          opacity={hovered ? 0.9 : 0.8}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Project title */}
      <Text
        position={[0, 0.5, 0.11]}
        fontSize={0.3}
        color={hovered ? '#000000' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
        font="/fonts/inter-bold.woff"
      >
        {projectTitle}
      </Text>

      {/* Category badge */}
      <Text
        position={[0, -0.2, 0.11]}
        fontSize={0.15}
        color={hovered ? '#666666' : '#cccccc'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        {categoryValue}
      </Text>

      {/* Technology tags */}
      {projectTechnologies.length > 0 && (
        <Text
          position={[0, -0.6, 0.11]}
          fontSize={0.12}
          color={hovered ? '#888888' : '#aaaaaa'}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
          textAlign="center"
        >
          {projectTechnologies.slice(0, 3).join(' • ')}
          {projectTechnologies.length > 3 ? ' +' : ''}
        </Text>
      )}

      {/* Hover state HTML overlay */}
      {hovered && (
        <Html
          position={[0, -1.2, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="bg-black/80 text-white p-2 rounded max-w-xs text-xs">
            <p className="truncate">{projectDescription}</p>
            <p className="text-blue-300 mt-1">Click to view details</p>
          </div>
        </Html>
      )}

      {/* Glow effect when hovered */}
      {hovered && (
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.2, 2.2, 0.1]} />
          <meshStandardMaterial
            color={projectColor}
            transparent
            opacity={0.3}
            emissive={projectColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}