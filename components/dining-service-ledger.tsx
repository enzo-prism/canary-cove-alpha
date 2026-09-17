"use client"

import { useState } from "react"
import Image from "next/image"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { IMAGES, imageObjectPosition } from "@/lib/images"

const SERVICE_ROWS = [
  {
    title: "Chef-led lunches and dinners",
    detail:
      "A private chef cooks lunch and dinner in the villa kitchen, tuned to what the group actually wants that day.",
    image: IMAGES.chefMarvinPlates,
  },
  {
    title: "Groceries at cost",
    detail: "The team provisions everything before you arrive and passes groceries through with no markup.",
    image: IMAGES.diningPlatter,
  },
  {
    title: "Dine where the day lands",
    detail: "Long villa table, dock at sunset, or barefoot on the sand — the setting follows the mood.",
    image: IMAGES.romanticViews,
  },
  {
    title: "Sundowners by the pool",
    detail: "Cold drinks and rum punch without leaving the water.",
    image: IMAGES.logoDrink,
  },
  {
    title: "Beach picnics & boat days",
    detail: "Packed coolers, chips and drinks for sandbar afternoons and full days off the dock.",
    image: IMAGES.chipsAndDrinks,
  },
] as const

export function DiningServiceLedger() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      <ol className="border-t border-border/60">
        {SERVICE_ROWS.map((row, index) => (
          <li key={row.title} className="flex items-center gap-5 border-b border-border/60 py-5 sm:gap-7 sm:py-6">
            <span aria-hidden="true" className="w-8 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View photo: ${row.image.alt}`}
              className="relative aspect-[4/3] w-28 shrink-0 cursor-zoom-in overflow-hidden rounded-[20px] border border-border/55 bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-36"
            >
              <Image
                src={row.image.src}
                alt={row.image.alt}
                fill
                className="object-cover"
                style={{ objectPosition: imageObjectPosition(row.image) }}
                sizes="144px"
              />
            </button>
            <span className="flow-xs">
              <span className="block text-lg font-semibold text-foreground">{row.title}</span>
              <span className="block max-w-2xl text-[0.95rem] leading-7 text-foreground/75">{row.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <PhotoLightbox
        images={SERVICE_ROWS.map((row) => ({ src: row.image.src, alt: row.image.alt, caption: row.title }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  )
}
