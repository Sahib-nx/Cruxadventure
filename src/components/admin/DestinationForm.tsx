'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Destination, DestinationCategory, Region, Season } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DestinationFormValues = Omit<Destination, '_id' | 'createdAt' | 'updatedAt'>

const EMPTY_FORM: DestinationFormValues = {
  slug:               '',
  name:               '',
  region:             'Kashmir',
  categories:         [],
  shortDescription:   '',
  elevation:          undefined,
  bestSeason:         [],
  thumbnail:          '',
  heroImage:          '',
  gallery:            [],
  avgPackagePrice:    0,
  avgStayPrice:       0,
  avgTransportPrice:  0,
  avgActivityPrice:   0,
  popularActivities:  [],
  tags:               [],
  popularity:         50,
  featured:           false,
}

const CATEGORIES: DestinationCategory[] = [
  'Luxury', 'Adventure', 'Trekking', 'Nature', 'Camping', 'Honeymoon', 'Snow', 'Family',
]
const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter']
const MAX_GALLERY_IMAGES = 6
const MAX_DESCRIPTION_LENGTH = 280

// ─── Field components ─────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] uppercase tracking-widest text-sand-100/50 font-semibold mb-1.5">
      {children}{required && <span className="text-gold-500 ml-0.5">*</span>}
    </label>
  )
}

function TextInput({
  value, onChange, placeholder, required, type = 'text', error,
}: {
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  type?: string
  error?: string
}) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={cn(
          'w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-sand-100 placeholder:text-sand-100/25 transition-all focus:outline-none focus:ring-2',
          error
            ? 'border-red-500/50 focus:ring-red-500/20'
            : 'border-white/10 hover:border-white/20 focus:border-gold-500/40 focus:ring-gold-500/15',
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function TextArea({
  value, onChange, placeholder, rows = 3, error, maxLength,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  error?: string
  maxLength?: number
}) {
  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-sand-100 placeholder:text-sand-100/25 resize-none transition-all focus:outline-none focus:ring-2',
          error
            ? 'border-red-500/50 focus:ring-red-500/20'
            : 'border-white/10 hover:border-white/20 focus:border-gold-500/40 focus:ring-gold-500/15',
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-white/8" />
      <p className="text-xs uppercase tracking-widest text-sand-100/30 font-semibold flex-shrink-0">{children}</p>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  )
}

// ─── Image URL helpers ────────────────────────────────────────────────────────

/**
 * Detects "share" links from Google Photos / Google Drive / Google Search etc.
 * that LOOK like image URLs but actually resolve to an HTML page, not raw image
 * bytes. Next.js <Image> (and the <img> tag itself) needs a DIRECT image URL,
 * so pasting a Google share link breaks rendering ("upstream image response
 * failed" / broken image icon).
 */
function isLikelyNonDirectGoogleUrl(url: string): boolean {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    // drive.google.com/file/d/... or open?id=... -> HTML viewer page, not an image
    if (host === 'drive.google.com') return true

    // photos.google.com / photos.app.goo.gl share links -> HTML page
    if (host === 'photos.google.com' || host === 'photos.app.goo.gl') return true

    // plain google.com/imgres or google.com/url (image search result page, not the image)
    if (host === 'google.com' && (u.pathname === '/imgres' || u.pathname === '/url')) return true

    return false
  } catch {
    return false
  }
}

/** A very loose check that the URL at least points at something that *could* be an image. */
function looksLikeDirectImageUrl(url: string): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    const path = u.pathname.toLowerCase()
    const hasImageExt = /\.(jpe?g|png|webp|avif|gif)$/.test(path)
    // Cloudinary, imgix, etc. often have no extension but a recognizable image-serving host/path
    const knownImageHost =
      u.hostname.includes('res.cloudinary.com') ||
      u.hostname.includes('images.unsplash.com') ||
      u.hostname.includes('lh3.googleusercontent.com') // direct Google *content* host (not drive/photos share pages)
    return hasImageExt || knownImageHost
  } catch {
    return false
  }
}

// ─── Image Upload Field ───────────────────────────────────────────────────────

