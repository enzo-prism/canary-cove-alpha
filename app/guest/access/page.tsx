import type { Metadata } from "next"

import { loginGuest } from "@/app/guest/actions"

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
  const { next = "/guest", error } = await searchParams
  const message = error === "unavailable"
    ? "Private guest access is temporarily unavailable. Please contact the Canary Cove team."
    : error
      ? "We could not verify that request. Please check the password and try again."
      : ""

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f2ec] px-6 py-16 text-[#15241f]">
      <section className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_24px_70px_rgba(21,36,31,0.1)] md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5d746b]">Canary Cove</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Guest access</h1>
        <p className="mt-4 leading-7 text-[#53625c]">
          This private area is reserved for confirmed Canary Cove guests. Enter the password shared by the Canary Cove team.
        </p>
        {message ? <p role="alert" className="mt-5 border-l-4 border-[#a33b2b] pl-4 text-sm text-[#7a2d23]">{message}</p> : null}
        {error !== "unavailable" ? (
          <form action={loginGuest} className="mt-7 space-y-4">
            <input type="hidden" name="next" value={next.startsWith("/guest") && !next.startsWith("//") ? next : "/guest"} />
            <div>
              <label htmlFor="guest-password" className="block text-sm font-semibold">Access password</label>
              <input id="guest-password" name="password" type="password" required autoComplete="current-password" autoFocus className="mt-2 w-full rounded-xl border border-black/20 bg-white px-4 py-3 outline-none ring-[#2d6651]/20 transition focus:border-[#2d6651] focus:ring-4" />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#173f32] px-5 py-3 font-semibold text-white transition hover:bg-[#205541] focus:outline-none focus:ring-4 focus:ring-[#2d6651]/30">
              Open guest guide
            </button>
          </form>
        ) : null}
        <p className="mt-6 text-sm leading-6 text-[#66736e]">Access expires after eight hours. This page does not use analytics or third-party widgets.</p>
      </section>
    </main>
  )
}
