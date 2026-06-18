'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Paper plane SVG ──────────────────────────────────────────────────────────

function PaperPlane({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M60 4L28 36"
        stroke="#D4A853"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 4L40 60L28 36L4 24L60 4Z"
        stroke="#D4A853"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(212,168,83,0.15)"
      />
    </svg>
  )
}

// ─── Gold checkmark ───────────────────────────────────────────────────────────

function GoldCheck() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
      style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.35)' }}
      aria-hidden="true"
    >
      <svg className="h-8 w-8 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        />
      </svg>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'shake' | 'success'>('idle')
  const [showPlane, setShowPlane] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'success') return

    if (!isValidEmail(email)) {
      setStatus('shake')
      setTimeout(() => setStatus('idle'), 600)
      inputRef.current?.focus()
      return
    }

    // Trigger plane animation, then show success
    setShowPlane(true)
    setTimeout(() => {
      setShowPlane(false)
      setStatus('success')
    }, 1300)
  }

  return (
    <section
      id="newsletter"
      className="relative overflow-hidden bg-navy-950 py-24 lg:py-32"
      aria-labelledby="newsletter-heading"
    >
      {/* Radial gold glow — blurred div (not CSS gradient) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[640px] rounded-full"
        style={{
          background: 'rgba(212,168,83,0.12)',
          filter: 'blur(80px)',
        }}
      />
      {/* Secondary softer glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[360px] rounded-full"
        style={{
          background: 'rgba(212,168,83,0.08)',
          filter: 'blur(40px)',
        }}
      />

      {/* Flying paper plane */}
      <AnimatePresence>
        {showPlane && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 z-20"
            initial={{ x: -120, opacity: 0 }}
            animate={{
              x: [null, 200, 700],
              opacity: [0, 1, 1, 0],
              y: [0, -30, -60],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          >
            <PaperPlane className="h-16 w-16" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <AnimatePresence mode="wait">
          {status !== 'success' ? (
            <motion.div
              key="form"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-flex items-center rounded-full border border-gold-500/25 bg-gold-500/10 px-4 py-1.5"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-500">
                  Stay Inspired
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                id="newsletter-heading"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="font-display text-display-md text-sand-100 mb-4"
              >
                Get Weekly Travel{' '}
                <span className="text-gradient-gold">Inspiration</span>
              </motion.h2>

              {/* Subline */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 }}
                className="mb-10 font-body text-base leading-relaxed text-sand-100/55"
              >
                Destination guides, hidden gems, and exclusive early-access deals —
                straight to your inbox.
              </motion.p>

              {/* Form */}
              <motion.form
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-3 sm:flex-row sm:gap-2"
                aria-label="Newsletter signup"
              >
                <motion.div
                  className="flex-1"
                  animate={
                    status === 'shake'
                      ? { x: [-8, 8, -8, 6, -6, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    ref={inputRef}
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={status === 'shake' ? 'true' : undefined}
                    className={cn(
                      'w-full rounded-full py-4 px-6 font-body text-sm text-sand-100 placeholder:text-sand-100/35 outline-none transition-all duration-200',
                      'focus:ring-2 focus:ring-gold-500',
                      status === 'shake'
                        ? 'ring-2 ring-red-400/60 bg-red-500/10 backdrop-blur-lg border border-red-400/20'
                        : 'glass border border-white/10 focus:border-gold-500/40',
                    )}
                  />
                </motion.div>

                <button
                  type="submit"
                  className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-navy-900 shadow-gold transition-all duration-300 hover:bg-gold-400 hover:shadow-gold-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 sm:self-stretch"
                >
                  Subscribe
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </motion.form>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="mt-4 text-xs text-sand-100/30"
              >
                No spam. Unsubscribe anytime. We respect your privacy.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <GoldCheck />
              <h2 className="font-display text-display-md text-sand-100 mb-3">
                You&apos;re on the list!{' '}
                <span aria-label="airplane" role="img">✈️</span>
              </h2>
              <p className="font-body text-base text-sand-100/55">
                Welcome aboard. Your first dose of wanderlust lands soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Newsletter;
