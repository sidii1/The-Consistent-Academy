/**
 * Device / motion capability helpers.
 *
 * Evaluated once at module load (this is a client-only SPA), so they are
 * cheap to read inside render. Desktop (fine pointer + hover, ≥768px) always
 * gets `LITE_MOTION === false`, which means every helper below returns the
 * original props untouched — the desktop experience is unchanged.
 */
import type { MotionProps } from "framer-motion";

const matches = (query: string): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(query).matches;

/** Primary input is touch (no hover capability or a coarse pointer). */
export const IS_TOUCH = matches("(hover: none), (pointer: coarse)");

/** Phone-sized viewport (below Tailwind's `md` breakpoint). */
export const IS_SMALL_SCREEN = matches("(max-width: 767px)");

/** User asked the OS to reduce motion. */
export const PREFERS_REDUCED_MOTION = matches("(prefers-reduced-motion: reduce)");

/**
 * When true, decorative entrance animations are simplified to a short
 * opacity fade (or skipped entirely) to keep mobile scrolling smooth.
 */
export const LITE_MOTION = IS_TOUCH || IS_SMALL_SCREEN || PREFERS_REDUCED_MOTION;

type RevealProps = Pick<MotionProps, "initial" | "whileInView" | "viewport" | "transition">;

/**
 * Wraps the scroll-reveal props of a motion element.
 *
 * - Desktop: returns `props` exactly as given.
 * - Lite motion, mode "fade" (default): a quick 0.3s opacity fade with no
 *   translate/scale and no stagger delay, triggered as soon as it enters.
 * - Lite motion, mode "none": renders immediately in its final state. Use for
 *   large wrappers whose children already animate, to avoid nested fades.
 */
export function reveal<T extends RevealProps>(props: T, mode: "fade" | "none" = "fade"): T {
  if (!LITE_MOTION) return props;
  if (mode === "none") {
    return { ...props, initial: false, whileInView: undefined, viewport: undefined, transition: undefined };
  }
  return {
    ...props,
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.05 },
    transition: { duration: 0.3, ease: "easeOut" },
  };
}
