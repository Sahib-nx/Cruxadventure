'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { SectionHeading } from '@/components/ui/Sectionheading'
import { cn } from '@/lib/utils'

// ─── Destination data ────────────────────────────────────────────────────────

const DESTINATIONS = [
    {
        id: 'bali',
        name: 'Bali',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        pricePerNight: 185,
        flightBase: 900,
    },
    {
        id: 'santorini',
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
        pricePerNight: 320,
        flightBase: 1100,
    },
    {
        id: 'maldives',
        name: 'Maldives',
        country: 'Maldives',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80',
        pricePerNight: 650,
        flightBase: 1400,
    },
    {
        id: 'kyoto',
        name: 'Kyoto',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80',
        pricePerNight: 210,
        flightBase: 950,
    },
    {
        id: 'patagonia',
        name: 'Patagonia',
        country: 'Argentina / Chile',
        image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
        pricePerNight: 280,
        flightBase: 1250,
    },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const ACCOMMODATION_TYPES = ['Hotel', 'Resort', 'Villa', 'Hostel'] as const
type AccomType = (typeof ACCOMMODATION_TYPES)[number]

const ACCOM_MULTIPLIER: Record<AccomType, number> = {
    Hotel: 1,
    Resort: 1.4,
    Villa: 2.1,
    Hostel: 0.35,
}

const STEPS = [
    { label: 'Where to?', short: 'Destination' },
    { label: 'When?', short: 'Dates' },
    { label: "Who's coming?", short: 'Guests' },
    { label: 'Your estimate', short: 'Summary' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function nightsBetween(a: number | null, b: number | null): number {
    if (a === null || b === null) return 0
    const diff = b - a
    return diff > 0 ? diff * 30 : 0 // rough: each month ~30 nights
}

function useCountUp(target: number, active: boolean, duration = 1200) {
    const [value, setValue] = useState(0)
    const raf = useRef<number | null>(null)
    const start = useRef<number | null>(null)
    const from = useRef(0)

    useEffect(() => {
        if (!active) { setValue(0); from.current = 0; return }
        from.current = 0
        start.current = null
        const tick = (ts: number) => {
            if (!start.current) start.current = ts
            const elapsed = ts - start.current
            const progress = Math.min(elapsed / duration, 1)
            // ease out quart
            const eased = 1 - Math.pow(1 - progress, 4)
            setValue(Math.round(from.current + (target - from.current) * eased))
            if (progress < 1) raf.current = requestAnimationFrame(tick)
            else setValue(target)
        }
        raf.current = requestAnimationFrame(tick)
        return () => { if (raf.current) cancelAnimationFrame(raf.current) }
    }, [target, active, duration])

    return value
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepDestination({
    selected,
    onSelect,
}: {
    selected: string | null
    onSelect: (id: string) => void
}) {
    return (
        <div className="space-y-4">
            <p className="text-sand-100/60 text-sm">Choose your dream destination</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {DESTINATIONS.map((dest) => {
                    const isSelected = selected === dest.id
                    return (
                        <button
                            key={dest.id}
                            onClick={() => onSelect(dest.id)}
                            className={cn(
                                'group relative overflow-hidden rounded-2xl aspect-[3/4] text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                                isSelected
                                    ? 'ring-2 ring-gold-500 shadow-gold'
                                    : 'ring-1 ring-white/10 hover:ring-white/30',
                            )}
                            aria-pressed={isSelected}
                            aria-label={`Select ${dest.name}, ${dest.country}`}
                        >
                            {/* Image */}
                            <Image
                                src={dest.image}
                                alt={dest.name}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                className={cn(
                                    'object-cover transition-transform duration-500',
                                    isSelected ? 'scale-105' : 'group-hover:scale-105',
                                )}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/30 to-transparent" />

                            {/* Text */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="font-display text-sm font-semibold text-sand-100 leading-tight">{dest.name}</p>
                                <p className="text-xs text-sand-100/60 mt-0.5">{dest.country}</p>
                            </div>

                            {/* Checkmark */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500"
                                        aria-hidden="true"
                                    >
                                        <svg className="h-3.5 w-3.5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function MonthGrid({
    label,
    selected,
    onSelect,
    minMonth,
}: {
    label: string
    selected: number | null
    onSelect: (i: number) => void
    minMonth?: number
}) {
    return (
        <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-sand-100/50 font-semibold">{label}</p>
            <div className="grid grid-cols-6 gap-2">
                {MONTHS.map((m, i) => {
                    const disabled = minMonth !== undefined && i <= minMonth
                    const isSelected = selected === i
                    return (
                        <button
                            key={m}
                            disabled={disabled}
                            onClick={() => onSelect(i)}
                            aria-pressed={isSelected}
                            className={cn(
                                'rounded-xl py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                                isSelected
                                    ? 'bg-gold-500 text-navy-900 shadow-gold font-semibold'
                                    : disabled
                                        ? 'text-sand-100/20 cursor-not-allowed'
                                        : 'bg-white/5 text-sand-100/70 hover:bg-white/10 hover:text-sand-100',
                            )}
                        >
                            {m}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function StepDates({
    checkIn,
    checkOut,
    onCheckIn,
    onCheckOut,
}: {
    checkIn: number | null
    checkOut: number | null
    onCheckIn: (i: number) => void
    onCheckOut: (i: number) => void
}) {
    const nights = nightsBetween(checkIn, checkOut)
    return (
        <div className="space-y-6">
            <MonthGrid label="Check-in month" selected={checkIn} onSelect={onCheckIn} />

            {/* Nights indicator */}
            <AnimatePresence mode="wait">
                {checkIn !== null && checkOut !== null && nights > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <div className="h-px flex-1 bg-gold-500/30" />
                        <span className="rounded-full border border-gold-500/40 px-4 py-1.5 text-sm font-semibold text-gold-500">
                            {nights} nights
                        </span>
                        <div className="h-px flex-1 bg-gold-500/30" />
                    </motion.div>
                )}
                {(checkIn === null || nights === 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center"
                    >
                        <span className="text-xs text-sand-100/30 italic">Select check-in then check-out</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <MonthGrid
                label="Check-out month"
                selected={checkOut}
                onSelect={onCheckOut}
                minMonth={checkIn ?? undefined}
            />
        </div>
    )
}

function Counter({
    label,
    sublabel,
    value,
    min,
    max,
    onChange,
}: {
    label: string
    sublabel: string
    value: number
    min: number
    max: number
    onChange: (v: number) => void
}) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/8 last:border-0">
            <div>
                <p className="text-sand-100 font-medium">{label}</p>
                <p className="text-xs text-sand-100/45 mt-0.5">{sublabel}</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    aria-label={`Decrease ${label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sand-100/70 transition-all hover:border-white/30 hover:text-sand-100 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                </button>
                <motion.span
                    key={value}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="w-6 text-center font-display text-xl text-sand-100 tabular-nums"
                >
                    {value}
                </motion.span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    aria-label={`Increase ${label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sand-100/70 transition-all hover:border-white/30 hover:text-sand-100 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

function StepGuests({
    adults,
    children,
    accom,
    onAdults,
    onChildren,
    onAccom,
}: {
    adults: number
    children: number
    accom: AccomType
    onAdults: (v: number) => void
    onChildren: (v: number) => void
    onAccom: (v: AccomType) => void
}) {
    return (
        <div className="space-y-8">
            <div>
                <Counter label="Adults" sublabel="Ages 18+" value={adults} min={1} max={10} onChange={onAdults} />
                <Counter label="Children" sublabel="Ages 2–17" value={children} min={0} max={6} onChange={onChildren} />
            </div>
            <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-sand-100/50 font-semibold">Accommodation type</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Accommodation type">
                    {ACCOMMODATION_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => onAccom(type)}
                            aria-pressed={accom === type}
                            className={cn(
                                'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                                accom === type
                                    ? 'bg-gold-500 text-navy-900 font-semibold shadow-gold'
                                    : 'bg-white/6 text-sand-100/70 border border-white/10 hover:border-white/25 hover:text-sand-100',
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function PriceLine({
    icon,
    label,
    amount,
    active,
    delay,
    bold,
    separator,
}: {
    icon: string
    label: string
    amount: number
    active: boolean
    delay?: number
    bold?: boolean
    separator?: boolean
}) {
    const displayed = useCountUp(amount, active, 1200 + (delay ?? 0))
    return (
        <>
            {separator && <div className="my-3 h-px bg-white/10" />}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (delay ?? 0) / 1000, duration: 0.4 }}
                className={cn(
                    'flex items-center justify-between py-2',
                    bold ? 'pt-3' : '',
                )}
            >
                <span className={cn('flex items-center gap-2.5', bold ? 'text-sand-100 font-semibold text-base' : 'text-sand-100/70 text-sm')}>
                    <span aria-hidden="true">{icon}</span>
                    {label}
                </span>
                <span className={cn('font-display tabular-nums', bold ? 'text-gradient-gold text-xl' : 'text-sand-100 text-sm')}>
                    ${displayed.toLocaleString()}
                </span>
            </motion.div>
        </>
    )
}

function StepSummary({
    destId,
    checkIn,
    checkOut,
    adults,
    children,
    accom,
    active,
}: {
    destId: string | null
    checkIn: number | null
    checkOut: number | null
    adults: number
    children: number
    accom: AccomType
    active: boolean
}) {
    const dest = DESTINATIONS.find((d) => d.id === destId)
    const nights = nightsBetween(checkIn, checkOut) || 7
    const pax = adults + Math.ceil(children * 0.6)
    const accomRate = (dest?.pricePerNight ?? 200) * ACCOM_MULTIPLIER[accom]
    const flights = (dest?.flightBase ?? 900) * pax
    const accommodation = accomRate * nights
    const activities = Math.round((flights + accommodation) * 0.12)
    const total = flights + accommodation + activities

    return (
        <div className="space-y-6">
            {/* Destination summary pill */}
            {dest && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/8 p-4"
                >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl">
                        <Image src={dest.image} alt={dest.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-display text-lg text-sand-100">{dest.name}</p>
                        <p className="text-xs text-sand-100/50">{dest.country}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-sm text-sand-100/60">{nights} nights</p>
                        <p className="text-xs text-sand-100/40 mt-0.5">{adults}A {children > 0 ? `${children}C` : ''} · {accom}</p>
                    </div>
                </motion.div>
            )}

            {/* Price breakdown */}
            <div className="rounded-2xl bg-white/4 border border-white/8 px-6 py-2">
                <PriceLine icon="✈" label="Flights estimate" amount={flights} active={active} delay={0} />
                <PriceLine icon="🏨" label={`Accommodation (${nights} nights)`} amount={accommodation} active={active} delay={150} />
                <PriceLine icon="🎫" label="Activities & transfers" amount={activities} active={active} delay={300} />
                <PriceLine icon="💳" label="Total" amount={total} active={active} delay={500} bold separator />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                    href="#book"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-navy-900 shadow-gold-lg transition-all duration-300 hover:bg-gold-400 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
                >
                    Book This Trip
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
                <a
                    href="#save"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-sand-100/70 transition-all duration-300 hover:border-white/30 hover:text-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                    Save Itinerary
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TripPlanner() {
    const [step, setStep] = useState(0)
    const [dir, setDir] = useState<1 | -1>(1)

    // Form state
    const [destId, setDestId] = useState<string | null>(null)
    const [checkIn, setCheckIn] = useState<number | null>(null)
    const [checkOut, setCheckOut] = useState<number | null>(null)
    const [adults, setAdults] = useState(2)
    const [children, setChildren] = useState(0)
    const [accom, setAccom] = useState<AccomType>('Hotel')

    const activeDest = DESTINATIONS.find((d) => d.id === destId) ?? DESTINATIONS[0]

    const canAdvance = useCallback(() => {
        if (step === 0) return destId !== null
        if (step === 1) return checkIn !== null && checkOut !== null && nightsBetween(checkIn, checkOut) > 0
        return true
    }, [step, destId, checkIn, checkOut])

    function goTo(next: number) {
        setDir(next > step ? 1 : -1)
        setStep(next)
    }

    function handleCheckIn(i: number) {
        setCheckIn(i)
        if (checkOut !== null && checkOut <= i) setCheckOut(null)
    }

    const slideVariants = {
        enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
        center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.32, 0.72, 0, 1] as const } },
        exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const } }),
    }
    return (
        <section id="planner" className="relative overflow-hidden py-24 lg:py-32">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={activeDest.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover transition-all duration-1000"
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-navy-950/92" />
                {/* Subtle noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-20">
                {/* Section heading */}
                <SectionHeading
                    eyebrow="Plan Your Journey"
                    title="Build Your Perfect Trip"
                    highlight="Perfect"
                    subtitle="Answer four simple questions — we'll craft a personalised estimate and package for you."
                />

                {/* Widget card */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    className="mt-12 rounded-3xl border border-white/10 bg-navy-900/60 p-8 lg:p-12 backdrop-blur-xl"
                >
                    {/* ── Progress bar ── */}
                    <div className="mb-10" role="list" aria-label="Trip planner steps">
                        {/* Bar track */}
                        <div className="relative mb-4 h-1 w-full overflow-hidden rounded-full bg-white/8">
                            <motion.div
                                className="absolute inset-y-0 left-0 rounded-full bg-gold-500"
                                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            />
                        </div>
                        {/* Step labels */}
                        <div className="grid grid-cols-4 gap-1">
                            {STEPS.map((s, i) => (
                                <button
                                    key={s.short}
                                    role="listitem"
                                    onClick={() => { if (i < step || (i === step + 1 && canAdvance())) goTo(i) }}
                                    aria-current={i === step ? 'step' : undefined}
                                    className={cn(
                                        'flex flex-col items-center gap-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg py-1',
                                        i === step ? 'cursor-default' : i < step ? 'cursor-pointer' : 'cursor-default',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                                            i < step
                                                ? 'bg-gold-500 text-navy-900'
                                                : i === step
                                                    ? 'bg-gold-500/20 text-gold-500 ring-1 ring-gold-500/50'
                                                    : 'bg-white/8 text-sand-100/30',
                                        )}
                                    >
                                        {i < step ? (
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            i + 1
                                        )}
                                    </span>
                                    <span
                                        className={cn(
                                            'hidden sm:block text-xs font-medium truncate transition-colors duration-200',
                                            i === step ? 'text-gold-500' : i < step ? 'text-sand-100/60' : 'text-sand-100/25',
                                        )}
                                    >
                                        {s.short}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Step heading ── */}
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

                    {/* ── Step content ── */}
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
                                {step === 0 && (
                                    <StepDestination selected={destId} onSelect={setDestId} />
                                )}
                                {step === 1 && (
                                    <StepDates
                                        checkIn={checkIn}
                                        checkOut={checkOut}
                                        onCheckIn={handleCheckIn}
                                        onCheckOut={setCheckOut}
                                    />
                                )}
                                {step === 2 && (
                                    <StepGuests
                                        adults={adults}
                                        children={children}
                                        accom={accom}
                                        onAdults={setAdults}
                                        onChildren={setChildren}
                                        onAccom={setAccom}
                                    />
                                )}
                                {step === 3 && (
                                    <StepSummary
                                        destId={destId}
                                        checkIn={checkIn}
                                        checkOut={checkOut}
                                        adults={adults}
                                        children={children}
                                        accom={accom}
                                        active
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Navigation ── */}
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

                    {/* Back button on step 4 */}
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