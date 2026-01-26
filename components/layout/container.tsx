import type React from "react"

import { cn } from "@/lib/utils"

type ContainerProps = {
  children: React.ReactNode
  className?: string
  size?: "default" | "wide" | "narrow"
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-[1200px]",
  wide: "max-w-[1320px]",
  narrow: "max-w-[960px]",
}

export function Container({ children, className, size = "default" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-6 sm:px-8 lg:px-12", sizeClasses[size], className)}>
      {children}
    </div>
  )
}
