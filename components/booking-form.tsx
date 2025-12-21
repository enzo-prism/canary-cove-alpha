"use client"

import { useState, type FormEvent } from "react"

import { Send } from "lucide-react"

import { EMOJI } from "@/lib/emoji"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type BookingFormProps = {
  className?: string
}

export function BookingForm({ className }: BookingFormProps) {
  const [alertOpen, setAlertOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAlertOpen(true)
  }

  const fieldClassName =
    "h-12 rounded-2xl border-border/80 bg-white/90 px-4 shadow-inner shadow-primary/5 focus-visible:ring-primary/30"
  const textareaClassName =
    "rounded-2xl border-border/80 bg-white/90 px-4 py-3 shadow-inner shadow-primary/5 focus-visible:ring-primary/30"
  const selectClassName =
    "h-12 rounded-2xl border-border/80 bg-white/90 px-4 shadow-inner shadow-primary/5 focus:ring-primary/30"

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <Card
        className={cn(
          "frosted-panel relative space-y-6 rounded-[32px] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)]",
          className,
        )}
      >
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-3 p-0">
            <Badge
              variant="secondary"
              className="w-fit gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
            >
              <Send className="h-4 w-4" />
              Request to book {EMOJI.book}
            </Badge>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-foreground">Tell us about your stay.</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Share your preferred dates and any celebrations. Our team will confirm availability and send a tailored quote.{" "}
                {EMOJI.concierge}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-0 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="Alexandra"
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Martin"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="+1 (242) 555-0123"
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Your email"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmEmail">Confirm Email Address</Label>
              <Input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                required
                placeholder="Confirm your email"
                className={fieldClassName}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="arrival">Preferred Arrival Date</Label>
                <Input
                  id="arrival"
                  name="arrival"
                  type="date"
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure">Preferred Departure Date</Label>
                <Input
                  id="departure"
                  name="departure"
                  type="date"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adultGuests">Number of Adult Guests</Label>
                <Input
                  id="adultGuests"
                  name="adultGuests"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="4 adults"
                  className={fieldClassName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="childGuests">Number of Child Guests (under 21) and Age of Each</Label>
                <Input
                  id="childGuests"
                  name="childGuests"
                  placeholder="2 children, ages 8 and 10"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requests">Message</Label>
              <Textarea
                id="requests"
                name="requests"
                rows={5}
                required
                placeholder="Please write a detailed message to us!"
                className={textareaClassName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral">How did you hear about Canary Cove?</Label>
              <Select name="referral" required>
                <SelectTrigger
                  id="referral"
                  className={selectClassName}
                >
                  <SelectValue placeholder="How did you hear about Canary Cove?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="other-search">Other search engine</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" size="lg" className="w-full sm:w-auto focus-ring">
                Send booking request
                <Send className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                We only host one group at a time. Sending this form places a tentative hold while we confirm details.
              </p>
            </div>
          </CardContent>
        </form>
      </Card>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Request received</AlertDialogTitle>
          <AlertDialogDescription>
            Thanks for sharing your dates. Our team will confirm availability and follow up with next steps shortly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
