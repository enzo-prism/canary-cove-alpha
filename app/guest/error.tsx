"use client"

import Link from "next/link"

// The guest login POST is rate limited at the edge (Vercel WAF rule
// "Rate limit guest login": 5 POSTs per 600s per IP). A blocked attempt never
// reaches the server action, so the app cannot render an inline form error for
// it — Next surfaces the 429 as a thrown client error instead. Without a
// boundary here that lands on the root "Application error" screen, which reads
// as a broken site rather than "you tried too many times".
export default function GuestAccessError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f2ec] px-6 py-16 text-[#15241f]">
      <section className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_24px_70px_rgba(21,36,31,0.1)] md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5d746b]">Canary Cove</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">We could not complete that request</h1>
        <p className="mt-4 leading-7 text-[#53625c]">
          If you have entered the password several times in a row, private guest access pauses new attempts for about ten
          minutes to keep the area secure. Please wait, then try again.
        </p>
        <p className="mt-4 leading-7 text-[#53625c]">
          If this keeps happening, contact the Canary Cove team and we will help you in.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-[#173f32] px-5 py-3 font-semibold text-white transition hover:bg-[#205541] focus:outline-none focus:ring-4 focus:ring-[#2d6651]/30"
          >
            Try again
          </button>
          <Link
            href="/contact"
            className="rounded-full border border-black/20 px-5 py-3 text-center font-semibold transition hover:bg-black/5 focus:outline-none focus:ring-4 focus:ring-[#2d6651]/20"
          >
            Contact the team
          </Link>
        </div>
      </section>
    </main>
  )
}
