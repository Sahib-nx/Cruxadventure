import { HeroSection } from '@/pages/Hero'

import { TripPlannerTeaser } from '@/components/ui/homeComp/Tripplannerteaser'
import { VisualFeedStrip } from '@/components/ui/homeComp/Visualfeedstrip'
import { DestinationsStrip } from '@/components/ui/homeComp/Destinationsstrip'
import { ExperienceShowcase } from '@/components/ui/homeComp/Experienceshowcase'
import StatsSection from '@/pages/StatsSection'
import Testimonials from '@/pages/Testimonials'
import Newsletter from '@/pages/Newsletter'


export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <DestinationsStrip />
      <ExperienceShowcase />
      <StatsSection />

      <TripPlannerTeaser />
      <Testimonials />
      <VisualFeedStrip />


      <Newsletter />
    </main>
  )
}