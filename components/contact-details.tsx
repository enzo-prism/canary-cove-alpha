"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
          <Badge variant="outline" className="border-border/70 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Other Ways to Get in Touch
          </Badge>
          {contacts.map((contact, index) => (
            <div key={contact.name} className="space-y-6">
              <ContactPerson contact={contact} />
              {index < contacts.length - 1 ? <Separator className="bg-border/70" /> : null}
            </div>
          ))}
        </div>

        <Separator className="bg-border/70" />

        <div className="space-y-2">
          <Badge variant="outline" className="border-border/70 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Canary Cove Location
          </Badge>
          <p className="text-sm text-muted-foreground">17′ 59.914 NORTH</p>
          <p className="text-sm text-muted-foreground">87′ 54.901 WEST</p>
        </div>

        <Separator className="bg-border/70" />

        <div className="space-y-2">
          <Badge variant="outline" className="border-border/70 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Address
          </Badge>
          <p className="text-sm text-muted-foreground">
            Canary Cove
            <br />
            6 1/2 Miles North San Pedro Town,
            <br />
            Ambergris Caye Belize
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
