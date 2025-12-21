import type { Metadata } from "next"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { PhotoCarousel } from "@/components/photo-carousel"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

export const metadata: Metadata = {
  title: "Canary Cove | Private Belize Estate on Ambergris Caye",
  description:
    "Private, fully staffed beachfront estate on Ambergris Caye with chef service, boats, and gear. Reserved for one group at a time.",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Guest highlights</h2>
            <p className="text-base text-muted-foreground">
              A few moments that capture the Canary Cove experience in their own words.
            </p>
          </div>
          <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.home} />
        </div>
      </section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
