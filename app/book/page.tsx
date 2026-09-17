import Image from "next/image"
import Link from "next/link"

import { ArrowDown, ArrowRight, Phone } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { BookingForm } from "@/components/booking-form"
import { BookingPolicies } from "@/components/booking-policies"
import { PhotoCarousel } from "@/components/photo-carousel"
import { ProcessStrip, PullQuote, RailCard } from "@/components/conversion-sections"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { IMAGES } from "@/lib/images"
import { PageStructuredData } from "@/components/structured-data"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.book

type BookPageProps = {
  searchParams: Promise<{ accommodation?: string; returning?: string }>
}

const BOOK_QUOTE = TESTIMONIAL_SPOTLIGHTS.book[0]

export default async function Page({ searchParams }: BookPageProps) {
  const params = await searchParams
  const defaultAccommodation = params.accommodation === "main-house" ? "main-house" : undefined
  const defaultReturningGuest = params.returning === "yes" ? "yes" : undefined

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <PageStructuredData path="/book" />
      <Header />

      {/* 1. Ink hero — the promise, not the form. */}
      <section className="px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#0B1F24] text-white">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-10 lg:p-12">
            <div className="space-y-6 lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#D9B36A]">
                Private estate · One group at a time
              </p>
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                Tell us your dates. We&rsquo;ll take it from there.
              </h1>
              <p className="max-w-md text-base leading-7 text-white/75 sm:text-lg">
                Share your window and the shape of the trip. A person confirms availability and sends a tailored
                quote — usually within one business day.
              </p>
              <ul className="space-y-2.5 text-[15px] font-medium text-white/85">
                {["50% deposit secures your dates", "Flexible-date help, free", "Travel insurance advised"].map(
                  (tick) => (
                    <li key={tick} className="flex items-center gap-3">
                      <span aria-hidden className="h-px w-5 shrink-0 bg-[#B98A2F]" />
                      {tick}
                    </li>
                  ),
                )}
              </ul>
              <div>
                <a
                  href="#booking-form"
                  className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#0B1F24] motion-safe:transition-colors motion-safe:duration-200 hover:bg-white/90"
                >
                  Start your request
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[16/9] lg:aspect-auto lg:min-h-[420px]">
                <Image
                  src={IMAGES.heroBackgroundEstate.src}
                  alt={IMAGES.heroBackgroundEstate.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-sm text-white/60">The villa and pool terrace, steps from the water.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Request desk — short sticky rail, scrolling form. */}
      <section
        id="booking-form"
        aria-label="Booking request form"
        className="scroll-mt-[calc(var(--site-header-height)+16px)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-[calc(var(--site-header-height)+24px)] lg:self-start">
            <RailCard title="How this works">
              <ProcessStrip
                compact
                className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-1"
                steps={[
                  { title: "You share dates", text: "Five short steps, about two minutes." },
                  { title: "We confirm + quote", text: "Availability and pricing, personally." },
                  { title: "50% secures", text: "Your hold becomes a reservation." },
                ]}
              />
            </RailCard>
            <RailCard title="Main House?">
              <p className="text-sm leading-6 text-foreground/85">
                The full 5-suite Main House is reserved for returning guests and carries a separate $10,000 damage
                deposit.
              </p>
              <Link
                href="/rates#main-house-accommodations"
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-foreground underline decoration-[#B98A2F] decoration-2 underline-offset-4 hover:decoration-foreground"
              >
                Main House rates
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </RailCard>
            <RailCard title="Prefer to talk?">
              <a
                href="tel:+5016105121"
                className="focus-ring inline-flex min-h-12 items-center gap-2.5 rounded-2xl border border-border/70 bg-background/80 px-4 text-[15px] font-semibold text-foreground hover:border-[#B98A2F]"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Gil · 610-5121
              </a>
              <p className="text-[13px] leading-5 text-muted-foreground">8am–5pm Belize time (UTC−6).</p>
            </RailCard>
          </aside>
          <div className="min-w-0">
            <BookingForm
              defaultAccommodation={defaultAccommodation}
              defaultReturningGuest={defaultReturningGuest}
            />
          </div>
        </div>
      </section>

      {/* 3. Policies — kept whole for the #cancellation-policy contract. */}
      <section aria-label="Payment and policies" className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-3xl">
          <BookingPolicies />
        </div>
      </section>

      {/* 4. One voice. */}
      <section aria-label="Guest quote" className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <PullQuote quote={BOOK_QUOTE.quote} author={`${BOOK_QUOTE.author} · ${BOOK_QUOTE.year}`} />
      </section>

      {/* 5. Gallery — kept swipeable for the carousel contract. */}
      <PhotoCarousel />

      {/* 6. Quiet cross-links. */}
      <nav aria-label="Keep exploring" className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
          <p className="text-lg font-semibold text-foreground">Still exploring?</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[15px] font-medium">
            <li>
              <Link href="/stay" className="focus-ring rounded-lg text-foreground/80 underline decoration-[#B98A2F] decoration-2 underline-offset-4 hover:text-foreground">
                Villa &amp; spaces
              </Link>
            </li>
            <li>
              <Link href="/experiences" className="focus-ring rounded-lg text-foreground/80 underline decoration-[#B98A2F] decoration-2 underline-offset-4 hover:text-foreground">
                Experiences
              </Link>
            </li>
            <li>
              <Link href="/getting-here" className="focus-ring rounded-lg text-foreground/80 underline decoration-[#B98A2F] decoration-2 underline-offset-4 hover:text-foreground">
                Getting here
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Footer />
    </main>
  )
}
