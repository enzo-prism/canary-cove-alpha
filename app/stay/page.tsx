import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { StayAmenities } from "@/components/stay-amenities"
import { StayHighlights } from "@/components/stay-highlights"
import { StayMiniGallery } from "@/components/stay-mini-gallery"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Stay at Canary Cove | Beachfront Villa, Suites, and Docks",
  description:
    "Private villa estate with suites, docks, pool, hot tub, and open-air living reserved entirely for your group in Belize.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Stay at Canary Cove</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              One private estate with beach, docks, suites, and open-air living—reserved entirely for your group.
            </p>
          </div>
          <StayMiniGallery />
          <StayHighlights />
          <StayAmenities />
          <GalleryGrid
            items={[
              IMAGES.villaPool,
              IMAGES.villaLawn,
              IMAGES.villaSign,
              IMAGES.mainDock,
              IMAGES.hobieCat,
              IMAGES.hammock,
              IMAGES.grillPool,
              IMAGES.bikes,
              IMAGES.hotTub,
              { ...IMAGES.villaInteriorWide, caption: "Villa interior, wide view" },
              IMAGES.livingRoom,
              { ...IMAGES.livingRoomAlt, caption: "Living room" },
              { ...IMAGES.livingRoomTv, caption: "Living room" },
              { ...IMAGES.livingRoomPhoto, caption: "Living room" },
              { ...IMAGES.viewFromKitchen, caption: "View from kitchen" },
              { ...IMAGES.kitchen, caption: "Kitchen" },
              { ...IMAGES.kitchenAlt, caption: "Kitchen" },
              { ...IMAGES.diningRoom, caption: "Dining room" },
              { ...IMAGES.diningRoomAlt, caption: "Dining room" },
              { ...IMAGES.villaMasterBedroom, caption: "Master bedroom, poolside view" },
              { ...IMAGES.villaBedroom, caption: "Bedroom 2 of 3, poolside view" },
              { ...IMAGES.bedroomGardenView, caption: "Bedroom 3 of 3, garden view" },
              { ...IMAGES.bunkBeds, caption: "Bunk beds" },
              { ...IMAGES.bedDetail, caption: "Bed detail" },
              { ...IMAGES.bedDetailAlt, caption: "Bed detail" },
              { ...IMAGES.bathroomMaster, caption: "Master bathroom" },
              { ...IMAGES.bathroomMasterAlt, caption: "Master bath" },
              { ...IMAGES.bathroomSuite, caption: "Living room bathroom" },
              { ...IMAGES.bathroomAlt, caption: "Bathroom" },
              IMAGES.logoDrink,
            ]}
          />
        </div>
      </section>
      <Footer />
    </main>
  )
}
