'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

const BrandSculptureInner = dynamic(
  () => import('@/components/Hero/BrandSculpture').then((m) => m.BrandSculpture),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-black h-screen">
        <div className="text-center">
          <div className="roshane-shimmer mx-auto mb-4 text-4xl font-extralight tracking-[0.4em] text-white/20 uppercase">
            Roshane
          </div>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
    ),
  },
)

export function BrandSculptureWrapper() {
  const [isLowPower, setIsLowPower] = useState(false)

  useEffect(() => {
    // Skip 3D on ALL mobile devices — prevents WebGL context exhaustion
    const isMobile = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    setIsLowPower(isMobile)
  }, [])

  if (isLowPower) {
    return (
      <div className="flex flex-col items-center justify-center bg-black h-screen w-full relative z-10">
        <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.4em] text-white uppercase" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
          Roshane
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mt-8">
          Architectural Elements
        </p>
      </div>
    )
  }

  return <BrandSculptureInner />
}
