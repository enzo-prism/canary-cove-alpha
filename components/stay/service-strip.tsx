"use client"

import { useState, type CSSProperties } from "react"
import Image from "next/image"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { cn } from "@/lib/utils"

const servicePhotos = [IMAGES.tacosAlt, IMAGES.logoDrink, IMAGES.diningFoodDetail, IMAGES.diningSpread]
const FRAMES = ["aspect-[4/5]", "aspect-[4/5] lg:mt-16", "aspect-[4/5]", "aspect-[4/5] lg:mt-16"]

/** "From the kitchen": four service frames that open in the photo viewer. */
export function ServiceStrip() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flow flow-lg">
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-end justify-between gap-4 px-[var(--gutter)]">
        <div className="flow flow-xs">
          <h3 className="text-title text-foreground" data-reveal="up">
            From the kitchen
          </h3>
          <p className="text-body max-w-md" data-reveal="up" style={{ "--reveal-delay": "100ms" } as CSSProperties}>
            Frames from the service side of the stay — select any photo to open the viewer.
          </p>
        </div>
      </div>
      <div className="no-scrollbar snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:overflow-visible">
        <ul
          data-reveal="stagger"
          className="mx-auto flex w-max gap-3 px-[var(--gutter)] sm:gap-5 lg:grid lg:w-full lg:max-w-[1320px] lg:grid-cols-4 lg:items-start lg:gap-8"
          style={{ scrollPaddingInline: "var(--gutter)" } as CSSProperties}
        >
          {servicePhotos.map((photo, index) => {
            const blurDataURL = cloudinaryBlurDataUrl(photo.src)
            return (
              <li
                key={photo.src}
                className="w-[62vw] max-w-[300px] shrink-0 snap-start lg:w-auto lg:max-w-none"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`View photo: ${photo.alt}`}
                  className={cn(
                    "group media-frame zoom-media relative block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                    FRAMES[index],
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: imageObjectPosition(photo) }}
                    sizes="(min-width: 1024px) 24vw, 62vw"
                    placeholder={blurDataURL ? "blur" : "empty"}
                    blurDataURL={blurDataURL}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <PhotoLightbox
        images={servicePhotos.map((photo) => ({ src: photo.src, alt: photo.alt, caption: photo.alt }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  )
}
