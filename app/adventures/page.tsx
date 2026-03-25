import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { WaysToEnjoy } from "@/components/ways-to-enjoy"
import { IMAGES } from "@/lib/images"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { PageStructuredData } from "@/components/structured-data"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.adventures

export default function Page() {
  return (
    <main id="main-content" className="min-h-screen">
      <PageStructuredData path="/adventures" />
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Belize adventures</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              From reef dives to sandbar picnics and boat days, we line up the crews and routes so you can just show up.
            </p>
          </div>
          <WaysToEnjoy />
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">Guest adventures</h2>
              <p className="text-base text-muted-foreground">
                Reef days, jungle tours, and island time brought to life by guest stories.
              </p>
            </div>
            <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.adventures} />
          </div>
          <GalleryGrid
            items={[
              IMAGES.tubing,
              IMAGES.waterSlide,
              IMAGES.scubaPhoto,
              IMAGES.divingFun,
              IMAGES.turtleDive,
              IMAGES.adventureGroup,
              IMAGES.caveTubing,
              IMAGES.fishingTrophy,
              IMAGES.lionFishCatch,
              IMAGES.mainDock,
              IMAGES.helipad,
              IMAGES.jungleAdventure,
              IMAGES.landAdventure,
              IMAGES.gilBoat,
            ]}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
