import * as React from "react";

export interface TickerMarkProps {
  /** Pixel size of the square mark. @default 28 */
  size?: number;
  className?: string;
}

/**
 * TickerMark — the broadcasting megaphone that names the Ticker.
 *
 * ── WHY THIS IS A BESPOKE SVG AND NOT `<Icon name="campaign">` ────────────
 * The estate's rule is Material Symbols for icons, and this is the documented
 * exception the Iconography page already carries a section for: a BESPOKE MARK.
 * Two reasons it has to be drawn rather than set in the icon font:
 *
 *   1. **It animates in parts.** The arcs pulse outward on a stagger to say
 *      "broadcasting"; a font glyph is one indivisible shape with no handles to
 *      move independently.
 *   2. **It answers to the strip's state.** The arcs stop when the citizen
 *      pauses the Ticker, which ties the mark to the control instead of leaving
 *      it looping over a stopped list — see `ticker.css`.
 *
 * ── WHAT IT REPLACED, AND WHY ─────────────────────────────────────────────
 * A 32px WHITE ROUNDED TILE holding a small blue glyph. On the plinth's navy
 * that read as a sticker pasted onto the bar rather than part of it, and its
 * `border-neutral-subtle` hairline — a border drawn for a white tile on a LIGHT
 * ground — was invisible on navy, so the tile floated with no edge. The mark
 * now paints in the strip's single ink directly on the ground, like every other
 * element on it. One surface, one ink.
 *
 * Geometry follows Material Symbols Rounded at weight 300: a 24 grid, 1.75
 * stroke, round caps and joins, so it sits beside the estate's other icons
 * without looking like a different family.
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
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* The horn, opening right — the direction the notices travel. */}
      <path d="M13.2 5.4 5.6 9.6H4.4A1.4 1.4 0 0 0 3 11v2a1.4 1.4 0 0 0 1.4 1.4h1.2l7.6 4.2Z" />
      {/* The handle. */}
      <path d="M6.8 14.6v3.1a1.6 1.6 0 0 0 3.2 0v-1.3" />
      {/* Two arcs of broadcast. They are the animated parts. */}
      <path className="sa-ticker__wave sa-ticker__wave--1" d="M16.4 9.3a4.2 4.2 0 0 1 0 5.4" />
      <path className="sa-ticker__wave sa-ticker__wave--2" d="M18.9 6.9a7.8 7.8 0 0 1 0 10.2" />
    </svg>
  );
}
