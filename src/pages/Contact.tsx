'use client'

import { useState, useRef, useId } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

interface FormFields {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  destination: string
  message: string
  subscribe: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  message?: string
}

const EMPTY_FIELDS: FormFields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: 'General Inquiry',
  destination: 'Not Sure Yet',
  message: '',
  subscribe: false,
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const IconEmail = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const IconPhone = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)
const IconLocation = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IconClock = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)
const IconPaperPlane = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth={0} />
  </svg>
)
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)
const IconSpinner = () => (
  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

// ─── Shared input class ───────────────────────────────────────────────────────

const inputCls = [
  'w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5',
  'font-body text-sm text-sand-100 placeholder:text-sand-100/30',
  'focus:outline-none focus:border-gold-500/60 focus:bg-white/[0.08]',
  'focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)]',
  'transition-all duration-300',
].join(' ')

const selectCls = [
  inputCls,
  'appearance-none cursor-pointer',
  'bg-[image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23F5EFE0\' stroke-opacity=\'0.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")]',
  'bg-no-repeat bg-[right_1rem_center] bg-[length:1.25rem]',
].join(' ')

// ─── Field label ──────────────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-body text-xs font-semibold uppercase tracking-widest text-sand-100/50">
      {children}
    </label>
  )
}

// ─── Field error ──────────────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 text-xs text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

// ─── Shaking field wrapper ────────────────────────────────────────────────────

