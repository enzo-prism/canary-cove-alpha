import { MapPin } from "lucide-react"

import { SITE_ADDRESS_LINES, SITE_CONTACTS, SITE_GEO_LABELS } from "@/lib/site-config"

export function ContactDetails() {
  return (
    <div className="grid gap-8 border-t border-border/70 pt-12 sm:grid-cols-2">
      <div className="space-y-5">
        <p className="form-kicker">People</p>
        <ul className="space-y-6">
          {Object.values(SITE_CONTACTS).map((contact) => (
            <li key={contact.name} className="space-y-2">
              <p className="text-lg font-semibold text-foreground">{contact.name}</p>
              <p className="text-sm text-muted-foreground">{contact.role}</p>
              <p className="text-sm text-muted-foreground">
                From Belize:{" "}
                <a href={contact.telHref} className="text-foreground underline underline-offset-4">
                  {contact.localLabel}
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                From outside Belize:{" "}
                <a href={contact.telHref} className="text-foreground underline underline-offset-4">
                  {contact.internationalLabel}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-5">
        <p className="form-kicker">The estate</p>
        <div className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            {SITE_ADDRESS_LINES[0]}
            <br />
            {SITE_ADDRESS_LINES[1]}
            <br />
            {SITE_ADDRESS_LINES[2]}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {SITE_GEO_LABELS.latitude}
          <br />
          {SITE_GEO_LABELS.longitude}
        </p>
      </div>
    </div>
  )
}
