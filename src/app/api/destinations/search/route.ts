import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'
import Fuse, { type IFuseOptions } from 'fuse.js'

import type { Destination } from '@/types'

const FUSE_OPTIONS: IFuseOptions<Destination> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'tags', weight: 0.25 },
    { name: 'popularActivities', weight: 0.2 },
    { name: 'shortDescription', weight: 0.1 },
    { name: 'categories', weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
}

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50

export async function GET(req: NextRequest) {
  await connectToDatabase()

  const q = req.nextUrl.searchParams.get('q') ?? ''
  const region = req.nextUrl.searchParams.get('region')

  const page = Math.max(
    1,
    parseInt(req.nextUrl.searchParams.get('page') ?? '1', 10) || 1,
  )
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(req.nextUrl.searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE),
  )

  const query: Record<string, unknown> = {}
  if (region) query.region = region

  const all = (await DestinationModel.find(query).lean()) as Destination[]

  // No query (or too short) → just region-filtered list, newest/whatever default order
  const matched = !q || q.length < 2
    ? all
    : new Fuse(all, FUSE_OPTIONS).search(q).map((r) => r.item)

  const total = matched.length
  const start = (page - 1) * pageSize
  const results = matched.slice(start, start + pageSize)
  const hasMore = start + pageSize < total

  return NextResponse.json({
    results,
    page,
    pageSize,
    total,
    hasMore,
  })
}