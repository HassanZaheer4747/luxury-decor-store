import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { themeInitScript } from '@/providers/Theme/InitTheme'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { AmbientBackgroundWrapper } from '@/components/AmbientBackground/wrapper'
import { TrustElements } from '@/components/TrustElements.client'
import React from 'react'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <TrustElements />
          <AdminBar />
          <LivePreviewListener />

          {/* Ambient 3D dust behind everything */}
          <AmbientBackgroundWrapper />

          {/* Unified ROSHANE Header — z-[9999] fixed */}
          <Header />

          <main className="relative z-10 pt-[80px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
