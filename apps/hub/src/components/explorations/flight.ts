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
   * circular well — so aligning left edges makes that well travel continuously
   * and doubles the distance to 132px on a real diagonal. It is the shared
   * element in the shared-element transition; the label and the digits are what
   * changes around it.
   */
  const dx = from.left - to.left;
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  // Clamped: a source pill much taller or shorter than the badge would otherwise
  // start the flight as an illegible speck or an overbearing slab.
  const scale = Math.min(1.25, Math.max(0.8, from.height / to.height));

  /*
   * A gentle bow at the midpoint, PERPENDICULAR to the direction of travel.
   *
   * A straight line reads as a slide; the bow is what makes it read as flight.
   * The first version added its offset to x unconditionally, which arcs a
   * vertical path and does nothing at all to a horizontal one — and this path
   * became horizontal the moment the helpline moved to the band's trailing edge
   * and the badge stayed beside the mark, 860px away.
   *
   * A twelfth of the distance and no more. A visible arc on a government page is
   * a decoration; this is a hand-off that happens to be legible.
   */
  const len = Math.hypot(dx, dy) || 1;
  /*
   * The perpendicular is NEGATED so the card arcs OVER the path rather than
   * under it. Both are perpendicular and only one reads as flight: the downward
   * arc sends the card dipping through the hero and back up, which looks like
   * something sagging rather than something travelling.
   */
  const bowX = (dy / len) * (len / 12);
  const bowY = (-dx / len) * (len / 12);

  return ghost.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        opacity: 0.55,
        filter: "blur(2px)",
      },
      {
        transform: `translate(${dx / 2 + bowX}px, ${dy / 2 + bowY}px) scale(${1 + (scale - 1) / 2})`,
        opacity: 1,
        filter: "blur(0.5px)",
        offset: 0.5,
      },
      { transform: "translate(0, 0) scale(1)", opacity: 1, filter: "blur(0)" },
    ],
    { duration: opts.duration, easing: opts.easing, fill: "backwards" },
  );
}
