"use client"

import { useState, type CSSProperties } from "react"
import Image from "next/image"
import { Expand } from "lucide-react"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { ChapterMark } from "@/components/explore/chapter-mark"
import { ExploreHeading } from "@/components/explore/explore-heading"
import { CLIP_UP } from "@/components/explore/reveal-classes"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { imageObjectPosition, type ImageFocal } from "@/lib/images"
import { cn } from "@/lib/utils"

type ExperienceGalleryItem = {
  src: string
  alt: string
  label: string
  /** Optional override for the tile's grid placement. */
  className?: string
  focal?: ImageFocal
}

type ExperiencesGalleryMosaicProps = {
  items: readonly ExperienceGalleryItem[]
  id?: string
}

// Editorial placements for an 8-photo spread: a dense 2-column collage on
// phones, a 12-column magazine layout from md up.
const LAYOUT = [
  "col-span-2 row-span-2 md:col-span-7 md:row-span-3",
  "row-span-2 md:col-span-5 md:row-span-2",
  "md:col-span-3 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "row-span-2 md:col-span-4 md:row-span-3",
  "md:col-span-3 md:row-span-2",
  "col-span-2 row-span-2 md:col-span-5 md:row-span-2",
  "md:col-span-3 md:row-span-1",
]

const SIZES = [
  "(min-width: 1320px) 760px, (min-width: 768px) 58vw, 100vw",
  "(min-width: 1320px) 540px, (min-width: 768px) 42vw, 50vw",
  "(min-width: 1320px) 330px, (min-width: 768px) 25vw, 50vw",
  "(min-width: 1320px) 220px, (min-width: 768px) 17vw, 50vw",
  "(min-width: 1320px) 440px, (min-width: 768px) 33vw, 50vw",
  "(min-width: 1320px) 330px, (min-width: 768px) 25vw, 50vw",
  "(min-width: 1320px) 540px, (min-width: 768px) 42vw, 100vw",
  "(min-width: 1320px) 330px, (min-width: 768px) 25vw, 50vw",
]

export function ExperiencesGalleryMosaic({ items, id = "activity-gallery" }: ExperiencesGalleryMosaicProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id={id}
      className="flow flow-xl scroll-mt-[calc(var(--site-header-height)+1.5rem)]"
      data-testid="experiences-gallery-mosaic"
    >
      <div className="flow flow-lg">
        <ChapterMark index="04" label="Activity gallery" />
        <ExploreHeading
          title="Moments from the *week*"
          align="split"
          lede="Dock swims, boat days, Belize beyond the estate and long evenings in town. Select any photo to open the viewer."
        />
      </div>

      <div
        data-reveal="group"
        className="grid grid-flow-dense auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 md:auto-rows-[clamp(8.5rem,12vw,11.5rem)] md:grid-cols-12"
      >
        {items.map((item, index) => {
          const blurDataURL = cloudinaryBlurDataUrl(item.src)
          return (
            <figure
              key={item.src}
              className={cn(
                "group @container relative overflow-hidden rounded-[var(--radius-media)] bg-sand-deep",
                CLIP_UP,
                item.className ?? LAYOUT[index % LAYOUT.length],
              )}
              style={{ transitionDelay: `${(index % 8) * 90}ms` } as CSSProperties}
            >
              <div className="zoom-media absolute inset-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={SIZES[index % SIZES.length]}
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(item) }}
                  placeholder={blurDataURL ? "blur" : "empty"}
                  blurDataURL={blurDataURL}
                />
              </div>
              {/* Captions only on tiles wide enough to set them on one or two
                  lines (container query); narrow tiles keep the photo clean and
                  the caption lives in the viewer. */}
              <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(12,36,40,0)_35%,rgba(12,36,40,0.5)_62%,rgba(12,36,40,0.86)_100%)] @[220px]:block" />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-end justify-between gap-3 p-4 @[220px]:flex lg:p-5">
                <span className="flex min-w-0 items-baseline gap-2.5 text-white">
                  <span aria-hidden="true" className="hidden font-display text-base italic text-canary tabular @[300px]:inline">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] font-medium leading-snug [text-shadow:0_1px_12px_rgba(8,26,29,0.6)] md:translate-y-1 md:transition-transform md:duration-700 md:ease-[var(--ease-out-expo)] md:group-hover:translate-y-0">
                    {item.label}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-light/90 text-ink opacity-0 transition-[opacity,transform] duration-500 group-hover:opacity-100 md:flex md:scale-75 md:group-hover:scale-100"
                >
                  <Expand className="h-3.5 w-3.5" />
                </span>
              </figcaption>
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

      <PhotoLightbox
        images={items.map((item) => ({ src: item.src, alt: item.alt, caption: item.label }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  )
}
