"use client"

import type { ReactNode } from "react"
import { motion, useScroll, useTransform } from "motion/react"

import { useMotionOk } from "@/components/motion/use-motion-ok"

/** Lifts and fades its children as the window scrolls from 0 to `distance` px (hero copy). */
export function ScrollFade({ children, className, distance = 700 }: { children: ReactNode; className?: string; distance?: number }) {
  const ok = useMotionOk()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, distance], ok ? [0, -90] : [0, 0])
  const opacity = useTransform(scrollY, [0, distance * 0.85], ok ? [1, 0] : [1, 1])
  return (
    <motion.div className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  )
}
