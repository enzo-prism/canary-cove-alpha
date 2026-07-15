# Canary Cove Codex Route Map

Use this file when you need to answer "where is this page actually built?" without re-tracing imports from scratch.

## Cross-route rules

- Most public pages are route-local compositions in `app/<route>/page.tsx`, not a shared template.
- `lib/seo.ts` owns page metadata. `lib/site-config.ts` owns the public-route inventory used by sitemap and `llms` outputs.
- Search is manual. If public content changes, `lib/search/search-index.ts` usually needs an update in the same commit.
- CTA tracking is split: use `components/analytics/tracked-link.tsx` when a link can be wrapped; nav, forms, search, and menu state use direct helpers in `lib/analytics.ts`.
- `next.config.mjs` keeps `images.unoptimized: true` and only allows remote images from `res.cloudinary.com`.
- Hash destinations are not purely local. Search results, homepage CTAs, old marketing links, and redirects depend on them.

## Route owners

### `/`

- Page: `app/page.tsx`
- Primary components: `Hero`, `HeroImageRotator`, `ModelCarousel`, `EditorialSplit`, `BentoMetrics`, `ProcessSteps`, `SpecsAccordion`, `TestimonialSlider`, `EmailCapture`, `SiteSearch`
- Data/config: `lib/homepage-content.ts`, `lib/images.ts`, `lib/seo.ts` (`PAGE_METADATA.home`)
- Important anchors: `#property-film`
- High-risk couplings: hero backgrounds live in `components/hero-image-rotator.tsx`; hero copy/CTAs live in `components/hero.tsx`; the hero order is randomized on load with a sessionStorage guard
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-visual.spec.ts`, `e2e/hero-contrast.spec.ts`, `e2e/search.spec.ts`

### `/stay`

- Page: `app/stay/page.tsx`
- Primary components: `StayMiniGallery`, `StayHighlights`, `StayAmenities`, `StayGuestExperience`, `StayVillaGallery`, `StayOutdoorGallery`, `StayClosingCta`
- Data/config: `lib/images.ts`, `lib/testimonial-spotlights.ts`, `lib/seo.ts` (`PAGE_METADATA.stay`)
- Important anchors: `#villa`, `#outside`, `#services`, `#amenities`, `#inside-the-villa`, `#outside-the-villa`
- High-risk couplings: the summary cards in `components/stay-highlights.tsx` own the public hashes `#villa`, `#outside`, and `#services`, but the smooth-scroll buttons on those cards jump to the deeper gallery sections `#inside-the-villa` and `#outside-the-villa`
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-visual.spec.ts`, `e2e/usability.spec.ts`

### `/rates`

- Page: `app/rates/page.tsx`
- Primary components: route-local pricing cards, tables, and FAQ-like sections inside the page file
- Data/config: route-local season/add-on arrays in `app/rates/page.tsx`, `lib/seo.ts` (`PAGE_METADATA.rates`), `lib/search/search-index.ts`
- Important anchors: `#included-costs`, `#villa-accommodations`, `#main-house-accommodations`, `#boat-services`, `#fishing-packages`, `#water-sports-adventures`, `#golf-cart-rentals`
- High-risk couplings: search answers and pricing deep links hit these anchors directly
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/search.spec.ts`

### `/book`

- Page: `app/book/page.tsx`
- Primary components: `PhotoCarousel`, `BookingForm`, `BookingPolicies`, `TestimonialsGrid`
- Data/config: `lib/testimonial-spotlights.ts`, `lib/analytics.ts`, `lib/seo.ts` (`PAGE_METADATA.book`)
- Important anchors: `#availability-calendar`, `#comfort-confidence`, `#payment-terms`, `#cancellation-policy`
- High-risk couplings: the Bookingmood iframe is part of the release gate; `BookingForm` posts to Formspree and is privacy-policy sensitive
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/forms.spec.ts`, `e2e/design-visual.spec.ts`

### `/contact`

- Page: `app/contact/page.tsx`
- Primary components: `ContactDetails`, `ContactForm`, `TestimonialsGrid`
- Data/config: `lib/testimonial-spotlights.ts`, `lib/analytics.ts`, `lib/seo.ts` (`PAGE_METADATA.contact`)
- Important anchors: none beyond the standard main content container
- High-risk couplings: `ContactForm` shares the same Formspree backend as the homepage email capture
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/forms.spec.ts`, `e2e/design-visual.spec.ts`

