'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Product, Media as MediaType } from '@/payload-types'

gsap.registerPlugin(ScrollTrigger)

interface ProductGridProps {
  products: Partial<Product>[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll<HTMLElement>('.p-card')
    if (!cards?.length) return

    const ctx = gsap.context(() => {
      /* Stagger card entrance */
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    })
    return () => ctx.revert()
  }, [products])

  if (!products?.length) return null

  return (
    <section ref={sectionRef} className="relative bg-black py-12 sm:py-16 md:py-20 lg:py-28 text-white">
      <div className="container relative z-10 px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10 sm:mb-14 md:mb-20 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-light tracking-[0.3em] text-white">
            FEATURED PIECES
          </h2>
          <div className="mx-auto mt-4 sm:mt-6 h-px w-10 sm:w-14 bg-white/20" />
        </div>

        {/* Cards — responsive grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4 lg:gap-6"
        >
          {products.map((product) => {
            const raw = product.gallery?.[0]?.image
            const image = raw && typeof raw === 'object' ? (raw as MediaType) : null

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                data-cursor-grow
                className="p-card group block"
              >
                {/* ── Onyx Card ── */}
                <div className="relative aspect-[3/4] sm:aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-[#0c0c0c] border border-white/[0.06] transition-colors duration-500 group-hover:bg-[#151515]">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || product.title || ''}
                      fill
                      className="object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 sepia-[.20] group-hover:scale-105"
                      sizes="(max-width:640px) 50vw,(max-width:1024px) 50vw,25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] sm:text-[10px] tracking-[0.4em] text-white/20 uppercase">
                        Coming Soon
                      </span>
                    </div>
                  )}

                  {/* Hover overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Price badge — revealed on hover */}
                  {typeof product.priceInUSD === 'number' && (
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="text-[10px] sm:text-xs font-light tracking-[0.2em] text-white/80">
                        $
                        {product.priceInUSD.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="mt-2 sm:mt-4 pt-1 pb-2 sm:pb-4">
                  <h3 className="p-title text-[10px] sm:text-xs md:text-sm font-light uppercase tracking-[0.1em] sm:tracking-widest opacity-60 duration-500 ease-out group-hover:opacity-100 group-hover:tracking-[0.2em] sm:group-hover:tracking-[0.3em] text-white transition-all transform translate-y-2 group-hover:translate-y-0 line-clamp-1">
                    {product.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
