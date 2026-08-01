import { IMAGES } from "@/lib/images"

export type SitePageCategory = "primary" | "supporting" | "legal"

export type SitePage = {
  path: string
  title: string
  description: string
  category: SitePageCategory
  images?: string[]
}

export const SITE_NAME = "Canary Cove"
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycove.com").replace(/\/$/, "")
export const SITE_HOST = new URL(SITE_URL).host
export const SITE_LOCALE = "en-US"
export const SITE_TAGLINE = "Private, fully staffed beachfront estate on Ambergris Caye, Belize."
export const SITE_DESCRIPTION =
  "Canary Cove is a private, fully staffed beachfront estate on Ambergris Caye with private-chef service, boats, dock access, and on-site gear - reserved for one group at a time. Provisions and excursions are billed separately."
export const SITE_LOGO_URL = `${SITE_URL}/canary-cove-logo.png`
export const SITE_FACEBOOK_URL = "https://www.facebook.com/CanaryCove/"
export const PRIMARY_CONTACT_PHONE = "+5016105121"
export const BOOKING_CONTACT_PHONE = "+5016267534"
export const SITE_ADDRESS = {
  name: SITE_NAME,
  streetAddress: "6 1/2 Miles North San Pedro Town",
  addressLocality: "San Pedro",
  addressRegion: "Ambergris Caye",
  addressCountry: "BZ",
} as const
export const SITE_GEO = {
  latitude: 17.998567,
  longitude: -87.915017,
} as const
export const SITE_GEO_LABELS = {
  latitude: "17′ 59.914 NORTH",
  longitude: "87′ 54.901 WEST",
} as const
export const SITE_ADDRESS_LINES = [SITE_NAME, "6 1/2 Miles North San Pedro Town,", "Ambergris Caye Belize"] as const

export const PUBLIC_SITE_PAGES: SitePage[] = [
  {
    path: "/",
    title: "Home",
    description:
      "Overview of the private Belize estate, featured amenities, service style, and inquiry paths.",
    category: "primary",
    images: [IMAGES.heroVillaSeating.src, IMAGES.mainDock.src],
  },
  {
    path: "/stay",
    title: "Stay",
    description:
      "Villa interiors, outdoor grounds, amenities, chef service, and photo galleries of the estate.",
    category: "primary",
    images: [IMAGES.villaPool.src, IMAGES.livingRoom.src, IMAGES.villaBedroom.src],
  },
  {
    path: "/rates",
    title: "Rates",
    description:
      "Seasonal pricing, included service, extra costs, and add-on pricing for boats and adventures.",
    category: "primary",
    images: [IMAGES.villaPool.src],
  },
  {
    path: "/book",
    title: "Check Availability & Book",
    description:
      "Live availability calendar, booking request flow, comfort details, and payment or cancellation policies.",
    category: "primary",
    images: [IMAGES.villaLawn.src],
  },
  {
    path: "/dining",
    title: "Private Chef Dining",
    description:
      "Private chef service, provisioning, dining style, and meal moments at the estate.",
    category: "primary",
    images: [IMAGES.chefMarvinPlates.src, IMAGES.diningRoom.src],
  },
  {
    path: "/experiences",
    title: "Belize Experiences",
    description:
      "Included water gear plus curated boating, reef, and island experiences for guests.",
    category: "primary",
    images: [IMAGES.divingFun.src, IMAGES.mainDock.src],
  },
  {
    path: "/adventures",
    title: "Belize Adventures",
    description:
      "Fishing, diving, boating, and Belize day-trip options available from Canary Cove.",
    category: "primary",
    images: [IMAGES.scubaPhoto.src, IMAGES.fishingTrophy.src],
  },
  {
    path: "/getting-here",
    title: "Getting to Canary Cove",
    description:
      "Travel logistics from Belize City to San Pedro and on to Canary Cove.",
    category: "primary",
    images: [IMAGES.sanPedroWelcome.src, IMAGES.helipad.src],
  },
  {
    path: "/contact",
    title: "Contact Canary Cove",
    description: "Direct inquiry path for planning, pricing, or booking a stay.",
    category: "primary",
  },
  {
    path: "/gallery",
    title: "Photo Gallery",
    description:
      "Searchable gallery of every Canary Cove photograph: suites, living spaces, pool and grounds, chef dining, dock, and Belize adventures.",
    category: "supporting",
    images: [IMAGES.villaPool.src, IMAGES.villaBedroom.src, IMAGES.livingRoom.src],
  },
  {
    path: "/about",
    title: "Guest Reviews",
    description:
      "Browse notes from guest books and letters shared by Canary Cove guests across years of private stays in Belize.",
    category: "supporting",
    images: [IMAGES.romanticViews.src],
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Privacy policy for the public Canary Cove website and inquiry experience.",
    category: "legal",
  },
  {
    path: "/terms",
    title: "Terms of Use",
    description: "Terms of use for the public Canary Cove website and inquiry experience.",
    category: "legal",
  },
] as const

