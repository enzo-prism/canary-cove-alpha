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
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Experiences</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Calm mornings, adrenaline afternoons, and sunset cruises—all planned around the tides and your pace.
            </p>
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
