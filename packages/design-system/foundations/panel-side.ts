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

/** Area of the intersection of two rects; 0 when they do not overlap. */
function overlapArea(a: Rect, b: Rect): number {
  const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return x > 0 && y > 0 ? x * y : 0;
}

/**
 * The side to open on. Pure, and therefore testable without a DOM.
 *
 * Ties go to `preferred`, so a page with nothing to avoid never moves the
 * panel — a widget that relocates for no visible reason is the exact
 * complaint this component has already answered for twice.
 */
export function panelSideFor({
  obstacles,
  panelWidth,
  panelHeight,
  inset,
  viewport,
  preferred = "right",
}: {
  obstacles: readonly Rect[];
  panelWidth: number;
  panelHeight: number;
  inset: number;
  viewport: { width: number; height: number };
  preferred?: PanelSide;
}): PanelSide {
  const top = Math.max(0, (viewport.height - panelHeight) / 2);
  const bottom = top + panelHeight;

  const asRight: Rect = {
    left: viewport.width - inset - panelWidth,
    right: viewport.width - inset,
    top,
    bottom,
  };
  const asLeft: Rect = {
    left: inset,
    right: inset + panelWidth,
    top,
    bottom,
  };

  let right = 0;
  let left = 0;
  for (const o of obstacles) {
    right += overlapArea(asRight, o);
    left += overlapArea(asLeft, o);
  }

  if (right === left) return preferred;
  return right < left ? "right" : "left";
}

/**
 * The controls a panel must not cover: the inputs and submit buttons of the
 * page underneath it. Deliberately narrow — every button on the page would
 * make almost any placement "bad" and the panel would thrash between sides.
 */
export const OBSTACLE_SELECTOR =
  'input:not([type="hidden"]), textarea, select, button[type="submit"]';

export interface PanelSideOptions {
  /** Distance from the viewport edge the panel is pinned at. */
  inset: number;
  /** Side to use when neither is better. @default "right" */
  preferred?: PanelSide;
  /** Extra selector for things the panel must not cover. */
  obstacleSelector?: string;
}

/**
 * Resolves the side a panel should open on, recomputing on resize.
 *
 * Returns `null` until it has measured, so a caller can hold the panel's
 * first paint until the side is known rather than render it on one side and
 * snap it to the other.
 */
export function usePanelSide(
  panelRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  { inset, preferred = "right", obstacleSelector = OBSTACLE_SELECTOR }: PanelSideOptions,
): PanelSide {
  const [side, setSide] = React.useState<PanelSide>(preferred);

  React.useLayoutEffect(() => {
    if (!active || typeof window === "undefined") return;

    const resolve = () => {
      const panel = panelRef.current;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      const obstacles: Rect[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(obstacleSelector)) {
        // Skip anything inside the panel itself — the panel's own search box
        // is not an obstacle to the panel.
        if (panel.contains(el)) continue;
        if (el.offsetParent === null && window.getComputedStyle(el).position !== "fixed") continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        obstacles.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
      }

      setSide(
        panelSideFor({
          obstacles,
          panelWidth: rect.width || panel.offsetWidth,
          panelHeight: rect.height || panel.offsetHeight,
          inset,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          preferred,
        }),
      );
    };

    resolve();
    window.addEventListener("resize", resolve);
    return () => window.removeEventListener("resize", resolve);
  }, [panelRef, active, inset, preferred, obstacleSelector]);

  return side;
}
