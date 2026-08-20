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

/**
 * Margin at the FAR viewport edge — the side the rail is not on.
 *
 * Distinct from `inset`, and conflating the two was a real bug. `inset` is
 * the RAIL CLEARANCE: how much room the panel leaves on the right so it does
 * not sit under the dock. It is not a left margin, and using it as one meant
 * that on a narrow viewport the two clamp bounds crossed, the left bound won,
 * and the panel's right edge ran 36px UNDER the rail — measured at every
 * width below ~640px, and visible as the rail's glyphs sitting on top of the
 * panel's "Use" links.
 *
 * 16 is not a free choice: `max-width: calc(100vw - 78px)` in demo-dock.css
 * is exactly this plus the 62px clearance, so the two agree by construction
 * and the panel spans the whole space between them at the narrowest width.
 */
export const PANEL_EDGE_MARGIN_PX = 16;

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

  // Left bound is the FAR-EDGE margin; right bound reserves the rail
  // clearance. Rounded, because an adjacent placement is derived from a
  // fractional `getBoundingClientRect` and a half-pixel panel softens its
  // border.
  const clampLeft = (v: number) =>
    Math.round(
      Math.min(
        Math.max(v, PANEL_EDGE_MARGIN_PX),
        Math.max(PANEL_EDGE_MARGIN_PX, viewport.width - inset - panelWidth),
      ),
    );

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

      // `offsetWidth`/`offsetHeight`, NOT `getBoundingClientRect()`. The rect
      // is the TRANSFORMED box, and the panel enters on `scale(0.98)` — so
      // mid-animation it measures 490 rather than 500, and the panel settles
      // 10px too close to the form (a 14px gap where 24 was intended). A
      // ResizeObserver does not help: transforms do not change layout size,
      // so it never fires. Layout size is transform-independent and correct
      // from the first frame.
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
          panelWidth: panel.offsetWidth,
          panelHeight: panel.offsetHeight,
          inset,
          viewport: { width: window.innerWidth, height: window.innerHeight },
        }),
      );
    };

    resolve();
    window.addEventListener("resize", resolve);

    // The panel's width is not final on the first layout pass — measured at
    // 490 before content settled and 500 after, which shifted the gap from
    // the intended 24px to 14px. Re-resolve when its own box changes rather
    // than trusting a single early read.
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resolve()) : null;
    if (observer && panelRef.current) observer.observe(panelRef.current);

    return () => {
      window.removeEventListener("resize", resolve);
      observer?.disconnect();
    };
  }, [panelRef, active, inset, obstacleSelector]);

  return left;
}
