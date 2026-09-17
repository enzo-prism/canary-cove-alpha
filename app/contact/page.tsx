import Link from "next/link"

import { ArrowRight } from "lucide-react"

import { ContactDetails } from "@/components/contact-details"
import { ContactForm } from "@/components/contact-form"
import { PageShell } from "@/components/layout/page-shell"
import { ProcessStrip, PullQuote } from "@/components/conversion-sections"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.contact

const CONTACT_QUOTE = TESTIMONIAL_SPOTLIGHTS.contact[0]

export default function Page() {
  return (
    <PageShell path="/contact">
      {/* 1. Paper hero — lower the bar vs. booking. */}
      <section className="border-t-2 border-[#0B1F24] px-4 pb-2 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-[760px] space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8A6420]">
            We reply within one business day
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            Ask us anything.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Dates, boats, chefs, logistics — a person reads every note and points you to the fastest next step.
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-row sm:gap-3">
            <a
              href="#contact-form"
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-[#0B1F24] px-6 text-[15px] font-semibold text-white motion-safe:transition-colors motion-safe:duration-200 hover:bg-[#0B1F24]/85"
            >
              Ask a question
            </a>
            <Link
              href="/book"
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-6 text-[15px] font-semibold text-foreground hover:border-[#B98A2F]"
            >
              Ready to book
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Letter + humans — form dominant, people subordinate and sticky. */}
      <section
        id="contact-form"
        aria-label="Contact form"
        className="scroll-mt-[calc(var(--site-header-height)+16px)] px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.08fr)_360px] lg:gap-10">
          <div className="min-w-0">
            <ContactForm />
          </div>
          <aside className="min-w-0 lg:sticky lg:top-[calc(var(--site-header-height)+24px)] lg:self-start">
            <ContactDetails />
          </aside>
        </div>
      </section>

      {/* 3. What happens next. */}
      <section aria-label="What happens next" className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <h2 className="text-balance text-[28px] font-semibold tracking-tight text-foreground sm:text-[34px]">
            What happens next
          </h2>
          <ProcessStrip
            steps={[
              { title: "You write", text: "Two short steps, under a minute." },
              { title: "We reply", text: "Gil or Consi, within one business day." },
              { title: "You move fast", text: "Stays graduate to a booking request." },
            ]}
          />
          <p className="text-sm text-muted-foreground">
            Tip: check spam for anything from Canary Cove and add us to your contacts so the reply lands.
          </p>
        </div>
      </section>

      {/* 4. One human voice. */}
      <section aria-label="Guest quote" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-6xl border-t border-border/60 pt-12 sm:pt-14">
          <PullQuote quote={CONTACT_QUOTE.quote} author={CONTACT_QUOTE.author} align="left" className="max-w-[640px]" />
        </div>
      </section>
    </PageShell>
  )
}
