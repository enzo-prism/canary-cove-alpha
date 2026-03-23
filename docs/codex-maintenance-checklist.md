# Canary Cove Codex Maintenance Checklist

Use this file when making a change that looks small in the UI but may have knock-on effects elsewhere in the repo.

The goal is not to make every change heavier. It is to keep future Codex sessions from shipping a partial fix that updates the visible page but misses search, redirects, analytics, or test coverage.

## Public routes

When you add, remove, rename, or significantly repurpose a public route, review this set together:

- `app/<route>/page.tsx`
- `lib/nav-items.ts` if the route belongs in the main nav
- `components/footer.tsx` if the route belongs in footer IA
- `lib/search/search-index.ts` if guests should be able to find it through site search
- `e2e/helpers.ts` (`SITE_ROUTES`) if it should be part of route-health coverage
- `lib/site-config.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms/route.ts`
- `app/llms-full/route.ts`
- `next.config.mjs` if old URLs should redirect into the new path

## In-page anchors and deep links

This repo has real anchor coupling. Do not treat hash IDs as purely local implementation details.

When you add or rename a section `id`, review:

- the page/component that owns the `id`
- buttons/links that point to that hash
- `lib/search/search-index.ts`
- `next.config.mjs` redirect fragments
- any `scroll-mt-*` classes or manual scroll offsets

Examples:

- `/stay` has button-triggered smooth scrolling in `components/stay-highlights.tsx`
- `/book` uses section IDs such as `#availability-calendar` and `#comfort-confidence`
- search answers and results link directly into anchored sections

## Navigation and information architecture

Navigation is split across multiple render layers.

When top-level IA changes, review:

- `lib/nav-items.ts`
- `components/navigation/desktop-nav.tsx`
- `components/navigation/mobile-nav.tsx`
- `components/header.tsx`
- `components/footer.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms/route.ts`
- `lib/site-config.ts`
- `e2e/release-gate.spec.ts`

## Search

Search is curated manually. It does not discover routes or sections automatically.

When pricing, policies, logistics, amenities, dining rules, or FAQs change, review:

- `lib/search/search-index.ts`
- `lib/search/search.ts`
- `components/site-search.tsx`
- `e2e/search.spec.ts`

Typical misses:

- adding a new route but not indexing it
- renaming a section heading or anchor without updating the linked search result
- changing policy copy without updating the instant-answer bullets

## Media, galleries, and imagery

The image registry is the main source of truth for remote assets and alt text.

When adding or replacing imagery, review:

- `lib/images.ts`
- route-local gallery or carousel components
- `next.config.mjs` if a new remote image host is introduced
- `e2e/design-visual.spec.ts` if the change affects a guarded visual surface

Best practices here:

- prefer updating alt text and captions at the data layer
- keep hero and gallery assets high resolution
- avoid hardcoding Cloudinary URLs inline unless the component is truly one-off

## Forms and booking flow

All public forms are expected to show validation, success, and failure states.

When changing forms or booking behavior, review:

- `components/contact-form.tsx`
- `components/email-capture.tsx`
- `components/booking-form.tsx`
- `app/book/page.tsx`
- `app/privacy/page.tsx`
- `e2e/forms.spec.ts`

Also confirm whether the change affects:

- Formspree endpoints
- validation logic
- success copy
- privacy-policy wording

## Analytics

Analytics is dual-wired.

When changing analytics behavior, review:

- `app/layout.tsx`
- `components/google-analytics-scripts.tsx`
- `lib/google-analytics.ts`
- `lib/analytics.ts`
- `app/privacy/page.tsx`

Current behavior:

- Google Analytics 4 is loaded globally
- Vercel Analytics is also enabled
- `trackEvent(...)` sends to both when available

## Stay page specifics

The `/stay` page has more route-local structure than most pages in the repo.

If you touch the stay page, review:

- `app/stay/page.tsx` for section order
- `components/stay-highlights.tsx` for CTA-to-section scroll wiring
- `components/stay-gallery-section.tsx` for shared gallery layout
- `components/stay-villa-gallery.tsx`
- `components/stay-outdoor-gallery.tsx`
- `lib/images.ts` for image choice, alt text, and caption accuracy

## Testing impact map

If the change is visual:

- run `pnpm typecheck`
- run `pnpm lint`
- run `pnpm build`
- run at least the most relevant Playwright spec
- update Chromium-only visual baselines when the change is intentional

If the change affects routing, public content, or behavior:

- run the full release gate:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Deploy-sensitive items

Before shipping, sanity-check these when relevant:

- `lib/site-config.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `/llms.txt`
- `/llms-full.txt`
- `/privacy` and `/terms`
- footer links
- route hashes landing below the sticky header
- Bookingmood embed still present on `/book`
- form success/error states still working
