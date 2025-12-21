"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IMAGES } from "@/lib/images"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loadedSlides, setLoadedSlides] = useState<Record<number, boolean>>({})

  const onSelect = useCallback(
    (carouselApi: CarouselApi) => {
      setSelectedIndex(carouselApi.selectedScrollSnap())
    },
    [],
  )

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleLoaded = useCallback((index: number) => {
    setLoadedSlides((prev) => ({ ...prev, [index]: true }))
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, onSelect])

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-6xl xl:max-w-7xl rounded-[40px] border border-border/70 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="p-6 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="lg:flex-1">
              <Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
                <CarouselContent>
                  {photos.map((photo, index) => (
                    <CarouselItem key={photo.src}>
                      <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-surface-elevated min-[420px]:h-[360px] sm:h-[440px]">
                        {!loadedSlides[index] ? (
                          <Skeleton className="absolute inset-0" />
                        ) : null}
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          priority={index === 0}
                          className={`object-cover transition-opacity duration-700 ${loadedSlides[index] ? "opacity-100" : "opacity-0"}`}
                          sizes="(min-width: 1024px) 800px, 100vw"
                          onLoadingComplete={() => handleLoaded(index)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-base text-white">{photo.caption}</p>
                          <p className="mt-2 text-sm text-white/80">{photo.detail}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
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
            <div className="lg:w-[340px] xl:w-[380px]">
              <Badge
                variant="outline"
                className="rounded-full border-border/60 text-xs uppercase tracking-[0.4em] text-muted-foreground"
              >
                Canary Cove
              </Badge>
              <h3 className="mt-4 text-3xl font-semibold leading-tight text-foreground">Scenes from your stay ✨</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                From sunrise dives to sunset dinners, every moment is private to your group. Tap through to see the estate,
                boats, and the way we celebrate.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-6 rounded-full">
                    View full gallery
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Canary Cove photo gallery</DialogTitle>
                    <DialogDescription>Browse a few highlights from the villa, beach, and docks.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {photos.map((photo) => (
                      <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-elevated">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 520px, 100vw"
                        />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
