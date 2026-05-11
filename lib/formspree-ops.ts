import type { LeadFormKey } from "@/lib/lead-forms"

const standardUtmFields = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const
const clickIdFields = ["gclid", "gbraid", "wbraid"] as const

type FormspreeOpsMetadataOptions = {
  environment?: string
  referrer?: string | null
  sourceUrl?: string | null
}

function parseSourceUrl(sourceUrl?: string | null) {
  if (!sourceUrl) return null

  try {
    return new URL(sourceUrl)
  } catch {
    return null
  }
}

function getClientSourceUrl() {
  if (typeof window === "undefined") return null
  return window.location.href
}

function getClientReferrer() {
  if (typeof document === "undefined") return ""
  return document.referrer
}

export function appendFormspreeOpsMetadata(
  formData: FormData,
  formKey: LeadFormKey,
  options: FormspreeOpsMetadataOptions = {},
) {
  formData.set("site", "canary-cove")
  formData.set("form_key", formKey)
  formData.set(
    "environment",
    options.environment ?? process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "production",
  )
  formData.set("_codex_test", "false")

  const source = parseSourceUrl(options.sourceUrl ?? getClientSourceUrl())
  const referrer = options.referrer ?? getClientReferrer()

  if (source) {
    formData.set("page_path", source.pathname)
    for (const field of standardUtmFields) {
      formData.set(field, source.searchParams.get(field) ?? "")
    }
    for (const field of clickIdFields) {
      formData.set(field, source.searchParams.get(field) ?? "")
    }
  } else {
    for (const field of [...standardUtmFields, ...clickIdFields]) {
      if (!formData.has(field)) formData.set(field, "")
    }
  }

  formData.set("referrer", referrer ?? "")

  return formData
}
