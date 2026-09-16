import { TrackedLink } from "@/components/analytics/tracked-link"
import { FacebookLink } from "@/components/facebook-link"
import { SITE_CONTACTS } from "@/lib/site-config"

const FOOTER_LINKS = [
  { href: "/stay", label: "Stay" },
  { href: "/rates", label: "Rates" },
  { href: "/gallery", label: "Gallery" },
  { href: "/experiences", label: "Experiences" },
  { href: "/dining", label: "Dining" },
  { href: "/adventures", label: "Adventures" },
  { href: "/about", label: "Reviews" },
  { href: "/getting-here", label: "Getting Here" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">Canary Cove</p>
            <h3 className="text-2xl font-semibold text-foreground">Private Belize estate.</h3>
            <p className="text-sm text-muted-foreground">
              Fully staffed beachfront stay on Ambergris Caye. One booking at a time.
            </p>
            <p className="text-sm text-muted-foreground">17&apos; 59.914 NORTH - 87&apos; 54.901 WEST</p>
            <p className="text-sm text-muted-foreground">
              Call{" "}
              <a href={SITE_CONTACTS.gil.telHref} className="underline underline-offset-4 hover:text-foreground">
                {SITE_CONTACTS.gil.name}: {SITE_CONTACTS.gil.internationalLabel}
              </a>
              {" · "}
              <a href={SITE_CONTACTS.consi.telHref} className="underline underline-offset-4 hover:text-foreground">
                {SITE_CONTACTS.consi.name}: {SITE_CONTACTS.consi.internationalLabel}
              </a>
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {FOOTER_LINKS.map((link) => (
              <TrackedLink
                key={link.href}
                href={link.href}
                eventName="nav_click"
                eventPayload={{ surface: "footer", destination: link.href }}
                className="hover:text-foreground"
              >
                {link.label}
              </TrackedLink>
            ))}
            <FacebookLink />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Canary Cove. All rights reserved.</p>
          <div className="flex gap-4">
            <TrackedLink href="/privacy" eventName="nav_click" eventPayload={{ surface: "footer_legal", destination: "/privacy" }} className="hover:text-foreground">
              Privacy
            </TrackedLink>
            <TrackedLink href="/terms" eventName="nav_click" eventPayload={{ surface: "footer_legal", destination: "/terms" }} className="hover:text-foreground">
              Terms
            </TrackedLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
