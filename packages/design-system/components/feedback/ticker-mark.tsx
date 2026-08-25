import * as React from "react";

export interface TickerMarkProps {
  /** Pixel size of the square mark. @default 28 */
  size?: number;
  className?: string;
}

/**
 * TickerMark — the broadcasting megaphone that names the Ticker.
 *
 * ── WHY THIS IS DRAWN AND NOT `<Icon name="campaign">` ────────────────────
 * The estate's rule is Material Symbols, and this is the documented exception
 * the Iconography page already keeps a section for: a BESPOKE MARK. Two reasons
 * a font glyph cannot meet:
 *
 *   1. **It animates in parts.** The arcs pulse outward on a stagger; a glyph is
 *      one indivisible shape with no handles to move independently.
 *   2. **It answers to the strip's state.** They stop when the citizen pauses
 *      the Ticker, so the mark reads out what the strip is doing rather than
 *      broadcasting over a stopped list.
 *
 * ── THE STROKE IS MEASURED OFF THE FAMILY, NOT CHOSEN ─────────────────────
 * 1.4, and it is the one number here that is not a drawing decision. Rendering
 * Material Symbols Rounded `campaign` at wght 300 to a canvas and sampling the
 * ink gives runs of 1.2–1.5 on the 24 grid. This mark shipped at **1.75** —
 * about 25% heavier than every icon beside it, which is what made it read as
 * belonging to a different set.
 *
 * **If the icon family's weight ever moves, this is the number to move with
 * it.** Round caps and joins throughout, as the Rounded cut has.
 *
 * ── THE JOINS ARE CLOSED ──────────────────────────────────────────────────
 * The first cut had two broken edges. The cone met the box at a different y
 * than the box's own top, leaving a visible step in the outline; and the handle
 * was a hooked grip whose second arm stopped in mid-air, so it read as a line
 * that had failed to finish rather than a handle. The cone now lands exactly on
 * the box's edges at x=5.8, and the handle is a single closed stroke.
 *
 * ── WHAT IT REPLACED ──────────────────────────────────────────────────────
 * Before the mark was drawn at all it was a 32px WHITE ROUNDED TILE holding a
 * small blue glyph. On the plinth's navy that read as a sticker pasted onto the
 * bar, and its `border-neutral-subtle` hairline — drawn for a white tile on a
 * LIGHT ground — was invisible on navy, so the block floated with no edge.
 */
export function TickerMark({ size = 28, className }: TickerMarkProps): React.JSX.Element {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      /* Measured off Material Symbols Rounded at wght 300 — see above. */
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* The horn, opening right — the direction the notices travel. One closed
          outline: the cone's slanted edges land exactly on the box's top and
          bottom at x=5.8, so there is no step where the two meet. */}
      <path d="M13.2 5.4 5.8 9.6H4.2a1.4 1.4 0 0 0-1.4 1.4v2a1.4 1.4 0 0 0 1.4 1.4h1.6l7.4 4.2Z" />
      {/* The handle, hanging off the BOX and not the cone. At x=6.8 it met the
          cone's lower diagonal instead of the box's flat bottom, and a round cap
          landing on a slope leaves a visible nub — the join read as a branch off
          the outline rather than a handle under the body. The box's bottom edge
          runs from x=4.2 to x=5.8, so a 1.4 stroke centred at 5.0 sits squarely
          on the flat. */}
      <path d="M5 14.4v3.8" />
      {/* Two arcs of broadcast. These are the animated parts. */}
      <path className="sa-ticker__wave sa-ticker__wave--1" d="M16.6 9.4a4 4 0 0 1 0 5.2" />
      <path className="sa-ticker__wave sa-ticker__wave--2" d="M19.2 7.2a7.4 7.4 0 0 1 0 9.6" />
    </svg>
  );
}
