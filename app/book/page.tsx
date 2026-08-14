import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { BookingForm } from "@/components/booking-form"
import { BookingPolicies } from "@/components/booking-policies"
import { PhotoCarousel } from "@/components/photo-carousel"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { PageStructuredData } from "@/components/structured-data"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.book

type BookPageProps = {
  searchParams: Promise<{ accommodation?: string; returning?: string }>
}

export default async function Page({ searchParams }: BookPageProps) {
  const params = await searchParams
  const defaultAccommodation = params.accommodation === "main-house" ? "main-house" : undefined
  const defaultReturningGuest = params.returning === "yes" ? "yes" : undefined

  return (
    <main id="main-content" className="min-h-screen">
      <PageStructuredData path="/book" />
      <Header />
      <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-28 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/80 via-white to-surface-muted/60" />
        <div className="absolute left-[12%] top-[18%] -z-10 h-64 w-64 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[8%] bottom-[18%] -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[140px]" />

        <div className="mx-auto flex max-w-6xl xl:max-w-7xl flex-col gap-10">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)]">
            <div className="order-2 space-y-6 lg:order-1">
              <div className="surface-panel px-6 py-6 sm:px-8 sm:py-8">
                <Badge
                  variant="outline"
                  className="w-fit border-border/70 text-xs uppercase tracking-[0.3em] text-muted-foreground"
                >
                  Request a stay
                </Badge>
                <div className="mt-5 space-y-4">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Check availability & book</h1>
                  <p className="text-lg text-muted-foreground sm:text-xl">
                    Share your preferred dates and any celebrations. Our team will confirm availability and send a tailored
                    quote.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="surface-inset px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Private booking</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">Only one group on property at a time</p>
                  </div>
                  <div className="surface-inset px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Tailored quote</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">We confirm details personally</p>
                  </div>
                </div>
              </div>
            </div>

            <BookingForm
              className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start"
              defaultAccommodation={defaultAccommodation}
              defaultReturningGuest={defaultReturningGuest}
            />

            <div className="order-3 space-y-6 lg:col-span-2">
              <BookingPolicies />
              <Card
                id="comfort-confidence"
                className="surface-panel scroll-mt-24"
              >
                <CardHeader className="px-5 pb-3 pt-5">
                  <Badge
                    variant="outline"
                    className="w-fit border-border/70 text-xs uppercase tracking-[0.28em] text-muted-foreground"
                  >
                    Comfort &amp; confidence
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 px-5 pb-5 pt-0 text-sm text-muted-foreground">
                  <p>
                    Canary Cove is designed for ease and peace of mind, with modern infrastructure and attentive staff on site.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="surface-inset px-4 py-4 text-sm text-foreground">
                      Central air conditioning, non-smoking property, indoor/outdoor dining.
                    </div>
                    <div className="surface-inset px-4 py-4 text-sm text-foreground">
                      Walled, well-lit compound with onsite staff and discreet security.
                    </div>
                    <div className="surface-inset px-4 py-4 text-sm text-foreground">
                      Purified water from onsite desalination and filtration.
                    </div>
                    <div className="surface-inset px-4 py-4 text-sm text-foreground">
                      Backup generator and fiber internet for reliable power and streaming.
                    </div>
                    <div className="surface-inset px-4 py-4 text-sm text-foreground">
                      Double locking doors, smoke detectors, and in-room safes.
                    </div>
                    <div className="surface-inset px-4 py-4 text-sm text-foreground">
                      Private helipad access from Belize&apos;s international airport by request.
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">Why guests return</h2>
                <TestimonialsGrid testimonials={TESTIMONIAL_SPOTLIGHTS.book} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <PhotoCarousel />
      <Footer />
    </main>
  )
}
