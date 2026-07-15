# Canary Cove Release Log

This log records production releases that materially change guest-facing behavior. Keep entries concise and evidence-based.

## 2026-07-15 — Reef encounters on film

- Commit: `840e81715f1bbb12d32d953ac573c8f4fdcaaa96`
- Production: `https://www.canarycove.com/adventures#reef-encounters`
- Vercel deployment: `dpl_7L6fCaY3WnEvaNqXd4DS169qdVGh` (`Ready`)
- Added three optimized Canary Cove dive films with poster frames, native controls, keyboard focus, inline playback, and load-on-demand behavior.
- Added the reef-film section to site search and Adventures metadata.
- Verified responsive layouts at `320`, `375`, `768`, `1024`, `1440`, and `1728` pixels without horizontal overflow.
- Passed the 57-test release suite across Chromium, Firefox, and WebKit, plus typecheck, lint, unit tests, and production build.
- Verified the production page and legal/discovery routes return `200`; all three MP4s return `video/mp4` and accept byte-range requests with `206` responses.
