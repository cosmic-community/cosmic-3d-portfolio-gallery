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
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const projects = response.objects as Project[];
    
    // Transform position data from individual fields to position object
    const transformedProjects = projects.map(project => ({
      ...project,
      metadata: {
        ...project.metadata,
        // Create position object from individual fields if they exist
        position: project.metadata?.position_x !== undefined || 
                 project.metadata?.position_y !== undefined || 
                 project.metadata?.position_z !== undefined ? {
          x: project.metadata.position_x ?? 0,
          y: project.metadata.position_y ?? 0,
          z: project.metadata.position_z ?? 0,
        } : undefined,
        // Create rotation object from individual fields if they exist
        rotation: project.metadata?.rotation_x !== undefined || 
                 project.metadata?.rotation_y !== undefined || 
                 project.metadata?.rotation_z !== undefined ? {
          x: project.metadata.rotation_x ?? 0,
          y: project.metadata.rotation_y ?? 0,
          z: project.metadata.rotation_z ?? 0,
        } : undefined,
        // Parse technologies JSON string if it exists
        technologies: typeof project.metadata?.technologies === 'string' ? 
                     JSON.parse(project.metadata.technologies) : 
                     project.metadata?.technologies || [],
      }
    }));
    
    return transformedProjects.sort((a, b) => {
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
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1);
    
    const projects = response.objects as Project[];
    
    // Transform the data structure like in getProjects
    return projects.map(project => ({
      ...project,
      metadata: {
        ...project.metadata,
        position: project.metadata?.position_x !== undefined || 
                 project.metadata?.position_y !== undefined || 
                 project.metadata?.position_z !== undefined ? {
          x: project.metadata.position_x ?? 0,
          y: project.metadata.position_y ?? 0,
          z: project.metadata.position_z ?? 0,
        } : undefined,
        rotation: project.metadata?.rotation_x !== undefined || 
                 project.metadata?.rotation_y !== undefined || 
                 project.metadata?.rotation_z !== undefined ? {
          x: project.metadata.rotation_x ?? 0,
          y: project.metadata.rotation_y ?? 0,
          z: project.metadata.rotation_z ?? 0,
        } : undefined,
        technologies: typeof project.metadata?.technologies === 'string' ? 
                     JSON.parse(project.metadata.technologies) : 
                     project.metadata?.technologies || [],
      }
    }));
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
    
    // Transform the data structure
    return {
      ...project,
      metadata: {
        ...project.metadata,
        position: project.metadata?.position_x !== undefined || 
                 project.metadata?.position_y !== undefined || 
                 project.metadata?.position_z !== undefined ? {
          x: project.metadata.position_x ?? 0,
          y: project.metadata.position_y ?? 0,
          z: project.metadata.position_z ?? 0,
        } : undefined,
        rotation: project.metadata?.rotation_x !== undefined || 
                 project.metadata?.rotation_y !== undefined || 
                 project.metadata?.rotation_z !== undefined ? {
          x: project.metadata.rotation_x ?? 0,
          y: project.metadata.rotation_y ?? 0,
          z: project.metadata.rotation_z ?? 0,
        } : undefined,
        technologies: typeof project.metadata?.technologies === 'string' ? 
                     JSON.parse(project.metadata.technologies) : 
                     project.metadata?.technologies || [],
      }
    };
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
        technologies: JSON.stringify(data.technologies), // Store as JSON string
        live_url: data.live_url || '',
        github_url: data.github_url || '',
        image: data.image,
        status: 'Published',
        featured: false,
        position_x: Math.random() * 10 - 5,
        position_y: Math.random() * 5,
        position_z: Math.random() * 10 - 5,
        rotation_x: 0,
        rotation_y: 0,
        rotation_z: 0,
        scale: 1,
      },
    });
    
    const project = response.object as Project;
    
    // Transform the response to match our interface
    return {
      ...project,
      metadata: {
        ...project.metadata,
        position: {
          x: project.metadata.position_x ?? 0,
          y: project.metadata.position_y ?? 0,
          z: project.metadata.position_z ?? 0,
        },
        rotation: {
          x: project.metadata.rotation_x ?? 0,
          y: project.metadata.rotation_y ?? 0,
          z: project.metadata.rotation_z ?? 0,
        },
        technologies: typeof project.metadata?.technologies === 'string' ? 
                     JSON.parse(project.metadata.technologies) : 
                     project.metadata?.technologies || [],
      }
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
}

// Update project
export async function updateProject(id: string, data: Partial<Project['metadata']>): Promise<Project> {
  try {
    // Transform position/rotation objects back to individual fields for Cosmic
    const cosmicMetadata: Record<string, any> = { ...data };
    
    if (data.position) {
      cosmicMetadata.position_x = data.position.x;
      cosmicMetadata.position_y = data.position.y;
      cosmicMetadata.position_z = data.position.z;
      delete cosmicMetadata.position;
    }
    
    if (data.rotation) {
      cosmicMetadata.rotation_x = data.rotation.x;
      cosmicMetadata.rotation_y = data.rotation.y;
      cosmicMetadata.rotation_z = data.rotation.z;
      delete cosmicMetadata.rotation;
    }
    
    if (data.technologies && Array.isArray(data.technologies)) {
      cosmicMetadata.technologies = JSON.stringify(data.technologies);
    }
    
    const response = await cosmic.objects.updateOne(id, {
      metadata: cosmicMetadata,
    });
    
    const project = response.object as Project;
    
    // Transform the response back
    return {
      ...project,
      metadata: {
        ...project.metadata,
        position: project.metadata?.position_x !== undefined ? {
          x: project.metadata.position_x,
          y: project.metadata.position_y ?? 0,
          z: project.metadata.position_z ?? 0,
        } : undefined,
        rotation: project.metadata?.rotation_x !== undefined ? {
          x: project.metadata.rotation_x,
          y: project.metadata.rotation_y ?? 0,
          z: project.metadata.rotation_z ?? 0,
        } : undefined,
        technologies: typeof project.metadata?.technologies === 'string' ? 
                     JSON.parse(project.metadata.technologies) : 
                     project.metadata?.technologies || [],
      }
    };
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