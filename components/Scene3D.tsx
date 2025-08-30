'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useMemo } from 'react'
import { Project } from '@/types'
import SceneEnvironment from './SceneEnvironment'
import ProjectsGrid from './ProjectsGrid'
import CameraController from './CameraController'

interface Scene3DProps {
  projects: Project[]
}

export default function Scene3D({ projects }: Scene3DProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    // Dispatch custom event for modal
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('projectSelected', { detail: project }))
    }
  }

  // Memoize camera settings to prevent unnecessary re-renders
  const cameraSettings = useMemo(() => ({
    position: [0, 5, 15] as [number, number, number],
    fov: 60,
    near: 0.1,
    far: 1000
  }), [])

  // Memoize gl settings to prevent unnecessary re-renders
  const glSettings = useMemo(() => ({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance" as const,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false
  }), [])

  return (
    <div className="w-full h-full">
      <Canvas
        camera={cameraSettings}
        gl={glSettings}
        dpr={[1, 2]}
        shadows={false}
        frameloop="demand"
        onCreated={(state) => {
          // Safe WebGL setup with error handling
          try {
            if (state.gl && state.gl.setPixelRatio) {
              state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            }
            if (state.gl && 'outputColorSpace' in state.gl) {
              state.gl.outputColorSpace = 'srgb'
            }
          } catch (error) {
            console.warn('WebGL setup warning:', error)
          }
        }}
      >
        <Suspense fallback={null}>
          <SceneEnvironment />
          <ProjectsGrid 
            projects={projects} 
            onProjectClick={handleProjectClick}
          />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  )
}