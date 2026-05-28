'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { SectionHeading } from '@/components/ui/Sectionheading'
import { destinations } from '@/data/destination'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Continent = 'All' | 'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania'

const CONTINENTS: Continent[] = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania']

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
              filled ? 'text-gold-500' : partial ? 'text-gold-500/50' : 'text-white/20'
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
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        delay: index * 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 24,
      transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] as const },
    },
  }

  const highlightsVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
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
      {/* Background Image */}
      <Image
        src={destination.image}
        alt={`${destination.name}, ${destination.country}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        priority={index < 3}
      />

      {/* Card Gradient Overlay */}
      <div className="absolute inset-0 bg-card-gradient" />

      {/* Hover tint overlay */}
      <motion.div
        className="absolute inset-0 bg-navy-900/30"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
        {/* Continent tag */}
        <span className="glass text-xs font-body font-medium text-white/80 px-3 py-1 rounded-full border border-white/10">
          {destination.continent}
        </span>

        {/* Best Season badge */}
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

        {/* Destination name */}
        <h3 className="font-display text-display-md text-sand-100 leading-none tracking-tight">
          {destination.name}
        </h3>

        {/* Country */}
        <p className="text-sm font-body text-white/60">{destination.country}</p>

        {/* Rating + Price row */}
        <div className="flex items-center justify-between mt-1">
          <StarRating rating={destination.rating} />
          <div className="text-right">
            <span className="text-xs text-white/50 font-body">from </span>
            <span className="text-gold-400 font-display text-lg leading-none">
              ${destination.priceFrom.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// ─── Main Section ─────────────────────────────────────────────────────────────

export function DestinationMap() {
  const [activeFilter, setActiveFilter] = useState<Continent>('All')
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-80px' })

  const filtered =
    activeFilter === 'All'
      ? destinations
      : destinations.filter((d) => d.continent === activeFilter)

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  }

  return (
    <SectionWrapper id="destinations" fadeTop>
      <SectionHeading
        eyebrow="Explore the World"
        title="Where Will You Go Next"
        highlight="You"
        subtitle="From sun-drenched coastlines to ancient mountain temples — every journey begins with a single choice. Find yours."
      />

      {/* Filter Bar */}
      <div
        className="flex flex-wrap items-center justify-center gap-2 mb-12"
        role="tablist"
        aria-label="Filter destinations by continent"
      >
        {CONTINENTS.map((continent) => {
          const isActive = activeFilter === continent
          const count =
            continent === 'All'
              ? destinations.length
              : destinations.filter((d) => d.continent === continent).length

          return (
            <motion.button
              key={continent}
              role="tab"
              aria-selected={isActive}
              aria-controls="destination-grid"
              onClick={() => setActiveFilter(continent)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                'relative px-5 py-2 rounded-full text-sm font-body font-medium transition-colors duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                isActive
                  ? 'bg-gold-500 text-navy-900 shadow-gold'
                  : 'glass text-white/70 hover:text-white border border-white/10 hover:border-white/20'
              )}
            >
              {continent}
              {count > 0 && (
                <span
                  className={cn(
                    'ml-2 text-xs px-1.5 py-0.5 rounded-full font-semibold',
                    isActive ? 'bg-navy-900/20 text-navy-900' : 'bg-white/10 text-white/50'
                  )}
                >
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Destination Grid */}
      <motion.div
        ref={gridRef}
        id="destination-grid"
        role="tabpanel"
        aria-live="polite"
        aria-label={`Destinations in ${activeFilter}`}
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
              No destinations available in{' '}
              <span className="text-gold-500">{activeFilter}</span> yet.
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-4 text-sm text-white/50 underline underline-offset-4 hover:text-white/80 transition-colors"
            >
              Show all destinations
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Decorative count line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-10 text-center text-sm font-body text-white/30"
        aria-live="polite"
      >
        Showing{' '}
        <span className="text-gold-500 font-semibold">{filtered.length}</span> of{' '}
        <span className="text-white/50">{destinations.length}</span> curated destinations
      </motion.p>
    </SectionWrapper>
  )
}