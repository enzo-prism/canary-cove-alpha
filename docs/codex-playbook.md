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
- Images: `next.config.mjs` keeps `next/image` in `unoptimized` mode and only allows remote assets from Cloudinary.

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
- `/book`: custom booking page with Bookingmood iframe, booking form, policies, and testimonials.
- `/contact`: custom lead/contact page.
- `/privacy`, `/terms`: legal pages.

### Other marketing routes

- `/experiences`, `/dining`, `/adventures`, `/about`, `/getting-here`, `/rates`

These are mostly route-local page compositions rather than a single shared page template.

### Important note about page templates

- `components/basic-page.tsx` exists but is not the main pattern for current public routes.
- `components/section-page.tsx` exists as a reusable pattern but is not the dominant route pattern today.
- In practice, most real route work happens directly inside `app/<route>/page.tsx` plus route-specific components.

## Architecture map

### App shell and global behavior

- `app/layout.tsx`: fonts, canonical metadata, GA scripts, Vercel Analytics, skip link, global scroll reset.
- `lib/site-config.ts`: canonical domain, public route inventory, sitemap priorities, and llms helpers.
- `lib/seo.ts`: page-level metadata source of truth used by public routes.
- `app/sitemap.ts`, `app/robots.ts`, `app/llms/route.ts`, `app/llms-full/route.ts`: crawl and AI-discovery surfaces.
- `components/header.tsx`: sticky header, nav, CTA behavior.
- `components/footer.tsx`: footer IA and legal links.
- `components/scroll-reset.tsx`: resets scroll on route changes when there is no hash.
- `app/globals.css`: design tokens, spacing utilities, and reusable surface classes.

### Homepage

- `app/page.tsx`: section order and homepage composition.
- `components/hero.tsx`: first-screen message and CTAs.
- `components/hero-image-rotator.tsx`: rotating hero imagery.
- `components/model-carousel.tsx`, `components/editorial-split.tsx`, `components/bento-metrics.tsx`, `components/process-steps.tsx`, `components/specs-accordion.tsx`, `components/testimonial-slider.tsx`, `components/email-capture.tsx`, `components/site-search.tsx`
- `lib/homepage-content.ts`: homepage structured content.

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

### Route-specific marketing modules

- `app/experiences/page.tsx`: route-local composition built around `components/experiences-hero.tsx`, `components/experiences-gallery-mosaic.tsx`, and `components/experiences-guest-highlights.tsx`
- `app/adventures/page.tsx`: route-local composition using `components/ways-to-enjoy.tsx` and `components/gallery-grid.tsx`
- `app/contact/page.tsx`: route-local composition using `components/contact-details.tsx`, `components/contact-form.tsx`, and `components/testimonials-grid.tsx`
- `app/dining/page.tsx`, `app/getting-here/page.tsx`, `app/rates/page.tsx`, and `app/about/page.tsx`: mostly route-local sections rather than shared page-template assembly

### Shared media and carousel layer

- `components/photo-carousel.tsx`: shared gallery/carousel pattern.
- `components/ui/carousel.tsx`: shared Embla wrapper. Changes here have wide blast radius.
- `components/gallery-grid.tsx`: image-grid gallery treatment.
- `lib/images.ts`: image registry and alt-text source of truth.
- `lib/gallery-utils.ts`: image filtering helpers.

### Navigation, search, and content sources

- `lib/nav-items.ts`: top-level navigation source of truth.
- `lib/emoji.ts`: decorative labels and icon-like copy.
- `lib/search/search-index.ts`: manual search content inventory.
- `lib/search/search.ts`: search ranking, intent detection, and instant answers.
- `lib/testimonial-spotlights.ts`: testimonial text by route/context.
- `components/analytics/tracked-link.tsx`: preferred wrapper for tracked internal CTAs and footer links.

## Critical couplings and easy misses

