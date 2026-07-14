import "server-only"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  GUEST_COOKIE_NAME,
  GUEST_SESSION_SCOPE,
} from "@/lib/guest-access-config"
import { verifyAccessToken } from "@/lib/private-access"

export const requireGuestSession = async () => {
  const secret = process.env.CANARY_GUEST_SESSION_SECRET ?? ""
  const token = (await cookies()).get(GUEST_COOKIE_NAME)?.value ?? ""
  const isValid = await verifyAccessToken(token, {
    secret,
    scope: GUEST_SESSION_SCOPE,
  })

  if (!isValid) redirect("/guest/access?next=%2Fguest")
}
