import type { Metadata } from "next"

import { logoutGuest } from "@/app/guest/actions"
import { requireGuestSession } from "@/lib/guest-auth-dal"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Private guest guide | Canary Cove",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default async function GuestGuidePage() {
  await requireGuestSession()

  return (
    <main className="min-h-screen bg-[#f4f2ec] px-6 py-16 text-[#15241f]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_24px_70px_rgba(21,36,31,0.1)] md:p-12">
        <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5d746b]">Private guest area</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Canary Cove guest guide</h1>
          </div>
          <form action={logoutGuest}>
            <button type="submit" className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5 focus:outline-none focus:ring-4 focus:ring-[#2d6651]/20">Sign out</button>
          </form>
        </div>
        <div className="py-10">
          <h2 className="text-2xl font-semibold">Guest information is being prepared</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#53625c]">
            Don&apos;s guest details will appear here after the final sketch is approved. No private phone numbers, emergency contacts, itineraries, or documents have been published yet.
          </p>
        </div>
      </section>
    </main>
  )
}
