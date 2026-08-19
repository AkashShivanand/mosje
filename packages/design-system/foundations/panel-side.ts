"use client";

/**
 * SAMAVESH Design System — which side a docked panel opens on
 *
 * THE DEFECT THIS EXISTS FOR. `DemoDock`'s panel is 500px wide and pinned to
 * the right. On the NMBA login route that put it directly on top of both
 * credential fields and the submit button:
 *
 *     panel        [878, 126, 500x648]
 *     input#mobile [946, 441, 384x50]   -> covered
 *     elementFromPoint(centre of the input) = LI.ds-demo-accounts__row
 *
 * It still worked, because pressing **Use** closes the panel and fills the
 * fields. But the user could not watch the fields fill, could not read a
 * credential and type it manually, and could not check what landed. A tool
 * that occludes its own subject is answering the wrong question about where
 * it belongs.
 *
 * And it was systemic rather than NMBA-specific: any centred or right-aligned
 * form on a laptop-width screen sat behind it.
 *
 * THE RULE. The panel opens on whichever side covers less of the form. Not
 * "the side away from the trigger", not a per-route flag — a measurement,
 * recomputed whenever the obstacles or the viewport change. On a page with no
 * form it resolves to the default side and nothing moves, which is most of
 * the estate.
 *
 * Note what does NOT move: the rail. The trigger stays exactly where muscle
 * memory left it; only the surface it opens adapts. That is the half of the
 * old per-route pattern worth keeping — panels are dialogs, and a dialog has
 * never been required to touch the control that opened it.
 */

import * as React from "react";

export type PanelSide = "left" | "right";

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Breathing room between the panel and the form it is standing beside. */
export const PANEL_ADJACENT_GAP_PX = 24;

/** Area of the intersection of two rects; 0 when they do not overlap. */
function overlapArea(a: Rect, b: Rect): number {
  const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return x > 0 && y > 0 ? x * y : 0;
}

/** The union of a set of rects — the form treated as one object. */
export function unionOf(rects: readonly Rect[]): Rect | null {
  if (rects.length === 0) return null;
  let { left, top, right, bottom } = rects[0]!;
  for (const r of rects) {
    left = Math.min(left, r.left);
    top = Math.min(top, r.top);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  }
  return { left, top, right, bottom };
}

/**
 * The panel's `left`, in px.
 *
 * **It stands NEXT TO the form, not on the far side of the screen.** The first
 * version only chose a side, which on a 1440px login screen put the panel hard
 * against the left edge while the form sat against the right — technically
 * clear of it, and visually two unrelated objects. A helper that has to be
 * connected by a saccade is not helping.
 *
 * So: butt the panel up against the form's near edge with a gap, on whichever
 * side has room. With no form to stand beside, it returns the default
 * right-anchored position and nothing moves — which is most of the estate.
 */
export function panelLeftFor({
  obstacles,
  panelWidth,
  panelHeight,
  inset,
  viewport,
  gap = PANEL_ADJACENT_GAP_PX,
}: {
  obstacles: readonly Rect[];
  panelWidth: number;
  panelHeight: number;
  inset: number;
  viewport: { width: number; height: number };
  gap?: number;
}): number {
  const defaultLeft = viewport.width - inset - panelWidth;
  const form = unionOf(obstacles);
  if (!form) return defaultLeft;

  const top = Math.max(0, (viewport.height - panelHeight) / 2);
  const bottom = top + panelHeight;
  const band = (left: number): Rect => ({ left, right: left + panelWidth, top, bottom });

  // Does the default position already clear the form? Then do not move at all.
  if (overlapArea(band(defaultLeft), form) === 0) return defaultLeft;

  const clampLeft = (v: number) =>
    Math.min(Math.max(v, inset), Math.max(inset, viewport.width - inset - panelWidth));

  // Stand immediately beside the form, preferring the side with more room so
  // the panel is least likely to be clamped back over it.
  //
  // With a right-anchored default, the leftward placement is the one that
  // actually fires: for the panel to need the form's RIGHT it would have to
  // both overlap the default and leave room beside it, and those two cannot
  // both hold. The right-hand candidate is kept because the rule should not
  // depend on which edge the default happens to sit on — a test pins the
  // arithmetic so nobody has to rediscover it.
  const roomLeft = form.left - gap;
  const roomRight = viewport.width - form.right - gap;

  const candidates: number[] = [];
  if (roomLeft >= roomRight) {
    candidates.push(form.left - gap - panelWidth, form.right + gap);
  } else {
    candidates.push(form.right + gap, form.left - gap - panelWidth);
  }

  for (const candidate of candidates) {
    const clamped = clampLeft(candidate);
    if (overlapArea(band(clamped), form) === 0) return clamped;
  }

  // Neither side can clear it — a narrow viewport. Take the placement that
  // covers least, rather than pretending one of them worked.
  const scored = candidates
    .map(clampLeft)
    .map((left) => ({ left, cost: overlapArea(band(left), form) }))
    .sort((a, b) => a.cost - b.cost);
  return scored[0]!.left;
}

export interface PanelPlacementOptions {
  /** Distance from the viewport edge the panel rests at by default. */
  inset: number;
  /** Extra selector for things the panel must not cover. */
  obstacleSelector?: string;
}

/**
 * The controls a panel must not cover: the inputs and submit buttons of the
 * page underneath it. Deliberately narrow — treating every button on the page
 * as an obstacle would make almost any placement "bad" and the panel would
 * thrash.
 */
export const OBSTACLE_SELECTOR =
  'input:not([type="hidden"]), textarea, select, button[type="submit"]';

/**
 * Resolves the panel's `left`, recomputing on resize. Returns `null` until it
 * has measured, so the caller can let CSS hold the default position for the
 * first paint instead of rendering in one place and snapping to another.
 */
export function usePanelLeft(
  panelRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  { inset, obstacleSelector = OBSTACLE_SELECTOR }: PanelPlacementOptions,
): number | null {
  const [left, setLeft] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    if (!active || typeof window === "undefined") {
      setLeft(null);
      return;
    }

    const resolve = () => {
      const panel = panelRef.current;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      const obstacles: Rect[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(obstacleSelector)) {
        // The panel's own search box is not an obstacle to the panel.
        if (panel.contains(el)) continue;
        if (el.offsetParent === null && window.getComputedStyle(el).position !== "fixed") continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        obstacles.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
      }

      setLeft(
        panelLeftFor({
          obstacles,
          panelWidth: rect.width || panel.offsetWidth,
          panelHeight: rect.height || panel.offsetHeight,
          inset,
          viewport: { width: window.innerWidth, height: window.innerHeight },
        }),
      );
    };

    resolve();
    window.addEventListener("resize", resolve);
    return () => window.removeEventListener("resize", resolve);
  }, [panelRef, active, inset, obstacleSelector]);

  return left;
}
