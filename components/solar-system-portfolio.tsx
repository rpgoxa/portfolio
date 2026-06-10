'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/ui/hero-section'
import { HUD } from '@/components/ui/hud'
import { ProjectPanel } from '@/components/ui/project-panel'
import { AboutPanel } from '@/components/ui/about-panel'
import { PlanetLabel } from '@/components/ui/planet-label'
import { planets } from '@/lib/planet-data'
import { User } from 'lucide-react'

const SolarSystemCanvas = dynamic(
  () => import('@/components/solar-system/solar-system-canvas').then(mod => mod.SolarSystemCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#000005] flex items-center justify-center">
        <div className="text-white/50 font-mono text-sm">Loading universe...</div>
      </div>
    )
  }
)

const TOTAL_STOPS = 8 // overview + 6 planets + outro

export default function SolarSystemPortfolio() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activePlanetIndex, setActivePlanetIndex] = useState<number | null>(null)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [showProjectPanel, setShowProjectPanel] = useState(false)
  const [showAboutPanel, setShowAboutPanel] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef(0)        // current animated value (0-1)
  const stopRef = useRef(0)          // current stop index (0 to TOTAL_STOPS-1)
  const lockRef = useRef(false)      // cooldown lock
  const touchStartY = useRef(0)
  const touchAccum = useRef(0)

  const showHero = scrollProgress < 0.08
  const currentSection = Math.round(scrollProgress * (TOTAL_STOPS - 1))
  const currentPlanetIndex = currentSection >= 1 && currentSection <= 6 ? currentSection - 1 : null

  // Move to a stop with cooldown lock
  const goToStop = useCallback((dir: number) => {
    if (lockRef.current) return
    const next = Math.max(0, Math.min(TOTAL_STOPS - 1, stopRef.current + dir))
    if (next === stopRef.current) return
    stopRef.current = next
    lockRef.current = true
    if (!hasScrolled) setHasScrolled(true)
    // Unlock after the camera settles
    setTimeout(() => { lockRef.current = false }, 900)
  }, [hasScrolled])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (Math.abs(e.deltaY) < 10) return
    goToStop(e.deltaY > 0 ? 1 : -1)
  }, [goToStop])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    touchAccum.current = 0
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    const currentY = e.touches[0].clientY
    const delta = touchStartY.current - currentY
    touchAccum.current = delta
    // Trigger a stop change once swipe passes threshold
    if (Math.abs(touchAccum.current) > 80) {
      goToStop(touchAccum.current > 0 ? 1 : -1)
      touchStartY.current = currentY
      touchAccum.current = 0
    }
  }, [goToStop])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true })
      window.removeEventListener('touchstart', handleTouchStart, { capture: true })
      window.removeEventListener('touchmove', handleTouchMove, { capture: true })
    }
  }, [handleWheel, handleTouchStart, handleTouchMove])

  // Smooth animation toward the current stop
  useEffect(() => {
    let rafId: number
    const tick = () => {
      const target = stopRef.current / (TOTAL_STOPS - 1)
      const diff = target - scrollRef.current
      if (Math.abs(diff) > 0.00001) {
        scrollRef.current += diff * 0.06
        setScrollProgress(Math.round(scrollRef.current * 10000) / 10000)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handlePlanetClick = useCallback((index: number | null) => {
    setActivePlanetIndex(index)
    setShowProjectPanel(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowProjectPanel(false)
        setShowAboutPanel(false)
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToStop(1)
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToStop(-1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToStop])

  useEffect(() => {
    if (!showProjectPanel && currentPlanetIndex !== null) {
      setActivePlanetIndex(currentPlanetIndex)
    }
  }, [currentPlanetIndex, showProjectPanel])

  return (
    <div ref={containerRef} style={{ height: '100vh', overflow: 'hidden' }}>
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'auto' }}>
        <SolarSystemCanvas
          scrollProgress={scrollProgress}
          activePlanetIndex={activePlanetIndex}
          setActivePlanetIndex={handlePlanetClick}
          hoveredPlanet={hoveredPlanet}
          setHoveredPlanet={setHoveredPlanet}
        />
      </div>

      <HeroSection isVisible={showHero} />

      <PlanetLabel
        currentPlanetIndex={currentPlanetIndex}
        scrollProgress={scrollProgress}
        onOpenPanel={() => {
          if (currentPlanetIndex !== null) {
            setActivePlanetIndex(currentPlanetIndex)
            setShowProjectPanel(true)
          }
        }}
      />

      <HUD
        scrollProgress={scrollProgress}
        currentPlanetIndex={currentPlanetIndex}
        showScrollHint={scrollProgress > 0.05 && scrollProgress < 0.9}
      />

      <button
        onClick={() => setShowAboutPanel(true)}
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full glass hover:bg-white/10 transition-all hover:scale-110"
        aria-label="About"
      >
        <User className="w-5 h-5 text-white/70" />
      </button>

      <ProjectPanel
        planet={activePlanetIndex !== null ? planets[activePlanetIndex] : null}
        isOpen={showProjectPanel}
        onClose={() => setShowProjectPanel(false)}
      />

      <AboutPanel
        isOpen={showAboutPanel}
        onClose={() => setShowAboutPanel(false)}
      />
    </div>
  )
}
