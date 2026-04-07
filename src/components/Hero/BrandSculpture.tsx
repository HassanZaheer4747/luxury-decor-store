'use client'

import React, { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Text3D,
  Center,
  Float,
  Environment,
  Lightformer,
  ContactShadows,
  PerspectiveCamera,
} from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ErrorBoundary } from './ErrorBoundary'

gsap.registerPlugin(ScrollTrigger)

const FONT_URL = 'https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_bold.typeface.json'
const LETTERS = 'ROSHANE'.split('')

/* ═════════ Scroll progress shared between HTML & Canvas ═════════ */
const scrollState = { progress: 0 }

/* ═════════ Cinematic Dust ═════════ */

function Dust() {
  const pointsRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 400; i++) {
      temp.push((Math.random() - 0.5) * 20)
      temp.push((Math.random() - 0.5) * 20)
      temp.push((Math.random() - 0.5) * 20 - 2)
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    pointsRef.current.rotation.y = t * 0.015
    pointsRef.current.rotation.x = t * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.03} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

/* ═════════ Ghost Furniture ═════════ */

/* To guarantee instant loading and zero GPU impact, we build the wireframes procedurally 
   instead of an external GLTF, eliminating network requests completely. */
function GhostFurniture({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    if (!groupRef.current || !matRef.current) return
    const p = scrollState.progress
    
    /* Deep parallax: moves up half as fast as the letters */
    groupRef.current.position.y = -1 + p * 2.5
    
    /* Fade out on scroll so it doesn't overlap the product grid below */
    matRef.current.opacity = Math.max(0, 0.03 * (1 - p * 3))
  })

  if (isMobile) return null

  return (
    <group ref={groupRef} position={[0, -1, -5]}>
      <meshBasicMaterial 
        ref={matRef} 
        color="#ffffff" 
        wireframe 
        transparent 
        opacity={0.03} 
        depthWrite={false} 
      />
      
      {/* Architectural Pillar Left */}
      <mesh position={[-6, 4, -4]}>
        <boxGeometry args={[0.5, 12, 0.5, 2, 10, 2]} />
      </mesh>

      {/* Architectural Pillar Right */}
      <mesh position={[6, 4, -2]}>
        <boxGeometry args={[0.8, 12, 0.8, 2, 10, 2]} />
      </mesh>

      {/* Cross Beam */}
      <mesh position={[0, 8, -6]}>
        <boxGeometry args={[16, 0.4, 0.4, 10, 2, 2]} />
      </mesh>
    </group>
  )
}

/* ═════════ Single 3D Letter ═════════ */

interface LetterProps {
  char: string
  index: number
  total: number
  isMobile: boolean
}

function Letter3D({ char, index, total, isMobile }: LetterProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const isR = index === 0

  /* Spread positions: center the word */
  const spacing = isMobile ? 0.32 : 0.85
  const totalWidth = (total - 1) * spacing
  const xBase = -totalWidth / 2 + index * spacing

  /* Each letter gets a unique float speed */
  const floatSpeed = 1 + index * 0.15
  const floatIntensity = 0.08 + (index % 3) * 0.04

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const p = scrollState.progress

    /* ── Mouse interaction: letters face the cursor ── */
    const targetRotY = mouse.current.x * 0.15
    const targetRotX = mouse.current.y * -0.1
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05)
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05)

    /* ── Scroll-driven explode: spread horizontally → shrink → fly up ── */
    const centerOffset = index - (total - 1) / 2
    const spreadX = centerOffset * (p * 5)
    
    const explodeY = p * 4 + Math.cos(index * 1.5) * p * 1.5
    const explodeZ = Math.sin(index * 0.8) * p * 2 - p * 3
    const shrink = Math.max(0.01, 1 - p * 1.5)

    meshRef.current.position.x = xBase + spreadX
    meshRef.current.position.y = explodeY
    meshRef.current.position.z = explodeZ
    meshRef.current.scale.setScalar(shrink * (isMobile ? 0.35 : 1))
  })

  return (
    <Float speed={floatSpeed} rotationIntensity={0.15} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={[xBase, 0, 0]}>
        <Text3D
          font={FONT_URL}
          size={isMobile ? 0.35 : 0.65}
          height={isMobile ? 0.08 : 0.15}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelSegments={3}
          curveSegments={12}
        >
          {char}
          {isR ? (
            /* ── Gold 'R' — the mark of excellence ── */
            <meshStandardMaterial
              color="#c9a84c"
              metalness={1}
              roughness={0.1}
              emissive="#c9a84c"
              emissiveIntensity={0.3}
              envMapIntensity={1.5}
            />
          ) : (
            /* ── Frosted Glass for the rest ── */
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.92}
              thickness={1}
              roughness={0.15}
              metalness={0}
              ior={1.5}
              envMapIntensity={0.8}
              transparent
              opacity={0.9}
            />
          )}
        </Text3D>
      </mesh>
    </Float>
  )
}

