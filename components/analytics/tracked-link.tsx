"use client"

import Link, { type LinkProps } from "next/link"
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react"

import { trackEvent, type AnalyticsPayload } from "@/lib/analytics"

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    eventName: string
    eventPayload?: AnalyticsPayload
  }

export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(function TrackedLink(
  { eventName, eventPayload, onClick, ...props },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, eventPayload)
    onClick?.(event)
  }

  return <Link ref={ref} onClick={handleClick} {...props} />
})

TrackedLink.displayName = "TrackedLink"
