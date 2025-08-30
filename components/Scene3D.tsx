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
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        shadows
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