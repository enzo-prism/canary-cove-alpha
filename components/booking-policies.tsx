"use client"

import { EMOJI } from "@/lib/emoji"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function BookingPolicies() {
  return (
    <Card className="surface-panel">
      <CardHeader className="space-y-2 p-5">
        <Badge
          variant="outline"
          className="w-fit border-border/70 text-sm uppercase tracking-[0.28em] text-muted-foreground"
        >
          Payment & policies {EMOJI.rates}
        </Badge>
        <div className="space-y-2">
          <h2 className="text-section text-2xl">Clear terms before you arrive.</h2>
          <p className="text-sm text-muted-foreground">
            The essentials are simple: a 50% deposit secures the stay, the balance is due 45 business days before
            arrival, and written cancellations follow the timeline below.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="surface-inset px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Deposit</p>
            <p className="mt-2 text-sm font-semibold text-foreground">50% due to confirm</p>
          </div>
          <div className="surface-inset px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Final balance</p>
            <p className="mt-2 text-sm font-semibold text-foreground">45 business days before arrival</p>
          </div>
          <div className="surface-inset px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Recommended</p>
            <p className="mt-2 text-sm font-semibold text-foreground">Comprehensive travel insurance</p>
          </div>
        </div>

        <Separator className="my-5" />

        <Accordion type="multiple" defaultValue={["payment", "cancellation"]} className="space-y-2">
          <AccordionItem id="payment-terms" value="payment" className="scroll-mt-24 border-border/60">
            <AccordionTrigger className="text-base font-semibold text-foreground">Payment Terms</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              50% down secures the reservation. The remaining balance is due 45 business days prior to arrival or your
              special event. Any incidental amounts accrued during the stay are charged upon departure.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            id="cancellation-policy"
            value="cancellation"
            className="scroll-mt-24 border-border/60"
          >
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
                  Note: no refunds of deposits will be given for cancellations of reservations for the dates of
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
