import { cn } from "@/lib/utils"

/** Canary sun settling into two swells: the Canary Cove mark. */
export function BrandGlyph({ className, tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  const stroke = tone === "light" ? "#fcfaf5" : "#0d2327"
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("shrink-0", className)}>
      <g className="brand-sun transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-[2px]">
        <path d="M9.18 24A11 11 0 1 1 30.82 24Z" fill="#f4c63d" />
      </g>
      <path d="M4 27.5c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2 3-2 6-2" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 32.5c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}
