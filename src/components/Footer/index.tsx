import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Footer as FooterType } from '@/payload-types'

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []

  return (
    <footer className="w-full bg-black border-t border-white/[0.08] text-white py-16 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm font-light">
        
        {/* Col 1: Heritage */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-xl font-light tracking-[0.35em] uppercase" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Roshane
          </Link>
          <p className="text-white/40 max-w-[200px] leading-relaxed tracking-wider">
            Architectural elements for modern living.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-2">Explore</p>
          <Link href="/atelier" className="text-white/60 hover:text-white transition-colors uppercase tracking-[0.15em] text-xs">Atelier</Link>
          <Link href="/collections" className="text-white/60 hover:text-white transition-colors uppercase tracking-[0.15em] text-xs">Collections</Link>
          <Link href="/bespoke" className="text-white/60 hover:text-white transition-colors uppercase tracking-[0.15em] text-xs">Bespoke</Link>
          {navItems
            .filter((item) => {
              if (item.link?.label && item.link.label.toLowerCase() === 'admin') return false
              return true
            })
            .map((item, index) => {
              if (typeof item.link === 'object' && item.link.url) {
                return (
                  <Link key={index} href={item.link.url} className="text-white/60 hover:text-white transition-colors uppercase tracking-[0.15em] text-xs">
                    {item.link.label}
                  </Link>
                )
              }
              return null
          })}
        </div>

        {/* Col 3: Newsletter */}
        <div className="flex flex-col gap-3 md:items-end">
          <div className="w-full md:w-auto">
            <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase mb-4 md:text-right font-light">Join the Private List</p>
            <div className="flex items-center group">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="bg-transparent border-none border-b border-white/20 focus:border-white outline-none pb-1 text-[11px] tracking-[0.15em] uppercase text-white placeholder:text-white/20 w-[180px] transition-colors duration-300"
                suppressHydrationWarning
              />
              <button type="button" className="text-[10px] font-light uppercase tracking-[0.2em] hover:text-[#c9a84c] border-b border-white/0 hover:border-[#c9a84c] pb-1 transition-all duration-300 ml-4" suppressHydrationWarning>
                Submit
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="container mx-auto mt-16 pt-8 border-t border-white/[0.04] flex flex-col items-center justify-center text-[10px] text-white/20 tracking-[0.2em] uppercase">
        <p>© 2026 ROSHANE. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
