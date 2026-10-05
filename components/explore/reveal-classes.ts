/**
 * Descendant reveal states for the Explore pages (/experiences, /dining,
 * /adventures). A wrapper opts in with `data-reveal="group"`: the shared
 * RevealObserver marks it `data-revealed` on first view, and these classes
 * play on its descendants. `group` has no hidden state of its own, so the
 * wrapper's geometry never moves. States are gated behind `html.js` (no-JS
 * and crawlers see everything) and `motion-safe` (reduced motion shows the
 * final state). Stagger with style={{ transitionDelay }}.
 */

// Class strings stay literal so Tailwind can find them when scanning.

/** Media wipes up from the bottom edge; the inner image settles from a zoom. */
export const CLIP_UP = [
  "[clip-path:inset(0_0_0_0)] motion-safe:transition-[clip-path] motion-safe:duration-[1400ms] motion-safe:ease-[var(--ease-in-out-quart)]",
  "motion-safe:[html.js_[data-reveal]:not([data-revealed])_&]:[clip-path:inset(100%_0_0_0)]",
].join(" ")

/** Media wipes in from the left edge. */
export const CLIP_RIGHT = [
  "[clip-path:inset(0_0_0_0)] motion-safe:transition-[clip-path] motion-safe:duration-[1400ms] motion-safe:ease-[var(--ease-in-out-quart)]",
  "motion-safe:[html.js_[data-reveal]:not([data-revealed])_&]:[clip-path:inset(0_100%_0_0)]",
].join(" ")

/** Text or small blocks fade and rise. */
export const RISE = [
  "motion-safe:transition-[opacity,translate] motion-safe:duration-[1100ms] motion-safe:ease-[var(--ease-out-expo)]",
  "motion-safe:[html.js_[data-reveal]:not([data-revealed])_&]:opacity-0 motion-safe:[html.js_[data-reveal]:not([data-revealed])_&]:translate-y-6",
].join(" ")

/** Opacity only (safe on elements whose geometry is measured). */
export const FADE = [
  "motion-safe:transition-opacity motion-safe:duration-[1200ms] motion-safe:ease-[var(--ease-out-expo)]",
  "motion-safe:[html.js_[data-reveal]:not([data-revealed])_&]:opacity-0",
].join(" ")

/** Hairline that draws from the left. */
export const DRAW_X = [
  "origin-left motion-safe:transition-[scale] motion-safe:duration-[1400ms] motion-safe:ease-[var(--ease-in-out-quart)]",
  "motion-safe:[html.js_[data-reveal]:not([data-revealed])_&]:scale-x-0",
].join(" ")
