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
    "id": "gulmarg",
    "name": "Gulmarg",
    "country": "India",
    "continent": "Asia",
    "tagline": "The Meadow of Flowers",
    "description": "A premier ski destination and family getaway, Gulmarg offers breathtaking cable car rides over snow-capped peaks and endless alpine meadows.",
    "image": "https://www.bikatadventures.com/images/BlogspotContents/BlogspotImageUrl79696.png",
    "heroImage": "https://www.bikatadventures.com/images/BlogspotContents/BlogspotImageUrl79696.png",
    "coordinates": [34.0484, 74.3805],
    "bestSeason": "December – March (Snow) / May – June (Nature)",
    "duration": "3–5 days",
    "priceFrom": 450,
    "rating": 4.8,
    "reviewCount": 3120,
    "tags": ["Snow", "Adventure", "Family", "Nature"],
    "highlights": ["Gulmarg Gondola", "Apharwat Peak Skiing", "Alpather Lake Trek"],
    "featured": true
  },
  {
    "id": "pahalgam",
    "name": "Pahalgam",
    "country": "India",
    "continent": "Asia",
    "tagline": "Valley of Shepherds",
    "description": "Pahalgam is a picturesque paradise where the Lidder River flows through lush valleys, perfect for family picnics, camping, and gentle nature walks.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Aruvillage.jpg",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Aruvillage.jpg",
    "coordinates": [34.0145, 75.3268],
    "bestSeason": "April – October",
    "duration": "4–6 days",
    "priceFrom": 380,
    "rating": 4.7,
    "reviewCount": 2450,
    "tags": ["Nature", "Family", "Camping"],
    "highlights": ["Betaab Valley", "Aru Valley Camping", "Lidder River Rafting"],
    "featured": false
  },
  {
    "id": "sonamarg",
    "name": "Sonamarg",
    "country": "India",
    "continent": "Asia",
    "tagline": "The Meadow of Gold",
    "description": "Surrounded by imposing Himalayan glaciers, Sonamarg is the starting point for intense treks and offers spectacular snow views and riverside camping.",
    "image": "https://www.historywithtravel.com/images/sonmarg/photography-in-sonmarg.jpg",
    "heroImage": "https://www.historywithtravel.com/images/sonmarg/photography-in-sonmarg.jpg",
    "coordinates": [34.3033, 75.2951],
    "bestSeason": "May – September",
    "duration": "3–4 days",
    "priceFrom": 410,
    "rating": 4.6,
    "reviewCount": 1890,
    "tags": ["Snow", "Nature", "Trekking"],
    "highlights": ["Thajiwas Glacier", "Vishansar Lake Trek", "Sindh River"],
    "featured": false
  },
  {
    "id": "kashmir-great-lakes",
    "name": "Kashmir Great Lakes",
    "country": "India",
    "continent": "Asia",
    "tagline": "The Ultimate Alpine Trek",
    "description": "A rugged adventure through high-altitude passes, revealing six stunning alpine lakes. It is the pinnacle of trekking and wild camping in Kashmir.",
    "image": "https://himalayandaredevils.com/storage/uploads/6981c1f264baf.jpg",
    "heroImage": "https://himalayandaredevils.com/storage/uploads/6981c1f264baf.jpg",
    "coordinates": [34.3312, 75.0234],
    "bestSeason": "July – August",
    "duration": "7–9 days",
    "priceFrom": 650,
    "rating": 4.9,
    "reviewCount": 1120,
    "tags": ["Trekking", "Adventure", "Camping", "Nature"],
    "highlights": ["Gangabal Lake", "Gadsar Pass", "Satsar Lakes"],
    "featured": true
  },
  {
    "id": "gurez-valley",
    "name": "Gurez Valley",
    "country": "India",
    "continent": "Asia",
    "tagline": "The Hidden Crown of Kashmir",
    "description": "An offbeat gem nestled along the ancient Silk Route. Gurez offers pristine nature, peaceful camping spots, and dramatic views of the Habba Khatoon peak.",
    "image": "https://kashmirmountains.com/wp-content/uploads/Habba-Khatoon-peak-01.jpg",
    "heroImage": "https://kashmirmountains.com/wp-content/uploads/Habba-Khatoon-peak-01.jpg",
    "coordinates": [34.6366, 74.8398],
    "bestSeason": "June – September",
    "duration": "4–5 days",
    "priceFrom": 390,
    "rating": 4.8,
    "reviewCount": 540,
    "tags": ["Nature", "Camping", "Adventure"],
    "highlights": ["Habba Khatoon Peak", "Kishanganga River", "Dawar Village"],
    "featured": false
  },
  {
    "id": "pokhara",
    "name": "Pokhara",
    "country": "Nepal",
    "continent": "Asia",
    "tagline": "The City of Lakes",
    "description": "A tranquil lakeside city flanked by the Annapurna range. Perfect for family boating, paragliding adventures, and starting major Himalayan treks.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Phewa_lake%2C_Pokhara.jpg",
    "heroImage": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Phewa_lake%2C_Pokhara.jpg",
    "coordinates": [28.2096, 83.9856],
    "bestSeason": "September – November / March – May",
    "duration": "4–7 days",
    "priceFrom": 250,
    "rating": 4.8,
    "reviewCount": 4210,
    "tags": ["Adventure", "Family", "Nature"],
    "highlights": ["Phewa Lake Boating", "Sarangkot Paragliding", "World Peace Pagoda"],
    "featured": true
  },
  {
    "id": "annapurna-base-camp",
    "name": "Annapurna Base Camp",
    "country": "Nepal",
    "continent": "Asia",
    "tagline": "The Sanctuary of Peaks",
    "description": "Trek through varied ecosystems from terraced farms to glacial moraines, ending in an awe-inspiring amphitheater of snow-capped giant peaks.",
    "image": "https://cdn.kimkim.com/files/a/content_articles/featured_photos/b2fad5b6b2052164dd9da75efacb304d4f211fa5/big-d5d878b029bbeaedaab673aee4a4ec04.jpg",
    "heroImage": "https://cdn.kimkim.com/files/a/content_articles/featured_photos/b2fad5b6b2052164dd9da75efacb304d4f211fa5/big-d5d878b029bbeaedaab673aee4a4ec04.jpg",
    "coordinates": [28.5300, 83.8780],
    "bestSeason": "October – November / April – May",
    "duration": "10–14 days",
    "priceFrom": 750,
    "rating": 4.9,
    "reviewCount": 2840,
    "tags": ["Trekking", "Snow", "Adventure"],
    "highlights": ["Machapuchare Base Camp", "Poon Hill Sunrise", "Jhinu Danda Hot Springs"],
    "featured": true
  },
  {
    "id": "everest-base-camp",
    "name": "Everest Base Camp",
    "country": "Nepal",
    "continent": "Asia",
    "tagline": "Steps to the Top of the World",
    "description": "The holy grail for trekkers and adventurers. A strenuous journey through Sherpa villages, high-altitude deserts, and vast snowy glaciers.",
    "image": "https://himalayanhikers.in/root-admin-laravel-panel/uploads/trek_images/6965ee15adfb2.jpeg",
    "heroImage": "https://himalayanhikers.in/root-admin-laravel-panel/uploads/trek_images/6965ee15adfb2.jpeg",
    "coordinates": [28.0045, 86.8526],
    "bestSeason": "March – May / Late September – November",
    "duration": "14–16 days",
    "priceFrom": 1200,
    "rating": 4.9,
    "reviewCount": 5130,
    "tags": ["Trekking", "Adventure", "Snow", "Camping"],
    "highlights": ["Namche Bazaar", "Kala Patthar Views", "Khumbu Glacier"],
    "featured": true
  },
  {
    "id": "langtang-valley",
    "name": "Langtang Valley",
    "country": "Nepal",
    "continent": "Asia",
    "tagline": "The Valley of Glaciers",
    "description": "A stunning, accessible trek relatively close to Kathmandu, offering incredible nature, snow-dusted peaks, and an intimate look at local Tamang culture.",
    "image": "https://gstreksnepal.com/wp-content/uploads/2024/12/Langtang-Valley-Trek-1.webp",
    "heroImage": "https://gstreksnepal.com/wp-content/uploads/2024/12/Langtang-Valley-Trek-1.webp",
    "coordinates": [28.2140, 85.5539],
    "bestSeason": "October – November / March – May",
    "duration": "7–10 days",
    "priceFrom": 550,
    "rating": 4.7,
    "reviewCount": 1620,
    "tags": ["Nature", "Trekking", "Family"],
    "highlights": ["Kyanjin Gompa", "Langtang Lirung Views", "Tamang Heritage"],
    "featured": false
  },
]

/** Hero slideshow destinations (featured ones in display order) */
export const heroDestinations = destinations.filter(d => d.featured)

/** Get a destination by ID */
export function getDestination(id: string): Destination | undefined {
  return destinations.find(d => d.id === id)
}