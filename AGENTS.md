# Repository Guidelines

## Project Structure & Module Organization
- Application code lives in `app/` (Next.js App Router). `app/page.tsx` composes the homepage sections (hero, estate lineup, editorial splits, diving film, bento metrics, process steps, testimonials, specs, email capture, search).
- Hero UI: `components/hero.tsx` owns the overlay copy/CTAs/logo; `components/hero-image-rotator.tsx` supplies the rotating background imagery.
- Shared sections live in `components/` (ModelCarousel, EditorialSplit, BentoMetrics, ProcessSteps, SpecsAccordion, TestimonialSlider, EmailCapture).
- Layout primitives live in `components/layout/` (`container.tsx`, `section.tsx`) and should be used to keep spacing consistent.
- UI primitives live in `components/ui/` (shadcn-style wrappers).
- Shared data lives in `lib/`: `images.ts`, `homepage-content.ts`, `testimonial-spotlights.ts`, `nav-items.ts`, `emoji.ts`, `utils.ts`.
- Global styles live in `app/globals.css`. `styles/globals.css` is legacy and not imported by the App Router.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies.
- `pnpm dev` — start the Next.js dev server at `http://localhost:3000`.
- `pnpm build` — create a production build (`.next/`). Note: `next.config.mjs` ignores TS build errors, so run `pnpm typecheck` separately.
- `pnpm start` — serve the production build locally.
- `pnpm lint` — run ESLint.
- `pnpm typecheck` — run TypeScript checks (`tsc --noEmit`).
- `pnpm test` / `pnpm test:unit` — run Vitest.
- `pnpm test:e2e` — run Playwright (run `npx playwright install` once if browsers are missing).

## Coding Style & Naming Conventions
- Use TypeScript, functional React components, and the App Router paradigm.
- Tailwind CSS v4 powers styling. Prefer tokens from `app/globals.css` (`bg-surface`, `text-muted-foreground`, `bg-primary`, etc.) and shared utilities (`frosted-panel`, `focus-ring`).
- File names are kebab-case (`hero.tsx`), components PascalCase, and props camelCase. Import aliases (`@/components`, `@/lib`) are configured via `tsconfig.json`.

## Testing Guidelines
- Unit tests run with Vitest; current tests live in `lib/search/__tests__/`.
- E2E tests live in `e2e/` and run with Playwright.
- Cover critical UI interactions (navigation, CTAs, search). Slider behavior is validated by `e2e/slider-swipe.spec.ts` for gestures + keyboard.

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
- Navigation is data-driven via `NAV_ITEMS` in `lib/nav-items.ts`.
- Emoji for nav labels come from `lib/emoji.ts`; update there when adjusting iconography.
- Desktop nav uses Radix `NavigationMenu` in `components/navigation/desktop-nav.tsx`. Mobile nav uses `Sheet` + `components/navigation/mobile-nav.tsx`.
- `components/header.tsx` composes the nav and manages sticky scroll state (no logo currently). Be mindful when adjusting padding/height so the shrink animation remains smooth.

## Assets, Fonts & Media
- SF Pro fonts live under `font/` and are registered via `next/font/local` in `app/layout.tsx`.
- Hero imagery is defined in `components/hero-image-rotator.tsx` as Cloudinary URLs; keep these high-resolution to avoid blur.
- Image registry lives in `lib/images.ts`; remove low-resolution assets rather than letting them slip into galleries.
- The diving film section lives in `app/page.tsx` and uses a Cloudinary MP4 with a poster frame.
- `components/photo-carousel.tsx` wraps Embla and is used by `components/basic-page.tsx` for interior pages.
- Remote images are allowed from `res.cloudinary.com` (see `next.config.mjs`). Add new domains to `images.remotePatterns` before using them.

## Forms & Integrations
- Contact form is implemented in `components/contact-form.tsx` and posts to Formspree with a custom thank-you state (no redirect).

## Codex CLI Map
- Homepage layout: `app/page.tsx`
- Hero overlay copy/CTAs: `components/hero.tsx`
- Hero background images: `components/hero-image-rotator.tsx`
- Testimonial copy: `lib/testimonial-spotlights.ts` and the selection in `app/page.tsx`
- Navigation items/icons: `lib/nav-items.ts`, `lib/emoji.ts`
- Search UI: `components/site-search.tsx`
- Styling tokens/utilities: `app/globals.css`
- Image registry: `lib/images.ts`
