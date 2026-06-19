'use client'

/**
 * SafeImage
 *
 * Drop-in wrapper around next/image that never crashes the page.
 *
 * Why this exists:
 * next/image throws a hard, render-crashing error if `src` points at a
 * hostname not listed in next.config.ts's `images.remotePatterns` — and
 * this app stores admin-entered image URLs (thumbnail, heroImage, gallery)
 * that aren't validated against that allowlist at write time. A single bad
 * URL (e.g. a Google Images search thumbnail like
 * encrypted-tbn0.gstatic.com, or a Drive/Photos share link) crashes
 * whatever page renders it — the destination grid, the detail hero, the
 * gallery, all of it.
 *
 * SafeImage checks the hostname against the SAME allowlist configured in
 * next.config.ts before ever calling next/image, and also catches runtime
 * 404s via onError. Either case falls back to a plain <img> pointed at a
 * known-safe local fallback image instead of crashing.
 *
 * IMPORTANT: keep ALLOWED_HOSTS in sync with next.config.ts's
 * images.remotePatterns. If you add a host to one, add it to the other.
 */

import { useState } from 'react'
import type React from 'react'
import Image, { type ImageProps } from 'next/image'

const ALLOWED_HOSTS = [
  'images.unsplash.com',
  'plus.unsplash.com',
  'res.cloudinary.com',
  'www.bikatadventures.com',
  'upload.wikimedia.org',
  'www.historywithtravel.com',
  'himalayandaredevils.com',
  'kashmirmountains.com',
  'cdn.kimkim.com',
  'himalayanhikers.in',
  'gstreksnepal.com',
  'www.nepalecotrekking.com',
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
]

const DEFAULT_FALLBACK = '/BgImg.jpg'

function isAllowedHost(src: string): boolean {
  if (!src) return false
  if (src.startsWith('/')) return true // local /public assets
  try {
    return ALLOWED_HOSTS.includes(new URL(src).hostname)
  } catch {
    return false
  }
}

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string | null | undefined
  fallbackSrc?: string
}

export function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, className, fill, style, ...rest }: SafeImageProps) {
  const [runtimeFailed, setRuntimeFailed] = useState(false)

  const trimmedSrc = src?.trim() || ''
  const hostAllowed = isAllowedHost(trimmedSrc)

  // `fill` is a next/image-only prop — it isn't real CSS/HTML and does
  // nothing on a plain <img>. next/image translates it internally into
  // `position: absolute; inset: 0; width: 100%; height: 100%`. Our plain
  // <img> fallback paths below must replicate that manually, or the
  // fallback renders at its natural intrinsic size instead of filling the
  // relative parent box — which is exactly what caused the hero image to
  // bleed over the gallery instead of staying inside its fixed-height box.
  const fillStyle: React.CSSProperties = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style }
    : (style ?? {})

  // Case 1: empty src, or host not whitelisted — never even attempt
  // next/image, since that's the exact condition that throws synchronously.
  // Render a plain <img> so an unconfigured host can never crash render.
  if (!trimmedSrc || !hostAllowed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmedSrc && !hostAllowed ? trimmedSrc : fallbackSrc}
        alt={alt}
        className={className}
        style={fillStyle}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = fallbackSrc
        }}
      />
    )
  }

  // Case 2: host is allowed, but the file itself failed to load at runtime
  // (404, deleted asset, etc.) — fall back the same way.
  if (runtimeFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fallbackSrc} alt={alt} className={className} style={fillStyle} />
    )
  }

  // Case 3: normal path — host is allowed, use real next/image for
  // optimization, with onError as a safety net for runtime failures.
  return (
    <Image
      src={trimmedSrc}
      alt={alt}
      className={className}
      fill={fill}
      style={style}
      onError={() => setRuntimeFailed(true)}
      {...rest}
    />
  )
}

export default SafeImage