'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { planets } from '@/lib/planet-data'

interface HUDProps {
  scrollProgress: number
  currentPlanetIndex: number | null
  showScrollHint: boolean
}

export function HUD({ scrollProgress, currentPlanetIndex, showScrollHint }: HUDProps) {
  // Calculate which section we're in based on scroll
  const totalSections = 7
  const currentSection = Math.floor(scrollProgress * totalSections)
  
  // Get current planet name
  const getCurrentPlanetName = () => {
    if (currentSection === 0) return 'SOLAR SYSTEM'
    if (currentSection >= 1 && currentSection <= 6) {
      return planets[currentSection - 1]?.name.toUpperCase() || ''
    }
    return 'OVERVIEW'
  }
  
  const currentPlanet = currentSection >= 1 && currentSection <= 6 
    ? planets[currentSection - 1] 
    : null
  
  return (
    <>
      {/* Top left - Name */}
      <div className="fixed top-6 left-6 z-40">
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-sm tracking-widest text-white/60"
        >
          ALI AMIR
        </motion.p>
      </div>
      
      {/* Top right - Current planet name */}
      <div className="fixed top-6 right-6 z-40">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSection}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-sm tracking-widest"
            style={{ color: currentPlanet?.emissiveColor || 'rgba(255,255,255,0.6)' }}
          >
            {getCurrentPlanetName()}
          </motion.p>
        </AnimatePresence>
      </div>
      
      {/* Bottom right - Navigation dots */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
          const isActive = Math.floor(scrollProgress * 7) === index || 
            (index === 7 && scrollProgress > 0.95)
          const planet = index >= 1 && index <= 6 ? planets[index - 1] : null
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="relative group"
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'scale-150' 
                    : 'scale-100 opacity-40'
                }`}
                style={{ 
                  backgroundColor: isActive 
                    ? (planet?.emissiveColor || '#ffffff') 
                    : '#ffffff',
                  boxShadow: isActive 
                    ? `0 0 10px ${planet?.emissiveColor || '#ffffff'}` 
                    : 'none'
                }}
              />
              
              {/* Tooltip */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-xs font-mono text-white/60 whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                  {index === 0 ? 'Overview' : index === 7 ? 'Final' : planets[index - 1]?.name}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Bottom center - Scroll hint */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <p className="text-xs font-mono text-white/30">
              SCROLL TO NAVIGATE
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
