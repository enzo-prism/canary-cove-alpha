const encoder = new TextEncoder()

const toBase64Url = (bytes: Uint8Array) => {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

const fromBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

const constantTimeEqual = (left: Uint8Array, right: Uint8Array) => {
  let difference = left.length ^ right.length
  const length = Math.max(left.length, right.length)
  for (let index = 0; index < length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }
  return difference === 0
}

const hmac = async (secret: string, value: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)))
}

type CreateAccessTokenOptions = {
  secret: string
  scope: string
  expiresAt: number
  now?: number
}

export const createAccessToken = async ({ secret, scope, expiresAt, now = Date.now() }: CreateAccessTokenOptions) => {
  if (secret.length < 32) throw new Error("Session secret must contain at least 32 characters.")
  const nonce = new Uint8Array(16)
  crypto.getRandomValues(nonce)
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({
      version: 1,
      scope,
      issuedAt: now,
      expiresAt,
      nonce: toBase64Url(nonce),
    })),
  )
  const signature = toBase64Url(await hmac(secret, payload))
  return `${payload}.${signature}`
}

type VerifyAccessTokenOptions = {
  secret: string
  scope: string
  now?: number
}

export const verifyAccessToken = async (
  token: string,
  { secret, scope, now = Date.now() }: VerifyAccessTokenOptions,
) => {
  try {
    if (secret.length < 32) return false
    const [payload, signature, extra] = token.split(".")
    if (!payload || !signature || extra) return false

    const expectedSignature = await hmac(secret, payload)
    if (!constantTimeEqual(fromBase64Url(signature), expectedSignature)) return false

    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      version?: number
      scope?: string
      issuedAt?: number
      expiresAt?: number
      nonce?: string
    }
    return (
      parsed.version === 1 &&
      parsed.scope === scope &&
      typeof parsed.issuedAt === "number" &&
      parsed.issuedAt <= now &&
      typeof parsed.expiresAt === "number" &&
      parsed.expiresAt > now &&
      typeof parsed.nonce === "string" &&
      parsed.nonce.length > 0
    )
  } catch {
    return false
  }
}
