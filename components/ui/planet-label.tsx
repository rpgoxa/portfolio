'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { planets } from '@/lib/planet-data'
import { ExternalLink } from 'lucide-react'

interface PlanetLabelProps {
  currentPlanetIndex: number | null
  scrollProgress: number
  onOpenPanel: () => void
}

export function PlanetLabel({ currentPlanetIndex, scrollProgress, onOpenPanel }: PlanetLabelProps) {
  // Only show when focused on a specific planet (sections 1-6)
  const showLabel = currentPlanetIndex !== null && scrollProgress > 0.1 && scrollProgress < 0.95
  const planet = currentPlanetIndex !== null ? planets[currentPlanetIndex] : null
  
  return (
    <AnimatePresence mode="wait">
      {showLabel && planet && (
        <motion.div
          key={planet.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed left-6 sm:left-12 top-1/2 -translate-y-1/2 z-40 max-w-md"
        >
          {/* Planet name */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3"
            style={{ 
              color: planet.emissiveColor,
              textShadow: `0 0 30px ${planet.emissiveColor}60`
            }}
          >
            {planet.name.replace('Planet ', '')}
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl text-white/70 font-light mb-4"
          >
            {planet.subtitle}
          </motion.p>
          
          {/* Brief description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm sm:text-base text-white/50 leading-relaxed max-w-sm"
          >
            {planet.description.slice(0, 100)}...
          </motion.p>
          
          {/* View details button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onOpenPanel}
            className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{ 
              background: `${planet.emissiveColor}30`,
              color: planet.emissiveColor,
              border: `1px solid ${planet.emissiveColor}50`
            }}
          >
            View Details
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
