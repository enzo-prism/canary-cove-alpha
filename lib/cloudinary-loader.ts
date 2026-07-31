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
  const transform = `f_auto,q_${quality ?? "auto"},w_${width},c_limit`
  return src.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transform}/`)
}
