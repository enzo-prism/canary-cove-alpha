"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"

import { imageObjectPosition, type ImageRecord } from "@/lib/images"
import { cn } from "@/lib/utils"

type Testimonial = {
  quote: string
  author?: string
  year: string
  image: ImageRecord
}

type TestimonialSliderProps = {
  testimonials: readonly Testimonial[]
}

export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    duration: 25,
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
  const visibleDots = testimonials.map((_, index) => index)

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

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

    node.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      node.removeEventListener("wheel", handleWheel)
      if (wheelLockRef.current) {
        window.clearTimeout(wheelLockRef.current)
        wheelLockRef.current = null
      }
    }
  }, [emblaApi])

  return (
    <div className="flow flow-md">
      <div className="flow flow-xs">
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Guest stories</p>
        <h2 className="text-section">Real stays, unforgettable moments.</h2>
      </div>
      <div
        className="overflow-hidden touch-pan-y overscroll-x-contain overscroll-y-contain carousel-viewport cursor-grab select-none active:cursor-grabbing"
        ref={(node) => {
          viewportNode.current = node
          viewportRef(node)
        }}
        tabIndex={0}
        aria-label="Testimonial slider"
        onKeyDown={handleKeyDown}
        onPointerEnter={() => {
          hoverRef.current = true
        }}
        onPointerLeave={() => {
          hoverRef.current = false
        }}
        data-testid="testimonial-carousel-viewport"
      >
        <div className="flex carousel-track">
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.author ?? "guest"}-${testimonial.year}`}
              role="group"
              aria-roledescription="slide"
              data-testid={`testimonial-slide-${index}`}
              className="min-w-0 flex-[0_0_100%] carousel-slide"
            >
              <div
                data-testid={`testimonial-card-${index}`}
                className="relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[28px] bg-surface-muted sm:min-h-[420px]"
              >
                <Image
                  src={testimonial.image.src}
                  alt={testimonial.image.alt}
                  fill
                  decoding="async"
                  loading="lazy"
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(testimonial.image) }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 via-[60%] to-transparent" />
                <div className="relative z-10 max-w-xl space-y-4 p-6 sm:p-10">
                  <p
                    data-testid={`testimonial-quote-${index}`}
                    className="text-xl font-semibold text-pretty text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)] md:text-2xl"
                  >
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                    {testimonial.author ?? "Guest"} - {testimonial.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {visibleDots.map((index) => {
          const testimonial = testimonials[index]
          return (
            <button
              key={`${testimonial.author ?? "guest"}-${testimonial.year}-dot`}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === selectedIndex ? "true" : undefined}
              className={cn(
                "relative h-2 w-8 rounded-full transition-colors duration-300 after:absolute after:-inset-2 after:content-['']",
                index === selectedIndex ? "bg-foreground" : "bg-muted-foreground/40",
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
