"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type AmbientVideoProps = {
  src: string
  poster: string
  className?: string
}

/**
 * Decorative, muted background loop. It is not a "film": no audio, no
 * controls, aria-hidden. Nothing downloads until it nears the viewport; it
 * pauses off-screen and never plays for reduced-motion visitors (they keep the
 * poster). User-started films with sound still use components/video-player.
 */
export function AmbientVideo({ src, poster, className }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduce.matches) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          setArmed(true)
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: "200px 0px" },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (armed) ref.current?.play().catch(() => {})
  }, [armed])

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      src={armed ? src : undefined}
      className={cn("pointer-events-none h-full w-full object-cover", className)}
    />
  )
}
