import type { Metadata } from "next"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { PhotoCarousel } from "@/components/photo-carousel"

export const metadata: Metadata = {
  title: "Canary Cove | Private All-Inclusive Belize Estate",
  description:
    "Welcome to Canary Cove, a one-of-a-kind all-inclusive beachfront estate on Ambergris Caye with private chef, boats, and full staff—reserved for one group at a time.",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
