/**
 * The portal phone masthead's gesture state — the one decision behind "hide on the
 * way down, come back on the way up". Kept free of React and the DOM so every case
 * it has to get right is a test, not a scroll session.
 *
 *   "top"    the page is within the masthead's own height: every row sits where the
 *            page puts it, nothing is transformed
 *   "hidden" the reader is scrolling DOWN past it: the whole masthead is out of the way
 *   "shown"  the reader scrolled UP, or is using the masthead: the accessibility bar and
 *            the working bar are back at the top of the viewport
 *
 * See `SiteHeader`'s `service` prop and accessibility-entry-point.md rule 4b.
 */

export type HeaderReveal = "top" | "hidden" | "shown";

/**
 * Accumulated travel, in CSS px, before the direction counts. A finger resting on the
 * glass, a momentum tail and a sub-pixel scroll-anchoring nudge all stay under it.
 */
export const REVEAL_THRESHOLD = 12;

export interface RevealInput {
  /** `window.scrollY` now. Negative on an iOS rubber-band overscroll. */
  y: number;
  /** The scroll position the current state was last decided at. */
  lastY: number;
  /** What leaves before the working bar pins — accessibility bar + identity row. 0 = not measured yet. */
  peel: number;
  /** The reader is using the masthead: focus is inside it, or a disclosure it owns is open. */
  holding: boolean;
  /** The state now. */
  current: HeaderReveal;
}

export interface RevealResult {
  reveal: HeaderReveal;
  /** Where the next decision measures travel from. */
  lastY: number;
}

export function nextReveal({ y, lastY, peel, holding, current }: RevealInput): RevealResult {
  // Unmeasured, or still inside the masthead's own height: the page decides, not us.
  if (peel <= 0 || y < peel) return { reveal: "top", lastY: y };
  // Never hide a masthead that is being used.
  if (holding) return { reveal: "shown", lastY: y };
  const dy = y - lastY;
  // Under the threshold nothing changes, and the travel keeps ACCUMULATING from the
  // last decision rather than resetting — so a slow, steady scroll still turns it.
  if (Math.abs(dy) < REVEAL_THRESHOLD) return { reveal: current, lastY };
  return { reveal: dy > 0 ? "hidden" : "shown", lastY: y };
}
