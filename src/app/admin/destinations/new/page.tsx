 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DestinationForm, type DestinationFormValues } from '@/components/admin/DestinationForm'

export default function NewDestinationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError,  setServerError]  = useState('')

  async function handleSubmit(values: DestinationFormValues) {
    setIsSubmitting(true)
    setServerError('')

    try {
      const res = await fetch('/api/admin/destinations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? 'Failed to create destination')
        return
      }

      router.push('/admin/destinations')
      router.refresh()
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-sand-100/30 mb-4">
          <Link href="/admin" className="hover:text-sand-100/60 transition-colors">Dashboard</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/admin/destinations" className="hover:text-sand-100/60 transition-colors">Destinations</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sand-100/50">New</span>
        </div>

        <p className="text-xs uppercase tracking-widest text-gold-500/70 font-semibold mb-1">Create</p>
        <h1 className="font-display text-3xl text-sand-100">Add Destination</h1>
        <p className="text-sand-100/40 text-sm mt-1">
          Fill in the details below. Images will be uploaded to Cloudinary automatically.
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-3xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-8 lg:p-10"
      >
        <DestinationForm
          onSubmit={handleSubmit}
          submitLabel="Create Destination"
          isSubmitting={isSubmitting}
          serverError={serverError}
        />
      </motion.div>
    </div>
  )
}