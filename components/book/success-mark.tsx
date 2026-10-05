import { cn } from "@/lib/utils"
import styles from "@/components/book/wizard.module.css"

/**
 * The success moment: a canary bloom, a ring that draws itself, then a check.
 * Pure CSS (stroke-dashoffset keyframes), decorative only.
 */
export function SuccessMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative flex h-16 w-16 items-center justify-center", className)}>
      <span className={cn(styles.successBloom, "absolute inset-0 rounded-full bg-canary/60")} />
      <span className="absolute inset-[6px] rounded-full bg-ink" />
      <svg viewBox="0 0 52 52" className="relative h-16 w-16" fill="none">
        <circle cx="26" cy="26" r="24" stroke="var(--canary-500)" strokeWidth="1.5" className={styles.successRing} />
        <path
          d="M16.5 26.5l6.5 6.5 13-14"
          stroke="var(--canary-400)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.successCheck}
        />
      </svg>
    </span>
  )
}
