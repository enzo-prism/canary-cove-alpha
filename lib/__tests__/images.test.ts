import { describe, expect, it } from "vitest"

import { IMAGES } from "@/lib/images"

describe("site image registry", () => {
  it("carries no photographs of the former chef", () => {
    // Chef Natalie left Canary Cove years ago and the client asked for her
    // photos to come off the site. Only one of the three named her in its alt
    // text; the other two were identifiable only by filename, which is why
    // this checks the URL too. The registry is the single place every page
    // pulls images from, so guarding it here covers the whole site.
    for (const [key, image] of Object.entries(IMAGES)) {
      expect(key.toLowerCase(), key).not.toMatch(/nathalie|natalie/)
      expect(image.src.toLowerCase(), key).not.toMatch(/nathalie|natalie/)
      expect(image.alt.toLowerCase(), key).not.toContain("natalie")
    }
  })

  it("still offers a current chef image for the pages that need one", () => {
    expect(IMAGES.chefMarvinKitchen.src).toContain("res.cloudinary.com")
    expect(IMAGES.chefMarvinPortrait.src).toContain("res.cloudinary.com")
    expect(IMAGES.chefMarvinPlates.src).toContain("res.cloudinary.com")
  })

  it("gives every registry image real alt text", () => {
    for (const [key, image] of Object.entries(IMAGES)) {
      expect(image.alt.trim().length, key).toBeGreaterThan(3)
    }
  })
})
