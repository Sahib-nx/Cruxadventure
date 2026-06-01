'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const travelStyles = [
    { label: '⛰ Adventures', value: 'Adventure' },
    { label: '🥾 Trekking', value: 'Trekking' },
    { label: '🏛️ Camping', value: 'Camping' },
    { label: '❄ Snow Expeditions', value: 'Snow' },
    { label: '🏡 Family Journeys', value: 'Family' },
    { label: '🌿 Nature Journeys', value: 'Nature' },
    { label: '✦ Luxury Retreats', value: 'Luxury' },

]

export function TripPlannerTeaser() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    const [selected, setSelected] = useState<string | null>(null)

    return (
        <section
            ref={ref}
            id="planner-teaser"
            className="relative overflow-hidden py-24 lg:py-32"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-navy-to-ocean" />

            {/* Decorative grid pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
                aria-hidden="true"
            />

            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,83,0.08)_0%,_transparent_70%)]" aria-hidden="true" />

            {/* Floating compass */}
            <div className="absolute -right-20 -top-20 w-80 h-80 opacity-5 pointer-events-none select-none" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="white">
                    <circle cx="12" cy="12" r="9" strokeWidth={0.3} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.3}
                        d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
                </svg>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <span className="h-px w-8 bg-gold-500/60" />
                    <span className="font-body text-xs tracking-[0.25em] uppercase text-gold-400/80 font-medium">
                        Plan Your Journey
                    </span>
                    <span className="h-px w-8 bg-gold-500/60" />
                </motion.div>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
                    className="font-display font-semibold text-display-lg text-sand-100 leading-none mb-4"
                >
                    Where to Next?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                    className="font-body text-base text-sand-100/60 mb-10 max-w-xl mx-auto leading-relaxed"
                >
                    Tell us what moves you and we&apos;ll build the perfect itinerary — flights, hotels, guides, all of it.
                </motion.p>

                {/* Travel style chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-wrap justify-center gap-3 mb-10"
                    role="group"
                    aria-label="Select your travel style"
                >
                    {travelStyles.map(style => (
                        <button
                            key={style.value}
                            onClick={() => setSelected(s => s === style.value ? null : style.value)}
                            className={cn(
                                'font-body text-sm px-5 py-2.5 rounded-full border transition-all duration-300',
                                'hover:-translate-y-0.5 active:translate-y-0',
                                selected === style.value
                                    ? 'bg-gold-500 text-navy-900 border-gold-500 font-semibold shadow-gold'
                                    : 'glass-light text-sand-100/80 border-white/10 hover:border-gold-500/30 hover:text-sand-100',
                            )}
                            aria-pressed={selected === style.value}
                        >
                            {style.label}
                        </button>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/tripPlanner"
                        className={cn(
                            'group relative inline-flex items-center gap-3 overflow-hidden',
                            'px-8 py-4 rounded-full font-body font-semibold text-base',
                            'bg-gold-500 text-navy-900',
                            'hover:bg-gold-400 hover:shadow-gold-lg hover:-translate-y-0.5',
                            'transition-all duration-300 active:translate-y-0',
                        )}
                    >
                        <span className="relative">
                            {selected
                                ? `Plan My ${travelStyles.find(s => s.value === selected)?.label.split(' ')[1] ?? 'Trip'}`
                                : 'Start Planning'
                            }
                        </span>
                        <svg className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>

                    <Link
                        href="/contact"
                        className="font-body text-sm text-sand-100/50 hover:text-sand-100/80 transition-colors duration-200 underline underline-offset-4 decoration-sand-100/20 hover:decoration-sand-100/50"
                    >
                        Or speak to a travel expert
                    </Link>
                </motion.div>

                {/* Social proof micro-line */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-8 font-body text-xs text-sand-100/30"
                >
                    Joining 12,000+ travelers who planned their dream trip with us · No commitment required
                </motion.p>
            </div>
        </section>
    )
}