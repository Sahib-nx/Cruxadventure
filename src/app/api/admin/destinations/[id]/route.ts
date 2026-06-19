import { NextRequest, NextResponse } from 'next/server'
import mongoose, { Types } from 'mongoose'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'

interface RouteContext {
  params: Promise<{ id: string }>
}

// ─── Shared validation helpers ────────────────────────────────────────────────
// Keep in sync with DestinationForm.tsx and /api/admin/destinations/route.ts

/**
 * Detects Google Drive / Google Photos "share" links and other URLs that
 * resolve to an HTML viewer page rather than raw image bytes. Mongoose's
 * schema validators don't know about this, so we check it explicitly here
 * (same logic used in the POST route) for any image field being updated.
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

/**
 * Validates only the fields present in a PATCH body (partial update —
 * unlike POST, missing fields here mean "unchanged", not "invalid").
 * Returns a list of human-readable errors (empty = valid).
 */
function validatePatchPayload(body: Record<string, unknown>): string[] {
  const errors: string[] = []

  const imageFields: [string, unknown][] = [
    ['thumbnail', body.thumbnail],
    ['heroImage', body.heroImage],
  ]
  for (const [field, value] of imageFields) {
    if (value === undefined) continue // not being updated
    if (!isValidUrl(value)) {
      errors.push(`${field} must be a valid URL`)
    } else if (isLikelyNonDirectGoogleUrl(value as string)) {
      errors.push(`${field} is a Google Drive/Photos share link, not a direct image URL — upload the file or use a direct image link instead`)
    }
  }

  if (body.gallery !== undefined) {
    if (!Array.isArray(body.gallery)) {
      errors.push('gallery must be an array')
    } else {
      body.gallery.forEach((url, i) => {
        if (!isValidUrl(url)) {
          errors.push(`gallery[${i}] must be a valid URL`)
        } else if (isLikelyNonDirectGoogleUrl(url)) {
          errors.push(`gallery[${i}] is a Google Drive/Photos share link, not a direct image URL`)
        }
      })
    }
  }

  return errors
}

function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id)
}

// GET /api/admin/destinations/[id]
export async function GET(
  _: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid destination id' }, { status: 400 })
  }

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

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid destination id' }, { status: 400 })
  }

  await connectToDatabase()

  const body = await req.json()

  // Catch obvious problems (image URLs) before hitting the DB — schema
  // validators (maxlength, gallery size, min price) still run via
  // runValidators below as the final source of truth.
  const validationErrors = validatePatchPayload(body)
  if (validationErrors.length) {
    return NextResponse.json(
      { error: validationErrors[0], errors: validationErrors },
      { status: 422 },
    )
  }

  // Prevent slug collision if slug is being changed
  if (typeof body.slug === 'string' && body.slug.trim() !== '') {
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

  try {
    const updated = await DestinationModel.findByIdAndUpdate(
      id,
      { $set: body },
      {
        new: true,
        runValidators: true,
        context: 'query', // ensures custom validators (e.g. gallery length) get correct `this` on partial updates
      }
    ).lean()

    if (!updated) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (err: unknown) {
    // Mongoose ValidationError (maxlength, min, enum, custom gallery validator, etc.)
    if (err instanceof mongoose.Error.ValidationError) {
      const firstMessage = Object.values(err.errors)[0]?.message ?? 'Validation failed'
      return NextResponse.json(
        { error: firstMessage, errors: Object.values(err.errors).map((e) => e.message) },
        { status: 422 },
      )
    }
    // Duplicate key (e.g. race condition on unique slug index)
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 })
    }
    console.error('PATCH /api/admin/destinations/[id] failed:', err)
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 })
  }
}

// DELETE /api/admin/destinations/[id]
export async function DELETE(
  _: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid destination id' }, { status: 400 })
  }

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