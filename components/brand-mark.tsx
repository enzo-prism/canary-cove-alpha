import Link from "next/link"

import { cn } from "@/lib/utils"

type BrandMarkProps = {
  className?: string
  compact?: boolean
}

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      aria-label="Canary Cove home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full border border-primary/20 bg-primary/90 transition-transform duration-200 group-hover:scale-110"
      />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "text-[0.7rem] font-semibold uppercase tracking-[0.36em] text-foreground",
            compact && "text-[0.64rem] tracking-[0.32em]",
          )}
        >
          Canary Cove
        </span>
        <span className={cn("text-xs text-muted-foreground", compact ? "hidden min-[380px]:block" : "")}>
          Ambergris Caye, Belize
        </span>
      </span>
    </Link>
  )
}
