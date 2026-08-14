# Canary Cove Codex Playbook

This document is the fastest way for a future Codex session to get productive in this repo without re-discovering the architecture, the release gate, the content sources, or the production dependencies.

## Repo snapshot

- Framework: Next.js 16 App Router with React 19 and Tailwind CSS v4.
- Package manager: `pnpm` is canonical.
- Hosting: Vercel project `v0-canary-cove-navbar-structure`.
- Production URL: `https://www.canarycove.com`
- Primary site type: guest-facing marketing site for a luxury Belize estate.
- Analytics: Vercel Analytics and Google Analytics 4 are both enabled.
- Search: custom client-side search backed by a handwritten index in `lib/search/search-index.ts`.
- Images: `next/image` uses a custom Cloudinary loader (`lib/cloudinary-loader.ts`) and only allows remote assets from Cloudinary. Do not switch back to `images.unoptimized`.

## Quickstart

```bash
pnpm install
pnpm dev
```

Useful follow-ups:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

If Playwright browsers are missing:

```bash
pnpm exec playwright install firefox webkit
```

## Start here in a future session

1. Read `AGENTS.md` first.
2. Read this file second.
3. Read `docs/codex-route-map.md` when you need to understand which route actually owns a page change.
4. Read `docs/codex-maintenance-checklist.md` before changing routes, anchors, forms, analytics, or media.
5. Read `docs/qa-success-criteria.md` before shipping anything public-facing.

## Route map

### Primary public routes

- `/`: homepage, custom composition root in `app/page.tsx`.
- `/stay`: custom editorial stay page with mini gallery, highlights, amenities, testimonials, and dual villa/outdoor galleries.
- `/book`: custom booking page with the Formspree booking form, policies, and testimonials. Bookingmood was removed because the subscription was cancelled.
- `/contact`: custom lead/contact page.
- `/privacy`, `/terms`: legal pages.

### Other marketing routes

- `/experiences`, `/dining`, `/adventures`, `/about`, `/getting-here`, `/rates`

These are mostly route-local page compositions rather than a single shared page template.

### Important note about page templates

- `components/basic-page.tsx` and `components/section-page.tsx` were removed. Do not restore them.
- Interior routes that need a shared chrome use `components/layout/page-shell.tsx` plus the `page-wash` utility.
- In practice, most real route work happens directly inside `app/<route>/page.tsx` plus route-specific components.

## Architecture map

### App shell and global behavior

- `app/layout.tsx`: fonts, canonical metadata, favicon declarations, sitewide structured data, GA scripts, Vercel Analytics, skip link, global scroll reset.
- `lib/site-config.ts`: canonical domain, public route inventory, business identity constants, and llms helpers.
- `lib/seo.ts`: page-level metadata source of truth used by public routes.
- `lib/structured-data.ts` and `components/structured-data.tsx`: sitewide organization/lodging schema plus per-page `WebPage` and breadcrumb JSON-LD.
- `app/sitemap.ts`, `app/robots.ts`, `app/llms/route.ts`, `app/llms-full/route.ts`: crawl and AI-discovery surfaces.
- `components/header.tsx`: sticky header, nav, CTA behavior.
- `components/footer.tsx`: footer IA and legal links.
- `components/scroll-reset.tsx`: resets scroll on route changes when there is no hash.
- `app/globals.css`: design tokens, spacing utilities, and reusable surface classes.

### Homepage

- `app/page.tsx`: section order and homepage composition.
- `components/hero.tsx`: first-screen heading, Book → `/book`, and See rates → `/rates`.
- `components/hero-image-rotator.tsx`: rotating hero imagery with a stronger contrast gradient.
- `components/model-carousel.tsx`, `components/editorial-split.tsx`, `components/property-film.tsx`, `components/testimonial-slider.tsx`, `components/process-steps.tsx`, `components/email-capture.tsx`
- `lib/homepage-content.ts`: estate spaces (`ESTATE_SPACES`, aliased as `MODEL_LINEUP`), proof points, editorial blocks, and process steps.
- Below-fold homepage modules are loaded with `next/dynamic`. Search is not rendered on the homepage; it opens from the header.

### Stay page

- `app/stay/page.tsx`: stay-page composition and section order.
- `components/stay-mini-gallery.tsx`: framed hero carousel.
- `components/stay-highlights.tsx`: the three-card highlights row plus in-page CTA scrolling.
- `components/stay-amenities.tsx`: included/amenities breakdown.
- `components/stay-guest-experience.tsx`: guest-experience cards and quotes.
- `components/stay-gallery-section.tsx`: shared gallery-section primitive used by stay galleries.
- `components/stay-villa-gallery.tsx`: interior gallery section.
- `components/stay-outdoor-gallery.tsx`: outdoor gallery section.
- `components/stay-closing-cta.tsx`: final stay CTA banner.

