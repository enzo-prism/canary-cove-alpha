# Canary Cove

Marketing site for the Canary Cove private estate. Built with the Next.js App Router and Tailwind CSS.

## Quick start

```bash
pnpm install
pnpm dev
```

If you prefer `npm`:

```bash
npm install
npm run dev
```

## Scripts

- `pnpm dev`: Run the Next.js dev server.
- `pnpm build`: Production build.
- `pnpm start`: Serve the production build.
- `pnpm lint`: Lint the repo.
- `pnpm typecheck`: TypeScript check (`next build` ignores TS errors).
- `pnpm test`: Run Vitest.
- `pnpm test:e2e`: Run Playwright.

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
- `components/contact-form.tsx`: Contact form + custom success state (Formspree backend).

## Media notes

- Image URLs live in `lib/images.ts` and use Cloudinary. Add new hosts to `next.config.mjs`.
- Hero and testimonial images should be high resolution; update the arrays, not the JSX.
- The homepage film is an inline video in `app/page.tsx`.

## Styling notes

- Global styles live in `app/globals.css`. `styles/globals.css` is legacy and not imported by the App Router.
- Fonts are loaded via `next/font/local` from `font/`.

## Testing notes

- `e2e/slider-swipe.spec.ts` covers gesture swipes + keyboard navigation for sliders.
- `e2e/hero-contrast.spec.ts` and `e2e/spacing.spec.ts` guard hero legibility and spacing rhythm.
