# Canary Cove QA Success Criteria

This document defines the production-readiness bar for the public marketing site and the test suite that enforces it.

## Release gate

- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm test` passes.
- `pnpm build` passes.
- `pnpm test:e2e` passes.
- Cross-browser Playwright coverage passes on Chromium, Firefox, and WebKit.
- The Vercel production deployment is `Ready`, reports the same commit SHA as `origin/main`, and owns both production domain aliases.

## Functional criteria

- Every public route returns `2xx` and renders a visible `h1`.
- Desktop navigation, mobile navigation, footer links, and homepage CTAs all land on the correct route.
- The `/book` request-to-book Formspree form is present. There is no live availability calendar embed.
- The ElevenLabs concierge widget is present on public pages where the shared layout renders.
- Site search opens from the header (button or Cmd/Ctrl+K) on any public page and gives guests a useful fallback state when a query has no results.
- The contact form and booking form both expose a clear success state and a clear failure state.
- Booking requests validate matching email addresses and a sensible date order before submission.
- The homepage diving film is poster-first and starts only after a guest click; do not ship the raw autoplay MP4.
- Hash-linked sections land cleanly below the sticky header on routes that use in-page navigation.
- `/adventures#reef-encounters` exposes three playable reef films with matching posters and sources.
- Reef films use native controls, keyboard focus, inline playback, and never autoplay; only the featured film preloads metadata.
- Production reef-film MP4s return `video/mp4` and support byte-range responses (`206`).

## Responsive & usability criteria

- Core layouts stay free of horizontal overflow at mobile, tablet, and desktop breakpoints.
- Primary mobile actions remain at least `44x44` pixels for touch.
- Key content blocks remain visible and within the viewport after resize changes.
- Carousels support touch, wheel, keyboard, and snap cleanly to full slides.
- Reef-film cards stack cleanly on smaller screens, preserve 16:9 media framing, and introduce no horizontal overflow.

## Design criteria

- Hero overlay copy stays readable against the rotating photography (contrast gradient plus overlay).
- The header bar stays solid over every hero (no route-conditional transparency) and shrinks on scroll.
- Desktop nav uses plain text links with an underlined active section; Stay and Explore open captioned dropdown panels via hover intent, chevron click, or keyboard.
- Getting Here step numbers stay aligned to their own step and must not overlap.
- Homepage testimonial quotes stay inside their photo cards; interior testimonial grids keep author names pinned to the bottom of equal-height cards.
- Experiences hero tucks under the live `--site-header-height` without covering the page heading.
- Dining “How dining works” items keep visible bullet markers, matching stay amenities.
- Critical sections maintain their spacing rhythm.
- Galleries and carousels keep their intended framing and do not regress into clipped, low-contrast, or partial-slide states.
- Visual-regression baselines remain stable for:
  - homepage hero copy
  - homepage model card
  - booking form
  - contact form
  - experiences mini gallery
  - stay mini gallery

## Test-suite map

- `e2e/release-gate.spec.ts`: public route health, core navigation, CTAs, footer links, and reef-film anchor/playback configuration
- `e2e/forms.spec.ts`: booking and contact validation plus success/failure flows
- `e2e/search.spec.ts`: search query behavior, grouped results, instant answers, and fallback handling
- `e2e/usability.spec.ts`: overflow, target sizing, resizing, and carousel interaction coverage
- `e2e/responsive.spec.ts`, `e2e/spacing.spec.ts`, `e2e/hero-contrast.spec.ts`: layout rhythm and readability checks
- `e2e/design-layout.spec.ts`: dropdown alignment/panels, active-section underline, solid-bar/shrink behavior, Getting Here badges, testimonial clipping, Experiences hero offset, dining bullets
- `e2e/design-visual.spec.ts`: Chromium-only visual baselines
- `e2e/slider-swipe.spec.ts`, `e2e/slider-snap.spec.ts`: slider interaction quality

## Notes

- The suite is intentionally biased toward guest-facing journeys and visible regressions rather than implementation details.
- Visual baselines should be updated only when the design change is intentional and reviewed.
- Playwright helper noise filtering lives in `e2e/helpers.ts`, including filtering for Vercel Analytics debug output and cancelled Cloudinary media requests in dev.

## Operational lead-handoff criteria

These are manual operational checks, not browser-test assertions:

- Formspree is treated as the intake/review system; the Canary Cove lead dashboard is the operational source of truth.
- Genuine booking/contact leads are written idempotently using the immutable Formspree submission ID when available, with source form plus exact timestamp and normalized email as the fallback; repeat processing does not create duplicate dashboard records. Historical homepage email-capture rows stay outside this dashboard.
- Every ingest is completed by reading the dashboard record back and verifying its source and required fields.
- Consi is not directly emailed during ingestion and is not configured to receive or be forwarded Formspree notifications.
- Personal lead data stays out of analytics, logs, screenshots, commits, and public docs.
- Bookingmood remains retired and is not part of the lead workflow.
- The daily 8:00 AM America/Los_Angeles dashboard reconciliation separates homepage captures, verifies zero-change runs by readback, and sends every new, changed, or ambiguous result to review before publish.
- Vercel remains the active website host. SiteGround is not a release dependency.

The detailed procedure and completion checklist live in `docs/lead-operations.md`.
