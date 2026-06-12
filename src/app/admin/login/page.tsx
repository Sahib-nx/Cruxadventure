'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function AdminLoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const from = searchParams?.get('from') ?? '/admin'

    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error ?? 'Incorrect password.')
                setLoading(false)
                return
            }

            // Hard navigate so the middleware re-evaluates with the new cookie
            window.location.href = from
        } catch {
            setError('Network error. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
            {/* Noise texture */}
            <div
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                }}
                aria-hidden="true"
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="relative w-full max-w-sm"
            >
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/30 mb-4">
                        <span className="text-gold-400 text-xl" aria-hidden="true">✦</span>
                    </div>
                    <h1 className="font-display text-2xl text-sand-100">Admin Panel</h1>
                    <p className="text-sand-100/40 text-sm mt-1">Himalayan Journey Platform</p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="text-xs uppercase tracking-widest text-sand-100/50 font-semibold"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                                autoFocus
                                autoComplete="current-password"
                                className={cn(
                                    'w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 transition-all duration-200 focus:outline-none focus:ring-2',
                                    error
                                        ? 'border-red-500/50 focus:ring-red-500/30'
                                        : 'border-white/10 hover:border-white/20 focus:border-gold-500/40 focus:ring-gold-500/20',
                                )}
                            />
                        </div>

                        {/* Error message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-xs text-red-400 bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2"
                            >
                                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password.trim()}
                            className={cn(
                                'w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                                loading || !password.trim()
                                    ? 'bg-white/8 text-sand-100/25 cursor-not-allowed'
                                    : 'bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-gold',
                            )}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-sand-100/20 mt-6">
                    Session expires after 8 hours
                </p>
            </motion.div>
        </div>
    )
}