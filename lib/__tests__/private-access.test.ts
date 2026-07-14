import { describe, expect, it } from "vitest"

import {
  createAccessToken,
  verifyAccessToken,
} from "@/lib/private-access"
import { createGuestPasswordHash, verifyGuestPassword } from "@/lib/guest-password"

const secret = "test-session-secret-that-is-long-enough"

describe("private access tokens", () => {
  it("accepts an untampered, unexpired token for the matching scope", async () => {
    const token = await createAccessToken({
      secret,
      scope: "canary-cove-guest",
      expiresAt: 2_000,
      now: 1_000,
    })

    await expect(
      verifyAccessToken(token, {
        secret,
        scope: "canary-cove-guest",
        now: 1_000,
      }),
    ).resolves.toBe(true)
  })

  it("rejects tampering, the wrong scope, the wrong secret, and expiration", async () => {
    const token = await createAccessToken({
      secret,
      scope: "canary-cove-guest",
      expiresAt: 2_000,
      now: 1_000,
    })
    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`

    await expect(verifyAccessToken(tampered, { secret, scope: "canary-cove-guest", now: 1_000 })).resolves.toBe(false)
    await expect(verifyAccessToken(token, { secret, scope: "other", now: 1_000 })).resolves.toBe(false)
    await expect(verifyAccessToken(token, { secret: `${secret}-wrong`, scope: "canary-cove-guest", now: 1_000 })).resolves.toBe(false)
    await expect(verifyAccessToken(token, { secret, scope: "canary-cove-guest", now: 2_000 })).resolves.toBe(false)
    await expect(verifyAccessToken("not-a-token", { secret, scope: "canary-cove-guest", now: 1_000 })).resolves.toBe(false)
  })
})

describe("password hashing", () => {
  it("matches only the exact password and rejects malformed hashes", () => {
    const encoded = createGuestPasswordHash("correct horse", "00112233445566778899aabbccddeeff")
    expect(verifyGuestPassword("correct horse", encoded)).toBe(true)
    expect(verifyGuestPassword("correct Horse", encoded)).toBe(false)
    expect(verifyGuestPassword("short", encoded)).toBe(false)
    expect(verifyGuestPassword("correct horse", "not-a-valid-hash")).toBe(false)
  })
})
