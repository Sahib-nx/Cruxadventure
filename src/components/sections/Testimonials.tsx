'use client'

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '@/components/ui/Sectionheading'
import { cn } from '@/lib/utils'

// ─── Data ────────────────────────────────────────────────────────────────────

interface Testimonial {
    id: string
    name: string
    initials: string
    location: string
    flag: string
    destination: string
    quote: string
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 'sarah',
        name: 'Sarah M.',
        initials: 'SM',
        location: 'London',
        flag: '🇬🇧',
        destination: 'Bali',
        quote:
            'Every detail was perfect. The sunrise temple tour brought me to tears. Wanderlust did not book us a holiday, they gave us a memory we will carry forever.',
    },
    {
        id: 'james-priya',
        name: 'James & Priya K.',
        initials: 'JP',
        location: 'Toronto',
        flag: '🇨🇦',
        destination: 'Maldives',
        quote:
            'Our overwater villa was beyond anything we imagined. Waking up to that lagoon every morning felt surreal. Worth every penny and then some.',
    },
    {
        id: 'marco',
        name: 'Marco R.',
        initials: 'MR',
        location: 'Milan',
        flag: '🇮🇹',
        destination: 'Santorini',
        quote:
            'The private caldera dinner they arranged was the most romantic evening of my life. Flawless organisation, zero stress, pure magic.',
    },
    {
        id: 'yuki',
        name: 'Yuki T.',
        initials: 'YT',
        location: 'Tokyo',
        flag: '🇯🇵',
        destination: 'Patagonia',
        quote:
            'I am an experienced trekker and this was still the most awe-inspiring trip I have ever done. Their local guide knew spots no guidebook mentions.',
    },
    {
        id: 'aisha',
        name: 'Aisha B.',
        initials: 'AB',
        location: 'Dubai',
        flag: '🇦🇪',
        destination: 'Kyoto',
        quote:
            'The cherry blossom season timing was perfect. They handled everything — I just showed up and experienced Japan at its most beautiful.',
    },
]

// ─── Compass SVG watermark ────────────────────────────────────────────────────

function useIsMounted() {
    return useSyncExternalStore(
        () => () => { },
        () => true,
        () => false,
    )
}

