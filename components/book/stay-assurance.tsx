import type { CSSProperties } from "react"
import { Droplets, LockKeyhole, ShieldCheck, Wifi, type LucideIcon } from "lucide-react"

import { Container } from "@/components/layout/container"
import { PullQuote } from "@/components/conversion-sections"
import { TESTIMONIAL_SPOTLIGHTS } from "@/lib/testimonial-spotlights"

// The 2024 note already leads /dining; /book features a different verbatim note.
const BOOK_QUOTE = TESTIMONIAL_SPOTLIGHTS.contact[1]

const ASSURANCES: Array<{ icon: LucideIcon; title: string; text: string }> = [
  { icon: Wifi, title: "Power & Wi‑Fi", text: "Backup generator and fiber internet for reliable power and streaming." },
  { icon: ShieldCheck, title: "Security", text: "Walled, well-lit compound with onsite staff and discreet security." },
  { icon: Droplets, title: "Water", text: "Purified water from onsite desalination and filtration." },
  { icon: LockKeyhole, title: "In-room safety", text: "Double locking doors, smoke detectors, and in-room safes." },
]

/**
 * The page's one dark reef band: a returning family's words, then the quiet
 * practicalities (power, water, security) that let a group relax. Carries the
 * `#comfort-confidence` anchor used by site search.
 */
export function StayAssurance() {
  return (
    <section aria-label="Guest perspective and peace of mind" className="surface-reef py-24 sm:py-32">
      <Container size="wide">
        <PullQuote quote={BOOK_QUOTE.quote} author={`${BOOK_QUOTE.author} · ${BOOK_QUOTE.year}`} tone="light" />

        <div
          id="comfort-confidence"
          className="mt-20 [--anchor-extra:24px] border-t border-white/15 pt-12 sm:mt-28"
        >
          <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:gap-16">
            <div className="flow flow-sm">
              <p data-reveal="fade" className="eyebrow">
                Comfort &amp; confidence
              </p>
              <h2 data-reveal="up" className="font-display text-[2.25rem] leading-[1.05] text-white sm:text-[2.75rem]">
                Arrive and switch off.
              </h2>
            </div>
            <ul data-reveal="stagger" className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {ASSURANCES.map((item, index) => (
                <li
                  key={item.title}
                  className="flex gap-4"
                  style={{ "--stagger-index": index } as CSSProperties}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-canary">
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="block">
                    <span className="block text-[15px] font-medium text-white">{item.title}</span>
                    <span className="mt-1 block text-[15px] leading-6 text-white/65">{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
