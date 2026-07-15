import type { Metadata } from "next"

import { IMAGES } from "@/lib/images"
import { SITE_NAME, getCanonicalUrl } from "@/lib/site-config"

type PageSeoConfig = {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
}

const DEFAULT_SEO_IMAGE = IMAGES.heroVillaSeating.src
const DEFAULT_SEO_IMAGE_ALT = IMAGES.heroVillaSeating.alt

export const HOME_SEO = {
  title: "Private Belize Estate on Ambergris Caye | Canary Cove",
  description:
    "Discover a private, fully staffed beachfront estate on Ambergris Caye with chef service, boats, dock access, and stays reserved for one group at a time.",
  path: "/",
  image: IMAGES.heroVillaSeating.src,
  imageAlt: IMAGES.heroVillaSeating.alt,
} as const

export const createPageMetadata = ({
  title,
  description,
  path,
  image = DEFAULT_SEO_IMAGE,
  imageAlt = DEFAULT_SEO_IMAGE_ALT,
}: PageSeoConfig): Metadata => ({
  title,
  description,
  alternates: {
    canonical: getCanonicalUrl(path),
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    url: getCanonicalUrl(path),
    images: [
      {
        url: image,
        alt: imageAlt,
      },
    ],
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
      "Explore the villa interiors, outdoor grounds, private docks, pool, and chef service at Canary Cove on Ambergris Caye.",
    path: "/stay",
    image: IMAGES.villaPool.src,
    imageAlt: IMAGES.villaPool.alt,
  }),
  rates: createPageMetadata({
    title: "Belize Estate Rates & Add-On Pricing | Canary Cove",
    description:
      "Review seasonal rates for suites or full-estate stays, plus pricing for boats, fishing, diving, and other Canary Cove add-ons.",
    path: "/rates",
    image: IMAGES.villaPool.src,
    imageAlt: IMAGES.villaPool.alt,
  }),
  book: createPageMetadata({
    title: "Check Availability & Book Canary Cove | Belize Estate",
    description:
      "View the live calendar, request your dates, and review payment, cancellation, and booking details for Canary Cove.",
    path: "/book",
    image: IMAGES.villaLawn.src,
    imageAlt: IMAGES.villaLawn.alt,
  }),
  dining: createPageMetadata({
    title: "Private Chef Dining in Belize | Canary Cove",
    description:
      "See how dining works at Canary Cove, from stocked breakfasts to chef-prepared lunches, dinners, and beach picnics.",
    path: "/dining",
    image: IMAGES.chefCarry.src,
    imageAlt: IMAGES.chefCarry.alt,
  }),
  experiences: createPageMetadata({
    title: "Belize Experiences & Included Amenities | Canary Cove",
    description:
      "See what is included with your stay, from kayaks and snorkel gear to pool time, dock days, and bookable island adventures.",
    path: "/experiences",
    image: IMAGES.divingFun.src,
    imageAlt: IMAGES.divingFun.alt,
  }),
  adventures: createPageMetadata({
    title: "Belize Adventures: Diving, Fishing & Sandbars | Canary Cove",
    description:
      "Watch real manta ray and lionfish dive footage, then plan reef dives, fishing charters, tubing, and sandbar days from Canary Cove's private dock.",
    path: "/adventures",
    image: IMAGES.scubaPhoto.src,
    imageAlt: IMAGES.scubaPhoto.alt,
  }),
  gettingHere: createPageMetadata({
    title: "Getting to Canary Cove in Belize | Travel Guide",
    description:
      "Follow the step-by-step route from Belize City to San Pedro and the final boat transfer to Canary Cove on Ambergris Caye.",
    path: "/getting-here",
    image: IMAGES.sanPedroWelcome.src,
    imageAlt: IMAGES.sanPedroWelcome.alt,
  }),
  contact: createPageMetadata({
    title: "Contact Canary Cove | Booking Questions & Trip Planning",
    description:
      "Contact Canary Cove for availability, booking questions, pricing, and travel planning support for your Belize stay.",
    path: "/contact",
    image: IMAGES.heroVillaSeating.src,
    imageAlt: IMAGES.heroVillaSeating.alt,
  }),
  about: createPageMetadata({
    title: "Guest Reviews & Testimonials | Canary Cove",
    description:
      "Read guest reviews, letters, and guestbook notes from stays at Canary Cove, from family vacations to diving and dining getaways in Belize.",
    path: "/about",
    image: IMAGES.romanticViews.src,
    imageAlt: IMAGES.romanticViews.alt,
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
