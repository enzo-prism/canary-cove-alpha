import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Dining at Canary Cove | Private chef meals and beach picnics",
  description:
    "Sunrise espresso, chef-prepared dinners, beach picnics, and bespoke menus timed to your adventures at Canary Cove.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Dining</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Sunrise espresso, beach picnics, and chef dinners under the palms—timed to your adventures.
            </p>
          </div>
          <GalleryGrid
            items={[
              IMAGES.diningRoom,
              IMAGES.kitchen,
              IMAGES.chipsAndDrinks,
              IMAGES.logoDrink,
              IMAGES.chefNatalie,
              IMAGES.chefCarry,
              IMAGES.dinnerPlated,
              IMAGES.dinnerAlt,
              IMAGES.tacos,
              IMAGES.waffles,
              IMAGES.salad,
              IMAGES.drinksBar,
              IMAGES.romanticViews,
            ]}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
