import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/types'
import ScrollToTopProvider from '@/components/providers/ScrollToTopProvider'
import LayoutContent from '@/components/layout/LayoutContent'

// ── Google Font: Plus Jakarta Sans ────────────────────────
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
  display: 'swap',
})

// ── Metadata ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Cruxadventure — Discover the World, Your Way',
    template: '%s | Wanderlust Travel',
  },
  description:
    'Curated luxury travel experiences across 150+ destinations. Expert-guided tours, bespoke itineraries, and unforgettable adventures.',
  keywords: ['travel', 'tours', 'luxury travel', 'destinations', 'adventure', 'vacation'],
  authors: [{ name: 'Wanderlust Travel' }],
  creator: 'Cruxadventure',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://Cruxadventure.travel',
    siteName: 'Cruxadventure Travel',
    title: 'Cruxadventure — Discover the World, Your Way',
    description: 'Curated luxury travel experiences across 150+ destinations.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wanderlust Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wanderlust Travel',
    description: 'Curated luxury travel experiences across 150+ destinations.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ScrollToTopProvider>
          <LayoutContent>

            {children}

          </LayoutContent>
        </ScrollToTopProvider>
      </body>
    </html>
  )
}