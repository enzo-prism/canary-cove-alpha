"use client"

import { useState } from "react"
import Image from "next/image"
import { Expand } from "lucide-react"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { CLIP_UP } from "@/components/explore/reveal-classes"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { imageObjectPosition, type ImageFocal } from "@/lib/images"
import { cn } from "@/lib/utils"

type GalleryItem = {
  src: string
  alt: string
  caption?: string
  focal?: ImageFocal
}

type GalleryGridProps = {
  items: GalleryItem[]
  /**
   * grid: even 4:3 tiles (default).
   * editorial: a lead photo at 2×2 with the rest packed around it; rows always
   * close flush, whatever the count.
   */
  layout?: "grid" | "editorial"
  className?: string
}

/**
 * Column spans for the editorial layout: 2 columns on phones, 4 from md.
 * Returned as numbers so the same plan drives both the grid classes and the
 * image `sizes` (a full-width closer must not fetch a quarter-width file).
 */
function editorialPlan(index: number, count: number) {
  // Phones: lead photo full width, then pairs; an odd last photo spans both.
  const singles = count - 1
  const mobile = index === 0 || (singles % 2 === 1 && index === count - 1) ? 2 : 1

  let desktop = 1
  if (index === 0) desktop = 2
  else if (count === 2) desktop = 2
  else if (count === 3) desktop = 2
  else if (count === 4 && index === 3) desktop = 2
  else if (index >= 5) {
    // Beyond the 2×2 block beside the lead photo, fill rows of four.
    const rest = count - 5
    const remainder = rest % 4
    const position = index - 5
    if (position >= rest - remainder) {
      if (remainder === 1) desktop = 4
      else if (remainder === 2) desktop = 2
      else if (remainder === 3 && position === rest - remainder) desktop = 2
    }
  }
  return { mobile, desktop }
}

const MOBILE_SPAN = { 1: "col-span-1", 2: "col-span-2 row-span-2" } as const
const DESKTOP_SPAN = {
  1: "md:col-span-1 md:row-span-1",
  2: "md:col-span-2 md:row-span-1",
  4: "md:col-span-4 md:row-span-1",
} as const

function editorialSpan(index: number, count: number) {
  const plan = editorialPlan(index, count)
  const mobile = index === 0 ? MOBILE_SPAN[2] : plan.mobile === 2 ? "col-span-2" : MOBILE_SPAN[1]
  const desktop =
    index === 0 || (count === 2 && index === 1)
      ? "md:col-span-2 md:row-span-2"
      : DESKTOP_SPAN[plan.desktop as 1 | 2 | 4]
  return cn(mobile, desktop)
}

/**
 * `sizes` for an editorial tile. The grid usually sits beside a 14rem label
 * column inside the 1320px container (~952px wide at desktop), and spans the
 * container width below lg.
 */
function editorialSizes(index: number, count: number) {
  const { mobile, desktop } = editorialPlan(index, count)
  const quarter = { lg: 238, lgVw: 18, md: 23 }
  return [
    `(min-width: 1320px) ${desktop * quarter.lg}px`,
    `(min-width: 1024px) ${desktop * quarter.lgVw}vw`,
    `(min-width: 768px) ${desktop * quarter.md}vw`,
    `${mobile * 46}vw`,
  ].join(", ")
}

export function GalleryGrid({ items, layout = "grid", className }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const editorial = layout === "editorial"

  return (
    <>
      <div
        data-reveal="group"
        className={cn(
          editorial
            ? "grid grid-flow-dense auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 md:grid-cols-4 lg:auto-rows-[13.5rem]"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className,
        )}
      >
        {items.map((item, index) => {
          const blurDataURL = cloudinaryBlurDataUrl(item.src)
          return (
            <figure
              key={item.src}
              className={cn(
                "group @container relative overflow-hidden rounded-[var(--radius-media)] bg-sand-deep",
                CLIP_UP,
                editorial ? editorialSpan(index, items.length) : "aspect-[4/3]",
              )}
              style={{ transitionDelay: `${Math.min(index, 8) * 80}ms` }}
            >
              <div className="zoom-media absolute inset-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={
                    editorial
                      ? editorialSizes(index, items.length)
                      : "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(item) }}
                  loading="lazy"
                  placeholder={blurDataURL ? "blur" : "empty"}
                  blurDataURL={blurDataURL}
                />
              </div>
              {item.caption ? (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,36,40,0)_40%,rgba(12,36,40,0.5)_65%,rgba(12,36,40,0.85)_100%)]" />
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                    <span className="text-sm font-medium leading-snug text-white [text-shadow:0_1px_12px_rgba(8,26,29,0.6)]">
                      {item.caption}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-light/90 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:flex"
                    >
                      <Expand className="h-3.5 w-3.5" />
                    </span>
                  </figcaption>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`View photo: ${item.alt}`}
                className="absolute inset-0 cursor-zoom-in rounded-[var(--radius-media)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-canary"
              />
            </figure>
          )
        })}
      </div>
      <PhotoLightbox images={items} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
