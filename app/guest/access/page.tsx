import type { Metadata } from "next"
import { ArrowRight, Lock } from "lucide-react"

import { loginGuest } from "@/app/guest/actions"
import { enterDelay, GuestShell } from "@/app/guest/_components/guest-shell"
import { safeGuestPath } from "@/lib/safe-guest-path"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Guest access | Canary Cove",
  description: "Private access for Canary Cove guests.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

type AccessPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function GuestAccessPage({ searchParams }: AccessPageProps) {
  const params = await searchParams
  const next = safeGuestPath(params.next)
  const error = params.error
  const message = error === "unavailable"
    ? "Private guest access is temporarily unavailable. Please contact the Canary Cove team."
    : error
      ? "We could not verify that request. Please check the password and try again."
      : ""

  return (
    <GuestShell
      footnote={
        <p className="flex items-start gap-2.5">
          <Lock className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Access expires after eight hours. This page does not use analytics or third-party widgets.
        </p>
      }
    >
      <div className="flow flow-lg">
        <p className="eyebrow enter-fade" style={enterDelay(200)}>
          Canary Cove
        </p>
        <h1 className="enter-up text-display" style={enterDelay(260)}>
          Guest access
        </h1>
        <p className="text-lede enter-up" style={enterDelay(380)}>
          This private area is reserved for confirmed Canary Cove guests. Enter the password shared by the Canary Cove
          team.
        </p>
        {message ? (
          <p
            role="alert"
            className="enter-up flex gap-3 rounded-2xl bg-[#a63d2a]/[0.07] px-4 py-3.5 text-sm leading-6 text-[#7a2d23] ring-1 ring-inset ring-[#a63d2a]/25"
          >
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a63d2a]" />
            {message}
          </p>
        ) : null}
        {error !== "unavailable" ? (
          <form action={loginGuest} className="enter-up flow flow-md" style={enterDelay(480)}>
            <input type="hidden" name="next" value={next} />
            <div className="flow flow-xs">
              <label htmlFor="guest-password" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Access password
              </label>
              <input
                id="guest-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                autoFocus
                className="h-14 w-full rounded-2xl bg-sand-light px-5 text-base text-foreground outline-none ring-1 ring-inset ring-border transition-shadow duration-300 placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-lagoon/60"
              />
            </div>
            <button
              type="submit"
              className="focus-ring group inline-flex h-14 w-full items-center justify-between gap-3 rounded-full bg-ink pl-7 pr-2 text-[15px] font-medium text-sand-light transition-colors duration-500 hover:bg-lagoon motion-safe:active:scale-[0.98]"
            >
              Open guest guide
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-canary text-ink"
              >
                <ArrowRight className="arrow-nudge h-4 w-4" />
              </span>
            </button>
          </form>
        ) : null}
      </div>
    </GuestShell>
  )
}
