"use client";

/**
 * SAMAVESH Design System — FlaskIcon (demo chrome)
 *
 * The round-bottom laboratory flask that marks `DemoDock` — the estate's
 * "this is a demo tool, not the product" glyph. Drawn here rather than
 * pulled from the icon font, and that deserves an explanation, because
 * `CLAUDE.md` is clear that Material Symbols Rounded is the SAMAVESH icon
 * system and bespoke SVG icons are not how we add to it.
 *
 * This is not an addition to the icon system. It is one piece of demo-only
 * chrome that has to do something a font glyph structurally cannot: **move
 * its own insides**. The flask reacts to hover, press and open state by
 * raising its liquid, releasing bubbles and tipping — behaviour that needs
 * addressable parts (a liquid path, three bubbles, a clip region), and a
 * glyph is a single indivisible shape. Nothing else in the estate gets a
 * hand-drawn icon on these grounds, and `<Icon>` remains the answer
 * everywhere an icon is just an icon.
 *
 * GEOMETRY. Original, drawn to the Material Symbols Rounded idiom rather
 * than to any lucide/feather default, so it sits beside the rest of the
 * estate's chrome instead of importing a second icon dialect:
 *
 * - 24x24 viewBox, `currentColor` stroke, round caps and joins.
 * - A 5.6r bulb centred at (12, 14.9); a straight neck at x = 10.3 and
 *   x = 13.7 running from the lip down to y = 9.56, which is exactly where
 *   a 1.7-unit horizontal offset meets that circle (sqrt(5.6^2 - 1.7^2) =
 *   5.34, and 14.9 - 5.34 = 9.56). The neck therefore joins the bulb
 *   tangentially with no visible kink — the join is computed, not
 *   eyeballed, and recomputed rather than nudged when the neck width
 *   changed.
 * - The neck is 3.4 units wide against a 11.2-unit bulb, a ratio of 0.30.
 *   It was 0.36 first; rendered at 120px the silhouette read as a lightbulb
 *   rather than as glassware, which no amount of looking at it at 16px
 *   would have revealed.
 * - Stroke width 1.9, which renders at 1.27px once scaled to the FAB's
 *   16px — matched by measurement to the weight of the icon this replaced
 *   (2 at 24, i.e. 1.33px), so the FAB's optical weight is unchanged. No
 *   `non-scaling-stroke`: that would pin the stroke to 1.9 *device* px and
 *   make the icon visibly heavier at 16px than at 24px.
 *
 * MOTION. Every animation is state, never decoration — the flask is inert
 * until something is true of it:
 *
 * | State | What moves | What it says |
 * |---|---|---|
 * | Appear | one damped rock, then still | the tool is here |
 * | Rest | nothing | idle; a FAB that fidgets is noise |
 * | Hover / focus | rocks again, bubbles rise, liquid sloshes | this is interactive |
 * | Press | (the FAB's own squash) | the click landed |
 * | Open | faster bubbles, liquid rises, flask tips | the tool is running |
 *
 * The **rock** is the one borrowed idea here, and it is worth naming its
 * source: Lordicon's `wired-outline-438-flask-round` ships exactly two
 * animation states, `in-oscillate` and `hover-oscillate`, and that pairing
 * — a damped pendulum swing on appear, the same swing again on hover — is
 * a better read for a flask than anything drawn from scratch, because it
 * is what a vessel physically does when you set it down or nudge it.
 *
 * **The motion is the reference; the artwork is not.** Nothing of theirs
 * is in this file. The geometry below is original and computed (see
 * GEOMETRY), and their icon is a licensed Lottie asset that has no business
 * inside a government design system's component library. Copying an idea
 * about timing is not the same act as shipping someone's paths.
 *
 * A rock is also the one rotation the "do not tilt the glass" note below
 * does NOT forbid, and for a specific reason: it is transient and it ends
 * at exactly 0deg. The stroke goes soft mid-swing, where nobody can see it,
 * and every RESTING frame is back on the pixel grid. A held tilt has no
 * such escape, which is why the open state's 6deg lives on the FAB's own
 * wrapper at a size where it survives rasterisation.
 *
 * All of it is switched on from OUTSIDE, through custom properties
 * (`--ds-flask-play`, `--ds-flask-cycle`, `--ds-flask-level`,
 * `--ds-flask-bubbles`) that an ancestor sets — plus the hover rock, which
 * is a plain `:hover` descendant rule because an animation that has to
 * RESTART cannot be driven by a custom property (see flask-icon.css). The icon holds no state and
 * knows nothing about the FAB's markup; `demo-dock.css` maps its own
 * structure onto those four properties. That is what lets the same file
 * serve the FAB and the panel's header badge, which sit in different
 * subtrees and respond to different things.
 *
 * The liquid is `currentColor` at low opacity rather than a colour of its
 * own, so the whole icon re-tones with whatever `color` its container
 * sets — brand primary on the FAB, the same on the panel's badge, and
 * correct in all seven brand modes without a single hardcoded value or a
 * token that only this file uses.
 *
 * `prefers-reduced-motion` stops all of it: the flask still shows its
 * liquid and its filled state, it simply stops moving. See flask-icon.css.
 */

