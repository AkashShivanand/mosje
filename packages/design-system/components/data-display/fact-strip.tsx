import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./fact-strip.css";

export interface FactStripItem {
  /** Material Symbols Rounded name, e.g. `"location_on"`. */
  icon: string;
  /** The fact itself — "New Delhi", "3", "2021". Rendered large. */
  value: string;
  /** What the fact is — "Headquarters", "Components". Rendered small. */
  label: string;
}

/**
 * THE COLUMN COUNT AN EXTENDED STRIP WRAPS TO, from the item count alone.
 *
 * Four, unless the count divides evenly by three and not by four — so six goes
 * 3x2 and nine goes 3x3, where eight and twelve go four across. The rule exists
 * to keep the LAST ROW FULL wherever the arithmetic allows it: a final row
 * holding two of four cells reads as a grid that ran out of content rather than
 * as a set, which is exactly what `auto-fit` produced for eight items (5 + 3).
 *
 * Above four columns the cell is too narrow for the extended layout to work at
 * all: an extended cell must hold a mark column AND the widest figure beside
 * it, and `345,703,321` alone measures 183px at `headline-2`.
 */
function extendedColumns(count: number): number {
  return count % 3 === 0 && count % 4 !== 0 ? 3 : 4;
}

export interface FactStripProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FactStripItem[];
  /**
   * Pull the card up so it straddles the band above it — the treatment used
   * under a page hero. Requires the band above to have room; on its own in a
   * plain section, leave it off.
   * @default false
   */
  overlap?: boolean;
  /**
   * WHICH SHAPE THE STRIP TAKES. Derived from the item count unless you say.
   *
   * `"compact"` — the treatment the handoff draws: as many 200px cells as the
   * width allows, on one row, each one a centred stack of mark over value over
   * label. Right for the three or four standing facts under a page hero.
   *
   * `"extended"` — for a set too long to sit on one row. The cells go to a
   * fixed, balanced column count and wrap; each one turns on its side, with the
   * mark in a column of its own and the value and label beside it; and the
   * value steps up from `headline-5` to `headline-2` so it reads as a figure
   * rather than as a line of text that happens to be numeric.
   *
   * THE DEFAULT IS THE COUNT, and the threshold is arithmetic rather than
   * taste. `minmax(200px, 1fr)` fits at most FIVE tracks in the widest content
   * column this estate has (1120px of grid inside the card), so six is the
   * first count that cannot be one row. At six the compact shape stops being a
   * strip and becomes a grid of identical tiles, which is a shape the eye has
   * to enter once per tile.
   *
   * Pass it only to override that — a six-item strip that must stay compact,
   * or a four-item one that must read as figures.
   *
   * @default `items.length > 5 ? "extended" : "compact"`
   */
  variant?: "compact" | "extended";
  /**
   * Names the list for assistive technology, e.g. "Key facts about PM-AJAY".
   * Required, because "New Delhi, Headquarters, 3, Components" read as a bare
   * run of text tells a screen-reader user nothing about what they belong to.
   */
  ariaLabel: string;
}

/**
 * FactStrip — the row of standing facts that sits under a page hero.
 *
 * NOT `MetricCard`. A metric is a measurement that moves and may carry a trend
 * — MetricCard exists for that and has the change pill to prove it. These are
 * *facts*: where the office is, how many components a scheme has, the year it
 * started. They never trend, so the two differ in what they may contain, not
 * only in how they look, and giving MetricCard a centred variant would have
 * put a change arrow one prop away from a headquarters address.
 *
 * ONE CARD, NOT A ROW OF CARDS. The items share a single surface. A row of
 * separate cards reads as four things to compare; this reads as one summary of
 * one organisation, which is what it is. (There is no rule between the cells —
 * the marks already give the row its rhythm, and vertical hairlines under a
 * hero add furniture to the calmest band on the page.)
 *
 * TWO SHAPES, CHOSEN BY THE ITEM COUNT — see `variant`. Up to five facts it is
 * a strip: one row of centred stacks. Above five it cannot be one row, so it
 * becomes a wrapped grid of side-on cells with the figure stepped up to read as
 * a figure. Nothing about the data changes between them.
 *
 * ACCESSIBILITY: renders as a `<dl>` — each fact is a label/value pair, and
 * that is exactly what a description list is for. The value comes first
 * visually via `order`, so the DOM keeps `<dt>` (label) before `<dd>` (value)
 * and the reading order stays "Headquarters: New Delhi".
 *
 * @example
 * <FactStrip
 *   overlap
 *   ariaLabel="Key facts about PM-AJAY"
 *   items={[
 *     { icon: "location_on", value: "New Delhi", label: "Headquarters" },
 *     { icon: "widgets", value: "3", label: "Components" },
 *   ]}
 * />
 */
export function FactStrip({
  items,
  overlap = false,
  variant,
  ariaLabel,
  className,
  style,
  ...rest
}: FactStripProps): React.JSX.Element {
  /*
   * Resolved ONCE, and everything downstream reads it — the class that picks
   * the layout and the column count that feeds it must never disagree about
   * which shape this is.
   */
  const shape = variant ?? (items.length > 5 ? "extended" : "compact");
  const columns = shape === "extended" ? extendedColumns(items.length) : undefined;

  return (
    <div
      className={cn(
        "ds-fact-strip",
        overlap && "ds-fact-strip--overlap",
        shape === "extended" && "ds-fact-strip--extended",
        className,
      )}
      style={
        columns != null
          ? ({ ...style, "--ds-fact-strip-columns": columns } as React.CSSProperties)
          : style
      }
      {...rest}
    >
      <dl className="ds-fact-strip__list" aria-label={ariaLabel}>
        {items.map((item) => (
          <div className="ds-fact-strip__item" key={item.label + item.value}>
            <span className="ds-fact-strip__icon" aria-hidden="true">
              <Icon name={item.icon} size={shape === "extended" ? 24 : 32} />
            </span>
            <dt className="ds-fact-strip__label">{item.label}</dt>
            <dd className="ds-fact-strip__value">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
