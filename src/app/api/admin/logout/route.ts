import { NextResponse } from 'next/server'

export async function POST() {
  // Server-side no-op for logout; client clears sessionStorage
  return NextResponse.json({ ok: true })
}