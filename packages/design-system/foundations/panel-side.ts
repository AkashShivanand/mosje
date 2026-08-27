"use client";

/**
 * SAMAVESH Design System — where the DemoDock panel opens
 *
 * THE RULE, AND IT IS THE WHOLE RULE. The panel opens beside its rail. It
 * steps aside for EXACTLY ONE THING: a login form. Nothing else on any page
 * moves it, ever.
 *
 * WHY A LOGIN FORM AND NOTHING ELSE. The dock's Sign in tab fills credentials
 * into the page underneath — that is the only thing it types into, so a login
 * form is the only thing it can occlude while you are using it. Measured on
 * the NMBA login before this existed:
 *
 *     panel        [878, 126, 500x648]
 *     input#mobile [946, 441, 384x50]   -> covered
 *
 * It still worked, because pressing **Use** closes the panel and fills the
 * fields. But you could not watch them fill, could not read a credential and
 * type it by hand, and could not check what landed.
 *
 * WHY IT IS NOT "ANY FORM CONTROL". This started as a general obstacle scan —
 * every input, textarea, select and submit button on the page, unioned into
 * one rect — and it was wrong twice, on pages where nothing was being typed
 * into at all:
 *
 *   1. `/website/schemes-services`, 1500x900. The page's scheme search box
 *      (203..651) unioned with the UX4G accessibility drawer's input parked
 *      off-canvas (1566..1700) made a "form" spanning 1497px of a 1500px
 *      viewport. Nothing could clear it, so the panel was thrown to left: 16
 *      — the wall opposite its own rail.
 *   2. The website home page, any viewport under 879px tall. The panel's band
 *      starts at 0.14*vh, which at 860 is 120.5; the masthead search box ends
 *      at 123. A 2.5px graze against site chrome relocated the panel 700px
 *      from its rail.
 *
 * Both were the scan answering a question nobody asked. Clustering, scoring
 * and improvement floors were added to make the general case behave, and all
 * of it went away the moment the rule was stated correctly: **a login form,
 * or nothing.** No page-wide unions to invent, no grazes to arbitrate, no
 * off-canvas widgets to filter — a login form is one element, on screen, and
 * the panel either sits on it or it does not.
 *
 * WHAT DOES NOT MOVE: the rail. The trigger stays where muscle memory left
 * it; only the surface it opens adapts.
 */

import * as React from "react";

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Breathing room between the panel and the login form it stands beside. */
export const PANEL_ADJACENT_GAP_PX = 24;

/**
 * Margin at the FAR viewport edge — the side the rail is not on.
 *
 * Distinct from `inset`, and conflating the two was a real bug. `inset` is
 * the RAIL CLEARANCE: how much room the panel leaves on the right so it does
 * not sit under the dock. It is not a left margin, and using it as one meant
 * that on a narrow viewport the two clamp bounds crossed, the left bound won,
 * and the panel's right edge ran 36px UNDER the rail.
 *
 * 16 is not a free choice: `max-width: calc(100vw - 78px)` in demo-dock.css
 * is exactly this plus the 62px clearance, so the two agree by construction
 * and the panel spans the whole space between them at the narrowest width.
 */
export const PANEL_EDGE_MARGIN_PX = 16;

/** Do two rects intersect at all? */
function intersects(a: Rect, b: Rect): boolean {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

/**
 * A rect clipped to the viewport, or `null` if it lies wholly outside it.
 *
 * The panel is `position: fixed`, so it can only cover what is on screen. A
 * login form scrolled out of view is not something to dodge.
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
 * With no login form — which is every page but a handful — this returns the
 * default right-anchored position and nothing moves. With one, the panel
 * butts up against the form's near edge with a gap, on whichever side has
 * more room, so the two read as one object rather than as two things
 * connected by a saccade.
 */
export function panelLeftFor({
  form,
  panelWidth,
  panelHeight,
  inset,
  viewport,
  gap = PANEL_ADJACENT_GAP_PX,
}: {
  /** The login form to stand beside, or `null` when there is none. */
  form: Rect | null;
  panelWidth: number;
  panelHeight: number;
  inset: number;
  viewport: { width: number; height: number };
  gap?: number;
}): number {
  const defaultLeft = viewport.width - inset - panelWidth;
  if (!form) return defaultLeft;

  // The panel is vertically centred and `position: fixed`, so its band is
  // known without measuring where the rail sits.
  const top = Math.max(0, (viewport.height - panelHeight) / 2);
  const band = (left: number): Rect => ({
    left,
    right: left + panelWidth,
    top,
    bottom: top + panelHeight,
  });

  // Already clear of it? Then do not move at all.
  if (!intersects(band(defaultLeft), form)) return defaultLeft;

  // Left bound is the FAR-EDGE margin; right bound reserves the rail
  // clearance. Rounded, because the form's edge comes from a fractional
  // `getBoundingClientRect` and a half-pixel panel softens its border.
  const clamp = (v: number) =>
    Math.round(
      Math.min(Math.max(v, PANEL_EDGE_MARGIN_PX), Math.max(PANEL_EDGE_MARGIN_PX, defaultLeft)),
    );

  // Stand immediately beside it, preferring the side with more room. With a
  // right-anchored default the leftward placement is the one that actually
  // fires: for the panel to need the form's RIGHT it would have to both
  // overlap the default and leave room beside it, and those cannot both hold.
  // The right-hand branch is kept so the rule does not depend on which edge
  // the default happens to sit on — a test pins the arithmetic.
  const roomLeft = form.left - gap;
  const roomRight = viewport.width - form.right - gap;
  return clamp(roomLeft >= roomRight ? form.left - gap - panelWidth : form.right + gap);
}

export interface PanelPlacementOptions {
  /** Distance from the viewport edge the panel rests at by default. */
  inset: number;
}

/**
 * The login form on the page, as a viewport-clipped rect, or `null`.
 *
 * A login form is `<form>` with a password field in it. Both halves matter:
 * the password field is what makes it a login rather than a search or a
 * filter, and the `<form>` is what makes it a form rather than a specimen —
 * the design-system's own PasswordInput documentation pages render password
 * fields with no form around them, and the panel must not dodge those.
 */
function loginFormRect(viewport: { width: number; height: number }): Rect | null {
  for (const field of document.querySelectorAll<HTMLInputElement>('input[type="password"]')) {
    const form = field.closest("form");
    if (!form) continue;
    const r = form.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    return visibleRect({ left: r.left, top: r.top, right: r.right, bottom: r.bottom }, viewport);
  }
  return null;
}

/**
 * Resolves the panel's `left`, recomputing on resize. Returns `null` until it
 * has measured, so the caller can let CSS hold the default position for the
 * first paint instead of rendering in one place and snapping to another.
 */
export function usePanelLeft(
  panelRef: React.RefObject<HTMLElement | null>,
  active: boolean,
  { inset }: PanelPlacementOptions,
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

      const viewport = { width: window.innerWidth, height: window.innerHeight };
      setLeft(
        panelLeftFor({
          form: loginFormRect(viewport),
          // `offsetWidth`/`offsetHeight`, NOT `getBoundingClientRect()`. The
          // rect is the TRANSFORMED box, and the panel enters on
          // `scale(0.98)` — so mid-animation it measures 490 rather than 500,
          // and the panel settles 10px too close to the form (a 14px gap
          // where 24 was intended). A ResizeObserver does not help:
          // transforms do not change layout size, so it never fires. Layout
          // size is transform-independent and correct from the first frame.
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
  }, [panelRef, active, inset]);

  return left;
}
