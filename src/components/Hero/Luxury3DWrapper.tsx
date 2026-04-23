'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

const Luxury3DInner = dynamic(
  () => import('@/components/Hero/Luxury3D').then((m) => m.Luxury3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center bg-black h-screen">
        <div className="text-center">
          <div className="roshane-shimmer mx-auto mb-4 text-2xl font-extralight tracking-[0.4em] text-white/30 uppercase">
            Roshane
          </div>
          <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
    ),
  },
)

export function Luxury3DWrapper() {
  const [isLowPower, setIsLowPower] = useState(false)

  useEffect(() => {
    // Improved detection: skip 3D only on low-end mobile or if explicitly requested
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    const isSmallScreen = window.innerWidth < 768
    
    // Only force low power if BOTH mobile AND small screen
    setIsLowPower(isMobile && isSmallScreen)
  }, [])

  if (isLowPower) {
    return (
      <div className="flex flex-col items-center justify-center bg-black h-[50vh] w-full border-y border-white/[0.05]">
        <h2 className="text-xl md:text-2xl font-extralight tracking-[0.3em] text-white/80 uppercase">
          Architectural Elements
        </h2>
      </div>
    )
  }

  return <Luxury3DInner />
}
