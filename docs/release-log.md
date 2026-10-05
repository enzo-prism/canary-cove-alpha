# Canary Cove Release Log

This log records production releases that materially change guest-facing behavior. Keep entries concise and evidence-based.

## 2026-10-04 — Official Canary Cove logo across the site

- Commit: see the `main` push that follows `d597ab0` ("Use the official Canary Cove logo…")
- Production: `https://www.canarycove.com`
- The official logo (Figma `3VZQifFoz4F92HnQfNOePV`) replaces the interim sun-over-swells glyph and text wordmark. The 394×351 raster master was traced into clean SVG layers (potrace on soft coverage masks; exact brand colors `#FFEB00` canary, `#6EB53E` glass/lime, gradient glass highlight) with ink and white wordmark variants, plus canary-only and silhouette marks (`public/brand/`).
- Header (taller on desktop, 80→64px, logo 62→50px), mobile menu, and guest pages use the ink lockup; the footer shows the logo in its native white-wordmark form and a faint canary silhouette replaces the serif "Canary Cove" watermark; gallery end/empty states and the homepage ring badge use the canary.
- Favicons rebuilt from the canary alone (legible at 32px); Apple touch icon on reef ink (was a transparent PNG); `/canary-cove-logo.png` (structured-data logo) is now an 800px ink-wordmark render that is visible on white.
- Palette aligned to the logo: canary tokens shifted to the logo's lemon yellow; the logo's lime added as `lime` (live-status dots).

## 2026-10-04 — Scrolling fix, ElevenLabs widget removed, UX bug pass

- Commit: see the `main` push that follows `baeb889` ("Fix scrolling…")
- Production: `https://www.canarycove.com`
- Desktop wheel scrolling was broken: Lenis 1.3 needs `autoRaf: true` (or a manual rAF loop); without it, it swallowed wheel input and the page never moved. Automated runs skip Lenis, so the suite missed it — `e2e/smooth-scroll.spec.ts` now re-enables Lenis and drives real wheel input (verified to fail without the fix).
- Lenis now halts its glide on any click or keypress (programmatic `focus`/`scrollTo` after a flick were being overwritten: hidden form errors, dead "Back to top", gallery filter jumps), passes Shift+wheel to horizontal rails, and no longer skips dropdown panels.
- Android Chrome: the header's 72→60px shrink fought scroll anchoring in an endless jitter loop near the top. The header now gains a matching bottom margin while it shrinks (constant layout footprint) plus 32/8px hysteresis.
- Anchor offsets moved from `html { scroll-padding-top }` to a global `[id] { scroll-margin-top }` (header + 12px + `--anchor-extra`): the page-wide padding made focusing header buttons (menu close, Shift+Tab) scroll the page up ~430px. Duplicate per-section `scroll-mt-*` offsets removed.
- Removed the ElevenLabs concierge widget site-wide (component, embed script, CSS hooks, privacy-policy mention, e2e assertions).
- Other fixes: full-screen phone search sheet (no resizing under the keyboard) with a touch Cancel on tablets; dialogs restore focus without scrolling; booking success returns to step 1 in view; review-note dialog scrolls its body so close stays visible; 16px reviews year select (no iOS zoom); 44px touch targets for footer links, nav chevrons and gallery dots on touch screens; `/adventures` dive-log rail sticks again (`overflow-clip`); `/experiences` week filmstrip only pins when it fits; mosaic tiles clickable during their reveal; homepage day timeline no longer releases mid-slide; "amenities" now finds `/stay#amenities`; balanced card titles; 13px form helpers.

## 2026-10-04 — Complete design + UX overhaul ("Sand, reef, and canary") with a motion system

