/**
 * destinations.ts  —  Centralized destination data
 *
 * All sections pull from this single source of truth.
 * Update images, names, and details here once — reflects everywhere.
 */

export interface Destination {
  id:          string
  name:        string
  country:     string
  continent:   'Asia' | 'Europe' | 'Americas' | 'Africa' | 'Oceania'
  tagline:     string
  description: string
  image:       string          // Unsplash URL
  heroImage:   string          // Higher-res / portrait crop for hero
  coordinates: [number, number] // [lat, lng] for map
  bestSeason:  string
  duration:    string          // e.g. "7–14 days"
  priceFrom:   number          // USD
  rating:      number          // 4.0–5.0
  reviewCount: number
  tags:        string[]
  highlights:  string[]
  featured:    boolean
}

export const destinations: Destination[] = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    tagline: 'Island of the Gods',
    description:
      'Emerald rice terraces, ancient temples, and surf-kissed shores. Bali is spiritual, sensual, and endlessly photogenic.',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85',
    coordinates: [-8.3405, 115.0920],
    bestSeason: 'May – September',
    duration: '7–14 days',
    priceFrom: 1299,
    rating: 4.9,
    reviewCount: 2847,
    tags: ['Beach', 'Culture', 'Spiritual', 'Adventure'],
    highlights: ['Tanah Lot Temple', 'Ubud Rice Terraces', 'Mount Batur Sunrise'],
    featured: true,
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    tagline: 'Caldera Dreams',
    description:
      'Whitewashed cliffs cascading into the Aegean. Sunsets in Oia that stop time. Wine from volcanic soil that tastes like the sea.',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=85',
    coordinates: [36.3932, 25.4615],
    bestSeason: 'April – October',
    duration: '5–10 days',
    priceFrom: 1899,
    rating: 4.8,
    reviewCount: 1923,
    tags: ['Luxury', 'Romance', 'Culture', 'Beach'],
    highlights: ['Oia Sunset', 'Caldera Cruise', 'Akrotiri Archaeological Site'],
    featured: true,
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    continent: 'Asia',
    tagline: 'Above & Below the Blue',
    description:
      'Overwater bungalows floating above crystal lagoons. Coral reefs alive with colour. The world stripped down to sky, sea, and silence.',
    image:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920&q=85',
    coordinates: [3.2028, 73.2207],
    bestSeason: 'November – April',
    duration: '5–14 days',
    priceFrom: 2499,
    rating: 4.9,
    reviewCount: 1456,
    tags: ['Luxury', 'Beach', 'Diving', 'Romance'],
    highlights: ['Overwater Villa', 'Reef Snorkeling', 'Dolphin Cruise'],
    featured: true,
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    tagline: 'Ancient Japan, Alive',
    description:
      'A thousand torii gates, moss-carpeted gardens, and geisha districts frozen in time. Japan\'s cultural heart beats quietly here.',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=85',
    coordinates: [35.0116, 135.7681],
    bestSeason: 'March – May, Oct – Nov',
    duration: '5–10 days',
    priceFrom: 1699,
    rating: 4.9,
    reviewCount: 3102,
    tags: ['Culture', 'History', 'Food', 'Nature'],
    highlights: ['Fushimi Inari', 'Arashiyama Bamboo', 'Gion District'],
    featured: true,
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    country: 'Argentina / Chile',
    continent: 'Americas',
    tagline: 'Edge of the Earth',
    description:
      'Granite spires punching the sky, glaciers groaning into fjords, condors riding the wind. The last wild place.',
    image:
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1920&q=85',
    coordinates: [-51.6230, -69.2168],
    bestSeason: 'November – March',
    duration: '10–21 days',
    priceFrom: 2199,
    rating: 4.8,
    reviewCount: 892,
    tags: ['Adventure', 'Nature', 'Trekking', 'Wildlife'],
    highlights: ['Torres del Paine', 'Perito Moreno Glacier', 'Tierra del Fuego'],
    featured: false,
  },
]

/** Hero slideshow destinations (featured ones in display order) */
export const heroDestinations = destinations.filter(d => d.featured)

/** Get a destination by ID */
export function getDestination(id: string): Destination | undefined {
  return destinations.find(d => d.id === id)
}