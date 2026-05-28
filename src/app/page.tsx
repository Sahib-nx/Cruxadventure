import { Navbar } from '@/components/layout/Navbar'
import { DestinationMap } from '@/components/sections/DestinationMap'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/Hero'
import { ContactSection, ExperienceShowcase, Newsletter, StatsSection, Testimonials, TripPlanner } from '@/types'


export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />


      <HeroSection />


      <DestinationMap />


      <ExperienceShowcase />


      <TripPlanner />


      <Testimonials />

      <ContactSection />

      <StatsSection />

      <Newsletter />
      <Footer />
    </main>
  )
}