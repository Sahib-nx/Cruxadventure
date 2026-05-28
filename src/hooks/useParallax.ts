'use client'

import { useState, useEffect, useCallback } from 'react'

interface ParallaxValues {
  x: number  // -1 to 1 range
  y: number  // -1 to 1 range
}

/**
 * useParallax — tracks mouse position normalized to -1 → 1.
 *
 * Used by HeroSection for the subtle text layer parallax.
 * Smoothed with lerp for buttery movement.
 *
 * @param strength  How many px the element moves at max offset (default: 20)
 */
export function useParallax(strength = 20) {
  const [values, setValues] = useState<ParallaxValues>({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = ((e.clientX / window.innerWidth)  - 0.5) * 2  // -1 to 1
    const y = ((e.clientY / window.innerHeight) - 0.5) * 2  // -1 to 1
    setValues({ x: x * strength, y: y * strength })
  }, [strength])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return values
}