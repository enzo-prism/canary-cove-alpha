"use client"

import { useState } from "react"
import Image from "next/image"

import { PhotoLightbox } from "@/components/photo-lightbox"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"

type GalleryItem = {
  src: string
  alt: string
  caption?: string
}

type GalleryGridProps = {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => {
          const blurDataURL = cloudinaryBlurDataUrl(item.src)
          return (
            <Card
              key={item.src}
              className="overflow-hidden rounded-2xl border-border/60 bg-surface shadow-sm shadow-black/5"
            >
              <CardContent className="p-0">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`View photo: ${item.alt}`}
                  className="block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <AspectRatio ratio={4 / 3} className="relative">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      loading="lazy"
                      placeholder={blurDataURL ? "blur" : "empty"}
                      blurDataURL={blurDataURL}
                    />
                    {item.caption ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                        <p className="text-xs font-medium text-white/90">{item.caption}</p>
                      </div>
                    ) : null}
                  </AspectRatio>
                </button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <PhotoLightbox images={items} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
