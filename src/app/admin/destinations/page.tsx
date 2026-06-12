'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Destination } from '@/types'

interface PaginatedResponse {
  destinations: Destination[]
  total:        number
  totalPages:   number
  page:         number
}

const REGIONS   = ['All', 'Kashmir', 'Nepal'] as const
const FEATURED  = ['All', 'Featured', 'Not Featured'] as const

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({
  dest,
  onConfirm,
  onCancel,
  loading,
}: {
  dest: Destination
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-navy-900/90 backdrop-blur-xl p-8 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-sand-100 text-lg">Delete Destination</h3>
            <p className="text-sand-100/40 text-xs mt-0.5">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sand-100/60 text-sm">
          Are you sure you want to delete{' '}
          <span className="text-sand-100 font-semibold">{dest.name}</span>?
          All data for this destination will be permanently removed.
        </p>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-full border border-white/15 py-2.5 text-sm font-medium text-sand-100/60 hover:text-sand-100 hover:border-white/30 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-400 transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, x: '-50%' }}
      animate={{ opacity: 1, y: 0,  x: '-50%' }}
      exit={{  opacity: 0, y: 24,   x: '-50%' }}
      className={cn(
        'fixed bottom-6 left-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium shadow-lg border backdrop-blur-xl',
        type === 'success'
          ? 'bg-navy-900/90 border-gold-500/30 text-gold-400'
          : 'bg-navy-900/90 border-red-500/30 text-red-400',
      )}
    >
      {type === 'success' ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DestinationsListPage() {
  const [data,         setData]         = useState<PaginatedResponse | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [region,       setRegion]       = useState<typeof REGIONS[number]>('All')
  const [featuredFilter, setFeaturedFilter] = useState<typeof FEATURED[number]>('All')
  const [page,         setPage]         = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null)
  const [deleting,     setDeleting]     = useState(false)
  const [toast,        setToast]        = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const fetchDestinations = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '15' })
    if (search)  params.set('search',   search)
    if (region !== 'All') params.set('region', region)
    if (featuredFilter === 'Featured')     params.set('featured', 'true')
    if (featuredFilter === 'Not Featured') params.set('featured', 'false')

    try {
      const res  = await fetch(`/api/admin/destinations?${params}`)
      const json = await res.json()
      setData(json)
    } catch {
      showToast('Failed to load destinations', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, search, region, featuredFilter, showToast])

  // Debounce search
  useEffect(() => {
    setPage(1)
  }, [search, region, featuredFilter])

  useEffect(() => {
    const timer = setTimeout(fetchDestinations, search ? 350 : 0)
    return () => clearTimeout(timer)
  }, [fetchDestinations, search])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/destinations/${deleteTarget._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      showToast(`"${deleteTarget.name}" deleted`, 'success')
      setDeleteTarget(null)
      fetchDestinations()
    } catch {
      showToast('Failed to delete destination', 'error')
    } finally {
      setDeleting(false)
    }
  }

  async function toggleFeatured(dest: Destination) {
    try {
      const res = await fetch(`/api/admin/destinations/${dest._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ featured: !dest.featured }),
      })
      if (!res.ok) throw new Error()
      showToast(
        `"${dest.name}" ${!dest.featured ? 'marked as featured' : 'removed from featured'}`,
        'success',
      )
      fetchDestinations()
    } catch {
      showToast('Failed to update destination', 'error')
    }
  }

  return (
    <>
      <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-500/70 font-semibold mb-1">Manage</p>
            <h1 className="font-display text-3xl text-sand-100">Destinations</h1>
          </div>
          <Link
            href="/admin/destinations/new"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 hover:bg-gold-400 shadow-gold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Destination
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-4 flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
            <svg className="w-4 h-4 text-sand-100/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search destinations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-sand-100 placeholder:text-sand-100/25 focus:outline-none"
            />
          </div>

          {/* Region filter */}
          <div className="flex gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => { setRegion(r); setPage(1) }}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                  region === r
                    ? 'bg-gold-500/15 border-gold-500/35 text-gold-400'
                    : 'bg-white/5 border-white/10 text-sand-100/50 hover:text-sand-100/80 hover:border-white/20',
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Featured filter */}
          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value as typeof FEATURED[number]); setPage(1) }}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-sand-100/60 focus:outline-none focus:border-gold-500/40 focus:ring-2 focus:ring-gold-500/20 transition-all cursor-pointer"
          >
            {FEATURED.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl overflow-hidden"
        >
          {/* Table head */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/8 text-[10px] uppercase tracking-widest text-sand-100/30 font-semibold">
            <span>Destination</span>
            <span>Region</span>
            <span>Package from</span>
            <span>Featured</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="space-y-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-white/5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/8" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 bg-white/8 rounded" />
                      <div className="h-2.5 w-16 bg-white/5 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-16 bg-white/8 rounded self-center" />
                  <div className="h-3 w-20 bg-white/8 rounded self-center" />
                  <div className="h-3 w-12 bg-white/8 rounded self-center" />
                  <div className="h-3 w-16 bg-white/8 rounded self-center" />
                </div>
              ))}
            </div>
          ) : data?.destinations.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sand-100/30 text-sm">No destinations found</p>
              <Link
                href="/admin/destinations/new"
                className="mt-4 inline-flex items-center gap-1.5 text-gold-500 hover:text-gold-400 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add your first destination
              </Link>
            </div>
          ) : (
            <div>
              <AnimatePresence>
                {data?.destinations.map((dest, i) => (
                  <motion.div
                    key={dest._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group"
                  >
                    {/* Name + thumbnail */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-navy-950/60">
                        <Image
                          src={dest.thumbnail}
                          alt={dest.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sand-100 text-sm font-medium truncate">{dest.name}</p>
                        <p className="text-sand-100/35 text-xs truncate">{dest.slug}</p>
                      </div>
                    </div>

                    {/* Region */}
                    <span className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full border w-fit',
                      dest.region === 'Kashmir'
                        ? 'bg-gold-500/10 border-gold-500/25 text-gold-400'
                        : 'bg-sky-500/10 border-sky-500/25 text-sky-400',
                    )}>
                      {dest.region}
                    </span>

                    {/* Price */}
                    <span className="text-sand-100/60 text-sm tabular-nums">
                      ${dest.avgPackagePrice.toLocaleString()}
                    </span>

                    {/* Featured toggle */}
                    <button
                      onClick={() => toggleFeatured(dest)}
                      aria-label={dest.featured ? 'Remove from featured' : 'Mark as featured'}
                      className={cn(
                        'w-8 h-4 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 flex-shrink-0',
                        dest.featured ? 'bg-gold-500' : 'bg-white/15',
                      )}
                    >
                      <div className={cn(
                        'w-3 h-3 rounded-full bg-white shadow transition-transform duration-300 mx-0.5',
                        dest.featured ? 'translate-x-4' : 'translate-x-0',
                      )} />
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/destinations/${dest._id}/edit`}
                        className="p-2 rounded-xl text-sand-100/40 hover:text-gold-400 hover:bg-gold-500/8 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                        aria-label={`Edit ${dest.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(dest)}
                        className="p-2 rounded-xl text-sand-100/40 hover:text-red-400 hover:bg-red-500/8 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                        aria-label={`Delete ${dest.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
              <p className="text-xs text-sand-100/30">
                Showing {((page - 1) * 15) + 1}–{Math.min(page * 15, data.total)} of {data.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-white/10 text-sand-100/40 hover:text-sand-100 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-xs text-sand-100/40 tabular-nums px-2">
                  {page} / {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="p-2 rounded-xl border border-white/10 text-sand-100/40 hover:text-sand-100 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            dest={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </>
  )
}