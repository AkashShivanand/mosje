import * as React from "react";

import { cn } from "../../../utils/cn";
import "./small-multiples.css";

export interface SmallMultiplesProps<T> {
  /** The whole grid's heading, e.g. "Grants Released by State". */
  title: string;
  items: T[];
  /** One panel's caption. */
  labelOf: (item: T) => string;
  /**
   * Every value the panel will plot. Used ONLY to compute the shared ceiling —
   * see the note below on why this is not optional.
   */
  valuesOf: (item: T) => number[];
  /**
   * Draw one panel. Receives the item and the ceiling EVERY panel must use.
   *
   * Pass `sharedMax` into the chart's own `max`/domain. A panel that computes
   * its own scale is the defect this component exists to prevent.
   *
   * **Give each panel `tableView="sr-only"`.** Every chart offers a visible
   * "View as Table" control by default, which is right for one chart and wrong
   * for a grid — twenty-eight panels would carry twenty-eight links. The screen
   * reader table stays on every panel either way; it is only the visible
   * control that is suppressed.
   */
  renderItem: (item: T, sharedMax: number) => React.ReactNode;
  /** Panels per row on a wide viewport. @default 4 */
  columns?: 2 | 3 | 4 | 6;
  /** Rendered when `items` is empty. */
  emptyLabel?: string;
  className?: string;
}

/**
 * SAMAVESH SmallMultiples — the same chart, once per category, on one scale.
 *
 * **This is the answer to running out of colours.** The categorical ramp has
 * exactly six mutually distinguishable slots (`CHART_CATEGORICAL_SAFE_CAP`, and
 * `tools/chart-palette/search.mjs` proves six is the ceiling for any palette at
 * this estate's saturation). A chart of twenty-eight states cannot be coloured;
 * drawn as twenty-eight panels it needs no colour at all, because position
 * carries the identity and the caption says which is which.
 *
 * It is also the honest way to show a per-state or per-scheme breakdown that
 * would otherwise become a stacked bar nobody can read.
 *
 * ── THE ONE RULE, AND WHY IT IS A PROP RATHER THAN A SUGGESTION ─────────────
 *
 * **Every panel shares one scale.** Small multiples work because the eye
 * compares panel against panel; the instant each panel scales to its own
 * maximum, a state with 40 beneficiaries draws an identical bar to one with
 * 40,000 and the grid becomes actively misleading — worse than no chart, because
 * it looks rigorous.
 *
 * That is why `valuesOf` is required and `renderItem` is handed `sharedMax`
 * rather than being trusted to work it out. The component cannot force a caller
 * to use it, but it can make ignoring it a visible choice rather than an
 * oversight.
 */
export function SmallMultiples<T>({
  title,
  items,
  labelOf,
  valuesOf,
  renderItem,
  columns = 4,
  emptyLabel = "No figures to compare.",
  className,
}: SmallMultiplesProps<T>): React.JSX.Element {
  const sharedMax = React.useMemo(() => {
    let max = 0;
    for (const item of items) {
      for (const v of valuesOf(item)) {
        if (Number.isFinite(v) && v > max) max = v;
      }
    }
    // A grid where everything is zero still needs a non-zero denominator, or
    // every panel divides by nought and renders NaN widths.
    return max > 0 ? max : 1;
    // `valuesOf` is a prop and is usually an inline arrow, so depending on it
    // would recompute on every render. The values come from `items`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <section className={cn("ds-smallmult", className)} aria-label={title}>
      {items.length === 0 ? (
        <p className="ds-smallmult__empty">{emptyLabel}</p>
      ) : (
        <>
          {/*
            One sentence, once, for the whole grid — a screen-reader user should
            not have to infer that twenty-eight panels share an axis, and a
            sighted reader cannot see it either.
          */}
          <p className="ds-smallmult__scale-note">
            All panels share the same scale, to a maximum of{" "}
            {sharedMax.toLocaleString("en-IN")}.
          </p>
          <ul className={cn("ds-smallmult__grid", `is-cols-${columns}`)}>
            {items.map((item, i) => (
              <li key={labelOf(item) || i} className="ds-smallmult__panel">
                <h3 className="ds-smallmult__panel-title">{labelOf(item)}</h3>
                {renderItem(item, sharedMax)}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
