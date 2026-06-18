import { WhyWanderlust } from '@/components/ui/homeComp/Whywanderlust '
import { HeroSection } from '@/pages/Hero'
import { ExperienceShowcase, Newsletter, StatsSection, Testimonials } from '@/types'
import { TripPlannerTeaser } from '@/components/ui/homeComp/Tripplannerteaser'
import { VisualFeedStrip } from '@/components/ui/homeComp/Visualfeedstrip'
import { DestinationsStrip } from '@/components/ui/homeComp/Destinationsstrip'


export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <DestinationsStrip />
      <WhyWanderlust />
      <ExperienceShowcase />
      <StatsSection />

      <TripPlannerTeaser />
      <Testimonials />
      <VisualFeedStrip />


      <Newsletter />
    </main>
  )
}