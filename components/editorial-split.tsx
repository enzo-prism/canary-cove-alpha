import Image from "next/image"
import type { CSSProperties } from "react"

import { Parallax } from "@/components/motion/parallax"
import { SplitText } from "@/components/motion/split-text"
import { CtaLink } from "@/components/ui/cta-link"
import { cn } from "@/lib/utils"

type EditorialSplitProps = {
  eyebrow: string
  title: string
  description: string
  image: { src: string; alt: string }
  href: string
  cta: string
  reverse?: boolean
  index?: number
}

export function EditorialSplit({
  eyebrow,
  title,
  description,
  image,
  href,
  cta,
  reverse = false,
  index,
}: EditorialSplitProps) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-0">
      <div
        className={cn(
          "relative lg:col-span-7",
          reverse ? "lg:order-2 lg:col-start-6" : "lg:order-1",
        )}
      >
        <div data-reveal="clip" className="media-frame relative aspect-[4/5] w-full sm:aspect-[5/4]">
          <Parallax amount={9}>
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </Parallax>
        </div>
        {typeof index === "number" ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -top-10 hidden font-display text-[9rem] leading-none text-ink/[0.07] lg:block",
              reverse ? "-left-4" : "-right-6",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "flow flow-lg lg:col-span-4",
          reverse ? "lg:order-1 lg:col-start-1 lg:pr-6" : "lg:order-2 lg:col-start-9 lg:pl-2",
        )}
      >
        <p data-reveal="fade" className="eyebrow">
          {eyebrow}
        </p>
        <SplitText as="h3" text={title} className="text-section" />
        <p data-reveal="up" style={{ "--reveal-delay": "200ms" } as CSSProperties} className="text-lede">
          {description}
        </p>
        <div data-reveal="up" style={{ "--reveal-delay": "300ms" } as CSSProperties}>
          <CtaLink
            href={href}
            variant="text"
            eventName="cta_click"
            eventPayload={{ location: "editorial_split", target: href, label: title }}
          >
            {cta}
          </CtaLink>
        </div>
      </div>
    </div>
  )
}
