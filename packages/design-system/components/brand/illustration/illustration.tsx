import * as React from "react";

import { cn } from "../../../utils/cn";
import { ILLUSTRATION_TIERS, ILLUSTRATION_VIEWBOX, type IllustrationTier } from "./language";
import { SCENES, type SceneName } from "./scenes";
import "./illustration.css";

export interface IllustrationProps {
  /** Which scene to draw. See `SCENE_NAMES` for the full set. */
  name: SceneName;
  /**
   * Rendered size. The authored geometry does not change with it — see
   * language.ts §1 — so a drawing is correct at every tier.
   * @default "scene"
   */
  tier?: IllustrationTier;
  /**
   * DECORATIVE BY DEFAULT, and that is the safe default rather than the lazy one.
   *
   * An illustration beside a heading that already says "No records found"
   * duplicates it, and a screen reader announcing both reads the page twice.
   * Pass `alt` ONLY where the drawing carries information the surrounding text
   * does not — which, on a well-written page, is rare.
   *
   * Passing `alt=""` explicitly is the same as omitting it.
   */
  alt?: string;
  className?: string;
}

/**
 * SAMAVESH Illustration — a drawing from the estate's own visual language.
 *
 * The language, and the reasoning behind every rule in it, is in `language.ts`.
 * The short version: one 64 × 48 geometry rendered at three tiers, one shared
 * floor, four tokenised ink layers, three stroke weights, and no depicted
 * people — because a department serving Scheduled Castes, senior citizens,
 * persons with disabilities and transgender persons cannot put one kind of
 * person on the page and tell everyone else it is not for them.
 *
 * ```tsx
 * <Illustration name="no-results" />                       // decorative
 * <Illustration name="places-sanctioned" tier="hero"
 *   alt="Three hostel places, two taken and one still vacant." />
 * ```
 *
 * Prefer `EmptyState` or `CardState` where one fits — they place the drawing,
 * the sentence and the action together, which is what a reader needs. Reach for
 * this directly only when composing something they do not cover.
 */
export function Illustration({
  name,
  tier = "scene",
  alt,
  className,
}: IllustrationProps): React.JSX.Element {
  const scene = SCENES[name];
  const { width, height } = ILLUSTRATION_TIERS[tier];
  const labelled = Boolean(alt);
  const titleId = React.useId();

  return (
    <svg
      viewBox={ILLUSTRATION_VIEWBOX}
      width={width}
      height={height}
      className={cn("sa-ill", `sa-ill--${tier}`, className)}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      /*
       * `role="img"` prunes descendants from the accessibility tree, which is
       * exactly right here — the parts of a drawing are not separately
       * meaningful. A decorative drawing takes `aria-hidden` instead, and a
       * `focusable="false"` because IE-era SVG is still focusable in some
       * assistive stacks and a decorative drawing must never be a tab stop.
       */
      {...(labelled
        ? { role: "img", "aria-labelledby": titleId }
        : { "aria-hidden": true, focusable: false })}
    >
      {labelled ? <title id={titleId}>{alt}</title> : null}
      {scene.draw()}
    </svg>
  );
}

/**
 * The scene's own written description, for a caller that needs to place it
 * somewhere other than the drawing — a table cell, a summary, a caption.
 * Written once, in `scenes.tsx`, so one drawing is described one way.
 */
export function illustrationAlt(name: SceneName): string {
  return SCENES[name].alt;
}
