'use client'

import { useState, useEffect } from 'react'

/**
 * useScrolled — returns true once page has scrolled past `threshold` px.
 *
 * Used by Navbar to switch from transparent → frosted-glass.
 *
 * @param threshold  px from top to trigger (default: 80)
 */
export function useScrolled(threshold = 80): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold)
    }

    // Check on mount (e.g. if user refreshes mid-page)
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}