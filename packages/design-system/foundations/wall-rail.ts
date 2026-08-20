"use client";

/**
 * SAMAVESH Design System — right-wall rail
 *
 * Where a floating edge widget sits on the right wall, so that it never
 * lands on top of product chrome that was there first.
 *
 * THE EVIDENCE THIS EXISTS FOR. The dock was moved to the right wall on the
 * reasoning that the wall was empty. That was measured on the design-system
 * docs and the portals, where it is true — and it is false on the website:
 *
 *     Important Links   fixed [1403, 378, 37x175]  z 1002   top-[42%]
 *     DemoDock rail           [1388, 394, 52x105]  z 2147483000
 *
 * They overlap on both axes, and the dock's z-index wins, so demo scaffolding
 * covered a citizen-facing navigation control on the public website.
 *
 * The walls are INVERTED between zones, which is why no fixed choice works:
 *
 * | Surface | Left wall | Right wall |
 * |---|---|---|
 * | Website | free | Important Links, 42–61% |
 * | Docs / portals | sidebar nav, full height | free |
 *
 * So the position is measured, and the rule is deliberately plain:
 *
 *   **Sit centred. If something is genuinely in the way there, sit 16px
 *   below it instead.**
 *
 * The second sentence is the whole subtlety: something being ON the wall is
 * not the same as being IN THE WAY. A corner widget — the accessibility
 * trigger, or the Noddy launcher — sits around 806-876 on a 900px viewport
 * while the centred rail spans 373-526, so it never conflicts and must not
 * move the rail. Only Important Links, which straddles the middle of the
 * wall, actually displaces it.
 *
 * So on the portals and the docs the rail is centred, corner widget or not.
 * On the website it sits directly beneath Important Links — which is also
 * directly above the corner widget, because on that page those two
 * descriptions of the right answer name the same slot.
 *
 * WHY THIS IS NOT THE PATTERN THAT WAS REJECTED. A previous version of this
 * widget used a hand-set per-route boolean to move itself, and that was
 * removed for good reasons: it could be forgotten by a new portal, and it
 * relocated the widget for no reason a viewer could see. Measured stacking
 * fails neither way — a new occupant marks itself once and every widget on
 * the wall adapts, and when the widget moves it moves *around something you
 * can see*. Legibility is the whole difference.
 *
 * This is the corner-rail primitive from earlier, generalised from a corner
 * to a wall and finally given a real consumer. It was deleted, correctly, for
 * having none.
 */

import * as React from "react";

/** Any fixed widget on the right wall marks itself with this to be dodged. */
export const WALL_OCCUPANT_ATTR = "data-sa-wall-occupant";

/** Clearance kept between the rail and whatever it is avoiding. */
export const WALL_RAIL_GAP_PX = 16;

/** Minimum breathing room at the top and bottom of the viewport. */
export const WALL_RAIL_MARGIN_PX = 24;

/** How far in from the right edge still counts as "on this wall". */
const WALL_ZONE_X_PX = 160;

/**
 * An occupant taller than this share of the viewport is treated as scenery
 * rather than as an obstacle. A full-height sidebar or a page-tall overlay
 * cannot be dodged, and trying produces a worse answer than ignoring it.
 */
const MAX_OCCUPANT_SHARE = 0.6;

/**
 * The UX4G accessibility widget's trigger. Third-party markup we cannot add
 * an attribute to at author time, so the rail knows it by name — and it must,
 * because it sits in the bottom-right corner the rail settles into. It is
 * `display: none` on every page carrying an `AccessibilityBar`, and the
 * visibility check below handles that: on those pages it is simply not an
 * occupant, and the rail drops to the corner itself.
 */
export const UX4G_TRIGGER_ID = "uw-widget-custom-trigger";

const BUILT_IN_SELECTORS = [`[${WALL_OCCUPANT_ATTR}]`, `#${UX4G_TRIGGER_ID}`];

const DISCOVERY_POLL_MS = 150;
const DISCOVERY_MAX_ATTEMPTS = 20;

export interface Band {
  top: number;
  bottom: number;
}

