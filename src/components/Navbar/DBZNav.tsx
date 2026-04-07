'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'

type KiBlast = { id: number; x: number; y: number }

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

/* ─────────── Custom Cursor ─────────── */

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
      if (t.closest('[data-cursor-grow]') || t.closest('a') || t.closest('button')) {
        setHovering(true)
      }
    }

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('[data-cursor-grow]') || t.closest('a') || t.closest('button')) {
        setHovering(false)
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    let raf: number
    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${pos.current.x - 24}px, ${pos.current.y - 24}px) scale(${hovering ? 2.2 : 1})`
      }
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
      {/* White dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none hidden md:block"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#ffffff',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
      />
      {/* Expanding ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none hidden md:block"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.5)',
          background: hovering ? 'rgba(255,255,255,0.06)' : 'transparent',
          mixBlendMode: 'difference',
          transition: 'transform 0.25s cubic-bezier(0.23,1,0.32,1), background 0.3s ease',
          willChange: 'transform',
        }}
      />
    </>
  )
}

/* ─────────── Main Nav ─────────── */

export function DBZNav() {
  const [blasts, setBlasts] = useState<KiBlast[]>([])
  const [isShaking, setIsShaking] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  let totalQuantity: number | undefined
  try {
    const { cart } = useCart()
    totalQuantity =
      cart?.items?.reduce((q: number, item: { quantity?: number }) => (item.quantity || 0) + q, 0) ||
      undefined
  } catch {
    /* Cart provider might not wrap this page */
  }

  const spawnBlast = useCallback((e: React.MouseEvent) => {
    const id = Date.now() + Math.random()
    setBlasts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 300)
    setTimeout(() => setBlasts((prev) => prev.filter((b) => b.id !== id)), 600)
  }, [])

  const linkStyle: React.CSSProperties = {
    textShadow: isShaking ? '1px 0 #ff3333, -1px 0 #3366ff' : 'none',
    transition: 'text-shadow 0.1s ease, color 0.3s ease',
  }

  return (
    <>
      {/* ── Custom Cursor ── */}
      <LuxuryCursor />

      {/* ── Glass Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/25 backdrop-blur-xl"
        style={{ cursor: 'none' }}
      >
        <div className="container mx-auto flex items-baseline justify-between px-6 py-4">
          {/* Logo */}
          <Link
            href="/"
            data-cursor-grow
            className="text-xl font-extralight tracking-[0.35em] text-white uppercase"
          >
            Luxe
          </Link>

          {/* Desktop: Center links */}
          <div className="hidden md:flex items-baseline gap-10">
            {navLinks.map((link) => (
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

          {/* Desktop: Cart */}
          <Link
            href="/checkout"
            data-cursor-grow
            onClick={spawnBlast}
            className="hidden md:flex items-baseline gap-2 text-[11px] font-light tracking-[0.25em] text-white/60 uppercase hover:text-white transition-colors duration-300"
            style={linkStyle}
          >
            <ShoppingCart size={14} className="relative" style={{ top: 2 }} />
            <span>Cart</span>
            {totalQuantity ? (
              <span className="ml-0.5 text-[9px] text-cyan-400">{totalQuantity}</span>
            ) : null}
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-white/[0.06] bg-black/40 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-4 px-6 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      spawnBlast(e)
                      setMobileOpen(false)
                    }}
                    className="text-sm font-light tracking-[0.2em] text-white/70 uppercase hover:text-white"
                    style={linkStyle}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/checkout"
                  onClick={(e) => {
                    spawnBlast(e)
                    setMobileOpen(false)
                  }}
                  className="text-sm font-light tracking-[0.2em] text-white/70 uppercase hover:text-white flex items-center gap-2"
                >
                  <ShoppingCart size={14} />
                  Cart {totalQuantity ? `(${totalQuantity})` : ''}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Ki Blast FX Layer ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
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

/* ─────────── Reusable Ki-spark for Add-to-Cart buttons ─────────── */

export function useKiSpark() {
  const [sparks, setSparks] = useState<KiBlast[]>([])

  const triggerSpark = useCallback((e: React.MouseEvent) => {
    const id = Date.now() + Math.random()
    setSparks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setSparks((prev) => prev.filter((s) => s.id !== id)), 500)
  }, [])

  const SparkLayer = () => (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9998 }}>
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
