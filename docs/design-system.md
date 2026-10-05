# Canary Cove Design System — "Sand, reef, and canary"

The October 2026 overhaul replaced the beige SF-Pro card template with an editorial, cinematic system built around the estate itself: sand paper, deep reef ink, lagoon water, a canary-yellow sun, and the pink villa's coral used sparingly. Motion is a core part of the brand: things rise, wipe, drift and settle like water, never bounce.

## Principles

1. **Photography first, big.** Images are large, edge-to-edge or framed with a soft `--radius-media` (20px). Prefer one big image over a grid of small cards.
2. **Serif headlines, quiet UI.** Every headline is Instrument Serif (`.text-hero` / `.text-display` / `.text-section` / `.text-title`, or `font-display`). Body copy, labels and controls are SF Pro. Never apply `font-semibold`/`font-bold` to serif text (it has one weight; `font-synthesis: none` prevents fake bold).
3. **Italic accent.** One or two words per headline can be set in the italic accent (`*word*` in `SplitText`/`SectionHeading` titles, or `.italic-accent`). Use sparingly: once per section at most.
4. **Canary is a spark, not a fill.** Use canary for the active-nav underline, the arrow chip on primary CTAs, small dots, and one standout CTA per screen on dark backgrounds. Never as a large background except a single CTA band.
5. **Dark reef sections** (`.surface-reef`) punctuate long pages: film, testimonials, footer. At most one or two per page plus the footer.
6. **Less chrome.** Fewer boxed cards and borders; use hairlines (`.hairline`, `border-border`), whitespace and type scale to structure content. Cards only where they are clickable or hold a form.
7. **Motion has meaning.** Entrances reveal content in reading order; scroll-linked effects add depth (parallax) or progress (word reveal, drawn route lines). Everything respects `prefers-reduced-motion`.

## Brand mark (official logo)

The official Canary Cove logo is a yellow canary (green outline) perched on a heavy condensed slab-serif "Canary / Cove" wordmark, sipping through a straw from a lime-garnished cocktail glass. The master lives in Figma (file `3VZQifFoz4F92HnQfNOePV`, "Canary Cove") as a 394×351 raster with a white wordmark; it is archived at `public/brand/canary-cove-logo-official.png`. The site uses vector traces of it in `public/brand/`:

