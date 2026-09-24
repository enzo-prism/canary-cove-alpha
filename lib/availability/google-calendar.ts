import { createSign } from "node:crypto"

import { addDays, isIsoDate, todayInPropertyTz } from "@/lib/availability/dates"
import type { CalendarEvent } from "@/lib/availability/types"

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.readonly"
const DEFAULT_CALENDAR_ID = "canarycove@gmail.com"

type ServiceAccountJson = {
  client_email: string
  private_key: string
}

type GoogleDate = {
  date?: string
  dateTime?: string
}

type GoogleEvent = {
  id?: string
  status?: string
  summary?: string
  start?: GoogleDate
  end?: GoogleDate
}

type GoogleEventsResponse = {
  items?: GoogleEvent[]
  nextPageToken?: string
}

export type CalendarReadResult =
  | { ok: true; events: CalendarEvent[] }
  | { ok: false; reason: "missing-credentials" | "upstream" }

type CalendarEnv = {
  GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON?: string
  GOOGLE_CALENDAR_ID?: string
  [key: string]: string | undefined
}

type ReadOptions = {
  fetchImpl?: typeof fetch
  now?: Date
  env?: CalendarEnv
}

function readServiceAccount(env: CalendarEnv): ServiceAccountJson | null {
  const raw = env.GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccountJson>
    if (!parsed.client_email || !parsed.private_key) return null
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    }
  } catch {
    return null
  }
}

function base64UrlEncode(value: string | Buffer): string {
  const buffer = typeof value === "string" ? Buffer.from(value) : value
  return buffer.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function signServiceAccountJwt(account: ServiceAccountJson, now: Date): string {
  const issuedAt = Math.floor(now.getTime() / 1000)
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: account.client_email,
      scope: CALENDAR_SCOPE,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  )
  const unsigned = `${header}.${payload}`
  const signer = createSign("RSA-SHA256")
  signer.update(unsigned)
  signer.end()
  return `${unsigned}.${base64UrlEncode(signer.sign(account.private_key))}`
}

function toIsoDate(value: GoogleDate | undefined): string | null {
  if (value?.date && isIsoDate(value.date)) return value.date
  if (!value?.dateTime) return null

  const instant = new Date(value.dateTime)
  if (Number.isNaN(instant.getTime())) return null
  return todayInPropertyTz(instant)
}

function toCalendarEvent(item: GoogleEvent): CalendarEvent | null {
  if (!item.id || item.status === "cancelled") return null
  const start = toIsoDate(item.start)
  const end = toIsoDate(item.end)
  if (!start || !end || start >= end) return null
  return {
    id: item.id,
    title: typeof item.summary === "string" ? item.summary : "",
    start,
    end,
  }
}

async function accessToken(account: ServiceAccountJson, fetchImpl: typeof fetch, now: Date): Promise<string | null> {
  const assertion = signServiceAccountJwt(account, now)
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  })

  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!response.ok) return null

  const payload = (await response.json()) as { access_token?: string }
  return payload.access_token ?? null
}

export async function listCalendarEvents(options: ReadOptions = {}): Promise<CalendarReadResult> {
  const env = options.env ?? process.env
  const fetchImpl = options.fetchImpl ?? fetch
  const now = options.now ?? new Date()
  const account = readServiceAccount(env)
  if (!account) return { ok: false, reason: "missing-credentials" }

  const token = await accessToken(account, fetchImpl, now)
  if (!token) return { ok: false, reason: "upstream" }

  const calendarId = encodeURIComponent(env.GOOGLE_CALENDAR_ID?.trim() || DEFAULT_CALENDAR_ID)
  const timeMin = `${addDays(todayInPropertyTz(now), -1)}T00:00:00Z`
  const timeMax = `${addDays(todayInPropertyTz(now), 548)}T00:00:00Z`
  const events: CalendarEvent[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`)
    url.searchParams.set("singleEvents", "true")
    url.searchParams.set("orderBy", "startTime")
    url.searchParams.set("timeMin", timeMin)
    url.searchParams.set("timeMax", timeMax)
    url.searchParams.set("maxResults", "2500")
    url.searchParams.set("fields", "items(id,status,summary,start,end),nextPageToken")
    if (pageToken) url.searchParams.set("pageToken", pageToken)

    const response = await fetchImpl(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return { ok: false, reason: "upstream" }

    const payload = (await response.json()) as GoogleEventsResponse
    for (const item of payload.items ?? []) {
      const event = toCalendarEvent(item)
      if (event) events.push(event)
    }
    pageToken = payload.nextPageToken
  } while (pageToken)

  return { ok: true, events }
}
