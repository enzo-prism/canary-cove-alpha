# Canary Cove Codex Route Map

Use this file when you need to answer "where is this page actually built?" without re-tracing imports from scratch.

## Cross-route rules

- Most public pages are route-local compositions in `app/<route>/page.tsx`, not a shared template.
- `lib/seo.ts` owns page metadata. `lib/site-config.ts` owns the public-route inventory used by sitemap and `llms` outputs.
- Search is manual. If public content changes, `lib/search/search-index.ts` usually needs an update in the same commit.
- CTA tracking is split: use `components/analytics/tracked-link.tsx` when a link can be wrapped; nav, forms, search, and menu state use direct helpers in `lib/analytics.ts`.
- `next.config.mjs` uses a custom Cloudinary loader (`lib/cloudinary-loader.ts`) and only allows remote images from `res.cloudinary.com`. Do not set `images.unoptimized`.
- Hash destinations are not purely local. Search results, homepage CTAs, old marketing links, and redirects depend on them.

## Route owners

### `/`

- Page: `app/page.tsx`
- Primary components: `Hero`, `HeroImageRotator`, `ModelCarousel`, `EditorialSplit`, `PropertyFilm`, `TestimonialSlider`, `ProcessSteps`
- Data/config: `lib/homepage-content.ts`, `lib/images.ts`, `lib/seo.ts` (`PAGE_METADATA.home`)
- Important anchors: `#property-film`
- High-risk couplings: hero backgrounds live in `components/hero-image-rotator.tsx`; hero copy/CTAs live in `components/hero.tsx` (Book → `/book`, See rates → `/rates`); the hero order is randomized on load with a sessionStorage guard; the film is poster-first in `components/property-film.tsx`; search is header-triggered, not homepage-embedded
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-visual.spec.ts`, `e2e/hero-contrast.spec.ts`, `e2e/search.spec.ts`

### `/stay`

- Page: `app/stay/page.tsx`
- Primary components: `StayMiniGallery`, `StayAmenities`, `StayGuestExperience`, `StayVillaGallery`, `StayOutdoorGallery`, `StayClosingCta` (`StayHighlights` was deleted in the 2026 redesign)
- Data/config: `lib/images.ts`, `lib/testimonial-spotlights.ts`, `lib/seo.ts` (`PAGE_METADATA.stay`)
- Important anchors: `#villa`, `#outside`, `#services`, `#amenities`, `#inside-the-villa`, `#outside-the-villa`, `#guest-experience`, `#main-house-stay`
- High-risk couplings: legacy hashes `#villa`, `#outside`, `#services` are re-homed onto wrapper divs around the gallery/amenity sections; the Main House band link must keep the accessible name matching `/Main House.*5 suites/`; `stay-mini-gallery` testid pins the hero carousel for slider and visual tests
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-visual.spec.ts`, `e2e/slider-snap.spec.ts`, `e2e/slider-swipe.spec.ts`, `e2e/photo-lightbox.spec.ts`

### `/rates`

- Page: `app/rates/page.tsx`
- Primary components: route-local ledger hero, season rate table, Main House rail, plus `RatesServicesBrowser`
- Data/config: route-local season/service arrays in `app/rates/page.tsx`, `lib/seo.ts` (`PAGE_METADATA.rates`), `lib/search/search-index.ts`
- Important anchors: `#included-costs`, `#villa-accommodations`, `#main-house-accommodations`, `#additional-services`, `#boat-services`, `#fishing-packages`, `#water-sports-adventures`, `#golf-cart-rentals`
- High-risk couplings: search answers and pricing deep links hit these anchors directly; the Main House terms copy and `rates_main_house` / `rates_planning` analytics payloads are asserted by tests; service-group anchors live on plain wrapper divs (Chromium ignores scroll-margin for fragment targets inside `overflow:hidden` containers, so the ledger card uses `overflow-clip`)
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/search.spec.ts`

### `/book`

- Page: `app/book/page.tsx`
- Primary components: `PhotoCarousel`, `BookingForm`, `BookingPolicies`, `TestimonialsGrid`
- Data/config: `lib/testimonial-spotlights.ts`, `lib/analytics.ts`, `lib/seo.ts` (`PAGE_METADATA.book`)
- Important anchors: `#comfort-confidence`, `#payment-terms`, `#cancellation-policy`, `#booking-form`
- High-risk couplings: `BookingForm` posts to Formspree and is privacy-policy sensitive. Post-submission handling follows `docs/lead-operations.md`: genuine leads go to the Canary Cove lead dashboard with submission-ID deduplication and readback verification, without notifying Consi. Bookingmood was removed because the subscription was cancelled.
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/forms.spec.ts`, `e2e/design-visual.spec.ts`

### `/contact`

- Page: `app/contact/page.tsx`
- Primary components: `ContactDetails`, `ContactForm`, `TestimonialsGrid`
- Data/config: `lib/testimonial-spotlights.ts`, `lib/analytics.ts`, `lib/seo.ts` (`PAGE_METADATA.contact`)
- Important anchors: none beyond the standard main content container
- High-risk couplings: `ContactForm` posts to the shared Formspree endpoint formerly also used by the removed homepage email capture, but only genuine contact leads enter the dashboard-centered workflow in `docs/lead-operations.md`. Historical email-capture rows are tracked separately; Formspree/email notifications are not the operational source of truth.
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/forms.spec.ts`, `e2e/design-visual.spec.ts`

