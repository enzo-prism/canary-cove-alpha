import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { BookingForm } from "@/components/booking-form"
import { BookingPolicies } from "@/components/booking-policies"
import { PhotoCarousel } from "@/components/photo-carousel"
import { EMOJI } from "@/lib/emoji"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Book Canary Cove | Check availability and request to book",
  description:
    "View live availability and request to book Canary Cove—our private, all-inclusive beachfront estate on Ambergris Caye.",
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

              <Card className="rounded-[28px] border border-border/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
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

            <div className="order-3 lg:col-span-2">
              <BookingPolicies />
            </div>
          </div>
        </div>
      </section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
