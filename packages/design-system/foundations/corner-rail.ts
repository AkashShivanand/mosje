"use client";

/**
 * SAMAVESH Design System — bottom-right corner rail
 *
 * One shared answer to "where does a floating widget sit?", so that every
 * floating control in the estate lands in the same column and never lands
 * on top of another one.
 *
 * The rule is deliberately simple and stated in terms of what is ACTUALLY
 * on the page, not what we remember being on it:
 *
 * - The corner's resting position is `CORNER_RAIL_REST_PX` (32px) from the
 *   bottom. That is where a widget sits when the corner below it is empty.
 * - If something else already occupies the corner — today the UX4G
 *   accessibility widget's trigger, tomorrow a chatbot launcher — the
 *   widget stacks directly above it, separated by `CORNER_RAIL_GAP_PX`
 *   (16px). Two occupants stack the same way, from the topmost one.
 *
 * That is the whole model: a natural stack measured live, not a table of
 * absolute offsets kept in sync by hand.
 *
 * WHY THIS EXISTS RATHER THAN A CONSTANT. `DemoDock` used to hardcode
 * "24px UX4G offset + 70px UX4G height + 14px gap = 108px" as its CSS
 * fallback and measure only `#uw-widget-custom-trigger` to refine it. That
 * is wrong in both directions, and both were visible in the shipped build:
 *
 * - **When the widget is hidden, the offset is a phantom.**
 *   `.claude/rules/accessibility-entry-point.md` hides the UX4G trigger
 *   with `display: none` on every page that carries an `AccessibilityBar`
 *   — the website masthead, the whole design-system documentation surface,
 *   scw, tg, nhapoa, nmba and smile-admin. On all of those the old measure
 *   loop found the element, failed its `height > 0` check thirty times,
 *   gave up, and left the 108px fallback in place. The FAB floated 108px
 *   up a page with nothing at all beneath it.
 * - **When something NEW occupies the corner, the constant is stale.** A
 *   chatbot launcher added later would have sat underneath the dock with
 *   no code path that could notice.
 *
 * Measuring occupancy fixes both at once, and fixes the second one for
 * widgets nobody has written yet: anything fixed in that corner marks
 * itself with `data-sa-corner-occupant` and the rail stacks above it with
 * no change to this file.
 *
 * WHAT COUNTS AS AN OCCUPANT. A *launcher*, not a *panel*. An occupant has
 * to be visible, has to actually be in the bottom-right corner, and has to
 * be small (`MAX_OCCUPANT_PX`). That last guard is the one that matters:
 * when a chatbot's 480px-tall conversation panel opens, it is not a thing
 * to stack above — shoving the dock to the top of the viewport because a
 * neighbouring panel expanded would be far worse than the overlap it
 * avoids. Launchers move the rail; open panels do not.
 */

import * as React from "react";

/** Any fixed bottom-right widget marks itself with this to join the rail. */
export const CORNER_OCCUPANT_ATTR = "data-sa-corner-occupant";

/** Distance from the viewport bottom when the corner below is empty. */
export const CORNER_RAIL_REST_PX = 32;

/** Breathing room between two stacked occupants of the rail. */
export const CORNER_RAIL_GAP_PX = 16;

/**
 * The UX4G accessibility widget's own trigger id — stable across its
 * v1.15 → v3.28 upgrade, which renamed every class it ships but left the
 * id alone (see `ux4g-accessibility-widget.css`). Third-party markup we
 * cannot add an attribute to at author time, so the rail knows it by name.
 * Used only to MEASURE the widget, never to alter it.
 */
export const UX4G_TRIGGER_ID = "uw-widget-custom-trigger";

const BUILT_IN_SELECTORS = [`#${UX4G_TRIGGER_ID}`, `[${CORNER_OCCUPANT_ATTR}]`];

/**
 * How far in from the right edge, and up from the bottom edge, an element
 * has to be to count as "in the corner". Generous enough to catch a
 * launcher parked at any sane offset, tight enough that a marked element
 * elsewhere on the page cannot push the rail around.
 */
