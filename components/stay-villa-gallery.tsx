import { StayGallerySection, type StayGalleryFeature } from "@/components/stay-gallery-section"
import { IMAGES } from "@/lib/images"

const primaryGalleryItems: StayGalleryFeature[] = [
  {
    image: IMAGES.villaInteriorWide,
    title: "Open great room",
    detail: "The kitchen, lounge, and dining area stay connected so the whole villa feels social and airy.",
    ratio: 16 / 11,
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    image: IMAGES.villaMasterBedroom,
    title: "Primary suite",
    detail: "A king room with light, privacy, and easy access back to the pool deck.",
    // Landscape interior: a portrait frame would crop away half the room.
    ratio: 3 / 2,
  },
  {
    image: IMAGES.diningRoom,
    title: "Dinner indoors",
    detail: "A warm dining room for slower evenings when the group gathers inside.",
    // Landscape interior: a portrait frame would crop away half the room.
    ratio: 3 / 2,
  },
]

const secondaryGalleryItems: StayGalleryFeature[] = [
  {
    image: IMAGES.livingRoom,
    title: "Harbor-facing lounge",
    detail: "Deep seating and wide views keep the room calm between reef days.",
  },
  {
    image: IMAGES.viewFromKitchen,
    title: "Kitchen at the center",
    detail: "Prep space, island seating, and direct sightlines across the home.",
  },
  {
    image: IMAGES.villaBedroom,
    title: "Guest suite",
    detail: "One of the additional king rooms, designed with the same easy indoor-outdoor feeling.",
  },
  {
    image: IMAGES.bedroomGardenView,
    title: "Garden-facing room",
    detail: "A quieter suite tucked into the greenery for guests who want a softer morning start.",
  },
  {
    image: IMAGES.bathroomAlt,
    title: "Contemporary bath",
    detail: "Clean finishes, generous vanities, and room to reset after a full day outside.",
  },
  {
    image: IMAGES.bedDetail,
    title: "Thoughtful bedroom details",
    detail: "Considered touches throughout the bedrooms help the whole estate feel polished and cared for.",
  },
]

export function StayVillaGallery() {
  return (
    <StayGallerySection
      id="inside-the-villa"
      eyebrow="Inside the villa"
      title="Gather big, sleep private."
      description="Open gathering spaces stay connected to private suites, so your group moves easily from long meals to quiet, comfortable rooms."
      primaryItems={primaryGalleryItems}
      secondaryItems={secondaryGalleryItems}
    />
  )
}
