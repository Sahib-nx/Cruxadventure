'use client'

import { useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { motion, AnimatePresence } from 'framer-motion'
import { DestinationCard } from './Destinationcard'
import type { Destination } from '@/types'

const CARD_HEIGHT = 300
const GAP = 12

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 aspect-[3/4] bg-navy-900/40 animate-pulse">
      <div className="w-full h-full bg-gradient-to-t from-navy-950/60 to-transparent" />
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <p className="text-sand-100/30 text-sm italic">No destinations match your filters</p>
    </motion.div>
  )
}

interface DestinationGridProps {
  destinations: Destination[]
  selectedId: string | null
  onSelect: (d: Destination) => void
  isLoading: boolean
}

export function DestinationGrid({
  destinations,
  selectedId,
  onSelect,
  isLoading,
}: DestinationGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const COLUMNS = 5

  const rows = useMemo(() => {
    const result: Destination[][] = []
    for (let i = 0; i < destinations.length; i += COLUMNS) {
      result.push(destinations.slice(i, i + COLUMNS))
    }
    return result
  }, [destinations])

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
    overscan: 2,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (destinations.length === 0) return <EmptyState />

  return (
    <div
      ref={parentRef}
      className="overflow-y-auto max-h-[680px] pr-1"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
      aria-label="Destinations"
    >
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        <AnimatePresence>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pb-3">
                  {row.map((dest, colIdx) => (
                    <motion.div
                     key={dest._id?.toString()}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: colIdx * 0.05, duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <DestinationCard
                        destination={dest}
                        isSelected={selectedId === dest._id?.toString()}
                        onSelect={onSelect}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}