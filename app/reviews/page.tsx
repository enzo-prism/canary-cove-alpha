import Image from "next/image"
import type { CSSProperties } from "react"

import { Footer } from "@/components/footer"
import { CountIn } from "@/components/gallery/count-in"
import { Header } from "@/components/header"
import { Container } from "@/components/layout/container"
import { Marquee } from "@/components/motion/marquee"
import { Parallax } from "@/components/motion/parallax"
import { SplitText } from "@/components/motion/split-text"
import { PageHero } from "@/components/page-hero"
import { ReviewsArchive } from "@/components/reviews-archive"
import { JumpLink } from "@/components/reviews/jump-link"
import { PageStructuredData } from "@/components/structured-data"
import { CtaLink } from "@/components/ui/cta-link"
import { IMAGES, imageObjectPosition } from "@/lib/images"
import { PAGE_METADATA } from "@/lib/seo"

export const metadata = PAGE_METADATA.reviews

type TestimonialEntry = {
  quote: string
  author?: string
}

type TestimonialGroup = {
  year: string
  entries: TestimonialEntry[]
}

const TESTIMONIALS: TestimonialGroup[] = [
  {
    year: "2024",
    entries: [
      {
        quote:
          "What a perfect vacation! The house is wonderful, staff beyond our wildest dreams, dining like no other! Thank you for one of the most memorable vacations of our lives. We will be back for sure.",
        author: "Bernthal/Stambaugh family",
      },
    ],
  },
  {
    year: "2017",
    entries: [
      {
        quote:
          'Thank you so much for the amazing opportunity at Canary Cove. We all very much enjoyed it, especially Julian. He called it "paradise"...it truly was. All the staff were very accommodating and helpful. They made our trip spectacular and the food was simply delicious. Kelly and I, too, have fell in love with Belize as you have. We have made a donation online to the BelizeKids foundation to help with your cause in Belize and helping children gain access to things Julian has at his fingertips. From the whole family, thanks again.',
        author: "A. and family",
      },
      {
        quote:
          "Your gracious hospitality has made our stay more wonderful than I could have imagined. You have a beautiful home here in paradise!",
        author: "G. and family",
      },
      {
        quote: "Thank you for everything, we had an amazing week in paradise because of all of you!",
        author: "Matt & Donetta, Stacey & John, Kelly & Greg, Bridget & Cully",
      },
      {
        quote: "Thank you SO much for making us have an amazing trip! I will always remember the Lava Cake!",
        author: "Ben",
      },
      {
        quote:
          "Thank you so much for making this an incredible trip for us! It was truly spectacular and I'm so grateful to have had it! Cannot wait to come back again soon!!",
      },
      {
        quote: "Thank you for making AMAZING meals, helping with the house, and taking care of Ryder and me.",
        author: "C.C.",
      },
      {
        quote:
          "Thank you SO much for taking care of my family & for feeding us the most AMAZING food each & every day. We want to bring you all to CA with us! Love you guys & will miss you.",
        author: "Emm",
      },
      {
        quote: "Thanks so much for taking such amazing care of us at all points. And the food was AMAZING!!",
        author: "Art",
      },
      {
        quote:
          "Canary Cove! So grateful for numerous unexpected delightful surprises. Many first for me: SCUBA diving (3 times) in the capable and talented hands of Palma; Lionfish kills (3!); swimming with the shrks, rays and Oscar the turtle, green and spotted moray eels, Spiney lobsters, and a rainbow of spectacular reef fish. Relaxing by the pool at the end of the day, watching swallows swoop down and splash in the pool, then shake themselves mid-air. Tossing sardines from the dock to the Frigate birds high above. The good humor and comfort brought to us each day by Nathalie, Mayra, Jaime, Gil, Mike, and Palma - what beautiful souls! Ah, the infectious laughter of Mike! Thank you, thank you, thank you all! We are so lucky and lucky we would be to retain the kindness and care.",
        author: "L.",
      },
      {
        quote:
          "Such a magical spot, on so many levels - the site, the sights, the house, the team, the town, the vibe, the food, the water, the fishing - we could go on & on - your team here is really excellent, and stands as a testament to you and your vision.",
        author: "R. And family",
      },
      {
        quote:
          "We had some quality time on the horizontal here: swimming, snorkeling, sleeping, reading. It has been a week of golden moments, beautiful sunsets, full moon rise, swimming with nurse sharks, watching rays nestle into the sand, and sliding down the slide into the perfect water. Thank you for providing a little bit of heaven.",
        author: "C., R., & crew",
      },
      {
        quote:
          "I am very lucky to have had a chance to hang here with all the magic you have created with your team and turtles and all that makes Canary Cove so special.",
        author: "R.",
      },
      {
        quote:
          "In 6 days we packed enough adventure into fabulous vacation to last a long time. The staff were FANTASTIC, catering to our every need, ensuring safety first of all but incredible fun was had by all. Snorkeling, SCUBA, bone fishing and non-stop eating made this a trip to remember. Fireworks in town went on & on, and we made it safely by boat thanks to Mike. Thank you for everything.",
        author: "G. & family",
      },
      {
        quote:
          "Hell no, we won't go!! Alas, we had to go. Our time at Canary Cove was AWESOME. The staff, food, activities were over the top!",
        author: "G. Family",
      },
    ],
  },
  {
    year: "3/2016",
    entries: [
      {
        quote:
          "Canary Cove has been a dream - Gil, Oscar, Nathalie, Mike, Palma - you've made this place such a cozy and effortless home for us. Thank you x1000 for all your help and daily care, we couldn't imagine the experience without your kindness and patience. Please send our gratitude to all your staff and extend our warmth to your families. San Pedro wouldn't be the island we've enjoyed without you. Canary Cove is a dream come true. I can't image a more beautiful, delicious, relaxing, incredible way to spend spring break. Huge heartfelt thanks to the staff for making us feel so at home and for letting us experience a little slice of paradise! So much love and gratitude - thanks for sharing this lovely place!",
        author: "S.",
      },
      {
        quote:
          "This has provided one of the most unique & complete vacation experiences I have ever had the privilege to be on - it has allowed a group of wonderful, kind people to be together for a period of time and in such a way that would NEVER have been possible without the kindness of everyone at Canary Cove. Thank you so much for all you have done, from dealing with our erratic drink orders and inability to eat meals on time to helping us with lighting for our music video - and never laughing at our costumes & antics. This has been a dream come true.",
        author: "C.",
      },
      {
        quote:
          "Thank you so much Nathalie, Gil, Palma, Michael for being so kind to us, and for creating such an unforgettable experience. We are so grateful!",
        author: "R.",
      },
    ],
  },
  {
    year: "1/2016",
    entries: [
      {
        quote:
          "What an incredible place with its beautiful house and never-ending amenities and array of activities! However, it is everyone here who made our stay amazing and an exceptional experience. Nothing but praise and many, many thanks to Nathalie, Palma, Mike, Sergio, Diana, Jaime, Gil, and the others whom we never had the opportunity to meet. You all did so much to make our time here remarkably fun, relaxing and enjoyable. No detail was left undone - you are the best! From our greeting with rum punches on the dock, amazing meals, lionfish ceviche, floating deck, terrific dives, spotless house, beautiful gardens, smiling faces, Canary Cove impressed us to the last day watching the sunrise before departure - total perfection. We appreciate all that you did for an unforgettable time. Thank you everyone! We truly hope to see you again!",
        author: "P. Family, Pennsylvania",
      },
    ],
  },
  {
    year: "7/2015",
    entries: [
      {
        quote:
          "Canary Cove - it has been an absolute pleasure staying in the amazing home! Not only does the house have EVERYTHING imaginable, but the staff has been the BEST! I will miss you Canary Cove & Oscar, Gil, Jaime & Nathalie & the rest of the crew. Thank you, thank you!",
        author: "R.",
      },
      {
        quote: "The house is beautiful, the staff is amazing, the food was wonderful. Can't wait to come back!!",
        author: "T.",
      },
      {
        quote: "Had a wonderful time, amazing food and the staff was so nice. Thank you!",
        author: "T.",
      },
      {
        quote:
          "I had a BLAST. Oscar, Jaime, Nathalie, Chris, Gil - EVERYONE was amazing & nice. Yummy food, Nathalie! Hope we come back next summer!",
        author: "K.",
      },
      {
        quote: "I'm truly blessed to have been able to experience this place and the beautiful, sweet people. I love Belize!",
        author: "S.",
      },
      {
        quote: "House & food & staff were a perfect combo. View was amazing as well!",
        author: "M., Texas",
      },
      {
        quote: "Thanks for the ride, Belize! Canary Cove made this place feel like a dream! Thank you all!",
        author: "S.",
      },
      {
        quote:
          "Gracias por todas sus atenciones todo estuvo super la comida todos los lugares Belize es hermoso como toda la gente mil gracias a cuela uno de ustedes. (Thank you for all your attention, everything, super food, all of Belize is beautiful as are all the people; thousand thanks to each of you.)",
        author: "R.",
      },
      {
        quote:
          "Thank you so much for your hospitality! This house & staff are nothing short of amazing! I hope to see you all again!",
        author: "T.",
      },
      {
        quote: "You have handpicked the best staff on the island. Thanks for everything!",
        author: "J.",
      },
      {
        quote:
          "What an amazing week! The Canary Cove team has truly exceeded all my expectations, and I will miss them all! Now it's back to reality and the gym to work off all the delicious food that Nathalie prepared! Hope to see you again soon!",
        author: "M.",
      },
      {
        quote: "One of the most amazing houses I've ever stayed at. Impeccable service. Just wow! Can't wait to come back.",
        author: "E.",
      },
      {
        quote:
          "Canary Cove is truly heaven on earth! Oscar rocks the bar whether it's on the swimming platform or at the house. Nathalie - the food was amazing! Who will forget Mike's sweet smile! Jaime made sure we had everything we needed. Can't wait to come back & dive with Gil! Canary Cove has a piece of my heart! See you soon.",
        author: "S., Texas",
      },
    ],
  },
  {
    year: "3/2015",
    entries: [
      {
        quote:
          'Thank for sharing your Amazing Canary Cove! We have had a "once in a lifetime" vacation that we will never forget. So many memories were made this week. Great food and fabulous family time. The staff took such good care of us - it truly made this the most enjoyable vacation ever. We saw Mike\'s "Canary Foundation" ballcap and googled it and are so moved by your vision and dedication. We look forward to adding it to our list of charities to support.',
        author: "S. & family, Colorado",
      },
      {
        quote:
          "A piece of heaven here on earth... First trip to Belize & cannot say enough about our experience! The joy girls felt the entire trip... swimming with sharks, rays, starfish, conch. The gorgeous setting, pools & most importantly the PEOPLE. The kids got to be kids & parents did too... so many new experiences; incredible weather, beautiful accommodations. Thank you for having this dream & opening it up to us. We hope to return soon. Truly, the staff made the trip the most fun, leisurely, recharging ever - Gill, Mike, Jaime, Sergio, Nathalie, Diana, Omar, Mr. B(?), the sweet housekeeping. The snorkel platform - our favorite!",
        author: "T. & family, Colorado",
      },
      {
        quote: "Best trip ever! I definitely won't forget it!",
        author: "G., kid",
      },
      {
        quote: "This has been the best vacation ever. I have made so many incredible memories.",
        author: "K., kid",
      },
      {
        quote: "I will always remember this trip and the great memories made!",
        author: "B., kid",
      },
      {
        quote:
          "Thank you for making your dream a reality. The house, the staff, the experience was beyond our expectations! The turtles, starfish, sharks & rays, etc., etc. were amazing to experience with Mike! Sand dollars, squid, lobsters, oh my! The private island on Mexico Rock was such a treat. So many memories! Thank you!",
        author: "S. & family, Colorado",
      },
      {
        quote:
          "I enjoyed all of the fabulous experiences! I was able to check so many activities off of my bucket list just within the first few hours upon arriving! I had the time of my life! Thank you for all your help & guidance. I cannot wait to get back! I felt like royalty!",
        author: "C.",
      },
      {
        quote:
          "Thank you so much for the best, most epic & memorable Girls Trip ever! We all had the most amazing trip and don't want to leave! Nathalie's meals were all perfect - delicious and healthy. The boys - Mike, Gil and Palma made our stay the funnest possible trip ever! Mike's bartending skills were also PERFECT! Than you Mike for putting up with us all and being the funnest staff ever. Can't wait to come back!!",
        author: "H., Tennessee",
      },
      {
        quote:
          "Thank you so much for sharing your amazing home! This was one of the best trips I have ever been on. Your home and the view is absolutely incredible. Every single staff member made the trip so enjoyable and they were all incredible. I will remember this trip for the rest of my life!",
        author: "C., California",
      },
      {
        quote:
          "Thank you for your amazing tropical home. Palma, Mike and the rest of the staff were unbelievably helpful and fun for the entire trip. We enjoyed every single moment here and will treasure the memories we made.",
        author: "A., California",
      },
      {
        quote:
          'Canary Cove is such a magical "Home-tel". I could not have spent a week on vacation anywhere better! The house, the staff, the food, the water... everything was beyond words. Thank you for this lifelong memory! I will be sure to spread the word about what a wonderful place Canary Cove is! We love Belize!',
        author: "B., California",
      },
    ],
  },
  {
    year: "1/2015",
    entries: [
      {
        quote:
          "Thank you for a wonderful vacation - the BEST snorkeling ever! Best tubing ever! Great week in paradise.",
        author: "K. & family, Georgia",
      },
    ],
  },
  {
    year: "10/2014",
    entries: [
      {
        quote:
          "Colin & Pete's Great Adventure - A week of drinking, fun, scuba, and water activities. Swimming with the sharks and rays and joining the nightlife in San Pedro were highlights! Very friendly and great memories. Until next time!",
        author: "Pete (Michigan)",
      },
      {
        quote: "Beautiful home; amazing, wonderful staff that I now consider friends. Hope to be back soon.",
        author: "J., North Carolina",
      },
      {
        quote: "Such an amazing trip, great home, staff, people and lots of fun.",
        author: "M., Monaco",
      },
      {
        quote: "What a wonderful escape.",
        author: "P., Florida",
      },
      {
        quote: "Thanks for the fun, great week!",
        author: "V., Texas",
      },
      {
        quote:
          "This was a wonderful trip, which was made memorable by the amazing staff & beautiful house & grounds. A truly unforgettable vacation & stay. Would come back to Belize again!",
        author: "K., Michigan",
      },
      {
        quote: "What an amazing trip - beautiful home!! The staff was great. Thank you!",
        author: "D. & B.",
      },
    ],
  },
  {
    year: "8/2014",
    entries: [
      {
        quote: "Thank you so much for all of the fun! I loved it when we went snorkeling!",
        author: "M., California kid",
      },
      {
        quote: "Thank you for the diving, skiing, paddle boarding, tubing, drinks & food!",
        author: "J., California",
      },
      {
        quote:
          "Thank you so much. I had an awesome time! My top two picks of the trip would have to be scuba diving and wakeboarding.",
        author: "L., California kid",
      },
      {
        quote:
          "Thank you so much for having us here. I had so much fun scuba diving, swimming, snorkeling, wakeboarding, and tubing. Coming here is always the highlight of my summer.",
        author: "T., California kid",
      },
      {
        quote: "So fun to be here with our family! Thanks for helping us create great memories!",
        author: "A., California",
      },
    ],
  },
  {
    year: "2/2014",
    entries: [
      {
        quote:
          "Thank you for opening your wonderful home to us this past week! We had a truly magical stay. We hope to be back again soon!",
        author: "D.",
      },
      {
        quote:
          "You have truly found a slice of paradise & created on it just about the closest thing to Heaven on Earth. We thank you with all of our hearts for sharing it with us. Your staff is THE BEST! We have spent our days here in awe & wonder, and depart now with gratitude.",
        author: "D. & C., California",
      },
    ],
  },
  {
    year: "6/2013",
    entries: [
      {
        quote: "Thank you for being such gracious hosts! It was wonderful to spend time here.",
        author: "M. & B., Oregon",
      },
    ],
  },
  {
    year: "1/2013",
    entries: [
      {
        quote:
          'Thank you, thank you, thank you! We are so lucky to have started our new year in "Don\'s Dream". Such a beautiful place. Many memories have been made at Canary Cove!',
        author: "S. Family",
      },
    ],
  },
  {
    year: "12/2012",
    entries: [
      {
        quote:
          "Thank you for accommodating our group - even with 12 diners (many extra thanks to Gil)! Hope to see you again soon!",
        author: "M. Family",
      },
      {
        quote:
          "You are so appreciated. You took care of us with love and generosity... and all of the staff are really fun!",
        author: "J.",
      },
    ],
  },
  {
    year: "8/2012",
    entries: [
      {
        quote:
          'Wow, what a truly amazing place! The scenery is breathtaking, the facilities fantastic, and the staff\'s hospitality was the best. We enjoyed all the activities from snorkeling, diving, kayaking, paddle boarding, swimming & lounging around the pool, the platform as Mexico Rocks, seeing the school in San Pedro, playing "Jungle Ball", extreme puzzling, and peaceful sleeps. A special thank you to Gil for teaching Jason how to scuba dive - it was a huge thrill for him! And to Mike for guiding us through Hol Chan. Thank you again for sharing your home with us.',
        author: "C., D., B. & J.",
      },
      {
        quote:
          "Thanks for everything this trip! I had a blast - the staff was super sweet & fun. Thanks to Mike for the awesome snorkel trip + the sharks.",
        author: "B. kid",
      },
      {
        quote: "Thank you to all the wonderful staff at Canary Cove. We love you guys! I will never forget this trip!",
        author: "D.",
      },
    ],
  },
  {
    year: "7/2012",
    entries: [
      {
        quote:
          "What a banner week we had! Lionfish, sharks, turtles, rays, ginormous grouper, paddleboarding, kayaking, iguana, delicious meals, fresh coconut, movies - fun, fun, fun with plenty of r & r. Thank you so much for sharing your home with us.",
        author: "A. & family, California",
      },
      {
        quote: "It was the shortest and best time out here in Belize. Each trip brings a new adventure.",
        author: "D., California",
      },
      {
        quote:
          "Thank you for having a pool. I am so happy that I reached the goal of getting certified as a scuba diver. I loved staying here. I had a great time.",
        author: "California kid",
      },
      {
        quote: "I love Canary Cove. I love the yellow. You have AWESOME fries. There is so much to do here!",
        author: "L., Connecticut kid",
      },
      {
        quote:
          "We did it! We did it! We did it, yeah! Thanks to Gil, I finally dove past 12'! I love your Belizian Paradise!",
        author: "P., Connecticut",
      },
    ],
  },
  {
    year: "5/2012",
    entries: [
      {
        quote:
          "Could a week be any better?! My birthday celebration was fun & fabulous. Lionfish hunting was so exciting. Playing in the pool was great. Your beautiful Belizean home is unbelizable!",
        author: "A. & A., California",
      },
      {
        quote: "Another Amazing Week!",
        author: "M., California",
      },
      {
        quote:
          "Thank you for a great vacation, super hospitality and amazing surroundings. We will be back for sure!",
        author: "K. & K., Washington",
      },
    ],
  },
  {
    year: "12/2011",
    entries: [
      {
        quote:
          "Thank you for sharing your beautiful Canary Cove retreat! We had a fabulous time and are very appreciative of the staff's hospitality! Thank you again for the wonderful time and great memories that we have created.",
        author: "C., California",
      },
      {
        quote: "The drinks and diving were fantastic, hope we have the pleasure to return soon.",
        author: "K., California",
      },
      {
        quote:
          "Thanks for an excellent time. We will remember and recount our time here for years. This place is gorgeous. The Canary Cove crew could not have been nicer.",
        author: "J. & E., California",
      },
    ],
  },
  {
    year: "8/2011",
    entries: [
      {
        quote: "Another AMAZING vacation - thank for everything!",
        author: "M., D. & family, California",
      },
      {
        quote:
          "From snorkeling to diving, platform play, play structure to lounging in the pool - what a wonderful opportunity to relax and enjoy family. The hospitality at Canary Cove is un-Belize-able!",
        author: "A. & family, California",
      },
      {
        quote:
          "Canary Cove is an amazing place to go! I went snorkeling, fishing, and just hung out in the pool. My favorite thing on this trip would have to be scuba diving. Everything here is great and I am sure this is a vacation I will never forget! Thank you!",
        author: "L., California kid",
      },
      {
        quote:
          "Amazing!! Thank you for a wonderful vacation in paradise called Canary Cove. Thank you for sharing with us.",
        author: "J., California",
      },
      {
        quote:
          "I loved everything from scuba diving to snorkeling, but my favorite things were grabbing coconuts, hunting lionfish, and petting sharks. Thanks for everything.",
        author: "T., California kid",
      },
    ],
  },
  {
    year: "7/2011",
    entries: [
      {
        quote:
          "Thank you for my fabulous time. Too fabulous for words!! Thank you for everything. Canary Cove is THE BEST tropical retreat.",
        author: "P., M. & family, Connecticut",
      },
    ],
  },
]

