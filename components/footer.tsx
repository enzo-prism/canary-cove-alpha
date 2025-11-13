import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif mb-4">Canary Cove</h3>
            <p className="text-primary-foreground/80 leading-relaxed">Your exclusive island retreat</p>
          </div>

          {/* Stay */}
          <div>
            <h4 className="font-semibold mb-4">Stay</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link href="/stay" className="hover:text-primary-foreground transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/stay/suites" className="hover:text-primary-foreground transition-colors">
                  Suites
                </Link>
              </li>
              <li>
                <Link href="/stay/villa" className="hover:text-primary-foreground transition-colors">
                  Villa
                </Link>
              </li>
              <li>
                <Link href="/stay/amenities" className="hover:text-primary-foreground transition-colors">
                  Amenities
                </Link>
              </li>
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="font-semibold mb-4">Experiences</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link href="/experiences" className="hover:text-primary-foreground transition-colors">
                  All Experiences
                </Link>
              </li>
              <li>
                <Link href="/experiences/power-boating" className="hover:text-primary-foreground transition-colors">
                  Power-Boating
                </Link>
              </li>
              <li>
                <Link href="/experiences/diving-fishing" className="hover:text-primary-foreground transition-colors">
                  Diving & Fishing
                </Link>
              </li>
              <li>
                <Link href="/dining" className="hover:text-primary-foreground transition-colors">
                  Dining
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link href="/about" className="hover:text-primary-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/rates" className="hover:text-primary-foreground transition-colors">
                  Rates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about/faq" className="hover:text-primary-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Canary Cove. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
