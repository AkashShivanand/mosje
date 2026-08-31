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
  ariaLabel,
  className,
  ...rest
}: FactStripProps): React.JSX.Element {
  return (
    <div
      className={cn("ds-fact-strip", overlap && "ds-fact-strip--overlap", className)}
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
