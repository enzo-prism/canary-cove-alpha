import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"
import { ExperiencesMiniGallery } from "@/components/experiences-mini-gallery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WaysToEnjoy } from "@/components/ways-to-enjoy"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { TestimonialsGrid } from "@/components/testimonials-grid"

export const metadata: Metadata = {
  title: "Experiences at Canary Cove | Included Gear and Add-On Trips",
  description:
    "Explore included water toys and on-site amenities, then add diving, fishing, or island excursions planned around your pace.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Experiences</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Calm mornings, adrenaline afternoons, and sunset cruises—all planned around the tides and your pace.
            </p>
          </div>
          <ExperiencesMiniGallery />
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-2xl font-semibold text-foreground">Included with your stay</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
                  <li>Snorkel gear for dock and reef days plus the swim platform with slide.</li>
                  <li>Sea kayaks, paddle boards, and a Hobie catamaran.</li>
                  <li>Passive solar-heated infinity pool and on-site hot tub.</li>
                  <li>Two private docks with a boat and driver for reef snorkel tows (gas only).</li>
                  <li>Beach bikes, volleyball, horseshoes, and corn hole.</li>
                  <li>On-site staff to help you launch and plan.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-2xl font-semibold text-foreground">Add-on adventures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 pt-0">
                <p className="text-base text-muted-foreground">
                  Power boating, diving, and fishing are arranged with Canary Cove staff through Poseidon Belize, and off-island
                  excursions can be scheduled for your group.
                </p>
                <ul className="grid gap-2 text-sm text-foreground">
                  <li>Diving: $100 one-tank · $125 two-tank (+$15 Nitrox).</li>
                  <li>Fishing: $275 half-day · $400 full-day · $600 offshore.</li>
                  <li>Boat runs to San Pedro: $75 round-trip · private charters $100/hr + gas.</li>
                  <li>Power-boat activities: SCUBA, Snuba, tubing, wakeboarding, and boat rides (daily use + gas).</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Fuel, marine park fees, hot-tub heating, and gratuities are additional.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-2xl font-semibold text-foreground">Extra services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 pt-0">
              <p className="text-base text-muted-foreground">
                Let us know your preferences and we will arrange the details.
              </p>
              <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
                <li>Spa services in-villa or on the terrace.</li>
                <li>Child care by our staff.</li>
                <li>SCUBA diving certification.</li>
                <li>Water and land excursions beyond Ambergris Caye.</li>
                <li>Water taxi into town.</li>
                <li>Private destination events, parties, and weddings.</li>
              </ul>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Adventure highlights from guests</h2>
              <p className="text-base text-muted-foreground">
                Stories from snorkeling, dives, fishing days, and sunset runs planned around the tides.
              </p>
            </div>
            <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.experiences} />
          </div>
          <WaysToEnjoy />
          <GalleryGrid
            items={[
              IMAGES.tubing,
              IMAGES.platformFun,
              IMAGES.familyScuba,
              IMAGES.divingLessons,
              IMAGES.divingFun,
              IMAGES.turtleDive,
              IMAGES.scubaPhoto,
              IMAGES.romanticViews,
              IMAGES.caveTubing,
              IMAGES.landAdventure,
              { ...IMAGES.zooVisit, caption: "Zoo" },
              IMAGES.belizeSign,
              IMAGES.adventureGroup,
              IMAGES.mainDock,
              IMAGES.gilBoat,
              IMAGES.drinksBar,
            ]}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
