'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
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
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        dpr={[1, 2]}
        shadows={false}
        frameloop="demand"
        onCreated={(state) => {
          // Safe WebGL setup
          try {
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            state.gl.outputColorSpace = 'srgb'
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