'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinationMap' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Plan a Trip', href: '/tripPlanner' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const scrolled = useScrolled(80)
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── Main Navbar ─────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
         'fixed top-0 left-0 right-0 z-50 h-15 lg:h-20 transition-all duration-500',
          scrolled
            ? 'bg-navy-950/95 pt-5 lg:pt-6'
            : 'bg-transparent pt-4'
        )}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Wanderlust — home"
          >
            <CompassIcon className="w-8 h-8 text-gold-500 transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-display font-semibold text-lg text-sand-100 tracking-tight">
              Cruxadventure
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8" role="navigation">
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="#planner"
              className={cn(
                'hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-medium text-sm',
                'bg-gold-500 text-navy-900 transition-all duration-300',
                'hover:bg-gold-400 hover:shadow-gold hover:-translate-y-0.5',
                'active:translate-y-0'
              )}
            >
              Book Now
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setOpen(o => !o)}
              className="lg:hidden p-2 -mr-2 text-sand-100"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span className="block w-6 space-y-1.5">
                <span className={cn(
                  'block h-0.5 bg-current transition-all duration-300 origin-center',
                  open && 'rotate-45 translate-y-2'
                )} />
                <span className={cn(
                  'block h-0.5 bg-current transition-all duration-300',
                  open && 'opacity-0 scale-x-0'
                )} />
                <span className={cn(
                  'block h-0.5 bg-current transition-all duration-300 origin-center',
                  open && '-rotate-45 -translate-y-2'
                )} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Full-screen Menu ──────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-navy-950 flex flex-col justify-center items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-display-md text-sand-100 hover:text-gold-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-4"
              >
                <Link
                  href="#planner"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold-500 text-navy-900 font-body font-semibold text-base hover:bg-gold-400 transition-colors"
                >
                  Book Now
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Sub-components ───────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative font-body text-sm text-sand-100/80 hover:text-sand-100 transition-colors duration-200 group py-1"
    >
      {children}
      {/* Gold underline slide-in */}
      <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

// function CompassIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
//       <circle cx="12" cy="12" r="9" />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
//     </svg>
//   )
// }

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14.5" stroke="#D4A853" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="10" stroke="#D4A853" strokeWidth="0.75" strokeDasharray="2 3" />
      {/* North needle — gold */}
      <polygon points="16,5 18,16 16,18 14,16" fill="#D4A853" />
      {/* South needle — muted */}
      <polygon points="16,27 18,16 16,14 14,16" fill="#D4A853" fillOpacity="0.3" />
      <circle cx="16" cy="16" r="2" fill="#D4A853" />
    </svg>
  )
}
