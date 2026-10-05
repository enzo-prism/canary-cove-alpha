"use client"

import Link from "next/link"
import { RotateCcw } from "lucide-react"

import { enterDelay, GuestShell } from "@/app/guest/_components/guest-shell"

// The guest login POST is rate limited at the edge (Vercel WAF rule
// "Rate limit guest login": 5 POSTs per 600s per IP). A blocked attempt never
// reaches the server action, so the app cannot render an inline form error for
// it — Next surfaces the 429 as a thrown client error instead. Without a
// boundary here that lands on the root "Application error" screen, which reads
// as a broken site rather than "you tried too many times".
export default function GuestAccessError({ reset }: { error: Error; reset: () => void }) {
  return (
    <GuestShell>
      <div className="flow flow-lg">
        <p className="eyebrow enter-fade" style={enterDelay(200)}>
          Canary Cove
        </p>
        <h1 className="enter-up text-[clamp(2.4rem,5vw,3.75rem)] font-display leading-[1] tracking-[-0.015em]" style={enterDelay(260)}>
          We could not complete that request
        </h1>
        <div className="enter-up flow flow-md text-[1.0625rem] leading-8 text-muted-foreground" style={enterDelay(380)}>
          <p>
            If you have entered the password several times in a row, private guest access pauses new attempts for about
            ten minutes to keep the area secure. Please wait, then try again.
          </p>
          <p>If this keeps happening, contact the Canary Cove team and we will help you in.</p>
        </div>
        <div className="enter-up flex flex-col gap-3 sm:flex-row" style={enterDelay(480)}>
          <button
            type="button"
            onClick={reset}
            className="focus-ring group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ink px-7 text-[15px] font-medium text-sand-light transition-colors duration-500 hover:bg-lagoon"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-700 group-hover:-rotate-180" aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/contact"
            className="focus-ring inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-medium text-foreground ring-1 ring-inset ring-border transition-colors duration-500 hover:bg-ink hover:text-sand-light hover:ring-ink"
          >
            Contact the team
          </Link>
        </div>
      </div>
    </GuestShell>
  )
}
