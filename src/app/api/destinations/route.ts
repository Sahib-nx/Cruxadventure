import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'
import type { DestinationFilters } from '@/types'

// GET /api/destinations — paginated, filtered list
export async function GET(req: NextRequest) {
  await connectToDatabase()

  const sp = req.nextUrl.searchParams
  const region = sp.get('region')
  const categories = sp.getAll('categories')
  const featured = sp.get('featured')
  const season = sp.get('season')
  const page = Math.max(1, Number(sp.get('page') ?? 1))
  const pageSize = Math.min(50, Math.max(1, Number(sp.get('pageSize') ?? 20)))
  const sortBy = sp.get('sortBy') ?? 'popularity'

  const query: Record<string, unknown> = {}
  if (region) query.region = region
  if (categories.length) query.categories = { $in: categories }
  if (featured === 'true') query.featured = true
  if (season) query.bestSeason = season

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    popularity: { popularity: -1 },
    price_asc: { avgPackagePrice: 1 },
    price_desc: { avgPackagePrice: -1 },
    name: { name: 1 },
  }
  const sort = sortMap[sortBy] ?? sortMap.popularity

  const [destinations, total] = await Promise.all([
    DestinationModel.find(query)
      .sort(sort as Record<string, 1 | -1>)
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

// POST /api/destinations — create new destination (admin only)
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-secret')
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectToDatabase()

  const body = await req.json()

  // Validate required fields
  const required = ['slug', 'name', 'region', 'categories', 'shortDescription',
    'thumbnail', 'heroImage', 'avgPackagePrice', 'avgStayPrice',
    'avgTransportPrice', 'avgActivityPrice']

  const missing = required.filter((f) => !body[f])
  if (missing.length) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 422 })
  }

  // Slug uniqueness check
  const existing = await DestinationModel.findOne({ slug: body.slug })
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }

  const destination = await DestinationModel.create(body)
  return NextResponse.json(destination, { status: 201 })
}