import { Waves } from "lucide-react"

import { ChapterMark } from "@/components/explore/chapter-mark"
import { DiveLog } from "@/components/explore/dive-log"
import { RISE } from "@/components/explore/reveal-classes"
import { Container } from "@/components/layout/container"
import { SplitText } from "@/components/motion/split-text"
import { VideoPlayer } from "@/components/video-player"
import { REEF_ENCOUNTER_VIDEOS, type ReefEncounterVideo } from "@/lib/videos"
import { cn } from "@/lib/utils"

/**
 * One reef film. The card itself never transforms (the release gate measures
 * its box and the player's 16:9 frame at load); only its caption copy rises.
 */
function ReefEncounterCard({
  video,
  index,
  featured = false,
}: {
  video: ReefEncounterVideo
  index: number
  featured?: boolean
}) {
  return (
    <article
      id={`film-${video.slug}`}
      data-testid={`reef-video-card-${video.slug}`}
      className="min-w-0 [--anchor-extra:2rem] overflow-hidden rounded-[var(--radius-media)] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
    >
      <figure>
        <div className="relative bg-black">
          <VideoPlayer
            src={video.src}
            poster={video.poster}
            title={video.title}
            durationLabel={video.duration}
            descriptionId={`${video.slug}-description`}
            preload={featured ? "metadata" : "none"}
            testId={`reef-video-${video.slug}`}
          />
        </div>

        <figcaption
          data-reveal="group"
          className={cn(
            "grid gap-3 p-5 sm:p-7",
            featured && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-12 lg:p-9",
          )}
        >
          <div className={cn("flow flow-xs", RISE)}>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
              <span className="font-display text-sm normal-case italic tracking-normal text-canary tabular">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{video.eyebrow}</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" />
              <span className="tabular">{video.duration}</span>
            </span>
            <h3
              className={cn(
                "font-display leading-[1.05] text-white",
                featured ? "text-[2rem] sm:text-[2.75rem]" : "text-[1.75rem] sm:text-[2rem]",
              )}
            >
              {video.title}
            </h3>
          </div>
          <p
            id={`${video.slug}-description`}
            className={cn("max-w-xl text-[15px] leading-7 text-white/70", RISE)}
            style={{ transitionDelay: "140ms" }}
          >
            {video.description}
          </p>
        </figcaption>
      </figure>
    </article>
  )
}

/**
 * "Below the surface": the dark reef chapter on /adventures. Three
 * user-started films (components/video-player.tsx) beside a depth-gauge dive
 * log. Exactly three <video> elements live on the page.
 */
export function ReefEncounters() {
  const [featuredVideo, ...supportingVideos] = REEF_ENCOUNTER_VIDEOS

  return (
    <section
      id="reef-encounters"
      className="surface-reef relative isolate overflow-clip py-24 sm:py-32 lg:py-40"
    >
      <div aria-hidden="true" className="caustics pointer-events-none absolute inset-0 -z-10 opacity-80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(180deg,rgba(124,200,194,0.12),transparent)]"
      />
      <Container size="wide" className="flex flex-col gap-14 sm:gap-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div className="flow flow-lg">
            <ChapterMark index="03" label="Below the surface · reef films" tone="light" />
            <SplitText as="h2" text="See what waits *beyond* the dock" className="text-section max-w-[14ch] text-balance" />
          </div>
          <p data-reveal="up" className="text-lede max-w-xl">
            Real footage from Canary Cove dives: giant manta rays overhead, remoras riding the current, and a hands-on
            lionfish conservation dive along the Belize reef.
          </p>
        </div>

        <DiveLog
          stops={REEF_ENCOUNTER_VIDEOS.map((video) => ({
            href: `#film-${video.slug}`,
            label: video.duration,
            title: video.title,
          }))}
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            <ReefEncounterCard video={featuredVideo} index={0} featured />
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {supportingVideos.map((video, index) => (
                <ReefEncounterCard key={video.slug} video={video} index={index + 1} />
              ))}
            </div>
          </div>
        </DiveLog>

        <p className="flex items-center gap-2 text-xs leading-5 text-white/55">
          <Waves className="size-3.5 shrink-0" aria-hidden />
          Original underwater footage shared by the Canary Cove team. Press play when you are ready; sound is optional.
        </p>
      </Container>
    </section>
  )
}
