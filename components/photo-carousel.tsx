"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

import { Button } from "@/components/ui/button"

const photos = [
  {
    src: "/luxury-tropical-beachfront-villa-sunset-ocean-view.jpg",
    alt: "Sunset over the shoreline",
    caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    detail: "Vestibulum ante ipsum primis in faucibus orci luctus.",
  },
  {
    src: "/scuba-diving-coral-reef-tropical-fish.jpg",
    alt: "Underwater coral reef",
    caption: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    detail: "Suspendisse potenti in faucibus orci luctus et ultrices.",
  },
  {
    src: "/fine-dining-gourmet-chef-plating-food.jpg",
    alt: "Chef plating dish",
    caption: "Ut enim ad minim veniam quis nostrud exercitation ullamco.",
    detail: "Curabitur vitae magna sit amet lacus ullamcorper tristique.",
  },
  {
    src: "/tropical-island-beach-boat-trip.jpg",
    alt: "Boat near islands",
    caption: "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    detail: "Integer tincidunt libero nec lorem efficitur, et vulputate est rutrum.",
  },
]

export function PhotoCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi],
  )

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="px-4 pb-24">
      <div className="mx-auto max-w-6xl rounded-[40px] border border-border/70 bg-white/80 p-6 backdrop-blur lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:flex-1">
            <div className="overflow-hidden rounded-[32px]" ref={emblaRef}>
              <div className="-ml-4 flex">
                {photos.map((photo) => (
                  <div key={photo.src} className="ml-4 flex-[0_0_100%]">
                    <div className="relative h-[360px] overflow-hidden rounded-[28px] bg-surface-elevated sm:h-[440px]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        priority
                        className="object-cover"
                        sizes="(min-width: 1024px) 800px, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-base text-white">{photo.caption}</p>
                        <p className="mt-2 text-sm text-white/80">{photo.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollTo(index)}
                    className={`h-2 rounded-full transition-all ${
                      selectedIndex === index ? "w-8 bg-foreground" : "w-2 bg-muted-foreground/40"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-border/70 bg-white/70 text-foreground hover:bg-white"
                  onClick={scrollPrev}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-border/70 bg-white/70 text-foreground hover:bg-white"
                  onClick={scrollNext}
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:w-[320px]">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Lorem ipsum</p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight text-foreground">Dolor sit amet consectetur.</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Nullam rhoncus, ipsum eget laoreet porttitor, nisi lacus lacinia mauris, at pulvinar orci lorem ac arcu.
              Mauris non ipsum ut massa iaculis cursus sit amet eget neque. Integer egestas varius efficitur.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-foreground">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Swipe horizontally to explore the gallery.
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Tap the dots to jump directly to a moment.
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Buttons offer precise control on tablet and desktop.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
