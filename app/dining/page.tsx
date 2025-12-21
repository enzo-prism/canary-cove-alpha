import Image from "next/image"
import type { Metadata } from "next"

import { EMOJI } from "@/lib/emoji"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TestimonialsGrid } from "@/components/testimonials-grid"

export const metadata: Metadata = {
  title: "Dining at Canary Cove | Private Chef and Beach Picnics",
  description:
    "Daily breakfasts, chef-prepared lunches and dinners, and beach picnics tailored to your schedule and tastes.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Dining</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Sunrise espresso, beach picnics, and chef dinners under the palms—timed to your adventures.
            </p>
          </div>
          <Card className="overflow-hidden rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9} className="relative">
                <Image
                  src={IMAGES.chefCarry.src}
                  alt={IMAGES.chefCarry.alt}
                  fill
                  sizes="(min-width: 1024px) 1000px, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                  <p className="text-xs font-medium text-white/90">Chef-prepared dinners</p>
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-2xl font-semibold text-foreground">
                How dining works {EMOJI.chef}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 pt-0">
              <p className="text-base text-muted-foreground">
                Your private chef prepares and serves lunch and dinner whenever you'd like, and our team handles cleanup. The
                kitchen is stocked before arrival for self-serve breakfasts and snacks, with food and beverage purchases billed at
                cost.
              </p>
              <ul className="grid gap-2 text-sm text-foreground sm:grid-cols-2">
                <li>Chef service, cooking, and cleanup included.</li>
                <li>Groceries, alcohol, and beverages billed at cost.</li>
                <li>Gluten-free, vegetarian, and kid-friendly menus available.</li>
                <li>We’ll recommend and reserve island restaurants on request.</li>
              </ul>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Dining memories</h2>
              <p className="text-base text-muted-foreground">
                A few guest notes about chef-prepared meals and favorite dishes.
              </p>
            </div>
            <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.dining} />
          </div>
          <GalleryGrid
            items={[
              IMAGES.diningRoom,
              IMAGES.diningRoomAlt,
              IMAGES.kitchen,
              IMAGES.chipsAndDrinks,
              IMAGES.logoDrink,
              IMAGES.chefNatalie,
              { ...IMAGES.chefNataliePortrait, caption: "Chef Natalie" },
              IMAGES.dinnerPlated,
              IMAGES.dinnerAlt,
              IMAGES.shrimpDinner,
              IMAGES.diningPlatter,
              IMAGES.tacosAlt,
              IMAGES.waffles,
              IMAGES.saladAlt,
              IMAGES.diningFoodDetail,
              IMAGES.diningFoodDetailAlt,
              IMAGES.diningEntree,
              IMAGES.diningDetailOne,
              IMAGES.diningDetailTwo,
              IMAGES.diningDetailThree,
              IMAGES.diningSpread,
              IMAGES.diningTable,
              IMAGES.caramba,
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