function CompassWatermark() {

    const mounted = useIsMounted()
    if (!mounted) return null

    if (!mounted) return null
    return (
        <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-[0.035] pointer-events-none select-none"
        >
            {/* Outer ring */}
            <circle cx="200" cy="200" r="190" fill="none" stroke="#D4A853" strokeWidth="1.5" />
            {/* Inner ring */}
            <circle cx="200" cy="200" r="160" fill="none" stroke="#D4A853" strokeWidth="0.75" />
            {/* Degree marks — 36 ticks every 10° */}
            {Array.from({ length: 72 }).map((_, i) => {
                const angle = (i * 5 * Math.PI) / 180
                const isMajor = i % 18 === 0
                const isMid = i % 9 === 0
                const r1 = 190
                const r2 = isMajor ? 168 : isMid ? 174 : 178
                const x1 = 200 + r1 * Math.sin(angle)
                const y1 = 200 - r1 * Math.cos(angle)
                const x2 = 200 + r2 * Math.sin(angle)
                const y2 = 200 - r2 * Math.cos(angle)
                return (
                    <line
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#D4A853"
                        strokeWidth={isMajor ? 1.5 : isMid ? 1 : 0.5}
                    />
                )
            })}
            {/* Cardinal labels */}
            {[
                { label: 'N', angle: 0 },
                { label: 'E', angle: 90 },
                { label: 'S', angle: 180 },
                { label: 'W', angle: 270 },
            ].map(({ label, angle }) => {
                const rad = (angle * Math.PI) / 180
                const r = 148
                const x = 200 + r * Math.sin(rad)
                const y = 200 - r * Math.cos(rad)
                return (
                    <text
                        key={label}
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#D4A853"
                        fontSize="16"
                        fontWeight="600"
                        fontFamily="serif"
                        letterSpacing="2"
                    >
                        {label}
                    </text>
                )
            })}
            {/* Intercardinal labels */}
            {[
                { label: 'NE', angle: 45 },
                { label: 'SE', angle: 135 },
                { label: 'SW', angle: 225 },
                { label: 'NW', angle: 315 },
            ].map(({ label, angle }) => {
                const rad = (angle * Math.PI) / 180
                const r = 148
                const x = 200 + r * Math.sin(rad)
                const y = 200 - r * Math.cos(rad)
                return (
                    <text
                        key={label}
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#D4A853"
                        fontSize="9"
                        fontWeight="400"
                        fontFamily="serif"
                        letterSpacing="1"
                    >
                        {label}
                    </text>
                )
            })}
            {/* Cross lines */}
            <line x1="200" y1="30" x2="200" y2="370" stroke="#D4A853" strokeWidth="0.4" strokeDasharray="4 6" />
            <line x1="30" y1="200" x2="370" y2="200" stroke="#D4A853" strokeWidth="0.4" strokeDasharray="4 6" />
            {/* Diamond needle — north gold */}
            <polygon
                points="200,48 210,200 200,215 190,200"
                fill="#D4A853"
                opacity="0.9"
            />
            {/* Diamond needle — south muted */}
            <polygon
                points="200,352 210,200 200,185 190,200"
                fill="#D4A853"
                opacity="0.25"
            />
            {/* Centre disc */}
            <circle cx="200" cy="200" r="12" fill="#D4A853" opacity="0.15" />
            <circle cx="200" cy="200" r="5" fill="#D4A853" opacity="0.6" />
            {/* 8-point star ring at 45° intervals */}
            {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180
                const ro = 130
                const ri = 118
                const xo = 200 + ro * Math.sin(angle)
                const yo = 200 - ro * Math.cos(angle)
                const xi = 200 + ri * Math.sin(angle)
                const yi = 200 - ri * Math.cos(angle)
                return (
                    <line key={i} x1={xi} y1={yi} x2={xo} y2={yo}
                        stroke="#D4A853" strokeWidth="0.75" />
                )
            })}
        </svg>
    )
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <div className="flex items-center gap-1" aria-label={`${count} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={cn('h-4 w-4', i < count ? 'text-gold-500' : 'text-sand-100/20')}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    )
}

// ─── Quotation mark ───────────────────────────────────────────────────────────

function QuoteMark() {
    return (
        <svg
            viewBox="0 0 60 50"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="h-12 w-14 text-gold-500 opacity-80 flex-shrink-0"
            fill="currentColor"
        >
            <path d="M0 30.4C0 18.133 7.893 7.893 23.68 0l3.413 5.547C18.24 9.6 13.227 15.04 11.947 22.08h10.666V50H0V30.4zm31.787 0C31.787 18.133 39.68 7.893 55.467 0l3.413 5.547C50.027 9.6 45.013 15.04 43.733 22.08H54.4V50H31.787V30.4z" />
        </svg>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Testimonials() {
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)
    const [dir, setDir] = useState<1 | -1>(1)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const go = useCallback((next: number) => {
        setDir(next > active ? 1 : -1)
        setActive(next)
    }, [active])

    const prev = useCallback(() =>
        go((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), [active, go])

    const next = useCallback(() =>
        go((active + 1) % TESTIMONIALS.length), [active, go])

    useEffect(() => {
        if (paused) return
        intervalRef.current = setInterval(() => {
            setDir(1)
            setActive((a) => (a + 1) % TESTIMONIALS.length)
        }, 5000)
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [paused])

    const t = TESTIMONIALS[active]

    const cardVariants = {
        enter: (d: number) => ({ opacity: 0, y: d > 0 ? 20 : -20 }),
        center: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
        },
        exit: (d: number) => ({
            opacity: 0,
            y: d > 0 ? -20 : 20,
            transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const },
        }),
    }

    return (
        <section
            id="testimonials"
            className="relative overflow-hidden bg-navy-950 py-24 lg:py-32"
        >
            {/* Compass watermark */}
            <CompassWatermark />

            {/* Radial gold glow behind card */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(212,168,83,0.07) 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-20">
                {/* Heading */}
                <SectionHeading
                    eyebrow="Traveller Stories"
                    title="Words From Our Wanderers"
                    highlight="Wanderers"
                    subtitle="Real journeys. Real people. Real wonder."
                />

                {/* Carousel */}
                <div
                    className="mt-14 flex flex-col items-center"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {/* Card area */}
                    <div className="relative w-full max-w-3xl">
                        <AnimatePresence custom={dir} mode="wait">
                            <motion.article
                                key={t.id}
                                custom={dir}
                                variants={cardVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                aria-label={`Testimonial from ${t.name}`}
                                className="glass rounded-3xl border border-white/10 p-8 lg:p-12"
                            >
                                {/* Top row: quote mark + stars */}
                                <div className="flex items-start justify-between mb-6">
                                    <QuoteMark />
                                    <StarRating count={5} />
                                </div>

                                {/* Quote */}
                                <blockquote className="mb-8">
                                    <p className="font-body text-lg italic leading-relaxed text-sand-100/90">
                                        &ldquo;{t.quote}&rdquo;
                                    </p>
                                </blockquote>

                                {/* Divider */}
                                <div className="mb-6 h-px w-full bg-white/8" />

                                {/* Author row */}
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div
                                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 font-display text-sm font-bold text-navy-900 select-none"
                                            aria-hidden="true"
                                        >
                                            {t.initials}
                                        </div>
                                        {/* Name + location */}
                                        <div>
                                            <p className="font-semibold text-sand-100">
                                                {t.name}{' '}
                                                <span aria-label={t.location} className="ml-1">
                                                    {t.flag}
                                                </span>
                                            </p>
                                            <p className="text-sm text-sand-100/50">{t.location}</p>
                                        </div>
                                    </div>

                                    {/* Destination tag */}
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-500">
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {t.destination}
                                    </span>
                                </div>
                            </motion.article>
                        </AnimatePresence>

                        {/* Arrow buttons — flanking the card on desktop */}
                        <button
                            onClick={prev}
                            aria-label="Previous testimonial"
                            className="absolute -left-5 top-1/2 -translate-y-1/2 hidden lg:flex h-11 w-11 items-center justify-center rounded-full glass border border-white/10 text-sand-100/50 transition-all duration-200 hover:text-gold-500 hover:border-gold-500/40 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next testimonial"
                            className="absolute -right-5 top-1/2 -translate-y-1/2 hidden lg:flex h-11 w-11 items-center justify-center rounded-full glass border border-white/10 text-sand-100/50 transition-all duration-200 hover:text-gold-500 hover:border-gold-500/40 hover:shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile arrow row */}
                    <div className="mt-6 flex items-center gap-4 lg:hidden">
                        <button
                            onClick={prev}
                            aria-label="Previous testimonial"
                            className="flex h-10 w-10 items-center justify-center rounded-full glass border border-white/10 text-sand-100/50 transition-all hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next testimonial"
                            className="flex h-10 w-10 items-center justify-center rounded-full glass border border-white/10 text-sand-100/50 transition-all hover:text-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Dot indicators */}
                    <div
                        className="mt-8 flex items-center gap-2"
                        role="tablist"
                        aria-label="Testimonial navigation"
                    >
                        {TESTIMONIALS.map((testimonial, i) => (
                            <button
                                key={testimonial.id}
                                role="tab"
                                aria-selected={i === active}
                                aria-label={`Go to testimonial from ${testimonial.name}`}
                                onClick={() => go(i)}
                                className={cn(
                                    'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                                    i === active
                                        ? 'w-8 h-2 bg-gold-500'
                                        : 'w-2 h-2 bg-sand-100/20 hover:bg-sand-100/40',
                                )}
                            />
                        ))}
                    </div>

                    {/* Auto-play progress bar */}
                    <div className="mt-5 h-px w-48 overflow-hidden rounded-full bg-white/8">
                        {!paused && (
                            <motion.div
                                key={`progress-${active}`}
                                className="h-full bg-gold-500/50 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 5, ease: 'linear' }}
                            />
                        )}
                    </div>
                </div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-16 flex flex-wrap items-center justify-center gap-8 lg:gap-16"
                >
                    {[
                        { value: '98%', label: 'Client satisfaction' },
                        { value: '12k+', label: 'Trips curated' },
                        { value: '4.9★', label: 'Average rating' },
                        { value: '60+', label: 'Countries covered' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="font-display text-display-md text-gradient-gold">{stat.value}</p>
                            <p className="mt-1 text-xs uppercase tracking-widest text-sand-100/45">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}