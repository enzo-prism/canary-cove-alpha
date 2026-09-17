import { Film, Waves } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { VideoPlayer } from "@/components/video-player"
import { REEF_ENCOUNTER_VIDEOS, type ReefEncounterVideo } from "@/lib/videos"

function ReefEncounterCard({ video, featured = false }: { video: ReefEncounterVideo; featured?: boolean }) {
  return (
    <Card
      className="group overflow-hidden rounded-[30px] border-border/55 bg-white/94 shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
      data-testid={`reef-video-card-${video.slug}`}
    >
      <figure>
        <div className="relative overflow-hidden border-b border-border/55 bg-foreground">
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

        <figcaption className={`flow-xs px-5 py-5 sm:px-6 ${featured ? "sm:py-6" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            <span>{video.eyebrow}</span>
            <span>{video.duration}</span>
          </div>
          <h3 className={`font-semibold tracking-tight text-foreground ${featured ? "text-[1.9rem] sm:text-[2.2rem]" : "text-[1.55rem]"}`}>
            {video.title}
          </h3>
          <p id={`${video.slug}-description`} className="text-sm leading-7 text-muted-foreground">
            {video.description}
          </p>
        </figcaption>
      </figure>
    </Card>
  )
}

export function ReefEncounters() {
  const [featuredVideo, ...supportingVideos] = REEF_ENCOUNTER_VIDEOS

  return (
    <section id="reef-encounters" className="scroll-mt-24 px-4 pb-16 pt-6 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
      <Container size="wide" className="flow flow-lg">
        <div className="max-w-3xl flow flow-xs">
          <Badge className="w-fit bg-transparent text-muted-foreground">
            <Film className="size-3.5" />
            Reef encounters on film
          </Badge>
          <h2 className="text-section text-[2.35rem] sm:text-[3rem]">See what waits beyond the dock</h2>
          <p className="text-body max-w-2xl">
            Real footage from Canary Cove dives: giant manta rays overhead, remoras riding the current, and a hands-on lionfish
            conservation dive along the Belize reef.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] lg:items-start">
          <ReefEncounterCard video={featuredVideo} featured />
          <div className="grid gap-6">
            {supportingVideos.map((video) => (
              <ReefEncounterCard key={video.slug} video={video} />
            ))}
          </div>
        </div>

        <p className="flex items-center gap-2 text-xs leading-5 text-muted-foreground">
          <Waves className="size-3.5 shrink-0" aria-hidden />
          Original underwater footage shared by the Canary Cove team. Press play when you are ready; sound is optional.
        </p>
      </Container>
    </section>
  )
}
