'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { SectionHeading } from '@/components/ui/Sectionheading'
import { cn } from '@/lib/utils'

// ─── Data ────────────────────────────────────────────────────────────────────

interface Experience {
  id: string
  title: string
  category: 'Adventure' | 'Culture' | 'Luxury'
  duration: string
  priceFrom: number
  description: string
  image: string
}

const experiences: Experience[] = [
  {
    id: 'bali-surf',
    title: 'Bali Sunrise Surf Retreat',
    category: 'Adventure',
    duration: '7 days',
    priceFrom: 1299,
    description:
      'Ride world-class waves at dawn, then unwind in a clifftop villa. Expert surf coaching meets Balinese ritual in this soul-resetting escape.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  },
  {
    id: 'paris-art',
    title: 'Paris Art & Gastronomy Tour',
    category: 'Culture',
    duration: '5 days',
    priceFrom: 2199,
    description:
      'Private gallery tours, Michelin-starred tastings, and dawn access to the Louvre. A deeply curated immersion in the worlds most cultured city.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
  },
  {
    id: 'maldives-villa',
    title: 'Maldives Overwater Villa',
    category: 'Luxury',
    duration: '10 days',
    priceFrom: 4499,
    description:
      'Wake above a turquoise lagoon, snorkel with manta rays, dine under the stars. Pure, unhurried luxury in the Indian Ocean.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
  },
  {
    id: 'kenya-safari',
    title: 'Kenya Safari & Bush Camp',
    category: 'Adventure',
    duration: '8 days',
    priceFrom: 3299,
    description:
      'Track the Big Five across the Maasai Mara with expert guides. Sleep in luxury tented camps and witness the Great Migration up close.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80',
  },
  {
    id: 'kyoto-temple',
    title: 'Kyoto Temple & Tea Walk',
    category: 'Culture',
    duration: '6 days',
    priceFrom: 1699,
    description:
      'Stroll ancient stone paths between vermilion torii gates, attend a private tea ceremony, and stay in a restored machiya townhouse.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
  },
]

// ─── Constants ────────────────────────────────────────────────────────────────

// FIX: Use `as const` tuple so TypeScript resolves the type as
// [number, number, number, number] (a cubic-bezier Easing), not number[].
const EASE = [0.32, 0.72, 0, 1] as const

const categoryColors: Record<Experience['category'], string> = {
  Adventure: 'bg-ocean-500/80 text-sand-100',
  Culture: 'bg-navy-900/80 text-gold-500 border border-gold-500/40',
  Luxury: 'bg-gold-500/90 text-navy-900',
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <Image
        src={exp.image}
        alt={exp.title}
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
        <span
          className={cn(
            'mb-4 inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm',
            categoryColors[exp.category],
          )}
        >
          {exp.category}
        </span>
        <h3 className="font-display text-display-lg mb-4 text-sand-100 leading-tight">
          {exp.title}
        </h3>
        <div className="mb-4 flex items-center gap-6 text-sm text-sand-100/70">
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 text-gold-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
              />
            </svg>
            {exp.duration}
          </span>
          <span className="h-1 w-1 rounded-full bg-sand-100/30" aria-hidden="true" />
          <span className="font-semibold text-gold-500 text-base">
            From ${exp.priceFrom.toLocaleString()}
          </span>
        </div>
        <p className="mb-8 max-w-xl text-sm leading-relaxed text-sand-100/75 line-clamp-2">
          {exp.description}
        </p>
        <div>
          <a
            href="#planner"
            className="inline-flex items-center gap-2 rounded-full border border-sand-100/40 px-6 py-3 text-sm font-semibold text-sand-100 backdrop-blur-sm transition-all duration-300 hover:border-gold-500 hover:text-gold-500 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            View Package
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Mobile Carousel ──────────────────────────────────────────────────────────

/**
 * Standalone swipe carousel for mobile. Uses drag gesture + AnimatePresence
 * to give the same feel as the desktop animated single-card view.
 */
function MobileCarousel({
  active,
  direction,
  go,
}: {
  active: number
  direction: 1 | -1
  go: (i: number) => void
}) {
  const x = useMotionValue(0)
  const DRAG_THRESHOLD = 50 // px needed to register a swipe

  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: EASE },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.35, ease: EASE },
    }),
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    const swipe = info.offset.x
    if (swipe < -DRAG_THRESHOLD) {
      go((active + 1) % experiences.length)
    } else if (swipe > DRAG_THRESHOLD) {
      go((active - 1 + experiences.length) % experiences.length)
    } else {
      // Snap back
      animate(x, 0, { duration: 0.2 })
    }
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ touchAction: 'pan-y' }}>
      {/* Card stage */}
      <div className="relative h-[520px] sm:h-[600px] w-full">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <ExperienceCard exp={experiences[active]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Counter + dots */}
      <div className="mt-5 flex flex-col items-center gap-3">
        {/* Progress bar */}
        <div className="h-px w-32 bg-sand-100/10 relative overflow-hidden rounded-full">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gold-500 rounded-full"
            animate={{ width: `${((active + 1) / experiences.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        {/* Dot indicators */}
        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Experience navigation"
        >
          {experiences.map((exp, i) => (
            <button
              key={exp.id}
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to ${exp.title}`}
              onClick={() => go(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === active
                  ? 'w-8 bg-gold-500'
                  : 'w-1.5 bg-sand-100/25 hover:bg-sand-100/50',
              )}
            />
          ))}
        </div>

        {/* Prev / Next touch buttons */}
        <div className="flex items-center gap-4 mt-1" role="group" aria-label="Navigate experiences">
          <button
            onClick={() => go((active - 1 + experiences.length) % experiences.length)}
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-sand-100/60 transition-all hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            aria-label="Previous experience"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="font-display text-sm text-sand-100/40 tabular-nums">
            {pad(active + 1)}&nbsp;<span className="text-sand-100/20">/</span>&nbsp;{pad(experiences.length)}
          </span>

          <button
            onClick={() => go((active + 1) % experiences.length)}
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-sand-100/60 transition-all hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            aria-label="Next experience"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Swipe hint — shown only on first render, fades out */}
        <SwipeHint />
      </div>
    </div>
  )
}

