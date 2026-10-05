"use client"

import { useState, type CSSProperties } from "react"
import Image from "next/image"

import { Parallax } from "@/components/motion/parallax"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { SectionHeading } from "@/components/section-heading"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { imageObjectPosition, type ImageFocal } from "@/lib/images"
import { cn } from "@/lib/utils"

type GalleryImage = {
  src: string
  alt: string
  focal?: ImageFocal
}

export type StayGalleryFeature = {
  image: GalleryImage
  title: string
  detail: string
}

type StayGallerySectionProps = {
  id: string
  eyebrow: string
  /** Wrap words in *asterisks* for the italic accent. */
  title: string
  description: string
  items: StayGalleryFeature[]
}

// Rendered widths at each breakpoint (1320px column, 12-col grid on desktop).
const BIG = "(min-width: 1320px) 810px, (min-width: 1024px) 62vw, 100vw"
const THIRD = "(min-width: 1320px) 390px, (min-width: 1024px) 30vw, 50vw"
const HALF = "(min-width: 1320px) 600px, (min-width: 1024px) 46vw, 50vw"
// Rows that pair a wide and a narrow tile share one fixed height on desktop.
const ROW_H = "lg:aspect-auto lg:h-[clamp(380px,35vw,500px)]"

/**
 * Editorial mosaic slots, in display order. Every row is even: phones pair
 * tiles 2-up after a full-width lead, desktop runs 8+4 / 4+4+4 / 4+8 / 6+6.
 * Tiles render in the same order as the lightbox, so "View photo" N opens
 * photo N.
 */
const SLOTS: { tile: string; frame: string; sizes: string; parallax?: boolean; compact?: boolean }[] = [
  { tile: "col-span-2 lg:col-span-8", frame: `aspect-[16/11] ${ROW_H}`, sizes: BIG, parallax: true },
  { tile: "col-span-1 lg:col-span-4", frame: `aspect-[4/5] ${ROW_H}`, sizes: THIRD, compact: true },
  { tile: "col-span-1 lg:col-span-4", frame: "aspect-[4/5] lg:aspect-square", sizes: THIRD, compact: true },
  { tile: "col-span-1 lg:col-span-4", frame: "aspect-square", sizes: THIRD, compact: true },
  { tile: "col-span-1 lg:col-span-4", frame: "aspect-square", sizes: THIRD, compact: true },
  { tile: "col-span-1 lg:col-span-4", frame: `aspect-[4/5] ${ROW_H}`, sizes: THIRD, compact: true },
  {
    tile: "col-span-1 lg:col-span-8",
    frame: `aspect-[4/5] ${ROW_H}`,
    sizes: "(min-width: 1320px) 810px, (min-width: 1024px) 62vw, 50vw",
    parallax: true,
    compact: true,
  },
  { tile: "col-span-1 lg:col-span-6", frame: "aspect-square lg:aspect-[3/2]", sizes: HALF, compact: true },
  { tile: "col-span-1 lg:col-span-6", frame: "aspect-square lg:aspect-[3/2]", sizes: HALF, compact: true },
]

export function StayGallerySection({ id, eyebrow, title, description, items }: StayGallerySectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const lightboxImages = items.map((item) => ({ src: item.image.src, alt: item.image.alt, caption: item.title }))

  return (
    <div id={id} className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-[var(--gutter)]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} lede={description} className="max-w-2xl" />
        <p
          data-reveal="fade"
          className="tabular hidden shrink-0 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground lg:block"
        >
          {String(items.length).padStart(2, "0")} photographs · tap to enlarge
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:mt-16 sm:gap-x-5 sm:gap-y-14 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
        {items.map((item, index) => {
          const slot = SLOTS[index % SLOTS.length]
          const blurDataURL = cloudinaryBlurDataUrl(item.image.src)
          const image = (
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              className="object-cover"
              style={{ objectPosition: imageObjectPosition(item.image) }}
              sizes={slot.sizes}
              placeholder={blurDataURL ? "blur" : "empty"}
              blurDataURL={blurDataURL}
            />
          )
          return (
            <figure key={item.title} className={cn("group flow flow-sm", slot.tile)}>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`View photo: ${item.image.alt}`}
                className="relative block w-full cursor-zoom-in rounded-[var(--radius-media)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
              >
                <span
                  data-reveal="clip"
                  style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as CSSProperties}
                  className={cn("media-frame zoom-media relative block w-full", slot.frame)}
                >
                  {slot.parallax ? <Parallax amount={5}>{image}</Parallax> : image}
                </span>
              </button>
              <figcaption
                data-reveal="up"
                style={{ "--reveal-delay": `${120 + (index % 3) * 90}ms` } as CSSProperties}
                className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 sm:gap-x-4"
              >
                <span aria-hidden="true" className="tabular pt-[0.35em] text-[11px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flow flow-xs">
                  <h3 className="text-title text-foreground">{item.title}</h3>
                  <p className={cn("max-w-md text-muted-foreground", slot.compact ? "text-[13px] leading-5 sm:text-sm sm:leading-6" : "text-sm leading-6")}>
                    {item.detail}
                  </p>
                </span>
              </figcaption>
            </figure>
          )
        })}
      </div>

      <PhotoLightbox images={lightboxImages} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </div>
  )
}
