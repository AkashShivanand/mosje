/**
 * Divider — the estate's thin rule, and the code counterpart of the SAMAVESH Figma
 * master `Divider` (`55061:700`, Orientation × Tone = 6 variants).
 *
 * It existed in Figma from the day the AccessibilityBar was built and had **no code
 * counterpart at all** until 2026-08-18, so every consumer hand-rolled its own rule —
 * the bar with a `<span>`, others with a bordered `<div>`. That is how a 1px hairline
 * ends up with several slightly different colours across one estate.
 *
 * WHY IT IS NOT AN `<hr>` BY DEFAULT. A horizontal rule that separates *sections* is
 * a real thematic break and should be announced, so `decorative={false}` renders an
 * `<hr>`. But the common case on this estate is a rule *inside* a row — between the
 * controls of a toolbar — which is presentation, not structure. Announcing "separator"
 * between every pair of buttons in the accessibility bar is noise, so the default is
 * `aria-hidden` and no role.
 */

import * as React from "react";
import { cn } from "../../utils/cn";
import "./divider.css";

/** Mirrors the Figma master's `Orientation` axis. */
export type DividerOrientation = "horizontal" | "vertical";

/**
 * Mirrors the Figma master's `Tone` axis.
 *
 * - `default` — on a light surface (`border/neutral/subtle`).
 * - `inverse` — on a dark or brand surface (`border/neutral/inverse/default`, white).
 * - `inverse-subtle` — the quieter inverse rule (white @ 40%), for dividing controls
 *   *within* a brand surface where a full-strength white rule would compete with the
 *   content it separates. This is what the AccessibilityBar uses.
 */
export type DividerTone = "default" | "inverse" | "inverse-subtle";

export interface DividerProps {
  /** @default "horizontal" */
  orientation?: DividerOrientation;
  /** @default "default" */
  tone?: DividerTone;
  /**
   * Length along the rule's own axis — a CSS length. Omit to stretch: a horizontal
   * rule fills its container's width, a vertical one fills its height, which in an
   * auto-layout row means it matches its tallest sibling.
   *
   * The Figma master's 20px specimen is a *specimen*, not a default — it is the
   * height that suits a 20px glyph beside it. Consumers set their own.
   */
  length?: string | number;
  /**
   * `true` (the default) hides the rule from assistive technology — correct for a rule
   * between controls in a row, which is presentation. Pass `false` for a rule that is a
   * genuine thematic break between sections: it then renders a real `<hr>`.
   * @default true
   */
  decorative?: boolean;
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  tone = "default",
  length,
  decorative = true,
  className,
}: DividerProps): React.JSX.Element {
  // The rule's thickness is always the hairline; `length` is the other axis.
  const len = typeof length === "number" ? `${length}px` : length;
  // `align-self: stretch` is right for a rule with no length — it matches the tallest
  // sibling. With an explicit length it is actively WRONG: a flex item with a definite
  // cross size treats `stretch` as `flex-start`, so the rule pins to the TOP of the row
  // instead of centring. That is how the bar's three separators ended up sitting at
  // y=7 in a 46px bar (they should sit at 13) while every control around them was
  // centred — visible as a misalignment, and invisible to any check that only measured
  // the rule itself.
  const style: React.CSSProperties | undefined = len
    ? orientation === "horizontal"
      ? { width: len }
      : { height: len, alignSelf: "center" }
    : undefined;

  const classes = cn("sa-divider", `sa-divider--${orientation}`, `sa-divider--${tone}`, className);

  if (decorative) {
    return <span className={classes} style={style} aria-hidden="true" />;
  }

  // A real thematic break. `<hr>` already carries role="separator" and, with
  // aria-orientation, communicates a vertical one correctly — no role override needed.
  return (
    <hr
      className={classes}
      style={style}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
    />
  );
}
