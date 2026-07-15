# Canary Cove QA Success Criteria

This document defines the production-readiness bar for the public marketing site and the test suite that enforces it.

## Release gate

- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm test` passes.
- `pnpm build` passes.
- `pnpm test:e2e` passes.
- Cross-browser Playwright coverage passes on Chromium, Firefox, and WebKit.

## Functional criteria

- Every public route returns `2xx` and renders a visible `h1`.
- Desktop navigation, mobile navigation, footer links, and homepage CTAs all land on the correct route.
- The Bookingmood availability embed is present on `/book`.
- The ElevenLabs concierge widget is present on public pages where the shared layout renders.
- Site search opens from the homepage and gives guests a useful fallback state when a query has no results.
- The homepage email capture, contact form, and booking form all expose a clear success state and a clear failure state.
- Booking requests validate matching email addresses and a sensible date order before submission.
- Hash-linked sections land cleanly below the sticky header on routes that use in-page navigation.
- `/adventures#reef-encounters` exposes three playable reef films with matching posters and sources.
- Reef films use native controls, keyboard focus, inline playback, and never autoplay; only the featured film preloads metadata.

## Responsive & usability criteria

- Core layouts stay free of horizontal overflow at mobile, tablet, and desktop breakpoints.
- Primary mobile actions remain at least `44x44` pixels for touch.
- Key content blocks remain visible and within the viewport after resize changes.
- Carousels support touch, wheel, keyboard, and snap cleanly to full slides.
- Reef-film cards stack cleanly on smaller screens, preserve 16:9 media framing, and introduce no horizontal overflow.

## Design criteria

- Hero contrast stays readable against the page background.
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

- `e2e/release-gate.spec.ts`: public route health, core navigation, CTAs, footer links, booking embed presence, and reef-film anchor/playback configuration
- `e2e/forms.spec.ts`: booking, contact, and email-capture validation plus success/failure flows
- `e2e/search.spec.ts`: search query behavior, grouped results, instant answers, and fallback handling
- `e2e/usability.spec.ts`: overflow, target sizing, resizing, and carousel interaction coverage
- `e2e/responsive.spec.ts`, `e2e/spacing.spec.ts`, `e2e/hero-contrast.spec.ts`: layout rhythm and readability checks
- `e2e/design-visual.spec.ts`: Chromium-only visual baselines
- `e2e/slider-swipe.spec.ts`, `e2e/slider-snap.spec.ts`: slider interaction quality

## Notes

- The suite is intentionally biased toward guest-facing journeys and visible regressions rather than implementation details.
- Visual baselines should be updated only when the design change is intentional and reviewed.
- Playwright helper noise filtering lives in `e2e/helpers.ts`, including filtering for Vercel Analytics debug output and cancelled Cloudinary media requests in dev.
