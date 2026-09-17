import { StayGallerySection, type StayGalleryFeature } from "@/components/stay-gallery-section"
import { IMAGES } from "@/lib/images"

const primaryGalleryItems: StayGalleryFeature[] = [
  {
    image: IMAGES.heroVillaSeating,
    title: "Pool deck at the center",
    detail: "The loungers, umbrellas, and shallow entry create an all-day basecamp for your group between meals and water departures.",
    ratio: 16 / 11,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    image: IMAGES.mainDock,
    title: "Private dock access",
    detail: "Your reef days begin right at the property, with boats ready and no transfer across a public marina.",
    // Landscape shot: a portrait frame would crop the boats at the edges.
    ratio: 3 / 2,
  },
  {
    image: IMAGES.villaLawn,
    title: "Waterfront lawn",
    detail: "The estate opens out toward the water with room to spread out, reset, and catch the breeze.",
    // Landscape shot: a portrait frame would crop away half the view.
    ratio: 3 / 2,
  },
]

const secondaryGalleryItems: StayGalleryFeature[] = [
  {
    image: IMAGES.villaPool,
    title: "Infinity-edge pool",
    detail: "A long pool deck makes it easy for the whole group to settle in at once.",
  },
  {
    image: IMAGES.heroVillaDetail,
    title: "Swim-up bar",
    detail: "The pool-side bar keeps afternoons social without anyone needing to leave the water.",
  },
  {
    image: IMAGES.hotTub,
    title: "Hot tub with a view",
    detail: "An easy evening landing spot once the sun starts to drop over the bay.",
  },
  {
    image: IMAGES.hammock,
    title: "Shaded downtime",
    detail: "Palm cover, hammocks, and quiet corners soften the pace between excursions.",
  },
  {
    image: IMAGES.bikes,
    title: "Grounds and gear",
    detail: "Beach bikes and on-property extras make the estate feel active without leaving home base.",
  },
  {
    image: IMAGES.waterSlide,
    title: "Playful water access",
    detail: "Slide days, dock jumps, and easy water access keep the outdoor side of the stay lively.",
  },
]

export function StayOutdoorGallery() {
  return (
    <StayGallerySection
      id="outside-the-villa"
      eyebrow="Outside the villa"
      title="Pool, palms, dock. Repeat."
      description="From the pool terrace to the dock and shoreline, the estate gives your group a private outdoor rhythm with space to lounge, swim, launch, and stay outside for hours."
      primaryItems={primaryGalleryItems}
      secondaryItems={secondaryGalleryItems}
    />
  )
}
