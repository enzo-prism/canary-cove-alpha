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

## Git Workflow Tips
- Sync often: `git fetch origin && git rebase origin/main` keeps your branch current without merge commits. Resolve conflicts locally, rerun `pnpm lint`, then continue the rebase (`git rebase --continue`).
- Stage deliberately (`git add path/to/file.tsx`) and review with `git status` before committing to avoid noise from generated assets.
- Push with `git push origin <branch>`; if the push is rejected because the remote advanced, re-run the fetch/rebase sequence and push again.
- For paired work, prefer feature branches (`git checkout -b feat/new-section`) and open PRs against `main`. After merge, clean up the branch locally (`git branch -d feat/new-section`) and remotely (`git push origin --delete feat/new-section`).

## Navigation Architecture Notes
- The entire navigation is data-driven via `NAV_ITEMS` in `components/header.tsx`. Each entry is either `{ type: "link", label, href, cta? }` or `{ type: "dropdown", label, items: DropdownItem[] }`. Dropdown items include `caption` strings that render above each row. Update this array whenever IA changes; no JSX edits are necessary if the structure stays the same.
- Dropdown visibility is controlled by React state instead of Radix primitives. Desktop menus open on hover/focus and use `desktopDropdown` state, while mobile accordions use `accordionOpen`. When adding new dropdowns, ensure labels are unique because they act as state keys.
- The sticky header tracks scroll (`scrolled` state) to shrink and solidify the bar; be mindful when modifying padding/height values so the shrink animation remains smooth.
- Mobile navigation uses the shared `Sheet` component; body scroll is locked when `mobileOpen` is true. If you add additional modal layers, avoid conflicting body overflow changes.
