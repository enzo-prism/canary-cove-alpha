import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { CountUp } from "@/components/motion/count-up"
import { SplitText } from "@/components/motion/split-text"

/**
 * Main House for returning guests: the page's one dark reef band. The whole
 * panel is a single link (its accessible name carries "Main House · 5 suites"
 * and "Returning guests"); keep underline utilities off its class list.
 */
export function StayMainHouse() {
  return (
    <section
      id="main-house-stay"
      className="surface-reef relative overflow-clip py-24 text-white sm:py-32 lg:py-40"
    >
      <div aria-hidden="true" className="caustics pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-12 px-[var(--gutter)] sm:gap-16">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
          <div className="flow flow-md text-white">
            <p data-reveal="fade" className="eyebrow">
              For returning groups
            </p>
            <SplitText as="h2" text="Come back for the *full estate.*" className="text-section max-w-[16ch]" />
          </div>
          <p
            data-reveal="up"
            style={{ "--reveal-delay": "160ms" } as CSSProperties}
            className="text-lede max-w-xl"
          >
            Groups who have stayed with us before can book the Main House instead of the villa.
          </p>
        </div>

        <div data-reveal="up" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
          <TrackedLink
            href="/stay/main-house"
            eventName="cta_click"
            eventPayload={{ location: "stay_hero", target: "/stay/main-house" }}
            className="group relative grid gap-10 overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm transition-[border-color,background-color] duration-700 ease-[var(--ease-out-expo)] hover:border-white/35 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canary focus-visible:ring-offset-4 focus-visible:ring-offset-reef sm:p-10 lg:grid-cols-12 lg:gap-16 lg:p-14"
          >
            <span className="flex flex-col gap-6 lg:col-span-7">
              <span className="eyebrow text-white/70">Main House · Returning guests</span>
              <span className="font-display block text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.95] tracking-[-0.02em] text-white">
                Main House · 5 suites
              </span>
              <span className="block max-w-xl text-[17px] leading-8 text-white/75">
                The full estate as one home base, from $2,500 a night in low season. A separate $10,000 damage deposit
                applies.
              </span>
            </span>

            <span className="flex flex-col justify-between gap-10 lg:col-span-5">
              <span className="grid grid-cols-3 border-t border-white/15 lg:grid-cols-1">
                <span className="flex flex-col gap-2 border-white/15 py-5 pr-3 lg:flex-row lg:items-baseline lg:justify-between lg:border-b lg:pr-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Suites</span>
                  <CountUp value={5} className="font-display text-3xl leading-none text-white sm:text-4xl" />
                </span>
                <span className="flex flex-col gap-2 border-l border-white/15 py-5 pl-4 pr-3 lg:flex-row lg:items-baseline lg:justify-between lg:border-b lg:border-l-0 lg:pl-0 lg:pr-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">From</span>
                  <CountUp value={2500} prefix="$" className="font-display text-3xl leading-none text-white sm:text-4xl" />
                </span>
                <span className="flex flex-col gap-2 border-l border-white/15 py-5 pl-4 lg:flex-row lg:items-baseline lg:justify-between lg:border-b lg:border-l-0 lg:pl-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">Deposit</span>
                  <CountUp value={10000} prefix="$" className="font-display text-3xl leading-none text-white sm:text-4xl" />
                </span>
              </span>

              <span className="inline-flex h-14 w-fit items-center gap-3 rounded-full bg-canary pl-7 pr-2 text-[15px] font-medium text-ink transition-colors duration-500 group-hover:bg-sand-light">
                <span className="roll">
                  <span>Tour the Main House</span>
                  <span aria-hidden="true">Tour the Main House</span>
                </span>
                <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-ink/10">
                  <ArrowUpRight className="arrow-nudge arrow-nudge-diag size-4" />
                </span>
              </span>
            </span>
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