### Booking and forms

- `app/book/page.tsx`: booking route composition.
- `components/booking-form.tsx`: booking request form.
- `components/booking-policies.tsx`: payment/cancellation/policies content.
- `components/contact-form.tsx`: contact form.
- `components/email-capture.tsx`: homepage email capture.
- `app/api/forms/route.ts`: first-party form proxy. It validates `booking`, `contact`, or `email_capture`, appends ops metadata, forwards to Formspree, and records the Vercel `lead_submit` conversion only after Formspree accepts the lead.

### Route-specific marketing modules

- `app/experiences/page.tsx`: route-local composition built around `components/experiences-hero.tsx`, `components/experiences-gallery-mosaic.tsx`, and `components/experiences-guest-highlights.tsx`
- `app/adventures/page.tsx`: route-local adventure composition with the `ReefEncounters` film gallery
- `app/contact/page.tsx`: route-local composition using `components/contact-details.tsx`, `components/contact-form.tsx`, and `components/testimonials-grid.tsx`
- `app/dining/page.tsx`, `app/getting-here/page.tsx`, `app/rates/page.tsx`, and `app/about/page.tsx`: mostly route-local sections rather than shared page-template assembly

### Shared media and carousel layer

- `components/photo-carousel.tsx`: shared gallery/carousel pattern.
- `components/ui/carousel.tsx`: shared Embla wrapper. Changes here have wide blast radius.
- `components/gallery-grid.tsx`: image-grid gallery treatment.
- `components/reef-encounters.tsx`: responsive reef-film presentation and playback behavior.
- `lib/images.ts`: image registry and alt-text source of truth.
- `lib/videos.ts`: source of truth for reef-film copy, durations, MP4 paths, and posters.
- `lib/gallery-utils.ts`: image filtering helpers.
- `public/videos/reef-encounters/`: optimized public MP4 and poster assets.

### Navigation, search, and content sources

- `lib/nav-items.ts`: top-level navigation source of truth.
- `lib/emoji.ts`: decorative labels and icon-like copy.
- `lib/search/search-index.ts`: manual search content inventory.
- `lib/search/search.ts`: search ranking, intent detection, and instant answers.
- `lib/testimonial-spotlights.ts`: testimonial text by route/context.
- `components/analytics/tracked-link.tsx`: preferred wrapper for tracked internal CTAs and footer links.

## Critical couplings and easy misses

- Routes are custom. Shared chrome lives in `components/layout/page-shell.tsx`. Do not restore the deleted `basic-page` / `section-page` templates.
- Metadata is split on purpose. `lib/seo.ts` owns page metadata, while `lib/site-config.ts` owns the public route inventory used by sitemap, structured data helpers, and `llms` outputs.
- Search is curated manually. New pages, new sections, rate changes, policy changes, and logistics changes usually require edits in `lib/search/search-index.ts`.
- Hash links are a real integration surface. `next.config.mjs`, search results, homepage CTAs, and stay-page buttons all depend on current anchor IDs.
- Hero imagery is a behavior surface, not just content. `components/hero-image-rotator.tsx` now shuffles the homepage hero order on each load and avoids replaying the previous sequence inside the same session.
- Desktop nav uses direct pill `Link`s plus a Radix `Popover` for Explore. Reintroducing NavigationMenu wrapper styling can break the active-state pill shape.
- Site search is header-triggered (`components/header-search.tsx`) and lazy-loads the dialog. Cmd/Ctrl+K and `canary-cove:open-search` also open it.
- Vercel analytics data is sanitized before send. `components/vercel-analytics.tsx` and `lib/vercel-analytics.ts` strip hashes and query strings so URL-based event cardinality stays low.
- `next.config.mjs` still contains older hash redirects for some interior marketing pages. Treat redirect edits as audit work, not blind copy updates.

## Source-of-truth map for common edits

### If you change navigation or information architecture

Start with these files:

- `lib/nav-items.ts`
- `components/navigation/desktop-nav.tsx`
- `components/navigation/mobile-nav.tsx`
- `components/header-search.tsx`
- `components/footer.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms/route.ts`
- `app/llms-full/route.ts`
- `lib/site-config.ts`
- `e2e/helpers.ts` (`SITE_ROUTES`)

### If you add or rename a route

Start with these files:

