import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'

// ─── Shared validation constants ──────────────────────────────────────────────
// Keep these in sync with the values used in DestinationForm.tsx
// (MAX_GALLERY_IMAGES, MAX_DESCRIPTION_LENGTH).
const MAX_GALLERY_IMAGES      = 6
const MAX_DESCRIPTION_LENGTH  = 280
const MIN_PRICE               = 0

const REQUIRED_FIELDS = [
  'slug', 'name', 'region', 'categories', 'shortDescription',
  'thumbnail', 'heroImage', 'avgPackagePrice', 'avgStayPrice',
  'avgTransportPrice', 'avgActivityPrice',
] as const

const PRICE_FIELDS = [
  'avgPackagePrice', 'avgStayPrice', 'avgTransportPrice', 'avgActivityPrice',
] as const

/**
 * Detects Google Drive / Google Photos "share" links and other URLs that
 * resolve to an HTML viewer page rather than raw image bytes. These pass a
 * naive isURL() check but break <Image> rendering on the frontend, so we
 * reject them at the API boundary too.
 */
function isLikelyNonDirectGoogleUrl(url: string): boolean {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'drive.google.com') return true
    if (host === 'photos.google.com' || host === 'photos.app.goo.gl') return true
    if (host === 'google.com' && (u.pathname === '/imgres' || u.pathname === '/url')) return true
    return false
  } catch {
    return false
  }
}

function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/** Validates a destination payload. Returns a list of human-readable errors (empty = valid). */
function validateDestinationPayload(body: Record<string, unknown>): string[] {
  const errors: string[] = []

  // Required fields — `!body[f] && body[f] !== 0` lets numeric 0 through but
  // catches '', null, undefined, false.
  const missing = REQUIRED_FIELDS.filter((f) => !body[f] && body[f] !== 0)
  if (missing.length) {
    errors.push(`Missing required fields: ${missing.join(', ')}`)
  }

  // Short description length
  if (typeof body.shortDescription === 'string' && body.shortDescription.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`shortDescription must be ${MAX_DESCRIPTION_LENGTH} characters or fewer (got ${body.shortDescription.length})`)
  }

  // Categories must be a non-empty array
  if (body.categories !== undefined && (!Array.isArray(body.categories) || body.categories.length === 0)) {
    errors.push('categories must be a non-empty array')
  }

  // Gallery size cap
  if (body.gallery !== undefined) {
    if (!Array.isArray(body.gallery)) {
      errors.push('gallery must be an array')
    } else if (body.gallery.length > MAX_GALLERY_IMAGES) {
      errors.push(`gallery can have at most ${MAX_GALLERY_IMAGES} images (got ${body.gallery.length})`)
    }
  }

  // Image URLs — thumbnail, heroImage, and each gallery entry
  const imageFields: [string, unknown][] = [
    ['thumbnail', body.thumbnail],
    ['heroImage', body.heroImage],
  ]
  for (const [field, value] of imageFields) {
    if (value === undefined || value === '') continue // required-check already covers missing
    if (!isValidUrl(value)) {
      errors.push(`${field} must be a valid URL`)
    } else if (isLikelyNonDirectGoogleUrl(value as string)) {
      errors.push(`${field} is a Google Drive/Photos share link, not a direct image URL — upload the file or use a direct image link instead`)
    }
  }
  if (Array.isArray(body.gallery)) {
    body.gallery.forEach((url, i) => {
      if (!isValidUrl(url)) {
        errors.push(`gallery[${i}] must be a valid URL`)
      } else if (isLikelyNonDirectGoogleUrl(url)) {
        errors.push(`gallery[${i}] is a Google Drive/Photos share link, not a direct image URL`)
      }
    })
  }

  // Prices — must be non-negative numbers
  for (const field of PRICE_FIELDS) {
    const value = body[field]
    if (value === undefined) continue // required-check already covers missing
    if (typeof value !== 'number' || Number.isNaN(value) || value < MIN_PRICE) {
      errors.push(`${field} must be a number >= ${MIN_PRICE}`)
    }
  }

  return errors
}

// GET /api/admin/destinations — full list with pagination + search
export async function GET(req: NextRequest) {
  await connectToDatabase()

  const sp       = req.nextUrl.searchParams
  const page     = Math.max(1, Number(sp.get('page') ?? 1))
  const pageSize = Math.min(50, Math.max(1, Number(sp.get('pageSize') ?? 20)))
  const search   = sp.get('search') ?? ''
  const region   = sp.get('region') ?? ''
  const featured = sp.get('featured') ?? ''

  const query: Record<string, unknown> = {}
  if (region)   query.region   = region
  if (featured === 'true')  query.featured = true
  if (featured === 'false') query.featured = false
  if (search) {
    query.$or = [
      { name:             { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { tags:             { $regex: search, $options: 'i' } },
    ]
  }

  const [destinations, total] = await Promise.all([
    DestinationModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    DestinationModel.countDocuments(query),
  ])

  return NextResponse.json({
    destinations,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  })
}

// POST /api/admin/destinations — create new destination
export async function POST(req: NextRequest) {
  await connectToDatabase()

  const body = await req.json()

  const validationErrors = validateDestinationPayload(body)
  if (validationErrors.length) {
    return NextResponse.json(
      { error: validationErrors[0], errors: validationErrors },
      { status: 422 },
    )
  }

  // Enforce slug uniqueness
  const exists = await DestinationModel.findOne({ slug: body.slug }).lean()
  if (exists) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const destination = await DestinationModel.create(body)
  return NextResponse.json(destination, { status: 201 })
}