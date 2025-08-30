'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Github } from 'lucide-react'
import { Project } from '@/types'

export default function ProjectModal() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleProjectSelected = (event: any) => {
      const project = event.detail as Project
      setSelectedProject(project)
      setIsOpen(true)
    }

    window.addEventListener('projectSelected', handleProjectSelected)
    
    return () => {
      window.removeEventListener('projectSelected', handleProjectSelected)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  if (!isOpen || !selectedProject) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-card border border-border rounded-lg shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Project image */}
        {selectedProject.metadata?.image?.imgix_url && (
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <img
              src={`${selectedProject.metadata.image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
              alt={selectedProject.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Project content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {selectedProject.title}
            </h2>
            {selectedProject.metadata?.description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {selectedProject.metadata.description}
              </p>
            )}
          </div>

          {/* Technologies */}
          {selectedProject.metadata?.technologies && selectedProject.metadata.technologies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.metadata.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project links */}
          <div className="flex space-x-4">
            {selectedProject.metadata?.live_url && (
              <a
                href={selectedProject.metadata.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 cosmic-gradient text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Live</span>
              </a>
            )}
            
            {selectedProject.metadata?.github_url && (
              <a
                href={selectedProject.metadata.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Code</span>
              </a>
            )}
          </div>

          {/* Additional content if exists */}
          {selectedProject.content && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedProject.content }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}