import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "About Canary Cove | Family-owned all-inclusive estate in Belize",
  description:
    "Learn about Canary Cove—our private, family-owned, all-inclusive beachfront estate with dock access, full staff, and tailored hosting on Ambergris Caye.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">About Canary Cove</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              A private, family-owned estate with a dedicated team, quiet beaches, and dock access for effortless arrivals.
            </p>
          </div>
          <GalleryGrid
            items={[
              IMAGES.villaPool,
              IMAGES.livingRoom,
              IMAGES.villaBedroom,
              IMAGES.wedding,
              IMAGES.romanticViews,
              IMAGES.mainDock,
              IMAGES.helipad,
              IMAGES.logoDrink,
              IMAGES.diningRoom,
              IMAGES.villaLawn,
              IMAGES.villaSign,
              IMAGES.hammock,
              IMAGES.bikes,
              IMAGES.drinksBar,
              IMAGES.viewFromKitchen,
            ]}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
