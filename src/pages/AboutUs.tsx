'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconCompassValue = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)
const IconHeart = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)
const IconLeaf = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 5.6-1.2 12C16.85 16.95 14 18 11 20z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 11 13.5 12 10" />
  </svg>
)
const IconShield = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
  </svg>
)
const IconPerson = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const IconAward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
    <path d="M12 2l3 6.5 7 1-5 4.9 1.18 7L12 18l-6.18 3.4L7 14.4 2 9.5l7-1L12 2z" />
    <path d="M12 22v-4" />
    <path d="M9 22h6" />
  </svg>
)

// ─── Compass watermark (shared motif from Testimonials) ──────────────────────

function CompassWatermark() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-[0.035] pointer-events-none select-none"
    >
      <circle cx="200" cy="200" r="190" fill="none" stroke="#D4A853" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="160" fill="none" stroke="#D4A853" strokeWidth="0.75" />
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
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A853" strokeWidth={isMajor ? 1.5 : isMid ? 1 : 0.5} />
      })}
      {[{ l: 'N', a: 0 }, { l: 'E', a: 90 }, { l: 'S', a: 180 }, { l: 'W', a: 270 }].map(({ l, a }) => {
        const rad = (a * Math.PI) / 180
        const r = 148
        return (
          <text key={l} x={200 + r * Math.sin(rad)} y={200 - r * Math.cos(rad)} textAnchor="middle" dominantBaseline="central" fill="#D4A853" fontSize="16" fontWeight="600" fontFamily="serif" letterSpacing="2">
            {l}
          </text>
        )
      })}
      <polygon points="200,48 210,200 200,215 190,200" fill="#D4A853" opacity="0.9" />
      <polygon points="200,352 210,200 200,185 190,200" fill="#D4A853" opacity="0.25" />
      <circle cx="200" cy="200" r="12" fill="#D4A853" opacity="0.15" />
      <circle cx="200" cy="200" r="5" fill="#D4A853" opacity="0.6" />
    </svg>
  )
}

// ─── Count-up hook (shared pattern from StatsSection) ─────────────────────────

import { useState, useEffect } from 'react'

function useCountUp(target: number, active: boolean, duration = 2000) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      else setValue(target)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, active, duration])

  return value
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: <IconCompassValue />,
    title: 'Authentic Discovery',
    description: 'We design journeys around what a place actually is, not the postcard version of it. Local guides, real encounters, no tourist traps.',
  },
  {
    icon: <IconHeart />,
    title: 'Obsessive Care',
    description: 'Every itinerary is handcrafted, every detail checked twice. If something can go wrong, we have already planned around it.',
  },
  {
    icon: <IconLeaf />,
    title: 'Responsible Travel',
    description: 'We partner with locally owned operators and support conservation efforts in every destination we send travelers to.',
  },
  {
    icon: <IconShield />,
    title: 'Total Trust',
    description: 'Transparent pricing, real-time support, and a team that answers the phone. No surprises, no fine print games.',
  },
]

const STATS = [
  { id: 'travelers', target: 12000, suffix: '+', label: 'Happy Travelers', icon: <IconPerson /> },
  { id: 'destinations', target: 150, suffix: '+', label: 'Destinations', icon: <IconMapPin /> },
  { id: 'satisfaction', target: 98, suffix: '%', label: 'Satisfaction Rate', icon: <IconStar /> },
  { id: 'years', target: 8, suffix: '+', label: 'Years of Excellence', icon: <IconAward /> },
]

const TIMELINE = [
  { year: '2018', title: 'The First Itinerary', text: 'Founded in a San Francisco apartment, Wanderlust began with a single hand-built trip to Bali for a close friend\'s honeymoon.' },
  { year: '2020', title: 'Going Global', text: 'Despite a paused travel industry, we used the time to build relationships with over 60 local guides and boutique properties worldwide.' },
  { year: '2022', title: '150 Destinations', text: 'Our curated network expanded past 150 destinations across six continents, each personally vetted by our travel design team.' },
  { year: '2024', title: '12,000 Journeys', text: 'We crossed 12,000 travelers served, with a 98% satisfaction rate that remains our proudest number.' },
  { year: '2026', title: 'What\'s Next', text: 'New private-jet itineraries, expanded sustainability partnerships, and more reasons to fall in love with the world.' },
]

