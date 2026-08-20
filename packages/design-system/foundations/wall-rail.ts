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

/**
 * Set on `<html>` when the wall cannot hold every widget at full size.
 * Occupants respond by shedding whatever they can — see `WALL_LABEL_ATTR`.
 */
export const WALL_COMPACT_ATTR = "data-sa-wall-compact";

/**
 * Marks the part of an occupant that may be dropped when the wall runs out
 * of room — a label, never an icon or a hit target. `wall-rail.css` hides
 * anything carrying it while the wall is compact.
 */
export const WALL_LABEL_ATTR = "data-sa-wall-label";

/**
 * An occupant's height WITH its label, declared rather than measured.
 *
 * This is what stops the mechanism oscillating. If the decision to go
 * compact were based on measured heights, then going compact would shrink
 * the occupants, which would make the wall fit, which would clear the flag,
 * which would restore the labels, which would overflow again — a loop with
 * a frame's period. Declared naturals do not change when the flag is
 * applied, so the input to the decision is stable and the state settles.
 */
export const WALL_NATURAL_ATTR = "data-sa-wall-natural";

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
 * Whether the wall can hold everything at full size.
 *
 * Deliberately a sum rather than a layout: the widgets are pinned at
 * different points and cannot be packed, so this asks the simpler question
 * "is there conceivably room", and the placement search below decides where
 * things actually go. Erring toward compact costs a label; erring the other
 * way costs an overlap.
 */
