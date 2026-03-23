import { buildLlmsFullTxt } from "@/lib/site-config"

export const revalidate = 86400

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
