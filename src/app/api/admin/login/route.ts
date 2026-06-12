import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    // ── Validate env vars are set ────────────────────────────────────────────
    if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_TOKEN) {
      console.error('[admin/login] ADMIN_PASSWORD or ADMIN_SESSION_TOKEN is not set in .env.local')
      return NextResponse.json(
        { error: 'Server misconfiguration. Check environment variables.' },
        { status: 500 },
      )
    }

    // ── Constant-time delay to slow brute force ──────────────────────────────
    await new Promise((r) => setTimeout(r, 500))

    // ── Check password ───────────────────────────────────────────────────────
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Incorrect password.' },
        { status: 401 },
      )
    }

    // ── Build response and set HttpOnly cookie ───────────────────────────────
    const response = NextResponse.json({ ok: true })

    response.cookies.set({
      name:     'admin_session',
      value:    process.env.ADMIN_SESSION_TOKEN,
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 8,   // 8 hours
      path:     '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    )
  }
}