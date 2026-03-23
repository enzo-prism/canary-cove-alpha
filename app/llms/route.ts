import { buildLlmsTxt } from "@/lib/site-config"

export const revalidate = 86400

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
