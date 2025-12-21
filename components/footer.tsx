import Link from "next/link"

import { FacebookLink } from "@/components/facebook-link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/85 px-4 py-14 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl xl:max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-semibold text-foreground">Canary Cove</h3>
          <p className="text-sm text-muted-foreground">
            Private, fully staffed beachfront estate on Ambergris Caye. One booking at a time.
          </p>
          <p className="text-sm text-muted-foreground">17′ 59.914 NORTH · 87′ 54.901 WEST</p>
          <p className="text-sm text-muted-foreground">Call Gil: 011 501-610-5121 · Consi: 011 501-626-7534</p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/stay">Stay</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/experiences">Experiences</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/dining">Dining</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/adventures">Adventures</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/about">About</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/book">Book</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/contact">Contact</Link>
          </Button>
          <FacebookLink />
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
