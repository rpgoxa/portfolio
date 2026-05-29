'use client'

import { motion } from 'framer-motion'
import { Github, Instagram, Mail, ChevronDown } from 'lucide-react'
import { aboutData } from '@/lib/planet-data'

interface HeroSectionProps {
  isVisible: boolean
}

export function HeroSection({ isVisible }: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -100
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div className="text-center max-w-3xl px-6">
        {/* Background overlay for better text visibility */}
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-black/60 via-black/40 to-transparent" />
        
        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-7xl sm:text-8xl md:text-9xl font-bold text-white mb-4 drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]"
          style={{ textShadow: '0 0 60px rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.9)' }}
        >
          Ali Amir
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-2xl sm:text-3xl text-white font-light mb-8"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}
        >
          17-Year-Old Developer
        </motion.p>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg sm:text-xl text-white/90 leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ textShadow: '0 2px 15px rgba(0,0,0,0.9)' }}
        >
          {"I'm a 17-year-old self-taught developer based in Lebanon. I don't just build applications — I understand, break down, and engineer technology at every layer."}
        </motion.p>
        
        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <a
            href={aboutData.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6 text-white" />
          </a>
          <a
            href={aboutData.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6 text-white" />
          </a>
          <a
            href={`mailto:${aboutData.social.email}`}
            className="p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110"
            aria-label="Email"
          >
            <Mail className="w-6 h-6 text-white" />
          </a>
        </motion.div>
        
        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-sm text-white/40 font-mono">
            scroll to explore the universe
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            <ChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
