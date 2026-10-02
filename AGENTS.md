# Repository Guidelines

## Project Structure & Module Organization
- Application code lives in `app/` (Next.js App Router). `app/page.tsx` composes the homepage sections (hero overlay, proof row, estate spaces, editorial splits, poster-first diving film, testimonials, process steps).
- Hero UI: `components/hero.tsx` owns the overlay copy/CTAs; `components/hero-image-rotator.tsx` supplies the rotating background imagery.
- Shared sections live in `components/` (ModelCarousel, EditorialSplit, ProcessSteps, PropertyFilm, TestimonialSlider, ReefEncounters).
- Layout primitives live in `components/layout/` (`container.tsx`, `section.tsx`, `page-shell.tsx`) and should be used to keep spacing consistent.
- UI primitives live in `components/ui/` (shadcn-style wrappers).
- Shared data lives in `lib/`: `images.ts`, `videos.ts`, `homepage-content.ts`, `testimonial-spotlights.ts`, `nav-items.ts`, `emoji.ts`, `utils.ts`.
- Global styles live in `app/globals.css`. `styles/globals.css` is legacy and not imported by the App Router.
- Future-session docs live in `docs/`. Start with `docs/codex-playbook.md` for architecture, integrations, QA expectations, and deploy workflow. `docs/qa-success-criteria.md` is the release bar.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies.
- `pnpm dev` — start the Next.js dev server at `http://localhost:3000`.
- `pnpm build` — create a production build (`.next/`). This is part of the real release gate and fails on TypeScript errors.
- `pnpm start` — serve the production build locally.
- `pnpm lint` — run ESLint.
- `pnpm typecheck` — run TypeScript checks (`tsc --noEmit`).
- `pnpm test` / `pnpm test:unit` — run Vitest.
- `pnpm test:e2e` — run the Playwright release suite.
- `pnpm exec playwright install firefox webkit` — install the browser runtimes if Playwright is missing browsers.
- Prefer `pnpm` as the canonical package manager for this repo. `package-lock.json` may exist as legacy baggage; do not treat `npm` as the source of truth unless the repo is intentionally migrated.

## Coding Style & Naming Conventions
- Use TypeScript, functional React components, and the App Router paradigm.
- Tailwind CSS v4 powers styling. Prefer tokens from `app/globals.css` (`bg-surface`, `text-muted-foreground`, `bg-primary`, etc.) and shared utilities (`frosted-panel`, `focus-ring`).
- File names are kebab-case (`hero.tsx`), components PascalCase, and props camelCase. Import aliases (`@/components`, `@/lib`) are configured via `tsconfig.json`.