- Routes are custom. `components/basic-page.tsx` and `components/section-page.tsx` still exist, but most meaningful public work happens in route-local page files plus a few shared sections.
- Metadata is split on purpose. `lib/seo.ts` owns page metadata, while `lib/site-config.ts` owns the public route inventory used by sitemap and `llms` outputs.
- Search is curated manually. New pages, new sections, rate changes, policy changes, and logistics changes usually require edits in `lib/search/search-index.ts`.
- Hash links are a real integration surface. `next.config.mjs`, search results, homepage CTAs, and stay-page buttons all depend on current anchor IDs.
- Hero imagery is a behavior surface, not just content. `components/hero-image-rotator.tsx` now shuffles the homepage hero order on each load and avoids replaying the previous sequence inside the same session.
- Desktop nav styling is intentionally plain. `components/navigation/desktop-nav.tsx` uses a direct `Link` structure for the pill treatment; reintroducing extra wrapper styling from Radix menu primitives can break the active-state shape.
- Vercel analytics data is sanitized before send. `components/vercel-analytics.tsx` and `lib/vercel-analytics.ts` strip hashes and query strings so URL-based event cardinality stays low.
- `next.config.mjs` still contains older hash redirects for some interior marketing pages. Treat redirect edits as audit work, not blind copy updates.

## Source-of-truth map for common edits

### If you change navigation or information architecture

Start with these files:

- `lib/nav-items.ts`
- `components/navigation/desktop-nav.tsx`
- `components/navigation/mobile-nav.tsx`
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
- route-local gallery components
- `next.config.mjs` (`images.remotePatterns`) if a new host appears
- `e2e/design-visual.spec.ts` if the change is visually significant

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

- Contact form endpoint: `https://formspree.io/f/xvzarybk`
- Homepage email capture endpoint: `https://formspree.io/f/xvzarybk`
- Booking request endpoint: `https://formspree.io/f/xqeqllek`

All public forms are expected to expose:

- clear client-side validation
- visible success state
- visible failure state

### Booking calendar

- `/book` embeds Bookingmood:
  - `https://www.bookingmood.com/embed/939b7bb6-8e48-4256-a7af-0ec62e4a4d68`

When editing the booking page, preserve the embed presence and responsive behavior unless the booking provider is intentionally being changed.

### Media and analytics

- Images and video are served from Cloudinary.
- `next/image` is intentionally left in `unoptimized` mode in `next.config.mjs`.
- Vercel Analytics is enabled.
- Google Analytics 4 is loaded globally through `GoogleAnalyticsScripts`.
- `trackEvent(...)` in `lib/analytics.ts` fans out to both Vercel Analytics and GA when available.
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
- `social_click`: outbound social click (`network`, `surface`)

## Search architecture

The site search is not generated from routes automatically.

Key facts:

- `lib/search/search-index.ts` is a manual, curated inventory of pages, sections, and FAQ-style answers.
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
  - booking embed presence
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
- If a visual change is intentional, update the snapshot files in `e2e/design-visual.spec.ts-snapshots/` and mention it in the commit or PR notes.

## Known non-blocking noise

- `pnpm lint` can print a stale `baseline-browser-mapping` warning from upstream tooling even when the dependency is current.
- `pnpm test` can print Vite's CJS deprecation warning. Treat it as noise unless the test process fails.
- Dev-mode browser sessions can show Vercel analytics debug logs. The Playwright helpers intentionally filter that noise.

## Deploy workflow

Typical production release:

1. Run the release gate locally.
2. Commit the validated changes.
3. Push `main`.
4. Confirm the Vercel production deployment reaches `Ready`.
5. Spot-check the production route you changed.

Useful production-sensitive checks:

- `app/sitemap.ts` uses the real production domain or `NEXT_PUBLIC_SITE_URL`.
- `/privacy` and `/terms` exist and return `200`.
- form success/error states still work after any form or endpoint change.
- carousels still snap correctly on small screens and Safari/WebKit.
- hash links still land cleanly below the sticky header after layout changes.

## Codex operating advice

- Prefer changing data sources (`lib/*`) before duplicating content in JSX.
- Be careful when touching `components/ui/carousel.tsx`; it affects hero-adjacent carousels, interior galleries, and slider tests.
- When route structure changes, treat `nav`, `footer`, `search`, `redirects`, `sitemap`, and `SITE_ROUTES` as a bundle to review.
- If production domain, booking provider, analytics setup, or Formspree endpoints change, update the docs in the same commit so the next session does not inherit stale context.