- `app/<route>/page.tsx`
- `lib/nav-items.ts` if the route belongs in nav
- `components/footer.tsx` if the route belongs in footer IA
- `lib/site-config.ts`
- `lib/search/search-index.ts` if the route should be discoverable in site search
- `e2e/helpers.ts` if it is a public route that should be part of route-health coverage
- `app/sitemap.ts`, `app/robots.ts`, `app/llms/route.ts`, and `app/llms-full/route.ts`
- `next.config.mjs` if old URLs should redirect into the new location

### If you change section IDs or deep links

This repo has hidden coupling around anchors. Check these files together:

- page/component that owns the `id`
- CTA/button/link components that target the hash
- `lib/search/search-index.ts`
- `next.config.mjs` redirect fragments
- any `scroll-mt-*` classes or manual scroll offsets

The stay page is the clearest example: in-page buttons scroll to hash targets, and those targets are also referenced by redirects and search.

### If you change media or add galleries

Check these files together:

- `lib/images.ts`
- `lib/videos.ts`
- route-local gallery components, including `components/reef-encounters.tsx`
- local media assets under `public/videos/reef-encounters/`
- `lib/search/search-index.ts` and `lib/seo.ts` when public media copy or anchors change
- `lib/cloudinary-loader.ts` if Cloudinary URL transforms or the width cap change
- `next.config.mjs` (`images.remotePatterns` / `images.loaderFile`) if a new host or loader appears
- `e2e/design-visual.spec.ts` if the change is visually significant
- `e2e/release-gate.spec.ts` for video inventory, playback configuration, accessibility, and responsive framing

Prefer updating alt text and captions at the image/data layer rather than burying copy inside JSX when possible.

### If you change analytics

Check these files together:

- `app/layout.tsx`
- `components/google-analytics-scripts.tsx`
- `components/vercel-analytics.tsx`
- `components/analytics/tracked-link.tsx`
- `lib/google-analytics.ts`
- `lib/analytics.ts`
- `lib/vercel-analytics.ts`
- `app/privacy/page.tsx`

### If you change forms or booking flow

Check these files together:

- `components/contact-form.tsx`
- `components/email-capture.tsx`
- `components/booking-form.tsx`
- `app/book/page.tsx`
- `app/privacy/page.tsx`
- `e2e/forms.spec.ts`

## External integrations

### Forms

- Contact and email-capture forms submit to `/api/forms`, then proxy to Formspree endpoint `https://formspree.io/f/xvzarybk`.
- Booking requests submit to `/api/forms`, then proxy to Formspree endpoint `https://formspree.io/f/xqeqllek`.

All public forms are expected to expose:

- clear client-side validation
- visible success state
- visible failure state

### Booking path

- `/book` uses the request-to-book Formspree form in `components/booking-form.tsx`.
- Bookingmood was removed because the subscription was cancelled. Do not restore that embed or add a replacement calendar vendor.

### Media and analytics

- Remote imagery and the homepage film are served from Cloudinary.
- Reef-encounter films are optimized local static assets under `public/videos/reef-encounters/`.
- Publish web-ready H.264/AAC MP4s with fast-start metadata and matching poster images; do not commit camera originals.
- Preserve native controls, `playsInline`, keyboard focus, and no autoplay or looping. Preload metadata only for the featured film; supporting films use `preload="none"`.
- `next/image` uses `loader: "custom"` and `lib/cloudinary-loader.ts`. Width requests are capped at 2560. Do not set `images.unoptimized`.
- Vercel Analytics is enabled.
- Google Analytics 4 is loaded globally through `GoogleAnalyticsScripts`.
- `GoogleAnalyticsPageviews` sends manual GA4 `page_view` events because the global GA config uses `send_page_view: false`.
- `trackEvent(...)` in `lib/analytics.ts` fans out ordinary funnel events to both Vercel Analytics and GA when available.
- Successful lead forms are conversion-tracked as GA4 `generate_lead` on the client and Vercel `lead_submit` from `/api/forms` after Formspree accepts the submission.
- `components/vercel-analytics.tsx` passes `beforeSend` to Vercel Analytics so pageview/custom-event URLs do not keep query strings or hashes.
- Keep Vercel custom-event payloads flat and conservative. The site intentionally uses at most two properties per event to stay aligned with Vercel Pro limits.
- Do not send free-form search text, message bodies, names, email addresses, phone numbers, or booking details to Vercel Analytics.

Current custom-event taxonomy:

