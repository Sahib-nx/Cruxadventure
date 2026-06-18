'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion'
import { heroDestinations } from '@/data/destination'
import { cn } from '@/lib/utils'

// ── Slide interval (ms) ──────────────────────────────────────
const SLIDE_INTERVAL = 5500

// ── Animation variants ───────────────────────────────────────
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.3 + i * 0.12,
      duration: 0.7,
      ease: 'easeOut' as const,
    },
  }),
}

const slideVariants: Variants = {
  enter: { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.8, ease: [0.55, 0, 1, 0.45] as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 })
  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-18, 18])
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-10, 10])

  const current = heroDestinations[activeIdx]

  // ── Slideshow timer ────────────────────────────────────────
  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setActiveIdx(i => (i + 1) % heroDestinations.length)
    }, SLIDE_INTERVAL)
    return () => clearInterval(intervalRef.current!)
  }, [isPaused, activeIdx])

  // ── Mouse parallax handler ─────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const goTo = (idx: number) => {
    setDirection(idx > activeIdx ? 1 : -1)
    setActiveIdx(idx)
    // Reset interval
    clearInterval(intervalRef.current!)
    setIsPaused(false)
  }

  const headline = 'Discover the World, Your Way'
  const words = headline.split(' ')

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] overflow-hidden bg-navy-900"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero section — featured destinations"
    >
      {/* ── Background Slideshow ──────────────────────────────── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={current.heroImage}
              alt={`${current.name}, ${current.country}`}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center select-none"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Gradient overlay ──────────────────────────────────── */}
      <div className="absolute inset-0 bg-hero-gradient" />
      {/* Vignette sides */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 via-transparent to-navy-900/20" />

      {/* ── Main content (parallax layer) ─────────────────────── */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="relative z-10 h-full flex flex-col justify-end pb-24 lg:pb-32 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto lg:mt-20"
      >
        {/* Eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-gold-500" />
          <span className="font-body text-xs tracking-[0.25em] uppercase text-gold-400 font-medium">
            Curated Travel Experiences
          </span>
        </motion.div>

        {/* Headline — word-by-word reveal */}
        <motion.h1
          key={`headline-${activeIdx}`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="font-display font-semibold text-display-2xl text-sand-100 leading-none max-w-3xl"
          aria-label={headline}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariants}
              className="inline-block mr-[0.25em]"
            >
              {word === 'World,' ? (
                <span className="text-gradient-gold">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
          className="font-body text-base lg:text-lg text-sand-100/70 max-w-xl mb-10 leading-relaxed"
        >
          From ancient temples to overwater paradise — we craft journeys that
          change how you see the world.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-4"
        >
          {/* Primary CTA */}
          <Link
            href="#planner"
            className={cn(
              'group relative inline-flex items-center gap-3 overflow-hidden',
              'px-7 py-3.5 rounded-full font-body font-semibold text-sm',
              'bg-gold-500 text-navy-900',
              'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold-lg',
              'active:translate-y-0'
            )}
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 bg-gold-shimmer bg-[length:200%_100%] opacity-0 group-hover:opacity-100 animate-shimmer" />
            <span className="relative">Start Exploring</span>
            <svg className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="#destinations"
            className={cn(
              'inline-flex items-center gap-2.5',
              'px-7 py-3.5 rounded-full font-body font-medium text-sm',
              'glass-light text-sand-100',
              'transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5',
            )}
          >
            <PlayIcon className="w-4 h-4 text-gold-400" />
            View Destinations
          </Link>
        </motion.div>

        {/* ── Trust badges row ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-10 flex items-center gap-6 lg:gap-8"
        >
          {[
            { value: '12K+', label: 'Happy Travelers' },
            { value: '150+', label: 'Destinations' },
            { value: '98%', label: 'Satisfaction' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-display font-semibold text-xl text-gold-400 leading-none">
                {stat.value}
              </span>
              <span className="font-body text-xs text-sand-100/50 mt-1 tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Destination name chip (bottom-left) ──────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`chip-${activeIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute bottom-1 pt-5 left-6 lg:left-20 z-20 flex items-center gap-3"
        >
          <span className="font-body text-xs tracking-[0.2em] uppercase text-sand-100/50">
            Now showing
          </span>
          <span className="glass px-3 py-1.5 rounded-full font-body text-xs font-medium text-sand-100 tracking-wide">
            📍 {current.name}, {current.country}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* ── Slide indicators ──────────────────────────────────── */}
      <div
        className="absolute bottom-10 right-6 lg:right-20 z-20 flex items-center gap-2"
        role="tablist"
        aria-label="Destination slides"
      >
        {heroDestinations.map((dest, i) => (
          <button
            key={dest.id}
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={`Show ${dest.name}`}
            onClick={() => goTo(i)}
            className="relative h-0.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === activeIdx ? 32 : 16 }}
          >
            {/* Track */}
            <span className="absolute inset-0 bg-white/25 rounded-full" />
            {/* Active progress fill */}
            {i === activeIdx && !isPaused && (
              <motion.span
                key={`progress-${activeIdx}`}
                className="absolute inset-y-0 left-0 bg-gold-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
              />
            )}
            {i === activeIdx && isPaused && (
              <span className="absolute inset-0 bg-gold-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-sand-100/30">
          Scroll
        </span>
        <div className="w-px h-12 relative overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-gold-500/0 via-gold-500 to-gold-500/0 h-6"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* ── Pulsing hotspot decoration (top-right corner) ────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="absolute top-28 right-10 lg:right-24 z-10 hidden lg:block"
        aria-hidden="true"
      >
        <div className="relative flex items-center justify-center w-14 h-14">
          <span className="absolute inset-0 rounded-full bg-gold-500/20 animate-pulse-ring" />
          <span className="absolute inset-2 rounded-full bg-gold-500/30 animate-pulse-ring [animation-delay:0.3s]" />
          <span className="relative w-3 h-3 rounded-full bg-gold-500" />
        </div>
      </motion.div>
    </section>
  )
}

// ── Inline icon ───────────────────────────────────────────────
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export default HeroSection;