const extractYearNumber = (label: string) => {
  const match = label.match(/(\d{4})$/)
  return match ? Number(match[1]) : Number.NaN
}

const totalReviews = TESTIMONIALS.reduce((count, group) => count + group.entries.length, 0)
const totalVisits = TESTIMONIALS.length
const archiveYears = Array.from(
  new Set(TESTIMONIALS.map((group) => extractYearNumber(group.year)).filter((year) => Number.isFinite(year))),
).sort((a, b) => a - b)

const archiveStartYear = archiveYears[0]
const archiveEndYear = archiveYears[archiveYears.length - 1]
const archiveSpanYears = archiveEndYear - archiveStartYear + 1

/**
 * Where guests signed from, read straight off the guestbook attributions
 * ("K., Michigan", "Pete (Michigan)", "L., Connecticut kid"). Nothing here is
 * typed by hand, so the list can only ever repeat what guests wrote.
 */
const SIGNED_FROM = (() => {
  const places: string[] = []
  for (const group of TESTIMONIALS) {
    for (const entry of group.entries) {
      const author = entry.author ?? ""
      const paren = author.match(/\(([^)]+)\)\s*$/)
      const tail = paren ? paren[1] : author.includes(",") ? author.slice(author.lastIndexOf(",") + 1) : ""
      const place = tail.replace(/\bkid\b/i, "").trim()
      if (!place || place.length < 4 || /\.|&|family|crew/i.test(place)) continue
      if (!places.includes(place)) places.push(place)
    }
  }
  return places
})()

