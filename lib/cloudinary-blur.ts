const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/"

/**
 * Builds a tiny blurred placeholder URL for a Cloudinary asset, used as
 * next/image `blurDataURL`. Mirrors the transform rewrite in
 * `lib/cloudinary-loader.ts`. Returns undefined for non-Cloudinary sources
 * (local /public files), so callers can fall back to no placeholder.
 */
export function cloudinaryBlurDataUrl(src: string): string | undefined {
  if (!src.startsWith("https://res.cloudinary.com/") || !src.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return undefined
  }
  const transform = "f_auto,q_30,w_32,e_blur:1000,c_limit"
  return src.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transform}/`)
}
