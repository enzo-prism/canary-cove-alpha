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

## Release gate

Production readiness is gated by:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Playwright runs across Chromium, Firefox, and WebKit. Visual-regression snapshots are intentionally maintained on Chromium only.

## Project map

- `app/page.tsx`: Homepage composition and section order (hero, estate lineup, editorial splits, film, bento, steps, testimonials, specs, email capture, search).
- `components/hero.tsx`: Hero copy, CTAs, and logo overlay.
- `components/hero-image-rotator.tsx`: Rotating hero background images (high-res only).
- `components/model-carousel.tsx`: Estate lineup slider.
- `components/editorial-split.tsx`: Two-column editorial blocks.
- `components/bento-metrics.tsx`: Bento grid with metrics + accordion details.
- `components/process-steps.tsx`: Step-by-step flow.
- `components/specs-accordion.tsx`: Tech/spec sections.
- `components/testimonial-slider.tsx`: Testimonial slider.
- `components/email-capture.tsx`: Email capture block.
- `components/layout/container.tsx` + `components/layout/section.tsx`: Layout primitives for gutters + vertical rhythm.
- `components/navigation/desktop-nav.tsx`: Desktop nav UI and dropdown structure.
- `components/navigation/mobile-nav.tsx`: Mobile nav UI.
- `lib/nav-items.ts`: Navigation data source.
- `lib/emoji.ts`: Emoji map used in nav items.
- `components/site-search.tsx`: Search module on the homepage.
- `lib/homepage-content.ts`: Homepage data for models, editorial blocks, steps, specs, testimonials.
- `lib/testimonial-spotlights.ts`: Testimonial copy.
- `components/basic-page.tsx`: Shared layout for leaf pages.
- `components/contact-form.tsx`: Contact form + custom success/error state (Formspree backend).
- `components/email-capture.tsx`: Homepage email capture with in-app submit states.
- `components/booking-form.tsx`: Booking request form with client-side validation.
- `components/ui/carousel.tsx`: Shared Embla wrapper used across galleries and sliders.
- `app/privacy/page.tsx` and `app/terms/page.tsx`: Footer legal destinations.

## Media notes

- Image URLs live in `lib/images.ts` and use Cloudinary. Add new hosts to `next.config.mjs`.
- Hero and testimonial images should be high resolution; update the arrays, not the JSX.
- The homepage film is an inline video in `app/page.tsx`.

## Styling notes

- Global styles live in `app/globals.css`. `styles/globals.css` is legacy and not imported by the App Router.
- Fonts are loaded via `next/font/local` from `font/`.

## Testing notes

- `e2e/release-gate.spec.ts` covers public route health, CTA routing, search, footer links, and the booking embed.
- `e2e/forms.spec.ts` covers form validation plus success/error states.
- `e2e/usability.spec.ts` covers overflow, tap targets, resize behavior, and carousel resilience.
- `e2e/design-visual.spec.ts` guards hero, forms, and mini-gallery visual baselines.
- `e2e/slider-swipe.spec.ts`, `e2e/slider-snap.spec.ts`, `e2e/hero-contrast.spec.ts`, and `e2e/spacing.spec.ts` protect interaction quality and layout rhythm.

## Deployment notes

- Production is hosted on Vercel project `v0-canary-cove-navbar-structure`.
- Production URL: `https://v0-canary-cove-navbar-structure.vercel.app`
- Pushing `main` is the normal path to a production deployment.
- If the primary domain changes, update `app/sitemap.ts` in the same release.

## Docs for future sessions

- `AGENTS.md`: repo-specific operating guidance for Codex
- `docs/codex-playbook.md`: architecture, integrations, QA expectations, and deploy workflow
- `docs/qa-success-criteria.md`: explicit production readiness bar
