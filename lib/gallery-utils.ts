export type GalleryItem = {
  src: string
  alt: string
  caption?: string
}

const SIZE_PATTERN = /(\d{3,4})x(\d{3,4})/
const HIGH_RES_MIN_WIDTH = 800

export function isHighResImage(src: string, minWidth = HIGH_RES_MIN_WIDTH) {
  const match = src.match(SIZE_PATTERN)
  if (!match) return true
  const width = Number(match[1])
  return width >= minWidth
}

export function filterHighResGalleryItems(items: GalleryItem[], minWidth = HIGH_RES_MIN_WIDTH) {
  return items.filter((item) => isHighResImage(item.src, minWidth))
}
