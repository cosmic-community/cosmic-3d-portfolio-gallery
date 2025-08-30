import { createBucketClient } from '@cosmicjs/sdk';
import type { Project, About, Skill, Contact, CosmicResponse } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'projects' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return (response.objects as Project[]).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Newest first
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
}

// Get featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'projects',
        'metadata.featured': true 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as Project[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching featured projects:', error);
    throw new Error('Failed to fetch featured projects');
  }
}

// Get single project
export async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await cosmic.objects
      .findOne({ 
        type: 'projects', 
        slug 
      })
      .depth(1);
    
    const project = response.object as Project;
    
    if (!project) {
      return null;
    }
    
    return project;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
}

// Get about information
export async function getAbout(): Promise<About | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'about' })
      .depth(1);
    
    return response.object as About;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching about:', error);
    throw new Error('Failed to fetch about information');
  }
}

// Get skills
export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'skills' })
      .props(['id', 'title', 'metadata'])
      .depth(1);
    
    return response.objects as Skill[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching skills:', error);
    throw new Error('Failed to fetch skills');
  }
}

// Get contact information
export async function getContact(): Promise<Contact | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'contact' })
      .depth(1);
    
    return response.object as Contact;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    console.error('Error fetching contact:', error);
    throw new Error('Failed to fetch contact information');
  }
}

// Create new project
export async function createProject(data: {
  title: string;
  description: string;
  technologies: string[];
  live_url?: string;
  github_url?: string;
  image?: any;
}): Promise<Project> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'projects',
      title: data.title,
      metadata: {
        description: data.description,
        technologies: data.technologies,
        live_url: data.live_url || '',
        github_url: data.github_url || '',
        image: data.image,
        status: 'published',
        featured: false,
        position: {
          x: Math.random() * 10 - 5,
          y: Math.random() * 5,
          z: Math.random() * 10 - 5,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        scale: 1,
      },
    });
    
    return response.object as Project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

// Update project
export async function updateProject(id: string, data: Partial<Project['metadata']>): Promise<Project> {
  try {
    const response = await cosmic.objects.updateOne(id, {
      metadata: data,
    });
    
    return response.object as Project;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}