/**
 * The rail's `top`, given what is on the wall. Pure, so the placement rule is
 * testable without a DOM — which matters, because every previous bug in this
 * widget's placement was a geometry bug.
 */
export function railTopFromOccupants(
  occupants: readonly Band[],
  railHeight: number,
  viewportHeight: number,
): number {
  const centred = Math.round((viewportHeight - railHeight) / 2);
  const clamp = (v: number) =>
    Math.min(
      Math.max(v, WALL_RAIL_MARGIN_PX),
      Math.max(WALL_RAIL_MARGIN_PX, viewportHeight - railHeight - WALL_RAIL_MARGIN_PX),
    );

  // Expand each occupant by the gap, drop the ones too tall to dodge, and
  // merge what overlaps so two adjacent widgets read as one obstacle.
  const blocked = occupants
    .filter((o) => o.bottom - o.top < viewportHeight * MAX_OCCUPANT_SHARE)
    .map((o) => ({
      top: o.top - WALL_RAIL_GAP_PX,
      bottom: o.bottom + WALL_RAIL_GAP_PX,
    }))
    .sort((a, b) => a.top - b.top);

  const merged: Band[] = [];
  for (const band of blocked) {
    const last = merged[merged.length - 1];
    if (last && band.top <= last.bottom) last.bottom = Math.max(last.bottom, band.bottom);
    else merged.push({ ...band });
  }

  // Nothing on the wall: sit in the middle, where the eye expects it.
  if (merged.length === 0) return clamp(centred);

  const fitsAt = (top: number) =>
    top >= WALL_RAIL_MARGIN_PX &&
    top + railHeight <= viewportHeight - WALL_RAIL_MARGIN_PX &&
    merged.every((b) => top + railHeight <= b.top || top >= b.bottom);

  // CENTRED FIRST, whenever centred is actually free. Something being on the
  // wall does not mean it is in the way: a corner widget — the accessibility
  // trigger, or the Noddy launcher — occupies roughly 806-876 on a 900px
  // viewport, while the centred rail spans 373-526. They never touch, so
  // moving for it was pure superstition.
  //
  // Without this check the rule reached straight for "sit below an occupant",
  // failed (below the corner is off-screen), fell through to "sit above it",
  // and parked the rail at 637 — off-centre on every portal, to avoid
  // something 280px away. Only an occupant that genuinely overlaps the
  // centred slot moves it now, which on this estate means Important Links.
  if (fitsAt(centred)) return clamp(centred);

  // Otherwise: sit just below the occupant that is in the way.
  // The bands are already expanded by `WALL_RAIL_GAP_PX`, so a candidate at a
  // band's bottom edge IS 16px below the thing itself.
  //
  // Top-to-bottom, so with Important Links on the wall the first candidate is
  // the slot directly beneath it — which is also, on the website, the slot
  // directly above the corner widget. The two descriptions of the right
  // answer coincide, so satisfying one satisfies both.
  for (const band of merged) {
    if (fitsAt(band.bottom)) return clamp(band.bottom);
  }

  // Nothing fits below anything. Rare now that centred is tried first — it
  // needs an occupant that overlaps the centre AND leaves no room beneath —
  // so the remaining reading of the same intent is to sit just above. Bottom-
  // up, so the rail hugs the nearest obstacle rather than flying to the top.
  for (let i = merged.length - 1; i >= 0; i--) {
    const candidate = merged[i]!.top - railHeight;
    if (fitsAt(candidate)) return clamp(candidate);
  }

  // Neither side of anything works. Centred beats off-screen: an overlap is
  // recoverable, a widget outside the viewport is not.
  return clamp(centred);
}

function isVisible(el: Element): boolean {
  const cs = window.getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden") return false;
  return Number(cs.opacity) !== 0;
}

export interface WallRailOptions {
  /** Extra selectors to treat as occupants, on top of the built-ins. */
  selectors?: readonly string[];
  /** Custom property written on the ref'd element. */
  property?: string;
  /**
   * Custom property read from the element for the height to RESERVE. The rail
   * grows when it unfolds, and it is anchored by its top, so a band sized to
   * the folded height would let the open state run into the occupant below.
   * Declaring the reserve in CSS next to the heights it comes from keeps the
   * number from drifting away from them.
   */
  reserveProperty?: string;
}

