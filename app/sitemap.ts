import type { MetadataRoute } from "next"

import { PUBLIC_SITE_PAGES, getCanonicalUrl } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITE_PAGES.map((page) => ({
    url: getCanonicalUrl(page.path),
    images: page.images,
  }))
}
