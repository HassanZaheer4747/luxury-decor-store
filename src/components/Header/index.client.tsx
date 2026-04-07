'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { usePathname } from 'next/navigation'
import type { Header } from 'src/payload-types'

type KiBlast = { id: number; x: number; y: number }

/* ═══════════════════════════════════════════════════
   Custom Cursor — white dot with lagged ring,
   mix-blend-mode: difference for 3D readability
   ═══════════════════════════════════════════════════ */

function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('[data-cursor-grow]') || t.closest('a') || t.closest('button')) setHovering(true)
    }
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('[data-cursor-grow]') || t.closest('a') || t.closest('button'))
        setHovering(false)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    let raf: number
    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px,${mouse.current.y - 4}px)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${pos.current.x - 24}px,${pos.current.y - 24}px) scale(${hovering ? 2.2 : 1})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [hovering])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10001] pointer-events-none hidden md:block"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#fff',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10001] pointer-events-none hidden md:block"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.5)',
          background: hovering ? 'rgba(255,255,255,0.06)' : 'transparent',
          mixBlendMode: 'difference',
          transition: 'transform 0.25s cubic-bezier(.23,1,.32,1), background 0.3s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}

/* ═══════════════════════════════════════════════════
   Unified ROSHANE Header — single source of truth.
   Left: ROSHANE serif logo
   Center: Nav links (CMS-driven + fallbacks)
   Right: Cart icon with live Payload counter
   ═══════════════════════════════════════════════════ */

type Props = { header: Header }

const fallbackLinks = [
  { label: 'Collections', href: '/shop' },
  { label: 'About', href: '/about' },
]

export function RoshaneHeader({ header }: Props) {
  const cmsMenu = header?.navItems || []
  const pathname = usePathname()

  const [blasts, setBlasts] = useState<KiBlast[]>([])
  const [isShaking, setIsShaking] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  /* ── Cart count from Payload ── */
  let totalQuantity: number | undefined
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { cart } = useCart()
    totalQuantity =
      cart?.items?.reduce(
        (q: number, item: { quantity?: number }) => (item.quantity || 0) + q,
        0,
      ) || undefined
  } catch {
    /* Cart provider not available */
  }

  /* ── Ki Blast ── */
  const spawnBlast = useCallback((e: React.MouseEvent) => {
    const id = Date.now() + Math.random()
    setBlasts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 300)
    setTimeout(() => setBlasts((prev) => prev.filter((b) => b.id !== id)), 600)
  }, [])

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const linkStyle: React.CSSProperties = {
    textShadow: isShaking ? '1px 0 #ff3333, -1px 0 #3366ff' : 'none',
    transition: 'text-shadow 0.1s ease, color 0.3s ease',
  }

  /* Build link list: CMS items first, then fallback */
  const navItems =
    cmsMenu.length > 0
      ? cmsMenu.map((item) => ({
          label: item.link.label || '',
          href: item.link.url || '/',
        }))
      : fallbackLinks

  return (
    <>
      <LuxuryCursor />

      {/* ═══ GLASS NAVBAR ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-[9999] border-b border-white/[0.06] bg-transparent backdrop-blur-[12px]"
        style={{ mixBlendMode: 'normal', cursor: 'none' }}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-5">
          {/* ── Left: ROSHANE logo ── */}
          <Link
            href="/"
            data-cursor-grow
            className="text-lg font-light tracking-[0.4em] text-white uppercase md:text-xl"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            {'ROSHANE'.split('').map((ch, i) => (
              <span key={i} data-nav-letter={i} className="inline-block gold-sheen">
                {ch}
              </span>
            ))}
          </Link>

          {/* ── Center: Desktop links ── */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor-grow
                onClick={spawnBlast}
                className="text-[11px] font-light tracking-[0.25em] text-white/60 uppercase hover:text-white transition-colors duration-300"
                style={linkStyle}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right: Cart ── */}
          <div className="flex items-center gap-4">
            <Link
              href="/checkout"
              data-cursor-grow
              onClick={spawnBlast}
              className="flex items-center gap-2 text-[11px] font-light tracking-[0.2em] text-white/60 uppercase hover:text-white transition-colors duration-300"
              style={linkStyle}
            >
              <ShoppingCart size={15} />
              {totalQuantity ? (
                <span className="text-[9px] text-cyan-400 tabular-nums">{totalQuantity}</span>
              ) : null}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={(e) => {
                spawnBlast(e)
                setMobileOpen((o) => !o)
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile fullscreen menu (Luxury Reveal) ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
              className="md:hidden fixed inset-0 top-0 bg-black/95 backdrop-blur-3xl z-[9998] flex flex-col items-center justify-center gap-12 pt-20"
            >
              <div className="flex flex-col items-center gap-10">
                {navItems.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        spawnBlast(e)
                        setMobileOpen(false)
                      }}
                      className="text-3xl font-extralight tracking-[0.25em] text-white/80 uppercase hover:text-white"
                      style={linkStyle}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/checkout"
                  onClick={(e) => {
                    spawnBlast(e)
                    setMobileOpen(false)
                  }}
                  className="text-lg font-extralight tracking-[0.2em] text-white/40 uppercase hover:text-white flex items-center gap-4 mt-8 border-t border-white/10 pt-8"
                >
                  <ShoppingCart size={20} />
                  Cart {totalQuantity ? `(${totalQuantity})` : ''}
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Ki Blast FX Layer ── */}
      <div className="fixed inset-0 pointer-events-none z-[10000]">
        <AnimatePresence>
          {blasts.map((b) => (
            <motion.div
              key={b.id}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute rounded-full"
              style={{
                left: b.x - 100,
                top: b.y - 100,
                width: 200,
                height: 200,
                background:
                  'radial-gradient(circle, #00ffff 0%, rgba(0,255,255,0.15) 40%, transparent 70%)',
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

/* ─────────── Reusable Ki Spark (for Add-to-Cart etc.) ─────────── */

export function useKiSpark() {
  const [sparks, setSparks] = useState<KiBlast[]>([])

  const triggerSpark = useCallback((e: React.MouseEvent) => {
    const id = Date.now() + Math.random()
    setSparks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setSparks((prev) => prev.filter((s) => s.id !== id)), 500)
  }, [])

  const SparkLayer = () => (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{
              left: s.x - 40,
              top: s.y - 40,
              width: 80,
              height: 80,
              background:
                'radial-gradient(circle, rgba(0,255,255,0.9) 0%, rgba(0,200,255,0.3) 40%, transparent 70%)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )

  return { triggerSpark, SparkLayer }
}