### `/experiences`

- Page: `app/experiences/page.tsx`
- Primary components: `ExperiencesHero`, `ExperiencesGalleryMosaic`, `ExperiencesGuestHighlights`
- Data/config: `lib/images.ts`, route-local highlight/card arrays in `app/experiences/page.tsx`, `lib/seo.ts` (`PAGE_METADATA.experiences`)
- Important anchors: none currently exposed in the page markup beyond `#main-content`
- High-risk couplings: the header treats `/experiences` like the homepage for the immersive top state; `next.config.mjs` still contains older `/experiences#...` redirect destinations, so audit redirects before adding new hash links
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-visual.spec.ts`

### `/dining`

- Page: `app/dining/page.tsx`
- Primary components: `GalleryGrid`, route-local editorial cards, `TestimonialsGrid`
- Data/config: `lib/images.ts`, `lib/testimonial-spotlights.ts`, `lib/seo.ts` (`PAGE_METADATA.dining`)
- Important anchors: `#how-dining-works`
- High-risk couplings: dining answers are heavily represented in `lib/search/search-index.ts`
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/search.spec.ts`

### `/adventures`

- Page: `app/adventures/page.tsx`
- Primary components: `ReefEncounters` plus route-local adventure cards and guest-story tiles
- Data/config: `lib/images.ts`, `lib/videos.ts`, `lib/testimonial-spotlights.ts`, `lib/seo.ts` (`PAGE_METADATA.adventures`), `lib/search/search-index.ts`
- Important anchors: `#reef-encounters`
- High-risk couplings: the public reef-film anchor is indexed by site search; film metadata and asset paths must stay aligned between `lib/videos.ts` and `public/videos/reef-encounters/`
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/search.spec.ts`, `e2e/usability.spec.ts`

### `/getting-here`

- Page: `app/getting-here/page.tsx`
- Primary components: `GalleryGrid`, route-local transport sections, `TestimonialsGrid`
- Data/config: `lib/images.ts`, `lib/testimonial-spotlights.ts`, `lib/seo.ts` (`PAGE_METADATA.gettingHere`)
- Important anchors: `#arrival-steps`, `#getting-around`
- High-risk couplings: travel questions are answered through the search index and `llms` outputs, so copy changes should be reflected there too
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/search.spec.ts`

### `/about`

- Page: `app/about/page.tsx`
- Primary components: route-local editorial sections, `StayMiniGallery`, `GalleryGrid`, `TestimonialsGrid`
- Data/config: `lib/images.ts`, `lib/gallery-utils.ts`, `lib/emoji.ts`, `lib/seo.ts` (`PAGE_METADATA.about`)
- Important anchors: `#guest-testimonials`
- High-risk couplings: the page is large and testimonial-heavy, and its image set is filtered through `filterHighResGalleryItems`
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-visual.spec.ts`

### `/privacy` and `/terms`

- Pages: `app/privacy/page.tsx`, `app/terms/page.tsx`
- Primary components: route-local prose with `Header`, `Footer`, `Container`, and `Section`
- Data/config: `lib/seo.ts`, `lib/site-config.ts`
- Important anchors: none beyond the standard main content container
- High-risk couplings: these pages are the public record for Formspree, Bookingmood, Cloudinary, GA, and Vercel Analytics usage
- Tests most likely to fail: `e2e/release-gate.spec.ts`

## Hidden-coupling checklist

- If route copy changes materially, review both `lib/seo.ts` and `lib/site-config.ts`.
- If any public hash changes, search `next.config.mjs`, `lib/search/search-index.ts`, `lib/search/search.ts`, and homepage CTA content for the old value.
- If a CTA or footer link changes, check whether it should be a `TrackedLink` instead of a plain `Link`.
- If imagery changes, update `lib/images.ts` first and treat `e2e/design-visual.spec.ts` as part of the change.
- If a route starts or stops using immersive top-of-page styling, review `components/header.tsx`.
