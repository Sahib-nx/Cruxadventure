import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

const MAX_SIZE  = 10 * 1024 * 1024 // 10 MB
const ALLOWED   = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const FOLDERS   = ['thumbnail', 'hero', 'gallery'] as const
type UploadFolder = typeof FOLDERS[number]

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file     = formData.get('file') as File | null
  const folder   = (formData.get('folder') as UploadFolder) ?? 'gallery'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: jpeg, png, webp, avif' },
      { status: 422 },
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum 10 MB.' },
      { status: 422 },
    )
  }
  if (!FOLDERS.includes(folder)) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 422 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise<{
      secure_url: string
      public_id: string
      width: number
      height: number
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `himalayan-platform/${folder}`,
          use_filename: false,
          unique_filename: true,
          overwrite: false,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (err, res) => {
          if (err || !res) return reject(err ?? new Error('Upload failed'))
          resolve(res as never)
        },
      )
      stream.end(buffer)
    })

    return NextResponse.json({
      url:      result.secure_url,
      publicId: result.public_id,
      width:    result.width,
      height:   result.height,
    })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}