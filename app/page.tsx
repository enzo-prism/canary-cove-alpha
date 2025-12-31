import type { Metadata } from "next"
import Link from "next/link"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { PhotoCarousel } from "@/components/photo-carousel"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
          <Button asChild variant="outline" className="w-fit rounded-full">
            <Link href="/about#guest-testimonials">Read more reviews</Link>
          </Button>
        </div>
      </section>
      <PhotoCarousel />
      <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <Card className="rounded-[40px] border border-white/60 bg-white/85 shadow-[0_30px_110px_rgba(15,23,42,0.12)] backdrop-blur">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="aspect-video overflow-hidden rounded-[32px] border border-white/70 bg-black/5">
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  poster="https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp"
                >
                  <source
                    src="https://res.cloudinary.com/dhqpqfw6w/video/upload/v1762995355/pv_mwqjho.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  )
}
