'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Destination } from '@/types'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useDestinationSearch(region?: string) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Destination[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedQuery = useDebounce(query, 280)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setIsSearching(true)
    const params = new URLSearchParams({ q })
    if (region) params.set('region', region)
    const res = await fetch(`/api/destinations/search?${params.toString()}`)
    const data = await res.json()
    setResults(data)
    setIsSearching(false)
  }, [region])

  useEffect(() => {
    // Avoid setting React state synchronously in the effect body.
    // The setState calls happen inside the async function.
    let cancelled = false

    ;(async () => {
      if (cancelled) return
      await search(debouncedQuery)
    })()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, search])

  return { query, setQuery, results, isSearching }
}