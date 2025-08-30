'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { Project } from '@/types'
import SceneEnvironment from './SceneEnvironment'
import ProjectsGrid from './ProjectsGrid'
import CameraController from './CameraController'

interface Scene3DProps {
  projects: Project[]
}

export default function Scene3D({ projects }: Scene3DProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Ensure we're fully mounted before initializing 3D components
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing 3D scene...</p>
        </div>
      </div>
    )
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    // Dispatch custom event for modal
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projectSelected', { detail: project }))
    }
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 5, 15], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false
        }}
        dpr={typeof window !== 'undefined' ? [1, Math.min(window.devicePixelRatio, 2)] : [1, 2]}
        shadows
        frameloop="always"
        onCreated={(state) => {
          // Ensure WebGL context is properly initialized
          if (typeof window !== 'undefined') {
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          }
          // Disable color management to prevent React fiber issues
          state.gl.outputColorSpace = 'srgb'
        }}
      >
        <Suspense fallback={null}>
          {/* Scene environment */}
          <SceneEnvironment />
          
          {/* Projects grid */}
          <ProjectsGrid 
            projects={projects} 
            onProjectClick={handleProjectClick}
          />
          
          {/* Camera controls */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  )
}