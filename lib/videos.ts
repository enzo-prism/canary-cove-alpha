export type ReefEncounterVideo = {
  slug: string
  title: string
  eyebrow: string
  description: string
  src: string
  poster: string
  duration: string
  featured?: boolean
}

export const REEF_ENCOUNTER_VIDEOS = [
  {
    slug: "manta-ray-rollover",
    title: "A manta rolls overhead",
    eyebrow: "Manta ray encounter",
    description:
      "Watch a giant manta glide directly above the divers during an unforgettable reef outing from Canary Cove.",
    src: "/videos/reef-encounters/manta-ray-rollover.mp4",
    poster: "/videos/reef-encounters/manta-ray-rollover-poster.jpg",
    duration: "1:02",
    featured: true,
  },
  {
    slug: "manta-ray-remoras",
    title: "Manta ray and remoras",
    eyebrow: "Up close underwater",
    description: "A close pass reveals the remoras traveling beneath the manta as it moves across the reef.",
    src: "/videos/reef-encounters/manta-ray-remoras.mp4",
    poster: "/videos/reef-encounters/manta-ray-remoras-poster.jpg",
    duration: "1:01",
  },
  {
    slug: "lionfish-hunt",
    title: "The Lion Hunters",
    eyebrow: "Reef conservation dive",
    description: "Follow Don Listwin and Gil Nuñez from the dock to a lionfish hunt on the Belize reef.",
    src: "/videos/reef-encounters/lionfish-hunt.mp4",
    poster: "/videos/reef-encounters/lionfish-hunt-poster.jpg",
    duration: "2:07",
  },
] as const satisfies readonly ReefEncounterVideo[]
