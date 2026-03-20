# Canary Cove Codex Playbook

This document is the fastest way for a future Codex session to get productive in this repo without re-discovering the architecture, the release gate, or the production dependencies.

## Repo snapshot

- Framework: Next.js 16 App Router with React 19 and Tailwind CSS v4.
- Package manager: `pnpm` is canonical.
- Hosting: Vercel project `v0-canary-cove-navbar-structure`.
- Production URL: `https://v0-canary-cove-navbar-structure.vercel.app`
- Primary site type: guest-facing marketing site for a luxury estate.

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

## Architecture map

### App routes

- `app/page.tsx` is the homepage composition root.
- Interior routes use `components/basic-page.tsx` for consistent layout and shared gallery treatment.
- Legal pages live at `app/privacy/page.tsx` and `app/terms/page.tsx`.
- `app/layout.tsx` owns metadata, fonts, analytics, and the global skip link.
- `app/sitemap.ts` is production-sensitive and should always point at the current primary domain.

### Key components

- `components/hero.tsx`: hero overlay copy, logo, and homepage CTAs.
- `components/hero-image-rotator.tsx`: rotating hero imagery.
- `components/model-carousel.tsx`: homepage estate lineup cards.
- `components/photo-carousel.tsx`: shared interior image gallery.
- `components/ui/carousel.tsx`: the shared Embla wrapper. Changes here ripple through multiple galleries and sliders.
- `components/testimonial-slider.tsx`: testimonial carousel.
- `components/site-search.tsx`: homepage search launcher and result experience.
- `components/header.tsx`: sticky header, desktop/mobile nav composition, mobile CTA behavior.
- `components/contact-form.tsx`, `components/email-capture.tsx`, `components/booking-form.tsx`: guest conversion forms with explicit success and failure states.

### Content and data

- `lib/homepage-content.ts`: structured homepage content.
- `lib/images.ts`: the image registry. Prefer changing data here over hardcoding URLs in components.
- `lib/nav-items.ts`: navigation data source.
- `lib/testimonial-spotlights.ts`: testimonial copy.

## External integrations

### Forms

- Contact form endpoint: `https://formspree.io/f/xvzarybk`
- Homepage email capture endpoint: `https://formspree.io/f/xvzarybk`
- Booking request endpoint: `https://formspree.io/f/xqeqllek`

Form components are expected to expose:

- a clear client-side validation story
- a visible success state
- a visible failure state

### Booking calendar

- `/book` embeds Bookingmood:
  - `https://www.bookingmood.com/embed/939b7bb6-8e48-4256-a7af-0ec62e4a4d68`

When editing the booking page, preserve the embed presence and responsive behavior unless the booking provider is intentionally being changed.

### Media and analytics

- Images and video are served from Cloudinary.
- Vercel Analytics is enabled.
- Dev-mode tests intentionally ignore the noisy Vercel analytics debug script and cancelled Cloudinary video requests.

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
  - site search fallback
  - booking embed presence
- `e2e/forms.spec.ts`
  - email capture success/failure
  - contact form validation/success/failure
  - booking form validation/success/failure
- `e2e/usability.spec.ts`
  - responsive overflow
  - touch target sizing
  - resize resilience
  - carousel interaction coverage
- `e2e/design-visual.spec.ts`
  - hero copy
  - model card
  - booking form
  - contact form
  - experiences mini gallery
  - stay mini gallery

### Browser policy

- Functional coverage runs in Chromium, Firefox, and WebKit.
- Visual-regression snapshots are intentionally Chromium-only to avoid cross-engine baseline churn.
- If a visual change is intentional, update the snapshot files in `e2e/design-visual.spec.ts-snapshots/` and mention it in the commit or PR notes.

## Known non-blocking noise

- `pnpm lint` can print a stale `baseline-browser-mapping` warning from upstream tooling even when the dependency is current.
- `pnpm test` can print Vite's CJS deprecation warning. Treat it as noise unless the test process fails.

## Deploy workflow

Typical production release:

1. Run the release gate locally.
2. Commit the validated changes.
3. Push `main`.
4. Confirm the Vercel production deployment reaches `Ready`.
5. Spot-check the production sitemap and footer legal links.

Useful production-sensitive checks:

- `app/sitemap.ts` uses the real production domain.
- `/privacy` and `/terms` exist and return `200`.
- form success/error states still work after any form or endpoint change.
- carousels still snap correctly on small screens and Safari/WebKit.

## Codex operating advice

- Start with `AGENTS.md`, then this file.
- Prefer changing data sources (`lib/*`) before duplicating content in JSX.
- Be careful when touching `components/ui/carousel.tsx`; it affects hero-adjacent carousels, interior galleries, and slider tests.
- Prefer `pnpm` commands in docs, scripts, and automation.
- If production domain, booking provider, or Formspree endpoints change, update the docs in the same commit so the next session does not inherit stale context.
