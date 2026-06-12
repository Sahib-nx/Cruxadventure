import { NextRequest, NextResponse } from 'next/server'

// ─── Public paths that never require auth ────────────────────────────────────
const PUBLIC_PATHS = ['/admin/login']
const PUBLIC_API   = ['/api/admin/login']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Only run on /admin/* and /api/admin/* ──────────────────────────────────
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi  = pathname.startsWith('/api/admin')

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next()
  }

  // ── Always allow public paths ──────────────────────────────────────────────
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }
  if (PUBLIC_API.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // ── Read the session cookie ────────────────────────────────────────────────
  const sessionCookie = req.cookies.get('admin_session')
  const sessionValue  = sessionCookie?.value ?? ''
  const expectedToken = process.env.ADMIN_SESSION_TOKEN ?? ''

  // ── Guard: token must exist and match ─────────────────────────────────────
  const isAuthorized =
    sessionValue.length > 0 &&
    expectedToken.length > 0 &&
    sessionValue === expectedToken

  if (!isAuthorized) {
    // API routes → return 401 JSON
    if (isAdminApi) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 },
      )
    }

    // Page routes → redirect to /admin/login, preserve intended destination
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Authorized — allow request through ────────────────────────────────────
  return NextResponse.next()
}

// ─── Matcher: run middleware on ALL admin routes ───────────────────────────
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}