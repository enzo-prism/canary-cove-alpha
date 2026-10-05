import { Footer } from "@/components/footer"
import { GalleryBrowser } from "@/components/gallery-browser"
import { GalleryHero } from "@/components/gallery/gallery-hero"
import { Header } from "@/components/header"
import { PageStructuredData } from "@/components/structured-data"
import { GALLERY_PHOTOS } from "@/lib/gallery-photos"
import { ACTIVE_GALLERY_CATEGORIES } from "@/lib/gallery-search"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.gallery

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageStructuredData path="/gallery" />
      <>
        <Header />
        <main tabIndex={-1} id="main-content">
        <GalleryHero total={GALLERY_PHOTOS.length} chapters={ACTIVE_GALLERY_CATEGORIES.length} />
        <GalleryBrowser />
      </main>
        <Footer cta />
      </>
    </div>
  )
}
