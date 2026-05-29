'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, Instagram, Mail, Code2, Cpu, Shield } from 'lucide-react'
import { aboutData } from '@/lib/planet-data'

interface AboutPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] sm:max-w-3xl sm:max-h-[85vh] z-50 glass-strong rounded-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              aria-label="Close about panel"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
            
            {/* Scrollable content */}
            <div className="h-full overflow-y-auto p-6 sm:p-8">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  About Me
                </h2>
                <p className="text-white/70 leading-relaxed text-lg">
                  {aboutData.bio}
                </p>
              </div>
              
              {/* Disciplines */}
              <div className="mb-8">
                <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Disciplines
                </h3>
                <ul className="space-y-3">
                  {aboutData.disciplines.map((discipline, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 text-white/70"
                    >
                      <span className="text-primary mt-1">·</span>
                      {discipline}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Tech Stack
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Languages */}
                  <div>
                    <p className="text-xs font-mono text-white/50 mb-2 uppercase">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {aboutData.techStack.languages.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Frontend */}
                  <div>
                    <p className="text-xs font-mono text-white/50 mb-2 uppercase">Frontend</p>
                    <div className="flex flex-wrap gap-2">
                      {aboutData.techStack.frontend.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300 border border-green-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Backend */}
                  <div>
                    <p className="text-xs font-mono text-white/50 mb-2 uppercase">Backend</p>
                    <div className="flex flex-wrap gap-2">
                      {aboutData.techStack.backend.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Systems */}
                  <div>
                    <p className="text-xs font-mono text-white/50 mb-2 uppercase">Systems</p>
                    <div className="flex flex-wrap gap-2">
                      {aboutData.techStack.systems.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 rounded-full text-sm bg-orange-500/20 text-orange-300 border border-orange-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact */}
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Connect
                </h3>
                <div className="flex items-center gap-3">
                  <a
                    href={aboutData.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                  <a
                    href={aboutData.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  >
                    <Instagram className="w-5 h-5" />
                    Instagram
                  </a>
                  <a
                    href={`mailto:${aboutData.social.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
