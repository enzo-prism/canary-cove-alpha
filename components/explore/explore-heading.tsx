import type { ReactNode } from "react"

import { SplitText } from "@/components/motion/split-text"
import { RISE } from "@/components/explore/reveal-classes"
import { cn } from "@/lib/utils"

type ExploreHeadingProps = {
  eyebrow?: string
  /** Wrap words in *asterisks* for the italic accent. */
  title: string
  lede?: ReactNode
  action?: ReactNode
  align?: "left" | "split"
  tone?: "default" | "light"
  as?: "h2" | "h3"
  id?: string
  className?: string
  titleClassName?: string
}

/**
 * Section heading for the Explore pages: eyebrow, serif word-rise title, lede.
 * Text color is inherited from a wrapper (never merged into the type-scale
 * class), so `.text-section` always survives class merging.
 */
export function ExploreHeading({
  eyebrow,
  title,
  lede,
  action,
  align = "left",
  tone = "default",
  as = "h2",
  id,
  className,
  titleClassName,
}: ExploreHeadingProps) {
  const light = tone === "light"
  const titleBlock = (
    <div className={cn("flow flow-md", light ? "text-white" : "text-foreground")}>
      {eyebrow ? (
        <p data-reveal="fade" className="eyebrow">
          {eyebrow}
        </p>
      ) : null}
      <SplitText as={as} id={id} text={title} className={cn("text-section max-w-[16ch] text-balance", titleClassName)} />
    </div>
  )

  const ledeBlock =
    lede || action ? (
      <div data-reveal="group" className="flow flow-md">
        {lede ? (
          <div className={cn("text-lede max-w-xl", RISE)} style={{ transitionDelay: "160ms" }}>
            {lede}
          </div>
        ) : null}
        {action ? (
          <div className={cn("flex flex-wrap items-center gap-3", RISE)} style={{ transitionDelay: "260ms" }}>
            {action}
          </div>
        ) : null}
      </div>
    ) : null

  if (align === "split") {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16", className)}>
        {titleBlock}
        {ledeBlock}
      </div>
    )
  }

  return (
    <div className={cn("flow flow-lg", className)}>
      {titleBlock}
      {ledeBlock}
    </div>
  )
}
