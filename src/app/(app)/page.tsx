import type { Metadata } from 'next'

import { BrandSculptureWrapper } from '@/components/Hero/BrandSculptureWrapper'
import { ProductGrid } from '@/components/ProductGrid'
import { Luxury3DWrapper } from '@/components/Hero/Luxury3DWrapper'
import { AtelierShowcase } from '@/components/Sections/AtelierShowcase'
import { CommissionProcess } from '@/components/Sections/CommissionProcess'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { homeStaticData } from '@/endpoints/seed/home-static'
import React from 'react'
import type { Page } from '@/payload-types'

/* ── ISR: revalidate every 60s ── */
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Roshane | Architectural Luxury Furniture',
  description:
    'Discover premium architectural elements and luxury furniture curated by Roshane for the discerning eye.',
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  /* ── Fetch top 4 published products ── */
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 4,
    sort: '-createdAt',
    draft: false,
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      gallery: true,
      priceInUSD: true,
    },
  })

  /* ── Fetch CMS "home" page (backward-compatible) ── */
  let cmsPage: Page | null = null
  try {
    const { isEnabled: draft } = await draftMode()
    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        and: [
          { slug: { equals: 'home' } },
          ...(draft ? [] : [{ _status: { equals: 'published' as const } }]),
        ],
      },
    })
    cmsPage = result.docs?.[0] || null
  } catch {
    /* CMS page is optional */
  }

  if (!cmsPage) {
    cmsPage = homeStaticData() as Page
  }

  return (
    <article className="-mt-[80px]">
      {/* Section 1: 3D Brand Sculpture — Gold R + Frosted Glass */}
      <BrandSculptureWrapper />

      {/* Section 2: Infinite Glass 3D Showroom (dynamic, no SSR) */}
      <Luxury3DWrapper />

      {/* Section 3: Product Grid (ISR-powered) */}
      <ProductGrid products={products} />

      {/* Section 3.5: Atelier Showcase */}
      <AtelierShowcase />

      {/* Section 4: The Commission Process */}
      <CommissionProcess />
    </article>
  )
}
