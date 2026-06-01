import { Metadata } from 'next'
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
    <main>
      {/* Hero, gallery, package builder for this specific destination */}
      {/* Implement with JourneyConfigurator pre-seeded with this destination */}
    </main>
  )
}