import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/85 px-4 py-14 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-semibold text-foreground">Canary Cove</h3>
          <p className="text-sm text-muted-foreground">
            Private, all-inclusive beachfront estate on Ambergris Caye. One booking at a time.
          </p>
          <p className="text-sm text-muted-foreground">17′ 59.914 NORTH · 87′ 54.901 WEST</p>
          <p className="text-sm text-muted-foreground">
            Email{" "}
            <a href="mailto:hello@canarycove.com" className="text-foreground underline-offset-4 hover:underline">
              hello@canarycove.com
            </a>{" "}
            or call Gil: 011 501-610-5121 · Consi: 011 501-626-7534
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/stay" className="rounded-full border border-border/60 px-4 py-2 hover:text-foreground">
            Stay
          </Link>
          <Link href="/experiences" className="rounded-full border border-border/60 px-4 py-2 hover:text-foreground">
            Experiences
          </Link>
          <Link href="/dining" className="rounded-full border border-border/60 px-4 py-2 hover:text-foreground">
            Dining
          </Link>
          <Link href="/adventures" className="rounded-full border border-border/60 px-4 py-2 hover:text-foreground">
            Adventures
          </Link>
          <Link href="/about" className="rounded-full border border-border/60 px-4 py-2 hover:text-foreground">
            About
          </Link>
          <Link href="/book" className="rounded-full border border-border/60 px-4 py-2 hover:text-foreground">
            Book
          </Link>
          <Link href="/contact" className="rounded-full border border-border/60 px-4 py-2 hover:text-foreground">
            Contact
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Canary Cove. All rights reserved.</p>
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
