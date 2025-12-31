export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

export function trackEvent(name: string, payload?: AnalyticsPayload) {
  if (typeof window === "undefined") return
  const va = (window as typeof window & { va?: (type: string, event: AnalyticsPayload) => void }).va
  if (typeof va === "function") {
    va("event", { name, ...payload })
  }
}
