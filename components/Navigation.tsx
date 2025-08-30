'use client'

import { useState } from 'react'
import { Menu, X, Github, ExternalLink, Mail } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full cosmic-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">3D</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Portfolio</h1>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="#projects" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </a>
          <a 
            href="#about" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a 
            href="#contact" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <button className="px-4 py-2 cosmic-gradient text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Get In Touch
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-card border border-border rounded-lg p-4 space-y-4">
          <a 
            href="#projects" 
            className="block text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </a>
          <a 
            href="#about" 
            className="block text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="block text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </a>
          <hr className="border-border" />
          <button className="w-full px-4 py-2 cosmic-gradient text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Get In Touch
          </button>
        </div>
      )}
    </nav>
  )
}