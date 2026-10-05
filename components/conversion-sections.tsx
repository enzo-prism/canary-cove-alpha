import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

type PullQuoteProps = {
  /** Verbatim guest words. Never edit. */
  quote: string
  author?: string
  tone?: "default" | "light"
  className?: string
}

/**
 * Editorial guest quote: oversized serif with a hanging canary mark. The quote
 * text renders as one text node so it stays byte-identical to its source.
 */
export function PullQuote({ quote, author, tone = "default", className }: PullQuoteProps) {
  const light = tone === "light"
  return (
    <figure className={cn("relative max-w-4xl", className)}>
      <span
        aria-hidden
        data-reveal="scale"
        className="block font-display text-[6rem] leading-[0.6] text-canary sm:text-[8rem]"
      >
        &ldquo;
      </span>
      <blockquote
        data-reveal="blur"
        style={{ "--reveal-delay": "120ms" } as CSSProperties}
        className={cn(
          "mt-4 font-display text-[1.875rem] leading-[1.15] tracking-[-0.01em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]",
          light ? "text-white" : "text-foreground",
        )}
      >
        {quote}
      </blockquote>
      {author ? (
        <figcaption
          data-reveal="fade"
          style={{ "--reveal-delay": "320ms" } as CSSProperties}
          className={cn(
            "mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]",
            light ? "text-white/70" : "text-muted-foreground",
          )}
        >
          <span aria-hidden className="h-px w-10 bg-canary-deep" />
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

type ProcessLineProps = {
  steps: ProcessStep[]
  className?: string
}

/**
 * Numbered steps strung on a hairline that draws across as it scrolls into
 * view (data-reveal="clip-x"); each step rises in turn.
 */
export function ProcessLine({ steps, className }: ProcessLineProps) {
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden
        data-reveal="clip-x"
        className="absolute left-0 right-0 top-[1.4rem] hidden h-px bg-ink/25 sm:block"
      />
      <ol
        data-reveal="stagger"
        style={{ "--stagger-step": "140ms" } as CSSProperties}
        className="relative grid gap-8 sm:grid-cols-3 sm:gap-6"
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative flex gap-5 sm:block"
            style={{ "--stagger-index": index } as CSSProperties}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-background font-display text-xl leading-none text-foreground tabular-nums">
              {index + 1}
            </span>
            <span className="block min-w-0 sm:mt-6">
              <span className="block font-display text-[1.625rem] leading-tight text-foreground">{step.title}</span>
              <span className="mt-2 block max-w-xs text-[15px] leading-6 text-muted-foreground">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
