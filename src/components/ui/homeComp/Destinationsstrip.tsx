'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { destinations } from '@/data/destination'
import { cn } from '@/lib/utils'

const tagColors: Record<string, string> = {
  Beach:     'bg-ocean-500/20 text-ocean-400',
  Culture:   'bg-gold-500/20 text-gold-400',
  Luxury:    'bg-purple-500/20 text-purple-300',
  Adventure: 'bg-emerald-500/20 text-emerald-400',
  Spiritual: 'bg-rose-500/20 text-rose-300',
  Nature:    'bg-lime-500/20 text-lime-400',
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

export function DestinationsStrip() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="destinations" className="relative bg-navy-900 py-20 lg:py-28 overflow-hidden">

      {/* Subtle top border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">

        {/* ── Heading row ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-gold-500" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-gold-400 font-medium">
                Top Destinations
              </span>
            </div>
            <h2 className="font-display font-semibold text-display-lg text-sand-100 leading-none">
              Where Will You{' '}
              <span className="text-gradient-gold">Go Next?</span>
            </h2>
          </div>
          <Link
            href="/destinationMap"
            className="inline-flex items-center gap-2 font-body text-sm text-sand-100/60 hover:text-gold-400 transition-colors duration-200 group shrink-0"
          >
            View all destinations
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        {/* ── Cards grid ──────────────────────────────────────── */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              variants={cardVariants}
              className={cn(
                'group relative overflow-hidden rounded-2xl cursor-pointer',
                // First card is wider on large screens
                i === 0 ? 'lg:col-span-2 lg:row-span-1' : 'lg:col-span-1',
              )}
            >
              {/* Image */}
              <div className={cn(
                'relative overflow-hidden',
                i === 0 ? 'h-72 lg:h-80' : 'h-64 lg:h-72',
              )}>
                <Image
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  fill
                  sizes={i === 0
                    ? '(max-width: 1024px) 100vw, 40vw'
                    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw'
                  }
                  quality={80}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-card-gradient" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />

                {/* Hover shine sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                {/* Top tags */}
                <div className="flex flex-wrap gap-1.5 mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {dest.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className={cn(
                        'text-[10px] font-body font-medium px-2 py-0.5 rounded-full backdrop-blur-sm',
                        tagColors[tag] ?? 'bg-white/10 text-sand-100/70',
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Name & country */}
                <h3 className="font-display font-semibold text-sand-100 text-xl leading-tight mb-0.5">
                  {dest.name}
                </h3>
                <p className="font-body text-xs text-sand-100/60 mb-3">
                  {dest.country}
                </p>

                {/* Bottom row: price + rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-[10px] text-sand-100/40 uppercase tracking-wider">From</span>
                    <span className="font-display font-semibold text-gold-400 text-base ml-1.5">
                      ${dest.priceFrom.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 glass px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="font-body text-[10px] text-sand-100/80 font-medium">{dest.rating}</span>
                  </div>
                </div>

                {/* CTA — visible on hover */}
                <div className="mt-3 overflow-hidden h-0 group-hover:h-9 transition-all duration-300">
                  <Link
                    href="/contact"
                    className="flex items-center justify-center w-full py-2 rounded-xl bg-gold-500 text-navy-900 font-body font-semibold text-xs hover:bg-gold-400 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

              {/* Best season badge — top right */}
              <div className="absolute top-4 right-4 glass px-2.5 py-1 rounded-full">
                <span className="font-body text-[10px] text-sand-100/70">
                  {dest.bestSeason.split('–')[0].trim()}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
    </section>
  )
}