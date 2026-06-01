'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

import { RegionToggle }      from '@/components/ui/Regiontoggle'
import { CategoryFilters }   from '@/components/ui/Categoryfilters'
import { DestinationSearch } from '@/components/ui/Destinationsearch'
import { DestinationGrid }   from '@/components/ui/Destinationgrid'
import { PackageStep }       from '@/components/ui/Packagestep'
import { GuestStep }         from '@/components/ui/Gueststep'
import { EstimatePanel }     from '@/components/ui/Estimatepanel'
import { useDestinations }       from '@/hooks/useDestinations'
import { useDestinationSearch }  from '@/hooks/useDestinationSearch'
import { usePackageEstimate }    from '@/hooks/usePackageEstimate'

import { cn } from '@/lib/utils'

import type {
  Region,
  DestinationCategory,
  PackageType,
  AccommodationTier,
  Destination,
} from '@/types'

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Where to?',         short: 'Destination' },
  { label: 'Journey type',      short: 'Package'     },
  { label: "Who's coming?",     short: 'Guests'      },
  { label: 'Your estimate',     short: 'Summary'     },
]

// ─── Slide variants — identical easing to original ───────────────────────────

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: (d: number) => ({
    x: d > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const },
  }),
}

// ─── Step indicator — mirrors original progress bar + labels ─────────────────

