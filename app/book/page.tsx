import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { BookingForm } from "@/components/booking-form"
import { BookingPolicies } from "@/components/booking-policies"
import { PhotoCarousel } from "@/components/photo-carousel"
import { EMOJI } from "@/lib/emoji"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TestimonialsGrid } from "@/components/testimonials-grid"

export const metadata: Metadata = {
  title: "Book Canary Cove | Check Availability and Request Dates",
  description:
    "View the live calendar, share your trip details, and request a stay or courtesy hold for your group.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-28 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/80 via-white to-surface-muted/60" />
        <div className="absolute left-[12%] top-[18%] -z-10 h-64 w-64 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[8%] bottom-[18%] -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[140px]" />

        <div className="mx-auto flex max-w-6xl xl:max-w-7xl flex-col gap-10">
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Availability & holds {EMOJI.book}
                </h1>
                <p className="text-lg text-muted-foreground sm:text-xl">
                  Check dates in the live calendar, then share your trip details so we can confirm or place a courtesy hold.
                </p>
              </div>

              <Card
                id="availability-calendar"
                className="scroll-mt-24 rounded-[28px] border border-border/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              >
                <CardHeader className="px-4 pb-3 pt-4">
                  <Badge
                    variant="outline"
                    className="w-fit border-border/70 text-xs uppercase tracking-[0.3em] text-muted-foreground"
                  >
                    Live availability {EMOJI.book}
                  </Badge>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-white">
                    <iframe
                      height="280"
                      title="Bookingmood widget"
                      src="https://www.bookingmood.com/embed/939b7bb6-8e48-4256-a7af-0ec62e4a4d68"
                      style={{ width: "100%", border: "none" }}
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <BookingForm className="order-2 lg:order-1" />

            <div className="order-3 space-y-6 lg:col-span-2">
              <BookingPolicies />
              <Card
                id="comfort-confidence"
                className="scroll-mt-24 rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
              >
                <CardHeader className="px-5 pb-3 pt-5">
                  <Badge
                    variant="outline"
                    className="w-fit border-border/70 text-xs uppercase tracking-[0.28em] text-muted-foreground"
                  >
                    Comfort &amp; confidence
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5 pt-0 text-sm text-muted-foreground">
                  <p>
                    Canary Cove is designed for ease and peace of mind, with modern infrastructure and attentive staff on site.
                  </p>
                  <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
                    <li>Central air conditioning, non-smoking property, indoor/outdoor dining.</li>
                    <li>Walled, well-lit compound with onsite staff and discreet security.</li>
                    <li>Purified water from onsite desalination and filtration.</li>
                    <li>Backup generator and fiber internet for reliable power and streaming.</li>
                    <li>Double locking doors, smoke detectors, and in-room safes.</li>
                    <li>Private helipad access from Belize's international airport by request.</li>
                  </ul>
                </CardContent>
              </Card>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">Why guests return</h2>
                <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.book} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
