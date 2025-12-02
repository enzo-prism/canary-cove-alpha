import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Stay at Canary Cove</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              One private estate with beach, docks, suites, and open-air living—reserved entirely for your group.
            </p>
          </div>
          <GalleryGrid
            items={[
              IMAGES.villaPool,
              IMAGES.villaBedroom,
              IMAGES.villaMasterBedroom,
              IMAGES.livingRoom,
              IMAGES.livingRoomAlt,
              IMAGES.livingRoomPhoto,
              IMAGES.viewFromKitchen,
              IMAGES.kitchen,
              IMAGES.diningRoom,
              IMAGES.hotTub,
              IMAGES.bathroomMaster,
              IMAGES.bathroomSuite,
              IMAGES.bathroomAlt,
              IMAGES.villaLawn,
              IMAGES.villaSign,
              IMAGES.hobieCat,
              IMAGES.mainDock,
              IMAGES.hammock,
              IMAGES.grillPool,
              IMAGES.bikes,
              IMAGES.logoDrink,
            ]}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
