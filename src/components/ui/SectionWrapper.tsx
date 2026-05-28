'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  id?: string
  className?: string
  /**
   * When true, the section fades up into view as it enters the viewport.
   * Uses useInView with once:true so it never replays.
   */
  fadeTop?: boolean
}

export function SectionWrapper({
  children,
  id,
  className,
  fadeTop = false,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={fadeTop ? { opacity: 0, y: 32 } : false}
      animate={fadeTop ? (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }) : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        // max width + horizontal padding (mobile → desktop)
        'mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-20',
        // vertical rhythm
        'py-20 lg:py-32',
        className
      )}
    >
      {children}
    </motion.section>
  )
}