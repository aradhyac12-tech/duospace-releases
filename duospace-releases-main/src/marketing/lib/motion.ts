/**
 * Marketing-site motion tokens.
 *
 * Deliberately mirrors the app's own CSS motion tokens (--ease-smooth,
 * --ease-spring, --ease-snap in src/index.css) instead of inventing a
 * second motion language. The site should move the way the product moves.
 */

type Bezier = [number, number, number, number];

export const EASE: { smooth: Bezier; spring: Bezier; snap: Bezier } = {
  // --ease-smooth
  smooth: [0.22, 1, 0.36, 1],
  // --ease-spring
  spring: [0.34, 1.56, 0.64, 1],
  // --ease-snap
  snap: [0.16, 1, 0.3, 1],
};

export const DURATION = {
  fast: 0.14,
  med: 0.22,
  slow: 0.38,
  cinematic: 0.9,
  section: 1.4,
};

export const springSoft = {
  type: "spring" as const,
  stiffness: 180,
  damping: 24,
  mass: 0.9,
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.7,
};

/** Standard "reveal upward" used for headline lines, copy, CTA groups. */
export const revealUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.cinematic, ease: EASE.smooth, delay },
  }),
};

/** Viewport config used across scroll-reveal sections. */
export const revealViewport = { once: true, margin: "-15% 0px -15% 0px" };
