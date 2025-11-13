import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Experiences } from "@/components/experiences"
import { Footer } from "@/components/footer"
import { PhotoCarousel } from "@/components/photo-carousel"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PhotoCarousel />
      <Features />
      <Experiences />
      <Footer />
    </main>
  )
}
