// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Project interface with proper metadata structure
interface Project extends CosmicObject {
  type: 'projects';
  metadata: {
    description?: string;
    technologies?: string[];
    image?: {
      url: string;
      imgix_url: string;
    };
    position?: {
      x: number;
      y: number;
      z: number;
    };
    rotation?: {
      x: number;
      y: number;
      z: number;
    };
    scale?: number;
    live_url?: string;
    github_url?: string;
    featured?: boolean;
    category?: string;
    status?: ProjectStatus;
    color?: string;
  };
}

// About page interface
interface About extends CosmicObject {
  type: 'about';
  metadata: {
    bio?: string;
    avatar?: {
      url: string;
      imgix_url: string;
    };
    skills?: string[];
    experience?: string;
    location?: string;
    email?: string;
    linkedin_url?: string;
    github_url?: string;
    twitter_url?: string;
  };
}

// Skills interface
interface Skill extends CosmicObject {
  type: 'skills';
  metadata: {
    proficiency?: number;
    category?: SkillCategory;
    icon?: string;
    color?: string;
    years_experience?: number;
  };
}

// Contact interface
interface Contact extends CosmicObject {
  type: 'contact';
  metadata: {
    email?: string;
    phone?: string;
    location?: string;
    social_links?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      dribbble?: string;
      behance?: string;
    };
    availability?: ContactStatus;
  };
}

// Type literals for select-dropdown values
type ProjectStatus = 'published' | 'draft' | 'archived';
type SkillCategory = 'frontend' | 'backend' | 'design' | 'tools' | '3d';
type ContactStatus = 'available' | 'busy' | 'not-available';

// API response types
interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// 3D Scene types
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface ProjectCardProps {
  project: Project;
  position: Vector3;
  onClick: (project: Project) => void;
}

interface SceneProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

// Animation and interaction types
interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

interface InteractionState {
  hovered: boolean;
  clicked: boolean;
  selected: boolean;
}

// Utility types
type OptionalMetadata<T> = Partial<T['metadata']>;
type CreateProjectData = Omit<Project, 'id' | 'created_at' | 'modified_at'>;

// Type guards for runtime validation
function isProject(obj: CosmicObject): obj is Project {
  return obj.type === 'projects';
}

function isAbout(obj: CosmicObject): obj is About {
  return obj.type === 'about';
}

function isSkill(obj: CosmicObject): obj is Skill {
  return obj.type === 'skills';
}

function isContact(obj: CosmicObject): obj is Contact {
  return obj.type === 'contact';
}

export type {
  CosmicObject,
  Project,
  About,
  Skill,
  Contact,
  ProjectStatus,
  SkillCategory,
  ContactStatus,
  CosmicResponse,
  Vector3,
  ProjectCardProps,
  SceneProps,
  AnimationConfig,
  InteractionState,
  OptionalMetadata,
  CreateProjectData,
};

export {
  isProject,
  isAbout,
  isSkill,
  isContact,
};