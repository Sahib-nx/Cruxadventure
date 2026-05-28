/**
 * types/index.ts — shared TypeScript types
 *
 * Import from '@/types' in any component.
 */

export type { Destination } from '@/data/destination'
export { SectionWrapper } from '@/components/ui/SectionWrapper'
export { SectionHeading } from '@/components/ui/Sectionheading'
export { ExperienceShowcase } from '@/components/sections/ExperienceShowcase'
export { TripPlanner } from '@/components/sections/TripPlanner'
export { Testimonials } from '@/components/sections/Testimonials'
export { StatsSection } from '@/components/sections/StatsSection'
export { ContactSection } from "@/components/sections/Contact"
export { Newsletter } from '@/components/sections/Newsletter'
export { Footer } from '@/components/layout/Footer'




export interface NavLink {
  label: string
  href:  string
}

export interface Testimonial {
  id:          string
  name:        string
  hometown:    string
  countryFlag: string
  avatar:      string
  quote:       string
  rating:      number
  destination: string
}

export interface TripPlannerState {
  destination:      string | null
  checkIn:          Date   | null
  checkOut:         Date   | null
  adults:           number
  children:         number
  accommodationType: 'hotel' | 'resort' | 'villa' | 'hostel' | null
}