## Testing Guidelines
- Unit tests run with Vitest; current tests live beside their modules under `lib/**/__tests__/`.
- E2E tests live in `e2e/` and run with Playwright.
- The production release gate is: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm test:e2e`.
- Cross-browser Playwright coverage runs on Chromium, Firefox, and WebKit.
- Visual baselines are intentionally maintained on Chromium only to keep snapshots stable. Linux and Darwin snapshot files both live in `e2e/design-visual.spec.ts-snapshots/`. When a design change is intentional, update the snapshots for the OS you ran and call that out in the commit.
- Key suites:
  - `e2e/release-gate.spec.ts` for route health, navigation, CTA routing, footer links, embeds, and reef-film playback configuration
  - `e2e/forms.spec.ts` for contact and booking form success/error states
  - `e2e/usability.spec.ts` for overflow, hit targets, resize resilience, and keyboard/touch behavior
  - `e2e/design-visual.spec.ts` for visual regressions on hero, forms, and mini galleries
  - `e2e/design-layout.spec.ts` for dropdown alignment/panels, active-section underline, solid-bar/shrink behavior, Getting Here step badges, testimonial clipping, Experiences hero offset, and dining bullets
- `e2e/helpers.ts` intentionally filters Vercel analytics debug noise and cancelled Cloudinary video requests in dev so real regressions stand out.

## Commit & Pull Request Guidelines
- Follow the existing history: short, imperative subject lines (e.g., `Add hero CTA animation`). Include a concise body when context is non-obvious.
- Each PR should outline the change, mention affected routes/components, and link the related issue or deployment. Attach screenshots or recordings for visual updates.
- Verify `pnpm lint` and `pnpm typecheck` locally before requesting review, and summarize verification steps in the PR checklist.

## Git Workflow Tips
- Sync often: `git fetch origin && git rebase origin/main` keeps your branch current without merge commits. Resolve conflicts locally, rerun `pnpm lint`, then continue the rebase (`git rebase --continue`).
- Stage deliberately (`git add path/to/file.tsx`) and review with `git status` before committing to avoid noise from generated assets.
- Push with `git push origin <branch>`; if the push is rejected because the remote advanced, re-run the fetch/rebase sequence and push again.
- For paired work, prefer feature branches (`git checkout -b feat/new-section`) and open PRs against `main`. After merge, clean up the branch locally (`git branch -d feat/new-section`) and remotely (`git push origin --delete feat/new-section`).

## Navigation Architecture Notes
- Navigation is data-driven via `NAV_ITEMS` in `lib/nav-items.ts`. Stay (The Villa, Main House, Rates) and Explore (Experiences, Dining, Adventures, Gallery) are dropdowns; Reviews, Getting Here, and Contact are plain links; Book is the sole header CTA.
- Desktop nav uses plain text links plus controlled Radix `Popover` dropdowns with split link/chevron triggers in `components/navigation/desktop-nav.tsx`. Mobile nav is a full-screen `Sheet` overlay (`side="full"`) with grouped links and a sticky Book footer in `components/navigation/mobile-nav.tsx`.
- Overlay z-index scale: header 50, dropdown panels 60, mobile nav overlay 80, dialogs (incl. site search) 90, skip link 100. Documented in `app/globals.css`.
- `components/header.tsx` composes the nav, site search trigger, and sticky scroll state. Be mindful when adjusting padding/height so the shrink animation and `--site-header-height` stay in sync.
- Immersive header (`/` and `/experiences` until `window.scrollY > 40`) inverts `BrandMark` and wraps it in a frosted chip so the wordmark stays readable over photography. Do not leave the default dark wordmark on a translucent bar.
- `/experiences` hero should tuck under the sticky header with `-mt-[var(--site-header-height)]` and matching padding. Do not hardcode pixel header offsets.
- Getting Here step numbers are absolutely positioned. The parent `li` must be `relative` or every badge stacks on the `ol`.

## Assets, Fonts & Media
- SF Pro fonts live under `font/` and are registered via `next/font/local` in `app/layout.tsx` (Regular, Medium, Semibold, Bold subset woff2s). Do not add the unused Light face back.
- Hero imagery is defined in `components/hero-image-rotator.tsx` as Cloudinary URLs; keep these high-resolution to avoid blur.
- Image registry lives in `lib/images.ts`; remove low-resolution assets rather than letting them slip into galleries.
- `lib/cloudinary-loader.ts` resizes Cloudinary assets on their CDN and caps requested width at 2560.
- The homepage diving film lives in `components/property-film.tsx`: poster-first, user-started playback, compressed Cloudinary derivative. Do not restore the raw autoplay MP4.
- The Adventures reef-film gallery lives in `components/reef-encounters.tsx`; its copy and asset paths live in `lib/videos.ts`, with optimized MP4s and posters under `public/videos/reef-encounters/`.
- `components/photo-carousel.tsx` wraps Embla and is used by interior galleries such as `/book`.
- Remote images are allowed from `res.cloudinary.com` (see `next.config.mjs`). Add new domains to `images.remotePatterns` before using them.

## Forms & Integrations
- The contact form posts to Formspree endpoint `https://formspree.io/f/xvzarybk` with in-app success/error states.
- Booking requests post to Formspree endpoint `https://formspree.io/f/xqeqllek`.
- Booking requests use the Formspree `/book` form in `components/booking-form.tsx`. The Bookingmood iframe was removed because the subscription was cancelled; do not restore it.
- `/book` may show a first-party Villa / Main House availability calendar from `GET /api/availability`, which reads `canarycove@gmail.com` with `events.list` (not FreeBusy) and returns dates only. Hide the calendar if the fetch fails. Requires `GOOGLE_CALENDAR_SERVICE_ACCOUNT_JSON`.
- `docs/lead-operations.md` is the canonical post-submission runbook. The `canarycove-dash` repo runs a daily 8:00 AM America/Los_Angeles reconciliation from Formspree. Keep historical homepage email-capture rows separate, deduplicate by immutable Formspree submission ID when available, and verify dashboard state by readback. Changed or ambiguous results are review-gated; do not publish them automatically.
- The Canary Cove lead dashboard is the operational source of truth. Do not email Consi during routine lead ingestion, and do not add her as a Formspree notification recipient or forward notifications to her.
- The site uses Cloudinary-hosted images/video and Vercel Analytics.

## Deployment Notes
- Production site: `https://www.canarycove.com`
- Vercel project: `v0-canary-cove-navbar-structure`
- Vercel is the active website host and production source of truth. SiteGround is no longer a website dependency; its cancellation is approved, although Kristin's final cancellation confirmation may still be pending. Do not add SiteGround release steps back to this repo.
- `lib/site-config.ts` is the source of truth for the canonical domain plus sitemap/robots/llms metadata. If the primary domain changes, update that file as part of the same release.
- The typical release flow is: validate locally, commit, push `main`, then confirm the Vercel production deployment reaches `Ready`.
- Before shipping, make sure footer legal links still resolve to `/privacy` and `/terms`.

## Codex CLI Map
- Homepage layout: `app/page.tsx`
- Hero overlay copy/CTAs: `components/hero.tsx`
- Hero background images: `components/hero-image-rotator.tsx`
- Testimonial copy: `lib/testimonial-spotlights.ts` and the selection in `app/page.tsx`
- Navigation items/icons: `lib/nav-items.ts`, `lib/emoji.ts`
- Search UI: `components/header-search.tsx` plus `components/site-search.tsx`
- Cloudinary image loader: `lib/cloudinary-loader.ts`
- Homepage film: `components/property-film.tsx`
- Styling tokens/utilities: `app/globals.css`
- Image registry: `lib/images.ts`
- Shared carousel layer: `components/ui/carousel.tsx`
- Interior page shell: `components/layout/page-shell.tsx`
- Booking form: `components/booking-form.tsx`, `app/book/page.tsx`
- Adventures reef films: `app/adventures/page.tsx`, `components/reef-encounters.tsx`, `lib/videos.ts`
- Experiences hero offset: `components/experiences-hero.tsx` (uses `--site-header-height`)
- Getting Here steps: `app/getting-here/page.tsx`
