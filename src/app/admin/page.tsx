'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Stats {
  total:    number
  kashmir:  number
  nepal:    number
  featured: number
}

function StatCard({
  label,
  value,
  icon,
  delay = 0,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-sand-100/40 font-semibold mb-2">{label}</p>
          <p className="font-display text-3xl text-sand-100 tabular-nums">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 flex-shrink-0">
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [all, kashmir, nepal, featured] = await Promise.all([
          fetch('/api/admin/destinations?pageSize=1').then((r) => r.json()),
          fetch('/api/admin/destinations?region=Kashmir&pageSize=1').then((r) => r.json()),
          fetch('/api/admin/destinations?region=Nepal&pageSize=1').then((r) => r.json()),
          fetch('/api/admin/destinations?featured=true&pageSize=1').then((r) => r.json()),
        ])
        setStats({
          total:    all.total     ?? 0,
          kashmir:  kashmir.total ?? 0,
          nepal:    nepal.total   ?? 0,
          featured: featured.total ?? 0,
        })
      } catch {
        // fail silently — stats are non-critical
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-10">
      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs uppercase tracking-widest text-gold-500/70 font-semibold mb-1">Overview</p>
        <h1 className="font-display text-3xl text-sand-100">Dashboard</h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Destinations"
          value={loading ? '—' : (stats?.total ?? 0)}
          delay={0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
        />
        <StatCard
          label="Kashmir"
          value={loading ? '—' : (stats?.kashmir ?? 0)}
          delay={0.05}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          }
        />
        <StatCard
          label="Nepal"
          value={loading ? '—' : (stats?.nepal ?? 0)}
          delay={0.1}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          }
        />
        <StatCard
          label="Featured"
          value={loading ? '—' : (stats?.featured ?? 0)}
          delay={0.15}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-6"
      >
        <h2 className="font-display text-lg text-sand-100 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/destinations/new"
            className="flex items-center gap-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-400 shadow-gold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Destination
          </Link>
          <Link
            href="/admin/destinations"
            className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-sand-100/60 hover:text-sand-100 hover:border-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Manage Destinations
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium text-sand-100/60 hover:text-sand-100 hover:border-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </Link>
        </div>
      </motion.div>
    </div>
  )
}