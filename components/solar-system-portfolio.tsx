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

export default function SolarSystemPortfolio() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activePlanetIndex, setActivePlanetIndex] = useState<number | null>(null)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [showProjectPanel, setShowProjectPanel] = useState(false)
  const [showAboutPanel, setShowAboutPanel] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef(0)
  const targetRef = useRef(0)

  const showHero = scrollProgress < 0.08

  const currentSection = Math.floor(scrollProgress * 7)
  const currentPlanetIndex = currentSection >= 1 && currentSection <= 6 ? currentSection - 1 : null

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (!hasScrolled) setHasScrolled(true)
    const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 100)
    targetRef.current = Math.max(0, Math.min(1,
      targetRef.current + delta * 0.0008
    ))
  }, [hasScrolled])

  const touchLastY = useRef(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchLastY.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    if (!hasScrolled) setHasScrolled(true)
    const currentY = e.touches[0].clientY
    const delta = touchLastY.current - currentY
    touchLastY.current = currentY
    const normalized = Math.sign(delta) * Math.min(Math.abs(delta), 30)
    targetRef.current = Math.max(0, Math.min(1,
      targetRef.current + normalized * 0.0012
    ))
  }, [hasScrolled])

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

  useEffect(() => {
    let rafId: number
    const tick = () => {
      const diff = targetRef.current - scrollRef.current
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
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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