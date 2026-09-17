"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"

type PhotoLightboxImage = {
  src: string
  alt: string
  caption?: string
}

type PhotoLightboxProps = {
  images: PhotoLightboxImage[]
  openIndex: number | null
  onClose: () => void
}

/**
 * Fullscreen, swipeable photo viewer. Controlled: the parent owns `openIndex`
 * (null = closed) and is notified through `onClose`. Opens at `openIndex`,
 * closes on the X button or Escape; arrows/swipe navigate. Tapping the photo
 * itself never closes the viewer — on mobile the photo fills the screen, so a
 * tap expecting zoom would otherwise dismiss it.
 */
export function PhotoLightbox({ images, openIndex, onClose }: PhotoLightboxProps) {
  const open = openIndex !== null
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: openIndex ?? 0 })
  const [selectedIndex, setSelectedIndex] = useState(openIndex ?? 0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Jump to the requested slide every time the lightbox opens.
  useEffect(() => {
    if (openIndex === null || !emblaApi) return
    emblaApi.scrollTo(openIndex, true)
    setSelectedIndex(openIndex)
  }, [emblaApi, openIndex])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, scrollPrev, scrollNext])

  const currentImage = images[selectedIndex]

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-black/95" />
        <DialogPrimitive.Content
          data-testid="photo-lightbox"
          aria-label="Photo gallery viewer"
          className="fixed inset-0 z-[90] flex flex-col outline-none"
        >
          <DialogPrimitive.Title className="sr-only">Photo gallery</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Swipe or use the left and right arrow keys to browse the photos. Press Escape to close.
          </DialogPrimitive.Description>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 sm:p-4">
            <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium tracking-[0.2em] text-white/90 tabular-nums">
              {images.length > 0 ? `${selectedIndex + 1} / ${images.length}` : "0 / 0"}
            </span>
            <DialogPrimitive.Close
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div
            ref={emblaRef}
            className="min-h-0 flex-1 overflow-hidden"
          >
            <div className="flex h-full">
              {images.map((image, index) => {
                const blurDataURL = cloudinaryBlurDataUrl(image.src)
                return (
                  <div
                    key={image.src}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Photo ${index + 1} of ${images.length}`}
                    className="relative min-w-0 flex-[0_0_100%]"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="100vw"
                      draggable={false}
                      className="object-contain"
                      placeholder={blurDataURL ? "blur" : "empty"}
                      blurDataURL={blurDataURL}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {currentImage?.caption ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4">
              <p className="max-w-2xl rounded-2xl border border-white/15 bg-black/60 px-4 py-2 text-center text-sm text-white/90 backdrop-blur-sm">
                {currentImage.caption}
              </p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 transition-colors hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
