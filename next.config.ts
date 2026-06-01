import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Original Unsplash domains
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // Domains added for the Kashmir & Nepal destinations
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
    ],
  },
}

export default nextConfig