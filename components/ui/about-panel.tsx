'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, Instagram, Mail, Code2, Cpu, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { aboutData } from '@/lib/planet-data'

interface AboutPanelProps {
  isOpen: boolean
  onClose: () => void
}

const PAGES = [
  'about',
  'tech',
  'connect',
] as const

export function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  const [page, setPage] = useState(0)

  const nextPage = () => setPage((p) => Math.min(p + 1, PAGES.length - 1))
  const prevPage = () => setPage((p) => Math.max(p - 1, 0))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] sm:max-w-3xl sm:max-h-[85vh] z-50 glass-strong rounded-2xl overflow-hidden flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
              aria-label="Close about panel"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>

            <div className="flex-1 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {page === 0 && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      About Me
                    </h2>
                    <p className="text-white/70 leading-relaxed text-lg mb-6">
                      {aboutData.bio}
                    </p>

                    <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      Disciplines
                    </h3>
                    <ul className="space-y-3">
                      {aboutData.disciplines.map((discipline, index) => (
                        <li key={index} className="flex items-start gap-3 text-white/70">
                          <span className="text-primary mt-1">·</span>
                          {discipline}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {page === 1 && (
                  <motion.div
                    key="tech"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Tech Stack
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-mono text-white/50 mb-2 uppercase">Languages</p>
                        <div className="flex flex-wrap gap-2">
                          {aboutData.techStack.languages.map((tech) => (
                            <span key={tech} className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-white/50 mb-2 uppercase">Frontend</p>
                        <div className="flex flex-wrap gap-2">
                          {aboutData.techStack.frontend.map((tech) => (
                            <span key={tech} className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300 border border-green-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-white/50 mb-2 uppercase">Backend</p>
                        <div className="flex flex-wrap gap-2">
                          {aboutData.techStack.backend.map((tech) => (
                            <span key={tech} className="px-3 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-white/50 mb-2 uppercase">Systems</p>
                        <div className="flex flex-wrap gap-2">
                          {aboutData.techStack.systems.map((tech) => (
                            <span key={tech} className="px-3 py-1 rounded-full text-sm bg-orange-500/20 text-orange-300 border border-orange-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {page === 2 && (
                  <motion.div
                    key="connect"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Connect
                    </h3>
                    <div className="flex flex-col gap-3">
                      
                        href={aboutData.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                      >
                        <Github className="w-5 h-5" />
                        GitHub
                      </a>
                      
                        href={aboutData.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                      >
                        <Instagram className="w-5 h-5" />
                        Instagram
                      </a>
                      
                        href={`mailto:${aboutData.social.email}`}
                        className="flex items-center gap-3 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                      >
                        <Mail className="w-5 h-5" />
                        Email
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation arrows + page dots */}
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <button
                onClick={prevPage}
                disabled={page === 0}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex gap-2">
                {PAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === page ? 'bg-white w-6' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={page === PAGES.length - 1}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}