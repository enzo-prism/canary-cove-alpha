"use client"

const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/"

/**
 * next/image loader that resizes Cloudinary assets on their CDN.
 *
 * The library stores original uploads (some 5000–7200 px wide, 2–10 MB each),
 * so every image must go through `f_auto,q_auto,w_*` — never serve the raw
 * upload URL. Non-Cloudinary sources (local /public files) pass through
 * unchanged.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  if (!src.startsWith("https://res.cloudinary.com/") || !src.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return src
  }
  // Full-bleed heroes use sizes="100vw", which can request 3840px on dense
  // displays. Cap the Cloudinary width so LCP images stay under ~500 KB.
  const boundedWidth = Math.min(Math.max(1, Math.round(width)), 2560)
  const transform = `f_auto,q_${quality ?? "auto"},w_${boundedWidth},c_limit`
  return src.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transform}/`)
}
