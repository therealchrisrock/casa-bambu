import React from 'react'
import { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { AdminBar } from './_components/AdminBar'
import { Footer } from './_components/Footer'
import { Header } from './_components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import './_css/app.scss'
import './globals.css'
import { cn } from '@/_lib/utils'
import { Toaster } from '@/_components/ui/sonner'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={cn('min-h-screen flex flex-col font-sans antialiased', fontSans.variable)}>
        <Providers>
          <AdminBar />
          {/* @ts-expect-error */}
          <Header />
          <main className={'flex-1'} id={'mainContent'}>
            {children}
          </main>
          {/* @ts-expect-error */}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  openGraph: mergeOpenGraph(),
}
