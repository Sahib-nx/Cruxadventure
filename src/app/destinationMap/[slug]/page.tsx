import { Metadata } from 'next'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'
import { notFound } from 'next/navigation'
import { SafeImage } from '@/components/ui/SafeImage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  await connectToDatabase()
  const dest = await DestinationModel.findOne({ slug }).lean()
  if (!dest) return { title: 'Not Found' }

  return {
    title: `${dest.name} | Luxury Himalayan Journey`,
    description: dest.shortDescription,
    openGraph: {
      title: `${dest.name} — ${dest.region}`,
      description: dest.shortDescription,
      images: [{ url: dest.heroImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dest.name,
      description: dest.shortDescription,
      images: [dest.heroImage],
    },
  }
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params
  await connectToDatabase()
  const dest = await DestinationModel.findOne({ slug }).lean()
  if (!dest) notFound()

  // Admin can upload up to 6 gallery photos — cap defensively here too,
  // and pick a grid layout that reads well at every count from 1–6.
  const gallery: string[] = Array.isArray(dest.gallery) ? dest.gallery.slice(0, 6) : []

  return (
    <main className="bg-navy-900 text-sand-100">
      {/* Hero — image + title only, no description here so long text never overflows the fixed-height hero */}
      <div className="relative h-[40vh] sm:h-[44vh] lg:h-[48vh] w-full">
        <SafeImage src={dest.heroImage} alt={dest.name} fill className="object-cover" sizes="100vw" priority />

        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-5xl w-full p-5 sm:p-6 lg:p-8">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {dest.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">

          {/* Gallery — adapts grid columns/rows to however many photos the admin uploaded (1–6) */}
          {gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((g, i) => (
                <div
                  key={i}
                  className={
                    // When there are exactly 5, let the first image span 2 cols on larger screens
                    // so the row counts work out cleanly (2+3 instead of an awkward leftover single).
                    gallery.length === 5 && i === 0
                      ? 'relative h-40 sm:h-48 sm:col-span-2 rounded-lg overflow-hidden'
                      : 'relative h-40 sm:h-48 rounded-lg overflow-hidden'
                  }
                >
                  <SafeImage
                    src={g}
                    alt={`${dest.name} gallery ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* About — description now lives here only, free to wrap to any length */}
          <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
            <h2>About this journey</h2>
            <p className="break-words">{dest.shortDescription}</p>
          </div>

          {dest.popularActivities?.length > 0 && (
            <div>
              <h3 className="font-semibold">Popular activities</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-white/80">
                {dest.popularActivities.map((a: string) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="bg-navy-800/60 p-4 rounded-lg">
            <h4 className="text-sm text-white/80">Estimated starting price</h4>
            <div className="mt-2 text-2xl font-display text-gold-400">
              ${dest.avgPackagePrice?.toLocaleString?.() ?? '—'}
            </div>
            <div className="mt-3 text-xs text-white/60 space-y-1">
              <div>Avg stay: ${dest.avgStayPrice?.toLocaleString?.() ?? '—'}</div>
              <div>Transport: ${dest.avgTransportPrice?.toLocaleString?.() ?? '—'}</div>
              <div>Activities: ${dest.avgActivityPrice?.toLocaleString?.() ?? '—'}</div>
            </div>
          </div>

          <div className="bg-navy-800/60 p-4 rounded-lg">
            <h4 className="text-sm text-white/80">Details</h4>
            <dl className="mt-2 text-sm text-white/70 space-y-2">
              <div>
                <dt className="font-medium">Region</dt>
                <dd>{dest.region}</dd>
              </div>
              <div>
                <dt className="font-medium">Best season</dt>
                <dd>{Array.isArray(dest.bestSeason) ? dest.bestSeason.join(', ') : dest.bestSeason}</dd>
              </div>
              <div>
                <dt className="font-medium">Categories</dt>
                <dd>{(dest.categories || []).join(', ')}</dd>
              </div>
              <div>
                <dt className="font-medium">Tags</dt>
                <dd>{(dest.tags || []).join(', ')}</dd>
              </div>
              <div>
                <dt className="font-medium">Elevation</dt>
                <dd>{dest.elevation ? `${dest.elevation} m` : '—'}</dd>
              </div>
              <div>
                <dt className="font-medium">Popularity</dt>
                <dd>{typeof dest.popularity === 'number' ? `${dest.popularity}%` : '—'}</dd>
              </div>
              <div>
                <dt className="font-medium">Featured</dt>
                <dd>{dest.featured ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="font-medium">Created</dt>
                <dd>{dest.createdAt ? new Date(dest.createdAt).toLocaleDateString() : '—'}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  )
}