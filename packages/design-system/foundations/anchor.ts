"use client";

import * as React from "react";

/**
 * Anchored-overlay placement — one engine for every panel that hangs off a
 * trigger.
 *
 * The estate had exactly one of these (inside `Tooltip`) and was about to grow
 * four more: a popover, a menu, a time picker and a date-range picker are all
 * "measure the trigger, measure the panel, flip when it would leave the
 * viewport, clamp on the cross axis". Five copies of that arithmetic is five
 * places for a panel to open off-screen on a 320px phone, and only one of them
 * would ever get fixed.
 *
 * It lives in `foundations/` rather than beside a component because no single
 * component owns it. `Tooltip` re-exports its two pure functions so the
 * geometry tests written against it keep testing the real implementation.
 */

export type AnchorSide = "top" | "bottom" | "left" | "right";

/**
 * Where the panel sits along the trigger's cross axis.
 *
 * `center` is what a tooltip wants — it points AT something. `start` is what a
 * menu wants: a dropdown whose left edge lines up with its button reads as
 * belonging to it, and one centred under a wide button does not.
 */
export type AnchorAlign = "start" | "center" | "end";

export interface AnchorCoords {
  top: number;
  left: number;
  /** The side actually used, which is not always the side asked for. */
  side: AnchorSide;
}

/** Distance kept between the panel and the viewport edge, in px. */
const VIEWPORT_MARGIN = 8;

const OPPOSITE: Record<AnchorSide, AnchorSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * Flip to the opposite side when the preferred one would overflow the viewport.
 *
 * Deliberately only ONE flip: if neither the preferred side nor its opposite
 * fits, the preferred side is returned and the cross-axis clamp in
 * `computeAnchorCoords` keeps the panel on screen. Cascading through all four
 * sides looks cleverer and reads worse — a menu that opens to the left of its
 * button on one row and to the right on the next is harder to use than one
 * that is occasionally cramped.
 */
export function resolveAnchorSide(
  preferred: AnchorSide,
  trigger: DOMRect,
  panel: DOMRect,
  offset: number,
): AnchorSide {
  const fits: Record<AnchorSide, boolean> = {
    top: trigger.top - panel.height - offset >= 0,
    bottom: trigger.bottom + panel.height + offset <= window.innerHeight,
    left: trigger.left - panel.width - offset >= 0,
    right: trigger.right + panel.width + offset <= window.innerWidth,
  };
  if (fits[preferred]) return preferred;
  return fits[OPPOSITE[preferred]] ? OPPOSITE[preferred] : preferred;
}

/**
 * Viewport coordinates for a panel of `panel` size, placed on `side` of
 * `trigger` and aligned along the cross axis.
 *
 * The returned pair is for `position: fixed`, so the caller must render through
 * a portal — every `DataTable` and `Card` in the estate sets `overflow: hidden`,
 * and a panel positioned inside one is a panel with its bottom half cut off.
 */
export function computeAnchorCoords(
  trigger: DOMRect,
  panel: DOMRect,
  side: AnchorSide,
  offset: number,
  align: AnchorAlign = "center",
): AnchorCoords {
  const alignAxis = (start: number, triggerSize: number, panelSize: number) => {
    if (align === "start") return start;
    if (align === "end") return start + triggerSize - panelSize;
    return start + triggerSize / 2 - panelSize / 2;
  };

  let top = 0;
  let left = 0;
  switch (side) {
    case "top":
      top = trigger.top - panel.height - offset;
      left = alignAxis(trigger.left, trigger.width, panel.width);
      break;
    case "bottom":
      top = trigger.bottom + offset;
      left = alignAxis(trigger.left, trigger.width, panel.width);
      break;
    case "left":
      top = alignAxis(trigger.top, trigger.height, panel.height);
      left = trigger.left - panel.width - offset;
      break;
    case "right":
      top = alignAxis(trigger.top, trigger.height, panel.height);
      left = trigger.right + offset;
      break;
  }

  // Clamp both axes. `Math.max` runs last so a panel TALLER than the viewport
  // is pinned to the top edge and scrolls, rather than being pushed off the top
  // by the bottom clamp — the failure mode on a 568px phone with a long menu.
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, window.innerWidth - panel.width - VIEWPORT_MARGIN),
  );
  top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(top, window.innerHeight - panel.height - VIEWPORT_MARGIN),
  );
  return { top, left, side };
}

export interface UseAnchoredPositionOptions {
  open: boolean;
  side: AnchorSide;
  align?: AnchorAlign;
  offset: number;
  triggerRef: React.RefObject<HTMLElement | null>;
  panelRef: React.RefObject<HTMLElement | null>;
}

/**
 * Measure and keep measuring while the panel is open.
 *
 * Returns `null` until the first measurement lands. Callers MUST render the
 * panel hidden (`visibility: hidden`) while the value is null: the panel has to
 * be in the DOM to be measured, and painting it at 0,0 first is a visible jump
 * from the top-left corner to its real place.
 *
 * Re-measures on scroll — captured, so a trigger inside a scrolling table
 * carries its panel with it — and on resize.
 */
export function useAnchoredPosition({
  open,
  side,
  align = "center",
  offset,
  triggerRef,
  panelRef,
}: UseAnchoredPositionOptions): AnchorCoords | null {
  const [coords, setCoords] = React.useState<AnchorCoords | null>(null);

  React.useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    const place = () => {
      const t = triggerRef.current?.getBoundingClientRect();
      const p = panelRef.current?.getBoundingClientRect();
      if (!t || !p) return;
      const resolved = resolveAnchorSide(side, t, p, offset);
      setCoords(computeAnchorCoords(t, p, resolved, offset, align));
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, side, align, offset, triggerRef, panelRef]);

  return coords;
}

/** Selector for the elements that can hold focus inside an overlay panel. */
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Every focusable descendant of `root`, in document order. */
export function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/**
 * Close when the pointer goes down outside BOTH the panel and the trigger.
 *
 * `pointerdown`, not `click`: a click fires after mouseup, so a consumer that
 * drags a text selection out of the panel and releases outside would keep it
 * open. Excluding the trigger matters because the trigger's own handler
 * toggles — without it, a click on the trigger closes here and re-opens there,
 * and the panel never shuts.
 */
export function useDismissOnOutside(
  open: boolean,
  refs: React.RefObject<HTMLElement | null>[],
  onDismiss: () => void,
): void {
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (refs.some((r) => r.current?.contains(target))) return;
      onDismiss();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onDismiss, ...refs]);
}
