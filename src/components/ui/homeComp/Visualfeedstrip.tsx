'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

const feedImages = [
  {
    id:          '1',
    src:         'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    destination: 'Bali, Indonesia',
    handle:      '@wanderlust.bali',
    span:        'row-span-2',  // tall
    likes:       '4.2k',
  },
  {
    id:          '2',
    src:         'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    destination: 'Santorini, Greece',
    handle:      '@wanderlust.greece',
    span:        'row-span-1',
    likes:       '6.1k',
  },
  {
    id:          '3',
    src:         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    destination: 'Surf, Canggu',
    handle:      '@wanderlust.surf',
    span:        'row-span-1',
    likes:       '2.8k',
  },
  {
    id:          '4',
    src:         'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    destination: 'Kyoto, Japan',
    handle:      '@wanderlust.japan',
    span:        'row-span-2',  // tall
    likes:       '8.4k',
  },
  {
    id:          '5',
    src:         'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    destination: 'Masai Mara, Kenya',
    handle:      '@wanderlust.africa',
    span:        'row-span-1',
    likes:       '5.3k',
  },
  {
    id:          '6',
    src:         'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    destination: 'Maldives',
    handle:      '@wanderlust.maldives',
    span:        'row-span-1',
    likes:       '9.7k',
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cellVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      type: 'tween',
      ease: 'easeOut',
    },
  },
}

export function VisualFeedStrip() {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, margin: '-60px' })
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="relative bg-navy-900 py-20 lg:py-28">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">

        {/* ── Heading ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-gold-500" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-gold-400 font-medium">
                Follow Our Journey
              </span>
            </div>
            <h2 className="font-display font-semibold text-display-lg text-sand-100 leading-none">
              The World Through{' '}
              <span className="text-gradient-gold">Our Lens</span>
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm text-sand-100/60 hover:text-gold-400 transition-colors duration-200 group shrink-0"
            aria-label="Follow us on Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
            @wanderlust.travel
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </motion.div>

        {/* ── Masonry grid ─────────────────────────────────────── */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-3 lg:gap-4"
        >
          {feedImages.map((img) => (
            <motion.div
              key={img.id}
              variants={cellVariants}
              onMouseEnter={() => setHovered(img.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'group relative overflow-hidden rounded-2xl cursor-pointer',
                img.span,
              )}
            >
              {/* Image */}
              <Image
                src={img.src}
                alt={img.destination}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={75}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />

              {/* Hover overlay */}
              <div className={cn(
                'absolute inset-0 bg-navy-900/50 transition-opacity duration-300',
                hovered === img.id ? 'opacity-100' : 'opacity-0',
              )} />

              {/* Content — always visible at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-display font-medium text-sm text-sand-100 leading-tight mb-0.5">
                  {img.destination}
                </p>
                <p className="font-body text-xs text-sand-100/50">
                  {img.handle}
                </p>
              </div>

              {/* Likes badge — appears on hover */}
              <div className={cn(
                'absolute top-3 right-3 glass px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all duration-300',
                hovered === img.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
              )}>
                <svg className="w-3 h-3 text-rose-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="font-body text-[10px] text-sand-100/80">{img.likes}</span>
              </div>

              {/* Instagram icon top-left on hover */}
              <div className={cn(
                'absolute top-3 left-3 transition-all duration-300',
                hovered === img.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
              )}>
                <div className="glass w-7 h-7 rounded-full flex items-center justify-center">
                  <InstagramIcon className="w-3.5 h-3.5 text-sand-100/80" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 glass-light border border-white/10 px-6 py-3 rounded-full font-body text-sm text-sand-100/70 hover:text-sand-100 hover:border-gold-500/30 transition-all duration-300 group"
          >
            <InstagramIcon className="w-4 h-4 text-gold-400" />
            Follow our journey — daily travel inspiration
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}