function ShakeField({ shake, children }: { shake: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      animate={shake ? { x: [-6, 6, -6, 4, -4, 0] } : { x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({
  icon,
  title,
  children,
  delay,
  inView,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  delay: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.32, 0.72, 0, 1] }}
      className="glass flex items-start gap-4 rounded-2xl p-5"
    >
      <div className="flex-shrink-0 rounded-xl p-3 text-gold-400" style={{ background: 'rgba(212,168,83,0.13)' }}>
        {icon}
      </div>
      <div>
        <p className="mb-1 font-body text-sm font-medium text-sand-100">{title}</p>
        <div className="font-body text-sm leading-relaxed text-sand-100/60">{children}</div>
      </div>
    </motion.div>
  )
}

// ─── FAQ accordion ────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking 3–6 months ahead for peak season expeditions. That said, we often accommodate last-minute trips — just reach out and we\'ll do our best.',
  },
  {
    q: 'Do you offer custom private tours?',
    a: 'Absolutely. Custom itineraries are our specialty. Tell us your dates, interests, and budget and we\'ll design something completely unique to you.',
  },
  {
    q: 'What\'s included in your packages?',
    a: 'All our packages include permits, accommodation, transfers, and a dedicated trip concierge. Activities and meals vary by package — we\'ll outline everything clearly.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Most packages offer free cancellation up to 30 days before departure. We also offer optional travel insurance. Full details are provided at booking.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset"
      >
        <span className="font-body text-sm font-medium text-sand-100">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-gold-500 text-xl leading-none select-none"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 pt-0 font-body text-sm leading-relaxed text-sand-100/60">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Contact form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<FormErrors>({})
  const [shaking, setShaking] = useState<Partial<Record<keyof FormErrors, boolean>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [errorDismissed, setErrorDismissed] = useState(false)
  const uid = useId()

  function set<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!fields.firstName.trim() || fields.firstName.trim().length < 2)
      e.firstName = 'First name must be at least 2 characters.'
    if (!fields.lastName.trim() || fields.lastName.trim().length < 2)
      e.lastName = 'Last name must be at least 2 characters.'
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = 'Please enter a valid email address.'
    if (!fields.message.trim() || fields.message.trim().length < 20)
      e.message = 'Message must be at least 20 characters.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Trigger shake on each invalid field
      const s: typeof shaking = {}
      ;(Object.keys(errs) as (keyof FormErrors)[]).forEach((k) => { s[k] = true })
      setShaking(s)
      setTimeout(() => setShaking({}), 400)
      return
    }

    setStatus('loading')
    setErrorDismissed(false)

    // ── Actual API call — this was previously a fake setTimeout that always
    // resolved to 'success' without sending anything. Now it really hits the
    // SMTP-backed route at /api/contact.
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        // Server-side validation failures (422) map back onto the same fields
        if (res.status === 422 && body.fieldErrors) {
          setErrors(body.fieldErrors)
          const s: typeof shaking = {}
          ;(Object.keys(body.fieldErrors) as (keyof FormErrors)[]).forEach((k) => { s[k] = true })
          setShaking(s)
          setTimeout(() => setShaking({}), 400)
          setStatus('idle')
          return
        }
        setErrorMessage(body.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch (err) {
      // Network failure / route crashed before returning JSON
      console.error('Contact form network error:', err)
      setErrorMessage('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const successView = (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col items-center justify-center py-12 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Animated checkmark */}
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: 'rgba(212,168,83,0.13)', border: '1px solid rgba(212,168,83,0.3)' }}
        aria-hidden="true"
      >
        <svg className="h-10 w-10 text-gold-500" viewBox="0 0 48 48" fill="none">
          <motion.path
            d="M10 26l10 10 18-22"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          />
        </svg>
      </div>
      <h3 className="font-display text-display-sm text-sand-100 mb-3">Message Sent!</h3>
      <p className="mb-8 max-w-sm font-body text-sm leading-relaxed text-sand-100/60">
        Thank you, {fields.firstName}! We&apos;ll get back to you within 24 hours.
        Check your inbox at{' '}
        <span className="text-gold-500">{fields.email}</span>.
      </p>
      <button
        onClick={() => { setStatus('idle'); setFields(EMPTY_FIELDS); setErrors({}) }}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-sand-100/70 transition-all hover:border-white/30 hover:text-sand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        Send Another Message
      </button>
    </motion.div>
  )

  const formView = (
    <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <h2 className="font-display text-display-sm text-sand-100 mb-6">
        Send Us a Message
      </h2>

      {/* Error toast */}
      <AnimatePresence>
        {status === 'error' && !errorDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-500/30 glass-light p-4"
            role="alert"
          >
            <p className="font-body text-sm text-sand-100/80">
              {errorMessage || 'Something went wrong. Please try again or email us directly at'}{' '}
              <a href="mailto:hello@cruxadventure.com" className="text-gold-500 hover:underline">
                hello@cruxadventure.com
              </a>
            </p>
            <button
              onClick={() => setErrorDismissed(true)}
              aria-label="Dismiss error"
              className="flex-shrink-0 text-sand-100/40 hover:text-sand-100/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate aria-label="Contact form" className="space-y-5">
        {/* Row 1: First + Last name */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor={`${uid}-first`}>First Name *</FieldLabel>
            <ShakeField shake={!!shaking.firstName}>
              <input
                id={`${uid}-first`}
                type="text"
                autoComplete="given-name"
                value={fields.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                placeholder="Jane"
                aria-required="true"
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? `${uid}-first-err` : undefined}
                className={cn(inputCls, errors.firstName && 'border-red-400/50 focus:border-red-400/70')}
              />
            </ShakeField>
            <FieldError id={`${uid}-first-err`} message={errors.firstName} />
          </div>
          <div>
            <FieldLabel htmlFor={`${uid}-last`}>Last Name *</FieldLabel>
            <ShakeField shake={!!shaking.lastName}>
              <input
                id={`${uid}-last`}
                type="text"
                autoComplete="family-name"
                value={fields.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                placeholder="Smith"
                aria-required="true"
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? `${uid}-last-err` : undefined}
                className={cn(inputCls, errors.lastName && 'border-red-400/50 focus:border-red-400/70')}
              />
            </ShakeField>
            <FieldError id={`${uid}-last-err`} message={errors.lastName} />
          </div>
        </div>

        {/* Row 2: Email + Phone */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor={`${uid}-email`}>Email Address *</FieldLabel>
            <ShakeField shake={!!shaking.email}>
              <input
                id={`${uid}-email`}
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="jane@example.com"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                className={cn(inputCls, errors.email && 'border-red-400/50 focus:border-red-400/70')}
              />
            </ShakeField>
            <FieldError id={`${uid}-email-err`} message={errors.email} />
          </div>
          <div>
            <FieldLabel htmlFor={`${uid}-phone`}>Phone Number</FieldLabel>
            <input
              id={`${uid}-phone`}
              type="tel"
              autoComplete="tel"
              value={fields.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={inputCls}
            />
          </div>
        </div>

        {/* Row 3: Subject */}
        <div>
          <FieldLabel htmlFor={`${uid}-subject`}>Subject</FieldLabel>
          <select
            id={`${uid}-subject`}
            value={fields.subject}
            onChange={(e) => set('subject', e.target.value)}
            className={selectCls}
          >
            {['General Inquiry', 'Custom Itinerary', 'Booking Support', 'Partnership', 'Press & Media'].map((o) => (
              <option key={o} value={o} className="bg-navy-900 text-sand-100">{o}</option>
            ))}
          </select>
        </div>

        {/* Row 4: Destination */}
        <div>
          <FieldLabel htmlFor={`${uid}-dest`}>Destination of Interest</FieldLabel>
          <select
            id={`${uid}-dest`}
            value={fields.destination}
            onChange={(e) => set('destination', e.target.value)}
            className={selectCls}
          >
            {['Kashmir Great Lakes Trek', 'Annapurna Base Camp', 'Everest Base Camp', 'Gulmarg & Sonmarg', 'Multiple Destinations', 'Not Sure Yet'].map((o) => (
              <option key={o} value={o} className="bg-navy-900 text-sand-100">{o}</option>
            ))}
          </select>
        </div>

        {/* Row 5: Message */}
        <div>
          <FieldLabel htmlFor={`${uid}-message`}>Message *</FieldLabel>
          <ShakeField shake={!!shaking.message}>
            <textarea
              id={`${uid}-message`}
              rows={5}
              value={fields.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="Tell us about your dream trip..."
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? `${uid}-msg-err` : undefined}
              className={cn(inputCls, 'resize-none', errors.message && 'border-red-400/50 focus:border-red-400/70')}
            />
          </ShakeField>
          <FieldError id={`${uid}-msg-err`} message={errors.message} />
        </div>

        {/* Row 6: Subscribe checkbox */}
        <div>
          <label
            htmlFor={`${uid}-subscribe`}
            className="glass-light flex cursor-pointer items-start gap-3 rounded-lg p-4 transition-colors hover:bg-white/[0.06]"
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                id={`${uid}-subscribe`}
                type="checkbox"
                checked={fields.subscribe}
                onChange={(e) => set('subscribe', e.target.checked)}
                className="sr-only"
              />
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded border transition-all duration-200',
                  fields.subscribe
                    ? 'bg-gold-500 border-gold-500'
                    : 'border-white/20 bg-white/5',
                )}
                aria-hidden="true"
              >
                <AnimatePresence>
                  {fields.subscribe && (
                    <motion.svg
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15, type: 'spring', stiffness: 400 }}
                      className="h-3 w-3 text-navy-900"
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <span className="font-body text-sm leading-relaxed text-sand-100/60">
              I agree to receive travel inspiration and offers from Cruxadventure.{' '}
              <span className="text-sand-100/40">Unsubscribe anytime.</span>
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-gold-500 px-8 py-4 text-sm font-bold text-navy-900 shadow-gold transition-all duration-300 hover:bg-gold-400 hover:shadow-gold-lg disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
        >
          {status === 'loading' ? (
            <>
              <IconSpinner />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <IconPaperPlane />
            </>
          )}
        </button>
      </form>
    </motion.div>
  )

  return (
    <div className="glass rounded-3xl border border-white/10 p-8 lg:p-10">
      <AnimatePresence mode="wait">
        {status === 'success' ? successView : formView}
      </AnimatePresence>
    </div>
  )
}

// ─── Main exported section ────────────────────────────────────────────────────

export function ContactSection() {
  const leftRef = useRef<HTMLDivElement>(null)
  const leftInView = useInView(leftRef, { once: true, margin: '-80px' })
  const bottomRef = useRef<HTMLDivElement>(null)
  const bottomInView = useInView(bottomRef, { once: true, margin: '-60px' })

  const INFO_CARDS = [
    {
      icon: <IconEmail />,
      title: 'Email Us',
      content: (
        <>
          <a href="mailto:hello@cruxadventure.com" className="block hover:text-gold-500 transition-colors">hello@cruxadventure.com</a>
          <a href="mailto:support@cruxadventure.com" className="block hover:text-gold-500 transition-colors">support@cruxadventure.com</a>
        </>
      ),
    },
    {
      icon: <IconPhone />,
      title: 'Call Us',
      content: (
        <>
          {/* 🔧 TODO: replace with real number — matches BRAND.phone in app/api/contact/route.ts */}
          <a href="tel:+910000000000" className="block hover:text-gold-500 transition-colors">+91 00000 00000</a>
          <span className="block text-sand-100/40">Mon–Sat, 9am–6pm IST</span>
        </>
      ),
    },
    {
      icon: <IconLocation />,
      title: 'Visit Us',
      content: (
        <>
          {/* 🔧 TODO: replace with real address — matches BRAND.address in app/api/contact/route.ts */}
          <span className="block">Cruxadventure HQ, [Street / Area]</span>
          <span className="block">Srinagar, J&amp;K [PIN]</span>
        </>
      ),
    },
    {
      icon: <IconClock />,
      title: 'Response Time',
      content: (
        <>
          <span className="block">We reply within 24 hours</span>
          <span className="block text-sand-100/40">Usually much faster</span>
        </>
      ),
    },
  ]

  return (
    <div className="bg-navy-900 min-h-screen">
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className="relative flex min-h-[320px] items-center justify-center" style={{ height: '40vh' }}>
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,22,40,0.70)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-gold-500">
              We&apos;d Love to Hear From You
            </span>
            <span className="h-px w-8 bg-gold-500/70" aria-hidden="true" />
          </div>
          <h1 className="font-display text-display-xl text-sand-100 mb-4 leading-tight">
            Get in Touch
          </h1>
          <p className="font-body text-base leading-relaxed text-sand-100/70 max-w-xl mx-auto">
            Questions, custom itineraries, or just dreaming out loud — our travel experts reply within 24 hours.
          </p>
        </motion.div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

          {/* Form — first on mobile, second on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="order-1 lg:order-2 lg:col-span-7"
          >
            <ContactForm />
          </motion.div>

          {/* Info column */}
          <div ref={leftRef} className="order-2 lg:order-1 lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              animate={leftInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
              className="font-display text-display-sm text-sand-100 mb-8"
            >
              Contact Information
            </motion.h2>

            <div className="space-y-4 mb-10">
              {INFO_CARDS.map((card, i) => (
                <InfoCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  delay={0.1 * (i + 1)}
                  inView={leftInView}
                >
                  {card.content}
                </InfoCard>
              ))}
            </div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <p className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-sand-100/40">
                Follow Our Journey
              </p>
              <div className="flex items-center gap-3" aria-label="Social media links">
                {[
                  { label: 'Follow on X (formerly Twitter)', icon: <IconX />, href: 'https://x.com' },
                  { label: 'Follow on Instagram', icon: <IconInstagram />, href: 'https://instagram.com' },
                  { label: 'Follow on Facebook', icon: <IconFacebook />, href: 'https://facebook.com' },
                  { label: 'Follow on YouTube', icon: <IconYouTube />, href: 'https://youtube.com' },
                ].map(({ label, icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="glass-light flex h-10 w-10 items-center justify-center rounded-full text-sand-100/50 transition-all duration-200 hover:bg-gold-500/20 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom: Map + FAQ ─────────────────────────────────────────── */}
        <div ref={bottomRef} className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-7"
          >
            <div className="glass overflow-hidden rounded-3xl h-80 border border-white/8">
              <iframe
                title="Cruxadventure office location — Bemina, Srinagar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26436.845680551443!2d74.74848423975433!3d34.079620431351856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e190041d354a61%3A0x19501295963a23b2!2sBemina%2C%20Srinagar!5e0!3m2!1sen!2sin!4v1779961027950!5m2!1sen!2sin"
                width="100%"
                height="100%"
                frameBorder={0}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ filter: 'invert(90%) hue-rotate(180deg)', border: 0 }}
                aria-label="Map showing Cruxadventure office in Bemina, Srinagar"
              />
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={bottomInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-5"
          >
            <h2 className="font-display text-display-sm text-sand-100 mb-6">
              Frequently Asked
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactSection