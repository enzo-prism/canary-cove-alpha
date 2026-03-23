import type { MetadataRoute } from "next"

import { BUILD_LAST_MODIFIED, PUBLIC_SITE_PAGES, getCanonicalUrl } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_SITE_PAGES.map((page) => ({
    url: getCanonicalUrl(page.path),
    lastModified: BUILD_LAST_MODIFIED,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    images: page.images,
  }))
}
