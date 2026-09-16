"use client"

import { useState } from "react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const FILM_POSTER = "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1761059677/outside_sq8dvn.webp"
const FILM_SRC = "https://res.cloudinary.com/dhqpqfw6w/video/upload/q_auto,vc_auto,w_1280/v1762995355/pv_mwqjho.mp4"

export function PropertyFilm() {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      data-testid="property-film"
      className="relative overflow-hidden rounded-[32px] border border-border/70"
    >
      <div className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[620px]">
        {playing ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="metadata"
            poster={FILM_POSTER}
            data-testid="property-film-video"
          >
            <source src={FILM_SRC} type="video/mp4" />
          </video>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FILM_POSTER}
              alt="Villa pool and deck overlooking the water"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
            <div className="relative z-10 flex min-h-[480px] flex-col p-6 sm:min-h-[520px] sm:p-10 lg:min-h-[620px]">
              <div className="flex min-h-16 flex-1 items-center justify-center py-6">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setPlaying(true)}
                  data-testid="property-film-play"
                  className="h-12 bg-white text-foreground hover:bg-white/90"
                >
                  Play diving film
                </Button>
              </div>
              <div data-testid="property-film-copy" className="shrink-0">
                <Badge className="border border-white/40 bg-white/10 text-white">Diving film</Badge>
                <h2
                  data-testid="property-film-heading"
                  className="mt-4 max-w-xl text-2xl font-semibold text-pretty text-white sm:text-3xl"
                >
                  World-class diving with a giant manta ray.
                </h2>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                    <TrackedLink
                      href="/book"
                      eventName="cta_click"
                      eventPayload={{ location: "dive_film", target: "/book" }}
                    >
                      Request a stay
                    </TrackedLink>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/70 text-white hover:bg-white hover:text-foreground"
                  >
                    <TrackedLink
                      href="/adventures#reef-encounters"
                      eventName="cta_click"
                      eventPayload={{ location: "dive_film", target: "/adventures" }}
                    >
                      More reef films
                    </TrackedLink>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
