'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const experiences = [
  {
    id:          'bali-surf',
    category:    'Adventure',
    categoryColor:'bg-emerald-500/15 text-emerald-400',
    title:       'Bali Sunrise Surf Retreat',
    location:    'Canggu, Bali',
    duration:    '7 days',
    priceFrom:   1299,
    rating:      4.9,
    description: 'Chase the perfect wave as the sun breaks over Bali\'s volcanic horizon. Expert coaches, pristine breaks, and evenings spent watching the sky turn gold above the rice paddies.',
    highlights:  ['Daily surf coaching', 'Sunrise temple visit', 'Organic beach dinners'],
    image:       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  },
  {
    id:          'paris-art',
    category:    'Culture',
    categoryColor:'bg-gold-500/15 text-gold-400',
    title:       'Paris Art & Gastronomy Tour',
    location:    'Paris, France',
    duration:    '5 days',
    priceFrom:   2199,
    rating:      4.8,
    description: 'Private museum access before the crowds, a hands-on cooking class in a Marais apartment, and a candlelit dinner in a cave that\'s been serving wine since 1680.',
    highlights:  ['Private Louvre morning access', 'Chef\'s table cooking class', 'Champagne caves at Reims'],
    image:       'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
  },
  {
    id:          'maldives-villa',
    category:    'Luxury',
    categoryColor:'bg-purple-500/15 text-purple-300',
    title:       'Maldives Overwater Villa',
    location:    'North Malé Atoll',
    duration:    '10 days',
    priceFrom:   4499,
    rating:      5.0,
    description: 'A glass floor above a coral garden. A plunge pool with views to the horizon. A butler who knows your name before you land. The Maldives at its most breathtaking.',
    highlights:  ['Private overwater villa', 'Sunrise yoga on the deck', 'Reef diving & manta rays'],
    image:       'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
  },
  {
    id:          'kenya-safari',
    category:    'Safari',
    categoryColor:'bg-amber-500/15 text-amber-400',
    title:       'Kenya Safari & Bush Camp',
    location:    'Masai Mara, Kenya',
    duration:    '8 days',
    priceFrom:   3299,
    rating:      4.9,
    description: 'Track the Big Five across the Mara at golden hour, then return to a candlelit camp under a sky so full of stars you\'ll lose count before midnight.',
    highlights:  ['Private game drives', 'Hot air balloon at dawn', 'Masai village visit'],
    image:       'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  },
  {
    id:          'kyoto-walk',
    category:    'Culture',
    categoryColor:'bg-gold-500/15 text-gold-400',
    title:       'Kyoto Temple & Tea Walk',
    location:    'Kyoto, Japan',
    duration:    '6 days',
    priceFrom:   1699,
    rating:      4.9,
    description: 'A thousand torii gates at dusk, a tea ceremony in a 400-year-old tearoom, and a morning wandering through bamboo so tall the sky disappears.',
    highlights:  ['Fushimi Inari at sunset', 'Private tea ceremony', 'Arashiyama bamboo forest'],
    image:       'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
  },
]

export function ExperienceShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-60px' })

  const active = experiences[activeIdx]
  const total  = experiences.length

  // Wrap around: forward from last goes to first, backward from first goes to last
  function goNext() {
    setActiveIdx((i) => (i + 1) % total)
  }
  function goPrev() {
    setActiveIdx((i) => (i - 1 + total) % total)
  }

  return (
    <section
      ref={sectionRef}
      id="experiences"
      className="relative bg-navy-900 py-20 lg:py-28 overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">

        {/* ── Desktop: two-column layout ────────────────────── */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">

          {/* LEFT — Sticky heading + prev/next controls */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-gold-500" />
                <span className="font-body text-xs tracking-[0.25em] uppercase text-gold-400 font-medium">
                  Curated For You
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-display font-semibold text-display-lg text-sand-100 leading-none mb-4">
                Handpicked{' '}
                <span className="text-gradient-gold">Experiences</span>
              </h2>
              <p className="font-body text-sm text-sand-100/55 leading-relaxed mb-10">
                Five journeys. Five different ways to feel alive. Each one designed down to the last detail.
              </p>

              {/* Counter */}
              <div className="font-display text-display-xl text-gold-500/20 font-semibold leading-none mb-8 select-none">
                {String(activeIdx + 1).padStart(2, '0')}
                <span className="text-display-sm text-sand-100/15"> / {String(total).padStart(2, '0')}</span>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-3" role="group" aria-label="Browse experiences">
                <button
                  onClick={goPrev}
                  aria-label="Previous experience"
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-full',
                    'glass border border-white/10 text-sand-100/70',
                    'hover:text-navy-900 hover:bg-gold-500 hover:border-gold-500',
                    'transition-all duration-300 hover:-translate-x-0.5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  )}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                </button>

                <button
                  onClick={goNext}
                  aria-label="Next experience"
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-full',
                    'bg-gold-500 text-navy-900',
                    'hover:bg-gold-400 hover:shadow-gold',
                    'transition-all duration-300 hover:translate-x-0.5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  )}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                {/* Current experience name — replaces the old nav list's labeling role */}
                <div className="flex-1 min-w-0 pl-1">
                  <p className="font-body text-sm font-medium text-sand-100 truncate">{active.title}</p>
                  <p className="font-body text-xs text-sand-100/40">{active.location}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Active experience card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="group relative overflow-hidden rounded-3xl"
              >
                {/* Main image */}
                <div className="relative h-[420px] lg:h-[580px] overflow-hidden">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    quality={85}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 to-transparent" />
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">

                  {/* Top: category badge */}
                  <div className="flex items-start justify-between mb-auto">
                    <span className={cn('font-body text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10', active.categoryColor)}>
                      {active.category}
                    </span>
                    {/* Rating */}
                    <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="font-body text-xs text-sand-100/90 font-medium">{active.rating}</span>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div>
                    <p className="font-body text-xs text-gold-400/80 tracking-widest uppercase mb-2">{active.location}</p>
                    <h3 className="font-display font-semibold text-display-md text-sand-100 leading-tight mb-3">
                      {active.title}
                    </h3>
                    <p className="font-body text-sm text-sand-100/65 leading-relaxed mb-6 max-w-xl">
                      {active.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-7">
                      {active.highlights.map(h => (
                        <span key={h} className="glass-light font-body text-xs text-sand-100/70 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" />
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* CTA row */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href="#planner"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 text-navy-900 font-body font-semibold text-sm hover:bg-gold-400 hover:shadow-gold transition-all duration-300 hover:-translate-y-0.5"
                      >
                        View Package
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                      <div className="flex items-baseline gap-1">
                        <span className="font-body text-xs text-sand-100/40">From</span>
                        <span className="font-display font-semibold text-xl text-gold-400">${active.priceFrom.toLocaleString()}</span>
                        <span className="font-body text-xs text-sand-100/40">/ person</span>
                      </div>
                      <div className="glass px-3 py-1.5 rounded-full">
                        <span className="font-body text-xs text-sand-100/60">⏱ {active.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile/tablet arrow controls — overlaid on the image for thumb reach */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 lg:hidden pointer-events-none">
                  <button
                    onClick={goPrev}
                    aria-label="Previous experience"
                    className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full glass border border-white/10 text-sand-100/80 active:scale-90 transition-transform"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next experience"
                    className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full glass border border-white/10 text-sand-100/80 active:scale-90 transition-transform"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile dot indicators */}
            <div className="flex justify-center gap-2 mt-6 lg:hidden">
              {experiences.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Go to experience ${i + 1}`}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === activeIdx ? 'w-8 bg-gold-500' : 'w-4 bg-white/20',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}