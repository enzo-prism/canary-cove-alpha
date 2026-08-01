"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SITE_ADDRESS_LINES, SITE_GEO_LABELS } from "@/lib/site-config"

type Contact = {
  name: string
  role: string
  initials: string
  phoneLocal: string
  phoneOutside: string
}

const contacts: Contact[] = [
  {
    name: "Gil",
    role: "Canary Cove Manager",
    initials: "GC",
    phoneLocal: "610-5121",
    phoneOutside: "011 501-610-5121",
  },
  {
    name: "Consi",
    role: "Booking Manager",
    initials: "CB",
    phoneLocal: "626-7534",
    phoneOutside: "011 501-626-7534",
  },
]

function ContactPerson({ contact }: { contact: Contact }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-border/70 bg-white/90">
          <AvatarFallback className="text-xs font-semibold text-foreground">{contact.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-foreground">{contact.name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{contact.role}</p>
        </div>
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Phone from Belize</p>
        <p>{contact.phoneLocal}</p>
        <p className="mt-2 font-medium text-foreground">Phone from Outside Belize</p>
        <p>{contact.phoneOutside}</p>
      </div>
    </div>
  )
}

export function ContactDetails() {
  return (
    <Card className="rounded-2xl border border-border/70 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <p className="form-kicker">Other Ways to Get in Touch</p>
          {contacts.map((contact, index) => (
            <div key={contact.name} className="space-y-6">
              <ContactPerson contact={contact} />
              {index < contacts.length - 1 ? <Separator className="bg-border/70" /> : null}
            </div>
          ))}
        </div>

        <Separator className="bg-border/70" />

        <div className="space-y-2">
          <p className="form-kicker">Canary Cove Location</p>
          <p className="text-sm text-muted-foreground">{SITE_GEO_LABELS.latitude}</p>
          <p className="text-sm text-muted-foreground">{SITE_GEO_LABELS.longitude}</p>
        </div>

        <Separator className="bg-border/70" />

        <div className="space-y-2">
          <p className="form-kicker">Address</p>
          <p className="text-sm text-muted-foreground">
            {SITE_ADDRESS_LINES[0]}
            <br />
            {SITE_ADDRESS_LINES[1]}
            <br />
            {SITE_ADDRESS_LINES[2]}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
