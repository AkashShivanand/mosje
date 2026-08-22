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
 * AND THREE GUARDS ON IT, each earned by a page where the measurement was
 * right about its input and wrong about the world. They are documented at the
 * definitions below; in short, the panel moves only for controls that are
 * actually on screen (`visibleRect`), only around controls that actually
 * belong to one form (`formsOf`), and only when moving buys back a real share
 * of the overlap (`FALLBACK_IMPROVEMENT_RATIO`). Without all three, a closed
 * accessibility widget parked off-canvas threw the drawer to the wall
 * opposite its own rail on a page it was covering nothing on.
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

/**
 * How far apart two controls can sit and still be read as ONE form.
 *
 * THE DEFECT THIS EXISTS FOR. The first version unioned every obstacle on the
 * page into a single rect. That is right for a login form — three stacked
 * fields ARE one object — and wrong for anything else. Measured on
 * `/website/schemes-services` at 1500x900:
 *
 *     schemes search box            [203  -> 651]
 *     UX4G accessibility widget     [1566 -> 1700]   (off-screen, invisible)
 *     union, i.e. "the form"        [203  -> 1700]   -- 1497px of a 1500px viewport
 *
 * Two unrelated controls on opposite walls synthesised a form wider than the
 * screen. Nothing could clear it, so the placement fell through to its
 * last-resort branch and slammed the panel to `left: 16` — the opposite wall
 * from the rail that opens it — to save overlap with a rect that was mostly
 * fiction. The default position had cleared the real search box outright.
 *
 * So: cluster first. Rects within this gap of each other merge; rects further
 * apart stay separate objects that must each be cleared. 48px is a little
 * wider than the tallest gap between stacked fields in our forms (measured 42
 * on the NMBA login) and far narrower than the distance between two unrelated
 * widgets, which is hundreds of pixels.
 */
export const OBSTACLE_CLUSTER_GAP_PX = 48;

/**
 * How much better a relocation has to be before the panel is allowed to move
 * when NO placement clears the page's forms.
 *
 * The fallback used to take whichever candidate covered least, with no floor.
 * That is how a 66,982px² overlap beat a 107,000px² one and threw the panel
 * clean across the viewport for a 37% improvement nobody asked for. Crossing
 * the screen is expensive — the panel loses its visual tie to the rail that
 * opened it — so it must buy at least half the overlap back, or the panel
 * stays where the user expects it and accepts the overlap.
 */
export const FALLBACK_IMPROVEMENT_RATIO = 0.5;

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

/** Would `a` grown by `gap` on every side touch `b`? Symmetric. */
function within(a: Rect, b: Rect, gap: number): boolean {
  return (
    a.left - gap < b.right &&
    b.left - gap < a.right &&
    a.top - gap < b.bottom &&
    b.top - gap < a.bottom
  );
}

/**
 * The obstacles grouped into the forms they actually belong to.
 *
 * Merging is transitive and restarts after every merge: an enlarged box can
 * reach a neighbour the original could not, and a form's fields are a chain
 * (field -> field -> submit) rather than a star. The order of the input does
 * not change the answer.
 *
 * The part of the estate this changes is small and the part it protects is
 * large: a page with one form still yields one rect and behaves exactly as
 * before, while a page with a form and an unrelated widget now yields two
 * and stops inventing a viewport-wide obstacle out of the pair.
 */
export function formsOf(
  rects: readonly Rect[],
  gap: number = OBSTACLE_CLUSTER_GAP_PX,
): Rect[] {
  const forms: Rect[] = [];
  for (const rect of rects) {
    let merged: Rect = { ...rect };
    let i = 0;
    while (i < forms.length) {
      if (within(forms[i]!, merged, gap)) {
        merged = unionOf([forms[i]!, merged])!;
        forms.splice(i, 1);
        i = 0;
      } else {
        i += 1;
      }
    }
    forms.push(merged);
  }
  return forms;
}

