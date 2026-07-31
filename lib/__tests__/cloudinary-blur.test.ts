import { describe, expect, it } from "vitest"

import { cloudinaryBlurDataUrl } from "@/lib/cloudinary-blur"

describe("cloudinaryBlurDataUrl", () => {
  it("rewrites the upload segment with a tiny blurred transform", () => {
    const src = "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp"
    expect(cloudinaryBlurDataUrl(src)).toBe(
      "https://res.cloudinary.com/dhqpqfw6w/image/upload/f_auto,q_30,w_32,e_blur:1000,c_limit/v1761059677/outside_sq8dvn.webp",
    )
  })

  it("returns undefined for non-Cloudinary sources", () => {
    expect(cloudinaryBlurDataUrl("/local-photo.jpg")).toBeUndefined()
    expect(cloudinaryBlurDataUrl("https://example.com/image/upload/photo.jpg")).toBeUndefined()
  })

  it("returns undefined for Cloudinary URLs without an image upload segment", () => {
    expect(cloudinaryBlurDataUrl("https://res.cloudinary.com/dhqpqfw6w/video/upload/v1/clip.mp4")).toBeUndefined()
    expect(cloudinaryBlurDataUrl("https://res.cloudinary.com/dhqpqfw6w/")).toBeUndefined()
  })
})
