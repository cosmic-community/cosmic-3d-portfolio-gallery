'use client'

import { Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getProjects } from '@/lib/cosmic'
import { Project } from '@/types'
import LoadingScene from '@/components/LoadingScene'
import Navigation from '@/components/Navigation'
import ProjectModal from '@/components/ProjectModal'

// Dynamically import 3D components to prevent SSR issues
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => <LoadingScene />
})

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await getProjects()
        setProjects(loadedProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProjects()
  }, [])

  if (isLoading) {
    return <LoadingScene />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* 3D Scene */}
      <div className="absolute inset-0 w-full h-full">
        <Suspense fallback={<LoadingScene />}>
          <Scene3D projects={projects} />
        </Suspense>
      </div>
      
      {/* Project Modal - Client component will handle state */}
      <ProjectModal />
      
      {/* Overlay UI */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Use mouse to navigate • Click projects to explore</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{projects.length} Projects</span>
          </div>
        </div>
      </div>
    </div>
  )
}