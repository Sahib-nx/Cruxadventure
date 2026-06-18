import { Types } from 'mongoose'

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

export type AccommodationTier =
  | 'Hostel'
  | 'Hotel'
  | 'Resort'
  | 'Villa'
  | 'Luxury Camp'

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

export interface Destination {
  _id?: Types.ObjectId
  slug: string
  name: string
  region: Region
  categories: DestinationCategory[]
  shortDescription: string
  elevation?: number
  bestSeason: Season[]
  thumbnail: string
  heroImage: string
  gallery: string[]
  avgPackagePrice: number
  avgStayPrice: number
  avgTransportPrice: number
  avgActivityPrice: number
  popularActivities: string[]
  tags: string[]
  popularity: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

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
  checkInMonth: number | null
  checkOutMonth: number | null
  adults: number
  children: number
}

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

export interface UploadResponse {
  url: string
  publicId: string
  width: number
  height: number
}

export type DestinationFormData =
  Omit<Destination, '_id' | 'createdAt' | 'updatedAt'>