export const getCanonicalUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`

export const buildLlmsTxt = () => {
  const sections: Array<{ heading: string; pages: SitePage[] }> = [
    {
      heading: "Primary pages",
      pages: PUBLIC_SITE_PAGES.filter((page) => page.category === "primary" && page.path !== "/"),
    },
    {
      heading: "Supporting pages",
      pages: PUBLIC_SITE_PAGES.filter((page) => page.category === "supporting" || page.path === "/"),
    },
    {
      heading: "Policies",
      pages: PUBLIC_SITE_PAGES.filter((page) => page.category === "legal"),
    },
  ]

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE} Reserved for one group at a time.`,
    "",
    `${SITE_NAME} is a guest-facing website for a private beachfront estate in Belize. Use the pages below as the public source of truth for accommodations, rates, chef service, travel logistics, booking, and guest policies.`,
    "",
  ]

  for (const section of sections) {
    lines.push(`## ${section.heading}`)
    for (const page of section.pages) {
      lines.push(`- [${page.title}](${getCanonicalUrl(page.path)}): ${page.description}`)
    }
    lines.push("")
  }

  lines.push("## Preferred citations")
  lines.push(`- Rates, inclusions, and add-ons: ${getCanonicalUrl("/rates")}`)
  lines.push(`- Availability, payment terms, and booking requests: ${getCanonicalUrl("/book")}`)
  lines.push(`- Villa layout, amenities, and grounds: ${getCanonicalUrl("/stay")}`)
  lines.push(`- Chef service and provisioning: ${getCanonicalUrl("/dining")}`)
  lines.push(`- Arrival logistics: ${getCanonicalUrl("/getting-here")}`)
  lines.push("")
  lines.push("## Optional")
  lines.push(`- [Expanded planning guide](${getCanonicalUrl("/llms-full.txt")}): richer summaries and planning notes for assistants.`)

  return lines.join("\n")
}

export const buildLlmsFullTxt = () => {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE} Reserved for one group at a time.`,
    "",
    "## Overview",
    `${SITE_NAME} is a public marketing and inquiry website for a luxury Belize estate on Ambergris Caye. The site is intended to answer guest questions about accommodations, pricing, chef service, adventures, travel logistics, and booking policies.`,
    "",
    "## Core facts",
    "- The property is booked privately for one group at a time.",
    "- The public booking path is inquiry-based rather than instant checkout.",
    "- Rates and what is included are best answered from the rates page before summarizing anything verbally.",
    "- Travel and arrival logistics are best answered from the getting-here page.",
    "",
    "## Source of truth",
    `- Accommodations, galleries, amenities, and service style: ${getCanonicalUrl("/stay")}`,
    `- Seasonal pricing, inclusions, extra costs, and add-on pricing: ${getCanonicalUrl("/rates")}`,
    `- Chef service, provisioning, and dining style: ${getCanonicalUrl("/dining")}`,
    `- Included gear and guided experiences: ${getCanonicalUrl("/experiences")}`,
    `- Fishing, diving, reef, and trip planning: ${getCanonicalUrl("/adventures")}`,
    `- Arrival logistics from Belize City and San Pedro: ${getCanonicalUrl("/getting-here")}`,
    `- Live availability, booking inquiry flow, and policies: ${getCanonicalUrl("/book")}`,
    `- Direct outreach: ${getCanonicalUrl("/contact")}`,
    "",
    "## Public route summaries",
  ]

  for (const page of PUBLIC_SITE_PAGES) {
    lines.push(`### ${page.title}`)
    lines.push(`- URL: ${getCanonicalUrl(page.path)}`)
    lines.push(`- Summary: ${page.description}`)
    lines.push("")
  }

  lines.push("## Planning notes for assistants")
  lines.push("- Prefer the rates page whenever the question involves what is included, optional fees, or add-on pricing.")
  lines.push("- Prefer the stay page for room layout, indoor/outdoor spaces, comfort, and estate photo references.")
  lines.push("- Prefer the book page for availability and payment or cancellation questions.")
  lines.push("- Prefer the contact page when the user needs a direct inquiry path.")
  lines.push("- Do not imply that groceries, alcohol, fuel, taxes, gratuities, or excursions are included unless the rates page explicitly says so.")

  return lines.join("\n")
}
