'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Stat {
  id: string
  target: number
  prefix?: string
  suffix: string
  label: string
  icon: React.ReactNode
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

const STATS: Stat[] = [
  {
    id: 'travelers',
    target: 12000,
    suffix: '+',
    label: 'Happy Travelers',
    icon: <IconPerson />,
  },
  {
    id: 'destinations',
    target: 150,
    suffix: '+',
    label: 'Destinations',
    icon: <IconMapPin />,
  },
  {
    id: 'satisfaction',
    target: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    icon: <IconStar />,
  },
  {
    id: 'years',
    target: 8,
    suffix: '+',
    label: 'Years of Excellence',
    icon: <IconAward />,
  },
]

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 2000) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, active, duration])

  return value
}

// ─── Single stat card ─────────────────────────────────────────────────────────

function StatCard({
  stat,
  active,
  index,
}: {
  stat: Stat
  active: boolean
  index: number
}) {
  const count = useCountUp(stat.target, active, 2000)
  const formatted = count.toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col items-center gap-5 text-center"
    >
      {/* Icon circle */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full text-gold-500"
        style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.25)' }}
        aria-hidden="true"
      >
        {stat.icon}
      </div>

      {/* Number */}
      <div aria-live="polite" aria-label={`${formatted}${stat.suffix} ${stat.label}`}>
        <p className="font-display text-display-xl text-gold-400 leading-none tabular-nums">
          {formatted}
          {stat.suffix}
        </p>
      </div>

      {/* Label */}
      <p className="font-body text-sm uppercase tracking-widest text-sand-100/60">
        {stat.label}
      </p>
    </motion.div>
  )
}

// ─── Gold divider ─────────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <div className="flex items-center gap-4" aria-hidden="true">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.6), transparent)' }} />
      <div className="h-1.5 w-1.5 rotate-45 bg-gold-500 opacity-60" />
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,83,0.6), transparent)' }} />
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })

  return (
    <section
      id="stats"
      className="relative overflow-hidden"
      aria-label="Our achievements in numbers"
    >
      {/* Parallax background */}
      <div
        className="absolute inset-0 z-0 hidden md:block"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
        aria-hidden="true"
      />
      {/* Mobile fallback (fixed attachment broken in iOS) */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      {/* Navy overlay */}
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(10,22,40,0.87)' }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-20 lg:py-32">

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="font-display text-display-md text-sand-100 text-center mb-12 lg:mb-16"
        >
          Trusted by Travelers{' '}
          <span className="text-gradient-gold">Worldwide</span>
        </motion.p>

        {/* Top divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          <GoldDivider />
        </motion.div>

        {/* Stats grid */}
        <div
          ref={ref}
          className="my-16 lg:my-20 grid grid-cols-2 gap-y-14 gap-x-8 lg:grid-cols-4 lg:gap-x-12"
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} active={inView} index={i} />
          ))}
        </div>

        {/* Vertical dividers between columns on desktop */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-20 pointer-events-none" aria-hidden="true">
          <div className="relative h-32 flex items-center">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${(n / 4) * 100}%`,
                  background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.2), transparent)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
        >
          <GoldDivider />
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection;