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
   * Fix the strip to this many columns instead of fitting as many 200px cells
   * as the width allows.
   *
   * Pass it when the item count has a shape the auto-fit cannot find. Eight
   * counters want 4×2; at the full content width the auto-fit lays five in the
   * first row and three in the second, which reads as a grid that ran out of
   * content rather than as two rows of four. Below 1024px the strip falls back
   * to two-up whatever is passed, because four 200px cells do not fit a tablet.
   */
  columns?: number;
  /**
   * How one cell is arranged. `"stack"` (default) centres icon over value over
   * label — the treatment the handoff draws for three or four standing facts
   * under a hero.
   *
   * `"inline"` sets the icon beside the copy and aligns the cell to the start,
   * so the eye travels along a row rather than around a tile. Use it once the
   * strip carries enough items to read as a grid of tiles — eight centred tiles
   * are eight things to look at, where eight left-aligned rows are two lines
   * that scan. It is also 35% shorter, which matters when the card straddles a
   * page header.
   *
   * @default "stack"
   */
  layout?: "stack" | "inline";
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
 * ONE CARD, NOT A ROW OF CARDS. The items share a single surface divided by
 * hairlines. A row of separate cards reads as four things to compare; this
 * reads as one summary of one organisation, which is what it is.
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
  columns,
  layout = "stack",
  ariaLabel,
  className,
  style,
  ...rest
}: FactStripProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "ds-fact-strip",
        overlap && "ds-fact-strip--overlap",
        columns != null && "ds-fact-strip--columns",
        layout === "inline" && "ds-fact-strip--inline",
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
              <Icon name={item.icon} size={32} />
            </span>
            <dt className="ds-fact-strip__label">{item.label}</dt>
            <dd className="ds-fact-strip__value">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
