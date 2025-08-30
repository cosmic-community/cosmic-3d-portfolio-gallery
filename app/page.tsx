import { Suspense } from 'react'
import { getProjects } from '@/lib/cosmic'
import { Project } from '@/types'
import ClientPortfolio from '@/components/ClientPortfolio'

export default async function HomePage() {
  let projects: Project[] = []
  
  try {
    projects = await getProjects()
  } catch (error) {
    console.error('Error loading projects:', error)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientPortfolio projects={projects} />
      </Suspense>
    </div>
  )
}