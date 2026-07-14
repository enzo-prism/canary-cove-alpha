export type HeaderReader = Pick<Headers, "get">

export const isSameOriginRequest = (requestHeaders: HeaderReader) => {
  const origin = requestHeaders.get("origin")
  const host = requestHeaders.get("host") ?? requestHeaders.get("x-forwarded-host")
  const protocol = (requestHeaders.get("x-forwarded-proto") ?? "https").split(",")[0].trim()
  return Boolean(origin && host && origin === `${protocol}://${host}`)
}
