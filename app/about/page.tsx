import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Header } from "@/components/header"
import { IMAGES } from "@/lib/images"
import { EMOJI } from "@/lib/emoji"
import { Card, CardContent } from "@/components/ui/card"
import { StayMiniGallery } from "@/components/stay-mini-gallery"
import { TestimonialsGrid } from "@/components/testimonials-grid"
import { filterHighResGalleryItems } from "@/lib/gallery-utils"

export const metadata: Metadata = {
  title: "About Canary Cove | Family Estate and On-Site Team",
  description:
    "Meet the family behind Canary Cove and the on-site team that hosts your stay, from dock arrivals to chef service.",
}

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

const aboutGalleryItems = [
  IMAGES.villaPool,
  IMAGES.livingRoom,
  IMAGES.villaBedroom,
  IMAGES.wedding,
  IMAGES.romanticViews,
  IMAGES.mainDock,
  IMAGES.helipad,
  IMAGES.logoDrink,
  IMAGES.diningRoom,
  IMAGES.villaLawn,
  IMAGES.villaSign,
  IMAGES.hammock,
  IMAGES.bikes,
  IMAGES.drinksBar,
  IMAGES.viewFromKitchen,
]
const aboutSliderItems = filterHighResGalleryItems(aboutGalleryItems)

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">About Canary Cove</h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              A private, family-owned estate with a dedicated team, quiet beaches, and dock access for effortless arrivals.
            </p>
          </div>
          <StayMiniGallery items={aboutSliderItems} />
          <Card
            id="guest-testimonials"
            className="scroll-mt-24 rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
          >
            <CardContent className="space-y-8 p-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">Don's Dream: Canary Cove</h2>
                <p className="text-base text-muted-foreground">
                  Don Listwin is one of those people who makes things happen, he shakes things up, and drives change. And he's
                  really good at it. In 2007, he visited Belize for the purpose of building a dream he'd had in his mind for years.
                  Don remembered visiting the beautiful Caribbean waters of Belize as a child with his dad. That trip was filled
                  with the fun, relaxing time with his family, beauty, and adventure.
                </p>
                <p className="text-base text-muted-foreground">
                  This was something that Don was ready to find again. So, he ventured back to Belize and found what he was looking
                  for in Ambergris Caye, and so began the development of Canary Cove. Since that time, Canary Cove has been a haven
                  for Don, his family and friends, and now he is sharing it with you.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">Canary Cove's Legacy</h2>
                <p className="text-base text-muted-foreground">
                  We hope that Canary Cove brings as much fun, relaxation, beauty, and adventure to you and yours as it has brought
                  to Don over the years. Welcome to Don's dream!
                </p>
                <p className="text-base text-muted-foreground">
                  Prior to creating Canary Cove, Don left a high-profile technology career to found the Canary Foundation. Canary
                  was named after the birds coal miners once carried as early detectors of dangerous gases. It's a fitting name for
                  the world's first non-profit dedicated solely to early cancer detection.
                </p>
                <p className="text-base text-muted-foreground">
                  Just as Don has committed his life to advancing early cancer detection, he is also committed to investing in the
                  community of his adopted second home - Ambergris Caye. Since he started living part time at Canary Cove over 10
                  years ago, Don has made a concerted effort to partner closely with businesses on the island as well as support
                  local marine preservation organizations and host international marine scientists to study the barrier reef. As the
                  Canary name suggests, Canary Cove continues to advance ways to improve community health and growth through early
                  intervention as well as protect and build the health of the marine life surrounding Ambergris Caye. We invite you
                  to learn more about Canary Cove's community involvement.
                </p>
                <p className="text-base text-muted-foreground">
                  A portion of Canary Cove's gross profits from guest visits are invested in the community through BelizeKIDS.org -
                  a local non-profit organization whose mission is to improve the lives of kids in Belize.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border border-border/70 bg-white/90 shadow-[0_16px_55px_rgba(15,23,42,0.08)]">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Guest Testimonials {EMOJI.reviews}</h2>
                <p className="text-base text-muted-foreground">
                  Notes from guest books and letters shared over the years.
                </p>
              </div>
              <TestimonialsGrid groups={TESTIMONIALS} />
            </CardContent>
          </Card>
          <GalleryGrid items={aboutGalleryItems} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