import * as React from "react";
import { cn } from "../utils/cn";

import "./flask-icon.css";

export interface FlaskIconProps {
  /** Rendered size in px, applied to both axes. @default 16 */
  size?: number;
  className?: string;
}

/**
 * FlaskIcon — the animated round-bottom flask used by `DemoDock`.
 *
 * Decorative: it is `aria-hidden`, and the accessible name always comes
 * from the control that contains it (`aria-label` on the FAB, the panel's
 * own `aria-label` for the header badge). Motion is driven entirely by CSS
 * state selectors on an ancestor, so the component itself holds no state
 * and re-renders never interrupt an in-flight animation.
 */
export function FlaskIcon({
  size = 16,
  className,
}: FlaskIconProps): React.JSX.Element {
  // `useId()` yields ":r3:" — legal in an id attribute but not in the URL
  // fragment that `clip-path` resolves through, so strip the colons.
  const clipId = `ds-flask-${React.useId().replace(/:/g, "")}`;

  return (
    <svg
      className={cn("ds-flask", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* The flask's interior — the same outline as the glass below, but
            closed across the lip, so liquid and bubbles are contained by
            the vessel and a bubble can rise into the neck. */}
        <clipPath id={clipId}>
          <path d="M10.3 3.4 V9.56 A5.6 5.6 0 1 0 13.7 9.56 V3.4 Z" />
        </clipPath>
      </defs>

      {/* Two nested wrappers, each carrying one rock, so a single keyframe
          block serves both. The outer runs once on mount (the "appear"
          swing); the inner runs only while an ancestor is hovered or
          focused. An animation cannot be RESTARTED by re-matching the same
          name on the same element, so the alternative was a second,
          identical `@keyframes` — two elements is the smaller lie. Nested
          transforms multiply, so the two compose correctly if a pointer
          arrives mid-entrance. */}
      <g className="ds-flask__body">
      <g className="ds-flask__rock">
      <g clipPath={`url(#${clipId})`}>
        {/* Liquid. Four wavelengths (48 units) spanning x = -12 to 36, so
            the wave still covers the whole 0–24 viewBox at the far end of
            its travel. The slosh translates one full wavelength (-12) to
            loop seamlessly, and a path merely "wider than the viewBox" is
            NOT enough: an earlier version spanned -12 to 24, which covers
            the flask at rest and leaves bare glass down the right side of
            the bulb once the animation is a fraction of a cycle in. It was
            invisible in every static frame — only the paused state is ever
            at translate 0 — so the span has to be reasoned about, not
            eyeballed. */}
        <g className="ds-flask__liquid-group">
          <path
            className="ds-flask__liquid"
            fill="currentColor"
            d="M-12 13 q3 -1.1 6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 t6 0 V26 H-12 Z"
          />
        </g>

        {/* Grouped so the set can fade out as one when the trigger goes
            away. Pausing the rise on its own would freeze a bubble
            mid-flight; fading the group while it freezes reads as the
            bubbles dissolving instead. */}
        <g className="ds-flask__bubbles">
          <circle
            className="ds-flask__bubble ds-flask__bubble--1"
            cx="10.5"
            cy="18.4"
            r="0.78"
            fill="currentColor"
          />
          <circle
            className="ds-flask__bubble ds-flask__bubble--2"
            cx="13.3"
            cy="19"
            r="0.55"
            fill="currentColor"
          />
          <circle
            className="ds-flask__bubble ds-flask__bubble--3"
            cx="11.9"
            cy="17.8"
            r="0.62"
            fill="currentColor"
          />
        </g>
      </g>

      {/* Glass, drawn last so it sits over the liquid's edge. */}
      <g
        className="ds-flask__glass"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.8 3.4 H15.2" />
        <path d="M10.3 3.4 V9.56 A5.6 5.6 0 1 0 13.7 9.56 V3.4" />
      </g>
      </g>
      </g>
    </svg>
  );
}
