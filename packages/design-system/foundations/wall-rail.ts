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
 * So the position is measured. The rail finds the largest free vertical band
 * on the wall and centres itself in the one nearest the middle of the screen.
 * On the docs that is the whole viewport, so it sits centred, exactly as
 * before. On the website it sits clear of Important Links, visibly, because
 * something is genuinely there.
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

const BUILT_IN_SELECTORS = [`[${WALL_OCCUPANT_ATTR}]`];

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

  if (merged.length === 0) return clamp(centred);

  // The gaps between obstacles, bounded by the viewport's own margins.
  const free: Band[] = [];
  let cursor = WALL_RAIL_MARGIN_PX;
  for (const band of merged) {
    if (band.top > cursor) free.push({ top: cursor, bottom: band.top });
    cursor = Math.max(cursor, band.bottom);
  }
  const floor = viewportHeight - WALL_RAIL_MARGIN_PX;
  if (cursor < floor) free.push({ top: cursor, bottom: floor });

  const fits = free.filter((b) => b.bottom - b.top >= railHeight);
  // Nothing fits: stay centred rather than wedge the rail off-screen. An
  // overlap is recoverable; a widget outside the viewport is not.
  if (fits.length === 0) return clamp(centred);

  // Of the bands that fit, take the one whose centre is nearest the middle of
  // the screen — so the rail stays as close to where the eye expects it as
  // the obstacles allow, rather than always jumping to the top.
  const mid = viewportHeight / 2;
  let best = fits[0]!;
  let bestDistance = Infinity;
  for (const band of fits) {
    const distance = Math.abs((band.top + band.bottom) / 2 - mid);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = band;
    }
  }

  return clamp(Math.round((best.top + best.bottom - railHeight) / 2));
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
    let pollTimer: number | undefined;
    let attempts = 0;
    let disposed = false;

    const measure = () => {
      if (disposed) return;

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

    function schedule() {
      if (disposed || frame !== undefined) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        measure();
      });
    }

    measure();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });

    // Occupants mount, unmount and move between routes; a shallow childList
    // watch on <body> plus an attribute watch on the root covers both without
    // a subtree observer's cost.
    const bodyObserver = new MutationObserver(schedule);
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      if (pollTimer) window.clearTimeout(pollTimer);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      bodyObserver.disconnect();
    };
  }, [ref, selectorKey, property, reserveProperty]);
}
