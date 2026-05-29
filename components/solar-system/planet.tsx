'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Planet as PlanetType } from '@/lib/planet-data'

interface PlanetProps {
  planet: PlanetType
  isActive: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
}

// Generate procedural textures for different planet types - more realistic
function generatePlanetTexture(type: PlanetType['type']): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  
  switch (type) {
    case 'earth':
      // Earth-like with realistic oceans and landmasses
      const oceanGradient = ctx.createLinearGradient(0, 0, 2048, 1024)
      oceanGradient.addColorStop(0, '#0a2463')
      oceanGradient.addColorStop(0.3, '#1e3a5f')
      oceanGradient.addColorStop(0.5, '#2563eb')
      oceanGradient.addColorStop(0.7, '#1e3a5f')
      oceanGradient.addColorStop(1, '#0a2463')
      ctx.fillStyle = oceanGradient
      ctx.fillRect(0, 0, 2048, 1024)
      
      // Add ocean depth variation
      for (let i = 0; i < 5000; i++) {
        ctx.fillStyle = `rgba(30, 58, 95, ${Math.random() * 0.3})`
        ctx.beginPath()
        ctx.arc(Math.random() * 2048, Math.random() * 1024, Math.random() * 30 + 5, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Add realistic continents
      ctx.fillStyle = '#1a5d1a'
      const continentShapes = [
        { x: 300, y: 300, rx: 200, ry: 150 },
        { x: 800, y: 400, rx: 300, ry: 200 },
        { x: 1400, y: 350, rx: 250, ry: 180 },
        { x: 500, y: 700, rx: 180, ry: 120 },
        { x: 1100, y: 650, rx: 220, ry: 140 },
        { x: 1700, y: 500, rx: 200, ry: 160 },
      ]
      
      continentShapes.forEach(cont => {
        // Main landmass
        ctx.fillStyle = '#1a5d1a'
        ctx.beginPath()
        ctx.ellipse(cont.x, cont.y, cont.rx, cont.ry, Math.random() * 0.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Add terrain variation
        for (let i = 0; i < 50; i++) {
          const shade = Math.random() > 0.5 ? '#2d7d2d' : '#145214'
          ctx.fillStyle = shade
          ctx.beginPath()
          ctx.ellipse(
            cont.x + (Math.random() - 0.5) * cont.rx * 1.5,
            cont.y + (Math.random() - 0.5) * cont.ry * 1.5,
            Math.random() * 40 + 10,
            Math.random() * 30 + 8,
            Math.random() * Math.PI,
            0, Math.PI * 2
          )
          ctx.fill()
        }
        
        // Add mountains/highlands
        ctx.fillStyle = '#3d8b3d'
        for (let i = 0; i < 20; i++) {
          ctx.beginPath()
          ctx.arc(
            cont.x + (Math.random() - 0.5) * cont.rx,
            cont.y + (Math.random() - 0.5) * cont.ry,
            Math.random() * 15 + 5,
            0, Math.PI * 2
          )
          ctx.fill()
        }
      })
      
      // Add ice caps
      ctx.fillStyle = '#e8e8e8'
      ctx.beginPath()
      ctx.ellipse(1024, 50, 400, 60, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(1024, 974, 350, 50, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Add realistic clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * 2048
        const y = Math.random() * 1024
        ctx.beginPath()
        ctx.ellipse(x, y, Math.random() * 80 + 20, Math.random() * 30 + 10, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()
      }
      break
      
    case 'exoplanet':
      // Dark mysterious planet with glowing magma cracks
      ctx.fillStyle = '#050508'
      ctx.fillRect(0, 0, 2048, 1024)
      
      // Add dark volcanic rocky texture
      for (let i = 0; i < 8000; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 20 + 10}, ${Math.random() * 15 + 5}, ${Math.random() * 25 + 10}, 0.6)`
        ctx.fillRect(Math.random() * 2048, Math.random() * 1024, Math.random() * 8 + 2, Math.random() * 8 + 2)
      }
      
      // Add volcanic regions
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * 2048
        const y = Math.random() * 1024
        const volcanoGradient = ctx.createRadialGradient(x, y, 0, x, y, 60)
        volcanoGradient.addColorStop(0, 'rgba(80, 20, 10, 0.8)')
        volcanoGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = volcanoGradient
        ctx.beginPath()
        ctx.arc(x, y, 60, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Add glowing lava cracks
      ctx.strokeStyle = '#ff2200'
      ctx.lineWidth = 3
      ctx.shadowColor = '#ff4400'
      ctx.shadowBlur = 25
      for (let i = 0; i < 50; i++) {
        ctx.beginPath()
        let x = Math.random() * 2048
        let y = Math.random() * 1024
        ctx.moveTo(x, y)
        for (let j = 0; j < 8; j++) {
          x += Math.random() * 80 - 40
          y += Math.random() * 80 - 40
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      
      // Add brighter lava pools
      ctx.shadowBlur = 40
      ctx.fillStyle = '#ff4400'
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * 2048, Math.random() * 1024, Math.random() * 8 + 3, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      break
      
    case 'mars':
      // Mars-like realistic rusty red surface
      const marsGradient = ctx.createLinearGradient(0, 0, 2048, 1024)
      marsGradient.addColorStop(0, '#8b3a1a')
      marsGradient.addColorStop(0.3, '#b54b26')
      marsGradient.addColorStop(0.5, '#c45c32')
      marsGradient.addColorStop(0.7, '#a04520')
      marsGradient.addColorStop(1, '#7a3015')
      ctx.fillStyle = marsGradient
      ctx.fillRect(0, 0, 2048, 1024)
      
      // Add rocky texture
      for (let i = 0; i < 10000; i++) {
        const shade = Math.random() * 60 + 120
        ctx.fillStyle = `rgba(${shade + 30}, ${shade - 30}, ${shade - 60}, 0.25)`
        ctx.beginPath()
        ctx.arc(Math.random() * 2048, Math.random() * 1024, Math.random() * 4 + 1, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Add darker regions (mare)
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * 2048
        const y = Math.random() * 1024
        const darkGradient = ctx.createRadialGradient(x, y, 0, x, y, 150)
        darkGradient.addColorStop(0, 'rgba(60, 25, 10, 0.4)')
        darkGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = darkGradient
        ctx.beginPath()
        ctx.ellipse(x, y, 180, 120, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Add realistic impact craters
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 2048
        const y = Math.random() * 1024
        const r = Math.random() * 50 + 15
        
        // Crater rim (lighter)
        ctx.strokeStyle = 'rgba(200, 150, 100, 0.3)'
        ctx.lineWidth = r * 0.15
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.stroke()
        
        // Crater floor (darker)
        const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, r * 0.9)
        craterGradient.addColorStop(0, 'rgba(50, 20, 10, 0.5)')
        craterGradient.addColorStop(0.7, 'rgba(100, 50, 30, 0.3)')
        craterGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = craterGradient
        ctx.beginPath()
        ctx.arc(x, y, r * 0.9, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Add polar ice cap
      ctx.fillStyle = 'rgba(230, 220, 210, 0.6)'
      ctx.beginPath()
      ctx.ellipse(1024, 30, 300, 40, 0, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'jupiter':
      // Jupiter-like gas giant with realistic bands - purple theme
      const jupiterGradient = ctx.createLinearGradient(0, 0, 0, 1024)
      jupiterGradient.addColorStop(0, '#2d1b4e')
      jupiterGradient.addColorStop(0.15, '#5c3d7a')
      jupiterGradient.addColorStop(0.3, '#3d2066')
      jupiterGradient.addColorStop(0.45, '#7c4dab')
      jupiterGradient.addColorStop(0.55, '#4a2875')
      jupiterGradient.addColorStop(0.7, '#8b5ec4')
      jupiterGradient.addColorStop(0.85, '#5c3d7a')
      jupiterGradient.addColorStop(1, '#2d1b4e')
      ctx.fillStyle = jupiterGradient
      ctx.fillRect(0, 0, 2048, 1024)
      
      // Add turbulent atmospheric bands
      for (let y = 0; y < 1024; y += 12) {
        const bandColor = `rgba(${100 + Math.random() * 80}, ${50 + Math.random() * 60}, ${120 + Math.random() * 80}, ${0.2 + Math.random() * 0.3})`
        ctx.fillStyle = bandColor
        
        // Wavy bands
        ctx.beginPath()
        ctx.moveTo(0, y)
        for (let x = 0; x < 2048; x += 50) {
          ctx.lineTo(x, y + Math.sin(x * 0.01 + y * 0.1) * 8)
        }
        ctx.lineTo(2048, y + 15)
        ctx.lineTo(0, y + 15)
        ctx.fill()
      }
      
      // Add the Great Red Spot (as a violet storm)
      const stormGradient = ctx.createRadialGradient(1400, 450, 0, 1400, 450, 120)
      stormGradient.addColorStop(0, '#e8dff5')
      stormGradient.addColorStop(0.3, '#c4b5fd')
      stormGradient.addColorStop(0.6, '#a78bfa')
      stormGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = stormGradient
      ctx.beginPath()
      ctx.ellipse(1400, 450, 120, 70, 0.1, 0, Math.PI * 2)
      ctx.fill()
      
      // Add smaller storms
      for (let i = 0; i < 8; i++) {
        const sx = Math.random() * 2048
        const sy = Math.random() * 1024
        const sr = Math.random() * 30 + 15
        const smallStorm = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr)
        smallStorm.addColorStop(0, 'rgba(200, 180, 220, 0.6)')
        smallStorm.addColorStop(1, 'transparent')
        ctx.fillStyle = smallStorm
        ctx.beginPath()
        ctx.ellipse(sx, sy, sr, sr * 0.6, Math.random(), 0, Math.PI * 2)
        ctx.fill()
      }
      break
      
    case 'neptune':
      // Neptune-like realistic icy blue
      const neptuneGradient = ctx.createLinearGradient(0, 0, 2048, 1024)
      neptuneGradient.addColorStop(0, '#0a3d62')
      neptuneGradient.addColorStop(0.25, '#1565a7')
      neptuneGradient.addColorStop(0.5, '#1e88c7')
      neptuneGradient.addColorStop(0.75, '#1565a7')
      neptuneGradient.addColorStop(1, '#0a3d62')
      ctx.fillStyle = neptuneGradient
      ctx.fillRect(0, 0, 2048, 1024)
      
      // Add subtle atmospheric bands
      for (let y = 0; y < 1024; y += 40) {
        ctx.fillStyle = `rgba(30, 140, 200, ${Math.random() * 0.15 + 0.05})`
        ctx.beginPath()
        ctx.moveTo(0, y)
        for (let x = 0; x < 2048; x += 30) {
          ctx.lineTo(x, y + Math.sin(x * 0.008) * 6)
        }
        ctx.lineTo(2048, y + 25)
        ctx.lineTo(0, y + 25)
        ctx.fill()
      }
      
      // Add high-altitude methane clouds
      ctx.fillStyle = 'rgba(200, 230, 255, 0.25)'
      for (let i = 0; i < 30; i++) {
        ctx.beginPath()
        ctx.ellipse(
          Math.random() * 2048,
          Math.random() * 1024,
          Math.random() * 100 + 30,
          Math.random() * 20 + 10,
          Math.random() * 0.3,
          0, Math.PI * 2
        )
        ctx.fill()
      }
      
      // Add Great Dark Spot
      const darkSpotGradient = ctx.createRadialGradient(600, 400, 0, 600, 400, 80)
      darkSpotGradient.addColorStop(0, 'rgba(5, 30, 50, 0.7)')
      darkSpotGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = darkSpotGradient
      ctx.beginPath()
      ctx.ellipse(600, 400, 80, 50, 0, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'saturn':
      // Saturn-like realistic golden gas giant
      const saturnGradient = ctx.createLinearGradient(0, 0, 0, 1024)
      saturnGradient.addColorStop(0, '#6b4423')
      saturnGradient.addColorStop(0.15, '#c49052')
      saturnGradient.addColorStop(0.3, '#daa06d')
      saturnGradient.addColorStop(0.45, '#f0c078')
      saturnGradient.addColorStop(0.55, '#e8b060')
      saturnGradient.addColorStop(0.7, '#d4a050')
      saturnGradient.addColorStop(0.85, '#b88040')
      saturnGradient.addColorStop(1, '#6b4423')
      ctx.fillStyle = saturnGradient
      ctx.fillRect(0, 0, 2048, 1024)
      
      // Add subtle horizontal bands
      for (let y = 0; y < 1024; y += 20) {
        const bandShade = 150 + Math.random() * 80
        ctx.fillStyle = `rgba(${bandShade + 30}, ${bandShade - 10}, ${bandShade - 50}, 0.25)`
        ctx.fillRect(0, y, 2048, Math.random() * 18 + 8)
      }
      
      // Add polar hexagonal storm pattern hint
      ctx.strokeStyle = 'rgba(100, 70, 40, 0.3)'
      ctx.lineWidth = 4
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        const x = 1024 + Math.cos(angle) * 60
        const y = 40 + Math.sin(angle) * 20
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
      break
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

export function Planet({ planet, isActive, onClick, onHover }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  
  const texture = useMemo(() => generatePlanetTexture(planet.type), [planet.type])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed
      
      // Subtle hover effect
      if (isActive) {
        meshRef.current.scale.setScalar(planet.size * (1 + Math.sin(time * 3) * 0.02))
      } else {
        meshRef.current.scale.setScalar(planet.size)
      }
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y = -time * 0.1
      const scale = planet.size * 1.15 * (1 + Math.sin(time * 2) * 0.02)
      glowRef.current.scale.setScalar(scale)
    }
    
    if (atmosphereRef.current && planet.type === 'earth') {
      atmosphereRef.current.rotation.y = time * 0.05
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI * 0.4
      ringRef.current.rotation.z = time * 0.02
    }
  })
  
  return (
    <group position={planet.position}>
      {/* Main planet body */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        <sphereGeometry args={[planet.size, 128, 128]} />
        <meshStandardMaterial 
          map={texture}
          roughness={planet.type === 'earth' ? 0.6 : planet.type === 'mars' ? 0.9 : 0.7}
          metalness={0.05}
          emissive={planet.emissiveColor}
          emissiveIntensity={isActive ? 0.2 : 0.05}
        />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[planet.size * 1.05, 32, 32]} />
        <meshBasicMaterial 
          color={planet.emissiveColor}
          transparent
          opacity={isActive ? 0.25 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Extra atmosphere for Earth */}
      {planet.type === 'earth' && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[planet.size * 1.02, 32, 32]} />
          <meshBasicMaterial 
            color="#87ceeb"
            transparent
            opacity={0.15}
          />
        </mesh>
      )}
      
      {/* Saturn rings */}
      {planet.type === 'saturn' && (
        <mesh ref={ringRef} rotation={[Math.PI * 0.4, 0, 0]}>
          <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
          <meshBasicMaterial 
            color="#d4a574"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}
