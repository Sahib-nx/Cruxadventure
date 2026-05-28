'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Small all-caps label above the title */
  eyebrow?: string
  /** Main heading text */
  title: string
  /**
   * A single word in `title` that gets the gold gradient treatment.
   * Must match exactly (case-sensitive) one word in `title`.
   */
  highlight?: string
  /** Optional subtitle / description below the title */
  subtitle?: string
  /** Text alignment — defaults to center */
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  // Split title so we can wrap the highlight word in a gradient span
  const titleParts = highlight
    ? title.split(new RegExp(`(${highlight})`, 'g'))
    : [title]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={cn(
        'mb-12 lg:mb-16 flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <motion.span
          variants={childVariants}
          className={cn(
            'inline-flex items-center gap-2',
            'text-xs font-body font-semibold tracking-[0.2em] uppercase text-gold-500'
          )}
        >
          {/* Decorative line left of eyebrow */}
          <span className="w-6 h-px bg-gold-500/60" aria-hidden="true" />
          {eyebrow}
          <span className="w-6 h-px bg-gold-500/60" aria-hidden="true" />
        </motion.span>
      )}

      {/* Title */}
      <motion.h2
        variants={childVariants}
        className="font-display text-display-lg text-sand-100 leading-tight max-w-4xl"
      >
        {titleParts.map((part, i) =>
          part === highlight ? (
            <span key={i} className="text-gradient-gold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          variants={childVariants}
          className={cn(
            'font-body text-base lg:text-lg text-white/55 leading-relaxed',
            align === 'center' ? 'max-w-2xl' : 'max-w-xl'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}