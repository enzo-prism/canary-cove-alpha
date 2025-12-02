import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { PhotoCarousel } from "@/components/photo-carousel"

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
