import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Adventures at Canary Cove | Reef dives, sandbars, and boat days",
  description:
    "Plan adrenaline days and mellow island hops: tubing, reef dives, sandbar picnics, and boat runs from your private dock at Canary Cove.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Adventures</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              From reef dives to sandbar picnics and boat days, we line up the crews and routes so you can just show up.
            </p>
          </div>
          <GalleryGrid
            items={[
              IMAGES.tubing,
              IMAGES.waterSlide,
              IMAGES.hobieCat,
              IMAGES.divingFun,
              IMAGES.turtleDive,
              IMAGES.platformFun,
              IMAGES.caveTubing,
              IMAGES.fishingTrophy,
              IMAGES.lionFishCatch,
              IMAGES.mainDock,
              IMAGES.helipad,
              IMAGES.jungleAdventure,
              IMAGES.familyScuba,
              IMAGES.gilBoat,
            ]}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
