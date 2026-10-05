import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"

import { Parallax } from "@/components/motion/parallax"
import { SplitText } from "@/components/motion/split-text"
import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"

type HeroImage = {
  src: string
  alt: string
  focal?: { x: number; y: number }
}

type Fact = { label: string; value: ReactNode }

type PageHeroProps = {
  eyebrow: string
  /** Wrap words in *asterisks* for the italic accent. Rendered as the page's single h1. */
  title: string
  lede?: ReactNode
  actions?: ReactNode
  facts?: Fact[]
  /** Extra content under the lede (anchor index, notes). */
  children?: ReactNode
  image?: HeroImage
  /**
   * stacked: copy, then a wide parallax image.
   * split: copy left, arched image right (desktop).
   * plain: copy only.
   */
  variant?: "stacked" | "split" | "plain"
  className?: string
  imageClassName?: string
  imageTestId?: string
  priority?: boolean
}

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties

function Facts({ facts }: { facts: Fact[] }) {
  return (
    <dl className="enter-up grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border/80 pt-6 sm:grid-cols-4" style={delay(520)}>
      {facts.map((fact) => (
        <div key={fact.label} className="flow flow-xs">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{fact.label}</dt>
          <dd className="font-display text-2xl leading-none text-foreground">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Interior page opener: eyebrow, word-rise serif h1, lede, actions, glance
 * facts and an image that wipes up on load and drifts with scroll. All
 * entrances are CSS keyframes, so they run before hydration.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  actions,
  facts,
  children,
  image,
  variant = "stacked",
  className,
  imageClassName,
  imageTestId,
  priority = true,
}: PageHeroProps) {
  const copy = (
    <div className={cn("flow flow-lg", variant === "split" ? "max-w-xl" : "max-w-4xl")}>
      <p className="eyebrow enter-fade" style={delay(80)}>
        {eyebrow}
      </p>
      <SplitText as="h1" mode="enter" delay={140} text={title} className="text-display max-w-[16ch] text-balance" />
      {lede ? (
        <div className="text-lede enter-up max-w-2xl" style={delay(420)}>
          {lede}
        </div>
      ) : null}
      {actions ? (
        <div className="enter-up flex flex-wrap items-center gap-3" style={delay(500)}>
          {actions}
        </div>
      ) : null}
      {children ? (
        <div className="enter-up" style={delay(560)}>
          {children}
        </div>
      ) : null}
    </div>
  )

  const media = image ? (
    <div
      data-testid={imageTestId}
      className={cn(
        "media-frame enter-clip relative",
        variant === "split" ? "arch aspect-[4/5] w-full" : "aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]",
        imageClassName,
      )}
      style={delay(260)}
    >
      <Parallax amount={7}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={variant === "split" ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1320px) 1320px, 100vw"}
          className="object-cover"
          style={image.focal ? { objectPosition: `${image.focal.x}% ${image.focal.y}%` } : undefined}
        />
      </Parallax>
    </div>
  ) : null

  return (
    <section className={cn("relative pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20", className)}>
      <Container size="wide">
        {variant === "split" ? (
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div className="flow flow-xl">
              {copy}
              {facts ? <Facts facts={facts} /> : null}
            </div>
            {media}
          </div>
        ) : (
          <div className="flow flow-xl">
            {copy}
            {facts ? <Facts facts={facts} /> : null}
            {media ? <div className="pt-2 sm:pt-4">{media}</div> : null}
          </div>
        )}
      </Container>
    </section>
  )
}
