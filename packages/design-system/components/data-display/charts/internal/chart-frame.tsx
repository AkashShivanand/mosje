import * as React from "react";
import { cn } from "../../../../utils/cn";
import { CardState, actionForState, type CardStateKind } from "../../../dashboard/card-state";
import type { ChartTable } from "../types";
import "../charts.css";

/**
 * The states a chart can be in, beyond drawing.
 *
 * `.claude/rules/data-state-completeness.md` names loading, empty, error and
 * filtered-to-nothing as "the four that get skipped", and an audit on
 * 2026-09-02 found all four skipped across all seventeen charts: zero had a
 * loading state, zero had an error state, six had no empty state at all, and
 * every one that did hard-coded `kind="empty"` — so a reader who had filtered
 * their own selection away was told "Nothing to show yet" with no way back.
 *
 * That was never seventeen bugs. Thirteen charts already render through this
 * frame, so it is one place, and this is it.
 */
export type ChartState = "loading" | CardStateKind;

/**
 * The three props every chart forwards, unchanged, to its state layer.
 *
 * Declared once and extended, rather than restated fifteen times, so a chart
 * cannot accept `state` and quietly drop `filterLabel` — which is exactly how a
 * reader ends up being told "No matches" with no way to find out which filter
 * matched nothing.
 */
export interface ChartStateProps {
  /**
   * What to render INSTEAD of the marks. Omit for the populated state.
   *
   * `"loading"` draws a skeleton at the chart's own aspect ratio, so the layout
   * does not jump when the figures land. `"no-results"` is deliberately
   * separate from `"empty"`: "the feed published nothing" and "your filter
   * excluded everything" are different sentences with different remedies, and a
   * chart that renders one for both is lying about one of them.
   */
  state?: ChartState;
  /** Offered on `"error"`. A feed being down is an expected state with a retry, not an exception. */
  onRetry?: () => void;
  /** Named on `"no-results"` so the reader can undo the filter they applied. */
  filterLabel?: string;
}

export interface ChartFrameProps extends ChartStateProps {
  /** Accessible name — rendered as <title> and the SR table caption. */
  title: string;
  /** Short SR summary rendered as <desc> (e.g. "Male 56%, Female 44%"). */
  summary?: string;
  /** Optional visible caption under the chart. */
  caption?: React.ReactNode;
  /** SVG internal coordinate system, e.g. "0 0 480 240". */
  viewBox: string;
  /** Screen-reader data-table equivalent (the accessible source of truth). */
  table?: ChartTable;
  /** Decorative legend node (rendered below the canvas). */
  legend?: React.ReactNode;
  /** Floating overlay inside the positioned canvas (e.g. <ChartTooltip />). */
  overlay?: React.ReactNode;
  /** Ref forwarded to the positioned canvas (for tooltip coordinate maths). */
  canvasRef?: React.Ref<HTMLDivElement>;
  /**
   * Ref forwarded to the <svg> itself.
   *
   * For charts that map a pointer BACK into viewBox units — `IndiaPointMap`
   * resolves which of ~1,000 hex bins is under the cursor without giving each
   * one a DOM node, which needs `getScreenCTM()` on the element that owns the
   * coordinate system.
   */
  svgRef?: React.Ref<SVGSVGElement>;
  className?: string;
  /** Extra class on the <svg>. */
  svgClassName?: string;
  /**
   * Set when the chart puts `tabIndex` on its marks.
   *
   * `role="img"` exposes the SVG as ONE atomic node and prunes everything under
   * it from the accessibility tree — which is right for a static chart whose
   * accessible equivalent is the screen-reader table, and wrong the moment a
   * mark becomes focusable. Nine charts here put `tabIndex={0}` and an
   * `aria-label` on every bar, point, cell or region; inside `role="img"` those
   * labels are pruned, so a keyboard reader tabbed through thirty stops that
   * announced nothing at all.
   *
   * `role="group"` keeps the accessible name from `<title>`/`<desc>` and lets
   * the marks' own labels through. It is not a full traversal model — arrow-key
   * roving across marks is still to build, and the pages say so — but a named
   * stop is strictly better than a nameless one.
   */
  marksAreFocusable?: boolean;
  /** SVG content. */
  children: React.ReactNode;
}

/**
 * The chart's own proportions, so a skeleton or an empty state occupies exactly
 * the space the figures will. A fixed 220px placeholder in front of a
 * responsive chart is the layout shift the rule exists to prevent.
 */
function aspectFromViewBox(viewBox: string): string | undefined {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  if (parts.length !== 4) return undefined;
  const [, , w, h] = parts;
  if (!w || !h || !Number.isFinite(w) || !Number.isFinite(h)) return undefined;
  return `${w} / ${h}`;
}

