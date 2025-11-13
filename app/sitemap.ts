import type { MetadataRoute } from "next"

import { NAV_ITEMS } from "@/lib/nav-items"

const DEFAULT_BASE_URL = "https://example.com"

const getNavPaths = () => {
  const paths = new Set<string>()

  for (const item of NAV_ITEMS) {
    if (item.type === "link") {
      paths.add(item.href)
    } else {
      item.items.forEach((child) => paths.add(child.href))
    }
  }

  return Array.from(paths)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "")
  const lastModified = new Date()

  return getNavPaths().map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.6,
  }))
}
