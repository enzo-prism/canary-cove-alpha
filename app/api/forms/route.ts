import { track } from "@vercel/analytics/server"

import { appendFormspreeOpsMetadata } from "@/lib/formspree-ops"
import { isLeadFormKey, LEAD_FORM_CONFIG, type LeadFormKey } from "@/lib/lead-forms"
import { sanitizeVercelAnalyticsPayload } from "@/lib/vercel-analytics"

const routeName = "/api/forms"

function logFormEvent(level: "error" | "info" | "warn", message: string, details: Record<string, unknown>) {
  const logPayload = JSON.stringify({
    level,
    message,
    route: routeName,
    ...details,
  })

  if (level === "error") {
    console.error(logPayload)
    return
  }

  if (level === "warn") {
    console.warn(logPayload)
    return
  }

  console.log(logPayload)
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value : null
}

async function trackServerLeadSubmit(form: LeadFormKey) {
  const { surface } = LEAD_FORM_CONFIG[form]
  const payload = sanitizeVercelAnalyticsPayload({ form, surface })
  await track("lead_submit", payload)
}

export async function POST(request: Request) {
  const startedAt = Date.now()
  const requestId = request.headers.get("x-vercel-id")
  let form: LeadFormKey | null = null

  try {
    const formData = await request.formData()
    const formKey = getStringField(formData, "form_key")

    if (!isLeadFormKey(formKey)) {
      logFormEvent("warn", "invalid form key", {
        form: formKey ?? "missing",
        ms: Date.now() - startedAt,
        requestId,
      })

      return Response.json({ ok: false, error: "Invalid form." }, { status: 400 })
    }

    form = formKey
    const config = LEAD_FORM_CONFIG[form]
    const clientReferrer = getStringField(formData, "referrer")

    appendFormspreeOpsMetadata(formData, form, {
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "production",
      referrer: clientReferrer,
      sourceUrl: request.headers.get("referer"),
    })

    logFormEvent("info", "forwarding form", {
      form,
      ms: Date.now() - startedAt,
      requestId,
    })

    const formspreeResponse = await fetch(config.endpoint, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })

    if (!formspreeResponse.ok) {
      logFormEvent("warn", "formspree rejected form", {
        form,
        ms: Date.now() - startedAt,
        requestId,
        status: formspreeResponse.status,
      })

      return Response.json({ ok: false }, { status: formspreeResponse.status })
    }

    try {
      await trackServerLeadSubmit(form)
    } catch (error) {
      logFormEvent("warn", "server analytics failed", {
        error: error instanceof Error ? error.message : String(error),
        form,
        ms: Date.now() - startedAt,
        requestId,
      })
    }

    logFormEvent("info", "form accepted", {
      form,
      ms: Date.now() - startedAt,
      requestId,
    })

    return Response.json({ ok: true })
  } catch (error) {
    logFormEvent("error", "form submission failed", {
      error: error instanceof Error ? error.message : String(error),
      form: form ?? "unknown",
      ms: Date.now() - startedAt,
      requestId,
    })

    return Response.json({ ok: false }, { status: 502 })
  }
}
