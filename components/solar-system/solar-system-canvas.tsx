'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Sun } from './sun'
import { Planet } from './planet'
import { Starfield } from './starfield'
import { OrbitLines } from './orbit-lines'
import { planets } from '@/lib/planet-data'
import { useIsMobile } from '@/hooks/use-mobile'

interface SceneProps {
  scrollProgress: number
  activePlanetIndex: number | null
  setActivePlanetIndex: (index: number | null) => void
  hoveredPlanet: string | null
  setHoveredPlanet: (id: string | null) => void
  isMobile: boolean
}

// Camera positions for each section - designed to get close to each planet
const cameraPositions = [
  { pos: [80, 25, 80], lookAt: [20, 0, 0] },      // Overview - see full system
  { pos: [14, 1.5, 4], lookAt: [12, 0, 0] },     // VitaAI (Earth) - close up
  { pos: [20, 1.2, 4], lookAt: [18, 0, 0] },     // Eye (Exoplanet) - close up
  { pos: [26, 1.5, 4], lookAt: [24, 0, 0] },     // Circuit (Mars) - close up
  { pos: [36, 3, 8], lookAt: [32, 0, 0] },       // Automata (Jupiter) - close up (bigger planet)
  { pos: [43, 2, 5], lookAt: [40, 0, 0] },       // Abyss (Neptune) - close up
  { pos: [54, 3, 8], lookAt: [50, 0, 0] },       // Play (Saturn) - close up (rings visible)
  { pos: [100, 35, 100], lookAt: [25, 0, 0] },   // Final overview - pull back
]

function CameraController({ scrollProgress, activePlanetIndex }: { scrollProgress: number, activePlanetIndex: number | null }) {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(80, 30, 80))
  const targetLookAt = useRef(new THREE.Vector3(20, 0, 0))
  const currentLookAt = useRef(new THREE.Vector3(20, 0, 0))
  
  useFrame(() => {
    // Calculate which section we're in
    const totalSections = cameraPositions.length - 1
    const sectionProgress = scrollProgress * totalSections
    const currentSection = Math.floor(sectionProgress)
    const sectionT = sectionProgress - currentSection
    
    // Get current and next positions
    const currentPos = cameraPositions[Math.min(currentSection, totalSections)]
    const nextPos = cameraPositions[Math.min(currentSection + 1, totalSections)]
    
    // Smooth interpolation with easing
    const easeT = sectionT < 0.5 
      ? 4 * sectionT * sectionT * sectionT 
      : 1 - Math.pow(-2 * sectionT + 2, 3) / 2
    
    targetPosition.current.set(
      THREE.MathUtils.lerp(currentPos.pos[0], nextPos.pos[0], easeT),
      THREE.MathUtils.lerp(currentPos.pos[1], nextPos.pos[1], easeT),
      THREE.MathUtils.lerp(currentPos.pos[2], nextPos.pos[2], easeT)
    )
    
    targetLookAt.current.set(
      THREE.MathUtils.lerp(currentPos.lookAt[0], nextPos.lookAt[0], easeT),
      THREE.MathUtils.lerp(currentPos.lookAt[1], nextPos.lookAt[1], easeT),
      THREE.MathUtils.lerp(currentPos.lookAt[2], nextPos.lookAt[2], easeT)
    )
    
    // Smoothly move camera
    camera.position.lerp(targetPosition.current, 0.05)
    currentLookAt.current.lerp(targetLookAt.current, 0.05)
    camera.lookAt(currentLookAt.current)
  })
  
  return null
}

function Scene({ scrollProgress, activePlanetIndex, setActivePlanetIndex, hoveredPlanet, setHoveredPlanet, isMobile }: SceneProps) {
  return (
    <>
      <CameraController scrollProgress={scrollProgress} activePlanetIndex={activePlanetIndex} />
      
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.1} />
      
      {/* Background and stars */}
      <Starfield isMobile={isMobile} />
      <OrbitLines />
      
      {/* The Sun */}
      <Sun />
      
      {/* Planets */}
      {planets.map((planet, index) => (
        <Planet
          key={planet.id}
          planet={planet}
          isActive={activePlanetIndex === index || hoveredPlanet === planet.id}
          onClick={() => setActivePlanetIndex(index)}
          onHover={(hovered) => setHoveredPlanet(hovered ? planet.id : null)}
        />
      ))}
      
      {/* Post-processing effects — disabled on mobile for performance */}
      <EffectComposer enabled={!isMobile}>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          radius={0.8}
        />
        <Vignette 
          offset={0.3}
          darkness={0.7}
        />
      </EffectComposer>
    </>
  )
}

interface SolarSystemCanvasProps {
  scrollProgress: number
  activePlanetIndex: number | null
  setActivePlanetIndex: (index: number | null) => void
  hoveredPlanet: string | null
  setHoveredPlanet: (id: string | null) => void
}

export function SolarSystemCanvas({
  scrollProgress,
  activePlanetIndex,
  setActivePlanetIndex,
  hoveredPlanet,
  setHoveredPlanet
}: SolarSystemCanvasProps) {
  const isMobile = useIsMobile()

  return (
    <Canvas
      camera={{
        fov: 60,
        near: 0.1,
        far: 1000,
        position: [80, 30, 80]
      }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      gl={{
        antialias: !isMobile,
        alpha: false,
        powerPreference: 'high-performance'
      }}
      style={{ background: '#000005' }}
    >
      <Scene
        scrollProgress={scrollProgress}
        activePlanetIndex={activePlanetIndex}
        setActivePlanetIndex={setActivePlanetIndex}
        hoveredPlanet={hoveredPlanet}
        setHoveredPlanet={setHoveredPlanet}
        isMobile={isMobile}
      />
    </Canvas>
  )
}
