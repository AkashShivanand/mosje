"use client";

import * as React from "react";

export interface IconProps {
  /**
   * Material Symbols icon name — snake_case string.
   * Full catalog: https://fonts.google.com/icons
   * @example "home" | "settings" | "arrow_forward" | "account_circle"
   */
  name: string;
  className?: string;
  /** Pixel size (default 24). Sets both font-size and optical-size axis. */
  size?: number;
  /** Fill variant — false = stroke (default), true = filled. */
  fill?: boolean;
  /**
   * Stroke weight axis (default 300 — MoSJE standard).
   * Use 300 for UI chrome, 400 for standalone decorative icons.
   */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
  /**
   * Extra inline styles, merged AFTER the glyph's own (font-size, variation
   * axes, layout). Use it for placement — `display`, `margin`, `opacity` —
   * not to re-set the size; pass `size` for that so the `opsz` axis tracks it.
   */
  style?: React.CSSProperties;
}

/**
 * Icon — Material Symbols Rounded glyph (the official SAMAVESH icon system).
 *
 * Requires the font to be loaded once in your app root:
 *   import "@mosje/design-system/icons.css";
 *
 * Standard weight is 300 (wght axis). Use fill={true} for filled variants.
 * Both axes are controlled via CSS font-variation-settings, so a single
 * icon can switch between stroke/fill and weights at runtime with zero
 * additional network cost — it's all one variable font.
 *
 * ACCESSIBILITY: the glyph is text, so it is hidden from assistive technology by
 * default. Pass `aria-label` when the icon itself carries the meaning — that makes
 * it a `role="img"` and it is announced. See the note on `hidden` below.
 *
 * @example
 * // Default — 24px, weight 300, stroke, and already aria-hidden
 * <Icon name="home" />
 *
 * // Filled, larger
 * <Icon name="notifications" size={20} fill />
 *
 * // Icon-only button: the LABEL BELONGS ON THE BUTTON, not the glyph
 * <button aria-label="Search"><Icon name="search" size={20} /></button>
 *
 * // A standalone meaningful glyph, with no control to carry the name
 * <Icon name="verified" aria-label="Verified" />
 */
export function Icon({
  name,
  className,
  size = 24,
  fill = false,
  weight = 300,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  style,
}: IconProps): React.JSX.Element {
  /**
   * Decorative BY DEFAULT — the safe half of the rule, made automatic.
   *
   * A Material Symbols glyph is real text content, so a screen reader announces
   * the ligature: an unmarked `<Icon name="arrow_back" />` is read aloud as the
   * stray word "arrow back". The Iconography documentation states that every icon
   * is either hidden from assistive technology or given a label, with no third
   * option — but as an unenforced convention it was missed at 533 of 718 call
   * sites across the estate, which is what a convention relying on 533 separate
   * acts of memory converges to.
   *
   * So the component decides instead of the caller:
   *   - `aria-label` given  → the icon is meaningful. Expose it as `role="img"`
   *                           and let it be announced.
   *   - otherwise           → decorative. Hide it.
   *
   * An explicit `aria-hidden={false}` still wins, for the rare glyph that must be
   * in the accessibility tree without a label of its own.
   */
  const hidden = ariaHidden ?? (ariaLabel ? undefined : true);

  return (
    <span
      className={`material-symbols-rounded${className ? ` ${className}` : ""}`}
      role={ariaLabel ? "img" : undefined}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1, // icon glyph: the ligature sits in a box exactly its own size
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        userSelect: "none",
        ...style,
      }}
      aria-hidden={hidden}
      aria-label={ariaLabel}
    >
      {name}
    </span>
  );
}
