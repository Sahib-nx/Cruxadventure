import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'

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

  const required = [
    'slug', 'name', 'region', 'categories', 'shortDescription',
    'thumbnail', 'heroImage', 'avgPackagePrice', 'avgStayPrice',
    'avgTransportPrice', 'avgActivityPrice',
  ]
  const missing = required.filter((f) => !body[f] && body[f] !== 0)
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
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