const CORNER_ZONE_X_PX = 200;
const CORNER_ZONE_Y_PX = 220;

/**
 * A launcher is small. Anything taller than this is a panel that happens
 * to be anchored in the corner, and the rail ignores it — see the doc
 * comment above.
 */
const MAX_OCCUPANT_PX = 200;

/*
 * Raised from 140 on 2026-08-20, against a measurement rather than a hunch.
 *
 * The guard exists to tell a LAUNCHER from an open PANEL — the doc comment's
 * example is a 480px conversation panel, and stacking above one of those would
 * fling the rail to the top of the viewport. 200 is nowhere near that.
 *
 * What 140 excluded was the website's cookie-consent bar. It is 87px on a
 * desktop viewport and grows to a measured 176px once its text wraps and its
 * button stacks — at which point the old guard silently stopped treating it as
 * an occupant and the assistant's launcher sat entirely behind it, 144px of an
 * 84px control covered. The bar is a real occupant of the corner at every
 * width; only its height changed.
 *
 * The ceiling below is derived from this, so raising it moves the ceiling in
 * step rather than leaving the two to disagree.
 */

/**
 * The furthest up the viewport the rail can be pushed — DERIVED from the two
 * guards above rather than picked, because an independent number here would
 * either be unreachable (and untestable) or would silently contradict them.
 * The tallest legal offset comes from the tallest legal occupant sitting at
 * the very top of the corner zone, so the ceiling is exactly that sum.
 */
export const MAX_RAIL_OFFSET_PX =
  CORNER_ZONE_Y_PX + MAX_OCCUPANT_PX + CORNER_RAIL_GAP_PX;

/**
 * The widget scripts that own this corner inject their markup
 * asynchronously, so the first measurement usually finds nothing. Poll
 * briefly for a late arrival; the observers below take over after that.
 */
const DISCOVERY_POLL_MS = 150;
const DISCOVERY_MAX_ATTEMPTS = 30;

function isVisible(el: Element): boolean {
  const cs = window.getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden") return false;
  if (Number(cs.opacity) === 0) return false;
  return true;
}

/**
 * The offset the rail should sit at, in px from the viewport bottom.
 * Exported for the unit test — it is pure given a list of rects.
 */
export function railOffsetFromRects(
  rects: readonly { top: number; bottom: number; right: number; height: number }[],
  viewport: { width: number; height: number },
): number {
  let topMost = Number.POSITIVE_INFINITY;

  for (const rect of rects) {
    if (rect.height <= 0 || rect.height > MAX_OCCUPANT_PX) continue;
    if (rect.right < viewport.width - CORNER_ZONE_X_PX) continue;
    if (rect.bottom < viewport.height - CORNER_ZONE_Y_PX) continue;
    if (rect.top < topMost) topMost = rect.top;
  }

  if (!Number.isFinite(topMost)) return CORNER_RAIL_REST_PX;

  const offset = Math.round(viewport.height - topMost + CORNER_RAIL_GAP_PX);
  // An occupant sitting lower than our own resting position must never pull
  // the rail DOWN below it; the rest offset is a floor, not a default.
  return Math.min(Math.max(offset, CORNER_RAIL_REST_PX), MAX_RAIL_OFFSET_PX);
}

export interface CornerRailOptions {
  /** Extra CSS selectors to treat as occupants, on top of the built-ins. */
  selectors?: readonly string[];
  /**
   * Custom property to write the resolved offset to on the ref'd element.
   * @default "--sa-corner-rail-bottom"
   */
  property?: string;
}

