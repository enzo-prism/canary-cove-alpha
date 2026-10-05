"use client"

import { useState, type CSSProperties } from "react"
import Image from "next/image"
import { Expand } from "lucide-react"

import { Parallax } from "@/components/motion/parallax"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { imageObjectPosition, type ImageFocal } from "@/lib/images"
import { cn } from "@/lib/utils"

type Snapshot = {
  src: string
  alt: string
  caption: string
  focal?: ImageFocal
}

/** Two offset arrival photos that wipe in, drift on scroll and open the lightbox. */
export function ArrivalSnapshots({ items }: { items: Snapshot[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {items.map((item, index) => (
          <figure
            key={item.src}
            className={cn("flow flow-xs", index % 2 === 1 && "pt-12 sm:pt-20")}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View photo: ${item.alt}`}
              data-reveal="clip"
              style={{ "--reveal-delay": `${index * 140}ms` } as CSSProperties}
              className="group focus-ring media-frame relative block aspect-[4/5] w-full cursor-zoom-in sm:aspect-[4/3]"
            >
              <Parallax amount={6}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(item) }}
                  sizes="(min-width: 1320px) 320px, (min-width: 1024px) 25vw, 50vw"
                />
              </Parallax>
              <span
                aria-hidden="true"
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-sand-light/85 text-ink opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Expand className="size-4" />
              </span>
            </button>
            <figcaption className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <PhotoLightbox images={items} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
