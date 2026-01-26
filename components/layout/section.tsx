import type React from "react"

import { cn } from "@/lib/utils"

type SectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
  padding?: "default" | "tight" | "loose"
}

const paddingClasses: Record<NonNullable<SectionProps["padding"]>, string> = {
  default: "py-20 sm:py-28 lg:py-32",
  tight: "py-16 sm:py-20 lg:py-24",
  loose: "py-24 sm:py-32 lg:py-40",
}

export function Section({ children, className, id, padding = "default" }: SectionProps) {
  return (
    <section id={id} className={cn(paddingClasses[padding], className)}>
      {children}
    </section>
  )
}
