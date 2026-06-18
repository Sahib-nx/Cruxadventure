import { Metadata } from 'next'
import Image from 'next/image'
import { connectToDatabase } from '@/db/connect'
import DestinationModel from '@/db/models/Destination'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectToDatabase()
  const dest = await DestinationModel.findOne({ slug: params.slug }).lean()
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
  await connectToDatabase()
  const dest = await DestinationModel.findOne({ slug: params.slug }).lean()
  if (!dest) notFound()

  return (
    <main className="bg-navy-900 text-sand-100">
      {/* Hero */}
      <div className="relative h-[48vh] w-full">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-5xl p-8">
            <h1 className="font-display text-4xl">{dest.name}</h1>
            <p className="mt-2 text-sm text-white/70">{dest.shortDescription}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          {Array.isArray(dest.gallery) && dest.gallery.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {dest.gallery.slice(0, 4).map((g: string, i: number) => (
                <div key={i} className="relative h-40 rounded-lg overflow-hidden">
                  <Image src={g} alt={`${dest.name} gallery ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <h2>About this journey</h2>
            <p>{dest.shortDescription}</p>
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