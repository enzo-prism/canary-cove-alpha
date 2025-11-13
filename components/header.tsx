"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const stayItems = [
  { title: "Overview", href: "/stay" },
  { title: "Suites", href: "/stay/suites" },
  { title: "Villa", href: "/stay/villa" },
  { title: "Amenities", href: "/stay/amenities" },
]

const experiencesItems = [
  {
    category: "On the Water",
    items: [
      { title: "Power-Boating", href: "/experiences/power-boating" },
      { title: "Diving & Fishing", href: "/experiences/diving-fishing" },
      { title: "Boats & Crew", href: "/experiences/boats-crew" },
    ],
  },
  {
    category: "Land & Relaxation",
    items: [
      { title: "Land Activities", href: "/experiences/land" },
      { title: "Day Trips & Certifications", href: "/experiences/day-trips" },
    ],
  },
]

const diningItems = [
  { title: "Overview", href: "/dining" },
  { title: "Breakfast & Snacks", href: "/dining/breakfast" },
  { title: "Special Moments", href: "/dining/special-moments" },
  { title: "Private Chef", href: "/dining/private-chef" },
  { title: "Provisioning", href: "/dining/provisioning" },
  { title: "Eating Out", href: "/dining/eating-out" },
]

const aboutItems = [
  { title: "About", href: "/about" },
  { title: "Reviews", href: "/about/reviews" },
  { title: "Getting Here", href: "/about/getting-here" },
  { title: "FAQ", href: "/about/faq" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif tracking-tight">
            Canary Cove
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {/* Stay */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Stay</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-3 p-4">
                    {stayItems.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Experiences */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Experiences</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-4 p-6">
                    {experiencesItems.map((group) => (
                      <div key={group.category}>
                        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{group.category}</h4>
                        <ul className="space-y-2">
                          {group.items.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{item.title}</div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Dining */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Dining</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-3 p-4">
                    {diningItems.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Gallery */}
              <NavigationMenuItem>
                <Link href="/gallery" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn("px-4 py-2 text-sm font-medium transition-colors hover:text-primary")}
                  >
                    Gallery
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Rates */}
              <NavigationMenuItem>
                <Link href="/rates" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn("px-4 py-2 text-sm font-medium transition-colors hover:text-primary")}
                  >
                    Rates
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* About */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-3 p-4">
                    {aboutItems.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Contact Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button asChild className="hidden lg:inline-flex">
              <Link href="/contact">Contact</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <nav className="flex flex-col gap-6 mt-8">
                  <MobileNavSection title="Stay" items={stayItems} />
                  <MobileNavSection title="Experiences" items={experiencesItems.flatMap((g) => g.items)} />
                  <MobileNavSection title="Dining" items={diningItems} />
                  <Link href="/gallery" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    Gallery
                  </Link>
                  <Link href="/rates" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    Rates
                  </Link>
                  <MobileNavSection title="About" items={aboutItems} />
                  <Button asChild className="mt-4">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      Contact
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileNavSection({ title, items }: { title: string; items: Array<{ title: string; href: string }> }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-lg font-medium"
      >
        {title}
        <ChevronDown className={cn("h-5 w-5 transition-transform", isExpanded && "rotate-180")} />
      </button>
      {isExpanded && (
        <ul className="mt-3 space-y-3 pl-4">
          {items.map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
