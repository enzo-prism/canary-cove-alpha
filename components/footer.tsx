import Link from "next/link"

import { NAV_ITEMS } from "@/lib/nav-items"
import { cn } from "@/lib/utils"

const primarySections = NAV_ITEMS.filter((item) => item.type === "dropdown").map((item) => ({
  title: item.label,
  links: item.items.map((link) => ({
    label: link.label,
    href: link.href,
  })),
}))

const directLinks = NAV_ITEMS.filter((item) => item.type === "link").map((item) => ({
  label: item.label,
  href: item.href,
  cta: item.cta,
}))

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/85 px-4 py-20 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">CC</span>
              Canary Cove
            </div>
            <p className="mt-4 text-sm uppercase tracking-[0.35em] text-muted-foreground">Private Island Estate</p>
            <h3 className="mt-2 text-3xl font-semibold leading-tight text-foreground">
              Where silence, light, and water are curated.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Direct concierge:{" "}
              <a href="mailto:hello@canarycove.com" className="text-foreground underline-offset-4 hover:underline">
                hello@canarycove.com
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="rounded-full border border-border/80 px-4 py-2">17.25° N, 88.45° W</div>
            <div className="rounded-full border border-border/80 px-4 py-2">Private airstrip access</div>
            <div className="rounded-full border border-border/80 px-4 py-2">Four-villa campus</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-border/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Field Notes</p>
            <h4 className="mt-4 text-2xl font-semibold text-foreground">Seasonal intelligence, no noise.</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Receive spatial itineraries, heli-charter alerts, and chef-in-residence drops before they open to the public.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@email.com"
                className="h-12 flex-1 rounded-full border border-border/80 bg-white/90 px-5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Join Briefing
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">Zero spam. Unsubscribe anytime.</p>
          </div>
          <div className="rounded-[32px] border border-border/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Explore</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {primarySections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="transition-colors hover:text-foreground">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {directLinks.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Direct</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {directLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "transition-colors hover:text-foreground",
                            link.cta && "text-primary font-semibold",
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Canary Cove. Crafted for discerning explorers.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
