import { NextRequest, NextResponse } from 'next/server'

// ─── Public paths that never require auth ────────────────────────────────────
const PUBLIC_PATHS = ['/admin/login']
const PUBLIC_API   = ['/api/admin/login']

export function middleware(req: NextRequest) {
  // Middleware no longer enforces a server-side admin session cookie.
  // Admin access is handled client-side via a secret validated by the
  // `/api/admin/login` endpoint and stored in `sessionStorage`.
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