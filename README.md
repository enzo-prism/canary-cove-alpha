# Canary Cove

Marketing site for the Canary Cove private estate. Built with the Next.js App Router and Tailwind CSS.

## Quick start

```bash
pnpm install
pnpm dev
```

`pnpm` is the canonical package manager for this repo.

## Scripts

- `pnpm dev`: Run the Next.js dev server.
- `pnpm build`: Production build.
- `pnpm start`: Serve the production build.
- `pnpm lint`: Lint the repo.
- `pnpm typecheck`: TypeScript check.
- `pnpm test`: Run Vitest.
- `pnpm test:e2e`: Run Playwright.

Playwright uses the local dev server at `http://localhost:3000` through `playwright.config.ts`.

## Release gate

Production readiness is gated by:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Playwright runs across Chromium, Firefox, and WebKit. Visual-regression snapshots are intentionally maintained on Chromium only. Linux and Darwin snapshot files both live in `e2e/design-visual.spec.ts-snapshots/`; update the OS you actually ran.

## Project map

- `app/page.tsx`: Homepage composition and section order (hero overlay, proof row, estate spaces, editorial splits, poster-first film, testimonials, process steps, email capture).
- `components/hero.tsx`: Hero overlay copy and Book / See rates CTAs.
- `components/hero-image-rotator.tsx`: Rotating hero background images (high-res only).
- `components/model-carousel.tsx`: Estate spaces slider.
- `components/editorial-split.tsx`: Two-column editorial blocks.
- `components/header-search.tsx`: Site-wide search trigger in the header.
- `components/process-steps.tsx`: Step-by-step flow.
- `components/property-film.tsx`: Poster-first homepage diving film.
- `components/testimonial-slider.tsx`: Testimonial slider.
- `components/email-capture.tsx`: Email capture block.
- `components/reef-encounters.tsx`: Responsive native-video gallery on `/adventures`.
- `components/layout/container.tsx` + `components/layout/section.tsx`: Layout primitives for gutters + vertical rhythm.
- `components/navigation/desktop-nav.tsx`: Desktop nav UI and dropdown structure.
- `components/navigation/mobile-nav.tsx`: Mobile nav UI.
- `lib/nav-items.ts`: Navigation data source.
- `lib/emoji.ts`: Emoji map used in nav items.
- `components/site-search.tsx`: Search dialog opened from the header (or Cmd/Ctrl+K), not embedded on the homepage.
- `lib/homepage-content.ts`: Homepage data for estate spaces, editorial blocks, proof points, and process steps.
- `lib/cloudinary-loader.ts`: Custom `next/image` loader that resizes Cloudinary assets and caps width at 2560.
- `lib/testimonial-spotlights.ts`: Testimonial copy.
- `lib/videos.ts`: Reef-film titles, descriptions, durations, source paths, and poster registry.
- `lib/site-config.ts`: Canonical domain, public route metadata, business identity constants, and llms content.
- `lib/seo.ts`: Page-level metadata source of truth for public routes.
- `lib/structured-data.ts` and `components/structured-data.tsx`: Sitewide organization/lodging schema and per-page breadcrumb/page JSON-LD.
- `components/layout/page-shell.tsx`: Shared header/footer/structured-data shell for interior routes.
- `components/contact-form.tsx`: Contact form + custom success/error state (Formspree backend).
- `components/email-capture.tsx`: Homepage email capture with in-app submit states.
- `components/booking-form.tsx`: Booking request form with client-side validation.
- `app/api/forms/route.ts`: First-party form proxy that forwards accepted lead forms to Formspree and records server-side Vercel lead conversions.
- `components/ui/carousel.tsx`: Shared Embla wrapper used across galleries and sliders.
- `lib/search/search-index.ts`: Handwritten search inventory and instant-answer content.
- `lib/analytics.ts` + `lib/google-analytics.ts`: Shared analytics/event layer.
- `components/analytics/tracked-link.tsx`: Preferred tracked-link wrapper for CTA and footer navigation events.
- `app/privacy/page.tsx` and `app/terms/page.tsx`: Footer legal destinations.

## Media notes

