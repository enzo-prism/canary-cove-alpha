import { describe, expect, it } from "vitest"

import cloudinaryLoader from "@/lib/cloudinary-loader"

describe("cloudinaryLoader", () => {
  it("caps requested width at 2560", () => {
    const src = "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059680/IMG_1835_w1onmi.webp"
    expect(cloudinaryLoader({ src, width: 3840 })).toContain("/image/upload/f_auto,q_auto,w_2560,c_limit/")
    expect(cloudinaryLoader({ src, width: 1920 })).toContain("/image/upload/f_auto,q_auto,w_1920,c_limit/")
  })
})
