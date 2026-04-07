import React from 'react'

export function CommissionProcess() {
  const steps = [
    {
      num: 'I',
      title: 'Vision',
      desc: 'An intimate consultation to explore your architectural intent, spatial requirements, and aesthetic aspirations.',
    },
    {
      num: 'II',
      title: 'Curation',
      desc: 'Sourcing the finest materials—formulated from natural onyx, brass, and bespoke MDF carvings tailored to your space.',
    },
    {
      num: 'III',
      title: 'Manifestation',
      desc: 'Hand-crafted realization of the piece by master artisans, delivered and installed with absolute precision.',
    },
  ]

  return (
    <section className="relative w-full bg-black text-white py-32 sm:py-48 px-6 lg:px-12 border-t border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-24 md:mb-32 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C5A059] mb-4">
            Bespoke Creation
          </p>
          <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase max-w-3xl leading-snug">
            The Commission Process
          </h2>
        </div>

        {/* 3 Thin Vertical Lines Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-r border-white/[0.08]">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`
                flex flex-col items-center text-center py-16 px-8
                ${idx !== 2 ? 'border-b md:border-b-0 md:border-r border-white/[0.08]' : ''}
                hover:bg-white/[0.02] transition-colors duration-500
              `}
            >
              <div className="h-24 w-px bg-gradient-to-b from-transparent via-[#C5A059]/40 to-transparent mb-10" />
              
              <span className="text-sm font-extralight text-[#C5A059] tracking-[0.2em] mb-4">
                {step.num}.
              </span>
              
              <h3 className="text-xl md:text-2xl font-extralight tracking-[0.25em] uppercase mb-6">
                {step.title}
              </h3>
              
              <p className="text-xs font-extralight text-white/40 tracking-wider leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