function ImageUploadField({
  label,
  value,
  folder,
  onChange,
  required,
  error,
}: {
  label: string
  value: string
  folder: 'thumbnail' | 'hero' | 'gallery'
  onChange: (url: string) => void
  required?: boolean
  error?: string
}) {
  const inputRef              = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const [urlWarning, setUrlWarning] = useState('')
  const [imgBroken, setImgBroken] = useState(false)

  async function handleFile(file: File) {
    setUploadErr('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file',   file)
      fd.append('folder', folder)
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      onChange(data.url)
      setUrlWarning('')
      setImgBroken(false)
    } catch (e: unknown) {
      setUploadErr(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleUrlChange(v: string) {
    setImgBroken(false)
    if (v && isLikelyNonDirectGoogleUrl(v)) {
      setUrlWarning(
        "This looks like a Google Drive/Photos share link, not a direct image URL — it will show as a broken image. Right-click the image and choose \"Copy image address\", or upload the file directly instead.",
      )
    } else if (v && !looksLikeDirectImageUrl(v)) {
      setUrlWarning(
        'This URL doesn\u2019t look like a direct image link (no image extension). If the image doesn\u2019t appear below, try uploading the file directly instead.',
      )
    } else {
      setUrlWarning('')
    }
    onChange(v)
  }

  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>

      {/* Preview */}
      {value && !imgBroken && (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-navy-950/40 mb-2">
          <Image
            src={value}
            alt="Preview"
            fill
            sizes="400px"
            className="object-cover"
            unoptimized={isLikelyNonDirectGoogleUrl(value) || !looksLikeDirectImageUrl(value)}
            onError={() => setImgBroken(true)}
          />
          <button
            type="button"
            onClick={() => { onChange(''); setUrlWarning(''); setImgBroken(false) }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-navy-950/80 border border-white/15 flex items-center justify-center text-sand-100/60 hover:text-red-400 transition-colors"
            aria-label="Remove image"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Broken image fallback */}
      {value && imgBroken && (
        <div className="relative w-full rounded-xl border border-red-500/30 bg-red-500/5 p-4 mb-2 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-red-400">
              This URL couldn&apos;t be loaded as an image. Google Drive/Photos share links don&apos;t work here — please upload the file directly, or paste a direct image link (ending in .jpg, .png, etc).
            </p>
            <button
              type="button"
              onClick={() => { onChange(''); setUrlWarning(''); setImgBroken(false) }}
              className="text-[10px] text-red-400/70 hover:text-red-300 underline mt-1"
            >
              Clear and try again
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
          uploading
            ? 'border-gold-500/30 bg-gold-500/5'
            : 'border-white/10 hover:border-gold-500/30 hover:bg-white/3',
          error && 'border-red-500/30',
        )}
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 text-sand-100/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        <p className="text-xs text-sand-100/35">
          {uploading ? 'Uploading…' : 'Click or drag to upload'}
        </p>
      </div>

      {/* Or paste URL */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[10px] text-sand-100/25">or paste URL</span>
        <div className="h-px flex-1 bg-white/8" />
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder="https://res.cloudinary.com/…"
        className={cn(
          'w-full rounded-xl border bg-white/5 px-4 py-2 text-xs text-sand-100/60 placeholder:text-sand-100/20 focus:outline-none focus:ring-1 transition-all',
          urlWarning
            ? 'border-amber-500/40 focus:border-amber-500/50 focus:ring-amber-500/15'
            : 'border-white/10 focus:border-gold-500/30 focus:ring-gold-500/15',
        )}
      />
      {urlWarning && !imgBroken && (
        <p className="text-[11px] text-amber-400/90 leading-relaxed">{urlWarning}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      {(uploadErr || error) && (
        <p className="text-xs text-red-400">{uploadErr || error}</p>
      )}
    </div>
  )
}

// ─── Gallery Upload ───────────────────────────────────────────────────────────

function GalleryUpload({
  images,
  onChange,
}: {
  images: string[]
  onChange: (imgs: string[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [limitMsg, setLimitMsg] = useState('')

  const remaining = MAX_GALLERY_IMAGES - images.length
  const atLimit = remaining <= 0

  async function handleFiles(files: FileList) {
    if (atLimit) {
      setLimitMsg(`Gallery is limited to ${MAX_GALLERY_IMAGES} images. Remove one to add another.`)
      return
    }
    setLimitMsg('')
    const filesToUpload = Array.from(files).slice(0, remaining)
    const skipped = files.length - filesToUpload.length

    setUploading(true)
    const uploaded: string[] = []
    for (const file of filesToUpload) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'gallery')
      try {
        const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (res.ok) uploaded.push(data.url)
      } catch { /* skip failed */ }
    }
    onChange([...images, ...uploaded])
    setUploading(false)

    if (skipped > 0) {
      setLimitMsg(`Only added ${filesToUpload.length} image(s) — gallery limit is ${MAX_GALLERY_IMAGES}.`)
    }
  }

  return (
    <div className="space-y-3">
      {/* Existing gallery grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/8 bg-navy-950/40 group">
              <Image src={url} alt={`Gallery ${i + 1}`} fill sizes="100px" className="object-cover" />
              <button
                type="button"
                onClick={() => { onChange(images.filter((_, j) => j !== i)); setLimitMsg('') }}
                className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                aria-label="Remove image"
              >
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload trigger */}
      <button
        type="button"
        onClick={() => { if (!atLimit) inputRef.current?.click(); else setLimitMsg(`Gallery is limited to ${MAX_GALLERY_IMAGES} images. Remove one to add another.`) }}
        disabled={uploading || atLimit}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed text-xs transition-all disabled:opacity-50',
          atLimit
            ? 'border-white/8 text-sand-100/25 cursor-not-allowed'
            : 'border-white/15 hover:border-gold-500/30 text-sand-100/40 hover:text-sand-100/70',
        )}
      >
        {uploading ? (
          <div className="w-3.5 h-3.5 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        )}
        {uploading ? 'Uploading…' : atLimit ? `Gallery full (${MAX_GALLERY_IMAGES}/${MAX_GALLERY_IMAGES})` : `Add gallery images (${images.length}/${MAX_GALLERY_IMAGES})`}
      </button>

      {limitMsg && <p className="text-[11px] text-amber-400/90">{limitMsg}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = '' }}
      />
    </div>
  )
}

// ─── Tag/chip input ───────────────────────────────────────────────────────────

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setInput('')
  }

  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="text-gold-400/60 hover:text-gold-300 transition-colors"
              aria-label={`Remove ${v}`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); add() }
            if (e.key === ',')     { e.preventDefault(); add() }
          }}
          placeholder={values.length === 0 ? (placeholder ?? 'Type and press Enter') : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-sand-100 placeholder:text-sand-100/20 focus:outline-none"
        />
      </div>
      <p className="text-[10px] text-sand-100/20">Press Enter or comma to add</p>
    </div>
  )
}

// ─── Pill multi-select ────────────────────────────────────────────────────────

function PillSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
  required,
  error,
}: {
  label: string
  options: readonly T[]
  selected: T[]
  onChange: (v: T[]) => void
  required?: boolean
  error?: string
}) {
  function toggle(opt: T) {
    onChange(selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt])
  }

  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => {
          const isActive = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              aria-pressed={isActive}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                isActive
                  ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
                  : 'bg-white/5 border-white/10 text-sand-100/50 hover:text-sand-100/80 hover:border-white/20',
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─── Auto-slug helper ─────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ─── Currency helper ──────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount)
}

