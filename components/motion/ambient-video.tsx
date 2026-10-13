"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMotionOk } from "@/components/motion/use-motion-ok"

type AmbientVideoProps = {
  src: string
  poster: string
  className?: string
  paused?: boolean
  showPauseControl?: boolean
}

/**
 * Decorative, muted background loop. It is not a "film": no audio, no
 * controls, aria-hidden. Nothing downloads until it nears the viewport; it
 * pauses off-screen and never plays for reduced-motion visitors (they keep the
 * poster). User-started films with sound still use components/video-player.
 */
export function AmbientVideo({ src, poster, className, paused = false, showPauseControl = false }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const motionOk = useMotionOk()
  const [userPaused, setUserPaused] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setArmed(true)
      },
      { rootMargin: "0px" },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === "visible")
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => document.removeEventListener("visibilitychange", sync)
  }, [])

  useEffect(() => {
    const video = ref.current
    if (armed && inView && pageVisible && motionOk && !paused && !userPaused) video?.play().catch(() => {})
    else video?.pause()
  }, [armed, inView, pageVisible, motionOk, paused, userPaused])

  return (
    <>
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      src={armed && motionOk ? src : undefined}
      className={cn("pointer-events-none h-full w-full object-cover", className)}
    />
    {showPauseControl && motionOk ? (
      <button
        type="button"
        aria-label={userPaused ? "Resume reef background" : "Pause reef background"}
        aria-pressed={userPaused}
        onClick={() => setUserPaused((value) => !value)}
        className="focus-ring absolute right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full border border-white/40 bg-ink/70 text-white transition-colors hover:bg-ink"
      >
        {userPaused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
      </button>
    ) : null}
    </>
  )
}
