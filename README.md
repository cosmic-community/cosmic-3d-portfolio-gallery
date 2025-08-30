# 🌌 Cosmic 3D Portfolio Gallery

![App Preview](https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=300&fit=crop&auto=format)

An immersive 3D portfolio gallery built with React Three Fiber that showcases creative work and projects in a stunning three-dimensional space. Navigate through floating project cards, interact with 3D models, and explore portfolios in an engaging spatial environment.

## ✨ Features

- 🌟 **Interactive 3D Environment** - Navigate through a cosmic-themed 3D space
- 🎴 **Floating Project Cards** - Interactive 3D cards displaying portfolio projects  
- ⭐ **Particle Systems** - Dynamic visual effects and atmospheric particles
- 🎮 **Smooth Controls** - Orbital camera controls and smooth animations
- 📱 **Responsive Design** - Works beautifully on desktop and mobile devices
- 🚀 **Performance Optimized** - Efficient rendering with React Three Fiber
- 📝 **CMS Integration** - Easy content management through Cosmic CMS

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> Can you build in React three Fiber?

### Code Generation Prompt

> Build an application of any kind that showcases the power of a React Three Fiber application. Don't have the content be about react three fiber

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects
- **Cosmic CMS** - Headless CMS for content management
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your Cosmic credentials:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Cosmic SDK Examples

### Fetching Portfolio Projects
```typescript
import { cosmic } from '@/lib/cosmic'

// Get all portfolio projects
const projects = await cosmic.objects
  .find({ type: 'projects' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get single project
const project = await cosmic.objects
  .findOne({ 
    type: 'projects', 
    slug: 'project-slug' 
  })
  .depth(1)
```

### Creating New Projects
```typescript
const newProject = await cosmic.objects.insertOne({
  type: 'projects',
  title: 'My New Project',
  slug: 'my-new-project',
  metadata: {
    description: 'Project description',
    technologies: ['React', 'Three.js'],
    image: { 
      url: 'image-url',
      imgix_url: 'optimized-image-url'
    },
    position: {
      x: 0,
      y: 0, 
      z: 0
    },
    live_url: 'https://project-url.com',
    github_url: 'https://github.com/username/repo'
  }
})
```

## 🎨 Cosmic CMS Integration

This application uses Cosmic CMS to manage:

- **Portfolio Projects** - Project details, images, and 3D positioning
- **About Information** - Personal/company information and bio
- **Skills & Technologies** - Technical skills and proficiency levels
- **Contact Information** - Contact details and social links

The 3D scene dynamically renders content from Cosmic, allowing you to:
- Add new projects without code changes
- Update project information in real-time
- Configure 3D positioning through the CMS
- Manage images and assets centrally

## 🌐 Deployment

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cosmicjs/3d-portfolio-gallery)

Or deploy on Netlify:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/cosmicjs/3d-portfolio-gallery)

Remember to add your Cosmic environment variables in your deployment platform's settings.
