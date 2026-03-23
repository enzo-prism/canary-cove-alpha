import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type GalleryImage = {
  src: string
  alt: string
}

export type StayGalleryFeature = {
  image: GalleryImage
  title: string
  detail: string
  ratio?: number
  className?: string
}

type StayGallerySectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  primaryItems: StayGalleryFeature[]
  secondaryItems: StayGalleryFeature[]
}

export function StayGallerySection({
  id,
  eyebrow,
  title,
  description,
  primaryItems,
  secondaryItems,
}: StayGallerySectionProps) {
  return (
    <div id={id} className="scroll-mt-24 flow flow-lg">
      <div className="mx-auto max-w-3xl text-center flow flow-sm">
        <p className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">{eyebrow}</p>
        <h2 className="text-section text-foreground">{title}</h2>
        <p className="text-body">{description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {primaryItems.map((item) => (
          <Card
            key={item.title}
            className={cn("surface-panel overflow-hidden rounded-[32px] border-border/60 bg-surface/95", item.className)}
          >
            <CardContent className="flow flow-sm p-4">
              <div className="overflow-hidden rounded-[24px]">
                <AspectRatio ratio={item.ratio ?? 4 / 3} className="relative bg-surface-elevated">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 420px, (min-width: 1024px) 33vw, 100vw"
                  />
                </AspectRatio>
              </div>
              <div className="flow flow-xs px-1 pb-1">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {secondaryItems.map((item) => (
          <Card key={item.title} className="overflow-hidden rounded-[28px] border-border/60 bg-surface/94">
            <CardContent className="flow flow-sm p-4">
              <div className="overflow-hidden rounded-[22px]">
                <AspectRatio ratio={4 / 3} className="relative bg-surface-elevated">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
                  />
                </AspectRatio>
              </div>
              <div className="flow flow-xs px-1 pb-1">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
