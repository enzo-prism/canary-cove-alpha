import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import {
  GUEST_COOKIE_NAME,
  GUEST_SESSION_SCOPE,
} from "@/lib/guest-access-config"
import { verifyAccessToken } from "@/lib/private-access"
import { safeGuestPath } from "@/lib/safe-guest-path"

const applyPrivateHeaders = (response: NextResponse) => {
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "no-referrer")
  response.headers.set("Content-Security-Policy", "frame-ancestors 'none'; base-uri 'self'; form-action 'self'")
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (pathname === "/guest/access") return applyPrivateHeaders(NextResponse.next())

  const secret = process.env.CANARY_GUEST_SESSION_SECRET ?? ""
  const token = request.cookies.get(GUEST_COOKIE_NAME)?.value ?? ""
  const valid = await verifyAccessToken(token, {
    secret,
    scope: GUEST_SESSION_SCOPE,
  })

  if (!valid) {
    const login = new URL("/guest/access", request.url)
    login.searchParams.set("next", safeGuestPath(`${pathname}${search}`))
    return applyPrivateHeaders(NextResponse.redirect(login))
  }

  return applyPrivateHeaders(NextResponse.next())
}

export const config = {
  matcher: ["/guest/:path*"],
}
