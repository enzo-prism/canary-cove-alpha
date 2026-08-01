import { Footer } from "@/components/footer"
import { GalleryBrowser } from "@/components/gallery-browser"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { PageStructuredData } from "@/components/structured-data"
import { Badge } from "@/components/ui/badge"
import { GALLERY_PHOTOS } from "@/lib/gallery-photos"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.gallery

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageStructuredData path="/gallery" />
      <Header />
      <main id="main-content">
        <Container className="space-y-10 py-12 sm:py-16">
          <header className="max-w-3xl space-y-4">
            <Badge variant="outline" className="border-border/70 text-muted-foreground">
              Photo Gallery
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Every photo of Canary Cove
            </h1>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              {GALLERY_PHOTOS.length} photographs of the estate, the suites, the food, and the water: every
              picture used across this site plus the full archive. Search for what you want to see, or tap any
              photo to open it full screen and swipe through.
            </p>
          </header>

          <GalleryBrowser />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
