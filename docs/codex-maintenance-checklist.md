# Canary Cove Codex Maintenance Checklist

Use this file when making a change that looks small in the UI but may have knock-on effects elsewhere in the repo.

The goal is not to make every change heavier. It is to keep future Codex sessions from shipping a partial fix that updates the visible page but misses search, redirects, analytics, or test coverage.

For route ownership, anchors, and likely blast radius, read `docs/codex-route-map.md` alongside this checklist.

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

- `/stay`, `/rates`, `/reviews`, and `/dining` use plain anchor links with `scroll-mt-*` offsets on section wrappers (no JS smooth scrolling)
- `/book` uses section IDs such as `#comfort-confidence`
- search answers and results link directly into anchored sections

Also note:

- some public hashes land on summary cards, not the deeper section they visually describe
- `next.config.mjs` still contains legacy marketing hash redirects for some interior pages, so audit real DOM ids before copying or extending that pattern

## Navigation and information architecture

Navigation is split across multiple render layers.

When top-level IA changes, review:

- `lib/nav-items.ts`
- `components/navigation/desktop-nav.tsx`
- `components/navigation/mobile-nav.tsx`
- `components/header.tsx`
- `components/header-search.tsx`
- `components/footer.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms/route.ts`
- `lib/site-config.ts`
- `e2e/release-gate.spec.ts`

If the active desktop-nav underline or dropdown styling changes, keep the split link/chevron trigger structure in `components/navigation/desktop-nav.tsx` unless you are intentionally redesigning the component. The label must stay a real link so parent routes remain reachable.

## Metadata, sitemap, and llms surfaces

When public page titles, descriptions, route purpose, or business details change, review:

- `lib/seo.ts`
- `lib/site-config.ts`
- `lib/structured-data.ts`
- `components/structured-data.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/llms/route.ts`
- `app/llms-full/route.ts`

Typical misses:

- updating route copy but not the metadata description
- changing page emphasis without updating breadcrumb or page-level JSON-LD
- changing business contact details in the UI without updating schema constants
- changing public meaning of a page without updating `llms.txt` summaries

## Search

Search is curated manually. It does not discover routes or sections automatically.

When pricing, policies, logistics, amenities, dining rules, or FAQs change, review:

- `lib/search/search-index.ts` (items, `SYNONYMS`, chips, popular questions)
- `lib/search/search.ts` (retrieval pipeline — see below)
- `lib/search/recent-searches.ts` (localStorage recents)
- `components/header-search.tsx` (trigger + shortcut)
- `components/site-search.tsx` (palette UI)
- `components/search-highlight.tsx` (match highlighting)
- `lib/search/__tests__/search.test.ts` (ranking regression tests)
- `e2e/search.spec.ts`

Retrieval pipeline (`runSearch`): synonym expansion (additive) → word-boundary intent detection (exact triggers, then capped fuzzy) → Fuse recall from the user's own query and its words only → intent expansion terms rescore but never add candidates → re-rank bonuses for exact/prefix/full-query matches → 4-per-group and 12-total caps. Short queries (≤3 chars) require a literal substring. Keep this order: intent expansion must stay rescore-only or single-token queries over-recall the catalog.

Typical misses:

- adding a new route but not indexing it
- renaming a section heading or anchor without updating the linked search result
- changing policy copy without updating the instant-answer bullets
- adding an intent trigger as a substring instead of a whole word (substring triggers misfire, e.g. "call" inside "scallops")

## Media, video, galleries, and imagery

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
- remember that `next/image` uses `lib/cloudinary-loader.ts` (width cap 2560). Do not set `images.unoptimized`; large hero swaps still matter because the loader only downscales, it does not invent missing resolution

For reef-film changes, review together:

- `lib/videos.ts`
- `components/reef-encounters.tsx`
- `public/videos/reef-encounters/`
- `lib/search/search-index.ts`
- `lib/seo.ts`
- `e2e/release-gate.spec.ts`

