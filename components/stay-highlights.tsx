"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { trackCtaClick } from "@/lib/analytics"
import { PhotoLightbox } from "@/components/photo-lightbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"
import { IMAGES, imageObjectPosition, type ImageFocal } from "@/lib/images"

type HighlightCard = {
  id: string
  title: string
  description: string
  ctaLabel: string
  href: string
  images: Array<{
    src: string
    alt: string
    focal?: ImageFocal
  }>
}

const highlightCards: HighlightCard[] = [
  {
    id: "villa",
    title: "The Villa",
    description:
      "Three king suites, an open great room, and indoor-outdoor living make the house feel calm and expansive from the moment you arrive.",
    ctaLabel: "Explore spaces",
    href: "#inside-the-villa",
    images: [
      IMAGES.villaInteriorWide,
      IMAGES.villaMasterBedroom,
      IMAGES.villaBedroom,
      IMAGES.bedroomGardenView,
      IMAGES.diningRoom,
    ],
  },
  {
    id: "outside",
    title: "Outside, just for you",
    description:
      "A private pool deck, hot tub, palms, hammocks, and two docks create a resort-like rhythm with no shared spaces or schedules.",
    ctaLabel: "View grounds",
    href: "#outside-the-villa",
    images: [
      IMAGES.villaPool,
      IMAGES.heroVillaSeating,
      IMAGES.heroVillaDetail,
      IMAGES.hotTub,
      IMAGES.mainDock,
    ],
  },
  {
    id: "services",
    title: "All-inclusive service",
    description:
      "Chef-prepared meals, daily staff support, and seamless arrivals keep the stay personal, easy, and fully tailored to your group.",
    ctaLabel: "Discover services",
    href: "/book",
    images: [
      IMAGES.chefMarvinPlates,
      IMAGES.chefMarvinKitchen,
      IMAGES.logoDrink,
      IMAGES.diningFoodDetail,
      IMAGES.diningSpread,
    ],
  },
]

function HighlightCollage({ images, title }: Pick<HighlightCard, "images" | "title">) {
  // One lightbox per collage, covering exactly the 5 images shown in it.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-[28px] border border-border/60 bg-white p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        aria-label={`View photo: ${images[0].alt}`}
        className="relative col-span-2 row-span-2 min-h-[9.5rem] cursor-zoom-in overflow-hidden rounded-[20px] bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:min-h-[11rem] lg:min-h-[12rem]"
      >
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          className="object-cover"
          style={{ objectPosition: imageObjectPosition(images[0]) }}
          sizes="(min-width: 1024px) 280px, 50vw"
          placeholder={cloudinaryBlurDataUrl(images[0].src) ? "blur" : "empty"}
          blurDataURL={cloudinaryBlurDataUrl(images[0].src)}
        />
      </button>
      {images.slice(1).map((image, index) => (
        <button
          key={`${title}-${index}`}
          type="button"
          onClick={() => setOpenIndex(index + 1)}
          aria-label={`View photo: ${image.alt}`}
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[16px] bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            style={{ objectPosition: imageObjectPosition(image) }}
            sizes="(min-width: 1024px) 120px, 25vw"
            placeholder={cloudinaryBlurDataUrl(image.src) ? "blur" : "empty"}
            blurDataURL={cloudinaryBlurDataUrl(image.src)}
          />
        </button>
      ))}
      <PhotoLightbox images={images} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </div>
  )
}

export function StayHighlights() {
  const handleAnchorClick = useCallback((href: string) => {
    const target = document.querySelector(href)
    if (!(target instanceof HTMLElement)) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const headerOffset = 112
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" })
    window.history.replaceState(null, "", href)
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {highlightCards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          className="surface-panel scroll-mt-24 overflow-hidden rounded-[34px] border-border/60 bg-surface/95"
        >
          <CardContent className="flow flow-md p-4 sm:p-5">
            <HighlightCollage images={card.images} title={card.title} />
            <div className="flow flow-sm px-1 pb-2 pt-1">
              <h2 className="text-section text-[2rem] text-foreground">{card.title}</h2>
              <p className="text-body">{card.description}</p>
              {card.href.startsWith("#") ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    trackCtaClick("stay_highlights", card.href)
                    handleAnchorClick(card.href)
                  }}
                  className="h-auto w-fit px-0 text-[11px] uppercase tracking-[0.28em] text-foreground"
                >
                  {card.ctaLabel}
                  <ArrowRight className="size-3.5" />
                </Button>
              ) : (
                <Button asChild variant="ghost" className="h-auto w-fit px-0 text-[11px] uppercase tracking-[0.28em] text-foreground">
                  <Link href={card.href} onClick={() => trackCtaClick("stay_highlights", card.href)}>
                    {card.ctaLabel}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