const TEAM = [
  {
    name: 'Elena Vasquez',
    role: 'Founder & CEO',
    initials: 'EV',
    bio: 'Former travel journalist who swapped writing about trips for designing them.',
  },
  {
    name: 'Marcus Chen',
    role: 'Head of Itinerary Design',
    initials: 'MC',
    bio: 'Has personally scouted over 80 of our 150 destinations on foot.',
  },
  {
    name: 'Aiko Tanaka',
    role: 'Director of Partnerships',
    initials: 'AT',
    bio: 'Builds the local relationships that make our trips feel like insider access.',
  },
  {
    name: 'Daniel Okafor',
    role: 'Head of Concierge',
    initials: 'DO',
    bio: 'Leads the 24-hour support team that travelers call their favorite part of the trip.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-3">
      <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-gold-500">
        {children}
      </span>
    </div>
  )
}

function ValueCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.32, 0.72, 0, 1] }}
      className="glass rounded-2xl p-6 lg:p-7"
    >
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-gold-400"
        style={{ background: 'rgba(212,168,83,0.13)' }}
      >
        {icon}
      </div>
      <h3 className="font-display text-lg text-sand-100 mb-2">{title}</h3>
      <p className="font-body text-sm leading-relaxed text-sand-100/60">{description}</p>
    </motion.div>
  )
}

function StatItem({ stat, active, index }: { stat: typeof STATS[number]; active: boolean; index: number }) {
  const count = useCountUp(stat.target, active, 2000)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col items-center gap-4 text-center"
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full text-gold-500"
        style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.25)' }}
        aria-hidden="true"
      >
        {stat.icon}
      </div>
      <p className="font-display text-display-lg text-gold-400 leading-none tabular-nums">
        {count.toLocaleString()}{stat.suffix}
      </p>
      <p className="font-body text-xs uppercase tracking-widest text-sand-100/55">{stat.label}</p>
    </motion.div>
  )
}

function TimelineItem({ item, index, isLast }: { item: typeof TIMELINE[number]; index: number; isLast: boolean }) {
  const isEven = index % 2 === 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      className="relative flex gap-6 lg:gap-10"
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-gold-500 shadow-gold" aria-hidden="true" />
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-gold-500/40 to-white/5 mt-1" aria-hidden="true" />}
      </div>

      {/* Content */}
      <div className="pb-12 lg:pb-16">
        <span className="font-display text-display-sm text-gradient-gold block mb-2">{item.year}</span>
        <h3 className="font-body font-semibold text-sand-100 mb-2">{item.title}</h3>
        <p className="font-body text-sm leading-relaxed text-sand-100/60 max-w-md">{item.text}</p>
      </div>
    </motion.div>
  )
}

function TeamCard({ member, delay }: { member: typeof TEAM[number]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.32, 0.72, 0, 1] }}
      className="glass rounded-2xl p-6 text-center"
    >
      <div
        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full font-display text-xl font-bold text-navy-900"
        style={{ background: '#D4A853' }}
        aria-hidden="true"
      >
        {member.initials}
      </div>
      <h3 className="font-body font-semibold text-sand-100 mb-1">{member.name}</h3>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold-500">{member.role}</p>
      <p className="font-body text-sm leading-relaxed text-sand-100/55">{member.bio}</p>
    </motion.div>
  )
}

// ─── Main exported section ────────────────────────────────────────────────────

