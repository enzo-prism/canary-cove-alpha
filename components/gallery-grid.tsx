"use client"

import Image from "next/image"

type GalleryItem = {
  src: string
  alt: string
}

type GalleryGridProps = {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.src}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-sm shadow-black/5"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}
