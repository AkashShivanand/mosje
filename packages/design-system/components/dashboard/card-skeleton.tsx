import * as React from "react";
import { cn } from "../../utils/cn";
import "./card-skeleton.css";

/**
 * The silhouette a loading card should wear.
 *
 * A skeleton earns its place by sharing the shape of what is coming: the layout
 * does not jump when the data lands, and the reader already knows what kind of
 * thing to expect. A donut card that shimmers as a bar chart does neither — it
 * promises the wrong picture and then replaces it, which is worse than a plain
 * grey block because it was specific and wrong.
 */
export type CardSkeletonShape =
  /** Vertical bars on a baseline. Bar and column charts. */
  | "bars"
  /** A rising series with points. Line, area and combo charts. */
  | "line"
  /** A ring. Donut, pie and gauge. */
  | "donut"
  /** Label, track, value. Ranked lists, funnels, progress rows. */
  | "rows"
  /** A soft region. Maps and anything with no chart geometry to promise. */
  | "region"
  /** Figures over a rule. Reference grids and figure pairs. */
  | "figures";

/** Fixed, never random: a skeleton that reshuffles reads as data arriving and being withdrawn. */
const BAR_HEIGHTS = [62, 88, 45, 96, 71, 54, 80];
const ROW_WIDTHS = [92, 74, 61, 48, 37];

export interface CardSkeletonProps {
  shape?: CardSkeletonShape;
  className?: string;
}

/**
 * MoSJE / SAMAVESH CardSkeleton — a shaped loading placeholder.
 *
 * Rendered by `ChartCard` from its `skeleton` prop; reach for it directly only
 * outside a card. Every shape shimmers on the same clock and staggers on the
 * same 90ms step, so a dashboard of six loading cards reads as one page
 * arriving rather than six independent spinners.
 */
export function CardSkeleton({ shape = "bars", className }: CardSkeletonProps) {
  return (
    <div
      className={cn("ds-skel", `ds-skel--${shape}`, className)}
      aria-hidden="true"
    >
      {shape === "bars" &&
        BAR_HEIGHTS.map((h, i) => (
          <span
            key={h}
            className="ds-skel__bar"
            style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}

      {shape === "line" && (
        <svg
          className="ds-skel__svg"
          viewBox="0 0 300 120"
          preserveAspectRatio="none"
        >
          {[24, 60, 96].map((y) => (
            <path key={y} d={`M0 ${y}h300`} className="ds-skel__grid" />
          ))}
          <path
            d="M4 96 L52 62 L100 78 L148 34 L196 52 L244 20 L296 40"
            className="ds-skel__path"
            pathLength={1}
          />
        </svg>
      )}

      {shape === "donut" && <span className="ds-skel__ring" />}

      {shape === "rows" &&
        ROW_WIDTHS.map((w, i) => (
          <span key={w} className="ds-skel__row" style={{ animationDelay: `${i * 90}ms` }}>
            <span className="ds-skel__row-label" />
            <span className="ds-skel__row-track" style={{ width: `${w}%` }} />
          </span>
        ))}

      {shape === "region" && <span className="ds-skel__region" />}

      {shape === "figures" &&
        [0, 1, 2, 3].map((i) => (
          <span key={i} className="ds-skel__figure" style={{ animationDelay: `${i * 90}ms` }}>
            <span className="ds-skel__figure-value" />
            <span className="ds-skel__figure-label" />
          </span>
        ))}
    </div>
  );
}
