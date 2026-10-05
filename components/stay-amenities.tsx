import type { CSSProperties } from "react"
import Image from "next/image"

import { Parallax } from "@/components/motion/parallax"
import { SectionHeading } from "@/components/section-heading"
import { ServiceStrip } from "@/components/stay/service-strip"
import { IMAGES, imageObjectPosition } from "@/lib/images"

type LedgerRow = {
  lead: string
  text: string
}

const arrivalRows: LedgerRow[] = [
  { lead: "Airport pickup", text: "Complimentary airport pickup and dock transfer between San Pedro and Canary Cove." },
  { lead: "Chef-led meals", text: "Chef-prepared lunches and dinners served daily, with cleanup handled by staff." },
  { lead: "Stocked kitchen", text: "Kitchen stocked before arrival for self-serve breakfasts and snacks." },
  { lead: "Daily staff", text: "Complete staff onsite daily to support the stay on property and beyond." },
  { lead: "Cooling", text: "Central air conditioning with adjustable room thermostats and ceiling fans." },
  { lead: "Housekeeping", text: "Daily housekeeping with laundry service available." },
]

const outdoorRows: LedgerRow[] = [
  { lead: "Pool and hot tub", text: "Passive solar-heated infinity pool with swim-up bar and hot tub." },
  { lead: "Pool lounge", text: "Pool lounge setup with TV, speakers, and gas grill." },
  {
    lead: "Water toys",
    text: "Water toys and reef-day equipment including snorkeling gear, paddleboards, and slide platform.",
  },
  { lead: "Dock and boat", text: "Private dock with boat and driver for reef snorkeling; you only pay for gas." },
  { lead: "Outdoor shower", text: "Outdoor freshwater shower and shaded places to settle in all day." },
  { lead: "Games and gardens", text: "Beach bikes, volleyball, horseshoes, cornhole, and private gardens." },
]

const comfortGroups = [
  {
    label: "Comfort and confidence",
    items: [
      "Fiber internet and backup generator for reliable power, cooling, and streaming.",
      "Walled, well-lit compound with staff living onsite and access to emergency services.",
      "Purified water across the estate from onsite desalination and filtration.",
    ],
  },
  {
    label: "In-room amenities",
    items: [
      "Coffee, tea, and espresso setup plus wine chiller.",
      "Blackout curtains, bedside outlets, robes, and in-room safe.",
      "Premium toiletries, double vanities, and hairdryers in every bath.",
    ],
  },
  {
    label: "Extras on request",
    items: [
      "Spa services, childcare, and provisions planned around your group.",
      "SCUBA, fishing, tubing, and private excursions arranged in advance.",
      "Helipad access and destination events coordinated by request.",
    ],
  },
]

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties

function ChapterHeading({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <div className="flow flow-xs" data-reveal="up">
      <div className="flex items-baseline gap-4">
        <span aria-hidden="true" className="italic-accent text-2xl leading-none text-lagoon">
          {index}
        </span>
        <h3 className="text-title text-foreground">{title}</h3>
      </div>
      {note ? <p className="text-body max-w-lg sm:pl-[3.1rem]">{note}</p> : null}
    </div>
  )
}

function LedgerRows({ rows }: { rows: LedgerRow[] }) {
  return (
    <dl data-reveal="stagger" style={{ "--stagger-step": "70ms" } as CSSProperties} className="border-t border-ink/15">
      {rows.map((row, index) => (
        <div
          key={row.lead}
          style={{ "--stagger-index": index } as CSSProperties}
          className="group/row relative grid gap-1 border-b border-ink/15 py-4 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] sm:gap-8 sm:py-5"
        >
          <dt className="flex items-center gap-3 text-[15px] font-medium text-foreground">
            <span
              aria-hidden="true"
              className="block size-1.5 shrink-0 rounded-full bg-canary-deep transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/row:scale-[1.8]"
            />
            {row.lead}
          </dt>
          <dd className="pl-[1.125rem] text-[15px] leading-7 text-muted-foreground sm:pl-0">{row.text}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * "Included with your stay": an editorial ledger beside a sticky chef
 * portrait, the in-room/extras columns, the kitchen strip, and a scroll-lit
 * statement to close.
 */
export function StayAmenities() {
  return (
    <div id="amenities" className="flex flex-col gap-20 sm:gap-28">
      <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)]">
        <SectionHeading
          align="split"
          eyebrow="Included with your stay"
          title="Arrive to *everything* handled."
          lede="Arrival, meals, and daily support are already folded into the rhythm of the estate — pool days, dock departures, and easy evenings outdoors are built into the property itself."
        />

        <div className="mt-14 grid gap-14 sm:mt-20 lg:grid-cols-12 lg:gap-16">
          <figure className="flow flow-sm lg:sticky lg:top-[calc(var(--site-header-height)+2rem)] lg:col-span-5 lg:self-start">
            <div data-reveal="clip" className="media-frame relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
              <Parallax amount={6}>
                <Image
                  src={IMAGES.chefMarvinKitchen.src}
                  alt={IMAGES.chefMarvinKitchen.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinKitchen) }}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </Parallax>
            </div>
            <figcaption className="text-[13px] leading-6 text-muted-foreground" data-reveal="fade" style={delay(300)}>
              Chef Marvin at the villa range — lunches and dinners are cooked to your group&apos;s preferences.
            </figcaption>
          </figure>

          <div className="flex flex-col gap-16 sm:gap-20 lg:col-span-7">
            <div className="flow flow-lg">
              <ChapterHeading index="01" title="Arrival, meals, daily support" />
              <LedgerRows rows={arrivalRows} />
            </div>

            <div className="flow flow-lg">
              <ChapterHeading index="02" title="Pool, docks, grounds" />
              <LedgerRows rows={outdoorRows} />
            </div>

            <div className="flow flow-lg">
              <ChapterHeading index="03" title="Comfort, rooms, extras" />
              <div className="grid gap-10 border-t border-ink/15 pt-8 sm:grid-cols-3 sm:gap-8">
                {comfortGroups.map((group, groupIndex) => (
                  <div key={group.label} className="flow flow-sm" data-reveal="up" style={delay(groupIndex * 110)}>
                    <p className="eyebrow eyebrow-plain text-foreground">{group.label}</p>
                    <ul className="flow flow-sm text-[15px] leading-6 text-muted-foreground">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ServiceStrip />

      <div className="mx-auto w-full max-w-[1100px] px-[var(--gutter)]">
        <p
          data-reveal="up"
          className="font-display text-balance text-center text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.08] text-foreground"
        >
          An all-inclusive stay with private chef service and on-site staff means less logistics and{" "}
          <em className="italic-accent">more time</em> in the water, by the pool, or around the table with your group.
        </p>
      </div>
    </div>
  )
}