/**
 * Keeps the ref'd element's `--sa-wall-rail-top` correct for what is
 * currently on the right wall.
 */
export function useWallRailOffset(
  ref: React.RefObject<HTMLElement | null>,
  options: WallRailOptions = {},
): void {
  const {
    selectors,
    property = "--sa-wall-rail-top",
    reserveProperty = "--sa-wall-rail-reserve",
  } = options;
  const selectorKey = (selectors ?? []).join(",");

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const allSelectors = [
      ...BUILT_IN_SELECTORS,
      ...(selectorKey ? selectorKey.split(",") : []),
    ];

    let frame: number | undefined;
    let scheduleTimer: number | undefined;
    let pollTimer: number | undefined;
    let attempts = 0;
    let disposed = false;

    const measure = () => {
      if (disposed) return;

      // A viewport of zero is not a viewport. A hidden or not-yet-laid-out
      // tab reports `innerHeight === 0`, and measuring against it produces a
      // placement clamped to the top margin that then STICKS — because the
      // recovery path is a rAF, and rAF does not fire in a background tab, so
      // nothing ever re-measures. Observed: the rail pinned at 24px on a
      // 900px page. Wait for a real viewport instead of committing a wrong
      // answer, and keep polling until there is one.
      if (window.innerHeight === 0 || window.innerWidth === 0) {
        pollTimer = window.setTimeout(measure, DISCOVERY_POLL_MS);
        return;
      }

      const found: Element[] = [];
      for (const selector of allSelectors) {
        let matches: NodeListOf<Element>;
        try {
          matches = document.querySelectorAll(selector);
        } catch {
          continue;
        }
        for (const match of matches) {
          if (match === element || element.contains(match)) continue;
          if (!found.includes(match)) found.push(match);
        }
      }

      const bands = found
        .filter(isVisible)
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.height > 0 && r.right >= window.innerWidth - WALL_ZONE_X_PX)
        .map((r) => ({ top: r.top, bottom: r.bottom }));

      const reserveRaw = window
        .getComputedStyle(element)
        .getPropertyValue(reserveProperty)
        .trim();
      const reserve = Number.parseFloat(reserveRaw);
      const railHeight =
        Number.isFinite(reserve) && reserve > 0 ? reserve : element.offsetHeight;

      const top = railTopFromOccupants(bands, railHeight, window.innerHeight);
      element.style.setProperty(property, `${top}px`);

      // Occupants are rendered by other zones and may mount after us.
      if (bands.length === 0 && attempts++ < DISCOVERY_MAX_ATTEMPTS) {
        pollTimer = window.setTimeout(measure, DISCOVERY_POLL_MS);
      }
    };

    // rAF coalesces bursts of mutations into one layout read, which is what
    // it is for — but IT NEVER FIRES WHILE THE TAB IS HIDDEN. Every re-measure
    // routed through it is therefore dropped in a background tab, including
    // the one that matters most: the occupant mounting late. Observed on the
    // website, where Important Links appears after the dock and the rail
    // stayed centred on top of it because the notification never arrived.
    //
    // So: rAF when it will actually run, a timer when it will not. The timer
    // is the same coalescing idea at a coarser grain, and both are guarded by
    // the single `frame`/`timer` slot so a burst still costs one read.
    function schedule() {
      if (disposed || frame !== undefined || scheduleTimer !== undefined) return;
      if (document.hidden) {
        scheduleTimer = window.setTimeout(() => {
          scheduleTimer = undefined;
          measure();
        }, 0);
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        measure();
      });
    }

    measure();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", measure);

    // Occupants mount, unmount and move between routes; a shallow childList
    // watch on <body> plus an attribute watch on the root covers both without
    // a subtree observer's cost.
    const bodyObserver = new MutationObserver(schedule);
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      if (scheduleTimer !== undefined) window.clearTimeout(scheduleTimer);
      if (pollTimer) window.clearTimeout(pollTimer);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", measure);
      bodyObserver.disconnect();
    };
  }, [ref, selectorKey, property, reserveProperty]);
}
