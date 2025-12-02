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
  { type: "link", label: "Home", href: "/" },
  { type: "link", label: "Stay", href: "/stay" },
  { type: "link", label: "Experience", href: "/experiences" },
  { type: "link", label: "Dining", href: "/dining" },
  { type: "link", label: "Adventures", href: "/adventures" },
  { type: "link", label: "About", href: "/about" },
  { type: "link", label: "Book", href: "/book", cta: true },
  { type: "link", label: "Contact", href: "/contact", cta: true },
]