### `/experiences`

- Page: `app/experiences/page.tsx`
- Primary components: `ExperiencesHero`, `ExperiencesGalleryMosaic`, `ExperiencesGuestHighlights`
- Data/config: `lib/images.ts`, route-local highlight/card arrays in `app/experiences/page.tsx`, `lib/seo.ts` (`PAGE_METADATA.experiences`)
- Important anchors: `#on-the-water`, `#diving-fishing` (both indexed by site search)
- High-risk couplings: `next.config.mjs` still contains older `/experiences#...` redirect destinations, so audit redirects before adding new hash links
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-visual.spec.ts`

### `/dining`

- Page: `app/dining/page.tsx`
- Primary components: route-local ledger hero/table matrix, `DiningServiceLedger`, grouped `GalleryGrid`s, route-local testimonial stack
- Data/config: `lib/images.ts` (all 21 gallery photos are real registry keys — `IMAGES` is an untyped record, so verify new keys against the file), `lib/seo.ts` (`PAGE_METADATA.dining`)
- Important anchors: `#how-dining-works`, `#the-table`, `#dining-gallery`, `#dining-notes`, `#dining-plan`
- High-risk couplings: dining answers are heavily represented in `lib/search/search-index.ts`; the `dining-basic` testid must appear exactly 4 times with `•` markers; `lib/emoji.ts` was deleted with the redesign (no other consumers)
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/design-layout.spec.ts`, `e2e/search.spec.ts`

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

### `/reviews`

- Page: `app/reviews/page.tsx` (moved from `/about` in the 2026 nav redesign; `/about` 308-redirects here)
- Primary components: route-local ledger hero/spotlights/closing, `ReviewsArchive`, `GuestReviewsBrowser`
- Data/config: route-local `TESTIMONIALS` guestbook data in `app/reviews/page.tsx` (verbatim — never paraphrase quotes), `lib/images.ts`, `lib/seo.ts` (`PAGE_METADATA.reviews`)
- Important anchors: `#start-here`, `#guest-testimonials`, `#reviews-plan`, plus per-year `#year-<YYYY>` anchors on archive buckets
- High-risk couplings: review quotes must stay byte-identical; theme filters use OR-word matching while the typed search uses AND matching; `release-gate` asserts the `/about` redirect and a visible h1
- Tests most likely to fail: `e2e/release-gate.spec.ts`, `e2e/search.spec.ts`

### `/privacy` and `/terms`

- Pages: `app/privacy/page.tsx`, `app/terms/page.tsx`
- Primary components: route-local prose with `Header`, `Footer`, `Container`, and `Section`
- Data/config: `lib/seo.ts`, `lib/site-config.ts`
- Important anchors: none beyond the standard main content container
- High-risk couplings: these pages are the public record for Formspree, Cloudinary, GA, and Vercel Analytics usage
- Tests most likely to fail: `e2e/release-gate.spec.ts`

## Hidden-coupling checklist

- If route copy changes materially, review both `lib/seo.ts` and `lib/site-config.ts`.
- If any public hash changes, search `next.config.mjs`, `lib/search/search-index.ts`, `lib/search/search.ts`, and homepage CTA content for the old value.
- If a CTA or footer link changes, check whether it should be a `TrackedLink` instead of a plain `Link`.
- If imagery changes, update `lib/images.ts` first and treat `e2e/design-visual.spec.ts` as part of the change.
- If header height, padding, or breakpoints change, verify `--site-header-height` consumers (`app/book`, `app/contact`, `experiences-hero`, `gallery-browser`) and the overlay z-index scale in `app/globals.css`.
- If guest-quote copy changes, keep it byte-identical to `lib/testimonial-spotlights.ts` or the route-local guestbook source; never paraphrase, condense, or invent quotes with guest attribution (site-wide verbatim fix shipped 2026-09-17).
