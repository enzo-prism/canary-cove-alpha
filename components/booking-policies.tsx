"use client"

import { EMOJI } from "@/lib/emoji"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function BookingPolicies() {
  return (
    <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-2 p-5">
        <Badge
          variant="outline"
          className="w-fit border-border/70 text-sm uppercase tracking-[0.28em] text-muted-foreground"
        >
          Payment & policies {EMOJI.rates}
        </Badge>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <Accordion type="multiple" defaultValue={["payment", "cancellation"]} className="space-y-2">
          <AccordionItem value="payment" className="border-border/60">
            <AccordionTrigger className="text-base font-semibold text-foreground">Payment Terms</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              50% down, balance due 45 business days prior to arrival.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cancellation" className="border-border/60">
            <AccordionTrigger className="text-base font-semibold text-foreground">Cancellation Policy</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <ul className="space-y-2 pl-4">
                <li className="list-disc">
                  Cancellations must be made in writing. If a guest cancellation is made more than 60 business days
                  before the scheduled guest arrival date, a full (100%) refund less a 10% administrative fee will be
                  given.
                </li>
                <li className="list-disc">
                  If a guest cancellation is made less than 60 business days before the scheduled guest arrival date
                  but more than 45 business days before the scheduled guest arrival date 50% of the total amount
                  deposited will be refunded.
                </li>
                <li className="list-disc">
                  If a guest cancellation is made less than 45 business days before the scheduled guest arrival date,
                  NO refund of any deposit will be given and the full deposit will be forfeited (includes early
                  check-outs or no-shows).
                </li>
                <li className="list-disc">
                  The balance is due 45 business days prior to check-in or your special event. Any amounts accrued
                  during your stay will be charged upon your departure.
                </li>
                <li className="list-disc">
                  Note: NO REFUNDS OF DEPOSITS WILL BE GIVEN for cancellations of reservations for the dates of
                  December 16th-January 7th once your reservation has been confirmed.
                </li>
                <li className="list-disc">Business days are considered any day of the week Monday to Friday.</li>
                <li className="list-disc">
                  We strongly recommend full coverage travel insurance in the event of delays / cancellations, weather,
                  health, family, personal issues, etc.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
