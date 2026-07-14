import type { MetadataRoute } from "next"

import { SITE_HOST, getCanonicalUrl } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/guest", "/guest/"],
      },
    ],
    sitemap: [getCanonicalUrl("/sitemap.xml")],
    host: SITE_HOST,
  }
}
