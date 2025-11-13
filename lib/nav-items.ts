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
  {
    type: "dropdown",
    label: "Stay",
    href: "/stay",
    items: [
      { label: "Overview", href: "/stay", caption: "Stay" },
      { label: "Suites", href: "/stay/suites", caption: "Stay" },
      { label: "Villa", href: "/stay/villa", caption: "Stay" },
      { label: "Amenities", href: "/stay/amenities", caption: "Stay" },
    ],
  },
  {
    type: "dropdown",
    label: "Experience",
    href: "/experiences",
    items: [
      { label: "Overview", href: "/experiences", caption: "Experience" },
      { label: "Power-Boating", href: "/experiences/power-boating", caption: "Experience" },
      { label: "Land & Relaxation", href: "/experiences/land", caption: "Experience" },
      { label: "On the Water", href: "/experiences/on-the-water", caption: "Experience" },
      { label: "Diving & Fishing", href: "/experiences/diving-fishing", caption: "Experience" },
    ],
  },
  {
    type: "dropdown",
    label: "Dining",
    href: "/dining",
    items: [
      { label: "Overview", href: "/dining", caption: "Dining" },
      { label: "Breakfast & Snacks", href: "/dining/breakfast", caption: "Dining" },
      { label: "Special Moments", href: "/dining/special-moments", caption: "Dining" },
      { label: "Private Chef", href: "/dining/private-chef", caption: "Dining" },
      { label: "Provisioning", href: "/dining/provisioning", caption: "Dining" },
      { label: "Eating Out", href: "/dining/eating-out", caption: "Dining" },
    ],
  },
  {
    type: "dropdown",
    label: "Adventures",
    href: "/adventures",
    items: [
      { label: "Overview", href: "/adventures", caption: "Adventures" },
      { label: "Fishing", href: "/adventures/fishing", caption: "Adventures" },
      { label: "Day Trips & Certifications", href: "/adventures/day-trips", caption: "Adventures" },
      { label: "Diving", href: "/adventures/diving", caption: "Adventures" },
      { label: "Boats & Crew", href: "/adventures/boats-crew", caption: "Adventures" },
    ],
  },
  {
    type: "dropdown",
    label: "About",
    href: "/about",
    items: [
      { label: "Rates", href: "/rates", caption: "About" },
      { label: "Gallery", href: "/gallery", caption: "About" },
      { label: "Reviews", href: "/about/reviews", caption: "About" },
      { label: "About", href: "/about", caption: "About" },
      { label: "Getting Here", href: "/about/getting-here", caption: "About" },
      { label: "FAQ", href: "/about/faq", caption: "About" },
    ],
  },
  { type: "link", label: "Contact", href: "/contact", cta: true },
]
