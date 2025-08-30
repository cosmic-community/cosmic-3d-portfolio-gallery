'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { Project } from '@/types'
import LoadingScene from '@/components/LoadingScene'
import Navigation from '@/components/Navigation'
import ProjectModal from '@/components/ProjectModal'
import dynamic from 'next/dynamic'

// Dynamically import Scene3D to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/Scene3D'), { 
  ssr: false,
  loading: () => <LoadingScene />
})

interface ClientPortfolioProps {
  projects: Project[]
}

export default function ClientPortfolio({ projects }: ClientPortfolioProps) {
  const [mounted, setMounted] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  const checkWebGL = useCallback(() => {
    try {
      if (typeof window === 'undefined') return false
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      canvas.remove()
      return !!gl
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    
    const initializeApp = async () => {
      try {
        // Check if we're in browser
        if (typeof window === 'undefined') return
        
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Check WebGL support
        const webglSupported = checkWebGL()
        
        if (!webglSupported) {
          if (isMounted) {
            setHasWebGL(false)
            setMounted(true)
          }
          return
        }
        
        if (isMounted) {
          setMounted(true)
        }
      } catch (error) {
        console.error('Initialization error:', error)
        if (isMounted) {
          setInitError('Failed to initialize 3D environment')
          setMounted(true)
        }
      }
    }

    initializeApp()
    
    return () => {
      isMounted = false
    }
  }, [checkWebGL])

  const handleRefresh = useCallback(() => {
    window.location.reload()
  }, [])

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <h2 className="text-3xl font-bold text-foreground">
            Initialization Error
          </h2>
          <p className="text-muted-foreground max-w-md">
            {initError}. Please refresh the page to try again.
          </p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  if (!hasWebGL && mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 p-8">
          <h2 className="text-3xl font-bold text-foreground">
            WebGL Not Supported
          </h2>
          <p className="text-muted-foreground max-w-md">
            Your browser doesn't support WebGL, which is required for the 3D portfolio. 
            Please use a modern browser or enable WebGL in your browser settings.
          </p>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return <LoadingScene />
  }

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
      
      {/* Project Modal */}
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