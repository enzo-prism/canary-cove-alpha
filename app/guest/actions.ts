"use server"

import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  GUEST_COOKIE_NAME,
  GUEST_SESSION_SCOPE,
  GUEST_SESSION_TTL_MS,
} from "@/lib/guest-access-config"
import { verifyGuestPassword } from "@/lib/guest-password"
import { createAccessToken } from "@/lib/private-access"

const safeNext = (value: FormDataEntryValue | null) => {
  const candidate = typeof value === "string" ? value : "/guest"
  return candidate.startsWith("/guest") && !candidate.startsWith("//") ? candidate : "/guest"
}

const isSameOrigin = async () => {
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host")
  const protocol = (requestHeaders.get("x-forwarded-proto") ?? "https").split(",")[0].trim()
  return Boolean(origin && host && origin === `${protocol}://${host}`)
}

export const loginGuest = async (formData: FormData) => {
  const next = safeNext(formData.get("next"))
  if (!(await isSameOrigin())) redirect(`/guest/access?next=${encodeURIComponent(next)}&error=verify`)

  const passwordHash = process.env.CANARY_GUEST_PASSWORD_HASH ?? ""
  const sessionSecret = process.env.CANARY_GUEST_SESSION_SECRET ?? ""
  if (!passwordHash || sessionSecret.length < 32) {
    redirect(`/guest/access?next=${encodeURIComponent(next)}&error=unavailable`)
  }

  const password = String(formData.get("password") ?? "")
  if (!verifyGuestPassword(password, passwordHash)) {
    redirect(`/guest/access?next=${encodeURIComponent(next)}&error=invalid`)
  }

  const token = await createAccessToken({
    secret: sessionSecret,
    scope: GUEST_SESSION_SCOPE,
    expiresAt: Date.now() + GUEST_SESSION_TTL_MS,
  })
  ;(await cookies()).set(GUEST_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(GUEST_SESSION_TTL_MS / 1_000),
  })
  redirect(next)
}

export const logoutGuest = async () => {
  if (!(await isSameOrigin())) redirect("/guest/access?error=verify")
  ;(await cookies()).set(GUEST_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
  redirect("/guest/access")
}
