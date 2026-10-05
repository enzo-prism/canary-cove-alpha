"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Stylised chart of the arrival route: BZE on the mainland, a commuter hop to
 * San Pedro at the south end of Ambergris Caye, the short walk to the dock and
 * the boat run north to Canary Cove. `progress` (0–1) draws the route and moves
 * the traveller; `reached` is the furthest stop (0–3) to light up.
 *
 * Coordinates live in a 400×400 box. Everything that matters sits inside
 * x 40–360 / y 64–336 so the chart survives `slice` cropping in both the
 * landscape (phone) and portrait (desktop) frames.
 */

const LEGS = {
  flight: "M66 292 Q 150 196 252 236",
  walk: "M252 236 C 258 236 262 232 266 228",
  boat: "M266 228 C 290 212 292 182 272 160",
} as const

const STOPS = [
  { x: 66, y: 292, label: "BZE", sub: "Belize City", anchor: "middle" as const, lx: 66, ly: 314 },
  { x: 252, y: 236, label: "San Pedro", sub: "Airstrip", anchor: "end" as const, lx: 238, ly: 252 },
  { x: 266, y: 228, label: "", sub: "", anchor: "start" as const, lx: 0, ly: 0 },
  { x: 272, y: 160, label: "Canary Cove", sub: "", anchor: "end" as const, lx: 234, ly: 160 },
] as const

type RouteMapProps = {
  flight: MotionValue<number>
  walk: MotionValue<number>
  boat: MotionValue<number>
  reached: number
  animate: boolean
  className?: string
}

