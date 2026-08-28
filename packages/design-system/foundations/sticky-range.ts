"use client";

import * as React from "react";

/**
 * Where a section-scoped toolbar rests, pins, and retires.
 *
 * A STICKY CONTROL'S JOB ENDS WHEN THE THING IT CONTROLS BECOMES THE THING BEING
 * READ. `position: sticky` alone releases at the CONTAINER's bottom edge, which
 * is far too late: the bar rides over the final row of cards for their whole
 * height, covering the very figures the reader scrolled down to see. Filtering
 * changes nothing they can still look at, so the bar is pure obstruction there.
 *
 * Three states, not two:
 *
 *   · `rest`    — in normal flow, above the fold of its own section.
 *   · `pinned`  — stuck under the masthead, because the section is being scanned.
 *   · `retired` — stuck but withdrawn, because the reader has reached the last
 *                 row and is reading it.
 *
 * THE TWO THRESHOLDS ARE DIFFERENT ON PURPOSE, and that is the part worth
 * keeping. It retires once the last row is HALF PAST the bar, and returns only
 * once that row is ENTIRELY below the bar again. One shared threshold would sit
 * exactly where the reader's micro-scrolls live and the bar would flicker in and
 * out of the top of the screen — the worst possible behaviour for a control
 * whose whole value is being predictable. The gap between the two lines is half
 * a row, which is far more than any accidental scroll.
 *
 * TWO OBSERVERS, NOT ONE, AND THIS IS THE PART THAT IS EASY TO GET WRONG. An
 * IntersectionObserver fires when a target crosses the ROOT's edge, and
 * `rootMargin` is what moves that edge — so one observer detects a crossing at
 * exactly ONE line. Sharing an observer and comparing `boundingClientRect.top`
 * against a second line inside the callback looks right and is not: between the
 * lines nothing crosses anything, no callback runs, and the second test is only
 * ever evaluated at stale positions.
 *
 * AND THE TARGETS MUST HAVE AREA, BUT ONLY 1PX OF IT. Two opposite traps meet
 * here. A zero-height element's intersection ratio is always 0, so it never
 * changes and the callback never runs again after the first — the marker looks
 * correct, reports once, then silently stops. But a TALL element stays
 * intersecting long after its top has passed the line, so it reports hundreds of
 * pixels late. One pixel is the only size that reports at the right moment.
 */
export type StickyState = "rest" | "pinned" | "retired";

export interface StickyRangeOptions {
  /** Distance from the viewport top the toolbar rests at. Must match its CSS `top`. */
  offset?: number;
  /** The toolbar's own height, so it retires as the row clears it rather than after. */
  height?: number;
  /**
   * Multiples of the viewport the governed content must exceed before pinning is
   * worth it at all. Below this nothing scrolls far enough to lose the toolbar,
   * and pinning is chrome charging rent. @default 1.5
   */
  minScroll?: number;
}

export function useStickyRange(
  startRef: React.RefObject<HTMLElement | null>,
  /** The grid. Only measured — its last child's height sets the hysteresis band. */
  gridRef: React.RefObject<HTMLElement | null>,
  /** A 1px marker immediately AFTER the grid. This is what gets observed. */
  endRef: React.RefObject<HTMLElement | null>,
  { offset = 64, height = 60, minScroll = 1.5 }: StickyRangeOptions = {},
): StickyState {
  const [started, setStarted] = React.useState(false);
  const [retired, setRetired] = React.useState(false);
  const [worthIt, setWorthIt] = React.useState(true);

  React.useEffect(() => {
    const start = startRef.current;
    const grid = gridRef.current;
    const end = endRef.current;
    const last = grid?.lastElementChild;
    if (!start || !grid || !end || !last || typeof IntersectionObserver === "undefined") return;

    const bar = offset + height;
    let observers: IntersectionObserver[] = [];

    /**
     * Fire when this 1px target's top crosses `line`.
     *
     * THE TARGET MUST BE SHORT, and that is not a detail. A tall element stays
     * intersecting long after its TOP has passed the line — the observer fires
     * when its BOTTOM crosses, hundreds of pixels later. Observing the last card
     * directly looked obviously right and was wrong for exactly that reason: the
     * retire state was never reached on any row taller than the threshold, which
     * is every row. Observe a marker at a known edge and do the arithmetic here.
     */
    const watch = (el: Element, line: number, onCross: (above: boolean) => void) => {
      const o = new IntersectionObserver(
        ([e]) => onCross(e!.boundingClientRect.top < line),
        // `-line`, not `Math.max(0, -line)`: a threshold above the viewport top
        // is legitimate, and `rootMargin` expresses it by EXPANDING the root.
        { rootMargin: `${-line}px 0px 0px 0px`, threshold: 0 },
      );
      o.observe(el);
      observers.push(o);
    };

    const wire = () => {
      observers.forEach((o) => o.disconnect());
      observers = [];

      const span = grid.getBoundingClientRect().bottom - start.getBoundingClientRect().top;
      setWorthIt(span > window.innerHeight * minScroll);

      watch(start, offset, setStarted);

      // The end marker sits at the last row's BOTTOM edge, so the row's own
      // height converts that into the two lines we actually care about.
      // Measured, because the last row is a map on one dashboard and a grid of
      // figures on another.
      const rowHeight = last.getBoundingClientRect().height;

      // Row half past the bar ⇔ its bottom is within half a row of the bar.
      watch(end, bar + rowHeight / 2, (above) => {
        if (above) setRetired(true);
      });
      /*
       * Row entirely below the bar ⇔ its bottom is a full row below it — BUT
       * CAPPED AT WHAT THE VIEWPORT CAN ACTUALLY SHOW.
       *
       * Without the cap this is unreachable on any screen where the row is
       * taller than the space under the bar: the condition can never become
       * true, so the toolbar retires once and never returns. A tall card on a
       * laptop is exactly that case. The cap degrades it to "as fully visible
       * as this screen allows", which is the same intent honoured by a smaller
       * screen rather than abandoned.
       */
      const returnLine = Math.min(bar + rowHeight, window.innerHeight - 48);
      watch(end, returnLine, (above) => {
        if (!above) setRetired(false);
      });
    };

    wire();
    const ro = new ResizeObserver(wire);
    ro.observe(last);
    window.addEventListener("resize", wire);

    return () => {
      observers.forEach((o) => o.disconnect());
      ro.disconnect();
      window.removeEventListener("resize", wire);
    };
  }, [startRef, gridRef, endRef, offset, height, minScroll]);

  if (!worthIt || !started) return "rest";
  return retired ? "retired" : "pinned";
}
