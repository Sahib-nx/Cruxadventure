import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — merge Tailwind classes safely.
 *
 * Combines clsx (conditional class logic) with tailwind-merge
 * (deduplicates conflicting Tailwind utilities).
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-gold-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}