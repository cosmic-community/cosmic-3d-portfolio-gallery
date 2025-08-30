'use client'

import { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import { Project } from '@/types'
import { Mesh, Vector3 } from 'three'

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
  const textRef = useRef<any>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  
  // Get camera reference for billboarding
  const { camera } = useThree()
  
  // Memoize the card color based on project metadata
  const cardColor = useMemo(() => {
    if (project.metadata?.color) {
      return project.metadata.color
    }
    
    // Default colors based on category
    const categoryColors = {
      'Web Application': '#3b82f6',
      'Mobile App': '#f59e0b', 
      '3D Project': '#8b5cf6',
      'Design': '#ec4899',
      'Other': '#6b7280'
    }
    
    const category = typeof project.metadata?.category === 'string' 
      ? project.metadata.category
      : project.metadata?.category?.value || 'Other'
    
    return categoryColors[category as keyof typeof categoryColors] || '#6b7280'
  }, [project.metadata?.color, project.metadata?.category])

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current || !textRef.current) return
    
    try {
      const time = state.clock.getElapsedTime()
      
      // Floating animation
      const floatY = Math.sin(time + animationDelay) * 0.1
      meshRef.current.position.y = position[1] + floatY
      
      // Subtle rotation when hovered
      if (hovered) {
        meshRef.current.rotation.y += 0.01
      } else {
        meshRef.current.rotation.y *= 0.95
      }
      
      // Scale animation when clicked
      if (clicked) {
        const scale = 1.1 + Math.sin(time * 8) * 0.05
        meshRef.current.scale.setScalar(scale)
      } else {
        const targetScale = hovered ? 1.05 : 1
        meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1)
      }
      
      // Billboard effect for text - make it always face the camera
      if (textRef.current && camera) {
        textRef.current.lookAt(camera.position)
      }
    } catch (error) {
      // Silently handle any animation errors to prevent console spam
    }
  })

  const handleClick = useCallback((event: any) => {
    event.stopPropagation()
    setClicked(true)
    
    // Reset click animation after delay
    setTimeout(() => setClicked(false), 200)
    
    // Trigger click callback
    onClick(project)
  }, [project, onClick])

  const handlePointerEnter = useCallback((event: any) => {
    event.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerLeave = useCallback((event: any) => {
    event.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
  }, [])

  // Truncate long titles
  const displayTitle = useMemo(() => {
    if (!project.title) return 'Untitled Project'
    return project.title.length > 20 
      ? project.title.substring(0, 17) + '...'
      : project.title
  }, [project.title])

  // Extract main technology for subtitle
  const mainTech = useMemo(() => {
    if (!project.metadata?.technologies || !Array.isArray(project.metadata.technologies)) {
      return 'Web Project'
    }
    return project.metadata.technologies[0] || 'Web Project'
  }, [project.metadata?.technologies])

  return (
    <group position={position}>
      {/* Main card geometry */}
      <RoundedBox
        ref={meshRef}
        args={[3, 2, 0.1]}
        radius={0.1}
        smoothness={4}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <meshStandardMaterial 
          color={cardColor}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Project title */}
      <Text
        ref={textRef}
        position={[0, 0.3, 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        maxWidth={2.5}
        lineHeight={1}
        letterSpacing={0.02}
      >
        {displayTitle}
      </Text>

      {/* Technology subtitle */}
      <Text
        position={[0, -0.1, 0.1]}
        fontSize={0.15}
        color="rgba(255,255,255,0.8)"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
        maxWidth={2.5}
      >
        {mainTech}
      </Text>

      {/* Featured indicator */}
      {project.metadata?.featured && (
        <mesh position={[1.2, 0.8, 0.1]}>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Subtle glow effect when hovered */}
      {hovered && (
        <RoundedBox
          args={[3.2, 2.2, 0.05]}
          radius={0.15}
          position={[0, 0, -0.05]}
        >
          <meshStandardMaterial 
            color={cardColor}
            transparent
            opacity={0.2}
            emissive={cardColor}
            emissiveIntensity={0.1}
          />
        </RoundedBox>
      )}
    </group>
  )
}