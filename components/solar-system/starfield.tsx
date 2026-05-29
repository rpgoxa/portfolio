'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Starfield() {
  const starsRef = useRef<THREE.Points>(null)
  const dustRef = useRef<THREE.Points>(null)
  
  const [starPositions, starColors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    const colors = new Float32Array(2000 * 3)
    
    for (let i = 0; i < 2000; i++) {
      const i3 = i * 3
      // Distribute stars in a sphere around the scene
      const radius = 200 + Math.random() * 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      // Star colors - mostly white with hints of blue and yellow
      const colorRandom = Math.random()
      if (colorRandom < 0.7) {
        // White/slightly blue
        colors[i3] = 0.9 + Math.random() * 0.1
        colors[i3 + 1] = 0.9 + Math.random() * 0.1
        colors[i3 + 2] = 1
      } else if (colorRandom < 0.9) {
        // Yellow/orange
        colors[i3] = 1
        colors[i3 + 1] = 0.8 + Math.random() * 0.2
        colors[i3 + 2] = 0.6 + Math.random() * 0.2
      } else {
        // Blue
        colors[i3] = 0.6 + Math.random() * 0.2
        colors[i3 + 1] = 0.7 + Math.random() * 0.2
        colors[i3 + 2] = 1
      }
    }
    
    return [positions, colors]
  }, [])
  
  const [dustPositions, dustSizes] = useMemo(() => {
    const positions = new Float32Array(500 * 3)
    const sizes = new Float32Array(500)
    
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3
      // Dust particles closer to the orbital plane
      positions[i3] = (Math.random() - 0.5) * 200
      positions[i3 + 1] = (Math.random() - 0.5) * 30
      positions[i3 + 2] = (Math.random() - 0.5) * 200
      sizes[i] = Math.random() * 0.5 + 0.1
    }
    
    return [positions, sizes]
  }, [])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.002
      starsRef.current.rotation.x = Math.sin(time * 0.001) * 0.02
    }
    
    if (dustRef.current) {
      dustRef.current.rotation.y = time * 0.01
    }
  })
  
  return (
    <group>
      {/* Main starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Space dust/nebula particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#6666aa"
          transparent
          opacity={0.1}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
