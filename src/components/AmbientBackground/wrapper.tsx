'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const AmbientBg = dynamic(
  () => import('@/components/AmbientBackground').then((m) => m.AmbientBackground),
  { ssr: false },
)

export function AmbientBackgroundWrapper() {
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    // Check if WebGL is available before attempting to create another context
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      if (gl) {
        // Immediately lose this test context so it doesn't count against the limit
        const loseCtx = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')
        loseCtx?.loseContext()
        setCanRender(true)
      }
    } catch {
      // WebGL not available — silently skip
    }
  }, [])

  if (!canRender) return null

  return <AmbientBg />
}
