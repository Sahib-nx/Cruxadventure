import { Types } from 'mongoose'

export type { destinations } from '@/data/destination'
export { SectionWrapper } from '@/components/ui/SectionWrapper'
export { SectionHeading } from '@/components/ui/Sectionheading'
export { ExperienceShowcase } from '@/pages/ExperienceShowcase'
export { Testimonials } from '@/pages/Testimonials'
export { StatsSection } from '@/pages/StatsSection'
export { DestinationMap } from "@/pages/DestinationMap"
export { ContactSection } from "@/pages/Contact"
export { Newsletter } from '@/pages/Newsletter'
export { Footer } from '@/components/layout/Footer'




export interface NavLink {
  label: string
  href: string
}

export interface Testimonial {
  id: string
  name: string
  hometown: string
  countryFlag: string
  avatar: string
  quote: string
  rating: number
  destination: string
}

export interface TripPlannerState {
  destination: string | null
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  children: number
  accommodationType: 'hotel' | 'resort' | 'villa' | 'hostel' | null
}

// ─── Region & Category Enums ─────────────────────────────────────────────────

export type Region = 'Kashmir' | 'Nepal'

export type DestinationCategory =
  | 'Luxury'
  | 'Adventure'
  | 'Trekking'
  | 'Nature'
  | 'Camping'
  | 'Honeymoon'
  | 'Snow'
  | 'Family'

export type PackageType =
  | 'Luxury Retreat'
  | 'Adventure Trek'
  | 'Romantic Escape'
  | 'Family Journey'
  | 'Snow Expedition'
  | 'Nature Explorer'

export type AccommodationTier = 'Hostel' | 'Hotel' | 'Resort' | 'Villa' | 'Luxury Camp'

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

// ─── Core Destination Type ────────────────────────────────────────────────────

export interface Destination {
    _id?: Types.ObjectId;
  slug: string
  name: string
  region: Region
  categories: DestinationCategory[]
  shortDescription: string
  elevation?: number
  bestSeason: Season[]
  thumbnail: string          // Cloudinary URL
  heroImage: string          // Cloudinary URL
  gallery: string[]          // Cloudinary URLs
  avgPackagePrice: number
  avgStayPrice: number
  avgTransportPrice: number
  avgActivityPrice: number
  popularActivities: string[]
  tags: string[]
  popularity: number         // 0–100
  featured: boolean
  createdAt: string
  updatedAt: string
}

// ─── Package Estimation ───────────────────────────────────────────────────────

export interface PackageEstimate {
  stay: number
  transport: number
  guidedActivities: number
  seasonalAdjustment: number
  total: number
  perPerson: number
  nights: number
  currency: 'USD'
}

export interface EstimateInput {
  destination: Destination | null
  packageType: PackageType
  accommodationTier: AccommodationTier
  checkInMonth: number | null   // 0–11
  checkOutMonth: number | null  // 0–11
  adults: number
  children: number
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface PaginatedDestinations {
  destinations: Destination[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DestinationFilters {
  region?: Region
  categories?: DestinationCategory[]
  packageType?: PackageType
  season?: Season
  featured?: boolean
  page?: number
  pageSize?: number
  sortBy?: 'popularity' | 'price_asc' | 'price_desc' | 'name'
}

// ─── Admin / Upload ───────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string
  publicId: string
  width: number
  height: number
}

export type DestinationFormData = Omit<Destination, '_id' | 'createdAt' | 'updatedAt'>
// export interface DestinationFormData extends Omit<Destination, '_id' | 'createdAt' | 'updatedAt'> { }