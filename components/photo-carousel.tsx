"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

import { Button } from "@/components/ui/button"
import { IMAGES } from "@/lib/images"

const photos = [
  {
    ...IMAGES.villaPool,
    caption: "🌅 Private pool, beach, and dock exclusive to your group.",
    detail: "Swim, lounge, or step onto the dock for a sunset cruise.",
  },
  {
    ...IMAGES.turtleDive,
    caption: "🤿 Calm, clear water minutes from the property.",
    detail: "Sea turtles, bright reefs, and gentle currents for all levels.",
  },
  {
    ...IMAGES.chefNatalie,
    caption: "🍽️ Private-chef dinners without leaving the villa.",
    detail: "Seasonal menus, local catch, and candlelit tables on the deck.",
  },
  {
    ...IMAGES.tubing,
    caption: "🛥️ Adventure days crafted for every age.",
    detail: "Tubing, sandbars, and blue holes planned around the tides.",
  },
  {
    ...IMAGES.wedding,
    caption: "💍 Celebrate under the palms.",
    detail: "Intimate weddings, milestone dinners, and effortless setups.",
  },
  {
    ...IMAGES.drinksBar,
    caption: "🕯️ Slow sunsets and easy evenings.",
    detail: "Drinks by the water after a day on the boats.",
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
                {photos.map((photo, index) => (
                  <div key={photo.src} className="ml-4 flex-[0_0_100%]">
                    <div className="relative h-[360px] overflow-hidden rounded-[28px] bg-surface-elevated sm:h-[440px]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        priority={index === 0}
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
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Canary Cove</p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight text-foreground">Scenes from your stay ✨</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              From sunrise dives to sunset dinners, every moment is private to your group. Tap through to see the estate,
              boats, and the way we celebrate.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
