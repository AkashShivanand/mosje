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
 * @example
 * // Default — 24px, weight 300, stroke
 * <Icon name="home" aria-hidden />
 *
 * // Filled, larger
 * <Icon name="notifications" size={20} fill />
 *
 * // Accessible icon-only button
 * <button aria-label="Search"><Icon name="search" size={20} aria-hidden /></button>
 */
export function Icon({
  name,
  className,
  size = 24,
  fill = false,
  weight = 300,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
}: IconProps): React.JSX.Element {
  return (
    <span
      className={`material-symbols-rounded${className ? ` ${className}` : ""}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        userSelect: "none",
      }}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {name}
    </span>
  );
}