- `cta_click`: major CTA buttons (`location`, `target`)
- `nav_click`: header/footer navigation clicks (`surface`, `destination`)
- `nav_menu_open`: mobile menu opened (`surface`)
- `search_open`: search modal opened
- `search_refine`: curated chip/question refinement (`source`, `topic`)
- `search_result_click`: search result or answer link click (`group`, `destination`)
- `form_submit_attempt`: form submit started (`form`)
- `form_submit_success`: form submit succeeded (`form`)
- `form_submit_error`: form failed client or network validation (`form`, `reason`)
- `lead_intent`: non-conversion book/contact intent (`intent`, `surface`)
- `lead_submit`: Vercel conversion event after Formspree accepts a lead (`form`, `surface`)
- GA4 `generate_lead`: GA conversion/key-event candidate after a successful lead form (`form_name`, `lead_source`)
- `social_click`: outbound social click (`network`, `surface`)

## Search architecture

The site search is not generated from routes automatically.

Key facts:

- `lib/search/search-index.ts` is a manual, curated inventory of pages, sections, and FAQ-style answers.
- `components/header-search.tsx` is the site-wide trigger (header button + Cmd/Ctrl+K).
- `components/site-search.tsx` drives the modal and tracking events.
- `lib/search/search.ts` handles normalization, synonym expansion, intent detection, and grouped results.

If a new route, section, policy, pricing rule, or FAQ-worthy answer is added, update the search index in the same commit or search quality will drift.

## QA and release bar

Canonical success criteria are in `docs/qa-success-criteria.md`.

The practical release gate is:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

### Playwright suite layout

- `e2e/release-gate.spec.ts`
  - route health
  - visible `h1`
  - desktop/mobile navigation
  - homepage CTAs
  - footer links
  - booking form presence (no calendar embed)
  - reef-film anchor, three-video inventory, posters, sources, playback controls, responsive framing, and no autoplay
- `e2e/forms.spec.ts`
  - email capture success/failure
  - contact form validation/success/failure
  - booking form validation/success/failure
- `e2e/search.spec.ts`
  - search opening, intent answers, result selection, and fallback behavior
- `e2e/usability.spec.ts`
  - responsive overflow
  - touch target sizing
  - resize resilience
  - carousel interaction coverage
- `e2e/responsive.spec.ts`, `e2e/spacing.spec.ts`, `e2e/hero-contrast.spec.ts`
  - layout rhythm and readability protection
- `e2e/design-visual.spec.ts`
  - hero copy
  - model card
  - booking form
  - contact form
  - experiences mini gallery
  - stay mini gallery
- `e2e/slider-swipe.spec.ts`, `e2e/slider-snap.spec.ts`
  - slider interaction quality

### Browser policy

- Functional coverage runs in Chromium, Firefox, and WebKit.
- Visual-regression snapshots are intentionally Chromium-only to avoid cross-engine baseline churn.
- Linux and Darwin Chromium snapshot files both live in `e2e/design-visual.spec.ts-snapshots/`. Update the OS you actually ran; a Linux agent cannot refresh Darwin baselines.
- If a visual change is intentional, update the snapshot files and mention it in the commit or PR notes.

## Known non-blocking noise

- `pnpm lint` can print a stale `baseline-browser-mapping` warning from upstream tooling even when the dependency is current.
- `pnpm test` can print Vite's CJS deprecation warning. Treat it as noise unless the test process fails.
- Dev-mode browser sessions can show Vercel analytics debug logs. The Playwright helpers intentionally filter that noise.

## Deploy workflow

Typical production release:

1. Run the release gate locally.
2. Commit the validated changes.
3. Push `main`.
4. Confirm the Vercel production deployment reaches `Ready` and its Git commit SHA matches `origin/main`.
5. Confirm `canarycove.com` and `www.canarycove.com` are attached to that deployment.
6. Spot-check the production route you changed and record the release in `docs/release-log.md`.

Useful production-sensitive checks:

- `app/sitemap.ts` uses the real production domain or `NEXT_PUBLIC_SITE_URL`.
- `/privacy` and `/terms` exist and return `200`.
- form success/error states still work after any form or endpoint change.
- carousels still snap correctly on small screens and Safari/WebKit.
- hash links still land cleanly below the sticky header after layout changes.
- local video assets return the expected content type and support byte-range requests (`206`) so playback can seek and stream efficiently.

## Codex operating advice

- Prefer changing data sources (`lib/*`) before duplicating content in JSX.
- Be careful when touching `components/ui/carousel.tsx`; it affects hero-adjacent carousels, interior galleries, and slider tests.
- When route structure changes, treat `nav`, `footer`, `search`, `redirects`, `sitemap`, and `SITE_ROUTES` as a bundle to review.
- If production domain, booking provider, analytics setup, or Formspree endpoints change, update the docs in the same commit so the next session does not inherit stale context.