- Cloudinary remains the source for remote imagery and the homepage film. `next/image` uses the custom loader in `lib/cloudinary-loader.ts`; do not switch back to `images.unoptimized`. Add new image hosts to `next.config.mjs`.
- The homepage film is poster-first and user-started. Do not restore the raw autoplay MP4.
- Hero and testimonial images should be high resolution; update the arrays, not the JSX.
- Optimized Adventures films and posters live in `public/videos/reef-encounters/`; their public metadata lives in `lib/videos.ts`.
- Reef films use native controls and `playsInline` without autoplay or looping; only the featured film preloads metadata, while supporting films wait for interaction.

## Integration notes

- Forms post to `/api/forms`, which validates the form key and forwards to the correct Formspree endpoint.
- Formspree is the intake transport, while the Canary Cove lead dashboard is the operational source of truth for genuine booking/contact leads. The `canarycove-dash` repo checks Formspree daily at 8:00 AM America/Los_Angeles. Use the Formspree submission ID for deduplication when available, keep homepage email-capture rows separate, and verify dashboard state by readback. Changed or ambiguous results require review before any dashboard publish.
- Do not email Consi as part of routine lead ingestion and do not route Formspree notifications to her. See `docs/lead-operations.md` for the canonical handoff and privacy rules.
- `/book` uses the request-to-book Formspree form. Bookingmood was removed because the subscription was cancelled.
- Analytics are dual-wired: Vercel Analytics and Google Analytics 4.
- Vercel custom events use the official `track()` API through `lib/analytics.ts`, and `components/vercel-analytics.tsx` strips query strings and hashes before events are sent.
- GA4 pageviews are manually emitted because automatic pageviews are disabled in the global tag config.
- Custom-event payloads are intentionally small and should never include free-form search text or submitted form content.
- Current Vercel/GA custom-event taxonomy includes `cta_click`, `nav_click`, `nav_menu_open`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`, `lead_intent`, `lead_submit`, GA4 `generate_lead`, `search_open`, `search_refine`, `search_result_click`, `review_archive_filter`, `review_note_open`, `section_jump`, `social_click`, and `outbound_click`.
- Search is manual and curated, not generated automatically from routes.

## Styling notes

- Global styles live in `app/globals.css`. `styles/globals.css` is legacy and not imported by the App Router.
- Fonts are loaded via `next/font/local` from `font/`.

## Testing notes

- `e2e/release-gate.spec.ts` covers public route health, CTA routing, footer links, and responsive reef-film behavior.
- `e2e/forms.spec.ts` covers form validation plus success/error states.
- `e2e/search.spec.ts` covers search answers, grouped results, and fallback behavior.
- `e2e/usability.spec.ts` covers overflow, tap targets, resize behavior, and carousel resilience.
- `e2e/design-visual.spec.ts` guards hero, forms, and mini-gallery visual baselines.
- `e2e/responsive.spec.ts`, `e2e/slider-swipe.spec.ts`, `e2e/slider-snap.spec.ts`, `e2e/hero-contrast.spec.ts`, and `e2e/spacing.spec.ts` protect interaction quality and layout rhythm.

## Deployment notes

- Production is hosted on Vercel project `v0-canary-cove-navbar-structure`.
- Production URL: `https://www.canarycove.com`
- Pushing `main` is the normal path to a production deployment.
- Vercel is the active website host. SiteGround is no longer a website dependency; cancellation is approved, but Kristin's confirmation that it is complete may still be pending. Do not treat SiteGround as part of the deploy path.
- If the primary domain or business identity changes, update `lib/site-config.ts`, `lib/seo.ts`, and the metadata/structured-data surfaces in the same release.

## Docs for future sessions

- `AGENTS.md`: repo-specific operating guidance for Codex
- `docs/codex-playbook.md`: architecture, integrations, QA expectations, and deploy workflow
- `docs/codex-route-map.md`: page-by-page ownership map with anchors, data sources, and likely regression surfaces
- `docs/codex-maintenance-checklist.md`: “if you change X, also review Y” checklist for routes, anchors, search, analytics, forms, and media
- `docs/lead-operations.md`: canonical Formspree review, deduplication, Canary Cove lead-dashboard ingest, notification, privacy, and readback procedure
- `docs/qa-success-criteria.md`: explicit production readiness bar
- `docs/release-log.md`: production release history with commit and verification evidence
