import type { Metadata } from "next"

import { IMAGES } from "@/lib/images"
import { SITE_NAME } from "@/lib/site-config"

type PageSeoConfig = {
  title: string
  description: string
  path: string
  image?: string
}

const DEFAULT_SEO_IMAGE = IMAGES.heroVillaSeating.src

export const HOME_SEO = {
  title: "Private All-Inclusive Estate in Belize | Canary Cove",
  description:
    "Discover a private, fully staffed beachfront estate on Ambergris Caye with chef service, boats, dock access, and stays reserved for one group at a time.",
  path: "/",
  image: IMAGES.heroVillaSeating.src,
} as const

export const createPageMetadata = ({
  title,
  description,
  path,
  image = DEFAULT_SEO_IMAGE,
}: PageSeoConfig): Metadata => ({
  title,
  description,
  alternates: {
    canonical: path,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    url: path,
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  },
})

export const PAGE_METADATA = {
  home: createPageMetadata(HOME_SEO),
  stay: createPageMetadata({
    title: "Private Beachfront Villa in Belize | Canary Cove",
    description:
      "Explore the villa interiors, outdoor grounds, private docks, pool, and all-inclusive service at Canary Cove on Ambergris Caye.",
    path: "/stay",
    image: IMAGES.villaPool.src,
  }),
  rates: createPageMetadata({
    title: "Belize Estate Rates & Add-On Pricing | Canary Cove",
    description:
      "Review seasonal rates for suites or full-estate stays, plus pricing for boats, fishing, diving, and other Canary Cove add-ons.",
    path: "/rates",
    image: IMAGES.villaPool.src,
  }),
  book: createPageMetadata({
    title: "Check Availability & Book Your Stay | Canary Cove",
    description:
      "View the live calendar, request your dates, and review payment, cancellation, and booking details for Canary Cove.",
    path: "/book",
    image: IMAGES.villaLawn.src,
  }),
  dining: createPageMetadata({
    title: "Private Chef Dining in Belize | Canary Cove",
    description:
      "See how dining works at Canary Cove, from stocked breakfasts to chef-prepared lunches, dinners, and beach picnics.",
    path: "/dining",
    image: IMAGES.chefCarry.src,
  }),
  experiences: createPageMetadata({
    title: "Belize Experiences & Included Amenities | Canary Cove",
    description:
      "See what is included with your stay, from kayaks and snorkel gear to pool time, dock days, and bookable island adventures.",
    path: "/experiences",
    image: IMAGES.divingFun.src,
  }),
  adventures: createPageMetadata({
    title: "Belize Adventures: Diving, Fishing & Sandbars | Canary Cove",
    description:
      "Plan reef dives, fishing charters, tubing, and sandbar days from your private dock with local crews arranged by Canary Cove.",
    path: "/adventures",
    image: IMAGES.scubaPhoto.src,
  }),
  gettingHere: createPageMetadata({
    title: "How to Get to Canary Cove in Belize | Travel Guide",
    description:
      "Follow the step-by-step route from Belize City to San Pedro and the final boat transfer to Canary Cove on Ambergris Caye.",
    path: "/getting-here",
    image: IMAGES.sanPedroWelcome.src,
  }),
  contact: createPageMetadata({
    title: "Contact Canary Cove | Booking Questions & Trip Planning",
    description:
      "Contact Canary Cove for availability, booking questions, pricing, and travel planning support for your Belize stay.",
    path: "/contact",
    image: IMAGES.heroVillaSeating.src,
  }),
  about: createPageMetadata({
    title: "About the Estate & On-Site Team | Canary Cove",
    description:
      "Learn about the family behind Canary Cove and the on-site team that handles arrivals, service, and your stay in Belize.",
    path: "/about",
    image: IMAGES.romanticViews.src,
  }),
  privacy: createPageMetadata({
    title: "Privacy Policy | Canary Cove",
    description:
      "Read how Canary Cove handles inquiry details, booking requests, analytics, and the third-party tools used on the website.",
    path: "/privacy",
  }),
  terms: createPageMetadata({
    title: "Terms of Use | Canary Cove",
    description:
      "Review the terms for using the Canary Cove website, submitting inquiries, and interacting with embedded third-party services.",
    path: "/terms",
  }),
} as const
