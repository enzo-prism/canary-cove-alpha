import { ArrowUpRight, MapPin, Phone } from "lucide-react"

import { OfficeStatus } from "@/components/contact/office-status"
import { SITE_ADDRESS_LINES, SITE_GEO, SITE_GEO_LABELS } from "@/lib/site-config"

type Contact = {
  name: string
  role: string
  phoneLocal: string
  phoneOutside: string
}

const contacts: Contact[] = [
  {
    name: "Gil",
    role: "Canary Cove Manager",
    phoneLocal: "610-5121",
    phoneOutside: "011 501-610-5121",
  },
  {
    name: "Consi",
    role: "Booking Manager",
    phoneLocal: "626-7534",
    phoneOutside: "011 501-626-7534",
  },
]

const telHref = (contact: Contact) => `tel:+501${contact.phoneLocal.replace(/[^0-9]/g, "")}`

function PhoneRow({ href, label, number }: { href: string; label: string; number: string }) {
  return (
    <a
      href={href}
      className="group flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 -mx-3 transition-colors duration-300 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canary/70"
    >
      <span className="text-[13px] text-white/60">{label}</span>
      <span className="flex items-center gap-2 text-[15px] font-medium tabular-nums text-white">
        {number}
        <Phone className="h-3.5 w-3.5 text-canary transition-transform duration-500 group-hover:rotate-[-10deg]" aria-hidden />
      </span>
    </a>
  )
}

/**
 * Direct lines beside the contact form: live San Pedro time, the two people
 * who answer, and the address. A dark card so it reads as "people", distinct
 * from the paper form.
 */
export function ContactDetails() {
  return (
    <div className="surface-reef overflow-hidden rounded-[28px] p-6 text-white shadow-[var(--shadow-lift)] sm:p-8">
      <OfficeStatus />
      <p className="mt-6 font-display text-[2rem] leading-[1.05] text-white">Talk to a person.</p>
      <p className="mt-2 text-sm leading-6 text-white/65">Best hours: 8am–5pm Belize time (UTC−6).</p>

      <div className="mt-6 divide-y divide-white/12 border-y border-white/12">
        {contacts.map((contact) => (
          <div key={contact.name} className="py-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-[1.625rem] leading-none text-white">{contact.name}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">{contact.role}</p>
            </div>
            <div className="mt-3">
              <PhoneRow href={telHref(contact)} label="From Belize" number={contact.phoneLocal} />
              <PhoneRow href={telHref(contact)} label="From outside Belize" number={contact.phoneOutside} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-canary" aria-hidden />
        <div className="space-y-3">
          <p className="text-sm leading-6 text-white/75">
            {SITE_ADDRESS_LINES[0]}
            <br />
            {SITE_ADDRESS_LINES[1]}
            <br />
            {SITE_ADDRESS_LINES[2]}
          </p>
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canary/70 [&::-webkit-details-marker]:hidden">
              <span className="underline decoration-canary decoration-2 underline-offset-4 group-open:no-underline">
                Map coordinates
              </span>
            </summary>
            <div className="space-y-1 pb-1 text-sm tabular-nums text-white/65">
              <p>{SITE_GEO_LABELS.latitude}</p>
              <p>{SITE_GEO_LABELS.longitude}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${SITE_GEO.latitude},${SITE_GEO.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 text-white underline decoration-white/30 underline-offset-4 hover:decoration-canary"
              >
                Open in Google Maps
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">(external site)</span>
              </a>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
