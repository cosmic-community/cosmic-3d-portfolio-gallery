'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Project } from '@/types'
import LoadingScene from '@/components/LoadingScene'
import Navigation from '@/components/Navigation'
import ProjectModal from '@/components/ProjectModal'

// Dynamically import 3D components to prevent SSR issues
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => <LoadingScene />
})

interface ClientPortfolioProps {
  projects: Project[]
}

export default function ClientPortfolio({ projects }: ClientPortfolioProps) {
  return (
    <>
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
    </>
  )
}