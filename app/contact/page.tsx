import type { Metadata } from "next"

import { ContactDetails } from "@/components/contact-details"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: "Contact Canary Cove | Talk to our team",
  description:
    "Reach out to the Canary Cove team for bookings, questions, or travel help. We reply within one business day.",
}

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl xl:max-w-6xl space-y-12">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              We’d love to hear from you!
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">Reach out and we’ll respond within one business day.</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="rounded-2xl border border-border/70 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      className="h-12 rounded-2xl border-border/80 bg-white/95 px-4 shadow-inner shadow-black/5 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="h-12 rounded-2xl border-border/80 bg-white/95 px-4 shadow-inner shadow-black/5 focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      maxLength={3000}
                      className="rounded-2xl border-border/80 bg-white/95 px-4 py-3 shadow-inner shadow-black/5 focus-visible:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground">0 of 3000 max characters</p>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Send message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <ContactDetails />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
