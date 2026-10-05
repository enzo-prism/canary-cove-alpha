import { cn } from "@/lib/utils"
import { DRAW_X, RISE } from "@/components/explore/reveal-classes"

type ChapterMarkProps = {
  index: string
  label: string
  tone?: "default" | "light"
  className?: string
}

/** "01 ——— Included" chapter marker for the Explore pages' long-form sections. */
export function ChapterMark({ index, label, tone = "default", className }: ChapterMarkProps) {
  const light = tone === "light"
  return (
    <div data-reveal="group" className={cn("flex items-center gap-4", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "font-display text-[2.75rem] italic leading-none tabular sm:text-[3.25rem]",
          light ? "text-canary" : "text-lagoon",
          RISE,
        )}
      >
        {index}
      </span>
      <span aria-hidden="true" className={cn("h-px w-10 sm:w-16", light ? "bg-white/35" : "bg-ink/25", DRAW_X)} />
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.26em]",
          light ? "text-white/70" : "text-muted-foreground",
          RISE,
        )}
        style={{ transitionDelay: "180ms" }}
      >
        {label}
      </span>
    </div>
  )
}