export function RouteMap({ flight, walk, boat, reached, animate, className }: RouteMapProps) {
  const flightRef = useRef<SVGPathElement>(null)
  const walkRef = useRef<SVGPathElement>(null)
  const boatRef = useRef<SVGPathElement>(null)
  const travellerX = useMotionValue<number>(STOPS[3].x)
  const travellerY = useMotionValue<number>(STOPS[3].y)

  const place = () => {
    const legs: [MotionValue<number>, SVGPathElement | null][] = [
      [boat, boatRef.current],
      [walk, walkRef.current],
      [flight, flightRef.current],
    ]
    // The traveller sits at the head of the furthest leg that has started.
    for (const [value, path] of legs) {
      const v = value.get()
      if (!path) continue
      if (v > 0.001 || path === flightRef.current) {
        const point = path.getPointAtLength(path.getTotalLength() * Math.min(1, Math.max(0, v)))
        travellerX.set(point.x)
        travellerY.set(point.y)
        return
      }
    }
  }

  useMotionValueEvent(flight, "change", place)
  useMotionValueEvent(walk, "change", place)
  useMotionValueEvent(boat, "change", place)
  useEffect(place)

  const flightOpacity = useTransform(flight, [0, 0.02], [0, 1])

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-labelledby="route-map-title"
      className={cn("block h-full w-full", className)}
    >
      <title id="route-map-title">
        Route map: fly into BZE near Belize City, take a 15-minute commuter flight to San Pedro on Ambergris Caye, then a
        15-minute boat ride about 6 miles north to Canary Cove.
      </title>
      <defs>
        <pattern id="route-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.6" />
        </pattern>
        <radialGradient id="route-map-glow" cx="70%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#7cc8c2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7cc8c2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sea */}
      <rect x="-40" y="-40" width="480" height="480" fill="#dfe9e2" />
      <rect x="-40" y="-40" width="480" height="480" fill="url(#route-map-glow)" />
      <rect x="-40" y="-40" width="480" height="480" fill="url(#route-map-grid)" className="text-ink" />

      {/* Depth contours along the mainland */}
      <g fill="none" stroke="#155e62" strokeOpacity="0.12" strokeWidth="0.8">
        <path d="M112 -10 C 104 40 122 80 116 120 C 110 162 130 198 122 238 C 114 282 134 322 126 362 C 122 384 128 398 130 410" />
        <path d="M130 -10 C 122 40 140 80 134 120 C 128 162 148 198 140 238 C 132 282 152 322 144 362 C 140 384 146 398 148 410" />
      </g>

      {/* Mainland Belize */}
      <path
        d="M-40 -40 H96 C 88 0 100 40 98 80 C 96 120 108 160 102 200 C 96 244 114 284 106 326 C 100 360 108 384 112 440 H-40 Z"
        fill="#efe7d8"
        stroke="#cdbfa5"
        strokeWidth="1"
      />
      <text x="54" y="196" textAnchor="middle" className="fill-ink/45 text-[9px] font-semibold tracking-[0.32em]">
        BELIZE
      </text>

      {/* Barrier reef */}
      <path
        d="M306 -20 C 314 70 322 150 316 230 C 312 290 302 350 298 420"
        fill="none"
        stroke="#1f8a8a"
        strokeOpacity="0.4"
        strokeWidth="1.4"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />

      {/* Ambergris Caye */}
      <path
        d="M226 -20 C 240 -20 248 20 252 60 C 256 104 270 150 272 196 C 274 226 268 246 258 250 C 248 254 244 240 246 214 C 248 176 236 128 230 84 C 226 50 218 -20 226 -20 Z"
        fill="#f7f2e9"
        stroke="#cdbfa5"
        strokeWidth="1"
      />
      {/* Caye Caulker, for scale */}
      <path d="M236 286 C 242 284 246 296 244 308 C 242 318 236 318 235 308 C 234 298 232 288 236 286 Z" fill="#f7f2e9" stroke="#cdbfa5" strokeWidth="1" />

      <text x="222" y="96" textAnchor="end" className="fill-ink/55 font-display text-[13px] italic">
        Ambergris Caye
      </text>
      <text x="176" y="328" textAnchor="middle" className="fill-lagoon/70 font-display text-[13px] italic">
        Caribbean Sea
      </text>

      {/* North arrow */}
      <g transform="translate(338 82)" className="text-ink">
        <circle r="13" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M0 -9 L4 3 L0 0 L-4 3 Z" fill="currentColor" fillOpacity="0.7" />
        <text y="-17" textAnchor="middle" className="fill-ink/60 text-[8px] font-semibold tracking-[0.2em]">
          N
        </text>
      </g>

      {/* Planned route (dotted) */}
      <g fill="none" stroke="#0d2327" strokeOpacity="0.28" strokeWidth="1.4" strokeDasharray="2 5" strokeLinecap="round">
        <path d={LEGS.flight} />
        <path d={LEGS.walk} />
        <path d={LEGS.boat} />
      </g>

      {/* Travelled route (draws with scroll) */}
      <g fill="none" strokeLinecap="round" strokeWidth="2.4">
        <motion.path
          ref={flightRef}
          d={LEGS.flight}
          stroke="#0d2327"
          style={{ pathLength: flight, opacity: animate ? flightOpacity : 1 }}
        />
        <motion.path ref={walkRef} d={LEGS.walk} stroke="#0d2327" style={{ pathLength: walk }} />
        <motion.path ref={boatRef} d={LEGS.boat} stroke="#155e62" style={{ pathLength: boat }} />
      </g>

      {/* Leg callouts */}
      <g className="text-[9px] font-semibold uppercase tracking-[0.16em]">
        <text
          x="150"
          y="214"
          textAnchor="middle"
          className={cn("fill-ink transition-opacity duration-700", reached >= 1 ? "opacity-70" : "opacity-30")}
        >
          15-min flight
        </text>
        <text
          x="298"
          y="194"
          textAnchor="start"
          className={cn("fill-lagoon transition-opacity duration-700", reached >= 3 ? "opacity-90" : "opacity-35")}
        >
          <tspan x="298">≈6 mi</tspan>
          <tspan x="298" dy="11">15 min</tspan>
        </text>
      </g>

      {/* Stops */}
      {STOPS.map((stop, index) => {
        const lit = index <= reached
        const final = index === STOPS.length - 1
        return (
          <g key={index}>
            {final ? (
              <circle
                cx={stop.x}
                cy={stop.y}
                r={lit ? 14 : 6}
                fill="#ffe41a"
                className={cn("transition-[r,opacity] duration-1000 ease-[var(--ease-out-expo)]", lit ? "opacity-35" : "opacity-0")}
              />
            ) : null}
            <circle
              cx={stop.x}
              cy={stop.y}
              r={final ? 6 : index === 2 ? 3 : 4.5}
              fill={lit ? (final ? "#ffe41a" : "#0d2327") : "#f7f2e9"}
              stroke="#0d2327"
              strokeWidth={final ? 1.6 : 1.4}
              className="transition-[fill] duration-500"
            />
            {stop.label ? (
              <text
                x={stop.lx}
                y={stop.ly}
                textAnchor={stop.anchor}
                className={cn(
                  "fill-ink transition-opacity duration-700",
                  final ? "font-display text-[17px]" : "text-[10px] font-semibold tracking-[0.12em]",
                  lit ? "opacity-100" : "opacity-55",
                )}
              >
                {stop.label}
              </text>
            ) : null}
            {stop.sub ? (
              <text
                x={stop.lx}
                y={stop.ly + 12}
                textAnchor={stop.anchor}
                className="fill-ink/55 text-[8.5px] tracking-[0.08em]"
              >
                {stop.sub}
              </text>
            ) : null}
          </g>
        )
      })}

      {/* Traveller */}
      {animate ? (
        <g>
          <motion.circle cx={travellerX} cy={travellerY} r={9} fill="#ffe41a" fillOpacity={0.35} />
          <motion.circle cx={travellerX} cy={travellerY} r={4} fill="#ffe41a" stroke="#0d2327" strokeWidth={1.4} />
        </g>
      ) : null}
    </svg>
  )
}
