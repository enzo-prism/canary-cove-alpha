import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

// Official Canary Cove lockup (canary + cocktail + slab wordmark), vectorized
// from the brand master in Figma (public/brand/canary-cove-logo-official.png).
// The canary and glass keep their brand colors in both variants; only the
// wordmark switches: ink on light surfaces, white on dark ones.
const LOGO_SRC = {
  ink: "/brand/canary-cove-logo.svg",
  light: "/brand/canary-cove-logo-light.svg",
} as const

// Intrinsic viewBox ratio of the lockup (371 × 318).
export const LOGO_ASPECT = 371 / 318

type BrandMarkProps = {
  className?: string
  /** Rendered logo height in px; width follows the lockup's aspect ratio. */
  height?: number
  tone?: "ink" | "light"
  priority?: boolean
  /** Render as a plain image (no home link), e.g. inside an existing link. */
  asImage?: boolean
}

export function BrandLogo({
  height = 52,
  tone = "ink",
  priority = false,
  className,
}: Omit<BrandMarkProps, "asImage">) {
  return (
    <Image
      src={LOGO_SRC[tone]}
      alt="Canary Cove"
      width={Math.round(height * LOGO_ASPECT)}
      height={height}
      priority={priority}
      unoptimized
      draggable={false}
      className={cn("block h-auto select-none", className)}
    />
  )
}

export function BrandMark({ className, height = 52, tone = "ink", priority = false, asImage = false }: BrandMarkProps) {
  const logo = <BrandLogo height={height} tone={tone} priority={priority} className="h-full w-auto" />
  if (asImage) return <span className={cn("inline-flex", className)}>{logo}</span>

  return (
    <Link
      href="/"
      aria-label="Canary Cove home"
      className={cn(
        "group focus-ring inline-flex shrink-0 items-center rounded-lg transition-transform duration-500 ease-[var(--ease-out-expo)] motion-safe:active:scale-[0.97]",
        className,
      )}
    >
      {logo}
    </Link>
  )
}

/** The canary alone, in brand colors (decorative accent; aspect 200 × 130). */
export function BrandBird({ className, height = 40 }: { className?: string; height?: number }) {
  return (
    <Image
      src="/brand/canary-cove-bird.svg"
      alt=""
      aria-hidden="true"
      width={Math.round((height * 200) / 130)}
      height={height}
      unoptimized
      draggable={false}
      style={{ height, width: "auto" }}
      className={cn("block select-none", className)}
    />
  )
}
