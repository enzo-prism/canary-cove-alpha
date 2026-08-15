# Canary Cove Release Log

This log records production releases that materially change guest-facing behavior. Keep entries concise and evidence-based.

## 2026-08-15 — Diving film overlay collision

- Commit: `0c3de1da1ae080305359e595afc3358d655063b7`
- Production: `https://www.canarycove.com/#property-film`
- Vercel: GitHub status `Deployment has completed` for `v0-canary-cove-navbar-structure` (`8tJgHBvq5gj5fGh2hcczVxM1AuWe`)
- PR: https://github.com/enzo-prism/canary-cove-alpha/pull/22
- Homepage diving film keeps poster-first playback, but the play control now stacks above the copy instead of centering over the manta-ray headline.
- Marketing overlay hides after a guest click so native video controls stay usable.
- Verified production `/`, `/book`, `/privacy`, and `/terms` return `200`; apex `https://canarycove.com` 307-redirects to www; live HTML includes `property-film-play`, `property-film-heading`, and no preloaded film `<video>`.

## 2026-08-14 — Performance, UX, and design pass

- Commit: `4418f69f0f5547b1ddbcd04653de2be6c338a952`
- Production: `https://www.canarycove.com`
- Vercel: GitHub status `Deployment has completed` for `v0-canary-cove-navbar-structure` (`BQpouuL6zii46HA1kkzawnSGFBqs`)
- PR: https://github.com/enzo-prism/canary-cove-alpha/pull/21
- Hero now shows “Private estate on Ambergris Caye” with Book → `/book` and See rates → `/rates`.
- Rates is first-class in nav/footer; Explore groups Experiences, Dining, Adventures, and Gallery; search opens from the header.
- Homepage film is poster-first; Cloudinary loader caps width at 2560; unused Light font and dead page templates were removed.
- Project docs (AGENTS, README, playbook, route map, maintenance checklist, QA criteria) match the shipped architecture.
- Verified production `/`, `/rates`, `/book`, `/privacy`, and `/terms` return `200`; apex `https://canarycove.com` 307-redirects to www; live HTML includes the new hero heading and CTAs.

## 2026-07-15 — Reef encounters on film

- Commit: `840e81715f1bbb12d32d953ac573c8f4fdcaaa96`
- Production: `https://www.canarycove.com/adventures#reef-encounters`
- Vercel deployment: `dpl_7L6fCaY3WnEvaNqXd4DS169qdVGh` (`Ready`)
- Added three optimized Canary Cove dive films with poster frames, native controls, keyboard focus, inline playback, and load-on-demand behavior.
- Added the reef-film section to site search and Adventures metadata.
- Verified responsive layouts at `320`, `375`, `768`, `1024`, `1440`, and `1728` pixels without horizontal overflow.
- Passed the 57-test release suite across Chromium, Firefox, and WebKit, plus typecheck, lint, unit tests, and production build.
- Verified the production page and legal/discovery routes return `200`; all three MP4s return `video/mp4` and accept byte-range requests with `206` responses.