/**
 * An obstacle's rect clipped to the viewport, or `null` if it lies wholly
 * outside it.
 *
 * THE DEFECT THIS EXISTS FOR. The panel is `position: fixed`, so it can only
 * cover what is on screen. The obstacle scan filtered on `offsetParent` and
 * zero size, neither of which catches a control that is laid out, painted and
 * parked off-canvas — which is exactly how the UX4G accessibility drawer sits
 * when closed. Measured at 1500px wide, its input reported `1566 -> 1700`:
 * 200px past the right edge, invisible to the user, and fully counted.
 *
 * Clipping rather than merely filtering, because the same argument applies to
 * the visible half of a half-scrolled control: the panel cannot cover the part
 * that is not there.
 */
export function visibleRect(
  rect: Rect,
  viewport: { width: number; height: number },
): Rect | null {
  const left = Math.max(rect.left, 0);
  const top = Math.max(rect.top, 0);
  const right = Math.min(rect.right, viewport.width);
  const bottom = Math.min(rect.bottom, viewport.height);
  if (right - left <= 0 || bottom - top <= 0) return null;
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
 *
 * Three rules, in order, and the second and third are the ones that keep it
 * honest: only move when the default is actually blocked, only dodge the
 * forms that block it, and only cross the screen when crossing the screen
 * buys something.
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
  const forms = formsOf(obstacles);
  if (forms.length === 0) return defaultLeft;

  const top = Math.max(0, (viewport.height - panelHeight) / 2);
  const bottom = top + panelHeight;
  const band = (left: number): Rect => ({ left, right: left + panelWidth, top, bottom });
  /** How much of the page's forms a placement would cover, in px². */
  const costOf = (left: number) =>
    forms.reduce((sum, form) => sum + overlapArea(band(left), form), 0);

  // Does the default position already clear every form? Then do not move at
  // all. This is the answer on most of the estate.
  const defaultCost = costOf(defaultLeft);
  if (defaultCost === 0) return defaultLeft;

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

  // Stand immediately beside a form the default actually hits — not beside
  // every form on the page. Prefer the side with more room so the panel is
  // least likely to be clamped back over it.
  //
  // With a right-anchored default, the leftward placement is the one that
  // actually fires: for the panel to need the form's RIGHT it would have to
  // both overlap the default and leave room beside it, and those two cannot
  // both hold. The right-hand candidate is kept because the rule should not
  // depend on which edge the default happens to sit on — a test pins the
  // arithmetic so nobody has to rediscover it.
  const candidates: number[] = [];
  for (const form of forms) {
    if (overlapArea(band(defaultLeft), form) === 0) continue;
    const roomLeft = form.left - gap;
    const roomRight = viewport.width - form.right - gap;
    if (roomLeft >= roomRight) {
      candidates.push(form.left - gap - panelWidth, form.right + gap);
    } else {
      candidates.push(form.right + gap, form.left - gap - panelWidth);
    }
  }

  for (const candidate of candidates) {
    const clamped = clampLeft(candidate);
    if (costOf(clamped) === 0) return clamped;
  }

  // Nothing clears everything — a narrow viewport, or forms on both walls.
  // Take the placement that covers least, but only if it is a real
  // improvement: relocating the panel costs the user the tie between it and
  // the rail that opened it, and that is not worth a rounding error.
  const scored = candidates
    .map(clampLeft)
    .map((left) => ({ left, cost: costOf(left) }))
    .sort((a, b) => a.cost - b.cost);
  const best = scored[0];
  if (!best) return defaultLeft;
  return best.cost <= defaultCost * FALLBACK_IMPROVEMENT_RATIO ? best.left : defaultLeft;
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
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const obstacles: Rect[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(obstacleSelector)) {
        // The panel's own search box is not an obstacle to the panel.
        if (panel.contains(el)) continue;
        if (el.offsetParent === null && window.getComputedStyle(el).position !== "fixed") continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        // Clipped to the viewport, and dropped when it lies wholly outside
        // it. `offsetParent` and a non-zero box do NOT mean visible: the UX4G
        // accessibility drawer parks a laid-out, painted input off-canvas
        // when closed, and it was steering this panel from 200px past the
        // right edge. See `visibleRect`.
        const visible = visibleRect(
          { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
          viewport,
        );
        if (visible) obstacles.push(visible);
      }

      setLeft(
        panelLeftFor({
          obstacles,
          panelWidth: panel.offsetWidth,
          panelHeight: panel.offsetHeight,
          inset,
          viewport,
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
