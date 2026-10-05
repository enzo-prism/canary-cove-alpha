import type { CSSProperties } from "react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { BrandMark } from "@/components/brand-mark"
import { FacebookLink } from "@/components/facebook-link"
import { LocalTime } from "@/components/motion/local-time"
import { CtaLink } from "@/components/ui/cta-link"

const FOOTER_GROUPS = [
  {
    title: "Stay",
    links: [
      { href: "/stay", label: "The Villa" },
      { href: "/rates", label: "Rates" },
      { href: "/book", label: "Book" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/experiences", label: "Experiences" },
      { href: "/dining", label: "Dining" },
      { href: "/adventures", label: "Adventures" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Plan",
    links: [
      { href: "/reviews", label: "Reviews" },
      { href: "/getting-here", label: "Getting Here" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const

const linkClass =
  "link-underline inline-flex min-h-11 items-center text-[15px] text-reef-foreground/75 transition-colors duration-300 hover:text-reef-foreground pointer-fine:min-h-0"

type FooterProps = {
  /**
   * Show the booking prompt band. Off by default: most pages close with their
   * own CTA, and /book, /contact and the legal pages should not get one.
   */
  cta?: boolean
}

export function Footer({ cta = false }: FooterProps) {
  return (
    <footer className="surface-reef relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-20 sm:pt-24 lg:pt-28">
        {cta ? (
        <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
          <div data-reveal="up" className="flow flow-lg">
            <p className="eyebrow text-white/65">Your dates, our cove</p>
            <p className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-white">
              Your own stretch of
              <br />
              <span className="italic-accent text-canary">Ambergris Caye.</span>
            </p>
          </div>
          <div
            data-reveal="up"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end"
          >
            <CtaLink
              href="/book"
              variant="canary"
              size="lg"
              eventName="cta_click"
              eventPayload={{ location: "footer", target: "/book" }}
              className="w-full justify-between sm:w-auto"
            >
              Request your dates
            </CtaLink>
            <CtaLink
              href="/contact"
              variant="outline-light"
              size="lg"
              arrow="none"
              eventName="cta_click"
              eventPayload={{ location: "footer", target: "/contact" }}
              className="w-full sm:w-auto"
            >
              Ask a question
            </CtaLink>
          </div>
        </div>

        ) : null}

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,0.7fr)] lg:gap-10">
          <div className="flow flow-md text-[15px] text-reef-foreground/75">
            <BrandMark tone="light" height={120} className="h-[104px] self-start sm:h-[120px]" />
            <p className="max-w-sm leading-relaxed">
              A fully staffed beachfront estate on Ambergris Caye, Belize. One private booking at a time.
            </p>
            <p className="tabular text-[13px] uppercase tracking-[0.16em] text-reef-foreground/60">
              17° 59.914′ N · 87° 54.901′ W
            </p>
            <ul className="flow flow-xs">
              <li>
                Call Gil:{" "}
                <a href="tel:+5016105121" className={linkClass}>
                  011 501-610-5121
                </a>
              </li>
              <li>
                Consi:{" "}
                <a href="tel:+5016267534" className={linkClass}>
                  011 501-626-7534
                </a>
              </li>
            </ul>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-reef-foreground/60">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-canary" />
              Local time <LocalTime className="text-white" />
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={`${group.title} links`} className="flow flow-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-reef-foreground/55">{group.title}</p>
              <ul className="flow gap-0 sm:gap-3.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <TrackedLink
                      href={link.href}
                      eventName="nav_click"
                      eventPayload={{ surface: "footer", destination: link.href }}
                      className={linkClass}
                    >
                      {link.label}
                    </TrackedLink>
                  </li>
                ))}
                {group.title === "Plan" ? (
                  <li>
                    <FacebookLink className={linkClass} />
                  </li>
                ) : null}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* The canary from the official logo, as a faint silhouette perched on
          the footer's lower edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 right-[-4vw] w-[min(560px,62vw)] select-none sm:-bottom-10">
        <div data-reveal="up" style={{ "--reveal-delay": "200ms" } as CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/canary-cove-bird-silhouette-light.svg" alt="" className="w-full opacity-[0.06]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-3 px-[var(--gutter)] pb-10 pt-6 text-xs text-reef-foreground/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Canary Cove. All rights reserved.</p>
        <div className="flex gap-5">
          <TrackedLink
            href="/privacy"
            eventName="nav_click"
            eventPayload={{ surface: "footer_legal", destination: "/privacy" }}
            className="link-underline inline-flex min-h-11 items-center hover:text-white pointer-fine:min-h-0"
          >
            Privacy
          </TrackedLink>
          <TrackedLink
            href="/terms"
            eventName="nav_click"
            eventPayload={{ surface: "footer_legal", destination: "/terms" }}
            className="link-underline inline-flex min-h-11 items-center hover:text-white pointer-fine:min-h-0"
          >
            Terms
          </TrackedLink>
        </div>
      </div>
    </footer>
  )
}