- Commit: `0e1df4f` (overhaul) plus a follow-up that swaps the split-headline `text-shadow` for a `drop-shadow` filter (per-word mask boxes were clipping the blur into visible rectangles)
- Production: `https://www.canarycove.com`
- Vercel: `Ready` for `v0-canary-cove-navbar-structure` (`dpl_26j6X5AnsC28zNhVq33KSDMi2y6Y`), aliased to `www.canarycove.com` and `canarycove.com`, auto-deployed from the `main` push
- New design system (`docs/design-system.md`): warm sand / reef ink / lagoon / canary palette, Instrument Serif display type over SF Pro, arched and parallax photography, dark reef bands, rolling-label CTAs (`CtaLink`), `PageHero` and `SectionHeading` building blocks.
- Motion system (`components/motion/`): one IntersectionObserver for `data-reveal` scroll reveals (gated behind `html.js`, fully resolved under reduced motion and without JS), word-rise headlines (`SplitText`), scroll-lit statements, parallax media, marquees, count-ups, magnetic hero CTA, Lenis inertial wheel scrolling on desktop pointers, header scroll-progress line, and a 620 KB seamless manta ambient loop behind the homepage diving film.
- Global chrome: solid sand header with canary active underline, mega-dropdowns with crossfading photo previews, full-screen serif mobile menu, live San Pedro clock; dark reef footer with giant wordmark (booking band only on pages without their own closing CTA). Header and footer now sit outside `<main>` so the skip link skips the chrome.
- Homepage rebuilt: Ken Burns hero with a brighter lead photo, scroll-lit intro + count-up stats + marquee, redesigned estate carousel, pinned horizontal "A day at the cove" timeline, full-bleed "Below the surface" film band, editorial testimonials, drawn process route, plan-your-stay index.
- Every public page redesigned (stay, rates, book, contact, experiences, dining, adventures, gallery, reviews, getting-here, privacy, terms, guest access) with page-specific motion moments (e.g. rates month strip + season ledger, getting-here scroll-drawn route map, stay pinned outdoor filmstrip, dining meal timeline, adventures dive log, reviews spotlight + timeline).
- Contracts preserved: all testids, anchors, analytics events, form behavior/validation, Formspree flow, availability calendar, verbatim guest quotes, reef-film rules. Several anchors that redirects and search already pointed at (e.g. `/dining#private-chef`, `/adventures#fishing`, `/book#comfort-confidence`) now exist.
- Verified live: all 13 public routes plus sitemap/robots/llms return `200`; apex 307-redirects to www; `/stay/main-house` 307s to the microsite; live HTML carries the new hero, timeline and film-band markup; the ambient loop serves `video/mp4` with `206` range responses.
- Release gate before push: typecheck, lint, 128 unit tests, production build, and 396/396 Playwright tests across Chromium, Firefox and WebKit (12 designed skips). Chromium darwin visual baselines regenerated; linux baselines still need a refresh from a Linux runner.
- Tests: spacing spec now checks section padding tokens (reveal transforms made descendant-box measurement unstable) and accepts a side-by-side hero subhead/CTA row; visual baselines regenerated for the new design. `PLAYWRIGHT_BASE_URL` lets the suite target an already-running server.

## 2026-09-17 — Search upgrade, /reviews and /dining redesigns, verbatim guest quotes

- Commit: `cd3d982ee711fd46ddd4556e8cf406eb573c24c8`
- Production: `https://www.canarycove.com`
- Vercel: `Ready` for `v0-canary-cove-navbar-structure` (`dpl_3o3YBh7JXkhdANzkqxS7ip3s4oNX`), auto-deployed from the `main` push
- Search: rescore-only intent expansion with word-boundary triggers, 4-per-group / 12-total result caps, instant answers, recent searches, and match highlighting; short queries require a literal substring.
- `/reviews` redesigned as an editorial ledger: spotlight arc, theme filters (OR matching) with typed search override (AND matching), per-year archive with `#year-<YYYY>` anchors, note dialog with opener focus restore, and clear anchor offsets.
- `/dining` redesigned as a ledger: dining-basics glance, table matrix, service ledger, grouped galleries (21 real registry photos), and genuine guest notes; dead `lib/emoji.ts` removed.
- Integrity: every attributed guest quote is now byte-identical to `lib/testimonial-spotlights.ts` or the guestbook — fixed paraphrased quotes on `/rates`, `/experiences`, `/adventures`, plus invented quotes on `/reviews` and `/dining`. QA criteria and route map now pin the verbatim rule.
- Verified live: 8/8 key routes return `200`; live HTML contains the new anchors, genuine quotes, and `dining-basic` markers with zero fabricated strings; live Cmd+K search returns the Wi-Fi instant answer; production screenshots confirm reviews/dining desktop and dining mobile with no overflow.
- E2E note: `typecheck`, `lint`, unit (113), `build`, and e2e Chromium/WebKit pass except `private-guest-access` and all-Firefox failures, both proven identical on the clean base tree (environmental: foreign process on :3000, broken Firefox runtime) and untouched by this batch.

