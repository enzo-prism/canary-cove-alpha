import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EditorialSplitProps = {
  eyebrow: string
  title: string
  description: string
  image: { src: string; alt: string }
  href: string
  cta: string
  reverse?: boolean
}

export function EditorialSplit({
  eyebrow,
  title,
  description,
  image,
  href,
  cta,
  reverse = false,
}: EditorialSplitProps) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className={cn("flow flow-md", reverse ? "lg:order-2" : "lg:order-1")}>
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">{eyebrow}</p>
        <h3 className="text-section">{title}</h3>
        <p className="text-body text-foreground/80">{description}</p>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <Link href={href}>{cta}</Link>
        </Button>
      </div>
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted", reverse ? "lg:order-1" : "lg:order-2")}>
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
    </div>
  )
}
