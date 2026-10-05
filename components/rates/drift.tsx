"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"

import { useMotionOk } from "@/components/motion/use-motion-ok"
import { cn } from "@/lib/utils"

type DriftProps = {
  children: ReactNode
  className?: string
  /** Vertical travel in px across the element's pass through the viewport. */
  distance?: number
  /** Optional rotation (deg) across the same pass. */
  rotate?: number
}

/**
 * Decorative scroll drift for oversized type and ornaments: the layer slides
 * (and optionally turns) against the scroll on a soft spring. Static for
 * reduced motion and during SSR.
 */
export function Drift({ children, className, distance = 120, rotate = 0 }: DriftProps) {
  const ref = useRef<HTMLDivElement>(null)
  const ok = useMotionOk()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 })
  const y = useTransform(smooth, [0, 1], ok ? [distance / 2, -distance / 2] : [0, 0])
  const r = useTransform(smooth, [0, 1], ok ? [-rotate / 2, rotate / 2] : [0, 0])

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none", className)}>
      <motion.div style={{ y, rotate: r }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}
