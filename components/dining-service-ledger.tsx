"use client"

import { useState } from "react"
import Image from "next/image"
import { Expand } from "lucide-react"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { CLIP_UP, DRAW_X, RISE } from "@/components/explore/reveal-classes"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { cn } from "@/lib/utils"

const SERVICE_ROWS = [
  {
    // Redirect target: /dining/private-chef → /dining#private-chef
    id: "private-chef",
    title: "Chef-led lunches and dinners",
    detail:
      "A private chef cooks lunch and dinner in the villa kitchen, tuned to what the group actually wants that day.",
    // Chef Marvin already appears twice on /dining (hero + "How dining works").
    image: IMAGES.dinnerPlated,
  },
  {
    // Redirect target: /dining/provisioning → /dining#provisioning
    id: "provisioning",
    title: "Groceries at cost",
    detail: "The team provisions everything before you arrive and passes groceries through with no markup.",
    image: IMAGES.diningPlatter,
  },
  {
    id: undefined,
    title: "Served, then cleared",
    detail: "Chef-prepared lunches and dinners served daily, with cleanup handled by staff.",
    image: IMAGES.villaInteriorWide,
  },
  {
    id: undefined,
    title: "Beach picnics & boat days",
    detail: "Packed coolers, chips and drinks for sandbar afternoons and full days off the dock.",
    image: IMAGES.chipsAndDrinks,
  },
] as const

/**
 * "How dining works" as a numbered editorial ledger. Each row's thumbnail
 * opens the shared photo viewer; hairlines draw in and copy rises as rows
 * scroll into view.
 */
export function DiningServiceLedger() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <ol>
        {SERVICE_ROWS.map((row, index) => (
          <li
            key={row.title}
            id={row.id}
            data-reveal="group"
            className="group relative grid scroll-mt-[calc(var(--site-header-height)+1.5rem)] grid-cols-[minmax(0,1fr)_5.5rem] items-start gap-x-5 gap-y-3 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)_10rem] sm:items-center sm:gap-x-7 sm:py-9"
          >
            <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-px bg-border", DRAW_X)} />
            <span
              aria-hidden="true"
              className={cn(
                "col-span-2 font-display text-2xl italic leading-none text-lagoon tabular sm:col-span-1 sm:text-3xl",
                RISE,
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={cn("flow flow-xs", RISE)} style={{ transitionDelay: "100ms" }}>
              <h3 className="font-display text-[1.6rem] leading-[1.1] text-foreground sm:text-[2rem]">{row.title}</h3>
              <p className="text-body max-w-md">{row.detail}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View photo: ${row.image.alt}`}
              className={cn(
                "group/thumb relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-sand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canary sm:aspect-[4/3]",
                CLIP_UP,
              )}
              style={{ transitionDelay: "180ms" }}
            >
              <span className="zoom-media absolute inset-0">
                <Image
                  src={row.image.src}
                  alt={row.image.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(row.image) }}
                  sizes="(min-width: 640px) 160px, 88px"
                />
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-2 right-2 hidden h-7 w-7 items-center justify-center rounded-full bg-sand-light/90 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:flex"
              >
                <Expand className="h-3 w-3" />
              </span>
            </button>
          </li>
        ))}
      </ol>
      <span aria-hidden="true" className="block h-px bg-border" />
      <PhotoLightbox
        images={SERVICE_ROWS.map((row) => ({ src: row.image.src, alt: row.image.alt, caption: row.title }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  )
}
