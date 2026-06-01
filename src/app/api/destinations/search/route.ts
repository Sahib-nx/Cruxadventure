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

export async function GET(req: NextRequest) {
  await connectToDatabase()

  const q = req.nextUrl.searchParams.get('q') ?? ''
  const region = req.nextUrl.searchParams.get('region')

  const query: Record<string, unknown> = {}
  if (region) query.region = region

  const all = await DestinationModel.find(query).lean() as Destination[]

  if (!q || q.length < 2) {
    return NextResponse.json(all.slice(0, 20))
  }

  const fuse = new Fuse(all, FUSE_OPTIONS)
  const results = fuse.search(q).map((r) => r.item)

  return NextResponse.json(results.slice(0, 20))
}