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
          <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-semibold text-foreground">How dining works</h2>
            <p className="mt-2 text-base text-muted-foreground">
              Your private chef prepares lunch and dinner to order and serves whenever you’d like. The kitchen is stocked before
              arrival for breakfasts and snacks, and we shop locally for your meals.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-foreground sm:grid-cols-2">
              <li>Chef service, cooking, and cleanup included.</li>
              <li>Groceries, alcohol, and beverages billed at cost.</li>
              <li>Gluten-free, vegetarian, and kid-friendly menus available.</li>
              <li>We’ll recommend and reserve island restaurants on request.</li>
            </ul>
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
