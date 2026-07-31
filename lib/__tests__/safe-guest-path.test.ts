import { describe, expect, it } from "vitest"

import { DEFAULT_GUEST_PATH, safeGuestPath } from "@/lib/safe-guest-path"

describe("safeGuestPath", () => {
  it("accepts the guest root and nested guest paths with query strings", () => {
    expect(safeGuestPath("/guest")).toBe("/guest")
    expect(safeGuestPath("/guest/guide")).toBe("/guest/guide")
    expect(safeGuestPath("/guest?preview=1")).toBe("/guest?preview=1")
    expect(safeGuestPath("/guest/notes?section=wifi")).toBe("/guest/notes?section=wifi")
  })

  it("rejects non-guest prefixes that share the /guest string prefix", () => {
    expect(safeGuestPath("/guests")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("/guest-area")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("/public")).toBe(DEFAULT_GUEST_PATH)
  })

  it("rejects path traversal and encoded traversal after normalization", () => {
    expect(safeGuestPath("/guest/../")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("/guest/../admin")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("/guest/%2e%2e/admin")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("/guest/..%2fadmin")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("/guest\\..\\admin")).toBe(DEFAULT_GUEST_PATH)
  })

  it("rejects absolute and protocol-relative URLs", () => {
    expect(safeGuestPath("https://evil.example/guest")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("//evil.example/guest")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("guest")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath("")).toBe(DEFAULT_GUEST_PATH)
    expect(safeGuestPath(null)).toBe(DEFAULT_GUEST_PATH)
  })

  it("normalizes redundant segments that stay under /guest", () => {
    expect(safeGuestPath("/guest/./secret")).toBe("/guest/secret")
    expect(safeGuestPath("/guest//notes")).toBe("/guest/notes")
  })
})
