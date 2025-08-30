'use client'

import { useMemo } from 'react'
import { Project } from '@/types'
import ProjectCard3D from './ProjectCard3D'

interface ProjectsGridProps {
  projects: Project[]
  onProjectClick: (project: Project) => void
}

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  // Generate positions for projects in a circular/spiral arrangement
  const projectPositions = useMemo(() => {
    if (!projects || projects.length === 0) {
      return [];
    }

    return projects.map((project, index) => {
      // Use position from CMS if available, otherwise generate
      if (project.metadata?.position) {
        return {
          project,
          position: [
            project.metadata.position.x,
            project.metadata.position.y,
            project.metadata.position.z
          ] as [number, number, number]
        }
      }
      
      // Generate spiral arrangement
      const angle = (index / projects.length) * Math.PI * 2 + (index * 0.5)
      const radius = 8 + (index % 3) * 3
      const height = Math.sin(index * 0.8) * 2
      
      return {
        project,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ] as [number, number, number]
      }
    })
  }, [projects])

  if (!projects || projects.length === 0) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 2, 0.1]} />
          <meshStandardMaterial color="#374151" transparent opacity={0.8} />
        </mesh>
        {/* Text component would go here for "No projects found" */}
      </group>
    )
  }

  return (
    <group>
      {projectPositions.map(({ project, position }, index) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          position={position}
          onClick={onProjectClick}
          animationDelay={index * 0.1}
        />
      ))}
    </group>
  )
}