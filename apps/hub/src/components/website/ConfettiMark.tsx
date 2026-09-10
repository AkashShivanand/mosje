import * as React from "react";

/**
 * THE OBSERVANCE'S MARK — a party popper that keeps going, quietly.
 *
 * ── WHY IT IS NOT A MATERIAL SYMBOL ─────────────────────────────────────────
 *
 * `celebration` is a font glyph. A glyph is one shape, so the only things that
 * can move are the whole of it and nothing else — which is what the burst on
 * arrival already does. A confetti mark that keeps drifting needs its pieces to
 * move independently of its cone, and that means the parts have to exist as
 * parts. So this is drawn, not typeset.
 *
 * It is drawn to LOOK typeset: a 40px box, 2.4px strokes with round caps and
 * joins, no fills, `currentColor` — which is Material Symbols Rounded at weight
 * 300 rendered by hand. Set it beside `volunteer_activism` on the other panel
 * and the two read as the same family, because they are the same construction.
 *
 * ── WHAT MOVES, AND HOW LITTLE ──────────────────────────────────────────────
 *
 * The cone never moves. It is the anchor, and a mark whose every part drifts
 * reads as a loading state rather than as an icon.
 *
 * Three RAYS at the cone's mouth breathe outward by about a pixel and back, on
 * a 2.8s cycle. Three BITS further out float a few pixels and rotate a little,
 * on a 3.6s cycle. Both are staggered so nothing pulses in unison — even timing
 * reads as a mechanism, and this is meant to read as paper in the air.
 *
 * Amplitudes are deliberately below the threshold where the eye tracks the
 * movement: at a glance the mark is still, and it is only when a reader rests
 * on it that they notice it is alive. That is the whole brief — a band above a
 * government page's title cannot have something waving at it.
 *
 * ── IT STOPS WHEN THE READER SAYS SO ────────────────────────────────────────
 *
 * `loop` is false and every animation is `paused`, not removed: a paused
 * animation holds its current frame, so pressing pause leaves the confetti
 * exactly where it was rather than snapping it home. WCAG 2.2 §2.2.2 requires a
 * mechanism to stop anything that moves automatically for more than five
 * seconds beside other content, and this loops forever — so the band renders
 * its pause control whenever this mark is on screen, even where there is only
 * one announcement and nothing to page. Under `prefers-reduced-motion` nothing
 * animates at all.
 */
export function ConfettiMark({
  /** The one-off pop and spray, on the panel's FIRST appearance only. */
  burst,
  /** The ambient drift. Paused rather than removed when false. */
  loop,
}: {
  burst: boolean;
  loop: boolean;
}): React.JSX.Element {
  return (
    <svg
      className="cfti"
      viewBox="0 0 40 40"
      width="40"
      height="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-burst={burst || undefined}
      data-loop={loop || undefined}
      aria-hidden="true"
      focusable="false"
    >
      {/* The cone. Still, always — it is what makes the drifting parts read as
          confetti rather than as an icon coming apart. */}
      <path className="cfti__cone" d="M7.6 32.4 13.4 18.2 21.8 26.6Z" />

      <g className="cfti__rays">
        <path className="cfti__ray" data-n="0" d="M18.9 15.6V11.4" />
        <path className="cfti__ray" data-n="1" d="M23.8 17.2 26.9 14.1" />
        <path className="cfti__ray" data-n="2" d="M25.4 22.4h4.2" />
      </g>

      <g className="cfti__bits">
        <circle className="cfti__bit" data-n="0" cx="32.8" cy="9.8" r="1.6" strokeWidth="0" fill="currentColor" />
        <path className="cfti__bit" data-n="1" d="M30.6 30.1 33.1 27.6" />
        <path className="cfti__bit" data-n="2" d="M35.4 16.4v2.6" />
      </g>
    </svg>
  );
}