## 2026-09-17 — Stay page redesign as an editorial ledger

- Commit: `309dd669f8aa1c442347a8847d97a8d12d85f361`
- Production: `https://www.canarycove.com/stay`
- Vercel: `Ready` for `v0-canary-cove-navbar-structure` (`dpl_Fyii33yZyW6xhrWyC1GtUXD9FF6r`), auto-deployed from the `main` push
- Hero leads with H1 “One estate. Your group. Nothing shared.”, stay-glance ledger, Check-dates CTA, and anchor index above the photo carousel; villa-vs-Main-House disambiguation in the lede.
- Mini gallery keeps its carousel contract and snapshot slot; arrows inset at 44px, dot focus rings, labeled region, tap-to-lightbox with captions.
- Villa/outdoor galleries keep all 18 photos and lightbox behavior with left-aligned headers and de-carded secondary figures.
- Amenities rewritten as a ledger with sticky chef rail plus a kitchen filmstrip viewer; guest experience as a numbered ledger with the 2024 testimonial leading.
- Main House band preserves facts, microsite link, and `stay_hero` analytics; planning-split close; highlights section retired with legacy anchors re-homed.
- Verified live: key routes return `200`; live HTML contains all stay anchors, Main House facts, gallery testid, 2024 testimonial, and analytics events; production screenshots confirm desktop and mobile hero.

## 2026-09-17 — Rates page redesign as an editorial price ledger

- Commit: `43145a1d15209fa413d7a45dfaedbe3bbf38a778`
- Production: `https://www.canarycove.com/rates`
- Vercel: `Ready` for `v0-canary-cove-navbar-structure` (`dpl_DRp5cTvkZ66rvDtoMeT2i1sLk3eW`), auto-deployed from the `main` push
- Ledger hero (from-price glance list, one Check-dates CTA, on-page anchor index) over villa pool photography; H1 “One estate. One group. Priced by the night.”
- What’s-included ledger with sticky chef column; villa seasons as a real comparison table with /night prices and compressed month ranges.
- Main House as a gated repeat-guest panel (terms block, price rail, existing request CTA/analytics); all repeat-guest terms and prices preserved.
- Services browser rebuilt as per-group tables with search, group index, live match counts, and the nitrox note; fragment anchors land clear of the header via `overflow-clip` (Chromium ignores scroll-margin inside `overflow:hidden` scroll containers).
- Nav Rates caption now “Seasons, suites, and inclusions”; nitrox trigger meets the 24px target minimum; skip link moves focus into `main`.
- Verified live: all key routes return `200`; apex 307-redirects to www; live HTML contains all rate anchors, Main House terms, prices, and analytics events; production screenshots confirm the `#main-house-accommodations` landing and mobile hero.

## 2026-09-17 — Nav redesign, slider fixes, video player, email removal

