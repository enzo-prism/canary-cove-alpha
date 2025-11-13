# Repository Guidelines

## Project Structure & Module Organization
- Application code lives in `app/` (Next.js App Router). `layout.tsx` defines fonts/metadata and `page.tsx` composes the landing sections.
- Reusable UI sits in `components/` with shadcn-based primitives under `components/ui/`. Business-specific sections (`header.tsx`, `hero.tsx`, etc.) are sibling modules.
- Shared utilities belong in `lib/` (currently `utils.ts` for the `cn` helper). Global styles load from `app/globals.css`, while `public/` holds statically served images and icons.
- No dedicated test directory yet; prefer colocating future specs under `__tests__/` near the code they exercise.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies; always run after pulling remote changes.
- `pnpm dev` — start the Next.js dev server with Fast Refresh at `http://localhost:3000`.
- `pnpm build` — create a production build (`.next/`). Mirrors the Vercel pipeline, so run before opening PRs.
- `pnpm start` — serve the production build locally for smoke testing.
- `pnpm lint` — executes the project ESLint config (note: lint/TS errors are ignored during `next build`, so run this manually).

## Coding Style & Naming Conventions
- Use TypeScript, functional React components, and the App Router paradigm. Co-locate UI logic with minimal state; prefer hooks over classes.
- Tailwind CSS v4 powers styling. Keep class lists ordered logically (layout → color → effects) and reuse tokens declared in `app/globals.css` such as `bg-sand` or `text-accent-coral`.
- File names are kebab-case (`hero.tsx`), components PascalCase, and props camelCase. Import aliases (`@/components`, `@/lib`) are configured via `tsconfig.json`.

## Testing Guidelines
- No automated tests are configured. When adding them, reach for Jest + React Testing Library or Playwright for e2e.
- Name test files `*.test.ts(x)` and place them in `__tests__/` folders beside the modules they target.
- Aim for coverage of critical UI interactions (navigation, CTA buttons, accessibility states) before merging substantial UI refactors.

## Commit & Pull Request Guidelines
- Follow the existing history: short, imperative subject lines (e.g., `Add hero CTA animation`). Include a concise body when context is non-obvious.
- Each PR should outline the change, mention affected routes/components, and link the related issue or Vercel deployment. Attach screenshots or recordings for visual updates.
- Verify `pnpm build` and `pnpm lint` locally before requesting review, and summarize the verification steps in the PR checklist.
