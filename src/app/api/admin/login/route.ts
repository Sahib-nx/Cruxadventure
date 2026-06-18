import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { secret } = body

    const envSecret = process.env.ADMIN_SECRET

    if (!envSecret) {
      console.error('[admin/login] ADMIN_SECRET is not set')
      return NextResponse.json(
        { error: 'Server misconfiguration. ADMIN_SECRET is required.' },
        { status: 500 },
      )
    }

    // Slight delay to mitigate brute force attempts
    await new Promise((r) => setTimeout(r, 500))

    if (!secret || secret !== envSecret) {
      return NextResponse.json({ error: 'Incorrect secret.' }, { status: 401 })
    }

    // Return success; client will store the secret in sessionStorage
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
}