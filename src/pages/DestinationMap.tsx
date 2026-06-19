'use client'

/**
 * DestinationsPage.tsx
 *
 * Filter hierarchy:
 *   1. Search bar       — fuzzy search via /api/destinations/search?q=
 *   2. Region tabs      — "All" | "Kashmir" | "Nepal"   (derived from destination.country)
 *   3. CategoryFilters  — multi-select experience tags (derived from destination.tags)
 *
 * Search takes priority: when a query is active, region + category filters apply
 * on top of the search results returned by the API.
 *
 * ─── FUTURE: switching to backend images ────────────────────────────────────
 * Every place that needs changing when images come from an API is marked with:
 *   // 🔌 BACKEND: <explanation>
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import { SafeImage } from '@/components/ui/SafeImage'
import { useRouter } from 'next/navigation'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { CategoryFilters } from '@/components/ui/Categoryfilters'
import { cn } from '@/lib/utils'
import type { DestinationCategory } from '@/types'

// ─── Region filter ────────────────────────────────────────────────────────────
type Region = 'All' | 'Kashmir' | 'Nepal'

const REGIONS: { value: Region; icon: string; label: string }[] = [
  { value: 'All', icon: '', label: 'All Destinations' },
  { value: 'Kashmir', icon: '🏔', label: 'Kashmir' },
  { value: 'Nepal', icon: '⛰', label: 'Nepal' },
]

function countryToRegion(country: string): Region | null {
  if (country === 'India') return 'Kashmir'
  if (country === 'Nepal') return 'Nepal'
  return null
}

function adaptDestination(d: any) {
  const region = d.region ?? ''
  return {
    id: d.slug ?? d._id,          // used for routing → /destinationMap/[slug]
    slug: d.slug,
    name: d.name,
    image: d.thumbnail ?? d.heroImage ?? '/BgImg.jpg',
    country: region === 'Kashmir' ? 'India' : region || 'Nepal',
    bestSeason: (Array.isArray(d.bestSeason) ? d.bestSeason : d.bestSeason ? [d.bestSeason] : []).slice(0, 4) as string[],
    highlights: d.popularActivities ?? [],
    tagline: d.shortDescription ?? '',
    rating: typeof d.popularity === 'number'
      ? Math.max(0, Math.min(5, +(d.popularity / 20).toFixed(1)))
      : 0,
    priceFrom: d.avgPackagePrice ?? d.avgStayPrice ?? null,
    duration: d.duration ?? 'Varies',
    tags: Array.from(new Set([...(d.categories ?? []), ...(d.tags ?? [])])),
  }
}

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
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
  destination: ReturnType<typeof adaptDestination>
  index: number
}

function DestinationCard({ destination, index }: CardProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  // Route to /destinationMap/[slug] — the slug is stored in destination.id
  function handleClick() {
    if (!destination.id) return
    router.push(`/destinationMap/${destination.id}`)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.97 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: index * 0.08 },
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
      className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/5] sm:aspect-[3/4]"
      style={{ aspectRatio: '3/4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Explore ${destination.name}, ${destination.country}`}
    >
      {/* 🔌 BACKEND: Card image — swap `destination.image` if field name changes */}
      <SafeImage
        src={destination.image}
        alt={`${destination.name}, ${destination.country}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        priority={index < 3}
      />

      <div className="absolute inset-0 bg-card-gradient" />

      <motion.div
        className="absolute inset-0 bg-navy-900/30"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
        <span className="glass text-xs font-body font-medium text-white/80 px-3 py-1 rounded-full border border-white/10">
          {destination.country === 'India' ? 'Kashmir' : destination.country}
        </span>
        <div className="flex flex-wrap gap-1 justify-end max-w-[55%]">
          {destination.bestSeason.map((season) => (
            <span
              key={season}
              className="bg-gold-500/90 text-navy-900 text-[10px] font-body font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
            >
              {season}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
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
              {destination.highlights?.slice(0, 3).map((h: string) => (
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
        <p className="text-sm font-body text-white/60 line-clamp-2 leading-snug">{destination.tagline}</p>

        <div className="flex items-center justify-between mt-1">
          <StarRating rating={destination.rating ?? 0} />
          <div className="text-right">
            <span className="text-xs text-white/50 font-body">from </span>
            <span className="text-gold-400 font-display text-lg leading-none">
              ${destination.priceFrom?.toLocaleString?.() ?? '—'}
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
          <span className="text-xs text-white/50 font-body">{destination.duration ?? 'Varies'}</span>
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

// ─── Search Bar ───────────────────────────────────────────────────────────────
interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  isSearching: boolean
}

function SearchBar({ value, onChange, isSearching }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        {isSearching ? (
          /* Spinner while fetching */
          <svg
            className="w-4 h-4 text-gold-500 animate-spin"
            fill="none" viewBox="0 0 24 24" aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-white/40"
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        )}
      </div>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search destinations, activities, tags…"
        aria-label="Search destinations"
        className={cn(
          'w-full glass border border-white/10 rounded-full',
          'pl-11 pr-10 py-2.5',
          'text-sm font-body text-white placeholder:text-white/30',
          'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500/40',
          'transition-all duration-200',
        )}
      />

      {/* Clear button */}
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={() => { onChange(''); inputRef.current?.focus() }}
            className="absolute inset-y-0 right-3 flex items-center px-1 text-white/30 hover:text-white/70 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Region Tab Bar ───────────────────────────────────────────────────────────
interface RegionTabsProps {
  active: Region
  onChange: (r: Region) => void
  allDestinations?: ReturnType<typeof adaptDestination>[]
}

function RegionTabs({ active, onChange, allDestinations = [] }: RegionTabsProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 flex-wrap"
      role="tablist"
      aria-label="Filter by region"
    >
      {REGIONS.map(({ value, icon, label }) => {
        const isActive = active === value
        const count =
          value === 'All'
            ? allDestinations.length
            : allDestinations.filter((d) => countryToRegion(d.country) === value).length

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
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Full list — loaded once on mount from the admin/destinations endpoint
  const [allDestinations, setAllDestinations] = useState<ReturnType<typeof adaptDestination>[]>([])
  // Search results — populated whenever a query is active
  const [searchResults, setSearchResults] = useState<ReturnType<typeof adaptDestination>[]>([])

  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-80px' })
  const debouncedQuery = useDebounce(searchQuery, 380)

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/admin/destinations?page=1&pageSize=50')
        if (!res.ok) return
        const body = await res.json()
        const list = Array.isArray(body.destinations) ? body.destinations : body
        if (mounted) setAllDestinations(list.map(adaptDestination))
      } catch (e) {
        console.error('Failed to load destinations', e)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // ── Search via /api/destinations/search ──────────────────────────────────
  useEffect(() => {
    let mounted = true

    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    async function doSearch() {
      try {
        const params = new URLSearchParams({ q: debouncedQuery })
        // Pass region to the search API too if one is selected — reduces server work
        if (activeRegion !== 'All') params.set('region', activeRegion)

        const res = await fetch(`/api/destinations/search?${params.toString()}`)
        if (!res.ok) return
        const body = await res.json()
        const list = Array.isArray(body) ? body : []
        if (mounted) setSearchResults(list.map(adaptDestination))
      } catch (e) {
        console.error('Search failed', e)
      } finally {
        if (mounted) setIsSearching(false)
      }
    }
    doSearch()

    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  // ── Filtering logic ──────────────────────────────────────────────────────
  // When a search query is active, filter over search results;
  // otherwise filter over the full list.
  const baseList = debouncedQuery.length >= 2 ? searchResults : allDestinations
  const destinations = baseList.filter((d) => {
    const regionMatch =
      activeRegion === 'All' || countryToRegion(d.country) === activeRegion

    const catMatch =
      activeCategories.length === 0 ||
      activeCategories.some((cat) => (d.tags as DestinationCategory[]).includes(cat))

    return regionMatch && catMatch
  })

  function clearAll() {
    setActiveRegion('All')
    setActiveCategories([])
    setSearchQuery('')
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  const isFiltered = searchQuery || activeRegion !== 'All' || activeCategories.length > 0

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="relative flex min-h-[320px] items-center justify-center"
        style={{ height: '40vh' }}
      >
        {/* 🔌 BACKEND: Hero background — swap src when using remote image */}
        <Image
          src="/BgImg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
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
              From the snow-draped valleys of Kashmir to the sacred peaks of Nepal, discover journeys that stay with you long after the trail ends.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Filter Bar (sticky) ────────────────────────────────────────────── */}
      <div className="sticky top-15 lg:top-20 z-40 bg-navy-900/85 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4">

          {/* Search row */}
          <div className="py-3 border-b border-white/5">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              isSearching={isSearching}
            />
          </div>

          {/* Region tabs */}
          <div className="py-3 border-b border-white/5">
            <RegionTabs
              active={activeRegion}
              onChange={setActiveRegion}
              allDestinations={allDestinations}
            />
          </div>

          {/* Experience category chips */}
          <div className="py-2.5 lg:flex lg:justify-center">
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
            {destinations.map((destination, i) => (
              <DestinationCard
                key={destination.id ?? destination.slug ?? i}
                destination={destination}
                index={i}
              />
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {!isSearching && destinations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20"
            >
              {searchQuery.length >= 2 ? (
                <>
                  <p className="font-body text-white/40 text-lg">
                    No results for{' '}
                    <span className="text-gold-500">&quot;{searchQuery}&quot;</span>
                    {activeRegion !== 'All' && (
                      <> in <span className="text-gold-500">{activeRegion}</span></>
                    )}
                    .
                  </p>
                  <p className="mt-2 font-body text-white/25 text-sm">
                    Try a different keyword, or clear the filters below.
                  </p>
                </>
              ) : (
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
              )}

              {isFiltered && (
                <button
                  onClick={clearAll}
                  className="mt-4 text-sm text-white/50 underline underline-offset-4 hover:text-white/80 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}

          {/* Loading state while search is in-flight */}
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <svg
                className="mx-auto w-8 h-8 text-gold-500 animate-spin"
                fill="none" viewBox="0 0 24 24" aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="mt-3 font-body text-white/30 text-sm">Finding destinations…</p>
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
          {searchQuery.length >= 2 ? (
            <>
              Found{' '}
              <span className="text-gold-500 font-semibold">{destinations.length}</span> result
              {destinations.length !== 1 ? 's' : ''} for{' '}
              <span className="text-white/50">&quot;{searchQuery}&quot;</span>
            </>
          ) : (
            <>
              Showing{' '}
              <span className="text-gold-500 font-semibold">{destinations.length}</span> of{' '}
              <span className="text-white/50">{allDestinations.length}</span> curated destinations
            </>
          )}
        </motion.p>
      </SectionWrapper>
    </>
  )
}

export default DestinationMap