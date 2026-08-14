export type DropdownItem = {
  label: string
  href: string
  caption: string
}

export type NavItem =
  | {
      type: "link"
      label: string
      href: string
      cta?: boolean
    }
  | {
      type: "dropdown"
      label: string
      href: string
      items: DropdownItem[]
    }

export const NAV_ITEMS: NavItem[] = [
  { type: "link", label: "Stay", href: "/stay" },
  { type: "link", label: "Rates", href: "/rates" },
  {
    type: "dropdown",
    label: "Explore",
    href: "/experiences",
    items: [
      { label: "Experiences", href: "/experiences", caption: "Water, land, and dock days" },
      { label: "Dining", href: "/dining", caption: "Private chef service" },
      { label: "Adventures", href: "/adventures", caption: "Reef, fishing, and day trips" },
      { label: "Gallery", href: "/gallery", caption: "Every photograph of the estate" },
    ],
  },
  { type: "link", label: "Reviews", href: "/about" },
  { type: "link", label: "Getting Here", href: "/getting-here" },
  { type: "link", label: "Book", href: "/book", cta: true },
  { type: "link", label: "Contact", href: "/contact", cta: true },
]
