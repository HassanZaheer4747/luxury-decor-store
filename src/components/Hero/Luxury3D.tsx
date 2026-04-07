'use client'

import React, { useRef, useEffect, Suspense, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  ContactShadows,
  Environment,
  Lightformer,
  Loader,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ErrorBoundary } from './ErrorBoundary'
import * as THREE from 'three'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

gsap.registerPlugin(ScrollTrigger)
RectAreaLightUniformsLib.init()

/* ═══════════ Responsive Hook ═══════════ */

function useWindowSize() {
  const [size, setSize] = useState({ w: 1200, h: 800 })

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return { ...size, isMobile: size.w < 768 }
}

/* ═══════════ Onyx TorusKnot ═══════════ */

function OnyxTorusKnot({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    meshRef.current.rotation.x = t * 0.12
    meshRef.current.rotation.y = t * 0.08

    /* Mouse parallax — weighty lerp */
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      mouse.current.x * 0.25,
      0.04,
    )
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mouse.current.x * 0.4,
      0.03,
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      0.1 + mouse.current.y * 0.25,
      0.03,
    )
  })

  /* Mobile: balanced scale, centered higher | Desktop: full scale, centered */
  const modelScale = isMobile ? 0.6 : 1.0

  return (
    <mesh ref={meshRef} position={[0, isMobile ? 0.5 : 0.1, 0]} scale={modelScale}>
      <torusKnotGeometry args={[1, 0.35, isMobile ? 128 : 256, isMobile ? 16 : 32]} />
      <MeshTransmissionMaterial
        samples={4}
        resolution={128}
        anisotropicBlur={0.1}
        thickness={2}
        roughness={0.02}
        chromaticAberration={0.05}
        distortion={0.15}
        distortionScale={0.2}
        temporalDistortion={0.1}
        color="#0a0a0a"
        metalness={1}
      />
    </mesh>
  )
}

/* ═══════════ Mouse-Follow Light ═══════════ */

function MouseLight() {
  const lightRef = useRef<THREE.SpotLight>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (!lightRef.current) return
    lightRef.current.position.x = THREE.MathUtils.lerp(
      lightRef.current.position.x,
      mouse.current.x * 6,
      0.05,
    )
    lightRef.current.position.y = THREE.MathUtils.lerp(
      lightRef.current.position.y,
      4 + mouse.current.y * 4,
      0.05,
    )
  })

  return (
    <spotLight
      ref={lightRef}
      position={[0, 8, 8]}
      angle={0.25}
      penumbra={1}
      intensity={1.2}
      color="#ffffff"
    />
  )
}

/* ═══════════ Scene ═══════════ */

function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      {/* Camera — adjusted for better mobile framing */}
      <PerspectiveCamera
        makeDefault
        position={[0, isMobile ? 0.5 : 0, isMobile ? 5 : 5]}
        fov={isMobile ? 65 : 50}
      />

      {/* Let user tilt — proves it's 3D */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        makeDefault
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
      />

      {/* Background synced to pure black */}
      <color attach="background" args={['#000000']} />

      {/* Fog — fades model edges into the void */}
      <fog attach="fog" args={['#000000', 5, 15]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {/* Mouse-follow spotlight */}
      <MouseLight />

      {/* Blue/Purple accent — matches hero vibe */}
      <pointLight position={[-6, 2, -4]} intensity={0.5} color="#6633cc" />
      <pointLight position={[5, -2, -6]} intensity={0.4} color="#2244aa" />

      {/* Cyan accent */}
      <pointLight position={[-8, -4, -8]} intensity={0.4} color="#00e5ff" />

      <OnyxTorusKnot isMobile={isMobile} />

      {/* Grounding shadow */}
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.5}
        scale={10}
        blur={3}
        far={5}
        color="#000000"
      />

      {/* ── The PROPER Luxury Reflections (Reverted as requested) ── */}
      <Environment preset="city" background={false} />
    </>
  )
}



/* ═══════════ Split-Text Reveal ═══════════ */

function SplitTextReveal({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLSpanElement>('.stl')
    if (!els?.length) return

    const ctx = gsap.context(() => {
      gsap.from(els, {
        opacity: 0,
        y: 50,
        rotateX: -90,
        stagger: 0.04,
        duration: 0.9,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      })
    })
    return () => ctx.revert()
  }, [text])

  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-x-3 md:gap-x-5">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="inline-flex" style={{ perspective: 900 }}>
          {word.split('').map((ch, ci) => (
            <span
              key={`${wi}-${ci}`}
              className="stl inline-block text-white font-extralight tracking-[0.08em]"
              style={{
                fontSize: 'clamp(1.5rem, 8vw, 6rem)',
                transformStyle: 'preserve-3d',
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

/* ═══════════ Main Export ═══════════ */

export function Luxury3D() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useWindowSize()
  const [inView, setInView] = useState(true)

  useEffect(() => {
    // 1. Viewport Smart-Pausing
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px 0px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    // 2. GSAP Fade
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 35%',
          scrub: true,
        },
      })
    })

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black mt-[-1px]"
    >
      {/* Top fade — blends seamlessly from hero's black */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20"
        style={{
          height: '15%',
          background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
        }}
      />

      {/* Canvas */}
      <div className="absolute inset-0">
        <ErrorBoundary>
        <Canvas
          frameloop={inView ? 'always' : 'demand'}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
            <Suspense fallback={null}>
              <Scene isMobile={isMobile} />
            </Suspense>
          </Canvas>
          <Loader
            containerStyles={{ background: '#000000' }}
            barStyles={{ background: '#ffffff', height: 2 }}
            dataStyles={{ color: '#ffffff', fontSize: '10px', letterSpacing: '0.3em' }}
          />
        </ErrorBoundary>
      </div>

      {/* Title overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        <SplitTextReveal text="ARCHITECTURAL ELEMENTS" />
      </div>

      {/* Bottom fade — blends into Featured Pieces */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        style={{
          height: '20%',
          background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
        }}
      />
    </section>
  )
}
