export type DropdownItem = {
  label: string
  href: string
  caption: string
  /** Renders an external indicator; the link still navigates in the same tab. */
  external?: boolean
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
  {
    type: "dropdown",
    label: "Stay",
    href: "/stay",
    items: [
      { label: "The Villa", href: "/stay", caption: "Three suites, pool, and grounds" },
      {
        label: "Main House",
        href: "/stay/main-house",
        caption: "Returning guests",
        external: true,
      },
      { label: "Rates", href: "/rates", caption: "Seasons, suites, and inclusions" },
    ],
  },
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
  { type: "link", label: "Reviews", href: "/reviews" },
  { type: "link", label: "Getting Here", href: "/getting-here" },
  { type: "link", label: "Contact", href: "/contact" },
  { type: "link", label: "Book", href: "/book", cta: true },
]
