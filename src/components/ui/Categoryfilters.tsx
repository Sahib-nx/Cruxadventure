'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { DestinationCategory } from '@/types'

const CATEGORIES: { value: DestinationCategory; icon: string; label: string }[] = [
  { value: 'Luxury',    icon: '✦', label: 'Luxury Retreats'    },
  { value: 'Adventure', icon: '⛰', label: 'Adventures'         },
  { value: 'Trekking',  icon: '🥾', label: 'Trekking'          },
  { value: 'Nature',    icon: '🌿', label: 'Nature Journeys'   },
  { value: 'Camping',   icon: '⛺', label: 'Camping'            },

  { value: 'Snow',      icon: '❄', label: 'Snow Expeditions'  },
  { value: 'Family',    icon: '🏡', label: 'Family Journeys'   },
]
  // { value: 'Honeymoon', icon: '🌸', label: 'Honeymoon Escapes' },
interface CategoryFiltersProps {
  active: DestinationCategory[]
  onChange: (cats: DestinationCategory[]) => void
}

export function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
  function toggle(cat: DestinationCategory) {
    onChange(
      active.includes(cat)
        ? active.filter((c) => c !== cat)
        : [...active, cat],
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-navy-900/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-navy-900/60 to-transparent z-10 pointer-events-none" />

      <div
        className="flex items-center gap-2 overflow-x-auto scrollbar-none px-2 py-1"
        role="group"
        aria-label="Experience categories"
      >
        {/* All */}
        <button
          onClick={() => onChange([])}
          aria-pressed={active.length === 0}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
            active.length === 0
              ? 'bg-gold-500/20 border-gold-500/50 text-gold-400'
              : 'bg-white/5 border-white/10 text-sand-100/50 hover:text-sand-100/80 hover:border-white/20',
          )}
        >
          All
        </button>

        {CATEGORIES.map((cat, i) => {
          const isActive = active.includes(cat.value)
          return (
            <motion.button
              key={cat.value}
              onClick={() => toggle(cat.value)}
              aria-pressed={isActive}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                isActive
                  ? 'bg-gold-500/20 border-gold-500/50 text-gold-400 shadow-gold'
                  : 'bg-white/5 border-white/10 text-sand-100/50 hover:text-sand-100/80 hover:border-white/20',
              )}
            >
              <span aria-hidden="true" className="text-sm leading-none">{cat.icon}</span>
              {cat.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}