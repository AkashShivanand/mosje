"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { ChartStateFigure, type ChartStateProps } from "./internal/chart-frame";
import { formatIndian, type ValueFormat } from "./internal/format";
import { Pagination } from "../../navigation/pagination";
import { withheldLabel, type ChartWithheld, type StatusTone } from "./types";
import "./ranked-bar-list.css";

export interface RankedBarItem {
  label: string;
  /** Ignored where `withheld` is set. */
  value: number;
  /** A second reading beside the value — "₹9.2L of ₹30L", "(35%)". */
  detail?: string;
  /** A status ink for this row's bar. Set only against a stated threshold. */
  tone?: StatusTone;
  /** Makes the label a link — the row is the way into a state or district. */
  href?: string;
  withheld?: ChartWithheld;
}

export interface RankedBarListProps extends ChartStateProps {
  /** Accessible name of the list. */
  title: string;
  items: RankedBarItem[];
  /**
   * Pin the ceiling every bar is drawn against. Defaults to the largest value
   * in the list, which is right for a ranking and wrong for a percentage —
   * pass `100` so a 58% bar is drawn at 58% of the track, not at full width
   * because it happens to be the highest.
   */
  max?: number;
  valueFormat?: ValueFormat;
  /** Number the rows. On by default for a ranking; off for a breakdown. */
  showRank?: boolean;
  /** How the rows are ordered. Withheld rows always sort last. @default "desc" */
  sort?: "desc" | "asc" | "none";
  /**
   * Rows per page. A list longer than this PAGES — it never scrolls inside its
   * card, because on a phone a reader flicking the page down lands in the list
   * and moves the list instead (`data-state-completeness.md` §4).
   */
  pageSize?: number;
  /** Derive a tone from the row — the threshold rule, stated once. */
  toneFor?: (item: RankedBarItem, index: number) => StatusTone;
  caption?: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH RankedBarList — a label, a figure and a thin bar per row.
 *
 * The most-drawn chart in the portal handoffs and, until now, the one the
 * design system did not have: "Top States by Pledges", "SLA Compliance by
 * District", "Category Distribution", "District-wise Fund Utilisation" are all
 * this component. It is NOT a `BarChart`: the figure is printed beside each
 * row, so the bar is a visual aid to the text rather than the encoding — which
 * is why the bar is `aria-hidden` and the list itself is the accessible
 * reading, an ordered list whose order IS the ranking.
 */
export function RankedBarList({
  title,
  items,
  max,
  valueFormat = formatIndian,
  showRank = true,
  sort = "desc",
  pageSize,
  toneFor,
  caption,
  className,
  state,
  onRetry,
  filterLabel,
}: RankedBarListProps) {
  const [page, setPage] = React.useState(1);

  const resolved = state ?? (items.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartStateFigure
        state={resolved}
        title={title}
        onRetry={onRetry}
        filterLabel={filterLabel}
        caption={caption}
        className={className}
      />
    );

  const sorted =
    sort === "none"
      ? items
      : [...items].sort((a, b) => {
          if (a.withheld && !b.withheld) return 1;
          if (b.withheld && !a.withheld) return -1;
          return sort === "desc" ? b.value - a.value : a.value - b.value;
        });
  const ceiling =
    Math.max(max ?? 0, ...sorted.filter((i) => !i.withheld).map((i) => i.value), 0) || 1;

  const totalPages = pageSize && pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  // Page resets DURING render when the row count shrinks beneath it, for the
  // same reason DataTable does: an effect would paint the empty page once first.
  const current = Math.min(page, totalPages);
  if (current !== page) setPage(current);
  const offset = pageSize ? (current - 1) * pageSize : 0;
  const visible = pageSize ? sorted.slice(offset, offset + pageSize) : sorted;

  return (
    <figure className={cn("ds-ranked", className)}>
      <ol className="ds-ranked__list" aria-label={title}>
        {visible.map((item, i) => {
          const index = offset + i;
          const tone = item.tone ?? toneFor?.(item, index) ?? "neutral";
          const pct = item.withheld ? 0 : Math.max(0, Math.min(100, (item.value / ceiling) * 100));
          return (
            <li
              key={`${item.label}-${index}`}
              className={cn("ds-ranked__row", tone !== "neutral" && `ds-ranked__row--${tone}`)}
            >
              <div className="ds-ranked__head">
                {showRank && (
                  /* The ordered list already speaks the position; the badge is
                     the printed form of the same number. */
                  <span className="ds-ranked__rank" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
                {item.href ? (
                  <a className="ds-ranked__label" href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <span className="ds-ranked__label">{item.label}</span>
                )}
                <span className="ds-ranked__value">
                  {item.withheld ? (
                    <>
                      <span aria-hidden="true">—</span>
                      <span className="ds-sr-only">{withheldLabel(item.withheld)}</span>
                    </>
                  ) : (
                    valueFormat(item.value)
                  )}
                  {item.detail && <span className="ds-ranked__detail">{item.detail}</span>}
                </span>
              </div>
              <div
                className={cn("ds-ranked__track", item.withheld && "ds-ranked__track--withheld")}
                aria-hidden="true"
              >
                {!item.withheld && <div className="ds-ranked__fill" style={{ width: `${pct}%` }} />}
              </div>
            </li>
          );
        })}
      </ol>
      {caption && <figcaption className="ds-ranked__caption">{caption}</figcaption>}
      {totalPages > 1 && (
        <Pagination
          className="ds-ranked__pages"
          page={current}
          totalPages={totalPages}
          onPageChange={setPage}
          label={`${title}, pages`}
          size="sm"
        />
      )}
    </figure>
  );
}

export interface InlineBarProps {
  value: number;
  max: number;
  tone?: StatusTone;
  /**
   * Give the bar an accessible name ONLY where the figure is not already
   * printed beside it. In a table cell that also prints "78%", the bar is a
   * repeat and stays hidden from assistive technology.
   */
  label?: string;
  valueFormat?: ValueFormat;
  className?: string;
}

/**
 * The ranked list's bar on its own, sized for a table cell — the
 * "Utilisation" column of a state comparison table. Same track, same fill,
 * same tones, so a cell and a list beside it read as one family.
 */
export function InlineBar({
  value,
  max,
  tone,
  label,
  valueFormat = formatIndian,
  className,
}: InlineBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const a11y = label
    ? { role: "img" as const, "aria-label": `${label}: ${valueFormat(value)} of ${valueFormat(max)}` }
    : { "aria-hidden": true as const };
  return (
    <span
      className={cn("ds-inline-bar", tone && tone !== "neutral" && `ds-inline-bar--${tone}`, className)}
      {...a11y}
    >
      <span className="ds-inline-bar__fill" style={{ width: `${pct}%` }} />
    </span>
  );
}
