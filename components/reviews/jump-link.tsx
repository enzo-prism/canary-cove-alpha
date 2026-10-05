"use client"

import type { ReactNode } from "react"

import { trackSectionJump } from "@/lib/analytics"

type JumpLinkProps = {
  href: `#${string}`
  children: ReactNode
  className?: string
  /** Page name reported with the section_jump event. */
  page?: string
  "aria-current"?: "location" | undefined
  "aria-label"?: string
}

/** In-page anchor that reports a section_jump analytics event. Native anchor behavior is kept. */
export function JumpLink({ href, children, className, page = "reviews", ...rest }: JumpLinkProps) {
  return (
    <a href={href} className={className} onClick={() => trackSectionJump(page, href.slice(1))} {...rest}>
      {children}
    </a>
  )
}
