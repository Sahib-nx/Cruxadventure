import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.bikatadventures.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.historywithtravel.com',
      },
      {
        protocol: 'https',
        hostname: 'himalayandaredevils.com',
      },
      {
        protocol: 'https',
        hostname: 'kashmirmountains.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.kimkim.com',
      },
      {
        protocol: 'https',
        hostname: 'himalayanhikers.in',
      },
      {
        protocol: 'https',
        hostname: 'gstreksnepal.com',
      },
      {
        protocol: 'https',
        hostname: 'www.nepalecotrekking.com',
      },
      // ── Direct Google image-CONTENT hosts (NOT share-link viewer pages) ──
      // lh3/lh4/lh5/lh6 are Google's actual image CDN — these serve raw
      // image bytes and are safe for next/image. drive.google.com and
      // photos.google.com are intentionally NOT whitelisted: those are
      // HTML viewer pages, not images, and are rejected at the form/API
      // validation layer instead of being allowed here.
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig