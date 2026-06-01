'use client'

import { useRef } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

const pillars = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
        ),
        label: 'Local Experts',
        headline: 'Guided by people who actually live there',
        description: 'Every itinerary is crafted by a specialist who has lived in the region — not just visited. Real knowledge, real connections, real experiences you won\'t find in any guidebook.',
        accent: 'bg-ocean-500/10 text-ocean-400 border-ocean-500/20',
        stat: '34 specialists',
        statLabel: 'across 6 continents',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
        ),
        label: 'Sustainable Travel',
        headline: 'Responsible by design, not by checkbox',
        description: 'Carbon-offset flights, eco-certified accommodations, and small groups capped at 12. We protect the destinations we love so they exist for the next generation of travelers.',
        accent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        stat: '100% carbon offset',
        statLabel: 'on every trip',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        label: '24/7 Support',
        headline: 'Someone always picks up, wherever you are',
        description: 'A dedicated trip concierge is available around the clock for the duration of your journey. Missed connection in Tokyo at 3am? We\'ve got you. Peace of mind, included.',
        accent: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
        stat: '< 2 min',
        statLabel: 'average response time',
    },
]


const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
}

const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 32,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: customEase,
        },
    },
}
export function WhyWanderlust() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <section className="relative bg-navy-950 py-20 lg:py-28 overflow-hidden">

            {/* Background compass watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
                <svg
                    className="w-[600px] h-[600px] opacity-[0.03] text-white"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <circle
                        cx="16"
                        cy="16"
                        r="14.5"
                        stroke="currentColor"
                        strokeWidth="0.5"
                    />

                    <circle
                        cx="16"
                        cy="16"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="0.3"
                        strokeDasharray="2 3"
                    />

                    <polygon
                        points="16,5 18,16 16,18 14,16"
                        fill="currentColor"
                    />

                    <polygon
                        points="16,27 18,16 16,14 14,16"
                        fill="currentColor"
                        fillOpacity="0.4"
                    />

                    <circle
                        cx="16"
                        cy="16"
                        r="1.5"
                        fill="currentColor"
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 relative z-10">

                {/* ── Heading ─────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="h-px w-8 bg-gold-500" />
                        <span className="font-body text-xs tracking-[0.25em] uppercase text-gold-400 font-medium">
                            Why Wanderlust
                        </span>
                        <span className="h-px w-8 bg-gold-500" />
                    </div>
                    <h2 className="font-display font-semibold text-display-lg text-sand-100 mb-4 leading-none">
                        Travel Done{' '}
                        <span className="text-gradient-gold">Differently</span>
                    </h2>
                    <p className="font-body text-base text-sand-100/60 leading-relaxed">
                        Three principles that separate a Wanderlust journey from everything else you&apos;ve tried.
                    </p>
                </motion.div>

                {/* ── Pillars ─────────────────────────────────────────── */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {pillars.map((pillar) => (
                        <motion.div
                            key={pillar.label}
                            variants={itemVariants}
                            className={cn(
                                'group relative glass rounded-3xl p-8 border',
                                'hover:border-gold-500/20 hover:-translate-y-1',
                                'transition-all duration-500 overflow-hidden',
                                'border-white/5',
                            )}
                        >
                            {/* Hover glow background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:from-gold-500/5 group-hover:to-transparent transition-all duration-500 rounded-3xl" />

                            {/* Icon */}
                            <div className={cn(
                                'relative w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border',
                                pillar.accent,
                            )}>
                                {pillar.icon}
                            </div>

                            {/* Label pill */}
                            <span className={cn(
                                'inline-block font-body text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1 rounded-full border mb-4',
                                pillar.accent,
                            )}>
                                {pillar.label}
                            </span>

                            {/* Headline */}
                            <h3 className="font-display font-semibold text-display-sm text-sand-100 mb-3 leading-snug">
                                {pillar.headline}
                            </h3>

                            {/* Description */}
                            <p className="font-body text-sm text-sand-100/55 leading-relaxed mb-6">
                                {pillar.description}
                            </p>

                            {/* Divider */}
                            <div className="h-px bg-white/5 mb-6" />

                            {/* Stat */}
                            <div>
                                <div className="font-display font-semibold text-2xl text-gold-400 leading-none mb-1">
                                    {pillar.stat}
                                </div>
                                <div className="font-body text-xs text-sand-100/40 tracking-wide">
                                    {pillar.statLabel}
                                </div>
                            </div>

                            {/* Corner decoration */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* ── Bottom trust bar ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
                >
                    {[
                        { icon: '🏆', text: 'Cruxadventure — Top Agency 2024' },
                        { icon: '⭐', text: '4.9 average rating across 12,000+ reviews' },
                        { icon: '🌿', text: 'Certified B-Corp · Sustainable Tourism' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                            <span className="text-base">{item.icon}</span>
                            <span className="font-body text-xs text-sand-100/40">{item.text}</span>
                            {i < 2 && <span className="hidden sm:block text-sand-100/15 text-lg">·</span>}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}