- Commit: `aa082153d105f916bda7f712cfd0be68ae325e7b`
- Production: `https://www.canarycove.com`
- Vercel: `Ready` for `v0-canary-cove-navbar-structure` (`dpl_GcCMzewURR76mrT18qry3S1gt5kw`), auto-deployed from the `main` push
- Header is now a solid bar with scroll shrink, plain text links with an underlined active section, Stay/Explore split-trigger dropdowns (hover intent, click, keyboard), a full-screen mobile overlay menu with sticky Book footer, a search pill with ⌘K hint, and a single Book CTA.
- `/about` renamed to `/reviews` (permanent 308 redirect; live verified). Reviews, Getting Here, and Contact are plain nav links; Rates lives under Stay.
- Testimonial slider: bottom-anchored scrim (white-text contrast p10 1.7→5.9+ across slides/viewports), unclamped quotes, all-position dots, no dead strip, faster transitions. Same fixes in model, mini, and shared carousels.
- Custom video player on reef encounter and property films (shared component, keyboard model, poster/replay states).
- Email-listing feature removed site-wide; historical `email_capture` rows stay separate in ops docs.
- Buttons gained subtle press feedback; ScrollReset only fires on route changes (fixes a mount race that yanked WebKit scroll).
- Verified live: `/`, `/reviews`, `/book`, `/rates`, `/experiences`, `/stay`, `/gallery` return `200`; `/about` 308-redirects to `/reviews`; homepage HTML includes `desktop-nav-stay` and no `email-capture-card`.

## 2026-08-30 — Main House stay card and estate space deep links

- Commit: `ba24cd6e98b8a6d6c655c4172958405d5e42e22e`
- Production: `https://www.canarycove.com`
- Vercel: GitHub status `Ready` for `v0-canary-cove-navbar-structure` (`dpl_3UnVMz5BN2TQqUNpbxpijnYGdetQ`)
- PR: https://github.com/enzo-prism/canary-cove-alpha/pull/25
- Stay presents Main House as a designed returning-guest card (`Main House · 5 suites`) that links `/stay/main-house` (307 to `https://mainhouse.canarycove.com`). The stray underlined microsite link is gone.
- Homepage King Suites CTA lands on `/stay#inside-the-villa`. `/stay/suites` redirects there.
- Homepage Private Docks CTA lands on `/experiences#on-the-water`, which now exists on the Included card.
- The homepage estate carousel remains the 3-suite villa product. Main House is not a carousel “space.”
- Companion microsite: `enzo-prism/main-house-CC` PR https://github.com/enzo-prism/main-house-CC/pull/3 squash-merged as `43faed23f0720f7fcea2947e5597f9b84b285340`. Vercel `canary-cove-main-house` production `Ready` (`dpl_5Wv2N4MX2K4kK4di4hPrSrusRgNj`). Live `https://mainhouse.canarycove.com` now uses current Cove nav (Stay, Rates, Explore, Reviews, Getting Here), covers the hero photo, wraps the H1 as Canary Cove / Main House, stacks returning-guest copy above the photo on mobile, and includes a skip link.

## 2026-08-30 — Design-bug pass: nav, header, Getting Here, testimonials

- Commit: `85d467e41ab20072e6d9fe68cf765e1ccf0e9303`
- Production: `https://www.canarycove.com`
- Vercel: GitHub status to be confirmed `Ready` for `v0-canary-cove-navbar-structure` after this `main` push
- PR: https://github.com/enzo-prism/canary-cove-alpha/pull/24
- Desktop Explore now uses the same stacked icon-above-label pill as Stay/Rates/Reviews/Getting Here, so the nav bar no longer has a taller middle item.
- Immersive headers on `/` and `/experiences` invert the brand mark and sit it on a frosted chip so the wordmark stays readable over photography.
- Experiences hero tucks under the sticky header with `--site-header-height` instead of hardcoded pixel offsets.
- Getting Here step numbers are positioned on each `relative` list item, so the four badges no longer stack on top of each other.
- Homepage testimonial quotes clamp inside the photo cards; interior testimonial grids pin author names to the bottom of equal-height cards.
- Dining “How dining works” items use the same visible bullet treatment as stay amenities.
- Footer copyright uses `©`.
- Added `e2e/design-layout.spec.ts` to lock these layout regressions.

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
