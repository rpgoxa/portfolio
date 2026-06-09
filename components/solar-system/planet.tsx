'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Planet as PlanetType } from '@/lib/planet-data'
import {
  buildPlanetShaders,
  ringVertexShader,
  ringFragmentShader,
} from '@/lib/planet-shaders'

interface PlanetProps {
  planet: PlanetType
  isActive: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
}

const RING_INNER = 1.4
const RING_OUTER = 2.2

export function Planet({ planet, isActive, onClick, onHover }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Procedural surface material — one ShaderMaterial per planet type.
  const material = useMemo(() => {
    const { vertexShader, fragmentShader } = buildPlanetShaders(planet.type)
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uActive: { value: 0 },
        uEmissive: { value: new THREE.Color(planet.emissiveColor) },
      },
      vertexShader,
      fragmentShader,
    })
  }, [planet.type, planet.emissiveColor])

  // Banded ring material (Saturn only).
  const ringMaterial = useMemo(() => {
    if (planet.type !== 'saturn') return null
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#e8c89a') },
        uInnerRatio: { value: RING_INNER / RING_OUTER },
      },
      vertexShader: ringVertexShader,
      fragmentShader: ringFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  }, [planet.type])

  useEffect(() => {
    return () => {
      material.dispose()
      ringMaterial?.dispose()
    }
  }, [material, ringMaterial])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    material.uniforms.uTime.value = time
    material.uniforms.uActive.value = THREE.MathUtils.lerp(
      material.uniforms.uActive.value,
      isActive ? 1 : 0,
      0.1
    )

    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed

      // Subtle hover pulse
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
      // rotation.x is set once via JSX; only z drifts here
      ringRef.current.rotation.z = time * 0.02
    }
  })

  return (
    <group position={planet.position}>
      {/* Main planet body — procedural shader surface */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <primitive object={material} attach="material" />
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
          <meshBasicMaterial color="#87ceeb" transparent opacity={0.15} />
        </mesh>
      )}

      {/* Saturn rings — banded procedural alpha */}
      {planet.type === 'saturn' && ringMaterial && (
        <mesh ref={ringRef} rotation={[Math.PI * 0.4, 0, 0]}>
          <ringGeometry args={[planet.size * RING_INNER, planet.size * RING_OUTER, 96]} />
          <primitive object={ringMaterial} attach="material" />
        </mesh>
      )}
    </group>
  )
}