function StepIndicator({
  currentStep,
  completedSteps,
  canAdvanceTo,
  onGoTo,
}: {
  currentStep: number
  completedSteps: Set<number>
  canAdvanceTo: (i: number) => boolean
  onGoTo: (s: number) => void
}) {
  return (
    <div className="mb-10" role="list" aria-label="Journey planner steps">
      {/* Progress bar track */}
      <div className="relative mb-4 h-1 w-full overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gold-500"
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>

      {/* Step labels */}
      <div className="grid grid-cols-4 gap-1">
        {STEPS.map((s, i) => {
          const isDone    = completedSteps.has(i)
          const isCurrent = currentStep === i
          const clickable = canAdvanceTo(i)

          return (
            <button
              key={s.short}
              role="listitem"
              onClick={() => clickable && onGoTo(i)}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg py-1',
                isCurrent  ? 'cursor-default'  :
                clickable  ? 'cursor-pointer'  : 'cursor-default',
              )}
            >
              {/* Bubble */}
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                  isDone
                    ? 'bg-gold-500 text-navy-900'
                    : isCurrent
                      ? 'bg-gold-500/20 text-gold-500 ring-1 ring-gold-500/50'
                      : 'bg-white/8 text-sand-100/30',
                )}
              >
                {isDone ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>

              {/* Label */}
              <span
                className={cn(
                  'hidden sm:block text-xs font-medium truncate transition-colors duration-200',
                  isCurrent  ? 'text-gold-500'      :
                  isDone     ? 'text-sand-100/60'   : 'text-sand-100/25',
                )}
              >
                {s.short}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TripPlanner() {
  // ── Navigation state ───────────────────────────────────────────────────────
  const [step, setStep]                   = useState(0)
  const [dir,  setDir]                    = useState<1 | -1>(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // ── Filter / search state ──────────────────────────────────────────────────
  const [region, setRegion]                     = useState<Region>('Kashmir')
  const [activeCategories, setActiveCategories] = useState<DestinationCategory[]>([])

  // ── Form state ─────────────────────────────────────────────────────────────
  const [selectedDest,      setSelectedDest]  = useState<Destination | null>(null)
  const [packageType,       setPackageType]   = useState<PackageType>('Luxury Retreat')
  const [accommodationTier, setAccomTier]     = useState<AccommodationTier>('Hotel')
  const [adults,            setAdults]        = useState(2)
  const [children,          setChildren]      = useState(0)
  const [checkIn,           setCheckIn]       = useState<number | null>(null)
  const [checkOut,          setCheckOut]      = useState<number | null>(null)

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { destinations, isLoading } = useDestinations({
    region,
    categories: activeCategories,
    sortBy: 'popularity',
    pageSize: 50,
  })

  const {
    query:      searchQuery,
    setQuery:   setSearchQuery,
    results:    searchResults,
    isSearching,
  } = useDestinationSearch(region)

  const displayedDestinations =
    searchQuery.length >= 2 ? searchResults : destinations

  // ── Pricing ────────────────────────────────────────────────────────────────
  const estimate = usePackageEstimate({
    destination: selectedDest,
    packageType,
    accommodationTier,
    checkInMonth:  checkIn,
    checkOutMonth: checkOut,
    adults,
    children,
  })

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const canAdvance = useCallback((): boolean => {
    if (step === 0) return selectedDest !== null
    if (step === 1) return true
    if (step === 2) return checkIn !== null && checkOut !== null && checkOut > checkIn
    return false
  }, [step, selectedDest, checkIn, checkOut])

  // Can a step label be clicked?
  function canAdvanceTo(i: number): boolean {
    return i < step || completedSteps.has(i - 1)
  }

  function goTo(next: number) {
    setDir(next > step ? 1 : -1)
    setCompletedSteps((prev) => {
      const s = new Set(prev)
      s.add(step)
      return s
    })
    setStep(next)
  }

  function handleCheckIn(i: number) {
    setCheckIn(i)
    if (checkOut !== null && checkOut <= i) setCheckOut(null)
  }

  function handleRegionChange(r: Region) {
    setRegion(r)
    setSelectedDest(null)
    setActiveCategories([])
    setSearchQuery('')
  }

  function handleDestinationSelect(dest: Destination) {
    setSelectedDest(dest)
    // Short delay so the checkmark animates before advancing
    setTimeout(() => goTo(1), 200)
  }

  // ── Background image — hero of selected dest, else first in list ───────────
  const bgImage =
    selectedDest?.heroImage ??
    destinations[0]?.heroImage ??
    ''

  // ── Step content ───────────────────────────────────────────────────────────
  const stepContent = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-sand-100/60 text-sm">
              Choose your destination
            </p>

            {/* Region toggle + search row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <RegionToggle active={region} onChange={handleRegionChange} />
              <div className="flex-1">
                <DestinationSearch
                  query={searchQuery}
                  onChange={setSearchQuery}
                  isSearching={isSearching}
                  region={region}
                  resultCount={displayedDestinations.length}
                />
              </div>
            </div>

            {/* Category filters */}
            <CategoryFilters
              active={activeCategories}
              onChange={setActiveCategories}
            />

            {/* Virtualized destination grid */}
            <DestinationGrid
              destinations={displayedDestinations}
              selectedId={selectedDest?._id ?? null}
              onSelect={handleDestinationSelect}
              isLoading={isLoading && searchQuery.length < 2}
            />
          </div>
        )

      case 1:
        return (
          <PackageStep
            packageType={packageType}
            accommodationTier={accommodationTier}
            onPackageType={setPackageType}
            onAccommodationTier={setAccomTier}
          />
        )

      case 2:
        return (
          <GuestStep
            adults={adults}
            checkIn={checkIn}
            checkOut={checkOut}
            onAdults={setAdults}
            onChildren={setChildren}
            onCheckIn={handleCheckIn}
            onCheckOut={setCheckOut}
          >
            {children}
          </GuestStep>
        )

      case 3:
        return (
          <EstimatePanel
            destination={selectedDest}
            estimate={estimate}
            packageType={packageType}
            accommodationTier={accommodationTier}
            adults={adults}
            checkIn={checkIn}
            onEditDetails={() => goTo(2)}
          >
            {children}
          </EstimatePanel>
        )

      default:
        return null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step, region, searchQuery, activeCategories,
    displayedDestinations, isLoading, isSearching,
    selectedDest, packageType, accommodationTier,
    adults, children, checkIn, checkOut, estimate,
  ])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="journey-configurator"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-label="Journey Configurator"
    >
      {/* ── Background — exact original pattern ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {bgImage && (
            <motion.div
              key={bgImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              className="absolute inset-0"
            >
              <Image
                src={bgImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Original navy overlay */}
        <div className="absolute inset-0 bg-navy-950/92" />

        {/* Original noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-20">
        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-gold-500/70 font-semibold mb-3">
            Plan Your Journey
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-sand-100 leading-tight">
            Build Your{' '}
            <span className="text-gold-400">Perfect</span>{' '}
            Trip
          </h2>
          <p className="mt-4 text-sand-100/50 text-sm max-w-xl mx-auto leading-relaxed">
            Answer four simple questions — we&apos;ll craft a personalised estimate and package for your Himalayan journey.
          </p>
        </motion.div>

        {/* ── Widget card — original bg-navy-900/60 glass ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mt-12 rounded-3xl border border-white/10 bg-navy-900/60 p-8 lg:p-12 backdrop-blur-xl"
        >
          {/* Step indicator */}
          <StepIndicator
            currentStep={step}
            completedSteps={completedSteps}
            canAdvanceTo={canAdvanceTo}
            onGoTo={goTo}
          />

          {/* Step heading */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.h3
              key={`heading-${step}`}
              custom={dir}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-display text-display-md text-sand-100 mb-8"
            >
              {STEPS[step].label}
            </motion.h3>
          </AnimatePresence>

          {/* Step content */}
          <div className="min-h-[340px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`step-${step}`}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {stepContent}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Navigation — mirrors original exactly ── */}
          {step < 3 && (
            <div className="mt-10 flex items-center justify-between border-t border-white/8 pt-8">
              <button
                onClick={() => goTo(step - 1)}
                disabled={step === 0}
                className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-sand-100/60 transition-all hover:border-white/30 hover:text-sand-100 disabled:opacity-0 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <span className="text-xs text-sand-100/25 hidden sm:block">
                Step {step + 1} of {STEPS.length}
              </span>

              <button
                onClick={() => goTo(step + 1)}
                disabled={!canAdvance()}
                className={cn(
                  'flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  canAdvance()
                    ? 'bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-gold'
                    : 'bg-white/8 text-sand-100/25 cursor-not-allowed',
                )}
              >
                {step === 2 ? 'See Estimate' : 'Continue'}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Back link on summary step — mirrors original */}
          {step === 3 && (
            <div className="mt-6 flex justify-start border-t border-white/8 pt-6">
              <button
                onClick={() => goTo(2)}
                className="flex items-center gap-2 text-sm text-sand-100/40 hover:text-sand-100/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Edit details
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default TripPlanner