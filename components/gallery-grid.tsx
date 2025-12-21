"use client"

import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"

type GalleryItem = {
  src: string
  alt: string
  caption?: string
}

type GalleryGridProps = {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.src}
          className="overflow-hidden rounded-2xl border-border/60 bg-surface shadow-sm shadow-black/5"
        >
          <CardContent className="p-0">
            <AspectRatio ratio={4 / 3} className="relative">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
              {item.caption ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                  <p className="text-xs font-medium text-white/90">{item.caption}</p>
                </div>
              ) : null}
            </AspectRatio>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