/** Fades-out-once swipe hint label */
function SwipeHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          className="text-xs text-sand-100/35 flex items-center gap-1.5 select-none"
          aria-hidden="true"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Swipe to explore
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.p>
      )}
    </AnimatePresence>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function ExperienceShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback(
    (next: number) => {
      setDirection(next > active ? 1 : -1)
      setActive(next)
    },
    [active],
  )

  const prev = useCallback(() => {
    go((active - 1 + experiences.length) % experiences.length)
  }, [active, go])

  const next = useCallback(() => {
    go((active + 1) % experiences.length)
  }, [active, go])

  // Auto-advance (desktop only — mobile has manual swipe)
  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setDirection(1)
      setActive((a) => (a + 1) % experiences.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused])

  // FIX: all `ease` values now use the typed `EASE` const — resolves the
  // "number[] is not assignable to Easing" TypeScript error.
  const desktopCardVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.55, ease: EASE },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -60 : 60,
      opacity: 0,
      transition: { duration: 0.4, ease: EASE },
    }),
  }

  return (
    <SectionWrapper id="experiences" fadeTop>
      {/* ── Mobile heading (hidden on desktop) ── */}
      <div className="lg:hidden mb-8">
        <SectionHeading
          eyebrow="Curated For You"
          title="Handpicked Experiences"
          highlight="Experiences"
          subtitle="Five extraordinary journeys — each one designed to exceed expectation."
        />
      </div>

      {/* ── Desktop layout ── */}
      <div
        className="flex flex-col lg:flex-row gap-10 lg:gap-0 lg:min-h-[680px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Left: sticky info column (desktop only) ── */}
        <div className="hidden lg:flex flex-col justify-between lg:w-[38%] xl:w-[35%] pr-12 xl:pr-16">
          <div>
            <SectionHeading
              eyebrow="Curated For You"
              title="Handpicked Experiences"
              highlight="Experiences"
              subtitle="Five extraordinary journeys — each one designed to exceed expectation."
            />
          </div>

          <div className="mt-auto pt-12">
            {/* Progress bar */}
            <div className="mb-8 h-px w-full bg-sand-100/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold-500 rounded-full"
                animate={{ width: `${((active + 1) / experiences.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>

            {/* Counter */}
            <div className="mb-8 flex items-baseline gap-2">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-display-md text-gradient-gold tabular-nums"
              >
                {pad(active + 1)}
              </motion.span>
              <span className="font-display text-display-md text-sand-100/20">/</span>
              <span className="font-display text-display-md text-sand-100/20">
                {pad(experiences.length)}
              </span>
            </div>

            {/* Experience list nav */}
            <nav aria-label="Experience list" className="mb-10 space-y-3">
              {experiences.map((exp, i) => (
                <button
                  key={exp.id}
                  onClick={() => go(i)}
                  className={cn(
                    'flex w-full items-center gap-3 text-left transition-all duration-300',
                    i === active
                      ? 'text-sand-100'
                      : 'text-sand-100/35 hover:text-sand-100/60',
                  )}
                  aria-label={`Go to ${exp.title}`}
                  aria-current={i === active ? 'true' : undefined}
                >
                  <span
                    className={cn(
                      'block h-px flex-1 transition-all duration-300',
                      i === active
                        ? 'bg-gold-500 max-w-[2rem]'
                        : 'bg-sand-100/20 max-w-[1rem]',
                    )}
                  />
                  <span className="text-sm font-medium truncate">{exp.title}</span>
                </button>
              ))}
            </nav>

            {/* Prev / Next */}
            <div className="flex items-center gap-3" role="group" aria-label="Navigate experiences">
              <button
                onClick={prev}
                className="glass flex h-12 w-12 items-center justify-center rounded-full text-sand-100/60 transition-all hover:text-gold-500 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                aria-label="Previous experience"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="glass flex h-12 w-12 items-center justify-center rounded-full text-sand-100/60 transition-all hover:text-gold-500 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                aria-label="Next experience"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: card area ── */}
        <div className="flex-1 lg:relative">
          {/* Desktop: vertical-slide animated card */}
          <div className="hidden lg:block absolute inset-0">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={active}
                custom={direction}
                variants={desktopCardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="h-full w-full"
              >
                <ExperienceCard exp={experiences[active]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile: swipe carousel */}
          <div className="lg:hidden">
            <MobileCarousel active={active} direction={direction} go={go} />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}