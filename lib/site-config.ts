import type { MetadataRoute } from "next"

import { IMAGES } from "@/lib/images"

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>

export type SitePageCategory = "primary" | "supporting" | "legal"

export type SitePage = {
  path: string
  title: string
  description: string
  changeFrequency: ChangeFrequency
  priority: number
  category: SitePageCategory
  images?: string[]
}

export const SITE_NAME = "Canary Cove"
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.canarycove.com").replace(/\/$/, "")
export const SITE_HOST = new URL(SITE_URL).host
export const SITE_TAGLINE = "Private, fully staffed beachfront estate on Ambergris Caye, Belize."
export const SITE_DESCRIPTION =
  "Canary Cove is a private, fully staffed beachfront estate on Ambergris Caye with private-chef service, boats, dock access, and on-site gear - reserved for one group at a time. Provisions and excursions are billed separately."

export const PUBLIC_SITE_PAGES: SitePage[] = [
  {
    path: "/",
    title: "Home",
    description:
      "Overview of the private Belize estate, featured amenities, service style, and inquiry paths.",
    changeFrequency: "weekly",
    priority: 1,
    category: "primary",
    images: [IMAGES.heroVillaSeating.src, IMAGES.mainDock.src],
  },
  {
    path: "/stay",
    title: "Stay",
    description:
      "Villa interiors, outdoor grounds, amenities, all-inclusive service, and photo galleries of the estate.",
    changeFrequency: "weekly",
    priority: 0.95,
    category: "primary",
    images: [IMAGES.villaPool.src, IMAGES.livingRoom.src, IMAGES.villaBedroom.src],
  },
  {
    path: "/rates",
    title: "Rates",
    description:
      "Seasonal pricing, included service, extra costs, and add-on pricing for boats and adventures.",
    changeFrequency: "weekly",
    priority: 0.9,
    category: "primary",
    images: [IMAGES.villaPool.src],
  },
  {
    path: "/book",
    title: "Book",
    description:
      "Live availability calendar, booking request flow, comfort details, and payment or cancellation policies.",
    changeFrequency: "weekly",
    priority: 0.9,
    category: "primary",
    images: [IMAGES.villaLawn.src],
  },
  {
    path: "/dining",
    title: "Dining",
    description:
      "Private chef service, provisioning, dining style, and meal moments at the estate.",
    changeFrequency: "monthly",
    priority: 0.82,
    category: "primary",
    images: [IMAGES.chefCarry.src, IMAGES.diningRoom.src],
  },
  {
    path: "/experiences",
    title: "Experiences",
    description:
      "Included water gear plus curated boating, reef, and island experiences for guests.",
    changeFrequency: "monthly",
    priority: 0.8,
    category: "primary",
    images: [IMAGES.divingFun.src, IMAGES.mainDock.src],
  },
  {
    path: "/adventures",
    title: "Adventures",
    description:
      "Fishing, diving, boating, and Belize day-trip options available from Canary Cove.",
    changeFrequency: "monthly",
    priority: 0.78,
    category: "primary",
    images: [IMAGES.scubaPhoto.src, IMAGES.fishingTrophy.src],
  },
  {
    path: "/getting-here",
    title: "Getting Here",
    description:
      "Travel logistics from Belize City to San Pedro and on to Canary Cove.",
    changeFrequency: "monthly",
    priority: 0.76,
    category: "primary",
    images: [IMAGES.sanPedroWelcome.src, IMAGES.helipad.src],
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Direct inquiry path for planning, pricing, or booking a stay.",
    changeFrequency: "monthly",
    priority: 0.72,
    category: "primary",
  },
  {
    path: "/about",
    title: "About",
    description:
      "Background on the estate, guest experience, and the overall Canary Cove hospitality approach.",
    changeFrequency: "monthly",
    priority: 0.68,
    category: "supporting",
    images: [IMAGES.romanticViews.src],
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Privacy policy for the public Canary Cove website and inquiry experience.",
    changeFrequency: "yearly",
    priority: 0.3,
    category: "legal",
  },
  {
    path: "/terms",
    title: "Terms & Conditions",
    description: "Terms and conditions for stays and website use.",
    changeFrequency: "yearly",
    priority: 0.3,
    category: "legal",
  },
] as const

export const getCanonicalUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`

export const BUILD_LAST_MODIFIED = new Date()

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
