import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Experiences at Canary Cove | Boat days, dives, and sandbars",
  description:
    "See how we plan boat days, reef dives, sandbar picnics, and calm mornings on property—crafted around the tides for your group.",
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
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-semibold text-foreground">Included with your stay</h2>
              <ul className="mt-4 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                <li>Snorkel gear for dock and reef days.</li>
                <li>Sea kayaks, paddle boards, and a Hobie catamaran.</li>
                <li>Two private docks and swim platform access.</li>
                <li>Beach bikes, volleyball, horseshoes, and corn hole.</li>
                <li>On-site staff to help you launch and plan.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-semibold text-foreground">Add-on adventures</h2>
              <p className="mt-2 text-base text-muted-foreground">
                Power boating, diving, fishing, and off-island excursions are arranged for your group and billed separately.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-foreground">
                <li>Diving: $100 one-tank · $125 two-tank (+$15 Nitrox).</li>
                <li>Fishing: $275 half-day · $400 full-day · $600 offshore.</li>
                <li>Boat runs to San Pedro: $75 round-trip · private charters $100/hr + gas.</li>
              </ul>
              <p className="mt-3 text-sm text-muted-foreground">
                Fuel, marine park fees, hot-tub heating, and gratuities are additional.
              </p>
            </div>
          </div>
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
