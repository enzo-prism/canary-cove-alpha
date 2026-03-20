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
- Site search opens from the homepage and gives guests a useful fallback state when a query has no results.
- The homepage email capture, contact form, and booking form all expose a clear success state and a clear failure state.
- Booking requests validate matching email addresses and a sensible date order before submission.

## Responsive & usability criteria

- Core layouts stay free of horizontal overflow at mobile, tablet, and desktop breakpoints.
- Primary mobile actions remain at least `44x44` pixels for touch.
- Key content blocks remain visible and within the viewport after resize changes.
- Carousels support touch, wheel, keyboard, and snap cleanly to full slides.

## Design criteria

- Hero contrast stays readable against the page background.
- Critical sections maintain their spacing rhythm.
- Visual-regression baselines remain stable for:
  - homepage hero copy
  - homepage model card
  - booking form
  - contact form
  - experiences mini gallery
  - stay mini gallery

## Notes

- The suite is intentionally biased toward guest-facing journeys and visible regressions rather than implementation details.
- Visual baselines should be updated only when the design change is intentional and reviewed.