Keep committed video web-ready rather than camera-original quality. Every film needs a poster, accessible label, keyboard focus,
native controls, inline playback, and no autoplay or looping. Preload metadata only for the featured film; supporting films should
wait for interaction.

## Forms and booking flow

All public forms are expected to show validation, success, and failure states.

When changing forms or booking behavior, review:

- `components/contact-form.tsx`
- `components/booking-form.tsx`
- `app/book/page.tsx`
- `app/privacy/page.tsx`
- `e2e/forms.spec.ts`

Also confirm whether the change affects:

- Formspree endpoints
- validation logic
- success copy
- privacy-policy wording
- the canonical post-submission flow in `docs/lead-operations.md`

For routine lead operations (not a site code change):

- let the `canarycove-dash` reconciliation run daily at 8:00 AM America/Los_Angeles and confirm it read every page from both Formspree sources with an explicit UTC reconciliation timestamp
- review Canary Cove booking/contact submissions and reject spam, malformed entries, and clearly labeled tests; historical homepage email-capture rows stay out of this dashboard
- deduplicate by immutable Formspree submission ID when available, otherwise by source form plus exact timestamp and normalized email
- add or reconcile genuine lead data in the Canary Cove lead dashboard, which is the operational source of truth
- read the dashboard record back and verify the source, required fields, and absence of duplicates
- do not email Consi and do not route Formspree notifications to her
- keep personal data out of analytics, logs, screenshots, commits, and task notes
- do not restore Bookingmood or submit a real form solely to test the operations workflow
- treat a zero-change reconciliation as verification only; route every new, changed, or ambiguous result through review before a data commit or deployment

## Analytics

Analytics is dual-wired.

When changing analytics behavior, review:

- `app/layout.tsx`
- `app/api/forms/route.ts`
- `components/google-analytics-scripts.tsx`
- `components/google-analytics-pageviews.tsx`
- `components/vercel-analytics.tsx`
- `components/analytics/tracked-link.tsx`
- `lib/google-analytics.ts`
- `lib/analytics.ts`
- `lib/vercel-analytics.ts`
- `lib/lead-forms.ts`
- `app/privacy/page.tsx`

Current behavior:

- Google Analytics 4 is loaded globally
- GA4 pageviews are sent manually by `GoogleAnalyticsPageviews` because the tag config disables automatic pageviews
- Vercel Analytics is also enabled
- `trackEvent(...)` sends ordinary funnel events to both when available
- Successful form conversions are split deliberately: GA4 receives client-side `generate_lead`; Vercel receives server-side `lead_submit` only after Formspree accepts the form
- `components/vercel-analytics.tsx` strips query strings and hashes before Vercel sends pageviews or custom events
- Vercel payloads are intentionally flat and limited to small, low-cardinality properties
- Never send free-form search queries, form content, or contact details to Vercel custom events
- Prefer `TrackedLink` for tracked CTAs before hand-rolling another click handler
- Prefer extending the existing event names before inventing new ones:
  `cta_click`, `nav_click`, `nav_menu_open`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`,
  `search_open`, `search_refine`, `search_result_click`, `review_archive_filter`, `review_note_open`, `section_jump`,
  `social_click`, and `outbound_click`

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
- `lib/seo.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `/llms.txt`
- `/llms-full.txt`
- `/privacy` and `/terms`
- footer links
- route hashes landing below the sticky header
- Bookingmood was removed because the subscription was cancelled; do not restore a live calendar embed on `/book`
- form success/error states still working
- when lead operations are in scope, the dashboard record was read back successfully and no duplicate was created
- when lead operations are in scope, no direct email or Formspree notification was sent to Consi
- Vercel reports the production deployment as `Ready` for the exact `origin/main` commit
- both `canarycove.com` and `www.canarycove.com` resolve to that production deployment
- SiteGround is absent from the website release path; Vercel is the active host (SiteGround cancellation is approved, with Kristin's final confirmation potentially still pending)
- changed local videos return `video/mp4` and a byte-range request returns `206`
