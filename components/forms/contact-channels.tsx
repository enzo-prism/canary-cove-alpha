import { Mail, Phone } from "lucide-react"

import { SITE_CONTACTS, SITE_INQUIRY_EMAIL, SITE_INQUIRY_MAILTO } from "@/lib/site-config"

const channels = [
  {
    href: SITE_CONTACTS.gil.telHref,
    label: `Call ${SITE_CONTACTS.gil.name}`,
    detail: SITE_CONTACTS.gil.internationalLabel,
    icon: Phone,
    testId: "contact-tel-gil",
  },
  {
    href: SITE_CONTACTS.consi.telHref,
    label: `Call ${SITE_CONTACTS.consi.name}`,
    detail: SITE_CONTACTS.consi.internationalLabel,
    icon: Phone,
    testId: "contact-tel-consi",
  },
  {
    href: SITE_INQUIRY_MAILTO,
    label: "Email the estate",
    detail: SITE_INQUIRY_EMAIL,
    icon: Mail,
    testId: "contact-mailto",
  },
] as const

export function ContactChannels() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {channels.map((channel) => {
        const Icon = channel.icon
        return (
          <a
            key={channel.testId}
            href={channel.href}
            data-testid={channel.testId}
            className="group flex min-h-[6.5rem] flex-col justify-between rounded-2xl border border-border bg-surface px-4 py-4 transition-colors duration-200 motion-reduce:transition-none hover:border-foreground/25 focus-ring"
          >
            <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
            <span className="mt-6 space-y-1">
              <span className="block text-sm font-semibold text-foreground">{channel.label}</span>
              <span className="block text-sm text-muted-foreground">{channel.detail}</span>
            </span>
          </a>
        )
      })}
    </div>
  )
}
