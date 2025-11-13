import Link from "next/link"

const columns = [
  {
    title: "Plan",
    links: [
      { label: "Suites & Villa", href: "/stay" },
      { label: "Experiences", href: "/experiences" },
      { label: "Cuisine", href: "/dining" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Logistics",
    links: [
      { label: "Rates & availability", href: "/rates" },
      { label: "Getting here", href: "/about/getting-here" },
      { label: "FAQ", href: "/about/faq" },
      { label: "Contact concierge", href: "/contact" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-white/70 px-4 py-16 backdrop-blur">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Canary Cove</p>
            <h3 className="mt-3 text-3xl font-semibold text-foreground">Where silence, light, and water are curated.</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Direct concierge: <a href="mailto:hello@canarycove.com" className="text-foreground">hello@canarycove.com</a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-border/80 px-4 py-2 text-sm text-muted-foreground">
              Latitude 17.25° N
            </div>
            <div className="rounded-full border border-border/80 px-4 py-2 text-sm text-muted-foreground">
              Private airstrip access
            </div>
          </div>
        </div>

        <div className="grid gap-8 border-y border-border/70 py-8 md:grid-cols-[1fr_0.7fr_0.7fr]">
          <div>
            <p className="text-sm text-muted-foreground">
              Subscribe to intelligence briefings—seasonal releases, design notes, and itineraries filmed in Spatial Video.
            </p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@email.com"
                className="h-11 flex-1 rounded-full border border-border/80 bg-white/70 px-5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Join
              </button>
            </form>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{column.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
