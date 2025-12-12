import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"

export const metadata: Metadata = {
  title: "Stay at Canary Cove | Private beachfront villa and suites",
  description:
    "Spread out across the villa, suites, docks, and beach at Canary Cove—your private, fully staffed estate on Ambergris Caye.",
}

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
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-semibold text-foreground">The Villa</h2>
              <p className="mt-2 text-base text-muted-foreground">
                Three king suites with ensuite baths open onto an airy great room, accordion glass doors, and ocean-facing patio.
                The villa sleeps up to 10 guests, including up to two small children in the bunk room and a queen sleeper sofa.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                <li>Book the entire villa for your group.</li>
                <li>Choose to open 1, 2, or all 3 suites.</li>
                <li>Unused suites remain locked and aren’t charged.</li>
                <li>Gourmet kitchen + indoor dining for eight.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border/70 bg-white/90 p-6 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-semibold text-foreground">Outside, just for you</h2>
              <p className="mt-2 text-base text-muted-foreground">
                A private infinity pool, swim-up bar, Viking grill, gardens, hammocks, and two docks create a true “your own resort”
                feel—no shared spaces, no schedules.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-foreground sm:grid-cols-2">
                <li>Infinity pool and shaded deck.</li>
                <li>Swim-up bar with fridge, tap, and TV.</li>
                <li>Two private docks for lounging and fishing.</li>
                <li>Hot tub on site (heating is a daily add-on).</li>
              </ul>
            </div>
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
