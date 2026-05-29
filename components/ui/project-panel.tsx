'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github } from 'lucide-react'
import type { Planet } from '@/lib/planet-data'

interface ProjectPanelProps {
  planet: Planet | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectPanel({ planet, isOpen, onClose }: ProjectPanelProps) {
  if (!planet) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 200 
          }}
          className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50"
        >
          <div className="h-full glass-strong flex flex-col overflow-hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
            
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 pt-16">
              {/* Planet indicator */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-12 h-12 rounded-full"
                  style={{ 
                    background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.emissiveColor})`,
                    boxShadow: `0 0 20px ${planet.emissiveColor}40`
                  }}
                />
                <div>
                  <p 
                    className="text-sm font-mono uppercase tracking-wider"
                    style={{ color: planet.emissiveColor }}
                  >
                    {planet.name}
                  </p>
                </div>
              </div>
              
              {/* Project title */}
              <h2 className="text-3xl font-bold text-white mb-2">
                {planet.subtitle}
              </h2>
              
              {/* Tagline */}
              <p className="text-white/60 italic mb-6 text-lg">
                {planet.name}
              </p>
              
              {/* Description */}
              <p className="text-white/80 leading-relaxed mb-8">
                {planet.description}
              </p>
              
              {/* Tech Focus */}
              <div className="mb-8">
                <h3 
                  className="text-xs font-mono uppercase tracking-widest mb-3"
                  style={{ color: planet.emissiveColor }}
                >
                  Tech Focus
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {planet.techFocus}
                </p>
              </div>
              
              {/* Orbiting Tech (Stack) */}
              <div className="mb-8">
                <h3 
                  className="text-xs font-mono uppercase tracking-widest mb-3"
                  style={{ color: planet.emissiveColor }}
                >
                  Orbiting Tech
                </h3>
                <div className="flex flex-wrap gap-2">
                  {planet.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ 
                        background: `${planet.emissiveColor}20`,
                        color: planet.emissiveColor,
                        border: `1px solid ${planet.emissiveColor}40`
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* View Repository Button */}
              <a
                href={planet.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${planet.emissiveColor}, ${planet.color})`,
                  color: '#fff'
                }}
              >
                <Github className="w-5 h-5" />
                View Repository
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
