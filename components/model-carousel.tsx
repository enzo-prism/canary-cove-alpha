"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Button } from "@/components/ui/button"
import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

type Model = {
  name: string
  tagline: string
  summary: string
  image: ImageRecord
  finishes: readonly { name: string; color: string }[]
  stats: readonly { label: string; value: string }[]
  cta: { label: string; href: string }
}

type ModelCarouselProps = {
  models: readonly Model[]
}

export function ModelCarousel({ models }: ModelCarouselProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    duration: 35,
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
    slidesToScroll: 1,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const viewportNode = useRef<HTMLDivElement | null>(null)
  const wheelLockRef = useRef<number | null>(null)
  const hoverRef = useRef(false)
  const keyThrottleRef = useRef<number>(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const visibleDots = models.map((_, index) => index)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const now = Date.now()
      if (now - keyThrottleRef.current < 250) return
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        emblaApi?.scrollPrev()
        keyThrottleRef.current = now
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        emblaApi?.scrollNext()
        keyThrottleRef.current = now
      }
    },
    [emblaApi],
  )

  useEffect(() => {
    const node = viewportNode.current
    if (!node || !emblaApi) return
    const dominance = 1.2

    const handleWheel = (event: WheelEvent) => {
      if (wheelLockRef.current) return
      const target = event.target as Node | null
      if (!hoverRef.current && (!target || !node.contains(target))) return

      const absX = Math.abs(event.deltaX)
      const absY = Math.abs(event.deltaY)
      let delta = 0

      if (absX > absY * dominance) {
        delta = event.deltaX
      } else if (event.shiftKey && absY > 0) {
        delta = event.deltaY
      }

      if (Math.abs(delta) < 12) return

      event.preventDefault()
      event.stopPropagation()
      wheelLockRef.current = window.setTimeout(() => {
        wheelLockRef.current = null
      }, 350)

      if (delta > 0) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollPrev()
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true })
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true })
      if (wheelLockRef.current) {
        window.clearTimeout(wheelLockRef.current)
        wheelLockRef.current = null
      }
    }
  }, [emblaApi])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flow flow-xs">
          <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Estate lineup</p>
          <h2 className="text-section">Spaces that scale with your stay.</h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            aria-label="Previous model"
            className="border-border text-foreground hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollNext}
            aria-label="Next model"
            className="border-border text-foreground hover:bg-foreground hover:text-background"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="overflow-hidden touch-pan-y overscroll-x-contain overscroll-y-contain carousel-viewport cursor-grab select-none active:cursor-grabbing"
        ref={(node) => {
          viewportNode.current = node
          viewportRef(node)
        }}
        tabIndex={0}
        aria-label="Estate lineup slider"
        onKeyDown={handleKeyDown}
        onPointerEnter={() => {
          hoverRef.current = true
        }}
        onPointerLeave={() => {
          hoverRef.current = false
        }}
        data-testid="model-carousel-viewport"
      >
        <div className="flex carousel-track">
          {models.map((model, index) => (
            <div
              key={model.name}
              data-testid={`model-slide-${index}`}
              role="group"
              aria-roledescription="slide"
              className="min-w-0 flex-[0_0_100%] pr-6 xl:flex-[0_0_80%] carousel-slide"
            >
              <div className="surface-panel grid gap-10 p-8 sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
                <div className="relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-[22px] bg-surface-muted">
                  <Image
                    src={model.image.src}
                    alt={model.image.alt}
                    fill
                    decoding="async"
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1280px) 720px, (min-width: 768px) 70vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: imageObjectPosition(model.image) }}
                  />
                </div>
                <div data-testid={`model-stack-${index}`} className="flex min-w-0 flex-col justify-between gap-8 md:gap-10">
                  <div data-testid={`model-text-${index}`} className="flex flex-col gap-5 md:gap-6">
                    <h3 data-testid={`model-title-${index}`} className="text-section pb-3">
                      {model.name}
                    </h3>
                    <p
                      data-testid={`model-tagline-${index}`}
                      className="text-sm font-medium uppercase tracking-[0.26em] text-muted-foreground"
                    >
                      {model.tagline}
                    </p>
                    <p data-testid={`model-summary-${index}`} className="text-body text-foreground/80">
                      {model.summary}
                    </p>
                  </div>

                  <div data-testid={`model-actions-${index}`} className="flex flex-col gap-5 md:gap-6">
                    <div data-testid={`model-stats-${index}`} className="grid gap-4 sm:grid-cols-3">
                      {model.stats.map((stat) => (
                        <div key={stat.label} className="surface-inset px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
                          <p className="text-base font-semibold text-foreground">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-fit" data-testid={`model-cta-${index}`}>
                      <TrackedLink
                        href={model.cta.href}
                        eventName="cta_click"
                        eventPayload={{ location: "model_carousel", target: model.cta.href, label: model.name }}
                      >
                        {model.cta.label}
                      </TrackedLink>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {visibleDots.map((index) => {
          const model = models[index]
          return (
            <button
              key={model.name}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to ${model.name}`}
              aria-current={index === selectedIndex ? "true" : undefined}
              className={cn(
                "relative h-2 w-8 rounded-full transition-colors duration-300 after:absolute after:-inset-2 after:content-['']",
                index === selectedIndex ? "bg-foreground" : "bg-border",
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