/* ═════════ Sweeping Spotlights ═════════ */

function SweepingSpotlights() {
  const mainSpotRef = useRef<THREE.SpotLight>(null)
  const bgScanRef = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Main spotlight sweeping the letters
    if (mainSpotRef.current) {
      mainSpotRef.current.position.x = Math.sin(t * 0.3) * 5
      mainSpotRef.current.position.y = 3 + Math.cos(t * 0.2) * 1.5
      mainSpotRef.current.position.z = 4 + Math.sin(t * 0.15) * 2
    }

    // Background spotlight scanning the ghost furniture for luxury glints
    if (bgScanRef.current) {
      bgScanRef.current.position.x = Math.cos(t * 0.4) * 8
      bgScanRef.current.position.y = 2 + Math.sin(t * 0.3) * 2
      bgScanRef.current.target.position.set(0, 0, -5)
      bgScanRef.current.target.updateMatrixWorld()
    }
  })

  return (
    <>
      <spotLight
        ref={mainSpotRef}
        position={[-3, 2, 3]}
        angle={0.4}
        penumbra={1}
        intensity={4}
        color="#c9a84c"
        castShadow
      />
      
      {/* Background scanner */}
      <spotLight
        ref={bgScanRef}
        position={[0, 2, 0]}
        angle={0.8}
        penumbra={0.5}
        intensity={3}
        color="#a0c0ff"
      />
    </>
  )
}

/* ═════════ Responsive Hook ═════════ */

function useWindowSize() {
  const [isMobile, setIsMobile] = React.useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

/* ═════════ Scene ═════════ */

function BrandScene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, isMobile ? 8 : 7]}
        fov={isMobile ? 55 : 45}
      />

      <fog attach="fog" args={['#000000', 6, 14]} />

      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* Dim blue point light for the glass letters */}
      <pointLight position={[3, -1, 1]} intensity={0.3} color="#2244aa" />

      {/* 3D Letters */}
      <Center>
        <group>
          {LETTERS.map((ch, i) => (
            <Letter3D
              key={i}
              char={ch}
              index={i}
              total={LETTERS.length}
              isMobile={isMobile}
            />
          ))}
        </group>
      </Center>

      {/* Background Ambience */}
      <Dust />
      <GhostFurniture isMobile={isMobile} />

      {/* Floor shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={8}
        blur={3}
        far={4}
        color="#000000"
      />
    </>
  )
}


/* ═════════ Main Export ═════════ */

export function BrandSculpture() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useWindowSize()
  const [inView, setInView] = React.useState(true)

  useEffect(() => {
    // 1. Viewport Smart-Pausing
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px 0px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    // 2. GSAP Scroll Sync
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '30% top',
        scrub: 0.3,
        onUpdate: (self) => {
          scrollState.progress = self.progress
        },
      })
    })

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <div 
      ref={sectionRef} 
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      <ErrorBoundary>
        <Canvas
          frameloop={inView ? 'always' : 'demand'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
          dpr={[1, isMobile ? 1 : 1.5]}
        >
          <Suspense fallback={null}>
            <BrandScene isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Subtitle overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[20%] z-10 flex flex-col items-center gap-4">
        <div className="h-px w-14 bg-white/25" />
        <p className="text-[9px] font-light tracking-[0.4em] uppercase text-white/30 sm:text-[10px]">
          Scroll to explore
        </p>
      </div>
    </div>
  )
}
