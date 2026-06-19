import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// ─── Brand config ───────────────────────────────────────────────────────────
// Centralized here so copy/contact details only need to change in one place.
const BRAND = {
  name: 'Cruxadventure',
  tagline: 'Kashmir & Nepal Expeditions',
  primaryColor: '#0A1628',   // navy-900
  accentColor: '#D4A853',    // gold-500
  accentColorDark: '#7C5E22',
  website: 'https://cruxadventure.com',
  // 🔧 TODO: replace with real values before going live
  phone: '+91 00000 00000',
  phoneHref: '+910000000000',
  address: 'Cruxadventure HQ, [Street / Area], Srinagar, J&K [PIN]',
}

// ─── Env / config ─────────────────────────────────────────────────────────────
// Required in .env.local (and your hosting provider's env settings):
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=465
//   SMTP_SECURE=true                 (true for port 465, false for 587)
//   SMTP_USER=yourteam@gmail.com
//   SMTP_PASS=xxxxxxxxxxxxxxxx        (16-char Gmail App Password, not your real password)
//   CONTACT_RECEIVER_EMAIL=hello@cruxadventure.com   (where team notifications land)
//
// Gmail App Passwords require 2-Step Verification:
// https://myaccount.google.com/apppasswords

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// ─── Types ────────────────────────────────────────────────────────────────────
type ContactPayload = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject?: string       // e.g. "General Inquiry", "Custom Itinerary", "Booking Support"
  destination?: string   // e.g. "Kashmir Great Lakes Trek", "Annapurna Base Camp"
  message: string
  subscribe?: boolean
}

