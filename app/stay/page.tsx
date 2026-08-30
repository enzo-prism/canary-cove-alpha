import { StayClosingCta } from "@/components/stay-closing-cta"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { StayAmenities } from "@/components/stay-amenities"
import { StayGuestExperience } from "@/components/stay-guest-experience"
import { StayHighlights } from "@/components/stay-highlights"
import { StayMiniGallery } from "@/components/stay-mini-gallery"
import { StayOutdoorGallery } from "@/components/stay-outdoor-gallery"
import { StayVillaGallery } from "@/components/stay-villa-gallery"
import { TrackedLink } from "@/components/analytics/tracked-link"
import { PageStructuredData } from "@/components/structured-data"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.stay

export default function Page() {
  return (
    <main id="main-content" className="page-wash min-h-screen">
      <PageStructuredData path="/stay" />
      <Header />
      <section className="border-b border-border/40 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <div className="flow flow-lg">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">
                Private estate on Ambergris Caye reserved exclusively for your group
              </p>
            </div>
            <StayMiniGallery />
            <div className="mx-auto max-w-3xl text-center flow flow-sm">
              <h1 className="text-display text-foreground">Stay at Canary Cove</h1>
              <p className="text-body text-balance">
                One private estate with beach, docks, pool, suites, and open-air living reserved entirely for your group on
                Ambergris Caye.
              </p>
              <TrackedLink
                href="/stay/main-house"
                eventName="cta_click"
                eventPayload={{ location: "stay_hero", target: "/stay/main-house" }}
                className="mx-auto flex max-w-xl flex-col gap-1 rounded-[24px] border border-border/60 bg-white/90 px-5 py-4 text-left shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-colors hover:border-border hover:bg-white"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">Returning guests</p>
                <p className="text-base font-semibold text-foreground">Main House · 5 suites</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  The full estate as one home base, from $2,500 a night in low season. A separate $10,000 damage deposit
                  applies.
                </p>
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <StayHighlights />
        </div>
      </section>

      <section className="border-y border-border/30 bg-surface-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <StayAmenities />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <StayGuestExperience testimonials={TESTIMONIAL_SPOTLIGHTS.stay} />
        </div>
      </section>

      <section className="border-t border-border/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <StayVillaGallery />
        </div>
      </section>

      <section className="border-t border-border/30 bg-surface-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <StayOutdoorGallery />
        </div>
      </section>

      <section className="px-4 pb-16 pt-6 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl xl:max-w-7xl">
          <StayClosingCta />
        </div>
      </section>
      <Footer />
    </main>
  )
}
