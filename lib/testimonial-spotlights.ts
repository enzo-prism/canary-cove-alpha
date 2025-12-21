export type Testimonial = {
  quote: string
  author?: string
  year: string
}

export const TESTIMONIAL_SPOTLIGHTS = {
  home: [
    {
      year: "2017",
      quote:
        "Such a magical spot, on so many levels - the site, the sights, the house, the team, the town, the vibe, the food, the water, the fishing - we could go on & on - your team here is really excellent, and stands as a testament to you and your vision.",
      author: "R. And family",
    },
    {
      year: "7/2015",
      quote: "One of the most amazing houses I've ever stayed at. Impeccable service. Just wow! Can't wait to come back.",
      author: "E.",
    },
  ],
  stay: [
    {
      year: "2017",
      quote:
        "Your gracious hospitality has made our stay more wonderful than I could have imagined. You have a beautiful home here in paradise!",
      author: "G. and family",
    },
    {
      year: "7/2015",
      quote:
        "Canary Cove - it has been an absolute pleasure staying in the amazing home! Not only does the house have EVERYTHING imaginable, but the staff has been the BEST! I will miss you Canary Cove & Oscar, Gil, Jaime & Nathalie & the rest of the crew. Thank you, thank you!",
      author: "R.",
    },
  ],
  dining: [
    {
      year: "2017",
      quote: "Thanks so much for taking such amazing care of us at all points. And the food was AMAZING!!",
      author: "Art",
    },
    {
      year: "2017",
      quote: "Thank you SO much for making us have an amazing trip! I will always remember the Lava Cake!",
      author: "Ben",
    },
    {
      year: "7/2015",
      quote: "The house is beautiful, the staff is amazing, the food was wonderful. Can't wait to come back!!",
      author: "T.",
    },
  ],
  experiences: [
    {
      year: "2017",
      quote:
        "In 6 days we packed enough adventure into fabulous vacation to last a long time. The staff were FANTASTIC, catering to our every need, ensuring safety first of all but incredible fun was had by all. Snorkeling, SCUBA, bone fishing and non-stop eating made this a trip to remember. Fireworks in town went on & on, and we made it safely by boat thanks to Mike. Thank you for everything.",
      author: "G. & family",
    },
    {
      year: "2017",
      quote:
        "We had some quality time on the horizontal here: swimming, snorkeling, sleeping, reading. It has been a week of golden moments, beautiful sunsets, full moon rise, swimming with nurse sharks, watching rays nestle into the sand, and sliding down the slide into the perfect water. Thank you for providing a little bit of heaven.",
      author: "C., R., & crew",
    },
  ],
  adventures: [
    {
      year: "3/2015",
      quote:
        "A piece of heaven here on earth... First trip to Belize & cannot say enough about our experience! The joy girls felt the entire trip... swimming with sharks, rays, starfish, conch. The gorgeous setting, pools & most importantly the PEOPLE. The kids got to be kids & parents did too... so many new experiences; incredible weather, beautiful accommodations. Thank you for having this dream & opening it up to us. We hope to return soon. Truly, the staff made the trip the most fun, leisurely, recharging ever - Gill, Mike, Jaime, Sergio, Nathalie, Diana, Omar, Mr. B(?), the sweet housekeeping. The snorkel platform - our favorite!",
      author: "T. & family, Colorado",
    },
    {
      year: "8/2012",
      quote:
        "Wow, what a truly amazing place! The scenery is breathtaking, the facilities fantastic, and the staff's hospitality was the best. We enjoyed all the activities from snorkeling, diving, kayaking, paddle boarding, swimming & lounging around the pool, the platform as Mexico Rocks, seeing the school in San Pedro, playing \"Jungle Ball\", extreme puzzling, and peaceful sleeps. A special thank you to Gil for teaching Jason how to scuba dive - it was a huge thrill for him! And to Mike for guiding us through Hol Chan. Thank you again for sharing your home with us.",
      author: "C., D., B. & J.",
    },
  ],
  gettingHere: [
    {
      year: "1/2016",
      quote:
        "From our greeting with rum punches on the dock, amazing meals, lionfish ceviche, floating deck, terrific dives, spotless house, beautiful gardens, smiling faces, Canary Cove impressed us to the last day watching the sunrise before departure - total perfection.",
      author: "P. Family, Pennsylvania",
    },
    {
      year: "7/2015",
      quote: "Thanks for the ride, Belize! Canary Cove made this place feel like a dream! Thank you all!",
      author: "S.",
    },
  ],
  rates: [
    {
      year: "3/2016",
      quote:
        "This has provided one of the most unique & complete vacation experiences I have ever had the privilege to be on - it has allowed a group of wonderful, kind people to be together for a period of time and in such a way that would NEVER have been possible without the kindness of everyone at Canary Cove. Thank you so much for all you have done, from dealing with our erratic drink orders and inability to eat meals on time to helping us with lighting for our music video - and never laughing at our costumes & antics. This has been a dream come true.",
      author: "C.",
    },
    {
      year: "10/2014",
      quote:
        "This was a wonderful trip, which was made memorable by the amazing staff & beautiful house & grounds. A truly unforgettable vacation & stay. Would come back to Belize again!",
      author: "K., Michigan",
    },
  ],
  contact: [
    {
      year: "7/2015",
      quote: "You have handpicked the best staff on the island. Thanks for everything!",
      author: "J.",
    },
    {
      year: "7/2015",
      quote:
        "Thank you so much for your hospitality! This house & staff are nothing short of amazing! I hope to see you all again!",
      author: "T.",
    },
  ],
  book: [
    {
      year: "2024",
      quote:
        "What a perfect vacation! The house is wonderful, staff beyond our wildest dreams, dining like no other! Thank you for one of the most memorable vacations of our lives. We will be back for sure.",
      author: "Bernthal/Stambaugh family",
    },
  ],
} satisfies Record<string, Testimonial[]>
