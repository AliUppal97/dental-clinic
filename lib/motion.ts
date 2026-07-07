/** Shared Framer Motion tokens — fade-up scroll reveal (24px, 450ms, ease-out). */
export const SCROLL_REVEAL_Y = 24;
export const SCROLL_REVEAL_DURATION = 0.45;
export const SCROLL_REVEAL_EASE = "easeOut" as const;
export const SCROLL_REVEAL_VIEWPORT = { once: true, margin: "-40px" } as const;
export const SCROLL_REVEAL_STAGGER_S = 0.12;

/** Page-load wrapper fade — capped at 200ms so content stays readable. */
export const PAGE_FADE_DURATION = 0.2;

export function getScrollRevealInitial(reduced: boolean) {
  return reduced ? false : { y: SCROLL_REVEAL_Y };
}

export function getScrollRevealTransition(reduced: boolean, delay = 0) {
  return reduced
    ? { duration: 0 }
    : {
        duration: SCROLL_REVEAL_DURATION,
        ease: SCROLL_REVEAL_EASE,
        delay,
      };
}

/** Scroll-triggered fade-up — spread onto `motion.*` elements. */
export function scrollRevealProps(reduced: boolean, delay = 0) {
  return {
    initial: getScrollRevealInitial(reduced),
    whileInView: { opacity: 1, y: 0 },
    viewport: SCROLL_REVEAL_VIEWPORT,
    transition: getScrollRevealTransition(reduced, delay),
  };
}

/**
 * Page-load entrance — Hero text/CTAs only.
 * Translates without hiding opacity so above-the-fold copy stays readable.
 */
export function pageEnterProps(reduced: boolean, delay = 0) {
  return {
    initial: reduced ? false : { y: SCROLL_REVEAL_Y },
    animate: { y: 0 },
    transition: getScrollRevealTransition(reduced, delay),
  };
}

/** Whole-app page fade-in wrapper (layout) — translate only so content stays visible without JS. */
export function pageFadeInProps(reduced: boolean) {
  return {
    initial: reduced ? false : { y: 8 },
    animate: { y: 0 },
    transition: reduced
      ? { duration: 0 }
      : { duration: PAGE_FADE_DURATION, ease: SCROLL_REVEAL_EASE },
  };
}
