"use client"

import { useState } from "react"
import Image from "next/image"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { imageObjectPosition, type ImageFocal } from "@/lib/images"
import { cn } from "@/lib/utils"

type ExperienceGalleryItem = {
  src: string
  alt: string
  label: string
  className?: string
  focal?: ImageFocal
}

type ExperiencesGalleryMosaicProps = {
  items: readonly ExperienceGalleryItem[]
}

export function ExperiencesGalleryMosaic({ items }: ExperiencesGalleryMosaicProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="flow flow-md" data-testid="experiences-gallery-mosaic">
      <div className="text-center flow flow-xs">
        <p className="text-[11px] uppercase tracking-[0.34em] text-muted-foreground">Curated moments</p>
        <h2 className="text-section">Activity Gallery</h2>
      </div>

      <div className="grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[180px] md:auto-rows-[150px] md:grid-cols-4 lg:auto-rows-[165px]">
        {items.map((item, index) => {
          const blurDataURL = cloudinaryBlurDataUrl(item.src)
          return (
            <article
              key={item.src}
              className={cn(
                "group relative overflow-hidden rounded-[26px] border border-border/60 bg-surface shadow-[0_14px_36px_rgba(15,23,42,0.1)]",
                item.className,
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                style={{ objectPosition: imageObjectPosition(item) }}
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,25,38,0)_28%,rgba(7,25,38,0.68)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <p className="text-sm font-medium leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.24)]">
                  {item.label}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`View photo: ${item.alt}`}
                className="absolute inset-0 cursor-zoom-in rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </article>
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
