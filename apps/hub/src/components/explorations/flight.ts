/**
 * A shared-element flight, in about sixty lines and no dependency.
 *
 * ── WHY THIS IS NOT `motion` ────────────────────────────────────────────────
 *
 * Motion (formerly Framer Motion) is not installed on this estate, and its
 * `layout` prop is the obvious tool for a shared-element transition. It was
 * considered and rejected for THIS transition, on two grounds:
 *
 *   · **Weight.** ~35 KB gzipped, on every page that imports it, to move one
 *     badge once per session. A library earns its place by carrying many
 *     interactions, not one.
 *   · **The main thread.** Motion's shorthand transforms animate through
 *     `requestAnimationFrame`, so they compete with hydration and image decode
 *     — which on this page happen at exactly the moment a reader is most likely
 *     to dismiss the band. The Web Animations API composites off the main
 *     thread for `transform` and `opacity`, so the flight stays smooth while the
 *     rest of the page is still settling.
 *
 * If a second and third shared-element transition arrive, revisit this. One does
 * not justify the dependency.
 *
 * ── THE GEOMETRY, AND THE TRAP IN IT ────────────────────────────────────────
 *
 * The band collapses at the same time as the badge flies, so the badge's LANDING
 * POSITION IS MOVING while the flight is in the air. Measuring the badge when
 * the flight starts gives a target that is `bandHeight` too low, and the badge
 * arrives, then jumps.
 *
 * The badge sits below the band in normal flow, so when the band collapses to
 * zero the badge's box rises by exactly the band's height — a number we know
 * before the collapse begins. So the target is computed, not measured:
 *
 *     landing = badge.getBoundingClientRect() shifted up by bandHeight
 *
 * The ghost is `position: fixed`, so reflow underneath it cannot move it, and
 * both animations take the same duration and easing — meaning the ghost and the
 * real badge are congruent at the exact instant the ghost is removed.
 */

/** A rectangle in viewport coordinates. */
export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function rectOf(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

/** Reads a `--sa-motion-*` duration off the element, in milliseconds. */
export function motionMs(el: Element, token: string, fallback: number): number {
  const raw = getComputedStyle(el).getPropertyValue(token).trim();
  if (!raw) return fallback;
  const n = Number.parseFloat(raw);
  if (Number.isNaN(n)) return fallback;
  return raw.endsWith("ms") ? n : n * 1000;
}

export function motionEasing(el: Element, token: string, fallback: string): string {
  return getComputedStyle(el).getPropertyValue(token).trim() || fallback;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Animate `ghost` from `from` to `to`, both in viewport coordinates.
 *
 * The ghost must already be laid out AT `to` — the animation is transform-only,
 * which is what keeps it off the main thread. Scale is UNIFORM and taken from
 * the height ratio: scaling x and y independently to match two differently
 * proportioned pills stretches the digits, and a stretched telephone number is
 * the one thing this transition must not do.
 *
 * A 2px blur rides the first half. The departing pill and the arriving badge are
 * not the same object — different width, different label — and blur bridges the
 * gap the eye would otherwise read as two things swapping.
 */
export function flyGhost(
  ghost: HTMLElement,
  from: Rect,
  to: Rect,
  opts: { duration: number; easing: string },
): Animation {
  /*
   * ALIGNED ON THE LEADING EDGE, NOT THE CENTRE — measured, not preferred.
   *
   * The first version centred the two boxes. The band's pill is 297px wide and
   * the hero's badge is 109px, so centring put the ghost's start at x=208 when
   * the pill's own left edge was at x=109: a 66px hop, most of it vertical, that
   * read as a twitch rather than a hand-off.
   *
   * Both pills carry the same thing at their leading edge — a phone glyph in a
   * circular well — so aligning left edges makes that well travel continuously.
   */
  const dx = from.left - to.left;
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  const scale = Math.min(1.25, Math.max(0.8, from.height / to.height));
  const len = Math.hypot(dx, dy) || 1;

  /*
   * ── DURATION SCALES WITH DISTANCE ───────────────────────────────────────
   *
   * A fixed 400ms is two different animations depending on where the card
   * starts. At the 128px hop it was leisurely; at the 860px crossing the card
   * moved at 2,150 px/s, which is a flick rather than a flight — fast enough
   * that the eye tracks a blur and never reads it as one object arriving.
   *
   * So the token sets the base and the distance adds to it, clamped either side
   * so a very short flight never crawls and a full-width one never drags. 860px
   * resolves to about 615ms; 130px to about 430ms.
   */
  const ms = Math.round(
    Math.min(opts.duration * 1.6, Math.max(opts.duration * 0.8, opts.duration + len * 0.25)),
  );

  /*
   * A gentle bow at the midpoint, PERPENDICULAR to the direction of travel and
   * negated so the card arcs OVER the path rather than sagging under it.
   */
  const bowX = (dy / len) * (len / 12);
  const bowY = (-dx / len) * (len / 12);

  /*
   * ── BLUR PEAKS IN THE MIDDLE, WHERE THE SPEED IS ────────────────────────
   *
   * It used to be heaviest at the START and clear by the midpoint, which is
   * backwards: with an ease-in-out curve the card is at its SLOWEST on frame one
   * and its fastest halfway across. Blurring the slow part and sharpening the
   * fast part is the opposite of motion blur, and it is why the flight read as
   * "a blurry thing appears, then a sharp thing streaks".
   *
   * Peak 3px at the midpoint, tapering to nothing at both ends. A little at the
   * start still helps the hand-off, because the departing pill and the arriving
   * card are not the same shape.
   *
   * ── AND THE PER-KEYFRAME EASING ─────────────────────────────────────────
   *
   * Opacity resolves on its own curve well before the position does, so the card
   * is fully solid for the second half of its journey and the eye has something
   * definite to follow into the landing. One easing for everything made the card
   * still be fading in while it was already settling.
   */
  return ghost.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        opacity: 0.7,
        filter: "blur(1.5px)",
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      {
        transform: `translate(${dx / 2 + bowX}px, ${dy / 2 + bowY}px) scale(${1 + (scale - 1) / 2})`,
        opacity: 1,
        filter: "blur(3px)",
        offset: 0.5,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      { transform: "translate(0, 0) scale(1)", opacity: 1, filter: "blur(0)" },
    ],
    { duration: ms, easing: "linear", fill: "backwards" },
  );
}
