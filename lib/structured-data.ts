import { IMAGES } from "@/lib/images"
import {
  BOOKING_CONTACT_PHONE,
  PRIMARY_CONTACT_PHONE,
  PUBLIC_SITE_PAGES,
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_FACEBOOK_URL,
  SITE_INQUIRY_EMAIL,
  SITE_GEO,
  SITE_LOCALE,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  getCanonicalUrl,
} from "@/lib/site-config"

type JsonLdNode = Record<string, unknown>

const ORGANIZATION_ID = `${SITE_URL}#organization`
const WEBSITE_ID = `${SITE_URL}#website`
const LODGING_ID = `${SITE_URL}#lodging-business`

const getPageConfig = (path: string) => PUBLIC_SITE_PAGES.find((page) => page.path === path)

export function buildSiteJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: SITE_LOGO_URL,
        sameAs: [SITE_FACEBOOK_URL],
        email: SITE_INQUIRY_EMAIL,
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: PRIMARY_CONTACT_PHONE,
            email: SITE_INQUIRY_EMAIL,
            contactType: "customer service",
            availableLanguage: ["en"],
          },
          {
            "@type": "ContactPoint",
            telephone: BOOKING_CONTACT_PHONE,
            contactType: "reservations",
            availableLanguage: ["en"],
          },
        ],
      },
      {
        "@type": "LodgingBusiness",
        "@id": LODGING_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: SITE_LOGO_URL,
        image: [IMAGES.heroVillaSeating.src, IMAGES.villaPool.src, IMAGES.mainDock.src],
        telephone: PRIMARY_CONTACT_PHONE,
        email: SITE_INQUIRY_EMAIL,
        sameAs: [SITE_FACEBOOK_URL],
        address: {
          "@type": "PostalAddress",
          ...SITE_ADDRESS,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE_GEO.latitude,
          longitude: SITE_GEO.longitude,
        },
        parentOrganization: {
          "@id": ORGANIZATION_ID,
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LOCALE,
        publisher: {
          "@id": ORGANIZATION_ID,
        },
      },
    ],
  }
}

export function buildPageJsonLd(path: string): JsonLdNode | null {
  const page = getPageConfig(path)

  if (!page) {
    return null
  }

  const url = getCanonicalUrl(path)
  const pageNodes: JsonLdNode[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: path === "/" ? SITE_NAME : `${page.title} | ${SITE_NAME}`,
      description: page.description,
      inLanguage: SITE_LOCALE,
      isPartOf: {
        "@id": WEBSITE_ID,
      },
      about: {
        "@id": LODGING_ID,
      },
      publisher: {
        "@id": ORGANIZATION_ID,
      },
      ...(path !== "/"
        ? {
            breadcrumb: {
              "@id": `${url}#breadcrumb`,
            },
          }
        : {}),
      ...(page.images?.[0]
        ? {
            primaryImageOfPage: page.images[0],
          }
        : {}),
    },
  ]

  if (path !== "/") {
    pageNodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: url,
        },
      ],
    })
  }

  return {
    "@context": "https://schema.org",
    "@graph": pageNodes,
  }
}
