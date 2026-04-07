'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HERO_TEXT = 'ROSHANE'

export function VideoHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heroLetters = titleRef.current?.querySelectorAll<HTMLSpanElement>('.hero-letter')
    if (!heroLetters?.length) return

    const ctx = gsap.context(() => {
      /* ── Background zoom ── */
      gsap.fromTo(
        mediaRef.current,
        { scale: 1.0 },
        {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      )

      /* ── Each hero letter flies to its matching navbar letter ── */
      heroLetters.forEach((heroLetter, i) => {
        const navTarget = document.querySelector<HTMLSpanElement>(`[data-nav-letter="${i}"]`)
        if (!navTarget) return

        /* Get positions */
        const heroRect = heroLetter.getBoundingClientRect()
        const navRect = navTarget.getBoundingClientRect()

        /* Calculate the delta from hero letter to its navbar match */
        const deltaX = navRect.left + navRect.width / 2 - (heroRect.left + heroRect.width / 2)
        const deltaY = navRect.top + navRect.height / 2 - (heroRect.top + heroRect.height / 2)

        /* Scale ratio: navbar letter size / hero letter size */
        const scaleTarget = navRect.height / heroRect.height

        gsap.to(heroLetter, {
          x: deltaX,
          y: deltaY,
          scale: scaleTarget,
          opacity: 0,
          filter: 'blur(4px)',
          ease: 'power3.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '25% top',
            scrub: 0.3,
          },
        })
      })

      /* ── Subtitle fade ── */
      if (subtitleRef.current) {
        gsap.to(subtitleRef.current, {
          y: -30,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '15% top',
            scrub: 0.3,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  /* 20 pseudo-random particles */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    dur: `${3 + (i % 5)}s`,
    delay: `${(i * 0.4) % 5}s`,
  }))

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* ── Cinematic Background ── */}
      <div ref={mediaRef} className="absolute inset-0 origin-center will-change-transform">
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse at 25% 40%, rgba(20,10,50,1) 0%, transparent 55%)',
              'radial-gradient(ellipse at 75% 55%, rgba(10,30,60,0.9) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 95%, rgba(0,60,90,0.5) 0%, transparent 55%)',
              'linear-gradient(180deg, #050505 0%, #0a0a0a 100%)',
            ].join(', '),
          }}
        />

        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: p.left,
              top: p.top,
              animation: `heroFloat ${p.dur} ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Hero Copy ── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[9px] font-light tracking-[0.55em] uppercase text-white/40 sm:text-[10px]">
          Roshane Atelier
        </p>

        {/* Split-text: each letter flies to its matching navbar letter on scroll */}
        <div ref={titleRef} className="flex justify-center overflow-visible">
          {HERO_TEXT.split('').map((ch, i) => (
            <span
              key={i}
              className="hero-letter inline-block text-center font-extralight text-white will-change-transform"
              style={{
                fontSize: 'clamp(3rem, 12vw, 10rem)',
                letterSpacing: '0.06em',
                lineHeight: 1,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        <div ref={subtitleRef} className="flex flex-col items-center gap-4">
          <div className="h-px w-14 bg-white/25" />
          <p className="text-[9px] font-light tracking-[0.4em] uppercase text-white/30 sm:text-[10px]">
            Scroll to explore
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: '50%',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 70%, #000000 100%)',
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes heroFloat{0%,100%{transform:translateY(0) scale(1);opacity:.15}50%{transform:translateY(-18px) scale(1.4);opacity:.45}}`,
        }}
      />
    </section>
  )
}