export interface ChartStateFigureProps extends ChartStateProps {
  /** Required here — this component IS the state; `ChartFrame` decides whether to reach for it. */
  state: ChartState;
  /** Announced on the skeleton and used as the accessible name of the state. */
  title: string;
  /**
   * The chart's own proportions as a CSS `aspect-ratio`, so the state occupies
   * exactly the space the figures will. Omit only where the chart genuinely has
   * none to give — `FunnelChart` draws in the DOM rather than in an SVG — and a
   * floor is used instead.
   */
  aspect?: string;
  caption?: React.ReactNode;
  className?: string;
}

/**
 * The state layer, on its own.
 *
 * `ChartFrame` renders this whenever `state` is set, and the charts that do NOT
 * draw through a frame — `FunnelChart` is a DOM list, not an SVG — render it
 * directly, so a funnel with nothing to show is the same object on the page as a
 * bar chart with nothing to show. Two hand-rolled empty states that merely
 * resemble each other drift apart on the first copy change.
 */
export function ChartStateFigure({
  state,
  title,
  onRetry,
  filterLabel,
  aspect,
  caption,
  className,
}: ChartStateFigureProps) {
  /*
   * `actionForState` decides whether an action can resolve this state at all,
   * so a control is offered only where pressing it would do something. An
   * "empty" card with a Retry button invites a reader to press it forever.
   */
  const kind = state === "loading" ? null : actionForState(state);
  const action =
    kind === "retry" && onRetry ? (
      <button type="button" className="ds-chart__retry" onClick={onRetry}>
        Try again
      </button>
    ) : kind === "clear" && onRetry ? (
      <button type="button" className="ds-chart__retry" onClick={onRetry}>
        {filterLabel ? `Clear ${filterLabel}` : "Clear filters"}
      </button>
    ) : null;
  // "Filtered to nothing" names the filter, because the reader caused this
  // state and is the only one who can undo it.
  const description =
    state === "no-results" && filterLabel
      ? `No figures match the current ${filterLabel}.`
      : undefined;
  return (
    <figure className={cn("ds-chart", "ds-chart--state", className)}>
      <div
        className={cn(
          "ds-chart__canvas",
          "ds-chart__canvas--state",
          !aspect && "ds-chart__canvas--state-floor",
        )}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        {state === "loading" ? (
          <div className="ds-chart__skeleton" role="status">
            {/* Named, so the wait is announced as deliberate rather than as silence. */}
            <span className="ds-sr-only">Loading {title}</span>
            <span className="ds-chart__skeleton-bars" aria-hidden="true" />
          </div>
        ) : (
          <CardState
            kind={state}
            compact
            {...(description ? { description } : {})}
            {...(action ? { action } : {})}
          />
        )}
      </div>
      {caption && <figcaption className="ds-chart__caption">{caption}</figcaption>}
    </figure>
  );
}

/**
 * Shared accessible chart shell. Standardises the figure → relative canvas →
 * role="img" (or role="group" where the marks are focusable — see
 * `marksAreFocusable`) SVG with <title>/<desc> → screen-reader <table> so every
 * chart in the catalogue is WCAG 2.1 AA / GIGW compliant by construction.
 */
export function ChartFrame({
  title,
  summary,
  caption,
  viewBox,
  table,
  legend,
  overlay,
  canvasRef,
  svgRef,
  className,
  svgClassName,
  marksAreFocusable = false,
  state,
  onRetry,
  filterLabel,
  children,
}: ChartFrameProps) {
  const titleId = React.useId();
  const descId = React.useId();
  const labelledBy = summary ? `${titleId} ${descId}` : titleId;
  const aspect = aspectFromViewBox(viewBox);

  if (state) {
    return (
      <ChartStateFigure
        state={state}
        title={title}
        onRetry={onRetry}
        filterLabel={filterLabel}
        aspect={aspect}
        caption={caption}
        className={className}
      />
    );
  }

  return (
    <figure className={cn("ds-chart", className)}>
      <div className="ds-chart__canvas" ref={canvasRef}>
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className={cn("ds-chart__svg", svgClassName)}
          role={marksAreFocusable ? "group" : "img"}
          preserveAspectRatio="xMidYMid meet"
          aria-labelledby={labelledBy}
        >
          <title id={titleId}>{title}</title>
          {summary && <desc id={descId}>{summary}</desc>}
          {children}
        </svg>
        {overlay}
      </div>
      {legend}
      {caption && <figcaption className="ds-chart__caption">{caption}</figcaption>}
      {table && (
        <table className="ds-sr-only">
          <caption>{title}</caption>
          <thead>
            <tr>
              {table.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}
