import { NextRequest, NextResponse } from 'next/server'
import mongoose, { Types } from 'mongoose'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/admin/destinations/[id]
export async function GET(
  _: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params

  await connectToDatabase()

  const doc = await DestinationModel.findById(id).lean()

  if (!doc) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(doc)
}

// PATCH /api/admin/destinations/[id]
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params

  await connectToDatabase()

  const body = await req.json()

  // Prevent slug collision if slug is being changed
  if (body.slug) {
    const conflict = await DestinationModel.findOne({
      slug: body.slug,
      _id: { $ne: new Types.ObjectId(id) },
    }).lean()

    if (conflict) {
      return NextResponse.json(
        { error: 'Slug already in use' },
        { status: 409 }
      )
    }
  }

  const updated = await DestinationModel.findByIdAndUpdate(
    id,
    { $set: body },
    {
      new: true,
      runValidators: true,
    }
  ).lean()

  if (!updated) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(updated)
}

// DELETE /api/admin/destinations/[id]
export async function DELETE(
  _: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params

  await connectToDatabase()

  const deleted = await DestinationModel.findByIdAndDelete(id).lean()

  if (!deleted) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    deleted: true,
    id,
  })
}