export function wallNeedsCompact(
  occupantNaturals: readonly number[],
  railReserve: number,
  viewportHeight: number,
): boolean {
  if (occupantNaturals.length === 0) return false;
  const items = [...occupantNaturals, railReserve];
  const gaps = WALL_RAIL_GAP_PX * (items.length - 1);
  const margins = WALL_RAIL_MARGIN_PX * 2;
  return items.reduce((a, b) => a + b, 0) + gaps + margins > viewportHeight;
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
  restHeight: number = railHeight,
): number {
  // CENTRED ON THE HEIGHT IT ACTUALLY HAS, not the height it reserves.
  //
  // These are two different numbers and conflating them is what made the rail
  // look wrong: it reserves its OPEN height (153) so the drawer has somewhere
  // to go, but it spends virtually all of its life FOLDED (56). Centring on
  // the reserve put the visible tab 48px above the true centre of the screen
  // — centred on nothing a viewer can see, which reads exactly as "hanging".
  //
  // So: centre on `restHeight`, and keep using `railHeight` for every FIT
  // test below, because the open state still has to land inside the viewport
  // and clear of the occupants. On a 900px viewport that puts the tab dead
  // centre at 422 and the open rail at 422-575, well inside the 876 floor.
  const centred = Math.round((viewportHeight - restHeight) / 2);
  // TAKES THE HEIGHT IT IS CLAMPING FOR, and rounds.
  //
  // It used to close over `railHeight` unconditionally, which silently undid
  // the resting-height fallback further down: that fallback picks a slot
  // sized to the FOLDED rail, and the clamp then pulled the answer back up to
  // leave room for the OPEN one — landing the tab squarely on the occupant it
  // had just been placed to avoid. Measured at 360px tall with Important
  // Links compacted: the fallback chose 219, the clamp returned 183, and the
  // rail overlapped by 20px.
  //
  // Rounding is here because occupant rects are fractional; an un-rounded
  // answer puts the rail on a half pixel and softens its 1px border.
  const clampFor = (v: number, height: number) =>
    Math.round(
      Math.min(
        Math.max(v, WALL_RAIL_MARGIN_PX),
        Math.max(WALL_RAIL_MARGIN_PX, viewportHeight - height - WALL_RAIL_MARGIN_PX),
      ),
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
  if (merged.length === 0) return clampFor(centred, railHeight);

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
  if (fitsAt(centred)) return clampFor(centred, railHeight);

  // Otherwise: sit just below the occupant that is in the way.
  // The bands are already expanded by `WALL_RAIL_GAP_PX`, so a candidate at a
  // band's bottom edge IS 16px below the thing itself.
  //
  // Top-to-bottom, so with Important Links on the wall the first candidate is
  // the slot directly beneath it — which is also, on the website, the slot
  // directly above the corner widget. The two descriptions of the right
  // answer coincide, so satisfying one satisfies both.
  for (const band of merged) {
    if (fitsAt(band.bottom)) return clampFor(band.bottom, railHeight);
  }

  // Nothing fits below anything. Rare now that centred is tried first — it
  // needs an occupant that overlaps the centre AND leaves no room beneath —
  // so the remaining reading of the same intent is to sit just above. Bottom-
  // up, so the rail hugs the nearest obstacle rather than flying to the top.
  for (let i = merged.length - 1; i >= 0; i--) {
    const candidate = merged[i]!.top - railHeight;
    if (fitsAt(candidate)) return clampFor(candidate, railHeight);
  }

  // The reserve does not fit anywhere. Before giving up, retry the whole
  // search against the height the rail ACTUALLY OCCUPIES at rest. That keeps
  // the visible tab clear of everything even on a wall too short for the
  // open drawer — the drawer may then overlap while it is open, which is a
  // transient the user asked for, rather than a permanent overlap they did
  // not.
  if (restHeight < railHeight) {
    const restFits = (top: number) =>
      top >= WALL_RAIL_MARGIN_PX &&
      top + restHeight <= viewportHeight - WALL_RAIL_MARGIN_PX &&
      merged.every((b) => top + restHeight <= b.top || top >= b.bottom);

    for (const band of merged) if (restFits(band.bottom)) return clampFor(band.bottom, restHeight);
    for (let i = merged.length - 1; i >= 0; i--) {
      const candidate = merged[i]!.top - restHeight;
      if (restFits(candidate)) return clampFor(candidate, restHeight);
    }
  }

  // Nothing clears at any size. Centred beats off-screen: an overlap is
  // recoverable, a widget outside the viewport is not. Clamped for the
  // RESTING height — keeping the visible tab on screen matters more than
  // reserving room for a drawer that has nowhere to go anyway.
  return clampFor(centred, restHeight);
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
  /**
   * Custom property for the widget's RESTING height — the one it shows almost
   * all of the time.
   *
   * Declared, never measured, and that is the whole point. It was measured
   * once, from `offsetHeight`, on the reasoning that a live read cannot drift
   * from the CSS. But the widget's own height CHANGES when it unfolds (56 to
   * 153 here), and the position is centred on this number — so every
   * re-measure that happened to land while the rail was open moved the rail
   * by 48px. Tapping a door did it every time: the panel mounts, the subtree
   * observer fires, and the rail jumps out from under the pointer.
   *
   * The anchor must not depend on the widget's transient state. A declared
   * value cannot.
   */
  restProperty?: string;
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
    restProperty = "--sa-wall-rail-rest",
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

      const visible = found.filter(isVisible);

      const reserveRaw = window
        .getComputedStyle(element)
        .getPropertyValue(reserveProperty)
        .trim();
      const reserve = Number.parseFloat(reserveRaw);
      const railHeight =
        Number.isFinite(reserve) && reserve > 0 ? reserve : element.offsetHeight;

      // The height to CENTRE on, DECLARED. Reading it from the live element
      // was a bug: the widget is 56 folded and 153 unfolded, so any
      // re-measure landing while it was open re-centred it 48px higher and
      // the rail jumped. See `restProperty`.
      const restRaw = window
        .getComputedStyle(element)
        .getPropertyValue(restProperty)
        .trim();
      const restDeclared = Number.parseFloat(restRaw);
      const restHeight =
        Number.isFinite(restDeclared) && restDeclared > 0
          ? restDeclared
          : element.offsetHeight || railHeight;

      // COMPACT FIRST, then place. The decision uses each occupant's declared
      // natural height, so applying it does not change its own input — see
      // WALL_NATURAL_ATTR for why that matters. Occupants with nothing to
      // shed declare nothing and contribute their measured height, which is
      // stable for the same reason.
      const naturals = visible
        .map((el) => {
          const r = el.getBoundingClientRect();
          if (r.right < window.innerWidth - WALL_ZONE_X_PX) return null;
          const declared = Number.parseFloat(el.getAttribute(WALL_NATURAL_ATTR) ?? "");
          return Number.isFinite(declared) && declared > 0 ? declared : r.height;
        })
        .filter((h): h is number => h !== null && h > 0);

      const compact = wallNeedsCompact(naturals, railHeight, window.innerHeight);
      const root = document.documentElement;
      if (compact) root.setAttribute(WALL_COMPACT_ATTR, "1");
      else root.removeAttribute(WALL_COMPACT_ATTR);

      // Re-read AFTER the flag, because a shed label changes the rect the
      // placement search has to dodge.
      const bands = visible
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.height > 0 && r.right >= window.innerWidth - WALL_ZONE_X_PX)
        .map((r) => ({ top: r.top, bottom: r.bottom }));

      const top = railTopFromOccupants(
        bands,
        railHeight,
        window.innerHeight,
        restHeight,
      );
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
      document.documentElement.removeAttribute(WALL_COMPACT_ATTR);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      if (scheduleTimer !== undefined) window.clearTimeout(scheduleTimer);
      if (pollTimer) window.clearTimeout(pollTimer);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", measure);
      bodyObserver.disconnect();
    };
  }, [ref, selectorKey, property, reserveProperty, restProperty]);
}