/**
 * Keeps `element.style[property]` set to the correct bottom offset for the
 * corner rail, re-measuring whenever the corner's occupancy could have
 * changed.
 *
 * Three things can change it, and all three are watched rather than
 * assumed:
 *
 * 1. **Late injection.** Vendor scripts mount their launcher after our
 *    React tree. Covered by the discovery poll, plus a `childList`
 *    observer on `<body>` for anything that mounts later still (a chatbot
 *    loaded on demand, a route that only some pages render).
 * 2. **Visibility flipping.** `data-sa-abar-a11y` on the root element is
 *    exactly the signal that the UX4G trigger just became hidden or
 *    visible again — see `.claude/rules/accessibility-entry-point.md`. An
 *    attribute observer on `<html>` catches the flip on navigation without
 *    polling forever.
 * 3. **Geometry.** Viewport resize, plus a `ResizeObserver` on each
 *    occupant so an upstream size change can't silently drift the two
 *    apart. This is the "derive it, don't remember it" half — the reason
 *    the offset is measured at all rather than written down.
 *
 * Every path funnels through one rAF-debounced measure, so a burst of
 * mutations costs a single layout read.
 */
export function useCornerRailOffset(
  ref: React.RefObject<HTMLElement | null>,
  options: CornerRailOptions = {},
): void {
  const { selectors, property = "--sa-corner-rail-bottom" } = options;

  // Stable across renders so the effect below does not re-subscribe on
  // every parent render just because an array literal was passed inline.
  const selectorKey = (selectors ?? []).join(",");

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const allSelectors = [
      ...BUILT_IN_SELECTORS,
      ...(selectorKey ? selectorKey.split(",") : []),
    ];

    let frame: number | undefined;
    let pollTimer: number | undefined;
    let attempts = 0;
    let disposed = false;
    let observedOccupants: Element[] = [];

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => schedule())
        : null;

    const findOccupants = (): Element[] => {
      const found: Element[] = [];
      for (const selector of allSelectors) {
        let matches: NodeListOf<Element>;
        try {
          matches = document.querySelectorAll(selector);
        } catch {
          // A caller-supplied selector that does not parse must not take
          // the whole rail down with it.
          continue;
        }
        for (const match of matches) {
          // Never measure ourselves, or anything we render.
          if (match === element || element.contains(match)) continue;
          if (!found.includes(match)) found.push(match);
        }
      }
      return found;
    };

    const measure = () => {
      if (disposed) return;
      const occupants = findOccupants();

      // Identity comparison, not `join()` — every element stringifies to
      // "[object HTMLDivElement]", so a joined string cannot tell two
      // different launchers apart and the observer would never re-bind.
      const sameSet =
        occupants.length === observedOccupants.length &&
        occupants.every((occupant, i) => occupant === observedOccupants[i]);
      if (resizeObserver && !sameSet) {
        resizeObserver.disconnect();
        for (const occupant of occupants) resizeObserver.observe(occupant);
        observedOccupants = occupants;
      }

      const rects = occupants
        .filter(isVisible)
        .map((occupant) => occupant.getBoundingClientRect());

      const offset = railOffsetFromRects(rects, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      element.style.setProperty(property, `${offset}px`);

      // Keep looking for a late-arriving launcher until one shows up or
      // we have waited ~4.5s; the observers below cover everything after.
      if (rects.length === 0 && attempts++ < DISCOVERY_MAX_ATTEMPTS) {
        pollTimer = window.setTimeout(measure, DISCOVERY_POLL_MS);
      }
    };

    function schedule() {
      if (disposed || frame !== undefined) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        measure();
      });
    }

    measure();

    window.addEventListener("resize", schedule);

    // The AccessibilityBar's refcounted root flag — the one signal that
    // says the UX4G trigger's visibility just changed.
    const rootObserver = new MutationObserver(schedule);
    rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sa-abar-a11y"],
    });

    // Late-mounting launchers. Vendor widgets append to <body>, so a
    // shallow childList watch is enough and costs nothing per render.
    const bodyObserver = new MutationObserver(schedule);
    bodyObserver.observe(document.body, { childList: true });

    return () => {
      disposed = true;
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      if (pollTimer) window.clearTimeout(pollTimer);
      window.removeEventListener("resize", schedule);
      rootObserver.disconnect();
      bodyObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, [ref, selectorKey, property]);
}
