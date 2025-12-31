import Link from "next/link"
import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TestimonialsGrid } from "@/components/testimonials-grid"

const steps = [
  {
    title: "Clear customs & immigration",
    detail:
      "Use the Belize digital forms (https://ideclare.gov.bz/Belize_Digital_Forms/). On the form, list BELIZE as the destination country and SAN PEDRO as where you are staying.",
    badge: "✈️",
  },
  {
    title: "Hop on a commuter flight",
    detail:
      "After baggage claim, head to Maya Island Air or Tropic Air. Our staff books this for you. It’s a 15-minute flight to Ambergris Caye, landing in San Pedro.",
    badge: "🛩️",
  },
  {
    title: "Meet our team in San Pedro",
    detail:
      "Our staff meets you at the San Pedro airport. The boat dock is a 10-minute walk or a 5-minute taxi ride away.",
    badge: "🤝",
  },
  {
    title: "Boat to Canary Cove",
    detail:
      "Board our boat for a 15-minute ride about 6 miles north to the compound. Your bags come with you; we handle the rest.",
    badge: "🛥️",
  },
]

export const metadata: Metadata = {
  title: "Getting Here | Belize Arrival Guide to Canary Cove",
  description:
    "Step-by-step arrival guide from Belize City to San Pedro and the boat transfer to the estate.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto flex max-w-6xl xl:max-w-7xl flex-col gap-10">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="w-fit border-border/70 text-xs uppercase tracking-[0.35em] text-muted-foreground"
            >
              Travel made easy
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">How to get here</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              A simple, guided journey: customs, a short hop to San Pedro, and a quick boat ride to Canary Cove.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Card
              id="arrival-steps"
              className="scroll-mt-24 rounded-[20px] border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
            >
              <CardContent className="p-6">
                <ol className="relative space-y-6 border-l border-border/70 pl-6">
                  {steps.map((step, index) => (
                    <li key={step.title} className="space-y-2">
                      <div className="absolute -left-[13px] mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-black">
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className="text-base">{step.badge}</span>
                        {step.title}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.detail}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="rounded-[20px] border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <CardContent className="space-y-4 p-6">
                <Badge
                  variant="outline"
                  className="w-fit border-border/70 text-xs uppercase tracking-[0.35em] text-muted-foreground"
                >
                  Quick links
                </Badge>
                <div className="space-y-2 text-sm text-foreground">
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full justify-center rounded-xl border border-border/70 bg-primary/10 text-black hover:bg-primary/15"
                  >
                    <Link href="https://ideclare.gov.bz/Belize_Digital_Forms/">Fill Belize digital forms →</Link>
                  </Button>
                  <p className="text-muted-foreground">
                    Destination country: BELIZE · Staying in: SAN PEDRO · Flights: Maya Island Air or Tropic Air
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <Card className="rounded-xl border-border/70 bg-surface/80 shadow-none">
                    <CardContent className="p-3">
                      <p className="text-foreground font-semibold">Timing</p>
                      <p>15-minute hop to San Pedro · 10-minute walk/5-minute taxi to dock · 15-minute boat ride north</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl border-border/70 bg-surface/80 shadow-none">
                    <CardContent className="p-3">
                      <p className="text-foreground font-semibold">We handle</p>
                      <p>
                        Local flight bookings, complimentary airport pickup and drop-off, and luggage on the boat to the estate.
                        We welcome you at the dock with tropical drinks.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl border-border/70 bg-surface/80 shadow-none">
                    <CardContent className="p-3">
                      <p className="text-foreground font-semibold">On-site transport</p>
                      <p>Private helipad available with advance notice, including direct access from Belize's international airport by request. Golf cart ready for town runs.</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Arrival impressions</h2>
              <p className="text-base text-muted-foreground">
                Guests often mention the welcome ride and the dock greeting as part of the Canary Cove magic.
              </p>
            </div>
            <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.gettingHere} />
          </div>

          <Card
            id="getting-around"
            className="scroll-mt-24 rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
          >
            <CardContent className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-foreground">Arrival snapshots</h2>
              <GalleryGrid
                items={[
                  { ...IMAGES.sanPedroWelcome, caption: "Arrival in San Pedro" },
                  { ...IMAGES.helipad, caption: "Helipad" },
                ]}
              />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-foreground">Getting around</h2>
              <p className="mt-2 text-base text-muted-foreground">
                Canary Cove sits about 6.5 miles north of San Pedro and is accessed primarily by boat. Arrival and departure boat
                transfers are complimentary. For trips into town, we can run our 30-foot boat ($75 round-trip) or arrange private
                charters ($100/hr + gas). Golf carts are available—ask about current policies and rates. Prefer to skip the commuter
                flight? We can help arrange a direct boat transfer from Belize City.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  )
}
