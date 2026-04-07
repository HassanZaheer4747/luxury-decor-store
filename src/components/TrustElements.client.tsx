'use client'

import React, { useEffect } from 'react'
import Lenis from 'lenis'
import { motion, useScroll, useSpring } from 'framer-motion'

export function TrustElements() {
  /* 1. Smooth Scroll (Lenis) */
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.4, // Extremely fast, snappy lerp to eliminate floating feeling
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  /* 2. Gold 'Trust' Progress line */
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[10000] h-[2px] bg-[#c9a84c] origin-left"
      style={{ scaleX }}
    />
  )
}
