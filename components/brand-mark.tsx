import Link from "next/link"

import { BrandGlyph } from "@/components/brand-glyph"
import { cn } from "@/lib/utils"

type BrandMarkProps = {
  className?: string
  compact?: boolean
  tone?: "ink" | "light"
}

export function BrandMark({ className, compact = false, tone = "ink" }: BrandMarkProps) {
  const light = tone === "light"
  return (
    <Link
      href="/"
      aria-label="Canary Cove home"
      className={cn("group focus-ring inline-flex items-center gap-2.5 rounded-full", className)}
    >
      <BrandGlyph tone={tone} className={compact ? "h-8 w-8" : "h-10 w-10"} />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "font-display uppercase leading-none tracking-[0.04em]",
            compact ? "text-[1.3rem]" : "text-[1.6rem]",
            light ? "text-white" : "text-foreground",
          )}
        >
          Canary Cove
        </span>
        <span
          className={cn(
            "mt-1 text-[9.5px] font-semibold uppercase tracking-[0.3em]",
            light ? "text-white/70" : "text-muted-foreground",
            compact ? "hidden min-[380px]:block" : "",
          )}
        >
          Ambergris Caye · Belize
        </span>
      </span>
    </Link>
  )
}