| Asset | Use |
| --- | --- |
| `canary-cove-logo.svg` | Full lockup, ink wordmark — light surfaces (header, mobile menu, guest pages) |
| `canary-cove-logo-light.svg` | Full lockup, white wordmark (the logo's native form) — dark surfaces (footer, reef bands) |
| `canary-cove-mark.svg` | Canary + glass without the wordmark |
| `canary-cove-bird.svg` | The canary alone — favicons (`/icon.svg`, PNG favicons, Apple icon on reef ink) and small accents (`BrandBird`) |
| `canary-cove-bird-silhouette-light.svg` | Single-color canary for faint decorative watermarks |
| `canary-cove-wordmark-light.svg` | Wordmark only, white |

Components: `BrandMark` (lockup as the home link; `tone="ink" | "light"`, `height`), `BrandLogo` (lockup image only), `BrandBird` (the canary) in `components/brand-mark.tsx`.

Rules:
- Never recolor the canary (`#FFEB00`) or the glass/lime (`#6EB53E`); only the wordmark switches between ink (`#0d2327`) and white.
- Don't re-set the wordmark in Instrument Serif or any other face, stretch it, rotate it, or add shadows/effects. Don't rearrange the stacked lockup.
- Minimum size: 44px tall for the full lockup; below that use the canary alone.
- Clear space: at least the canary's head height (~15% of the lockup height) on every side.
- Don't place the lockup directly on busy photography; use it on sand, sand-light, or reef surfaces.

## Tokens (app/globals.css)

| Token / class | Value / use |
| --- | --- |
| `bg-background` / `bg-sand` | `#f7f2e9` page sand (with a subtle grain texture on `body`) |
| `bg-surface` / `bg-sand-light` | `#fcfaf5` raised paper (forms, panels) |
| `bg-sand-deep` / `bg-surface-elevated` | `#efe7d8` inset fills, image placeholders |
| `text-foreground` / `bg-ink` | `#0d2327` reef ink |
| `text-muted-foreground` | `#52625f` (≥5.5:1 on sand) |
| `text-lagoon` / `bg-lagoon` | `#155e62` lagoon teal: links, active states, hover of ink buttons |
| `bg-lagoon-bright`, `text-lagoon-soft` | `#1f8a8a`, `#7cc8c2` accents on dark |
| `bg-canary`, `text-canary`, `decoration-canary-deep` | `#ffe41a` / `#f2c900` — the logo's canary (`#FFEB00`), a hair softer for large fills |
| `bg-lime`, `text-lime-deep` | `#6eb53e` / `#3f7f22` — the logo's lime; live-status dots and small brand accents (use `lime-deep` for text) |
| `text-coral` / `bg-coral` | `#e8957f` villa pink (rare) |
| `.surface-reef` | dark reef section (bg `#0c2428` + lagoon glows + grain), text auto-lightens for `.text-muted-foreground`, `.eyebrow`, `.text-lede`, `.text-body` |
| `--radius-media` / `rounded-[var(--radius-media)]` / `.media-frame` | 20px media radius, overflow hidden |
| `.arch` | arched top (Caribbean doorway) for one feature image per page |
| `--gutter` | responsive page gutter (`px-[var(--gutter)]`) |
| `--shadow-soft`, `--shadow-subtle`, `--shadow-lift` | soft ink-tinted shadows |

### Type scale

- `.text-hero`: homepage hero only (clamp 50→148px).
- `.text-display`: interior page h1 (clamp 44→96px).
- `.text-section`: section h2 (clamp 34→60px).
- `.text-title`: card/feature h3 (clamp 26→36px).
- `.text-lede`: intro paragraphs (17→20px, muted).
- `.text-body`: body copy (15→16px, muted, 1.7 leading).
- `.eyebrow`: 11px uppercase tracked label with a short leading rule that draws in on reveal. `.eyebrow-plain` removes the rule.
- `.tabular`: tabular numerals for prices and dates.

## Layout

- `Container` (`components/layout/container.tsx`): `default` 1200px, `wide` 1320px, `narrow` 960px.
- `Section` (`components/layout/section.tsx`): vertical rhythm `tight` / `default` / `loose`.
- Pages are compositions of full-width bands. Alternate sand → sand-light → reef to separate chapters rather than boxing content.

## Components

| Component | Use |
| --- | --- |
| `PageHero` (`components/page-hero.tsx`) | Interior page opener: eyebrow, word-rise h1 (the page's only h1), lede, actions, glance `facts`, and a wipe-up parallax image. Variants `stacked` (default), `split` (arched image right), `plain`. All entrances are CSS keyframes (run before hydration). |
| `SectionHeading` (`components/section-heading.tsx`) | Eyebrow + serif title (word reveal on scroll) + lede + action. `align="split"` puts the lede right on desktop. `tone="light"` on reef sections. |
| `CtaLink` (`components/ui/cta-link.tsx`) | Primary CTA. Pill with rolling label and arrow chip. Variants `solid`, `canary`, `light`, `outline`, `outline-light`, `text`, `text-light`; sizes `md`/`lg`; `arrow` `right`/`diag`/`none`; pass `eventName`/`eventPayload` for analytics (uses `TrackedLink`). |
| `Button` (`components/ui/button.tsx`) | Form and UI buttons (submit, toggles). Variants include `canary`. |
| `BrandMark`, `BrandLogo`, `BrandBird` | Official logo lockup / canary (see Brand mark). |

## Motion primitives (`components/motion/`)

| Primitive | How |
| --- | --- |
| Scroll reveal | Add `data-reveal="up|fade|left|right|scale|blur|clip|clip-x|stagger|words"` to any element (server components fine). `RevealObserver` (mounted in `app/layout.tsx`) sets `data-revealed` on first view. Delay: `style={{ "--reveal-delay": "120ms" }}`. `stagger` animates direct children; give each child `style={{ "--stagger-index": i }}` (step via `--stagger-step`). `clip`/`clip-x` wipe the element's direct children (never the observed element itself: Chrome's IntersectionObserver honours a target's own clip-path) and settle the inner `img` from a zoom; put it on a sized frame whose child is the media. |
| `SplitText` | Word-by-word masked rise for headlines. `mode="reveal"` (on scroll) or `mode="enter"` (on load, for heroes). Text content stays identical. |
| `ScrollWordReveal` | Statement paragraph whose words light up with scroll progress. |
| `Parallax` | Wrap a `fill` image inside a positioned, sized frame: `<div className="media-frame relative aspect-[4/5]"><Parallax><Image fill …/></Parallax></div>`. |
| `Marquee` | Infinite CSS ticker (pauses on hover/reduced motion). |
| `CountUp` | Number that counts up when first seen; server-renders the final value. |
| `Magnetic` | Desktop-only magnetic pull for a hero CTA. |
| `AmbientVideo` | Muted decorative loop (aria-hidden, lazy, pauses off-screen, poster-only for reduced motion). Never on `/adventures` (its tests count exactly 3 `<video>` elements) and never inside `[data-testid=property-film]`. |
| `LocalTime` | Live San Pedro clock (placeholder until mounted). |
| `ScrollProgress` | Header hairline that fills with page progress. |
| `SmoothScroll` | Lenis inertial wheel scrolling on desktop pointers (`autoRaf: true` is required in Lenis 1.3). Drives the real window scroll (sticky/anchors/IO unaffected). Off for touch, reduced motion and automation (`e2e/smooth-scroll.spec.ts` re-enables it). Halts its glide on any click/keypress so programmatic scrolls win; Shift+wheel passes through to horizontal rails. Add `data-lenis-prevent` only to areas that genuinely scroll on their own. |
| Load entrances | `.enter-up`, `.enter-fade`, `.enter-clip` (CSS keyframes with `--enter-delay`). Use only above the fold. |
| Hover | `.link-underline` (draw-in underline), `.zoom-media` inside a `.group` (slow image zoom), `.arrow-nudge`, `.roll` (rolling label). |

### Motion rules

- Easing: `var(--ease-out-expo)` for entrances, `var(--ease-in-out-quart)` for wipes. Durations 0.5–1.5s. No bounces, no infinite wobble on content.
- Reveal states use only `opacity`, `transform`, `clip-path` and `filter`, and are gated behind `html.js`. Never hide content with `visibility` or `display`, and never block pointer events during a reveal.
- Don't put reveal transforms on elements whose geometry the e2e suite measures at load (hero section, `homepage-intro`, reef film cards, carousel viewports, form cards, sticky gallery bar). Reveal their children or a wrapper instead.
- Don't animate `<header>`; keep page-content section headers as `div`s (the site header is the first `<header>`).
- `prefers-reduced-motion`: CSS resolves every reveal to its final state; JS motion checks `useMotionOk()`.
- Keep motion JS off the critical path: scroll-linked components are small client islands; pages stay server components.

## Anchors

- Every element with an `id` gets `scroll-margin-top: header + 12px + var(--anchor-extra)` (app/globals.css). Don't add `scroll-mt-*` utilities or an `html` scroll-padding; for extra room under a sticky sub-bar, set `[--anchor-extra:4.75rem]` on the target.

## Accessibility and content guardrails

- One visible h1 per page. Headline split spans keep textContent byte-identical.
- Never put `text-shadow` on a `SplitText` headline: each word is a clipped mask box, so the blur renders as rectangles. Use a `filter: drop-shadow(...)` on the heading instead.
- Contrast: body text on sand uses `text-foreground` or `text-muted-foreground`; on reef use white at ≥70% opacity.
- Touch targets ≥44px on mobile.
- Guest quotes stay byte-identical to `lib/testimonial-spotlights.ts` or the guestbook. Never paraphrase or invent attributed quotes.
- Keep every existing `id`, `data-testid`, analytics event and form behavior; see `docs/qa-success-criteria.md` and `e2e/`.