// ─── Basic HTML escaping for safe email rendering ──────────────────────────────
function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ─── Email to YOU (the business) — rich HTML ──────────────────────────────────
function buildAdminEmail(data: ContactPayload): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:10px 16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888888;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;vertical-align:top;border-bottom:1px solid #F0F0F0;">${label}</td>
          <td style="padding:10px 16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#212121;vertical-align:top;border-bottom:1px solid #F0F0F0;">${value}</td>
        </tr>`
      : ''

  const safeFirst = escapeHtml(data.firstName)
  const safeLast = escapeHtml(data.lastName)
  const safeEmail = escapeHtml(data.email)
  const safePhone = data.phone ? escapeHtml(data.phone) : ''
  const safeSubject = data.subject ? escapeHtml(data.subject) : ''
  const safeDestination = data.destination ? escapeHtml(data.destination) : ''
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>New Inquiry – ${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${BRAND.primaryColor};padding:36px 40px;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.accentColor};">${BRAND.name} · ${BRAND.tagline}</p>
              <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:#ffffff;line-height:1.2;">New Trip Inquiry</h1>
              <p style="margin:8px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.65);">${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </td>
          </tr>

          <!-- Urgency badge -->
          <tr>
            <td style="padding:24px 40px 0;">
              <span style="display:inline-block;background:#FFF3E0;color:#7C4A00;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;padding:6px 14px;border-radius:100px;">
                ⏱ Respond within 24 hours
              </span>
            </td>
          </tr>

          <!-- Details table -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECECEC;border-radius:6px;overflow:hidden;">
                ${row('Name', `${safeFirst} ${safeLast}`)}
                ${row('Email', `<a href="mailto:${safeEmail}" style="color:${BRAND.primaryColor};">${safeEmail}</a>`)}
                ${row('Phone', safePhone ? `<a href="tel:${safePhone}" style="color:${BRAND.primaryColor};">${safePhone}</a>` : '')}
                ${row('Subject', safeSubject)}
                ${row('Destination of Interest', safeDestination)}
                ${row('Newsletter opt-in', data.subscribe ? 'Yes' : 'No')}
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#888888;">Their Message</p>
              <div style="background:#F8F8F8;border-left:3px solid ${BRAND.accentColor};border-radius:0 6px 6px 0;padding:18px 20px;">
                <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#212121;line-height:1.7;">${safeMessage}</p>
              </div>
            </td>
          </tr>

          <!-- Quick reply button -->
          <tr>
            <td style="padding:0 40px 40px;">
              <a href="mailto:${safeEmail}?subject=Re: Your inquiry – ${BRAND.name}"
                style="display:inline-block;background:${BRAND.accentColor};color:${BRAND.primaryColor};font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;padding:14px 28px;border-radius:100px;">
                Reply to ${safeFirst} →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8F8F8;padding:20px 40px;border-top:1px solid #ECECEC;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#AAAAAA;text-align:center;">
                ${BRAND.name} · ${BRAND.address}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Confirmation email to the CLIENT ─────────────────────────────────────────
function buildClientEmail(data: ContactPayload): string {
  const safeFirst = escapeHtml(data.firstName)
  const safeSubject = data.subject ? escapeHtml(data.subject) : ''
  const safeDestination = data.destination ? escapeHtml(data.destination) : ''
  const safeMessageRaw = escapeHtml(data.message)
  const messageSnippet = safeMessageRaw.slice(0, 200) + (safeMessageRaw.length > 200 ? '…' : '')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>We received your message – ${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${BRAND.primaryColor};padding:40px 40px 36px;text-align:center;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.accentColor};">${BRAND.name} · ${BRAND.tagline}</p>
              <!-- Checkmark icon -->
              <div style="margin:20px auto 0;width:60px;height:60px;background:rgba(212,168,83,0.18);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                <table width="60" height="60" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr><td align="center" valign="middle">
                    <span style="font-size:28px;color:${BRAND.accentColor};">✓</span>
                  </td></tr>
                </table>
              </div>
              <h1 style="margin:16px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:400;color:#ffffff;line-height:1.15;">Message Received,<br/>${safeFirst}.</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#444444;line-height:1.75;">
                Thank you for reaching out to ${BRAND.name}. One of our travel experts will review your inquiry and get back to you personally within <strong style="color:#212121;">24 hours</strong>.
              </p>

              <!-- What happens next -->
              <p style="margin:28px 0 14px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#888888;">What happens next</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ['📋', 'We review your inquiry', 'Our travel team reads every message personally.'],
                  ['🧭', 'An expert reaches out', "You'll hear from us within 24 hours."],
                  ['🏔', 'We craft your itinerary', 'Tailored expedition plans built around you.'],
                ].map(([icon, title, desc]) => `
                <tr>
                  <td style="padding:12px 0;vertical-align:top;width:40px;font-size:20px;">${icon}</td>
                  <td style="padding:12px 0 12px 12px;border-bottom:1px solid #F0F0F0;">
                    <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:600;color:#212121;">${title}</p>
                    <p style="margin:3px 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888888;">${desc}</p>
                  </td>
                </tr>`).join('')}
              </table>
            </td>
          </tr>

          <!-- Summary of their message -->
          <tr>
            <td style="padding:0 40px 36px;">
              <p style="margin:0 0 10px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#888888;">Your inquiry summary</p>
              <div style="background:#F8F8F8;border-radius:6px;padding:20px;">
                ${safeSubject ? `<p style="margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888888;">Subject: <strong style="color:#212121;">${safeSubject}</strong></p>` : ''}
                ${safeDestination ? `<p style="margin:0 0 6px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888888;">Destination of interest: <strong style="color:#212121;">${safeDestination}</strong></p>` : ''}
                <p style="margin:${safeSubject || safeDestination ? '12px' : '0'} 0 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#444444;line-height:1.6;font-style:italic;">"${messageSnippet}"</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <p style="margin:0 0 16px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888888;">Can't wait? Call us directly.</p>
              <a href="tel:${BRAND.phoneHref}"
                style="display:inline-block;background:${BRAND.accentColor};color:${BRAND.primaryColor};font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;text-decoration:none;padding:14px 32px;border-radius:100px;">
                ${BRAND.phone}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F8F8F8;padding:20px 40px;border-top:1px solid #ECECEC;">
              <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#AAAAAA;text-align:center;line-height:1.6;">
                ${BRAND.name} · ${BRAND.address}<br/>
                <a href="${BRAND.website}" style="color:${BRAND.accentColorDark};text-decoration:none;">${BRAND.website.replace(/^https?:\/\//, '')}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── In-memory rate limiter (per-IP, resets on cold start) ─────────────────────
// Stops accidental double-submits / casual abuse on a single instance.
// For multi-instance deployments, swap this for Redis/Upstash or a provider-level limit.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  hits.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT_MAX
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 },
      )
    }

    const body: ContactPayload = await req.json().catch(() => null as any)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    // Basic validation
    const firstName = String(body.firstName ?? '').trim()
    const lastName = String(body.lastName ?? '').trim()
    const email = String(body.email ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'First name, last name, email, and message are required.' },
        { status: 400 },
      )
    }
    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        { error: 'First and last name must be at least 2 characters.' },
        { status: 422 },
      )
    }
    if (message.length < 20) {
      return NextResponse.json(
        { error: 'Message must be at least 20 characters.' },
        { status: 422 },
      )
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 422 })
    }

    const data: ContactPayload = {
      firstName,
      lastName,
      email,
      phone: body.phone ? String(body.phone).trim() : undefined,
      subject: body.subject ? String(body.subject).trim() : undefined,
      destination: body.destination ? String(body.destination).trim() : undefined,
      message,
      subscribe: Boolean(body.subscribe),
    }

    const transporter = createTransporter()

    // 1. Email to the business
    await transporter.sendMail({
      from: `"${BRAND.name} Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER,
      replyTo: data.email,
      subject: `New Inquiry from ${data.firstName} ${data.lastName}${data.subject ? ` — ${data.subject}` : ''}`,
      html: buildAdminEmail(data),
    })

    // 2. Confirmation email to the client
    await transporter.sendMail({
      from: `"${BRAND.name}" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `We received your message, ${data.firstName} — ${BRAND.name}`,
      html: buildClientEmail(data),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[Contact API Error]', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or call us directly.' },
      { status: 500 },
    )
  }
}