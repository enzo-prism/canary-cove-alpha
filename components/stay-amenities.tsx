"use client"

import { useState } from "react"
import Image from "next/image"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
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

const servicePhotos = [IMAGES.chefMarvinPlates, IMAGES.logoDrink, IMAGES.diningFoodDetail, IMAGES.diningSpread]

function LedgerRows({ rows }: { rows: LedgerRow[] }) {
  return (
    <dl className="border-t border-border/60">
      {rows.map((row) => (
        <div
          key={row.lead}
          className="grid gap-1 border-b border-border/60 py-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6"
        >
          <dt className="text-[0.95rem] font-semibold text-foreground">{row.lead}</dt>
          <dd className="text-[0.95rem] leading-7 text-foreground/75">{row.text}</dd>
        </div>
      ))}
    </dl>
  )
}

function ServiceStrip() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flow flow-sm">
      <div className="flow-xs">
        <h3 className="text-lg font-semibold text-foreground">From the kitchen</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Frames from the service side of the stay — select any photo to open the viewer.
        </p>
      </div>
      <div className="-mx-6 overflow-x-auto px-6 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
        <div className="flex w-max gap-3">
          {servicePhotos.map((photo, index) => {
            const blurDataURL = cloudinaryBlurDataUrl(photo.src)
            return (
              <button
                key={photo.src}
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`View photo: ${photo.alt}`}
                className="relative aspect-[4/3] w-60 shrink-0 cursor-zoom-in snap-start overflow-hidden rounded-[20px] border border-border/55 bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-72"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(photo) }}
                  sizes="(min-width: 640px) 288px, 240px"
                  placeholder={blurDataURL ? "blur" : "empty"}
                  blurDataURL={blurDataURL}
                />
              </button>
            )
          })}
        </div>
      </div>
      <PhotoLightbox
        images={servicePhotos.map((photo) => ({ src: photo.src, alt: photo.alt, caption: photo.alt }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  )
}

export function StayAmenities() {
  return (
    <div id="amenities" className="scroll-mt-24 flow flow-lg">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div className="flow flow-md lg:sticky lg:top-28 lg:self-start">
          <div className="flow flow-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Included with your stay
            </p>
            <h2 className="text-section max-w-md text-[2rem] text-foreground sm:text-[2.5rem]">
              Arrive to everything handled.
            </h2>
          </div>
          <figure className="flow-xs">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
              <Image
                src={IMAGES.chefMarvinKitchen.src}
                alt={IMAGES.chefMarvinKitchen.alt}
                fill
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(IMAGES.chefMarvinKitchen) }}
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
            <figcaption className="text-[0.82rem] leading-6 text-muted-foreground">
              Chef Marvin at the villa range — lunches and dinners are cooked to your group&apos;s preferences.
            </figcaption>
          </figure>
        </div>

        <div className="flow flow-md lg:pt-2">
          <div className="flow flow-sm">
            <div className="flow-xs">
              <h3 className="text-xl font-semibold text-foreground">Arrival, meals, daily support</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Arrival, meals, and daily support are already folded into the rhythm of the estate.
              </p>
            </div>
            <LedgerRows rows={arrivalRows} />
          </div>

          <div className="flow flow-sm">
            <div className="flow-xs">
              <h3 className="text-xl font-semibold text-foreground">Pool, docks, grounds</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Pool days, dock departures, and easy evenings outdoors are all built into the property itself.
              </p>
            </div>
            <LedgerRows rows={outdoorRows} />
          </div>

          <div className="flow flow-sm">
            <h3 className="text-xl font-semibold text-foreground">Comfort, rooms, extras</h3>
            <div className="grid gap-6">
              {comfortGroups.map((group) => (
                <div key={group.label} className="flow flow-xs">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    {group.label}
                  </p>
                  <ul className="grid gap-2.5 border-t border-border/60 pt-4 text-[0.95rem] leading-7 text-foreground/78">
                    {group.items.map((item) => (
                      <li key={item} className="border-b border-border/60 pb-2.5 last:border-b-0 last:pb-0">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <ServiceStrip />

          <p className="max-w-2xl text-[0.98rem] leading-8 text-foreground/82">
            An all-inclusive stay with private chef service and on-site staff means less logistics and more time in the
            water, by the pool, or around the table with your group.
          </p>
        </div>
      </div>
    </div>
  )
}
