'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DestinationForm, type DestinationFormValues } from '@/components/admin/DestinationForm'
import type { Destination } from '@/types'

export default function EditDestinationPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const id = params?.id

    const [destination, setDestination] = useState<Destination | null>(null)
    const [loadError, setLoadError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [serverError, setServerError] = useState('')

    // Fetch existing destination
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/admin/destinations/${id}`)
                if (!res.ok) throw new Error('Destination not found')
                const data = await res.json()
                setDestination(data)
            } catch {
                setLoadError('Could not load this destination. It may have been deleted.')
            }
        }
        if (id) load()
    }, [id])

    async function handleSubmit(values: DestinationFormValues) {
        setIsSubmitting(true)
        setServerError('')

        try {
            const res = await fetch(`/api/admin/destinations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })

            const data = await res.json()

            if (!res.ok) {
                setServerError(data.error ?? 'Failed to update destination')
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

    // ── Loading state ──────────────────────────────────────────────────────────
    if (!destination && !loadError) {
        return (
            <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto">
                <div className="rounded-3xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-10 space-y-6 animate-pulse">
                    <div className="h-6 w-48 bg-white/8 rounded" />
                    <div className="grid grid-cols-2 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-10 bg-white/5 rounded-xl" />
                        ))}
                    </div>
                    <div className="h-24 bg-white/5 rounded-xl" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-36 bg-white/5 rounded-xl" />
                        <div className="h-36 bg-white/5 rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    // ── Error state ────────────────────────────────────────────────────────────
    if (loadError) {
        return (
            <div className="px-6 lg:px-10 py-10 max-w-4xl mx-auto">
                <div className="rounded-3xl border border-red-500/20 bg-navy-900/60 backdrop-blur-xl p-10 text-center space-y-4">
                    <p className="text-red-400 text-sm">{loadError}</p>
                    <Link
                        href="/admin/destinations"
                        className="inline-flex items-center gap-2 text-sm text-sand-100/50 hover:text-sand-100 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to destinations
                    </Link>
                </div>
            </div>
        )
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
                    <span className="text-sand-100/50 truncate max-w-[120px]">{destination?.name}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-gold-500/70 font-semibold mb-1">Editing</p>
                        <h1 className="font-display text-3xl text-sand-100">{destination?.name}</h1>
                        <p className="text-sand-100/35 text-sm mt-1 font-mono">/destinations/{destination?.slug}</p>
                    </div>
                    <Link
                        href={`/destinations/${destination?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs text-sand-100/50 hover:text-sand-100 hover:border-white/30 transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Preview
                    </Link>
                </div>
            </motion.div>

            {/* Form card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-3xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-8 lg:p-10"
            >
                {destination && (
                    <DestinationForm
                        initialValues={destination}
                        onSubmit={handleSubmit}
                        submitLabel="Save Changes"
                        isSubmitting={isSubmitting}
                        serverError={serverError}
                    />
                )}
            </motion.div>
        </div>
    )
}