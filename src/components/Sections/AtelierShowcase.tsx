'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Real product slug to link to — first featured product
const BESPOKE_PRODUCT_SLUG = 'onyx-monolith-table'

// ─── Video with IntersectionObserver for performance ─────────────────────────
function SmartVideo({ src, className }: { src: string; className?: string }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
    />
  )
}

// ─── Single Row ───────────────────────────────────────────────────────────────
interface AtelierRowProps {
  reversed?: boolean
  videoSrc: string
  imageSrc: string
  title: string
  subtitle: string
  rowRef: React.RefObject<HTMLDivElement | null>
  imageRef: React.RefObject<HTMLDivElement | null>
}

function AtelierRow({ reversed, videoSrc, imageSrc, title, subtitle, rowRef, imageRef }: AtelierRowProps) {
  // Vanilla JS high-performance depth effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    const xOffset = -(x / rect.width) * 12
    const yOffset = -(y / rect.height) * 12
    
    e.currentTarget.style.transform = `translate(${xOffset}px, ${yOffset}px)`
    e.currentTarget.style.boxShadow = `${-xOffset * 3}px ${-yOffset * 3}px 40px rgba(0,0,0,0.6)`
    e.currentTarget.style.transition = 'none'
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `translate(0px, 0px)`
    e.currentTarget.style.boxShadow = `0px 20px 25px -5px rgb(0 0 0 / 0.1), 0px 8px 10px -6px rgb(0 0 0 / 0.1)`
    e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
  }

  return (
    <div
      ref={rowRef}
      className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-5 lg:gap-8 items-stretch`}
    >
      {/* ── Video 55% ── */}
      <div
        className="w-full lg:w-[55%] rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl shadow-black/60 flex-shrink-0"
        style={{ aspectRatio: '21/9' }}
      >
        <SmartVideo
          src={videoSrc}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ── Right Panel 45% ── */}
      <div className="w-full lg:w-[45%] flex flex-col gap-4 justify-center">
        {/* MDF Image */}
        <div
          ref={imageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full overflow-hidden rounded-xl border border-[#C5A059]/30 shadow-xl"
          style={{ aspectRatio: '16/9' }}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/10 via-transparent to-transparent" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] tracking-[0.3em] text-[#C5A059]/70 uppercase">Atelier Series</p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extralight tracking-[0.12em] uppercase text-white leading-tight">
            {title}
          </h2>
          <p className="text-[11px] tracking-[0.15em] text-white/40 uppercase font-light">{subtitle}</p>
          <div className="h-px w-10 bg-[#C5A059]/40" />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            {/* Buy Now → minimalist underline scale */}
            <Link
              href={`/products/${BESPOKE_PRODUCT_SLUG}`}
              className="group relative inline-flex items-center justify-center gap-2 text-white px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-light hover:text-[#C5A059] transition-colors duration-300"
            >
              <span>Buy Now</span>
              <svg
                className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 16 16" fill="none"
              >
                <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {/* Expanding 1px line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 origin-center group-hover:bg-[#C5A059] transition-colors duration-300">
                <div className="absolute inset-0 bg-[#C5A059] scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500 ease-out" />
              </div>
            </Link>

            {/* Consult → admin */}
            <Link
              href="/admin"
              className="flex items-center justify-center border border-[#C5A059]/50 text-[#C5A059] px-5 py-3 text-[11px] uppercase tracking-[0.2em] hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300"
            >
              Consult Bespoke
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function AtelierShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const mdf1Ref = useRef<HTMLDivElement>(null)
  const mdf2Ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Staggered fade-in per row
      ;[row1Ref.current, row2Ref.current].forEach((row) => {
        if (!row) return
        gsap.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%' },
          },
        )
      })

      // Parallax on MDF images only (not on mobile — skip if small screen)
      if (window.innerWidth >= 1024) {
        ;[
          { img: mdf1Ref.current, row: row1Ref.current },
          { img: mdf2Ref.current, row: row2Ref.current },
        ].forEach(({ img, row }) => {
          if (!img || !row) return
          gsap.to(img, {
            y: -50,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          })
        })
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden"
    >
      {/* Subtle background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#C5A059]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#C5A059]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <p className="text-[10px] tracking-[0.4em] text-[#C5A059]/60 uppercase mb-3">Limited Edition</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] uppercase text-white">
            Atelier Showcase
          </h2>
          <div className="mx-auto mt-5 h-px w-12 bg-[#C5A059]/30" />
          <p className="mt-5 text-[11px] tracking-[0.2em] text-white/30 uppercase max-w-sm sm:max-w-md mx-auto leading-relaxed">
            Museum-grade MDF architectural elements, handcrafted to order
          </p>
        </div>

        {/* Row 1 */}
        <AtelierRow
          videoSrc="/assets/videos/craftsmanship.mp4"
          imageSrc="/assets/images/mdf-bespoke-1.jpg"
          title="Geometric I"
          subtitle="Deep charcoal · Gold-leaf inlay · 120cm × 90cm"
          rowRef={row1Ref}
          imageRef={mdf1Ref}
        />

        <div className="my-10 sm:my-14 h-px w-full bg-white/[0.04]" />

        {/* Row 2 — reversed */}
        <AtelierRow
          reversed
          videoSrc="/assets/videos/lifestyle.mp4"
          imageSrc="/assets/images/mdf-bespoke-2.jpg"
          title="Geometric II"
          subtitle="Obsidian black · Recessed brass · 150cm × 120cm"
          rowRef={row2Ref}
          imageRef={mdf2Ref}
        />
      </div>
    </section>
  )
}
