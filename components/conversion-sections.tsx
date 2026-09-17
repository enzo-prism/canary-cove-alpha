import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PullQuoteProps = {
  quote: string
  author?: string
  align?: "center" | "left"
  className?: string
}

export function PullQuote({ quote, author, align = "center", className }: PullQuoteProps) {
  const left = align === "left"
  return (
    <figure className={cn("max-w-[720px] space-y-4", left ? "text-left" : "mx-auto text-center", className)}>
      <span aria-hidden className={cn("block h-px w-16 bg-[#B98A2F]", !left && "mx-auto")} />
      <blockquote className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-[28px]">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {author ? (
        <figcaption className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {author}
        </figcaption>
      ) : null}
    </figure>
  )
}

type ProcessStep = {
  title: string
  text: string
}

type ProcessStripProps = {
  steps: [ProcessStep, ProcessStep, ProcessStep]
  className?: string
  compact?: boolean
}

export function ProcessStrip({ steps, className, compact }: ProcessStripProps) {
  return (
    <ol className={cn("grid gap-3 sm:grid-cols-3 sm:gap-4", className)}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={cn(
            "flex gap-3.5 rounded-3xl border border-border/60 bg-surface-elevated/70",
            compact ? "flex-col gap-1.5 p-3.5 sm:flex-row sm:gap-3 sm:p-4" : "p-4 sm:flex-col sm:gap-2 sm:p-5",
          )}
        >
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1F24] text-sm font-semibold text-white"
          >
            {index + 1}
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold leading-6 text-foreground">{step.title}</span>
            <span className={cn("mt-0.5 block leading-5 text-muted-foreground", compact ? "text-[13px]" : "text-sm")}>
              {step.text}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}

type RailCardProps = {
  title: string
  children: ReactNode
  className?: string
}

export function RailCard({ title, children, className }: RailCardProps) {
  return (
    <div className={cn("rounded-3xl border border-border/60 bg-surface-elevated/70 p-5", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  )
}
