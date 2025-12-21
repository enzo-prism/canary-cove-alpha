import type { Metadata } from "next"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { PhotoCarousel } from "@/components/photo-carousel"

export const metadata: Metadata = {
  title: "Canary Cove | Private Belize Estate on Ambergris Caye",
  description:
    "Private, fully staffed beachfront estate on Ambergris Caye with chef service, boats, and gear. Reserved for one group at a time.",
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