export function AboutSection() {
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })

  return (
    <div className="bg-navy-900">

      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="relative flex min-h-[420px] items-center justify-center" style={{ height: '55vh' }}>
        <Image
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,22,40,0.72)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-gold-500">
              Our Story
            </span>
            <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
          </div>
          <h1 className="font-display text-display-xl text-sand-100 mb-4 leading-tight">
            We Believe Travel{' '}
            <span className="text-gradient-gold">Changes People</span>
          </h1>
          <p className="font-body text-base leading-relaxed text-sand-100/70 max-w-xl mx-auto">
            Wanderlust was built on a simple idea — that the right journey, planned
            with real care, can shift how you see the entire world.
          </p>
        </motion.div>
      </div>

      {/* ── Origin story ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-20 lg:py-28" aria-labelledby="story-heading">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-6"
          >
            <SectionEyebrow>How We Started</SectionEyebrow>
            <h2 id="story-heading" className="font-display text-display-md text-sand-100 mb-6 leading-tight">
              From One Dream Trip to{' '}
              <span className="text-gradient-gold">12,000 Journeys</span>
            </h2>
            <div className="space-y-4 font-body text-sm leading-relaxed text-sand-100/65">
              <p>
                Wanderlust started in 2018 with a single trip — a hand-built honeymoon
                itinerary to Bali for a close friend who wanted something no travel site
                could offer: a journey that felt designed around her, not a package
                pulled off a shelf.
              </p>
              <p>
                That trip led to another, then ten more, then a hundred. What began as
                a favor became a philosophy: every traveler deserves an itinerary built
                by someone who has actually walked the route, eaten at the table, and
                spoken to the guide.
              </p>
              <p>
                Eight years and 150+ destinations later, that's still exactly how we
                work. No call centers, no templates — just a small team of obsessive
                travel designers and a global network of people we trust.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative overflow-hidden rounded-3xl aspect-[4/5] lg:aspect-[5/6]">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=80"
                alt="Travelers exploring a sunrise destination"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-20 lg:py-28" aria-labelledby="values-heading">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <SectionEyebrow>What We Stand For</SectionEyebrow>
          </motion.div>
          <motion.h2
            id="values-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-display text-display-md text-sand-100"
          >
            Our Core <span className="text-gradient-gold">Values</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <ValueCard key={v.title} icon={v.icon} title={v.title} description={v.description} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── Stats (with compass watermark, navy-950 like Testimonials) ─────── */}
      <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-28" aria-label="Wanderlust in numbers">
        <CompassWatermark />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-20">
          <div className="text-center mb-14">
            <div className="flex justify-center">
              <SectionEyebrow>By The Numbers</SectionEyebrow>
            </div>
            <h2 className="font-display text-display-md text-sand-100">
              Eight Years of <span className="text-gradient-gold">Trust</span>
            </h2>
          </div>
          <div ref={statsRef} className="grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-4 lg:gap-x-12">
            {STATS.map((stat, i) => (
              <StatItem key={stat.id} stat={stat} active={statsInView} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-20 lg:py-28" aria-labelledby="timeline-heading">
        <div className="text-center mb-16">
          <div className="flex justify-center">
            <SectionEyebrow>Our Journey</SectionEyebrow>
          </div>
          <h2 id="timeline-heading" className="font-display text-display-md text-sand-100">
            How We <span className="text-gradient-gold">Got Here</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {TIMELINE.map((item, i) => (
            <TimelineItem key={item.year} item={item} index={i} isLast={i === TIMELINE.length - 1} />
          ))}
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-20 lg:py-28" aria-labelledby="team-heading">
        <div className="text-center mb-14">
          <div className="flex justify-center">
            <SectionEyebrow>The People Behind It</SectionEyebrow>
          </div>
          <h2 id="team-heading" className="font-display text-display-md text-sand-100">
            Meet The <span className="text-gradient-gold">Team</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <TeamCard key={member.name} member={member} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── Featured testimonial ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-20" aria-label="Featured testimonial">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="glass rounded-3xl border border-white/10 p-8 lg:p-12 text-center"
        >
          <svg className="h-10 w-12 text-gold-500 opacity-80 mx-auto mb-6" viewBox="0 0 60 50" fill="currentColor" aria-hidden="true">
            <path d="M0 30.4C0 18.133 7.893 7.893 23.68 0l3.413 5.547C18.24 9.6 13.227 15.04 11.947 22.08h10.666V50H0V30.4zm31.787 0C31.787 18.133 39.68 7.893 55.467 0l3.413 5.547C50.027 9.6 45.013 15.04 43.733 22.08H54.4V50H31.787V30.4z" />
          </svg>
          <p className="font-body text-lg lg:text-xl italic leading-relaxed text-sand-100/90 mb-6 max-w-2xl mx-auto">
            &ldquo;Every detail was perfect. The sunrise temple tour brought me to
            tears. Wanderlust didn't book us a holiday — they gave us a memory we'll
            carry forever.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold text-navy-900"
              style={{ background: '#D4A853' }}
              aria-hidden="true"
            >
              SM
            </div>
            <div className="text-left">
              <p className="font-semibold text-sand-100 text-sm">
                Sarah M. <span aria-label="United Kingdom">🇬🇧</span>
              </p>
              <p className="text-xs text-sand-100/50">London — Bali trip</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" aria-labelledby="cta-heading">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[600px] rounded-full"
          style={{ background: 'rgba(212,168,83,0.10)', filter: 'blur(80px)' }}
        />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-display text-display-md text-sand-100 mb-4"
          >
            Ready to Write Your{' '}
            <span className="text-gradient-gold">Own Story?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-body text-base leading-relaxed text-sand-100/60 mb-8"
          >
            Tell us where you want to go, or let us surprise you. Either way, we'll be with you every step.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/#planner"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-navy-900 shadow-gold transition-all duration-300 hover:bg-gold-400 hover:shadow-gold-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              Plan Your Trip
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-sand-100/70 transition-all duration-300 hover:border-white/30 hover:text-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Talk to Our Team
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}