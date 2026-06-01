'use client'

/**
 * DestinationsPage.tsx
 *
 * Filter hierarchy:
 *   1. Region tabs  — "All" | "Kashmir" | "Nepal"   (derived from destination.country)
 *   2. CategoryFilters — multi-select experience tags (derived from destination.tags)
 *
 * Both filters compose: a card must match the active region AND have at least one
 * of the active category tags (or show all if neither filter is set).
 *
 * ─── FUTURE: switching to backend images ────────────────────────────────────
 * Every place that needs changing when images come from an API is marked with:
 *   // 🔌 BACKEND: <explanation>
 * Search for that string to find all swap points.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { CategoryFilters } from '@/components/ui/Categoryfilters'
import { destinations } from '@/data/destination'
import { cn } from '@/lib/utils'
import type { DestinationCategory } from '@/types'

// ─── Region filter ────────────────────────────────────────────────────────────
// Derived from destination.country — add more countries here if you expand later
// 🔌 BACKEND: if regions come from an API, replace this with a fetched list
type Region = 'All' | 'Kashmir' | 'Nepal'

const REGIONS: { value: Region; icon: string; label: string }[] = [
  { value: 'All', icon: '', label: 'All Destinations' },
  { value: 'Kashmir', icon: '🏔', label: 'Kashmir' },
  { value: 'Nepal', icon: '⛰', label: 'Nepal' },
]

// Maps destination.country → Region tab
function countryToRegion(country: string): Region | null {
  if (country === 'India') return 'Kashmir'
  if (country === 'Nepal') return 'Nepal'
  return null // future-proof: unknown countries still show under "All"
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <svg
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              filled ? 'text-gold-500'
                : partial ? 'text-gold-500/50'
                  : 'text-white/20',
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      })}
      <span className="ml-1 text-xs text-white/60 font-body">{rating.toFixed(1)}</span>
    </div>
  )
}

// ─── Destination Card ─────────────────────────────────────────────────────────

interface CardProps {
  destination: (typeof destinations)[number]
  index: number
}

function DestinationCard({ destination, index }: CardProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  function handleClick() {
    const params = new URLSearchParams({ destination: destination.id })
    router.push(`/#planner?${params.toString()}`)
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.97 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.1 },
    },
    exit: {
      opacity: 0, scale: 0.95, y: 24,
      transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] as const },
    },
  }

  const highlightsVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.07 },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ aspectRatio: '3/4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Explore ${destination.name}, ${destination.country}`}
    >
      {/*
       * 🔌 BACKEND: Card image
       * Currently reads from destination.image (Unsplash URL in static data).
       * When images come from your API, destination.image will be a CDN URL
       * returned by your backend — no change needed here as long as the field
       * name stays `image`. If the field changes (e.g. `imageUrl`, `thumbnail`),
       * update `destination.image` → `destination.<newField>` in this one spot.
       *
       * For loading states, wrap this in a Suspense boundary or add a
       * blur placeholder: add `placeholder="blur" blurDataURL={destination.blurHash}`
       * once your API returns blur hashes.
       */}
      <Image
        src={destination.image}
        alt={`${destination.name}, ${destination.country}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        priority={index < 3}
      />

      {/* Card gradient overlay */}
      <div className="absolute inset-0 bg-card-gradient" />

      {/* Hover tint */}
      <motion.div
        className="absolute inset-0 bg-navy-900/30"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Top badges — region label + best season */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
        {/* Region pill (Kashmir / Nepal) */}
        <span className="glass text-xs font-body font-medium text-white/80 px-3 py-1 rounded-full border border-white/10">
          {/*
           * Shows country name as the region label.
           * "India" destinations are labelled "Kashmir" for marketing clarity.
           */}
          {destination.country === 'India' ? 'Kashmir' : destination.country}
        </span>

        {/* Best season badge */}
        <span className="bg-gold-500/90 text-navy-900 text-xs font-body font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {destination.bestSeason}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
        {/* Highlights — slide up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.ul
              variants={highlightsVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
              className="mb-2 space-y-1"
              aria-label={`Highlights of ${destination.name}`}
            >
              {destination.highlights.slice(0, 3).map((h) => (
                <motion.li
                  key={h}
                  variants={itemVariant}
                  className="flex items-center gap-2 text-xs text-white/85 font-body"
                >
                  <span className="w-1 h-1 rounded-full bg-gold-500 flex-shrink-0" aria-hidden="true" />
                  {h}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <h3 className="font-display text-display-md text-sand-100 leading-none tracking-tight">
          {destination.name}
        </h3>
        <p className="text-sm font-body text-white/60">{destination.tagline}</p>

        <div className="flex items-center justify-between mt-1">
          <StarRating rating={destination.rating} />
          <div className="text-right">
            <span className="text-xs text-white/50 font-body">from </span>
            <span className="text-gold-400 font-display text-lg leading-none">
              ${destination.priceFrom.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <svg
            className="w-3.5 h-3.5 text-white/40"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-white/50 font-body">{destination.duration}</span>
        </div>
      </div>

      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-gold-500/0 pointer-events-none"
        animate={{ borderColor: hovered ? 'rgba(212,168,83,0.45)' : 'rgba(212,168,83,0)' }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />
    </motion.article>
  )
}

// ─── Region Tab Bar ───────────────────────────────────────────────────────────

interface RegionTabsProps {
  active: Region
  onChange: (r: Region) => void
}

function RegionTabs({ active, onChange }: RegionTabsProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 flex-wrap"
      role="tablist"
      aria-label="Filter by region"
    >
      {REGIONS.map(({ value, icon, label }) => {
        const isActive = active === value

        // Count per region for badge
        // 🔌 BACKEND: if destinations come from an API/hook, replace `destinations`
        // here with your fetched array (e.g. `allDestinations` from useSWR)
        const count =
          value === 'All'
            ? destinations.length
            : destinations.filter((d) => countryToRegion(d.country) === value).length

        return (
          <motion.button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-medium',
              'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
              isActive
                ? 'bg-gold-500 text-navy-900 shadow-gold'
                : 'glass text-white/70 hover:text-white border border-white/10 hover:border-white/20',
            )}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                isActive ? 'bg-navy-900/20 text-navy-900' : 'bg-white/10 text-white/50',
              )}
            >
              {count}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DestinationMap() {
  const [activeRegion, setActiveRegion] = useState<Region>('All')
  const [activeCategories, setActiveCategories] = useState<DestinationCategory[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-80px' })

  // ── Filtering logic ──────────────────────────────────────────────────────
  //
  // 🔌 BACKEND: When destinations come from an API, replace `destinations` here
  // with your fetched array. Keep the filter logic the same — it only reads
  // `.country` and `.tags`, both of which your API will return.
  //
  // Example with SWR:
  //   const { data: destinations = [] } = useSWR<Destination[]>('/api/destinations')
  //
  const filtered = destinations.filter((d) => {
    // 1. Region match
    const regionMatch =
      activeRegion === 'All' || countryToRegion(d.country) === activeRegion

    // 2. Category match — destination.tags is string[], DestinationCategory is a
    //    string union; the cast is safe because tags values match the union exactly.
    const catMatch =
      activeCategories.length === 0 ||
      activeCategories.some((cat) => (d.tags as DestinationCategory[]).includes(cat))

    return regionMatch && catMatch
  })

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="relative flex min-h-[320px] items-center justify-center"
        style={{ height: '40vh' }}
      >
        {/*
         * 🔌 BACKEND: Hero background image
         * Currently points to a local file in /public.
         * To use a remote image from your API/CMS, replace the src with
         * the URL returned by your backend. Also add the domain to
         * next.config.js → images.remotePatterns so Next.js allows it.
         *
         * Example: src={heroData.backgroundImageUrl}
         */}
        <Image
          src="/BgImg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0" style={{ background: 'rgba(10,22,40,0.68)' }} />

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center mt-15"
        >
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-gold-500">
              Kashmir &amp; Nepal Expeditions
            </span>
            <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
          </div>

          <h1 className="font-display text-display-xl text-sand-100 mb-2 leading-tight">
            Where Will You Go Next
          </h1>

          <div className="flex justify-center">
            <p className="font-body text-base leading-relaxed text-sand-100/70 lg:whitespace-nowrap text-center">
              From the snow-draped valleys of Kashmir to the sacred peaks of Nepal , discover journeys that stay with you long after the trail ends.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Filter Bar (sticky) ────────────────────────────────────────────── */}
      <div className="sticky top-15 lg:top-20 z-40 bg-navy-900/85 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4">
          {/* Region tabs */}
          <div className="py-3 border-b border-white/5">
            <RegionTabs active={activeRegion} onChange={setActiveRegion} />
          </div>

          {/* Experience category chips */}
          <div className="py-2.5 lg:flex lg:justify-center ">
            <CategoryFilters
              active={activeCategories}
              onChange={setActiveCategories}
            />
          </div>
        </div>
      </div>

      {/* ── Destination Grid ──────────────────────────────────────────────── */}
      <SectionWrapper id="destinations" fadeTop>
        <motion.div
          ref={gridRef}
          id="destination-grid"
          role="region"
          aria-live="polite"
          aria-label={`${activeRegion} destinations`}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((destination, i) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={i}
              />
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20"
            >
              <p className="font-body text-white/40 text-lg">
                No{' '}
                {activeRegion !== 'All' && (
                  <span className="text-gold-500">{activeRegion} </span>
                )}
                destinations match
                {activeCategories.length > 0 && (
                  <>
                    {' '}the{' '}
                    <span className="text-gold-500">
                      {activeCategories.join(', ')}
                    </span>
                    {' '}filter{activeCategories.length > 1 ? 's' : ''}
                  </>
                )}
                .
              </p>
              <button
                onClick={() => { setActiveRegion('All'); setActiveCategories([]) }}
                className="mt-4 text-sm text-white/50 underline underline-offset-4 hover:text-white/80 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Result count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 text-center text-sm font-body text-white/30"
          aria-live="polite"
        >
          Showing{' '}
          <span className="text-gold-500 font-semibold">{filtered.length}</span> of{' '}
          <span className="text-white/50">{destinations.length}</span> curated destinations
        </motion.p>
      </SectionWrapper>
    </>
  )
}

export default DestinationMap