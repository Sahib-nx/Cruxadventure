'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Compass icon ─────────────────────────────────────────────────────────────

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

// ─── Social icons ─────────────────────────────────────────────────────────────

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth={0} />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// ─── Column heading ───────────────────────────────────────────────────────────

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 font-display text-sm font-semibold uppercase tracking-widest text-sand-100/90">
      {children}
    </h3>
  )
}

// ─── Footer link ──────────────────────────────────────────────────────────────

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('http')
  const cls = 'block font-body text-sm text-sand-100/50 transition-colors duration-200 hover:text-gold-500 py-0.5'
  if (isExternal) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
  }
  return <Link href={href} className={cls}>{children}</Link>
}

// ─── Main footer ──────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-navy-950" aria-label="Site footer">
      {/* Top gold accent line */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.4), rgba(212,168,83,0.7), rgba(212,168,83,0.4), transparent)',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Wordmark */}
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded" aria-label="Wanderlust home">
              <CompassIcon className="h-8 w-8 flex-shrink-0" />
              <span className="font-display text-xl font-semibold tracking-wide text-sand-100">
                Wanderlust
              </span>
            </Link>

            <p className="mb-8 font-body text-sm leading-relaxed text-sand-100/50 max-w-xs">
              Crafting journeys that change how you see the world. Every trip, a story worth telling.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3" aria-label="Social media links">
              {[
                { label: 'Follow us on X (formerly Twitter)', href: 'https://x.com', icon: <IconX /> },
                { label: 'Follow us on Instagram', href: 'https://instagram.com', icon: <IconInstagram /> },
                { label: 'Follow us on Facebook', href: 'https://facebook.com', icon: <IconFacebook /> },
              ].map(({ label, href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sand-100/45 transition-all duration-200 hover:border-gold-500/40 hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <nav aria-label="Quick links">
            <ColHeading>Quick Links</ColHeading>
            <ul className="space-y-1" role="list">
              {[
                { label: 'Home', href: '/' },
                { label: 'Destinations', href: '#destinations' },
                { label: 'Experiences', href: '#experiences' },
                { label: 'Plan a Trip', href: '#planner' },
                { label: 'About Us', href: '#about' },
                { label: 'Blog', href: '#blog' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 — Top Destinations */}
          <nav aria-label="Top destinations">
            <ColHeading>Top Destinations</ColHeading>
            <ul className="space-y-1" role="list">
              {[
                { label: 'Bali, Indonesia', href: '#destinations' },
                { label: 'Santorini, Greece', href: '#destinations' },
                { label: 'Maldives', href: '#destinations' },
                { label: 'Kyoto, Japan', href: '#destinations' },
                { label: 'Patagonia', href: '#destinations' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 4 — Get in Touch */}
          <address className="not-italic">
            <ColHeading>Get in Touch</ColHeading>
            <ul className="space-y-4" role="list">
              {[
                {
                  icon: (
                    <svg className="h-4 w-4 flex-shrink-0 text-gold-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  text: 'hello@wanderlust.travel',
                  href: 'mailto:hello@wanderlust.travel',
                },
                {
                  icon: (
                    <svg className="h-4 w-4 flex-shrink-0 text-gold-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  text: '+1 (800) 926-3357',
                  href: 'tel:+18009263357',
                },
                {
                  icon: (
                    <svg className="h-4 w-4 flex-shrink-0 text-gold-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  text: 'San Francisco, CA',
                  href: null,
                },
              ].map(({ icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-0.5">{icon}</span>
                  {href ? (
                    <a
                      href={href}
                      className="font-body text-sm text-sand-100/55 transition-colors duration-200 hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="font-body text-sm text-sand-100/55">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 sm:flex-row">
          <p className="font-body text-sm text-sand-100/35 text-center sm:text-left">
            © 2025 Wanderlust Travel. All rights reserved.
          </p>
          <nav aria-label="Legal links">
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" role="list">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label, i) => (
                <li key={label} className="flex items-center gap-4">
                  {i > 0 && <span className="h-3 w-px bg-white/15" aria-hidden="true" />}
                  <Link
                    href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="font-body text-sm text-sand-100/35 transition-colors duration-200 hover:text-sand-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}