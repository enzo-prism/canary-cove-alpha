import Link from "next/link"

import { FacebookLink } from "@/components/facebook-link"

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
            <p className="text-sm text-muted-foreground">17' 59.914 NORTH - 87' 54.901 WEST</p>
            <p className="text-sm text-muted-foreground">Call Gil: 011 501-610-5121 - Consi: 011 501-626-7534</p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <Link href="/stay" className="hover:text-foreground">
              Stay
            </Link>
            <Link href="/experiences" className="hover:text-foreground">
              Experiences
            </Link>
            <Link href="/dining" className="hover:text-foreground">
              Dining
            </Link>
            <Link href="/adventures" className="hover:text-foreground">
              Adventures
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/book" className="hover:text-foreground">
              Book
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <FacebookLink />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {new Date().getFullYear()} Canary Cove. All rights reserved.</p>
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
