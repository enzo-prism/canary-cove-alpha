"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Loader2, Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"

import { formatVideoTime } from "@/lib/video-time"
import { cn } from "@/lib/utils"

type VideoPlayerProps = {
  src: string
  poster?: string
  /** Accessible name, e.g. the film title. */
  title: string
  /** Pre-known total (m:ss) shown before media metadata loads. */
  durationLabel?: string
  descriptionId?: string
  preload?: "none" | "metadata" | "auto"
  autoPlay?: boolean
  loop?: boolean
  /** Start muted (required for autoplay). */
  muted?: boolean
  /** Absolute-fill mode for cinematic placements; otherwise a 16:9 box. */
  fill?: boolean
  testId: string
  videoTestId?: string
  className?: string
}

type WebkitVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function VideoPlayer({
  src,
  poster,
  title,
  durationLabel,
  descriptionId,
  preload = "metadata",
  autoPlay = false,
  loop = false,
  muted = false,
  fill = false,
  testId,
  videoTestId,
  className,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hideTimer = useRef<number | null>(null)
  const [started, setStarted] = useState(autoPlay)
  const [playing, setPlaying] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [ended, setEnded] = useState(false)
  const [error, setError] = useState(false)
  const [isMuted, setIsMuted] = useState(muted || autoPlay)
  const [volume, setVolumeState] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bufferedEnd, setBufferedEnd] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [flash, setFlash] = useState<"play" | "pause" | null>(null)

  const video = () => videoRef.current

  const clearHideTimer = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }

  const pokeControls = useCallback(() => {
    setControlsVisible(true)
    clearHideTimer()
    hideTimer.current = window.setTimeout(() => {
      setControlsVisible(false)
    }, 2800)
  }, [])

  useEffect(() => () => clearHideTimer(), [])

  useEffect(() => {
    const node = video()
    if (!node) return
    node.muted = muted || autoPlay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  useEffect(() => {
    const node = video()
    if (!node) return

    const updateBuffered = () => {
      try {
        const ranges = node.buffered
        if (ranges.length > 0) setBufferedEnd(ranges.end(ranges.length - 1))
      } catch {
        setBufferedEnd(0)
      }
    }

    const listeners: Array<[string, () => void]> = [
      ["play", () => { setPlaying(true); setEnded(false); setWaiting(false); pokeControls() }],
      ["pause", () => { setPlaying(false); setWaiting(false); setControlsVisible(true) }],
      ["waiting", () => setWaiting(true)],
      ["playing", () => setWaiting(false)],
      ["canplay", () => setWaiting(false)],
      ["timeupdate", () => setCurrentTime(node.currentTime)],
      ["loadedmetadata", () => setDuration(node.duration || 0)],
      ["durationchange", () => setDuration(node.duration || 0)],
      ["progress", updateBuffered],
      ["ended", () => { setEnded(true); setPlaying(false); setControlsVisible(true) }],
      ["error", () => { setError(true); setWaiting(false); setControlsVisible(true) }],
      ["volumechange", () => { setIsMuted(node.muted); setVolumeState(node.volume) }],
    ]
    for (const [event, handler] of listeners) node.addEventListener(event, handler)
    // Metadata can arrive before listeners attach (preload on mount): sync once.
    if (node.readyState >= 1) {
      setDuration(node.duration || 0)
      setCurrentTime(node.currentTime)
    }
    setVolumeState(node.volume)
    setIsMuted(node.muted)
    updateBuffered()
    return () => {
      for (const [event, handler] of listeners) node.removeEventListener(event, handler)
    }
  }, [pokeControls])

  const showFlash = (kind: "play" | "pause") => {
    setFlash(kind)
    window.setTimeout(() => {
      setFlash((current) => (current === kind ? null : current))
    }, 550)
  }

  const togglePlay = useCallback(() => {
    const node = video()
    if (!node || error) return
    setStarted(true)
    setEnded(false)
    if (node.paused) {
      showFlash("play")
      void node.play().catch(() => {
        // AbortError from a pause race resolves via the pause event itself.
      })
    } else {
      showFlash("pause")
      node.pause()
    }
  }, [error])

  const restart = useCallback(() => {
    const node = video()
    if (!node) return
    setError(false)
    setEnded(false)
    setStarted(true)
    node.currentTime = 0
    void node.play().catch(() => undefined)
  }, [])

  const retry = useCallback(() => {
    const node = video()
    if (!node) return
    setError(false)
    node.load()
    void node.play().catch(() => undefined)
  }, [])

  const seekTo = useCallback((seconds: number) => {
    const node = video()
    if (!node || !Number.isFinite(node.duration)) return
    node.currentTime = clamp(seconds, 0, node.duration)
    setCurrentTime(node.currentTime)
  }, [])

  const seekBy = useCallback(
    (delta: number) => {
      const node = video()
      if (!node) return
      seekTo(node.currentTime + delta)
    },
    [seekTo],
  )

  const toggleMute = useCallback(() => {
    const node = video()
    if (!node) return
    node.muted = !node.muted
    if (!node.muted && node.volume === 0) node.volume = 0.5
  }, [])

  const setVolume = useCallback((value: number) => {
    const node = video()
    if (!node) return
    node.volume = clamp(value, 0, 1)
    node.muted = node.volume === 0
  }, [])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    const node = video() as WebkitVideoElement | null
    if (!container || !node) return
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined)
      return
    }
    if (container.requestFullscreen) {
      void container.requestFullscreen().catch(() => {
        node.webkitEnterFullscreen?.()
      })
    } else {
      node.webkitEnterFullscreen?.()
    }
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    const tag = target?.tagName
    // Let native controls (buttons, sliders) handle their own keys.
    if (tag === "BUTTON" && (event.key === " " || event.key === "Enter")) return
    if (tag === "INPUT" && event.key.startsWith("Arrow")) return

    switch (event.key) {
      case " ":
      case "k":
      case "K":
        event.preventDefault()
        togglePlay()
        break
      case "ArrowLeft":
        event.preventDefault()
        seekBy(event.shiftKey ? -10 : -5)
        break
      case "ArrowRight":
        event.preventDefault()
        seekBy(event.shiftKey ? 10 : 5)
        break
      case "ArrowUp":
        event.preventDefault()
        setVolume(volume + 0.1)
        break
      case "ArrowDown":
        event.preventDefault()
        setVolume(volume - 0.1)
        break
      case "m":
      case "M":
        toggleMute()
        break
      case "f":
      case "F":
        toggleFullscreen()
        break
      case "Home":
        event.preventDefault()
        seekTo(0)
        break
      case "End":
        event.preventDefault()
        seekTo(duration)
        break
    }
  }

  // Big-button states (poster play, replay, error) own the stage: the transport
  // bar only exists during playback or pause, so it can never overlap them.
  const showBar = (controlsVisible || !playing) && started && !ended && !error
  const progress = duration > 0 ? clamp((currentTime / duration) * 100, 0, 100) : 0
  const buffered = duration > 0 ? clamp((bufferedEnd / duration) * 100, 0, 100) : 0
  const totalLabel = duration > 0 ? formatVideoTime(duration) : (durationLabel ?? "0:00")
  const timeLabel = `${formatVideoTime(currentTime)} of ${totalLabel}`

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="video player"
      aria-label={title}
      aria-describedby={descriptionId}
      tabIndex={0}
      data-testid={testId}
      onKeyDown={handleKeyDown}
      onMouseMove={pokeControls}
      onTouchStart={pokeControls}
      onFocus={pokeControls}
      className={cn(
        "group/player relative select-none overflow-hidden bg-black outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/40",
        fill ? "absolute inset-0" : "aspect-video w-full",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        playsInline
        loop={loop}
        muted={muted || autoPlay}
        autoPlay={autoPlay}
        preload={preload}
        poster={poster}
        tabIndex={-1}
        aria-hidden="true"
        data-testid={videoTestId ?? `${testId}-element`}
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support HTML video.
      </video>

      {/* Center state layer */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {!started && !error ? (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={`Play ${title}`}
            data-testid={`${testId}-play`}
            className="focus-ring pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#0B1F24] shadow-[0_16px_50px_rgba(0,0,0,0.35)] motion-safe:transition-transform motion-safe:duration-200 hover:scale-105 active:scale-95 min-[420px]:h-20 min-[420px]:w-20 sm:h-24 sm:w-24"
          >
            <Play className="ml-1 h-7 w-7 fill-current min-[420px]:h-8 min-[420px]:w-8 sm:h-9 sm:w-9" aria-hidden />
          </button>
        ) : null}

        {waiting && started && !error ? (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60" role="status">
            <Loader2 className="h-7 w-7 animate-spin text-white" aria-hidden />
            <span className="sr-only">Loading video</span>
          </span>
        ) : null}

        {flash && started && !waiting && !ended && !error ? (
          <span
            key={`${flash}-${currentTime}`}
            className="video-flash flex h-16 w-16 items-center justify-center rounded-full bg-black/60"
            aria-hidden
          >
            {flash === "play" ? (
              <Play className="ml-1 h-7 w-7 fill-white text-white" />
            ) : (
              <Pause className="h-7 w-7 fill-white text-white" />
            )}
          </span>
        ) : null}

        {ended && !error ? (
          <button
            type="button"
            onClick={restart}
            aria-label={`Replay ${title}`}
            data-testid={`${testId}-replay`}
            className="focus-ring pointer-events-auto flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full bg-white/95 text-[#0B1F24] shadow-[0_16px_50px_rgba(0,0,0,0.35)] motion-safe:transition-transform motion-safe:duration-200 hover:scale-105 active:scale-95 min-[420px]:h-20 min-[420px]:w-20"
          >
            <RotateCcw className="h-6 w-6 min-[420px]:h-7 min-[420px]:w-7" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-widest min-[420px]:text-[11px]">Replay</span>
          </button>
        ) : null}

        {error ? (
          <div className="pointer-events-auto flex max-w-xs flex-col items-center gap-3 rounded-3xl bg-black/70 px-6 py-5 text-center backdrop-blur-md">
            <p className="text-sm font-medium text-white">This film wouldn&apos;t load.</p>
            <button
              type="button"
              onClick={retry}
              data-testid={`${testId}-retry`}
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#0B1F24] hover:bg-white/90"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Try again
            </button>
          </div>
        ) : null}
      </div>

      {/* Bottom scrim + control bar */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent motion-safe:transition-opacity motion-safe:duration-300",
          showBar ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        inert={!showBar}
        className={cn(
          "absolute inset-x-3 bottom-3 flex items-center gap-1 rounded-full bg-black/70 py-1.5 pl-1.5 pr-3 text-white shadow-[0_10px_35px_rgba(0,0,0,0.35)] backdrop-blur-md motion-safe:transition-all motion-safe:duration-300 sm:inset-x-4 sm:bottom-4",
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
        data-testid={`${testId}-controls`}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          data-testid={`${testId}-toggle`}
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/15 active:bg-white/25"
        >
          {playing ? (
            <Pause className="h-5 w-5 fill-current" aria-hidden />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />
          )}
        </button>

        <span className="hidden shrink-0 px-1 text-xs font-medium tabular-nums text-white/85 min-[420px]:inline" aria-hidden="true">
          {formatVideoTime(currentTime)} / {totalLabel}
        </span>

        <div className="relative flex h-11 min-w-0 flex-1 items-center px-1">
          <div aria-hidden className="absolute inset-x-1 h-1 overflow-hidden rounded-full bg-white/25">
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/45" style={{ width: `${buffered}%` }} />
            <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progress}%` }} />
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0.1)}
            step={0.1}
            value={clamp(currentTime, 0, Math.max(duration, 0.1))}
            onChange={(event) => seekTo(Number(event.target.value))}
            aria-label={`Seek in ${title}`}
            aria-valuetext={timeLabel}
            data-testid={`${testId}-seek`}
            className="video-range focus-ring relative w-full rounded-full"
          />
        </div>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? `Unmute ${title}` : `Mute ${title}`}
          data-testid={`${testId}-mute`}
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/15 active:bg-white/25"
        >
          {isMuted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
        </button>

        <div className="relative hidden h-11 w-16 shrink-0 items-center sm:flex">
          <div aria-hidden className="absolute inset-x-0 h-1 overflow-hidden rounded-full bg-white/25">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label={`Volume for ${title}`}
            data-testid={`${testId}-volume`}
            className="video-range focus-ring relative w-full rounded-full"
          />
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? `Exit fullscreen for ${title}` : `Fullscreen ${title}`}
          data-testid={`${testId}-fullscreen`}
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/15 active:bg-white/25"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" aria-hidden /> : <Maximize className="h-5 w-5" aria-hidden />}
        </button>
      </div>
    </div>
  )
}