// Featured notes, verbatim from the archive above. The newest (2024) note
// already leads /dining, so the spotlight opens on other voices.
const REVIEW_SPOTLIGHTS = [
  {
    quote:
      "Such a magical spot, on so many levels - the site, the sights, the house, the team, the town, the vibe, the food, the water, the fishing - we could go on & on - your team here is really excellent, and stands as a testament to you and your vision.",
    author: "R. And family",
    year: "2017",
    anchor: "#year-2017",
  },
  {
    quote: "Beautiful home; amazing, wonderful staff that I now consider friends. Hope to be back soon.",
    author: "J., North Carolina",
    year: "2014",
    anchor: "#year-2014",
  },
  {
    quote: "Best trip ever! I definitely won't forget it!",
    author: "G., kid",
    year: "2015",
    anchor: "#year-2015",
  },
] as const

const REVIEW_ANCHORS = [
  { label: "Start here", href: "#start-here" },
  { label: "The archive", href: "#guest-testimonials" },
  { label: "Plan your stay", href: "#reviews-plan" },
] as const

const [leadSpotlight, ...supportingSpotlights] = REVIEW_SPOTLIGHTS

export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <PageStructuredData path="/reviews" />

      <PageHero
        variant="split"
        eyebrow={`Guestbook · ${archiveStartYear}–${archiveEndYear}`}
        title={`${archiveSpanYears} years of *guestbook* notes.`}
        lede={
          <>
            Unedited notes from the villa guestbooks, {archiveStartYear}–{archiveEndYear}. Read what stays with guests —
            the staff by name, the chef&apos;s table, the reef days — then write your own chapter.
          </>
        }
        actions={
          <>
            <CtaLink
              href="/book"
              size="lg"
              eventName="cta_click"
              eventPayload={{ location: "reviews_hero", target: "/book" }}
            >
              Check dates
            </CtaLink>
            <nav aria-label="On this page" className="flex flex-wrap items-center gap-x-5 gap-y-1 pl-1 text-sm">
              {REVIEW_ANCHORS.map((anchor) => (
                <JumpLink
                  key={anchor.href}
                  href={anchor.href}
                  className="link-underline focus-ring inline-flex min-h-11 items-center rounded-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
                >
                  {anchor.label}
                </JumpLink>
              ))}
            </nav>
          </>
        }
        facts={[
          { label: "Guestbook notes", value: <CountIn value={totalReviews} delay={700} /> },
          { label: "Visits", value: <CountIn value={totalVisits} delay={800} duration={1800} /> },
          { label: "Years", value: <CountIn value={archiveSpanYears} delay={900} duration={1400} /> },
          { label: "Newest note", value: <span className="tabular">{archiveEndYear}</span> },
        ]}
        image={{ src: IMAGES.heroVillaSeating.src, alt: IMAGES.heroVillaSeating.alt, focal: IMAGES.heroVillaSeating.focal }}
      />

      {/* Cinematic spotlight: the strongest note lights up word by word. */}
      <section id="start-here" className="surface-reef relative isolate scroll-mt-0 overflow-hidden">
        <div aria-hidden="true" className="caustics pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <Container size="wide" className="py-24 sm:py-32 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flow flow-md lg:pt-4">
              <p data-reveal="fade" className="eyebrow">
                Start here
              </p>
              <div className="text-white">
                <SplitText as="h2" text="Three notes that say it *best.*" className="text-title max-w-[12ch]" />
              </div>
            </div>

            <figure className="relative pt-16 sm:pt-20 lg:pt-0">
              <span
                aria-hidden="true"
                data-reveal="blur"
                className="pointer-events-none absolute -left-1 -top-2 select-none font-display text-[8rem] leading-none text-canary sm:-left-3 sm:top-[-1rem] sm:text-[10rem] lg:-left-4 lg:-top-24 lg:text-[13rem]"
              >
                &ldquo;
              </span>
              <blockquote
                data-reveal="up"
                className="relative max-w-[26ch] font-display text-[clamp(1.85rem,3.8vw,3.6rem)] leading-[1.08] tracking-[-0.015em] text-white text-pretty"
              >
                {leadSpotlight.quote}
              </blockquote>
              <figcaption
                data-reveal="up"
                className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/65"
              >
                <span aria-hidden="true" className="h-px w-10 bg-canary" />
                {leadSpotlight.author} ·{" "}
                <JumpLink
                  href={leadSpotlight.anchor}
                  aria-label={`Read ${leadSpotlight.year} notes in the archive`}
                  className="link-underline-static focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-white/90 hover:text-white"
                >
                  {leadSpotlight.year}
                </JumpLink>
              </figcaption>
            </figure>
          </div>

          <div className="mt-20 grid gap-12 border-t border-white/12 pt-12 sm:mt-28 md:grid-cols-2 md:gap-16 lg:ml-[calc(32%+2rem)]">
            {supportingSpotlights.map((spotlight, index) => (
              <figure
                key={`${spotlight.year}-${spotlight.author}`}
                data-reveal="up"
                style={{ "--reveal-delay": `${index * 140}ms` } as CSSProperties}
                className="flow flow-md"
              >
                <blockquote className="font-display text-[1.5rem] leading-[1.25] text-white/88 sm:text-[1.75rem]">
                  “{spotlight.quote}”
                </blockquote>
                <figcaption className="flex flex-wrap items-center gap-x-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/60">
                  {spotlight.author} ·{" "}
                  <JumpLink
                    href={spotlight.anchor}
                    aria-label={`Read ${spotlight.year} notes in the archive`}
                    className="link-underline-static focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-white/85 hover:text-white"
                  >
                    {spotlight.year}
                  </JumpLink>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {SIGNED_FROM.length > 0 ? (
        <section aria-label="Where guests signed from" className="border-b border-border/70 py-10 sm:py-14">
          <Container size="wide">
            <p data-reveal="fade" className="eyebrow mb-6">
              Guestbooks signed from
            </p>
          </Container>
          <Marquee
            duration={48}
            items={SIGNED_FROM.map((place) => (
              <span key={place} className="font-display text-[2.4rem] leading-none text-foreground sm:text-[3.6rem]">
                {place}
              </span>
            ))}
            itemClassName="gap-8 pr-8 sm:gap-12 sm:pr-12"
            separator={<span className="h-2.5 w-2.5 rounded-full bg-canary" />}
            className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
          />
        </section>
      ) : null}

      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <ReviewsArchive groups={TESTIMONIALS} />
        </Container>
      </section>

      <section id="reviews-plan" className="scroll-mt-0 bg-sand-light py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div data-reveal="clip" className="media-frame relative aspect-[4/5] w-full max-w-md lg:max-w-none">
              <Parallax amount={6}>
                <Image
                  src={IMAGES.diningRoom.src}
                  alt={IMAGES.diningRoom.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: imageObjectPosition(IMAGES.diningRoom) }}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </Parallax>
            </div>
            <div className="flow flow-lg">
              <p data-reveal="fade" className="eyebrow">
                Plan your stay
              </p>
              <SplitText
                as="h2"
                text="Come write the *next chapter.*"
                className="text-section max-w-[14ch]"
              />
              <p data-reveal="up" className="text-lede max-w-xl">
                Share your dates, group size, and what a perfect week looks like — we&apos;ll map it into a stay your own
                guestbook note will remember.
              </p>
              <div
                data-reveal="up"
                style={{ "--reveal-delay": "140ms" } as CSSProperties}
                className="flex flex-wrap items-center gap-3"
              >
                <CtaLink
                  href="/book"
                  size="lg"
                  className="w-full justify-between sm:w-auto sm:justify-center"
                  eventName="cta_click"
                  eventPayload={{ location: "reviews_plan", target: "/book" }}
                >
                  Check dates
                </CtaLink>
                <CtaLink
                  href="/rates"
                  size="lg"
                  variant="outline"
                  arrow="none"
                  className="w-full sm:w-auto"
                  eventName="cta_click"
                  eventPayload={{ location: "reviews_plan", target: "/rates" }}
                >
                  See rates
                </CtaLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

    </main>
      <Footer />
    </>
  )
}
