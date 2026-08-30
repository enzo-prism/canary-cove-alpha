import Image from "next/image"

import { EMOJI } from "@/lib/emoji"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageStructuredData } from "@/components/structured-data"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.dining

const diningBasics = [
  "Chef service, cooking, and cleanup included.",
  "Groceries, alcohol, and beverages billed at cost.",
  "Gluten-free, vegetarian, and kid-friendly menus available.",
  "We’ll recommend and reserve island restaurants on request.",
]

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen">
      <PageStructuredData path="/dining" />
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Private chef dining</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Sunrise espresso, beach picnics, and chef dinners under the palms—timed to your adventures.
            </p>
          </div>
          <Card className="overflow-hidden rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9} className="relative">
                <Image
                  src={IMAGES.chefMarvinPlates.src}
                  alt={IMAGES.chefMarvinPlates.alt}
                  fill
                  sizes="(min-width: 1024px) 1000px, 100vw"
                  // Portrait source in a 16:9 frame: the record-level focal
                  // point keeps the chef's face above the crop.
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinPlates) }}
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                  <p className="text-xs font-medium text-white/90">Chef-prepared dinners</p>
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
          <Card
            id="how-dining-works"
            className="scroll-mt-24 rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
          >
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
              <ul className="grid gap-3 text-sm leading-relaxed text-foreground sm:grid-cols-2">
                {diningBasics.map((item) => (
                  <li key={item} data-testid="dining-basic" className="flex gap-3">
                    <span className="mt-1 text-[10px] text-primary" aria-hidden="true">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
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
              IMAGES.viewFromKitchen,
              IMAGES.diningTable,
              IMAGES.chipsAndDrinks,
              IMAGES.logoDrink,
              IMAGES.chefMarvinKitchen,
              { ...IMAGES.chefMarvinPortrait, caption: "Chef Marvin" },
              IMAGES.chefMarvinPlates,
              IMAGES.dinnerPlated,
              IMAGES.dinnerAlt,
              IMAGES.shrimpDinner,
              IMAGES.diningPlatter,
              IMAGES.tacosAlt,
              IMAGES.saladAlt,
              IMAGES.diningFoodDetail,
              IMAGES.diningDetailTwo,
              IMAGES.diningDetailThree,
              IMAGES.diningSpread,
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