// ─── Main DestinationForm ─────────────────────────────────────────────────────

interface DestinationFormProps {
  initialValues?: Partial<DestinationFormValues>
  onSubmit: (values: DestinationFormValues) => Promise<void>
  submitLabel: string
  isSubmitting: boolean
  serverError?: string
}

export function DestinationForm({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting,
  serverError,
}: DestinationFormProps) {
  const [form,   setForm]   = useState<DestinationFormValues>({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors] = useState<Partial<Record<keyof DestinationFormValues, string>>>({})
  const [slugManual, setSlugManual] = useState(!!initialValues?.slug)

  function set<K extends keyof DestinationFormValues>(key: K, value: DestinationFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function handleNameChange(name: string) {
    set('name', name)
    if (!slugManual) set('slug', toSlug(name))
  }

  function handleDescriptionChange(v: string) {
    // Hard stop — admin physically cannot type past the limit.
    set('shortDescription', v.slice(0, MAX_DESCRIPTION_LENGTH))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof DestinationFormValues, string>> = {}
    if (!form.name)             e.name             = 'Name is required'
    if (!form.slug)             e.slug             = 'Slug is required'
    if (!form.shortDescription) e.shortDescription = 'Description is required'
    if (form.shortDescription.length > MAX_DESCRIPTION_LENGTH) {
      e.shortDescription = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`
    }
    if (form.categories.length === 0) e.categories = 'Select at least one category'
    if (!form.thumbnail)        e.thumbnail        = 'Thumbnail is required'
    if (!form.heroImage)        e.heroImage        = 'Hero image is required'
    if (form.gallery.length > MAX_GALLERY_IMAGES) {
      e.gallery = `Gallery can have at most ${MAX_GALLERY_IMAGES} images`
    }
    if (!form.avgPackagePrice)  e.avgPackagePrice  = 'Package price is required'
    if (!form.avgStayPrice)     e.avgStayPrice     = 'Stay price is required'
    if (!form.avgTransportPrice) e.avgTransportPrice = 'Transport price is required'
    if (!form.avgActivityPrice) e.avgActivityPrice  = 'Activity price is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">

      {/* ── Basic info ── */}
      <div>
        <SectionTitle>Basic Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="space-y-1.5">
            <FieldLabel required>Name</FieldLabel>
            <TextInput
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Gulmarg"
              required
              error={errors.name}
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel required>Slug</FieldLabel>
            <div className="flex gap-2">
              <TextInput
                value={form.slug}
                onChange={(v) => { set('slug', v); setSlugManual(true) }}
                placeholder="e.g. gulmarg"
                required
                error={errors.slug}
              />
              {slugManual && (
                <button
                  type="button"
                  onClick={() => { set('slug', toSlug(form.name)); setSlugManual(false) }}
                  className="flex-shrink-0 px-3 py-2 rounded-xl border border-white/10 text-xs text-sand-100/40 hover:text-sand-100/70 hover:border-white/20 transition-all"
                  title="Reset slug from name"
                >
                  ↺
                </button>
              )}
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <FieldLabel required>Short Description</FieldLabel>
            <TextArea
              value={form.shortDescription}
              onChange={handleDescriptionChange}
              placeholder="A cinematic 1–2 sentence description shown on destination cards…"
              rows={2}
              error={errors.shortDescription}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <p className={cn(
              'text-[10px] text-right',
              form.shortDescription.length >= MAX_DESCRIPTION_LENGTH
                ? 'text-red-400'
                : form.shortDescription.length >= MAX_DESCRIPTION_LENGTH - 30
                  ? 'text-amber-400'
                  : 'text-sand-100/20',
            )}>
              {form.shortDescription.length} / {MAX_DESCRIPTION_LENGTH}
            </p>
          </div>

          <div className="space-y-1.5">
            <FieldLabel required>Region</FieldLabel>
            <div className="flex gap-2">
              {(['Kashmir', 'Nepal'] as Region[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set('region', r)}
                  aria-pressed={form.region === r}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
                    form.region === r
                      ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
                      : 'bg-white/5 border-white/10 text-sand-100/50 hover:border-white/20',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <FieldLabel>Elevation (metres)</FieldLabel>
            <TextInput
              type="number"
              value={form.elevation ?? ''}
              onChange={(v) => set('elevation', v ? Number(v) : undefined)}
              placeholder="e.g. 2690"
            />
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <PillSelect
            label="Categories"
            options={CATEGORIES}
            selected={form.categories}
            onChange={(v) => set('categories', v)}
            required
            error={errors.categories}
          />
          <PillSelect
            label="Best Seasons"
            options={SEASONS}
            selected={form.bestSeason}
            onChange={(v) => set('bestSeason', v)}
          />
        </div>
      </div>

      {/* ── Images ── */}
      <div>
        <SectionTitle>Images</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploadField
            label="Thumbnail"
            folder="thumbnail"
            value={form.thumbnail}
            onChange={(v) => set('thumbnail', v)}
            required
            error={errors.thumbnail}
          />
          <ImageUploadField
            label="Hero Image"
            folder="hero"
            value={form.heroImage}
            onChange={(v) => set('heroImage', v)}
            required
            error={errors.heroImage}
          />
        </div>
        <div className="mt-6 space-y-1.5">
          <FieldLabel>Gallery</FieldLabel>
          <GalleryUpload images={form.gallery} onChange={(v) => set('gallery', v)} />
          {errors.gallery && <p className="text-xs text-red-400">{errors.gallery}</p>}
        </div>
      </div>

      {/* ── Pricing ── */}
      <div>
        <SectionTitle>Pricing (INR)</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(
            [
              { key: 'avgPackagePrice',   label: 'Package price',   error: errors.avgPackagePrice   },
              { key: 'avgStayPrice',      label: 'Stay / night',    error: errors.avgStayPrice      },
              { key: 'avgTransportPrice', label: 'Transport',       error: errors.avgTransportPrice },
              { key: 'avgActivityPrice',  label: 'Activities',      error: errors.avgActivityPrice  },
            ] as const
          ).map(({ key, label, error }) => (
            <div key={key} className="space-y-1.5">
              <FieldLabel required>{label}</FieldLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-100/30 text-sm">₹</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form[key] || ''}
                  onChange={(e) => set(key, Math.round(Number(e.target.value)))}
                  className={cn(
                    'w-full rounded-xl border bg-white/5 pl-7 pr-4 py-2.5 text-sm text-sand-100 placeholder:text-sand-100/25 transition-all focus:outline-none focus:ring-2',
                    error
                      ? 'border-red-500/50 focus:ring-red-500/20'
                      : 'border-white/10 hover:border-white/20 focus:border-gold-500/40 focus:ring-gold-500/15',
                  )}
                  placeholder="0"
                />
              </div>
              {!!form[key] && (
                <p className="text-[10px] text-sand-100/25">₹{formatINR(form[key] as number)}</p>
              )}
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Activities & Tags ── */}
      <div>
        <SectionTitle>Activities & Discovery</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TagInput
            label="Popular Activities"
            values={form.popularActivities}
            onChange={(v) => set('popularActivities', v)}
            placeholder="e.g. Skiing, Shikara Ride…"
          />
          <TagInput
            label="Tags"
            values={form.tags}
            onChange={(v) => set('tags', v)}
            placeholder="e.g. winter, snow, trekking…"
          />
        </div>
      </div>

      {/* ── Settings ── */}
      <div>
        <SectionTitle>Settings</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Popularity slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel>Popularity Score</FieldLabel>
              <span className="text-xs text-gold-400 font-mono tabular-nums">{form.popularity}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={form.popularity}
              onChange={(e) => set('popularity', Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-sand-100/25">
              <span>Low</span><span>High</span>
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div>
              <p className="text-sand-100/80 text-sm font-medium">Featured Destination</p>
              <p className="text-sand-100/35 text-xs mt-0.5">Show in featured sections</p>
            </div>
            <button
              type="button"
              onClick={() => set('featured', !form.featured)}
              aria-pressed={form.featured}
              aria-label="Toggle featured"
              className={cn(
                'relative w-11 h-6 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 flex-shrink-0',
                form.featured ? 'bg-gold-500' : 'bg-white/15',
              )}
            >
              <div className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300',
                form.featured ? 'translate-x-6' : 'translate-x-1',
              )} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {serverError && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-red-400"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {serverError}
          </motion.p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'ml-auto flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
            isSubmitting
              ? 'bg-white/8 text-sand-100/30 cursor-not-allowed'
              : 'bg-gold-500 text-navy-900 hover:bg-gold-400 shadow-gold',
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            <>
              {submitLabel}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  )
}