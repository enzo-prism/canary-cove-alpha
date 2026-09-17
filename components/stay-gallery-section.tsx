"use client"

import { useState } from "react"
import Image from "next/image"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"
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
  ratio?: number
  className?: string
}

type StayGallerySectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  primaryItems: StayGalleryFeature[]
  secondaryItems: StayGalleryFeature[]
}

export function StayGallerySection({
  id,
  eyebrow,
  title,
  description,
  primaryItems,
  secondaryItems,
}: StayGallerySectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // One lightbox per section: primary images first, then secondary, matching
  // the display order.
  const lightboxImages = [...primaryItems, ...secondaryItems].map((item) => ({
    src: item.image.src,
    alt: item.image.alt,
    caption: item.title,
  }))

  return (
    <div id={id} className="scroll-mt-24 flow flow-lg">
      <div className="max-w-2xl flow flow-sm">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">{eyebrow}</p>
        <h2 className="text-section text-[2rem] text-foreground sm:text-[2.5rem]">{title}</h2>
        <p className="text-body">{description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {primaryItems.map((item, index) => {
          const blurDataURL = cloudinaryBlurDataUrl(item.image.src)
          return (
            <Card
              key={item.title}
              className={cn("surface-panel overflow-hidden rounded-[32px] border-border/60 bg-surface/95", item.className)}
            >
              <CardContent className="flow flow-sm p-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`View photo: ${item.image.alt}`}
                  className="block w-full cursor-zoom-in overflow-hidden rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <AspectRatio ratio={item.ratio ?? 4 / 3} className="relative bg-surface-elevated">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                      style={{ objectPosition: imageObjectPosition(item.image) }}
                      sizes="(min-width: 1280px) 420px, (min-width: 1024px) 33vw, 100vw"
                      placeholder={blurDataURL ? "blur" : "empty"}
                      blurDataURL={blurDataURL}
                    />
                  </AspectRatio>
                </button>
                <div className="flow flow-xs px-1 pb-1">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
        {secondaryItems.map((item, index) => {
          const blurDataURL = cloudinaryBlurDataUrl(item.image.src)
          return (
            <figure key={item.title} className="flow flow-sm">
              <button
                type="button"
                onClick={() => setOpenIndex(primaryItems.length + index)}
                aria-label={`View photo: ${item.image.alt}`}
                className="block w-full cursor-zoom-in overflow-hidden rounded-[24px] border border-border/55 bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <AspectRatio ratio={4 / 3} className="relative">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: imageObjectPosition(item.image) }}
                    sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
                    placeholder={blurDataURL ? "blur" : "empty"}
                    blurDataURL={blurDataURL}
                  />
                </AspectRatio>
              </button>
              <figcaption className="flow flow-xs px-1">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </figcaption>
            </figure>
          )
        })}
      </div>

      <PhotoLightbox images={lightboxImages} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </div>
  )
}
