'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Sun() {
  const sunRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Create sun surface texture procedurally
  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create gradient base
    const gradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 512)
    gradient.addColorStop(0, '#ffffff')
    gradient.addColorStop(0.3, '#fff8e1')
    gradient.addColorStop(0.6, '#ffcc02')
    gradient.addColorStop(0.8, '#ff9500')
    gradient.addColorStop(1, '#ff5722')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 512)
    
    // Add noise/turbulence
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 512
      const size = Math.random() * 8 + 2
      const alpha = Math.random() * 0.3
      ctx.fillStyle = `rgba(255, ${Math.random() * 100 + 155}, 0, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Add solar flare spots
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 512
      const size = Math.random() * 30 + 10
      const gradient2 = ctx.createRadialGradient(x, y, 0, x, y, size)
      gradient2.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
      gradient2.addColorStop(0.5, 'rgba(255, 200, 50, 0.4)')
      gradient2.addColorStop(1, 'rgba(255, 100, 0, 0)')
      ctx.fillStyle = gradient2
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (sunRef.current) {
      sunRef.current.rotation.y = time * 0.05
    }
    
    if (coronaRef.current) {
      coronaRef.current.rotation.z = time * 0.02
      const scale = 1 + Math.sin(time * 2) * 0.02
      coronaRef.current.scale.setScalar(scale)
    }
    
    if (glowRef.current) {
      const glowScale = 1 + Math.sin(time * 1.5) * 0.05
      glowRef.current.scale.setScalar(glowScale)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Core sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial 
          map={sunTexture} 
          color="#ffdd44"
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer corona */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial 
          color="#ff6600" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Lens flare effect - multiple layers */}
      <mesh>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial 
          color="#ff8800" 
          transparent 
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Point light from sun */}
      <pointLight 
        color="#fff5e0" 
        intensity={3} 
        distance={200} 
        decay={1}
      />
    </group>
  )
}
