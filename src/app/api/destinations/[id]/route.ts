import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await connectToDatabase()
  const destination = await DestinationModel.findById(id).lean()

  if (!destination) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(destination)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get('x-admin-secret')

  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  await connectToDatabase()
  const body = await req.json()

  const destination = await DestinationModel.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true, runValidators: true }
  ).lean()

  if (!destination) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(destination)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = req.headers.get('x-admin-secret')

  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  await connectToDatabase()

  const result = await DestinationModel.findByIdAndDelete(id)

  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ deleted: true })
}