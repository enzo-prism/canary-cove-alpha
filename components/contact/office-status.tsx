"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import styles from "@/components/book/wizard.module.css"

const timeFormatter = () =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Belize" })

const hourFormatter = () => new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: "America/Belize" })

/**
 * Live San Pedro clock with a calling-hours hint (8am–5pm Belize time).
 * Renders a neutral placeholder until mounted so server and client markup match.
 */
export function OfficeStatus({ className }: { className?: string }) {
  const [state, setState] = useState<{ time: string; open: boolean } | null>(null)

  useEffect(() => {
    const timeFormat = timeFormatter()
    const hourFormat = hourFormatter()
    const update = () => {
      const now = new Date()
      const hour = Number(hourFormat.format(now))
      setState({ time: timeFormat.format(now), open: hour >= 8 && hour < 17 })
    }
    update()
    const id = window.setInterval(update, 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <p className={cn("flex items-center gap-3 text-[13px] leading-5", className)} aria-live="off">
      <span
        aria-hidden
        className={cn(
          "relative inline-block h-2 w-2 shrink-0 rounded-full",
          state?.open ? cn("bg-lagoon-soft text-lagoon-soft", styles.liveDot) : "bg-white/35",
        )}
      />
      <span className="text-white/75">
        {state ? (
          <>
            <span className="tabular-nums text-white">{state.time}</span> in San Pedro ·{" "}
            {state.open ? "within calling hours" : "outside calling hours, a note is best"}
          </>
        ) : (
          "Calling hours 8am–5pm Belize time"
        )}
      </span>
    </p>
  )
}
