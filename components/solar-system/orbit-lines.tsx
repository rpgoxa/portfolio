'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { planets } from '@/lib/planet-data'

export function OrbitLines() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.01
    }
  })
  
  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {planets.map((planet) => (
        <mesh key={planet.id}>
          <ringGeometry args={[planet.orbitRadius - 0.05, planet.orbitRadius + 0.05, 128]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
