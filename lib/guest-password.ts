import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

const SCRYPT_N = 16_384
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LENGTH = 32

const hexDataView = (hex: string) => {
  const bytes = Uint8Array.from(Buffer.from(hex, "hex"))
  return new DataView(bytes.buffer)
}

export const createGuestPasswordHash = (
  password: string,
  salt = randomBytes(16).toString("hex"),
) => {
  const derived = scryptSync(password, hexDataView(salt), KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 64 * 1024 * 1024,
  })
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derived.toString("hex")}`
}

export const verifyGuestPassword = (password: string, encodedHash: string) => {
  try {
    const [algorithm, nValue, rValue, pValue, salt, expectedHex, extra] = encodedHash.split("$")
    if (algorithm !== "scrypt" || extra) return false
    const expected = hexDataView(expectedHex)
    if (expected.byteLength !== KEY_LENGTH) return false
    const actualBuffer = scryptSync(password, hexDataView(salt), KEY_LENGTH, {
      N: Number(nValue),
      r: Number(rValue),
      p: Number(pValue),
      maxmem: 64 * 1024 * 1024,
    })
    const actualBytes = Uint8Array.from(actualBuffer)
    return timingSafeEqual(new DataView(actualBytes.buffer), expected)
  } catch {
    return false
  }
}
