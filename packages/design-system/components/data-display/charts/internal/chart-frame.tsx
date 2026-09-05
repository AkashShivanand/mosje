import * as React from "react";
import { cn } from "../../../../utils/cn";
import { CardState, actionForState, type CardStateKind } from "../../../dashboard/card-state";
import { ChartTextureDefs } from "./texture";
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
  /**
   * Whether the chart's data table is also reachable by a SIGHTED reader.
   * Default `"toggle"`. See `ChartFrameProps["tableView"]` for why.
   *
   * This sits on the shared base — which is otherwise about states — because
   * every chart already extends it, and a prop declared on the frame alone is
   * a prop no consumer can reach.
   */
  tableView?: "toggle" | "sr-only";
  /**
   * Emit the hatch-pattern `<defs>` this chart's series can point at, and pair
   * it with `texturedColor(i)` as each series' `color`.
   *
   * Texture is the encoding that survives colour-vision deficiency, print and
   * forced-colors — the three situations that take the categorical ramp's six
   * distinguishable slots away. See `internal/texture.tsx`.
   */
  textured?: boolean;
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
   * the marks' own labels through.
   *
   * It also switches on the frame's KEYBOARD MODEL. The marks form one roving
   * tab stop: Tab enters the chart at the first (or last-visited) mark, the
   * arrow keys move between marks, Home and End jump to the ends, and Escape
   * dismisses the tooltip without moving focus (see `onDismiss`). Before this
   * a thirty-bar chart was thirty Tab stops, which is not a traversal model
   * but a wall.
   */
  marksAreFocusable?: boolean;
  /**
   * Called on Escape while a mark has focus. Charts pass their tooltip
   * controller's `hide`, so a keyboard reader can close the tooltip and stay
   * where they are — `onBlur` alone would make them leave the chart to do it.
   */
  onDismiss?: () => void;
  /** SVG content. */
  children: React.ReactNode;
}

/** Every focusable mark inside a chart's SVG, in document order. */
function marksIn(svg: SVGSVGElement): SVGElement[] {
  return Array.from(svg.querySelectorAll<SVGElement>("[tabindex]"));
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
  tableView = "toggle",
  textured = false,
  legend,
  overlay,
  canvasRef,
  svgRef,
  className,
  svgClassName,
  marksAreFocusable = false,
  onDismiss,
  state,
  onRetry,
  filterLabel,
  children,
}: ChartFrameProps) {
  const titleId = React.useId();
  const descId = React.useId();
  const tableId = React.useId();
  // Closed by default: the chart is the primary reading and the table is the
  // way out of it. Both hooks sit above the `state` early-return, because a
  // chart that is loading today is a chart with a table tomorrow.
  const [tableOpen, setTableOpen] = React.useState(false);
  const labelledBy = summary ? `${titleId} ${descId}` : titleId;
  const aspect = aspectFromViewBox(viewBox);

  /*
   * ONE TAB STOP, NOT ONE PER MARK. The charts write `tabIndex={0}` on every
   * mark, which is right for discoverability and wrong for traversal; the frame
   * demotes all but one to -1 after each render and promotes whichever mark
   * the reader moves to. React never rewrites the attribute because the prop
   * it rendered has not changed, so the roving state survives re-renders.
   */
  const ownSvgRef = React.useRef<SVGSVGElement | null>(null);
  const setSvgRef = React.useCallback(
    (el: SVGSVGElement | null) => {
      ownSvgRef.current = el;
      if (typeof svgRef === "function") svgRef(el);
      else if (svgRef) (svgRef as React.MutableRefObject<SVGSVGElement | null>).current = el;
    },
    [svgRef],
  );
  React.useEffect(() => {
    if (!marksAreFocusable) return;
    const svg = ownSvgRef.current;
    if (!svg) return;
    const marks = marksIn(svg);
    if (marks.length === 0) return;
    const active = marks.indexOf(document.activeElement as SVGElement);
    const keep = active >= 0 ? active : 0;
    marks.forEach((m, i) => m.setAttribute("tabindex", i === keep ? "0" : "-1"));
  });
  const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (!marksAreFocusable) return;
    if (e.key === "Escape") {
      if (onDismiss) {
        e.preventDefault();
        onDismiss();
      }
      return;
    }
    const marks = marksIn(e.currentTarget);
    const idx = marks.indexOf(document.activeElement as SVGElement);
    if (idx < 0) return;
    let next: number;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % marks.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + marks.length) % marks.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = marks.length - 1;
    else return;
    e.preventDefault();
    marks.forEach((m, i) => m.setAttribute("tabindex", i === next ? "0" : "-1"));
    marks[next]?.focus();
  };

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
          ref={setSvgRef}
          viewBox={viewBox}
          className={cn("ds-chart__svg", svgClassName)}
          role={marksAreFocusable ? "group" : "img"}
          preserveAspectRatio="xMidYMid meet"
          aria-labelledby={labelledBy}
          onKeyDown={marksAreFocusable ? onKeyDown : undefined}
        >
          {/* Emitted only when asked for: a chart with no textured series should
              not carry six unused <pattern> definitions. */}
          {textured ? <ChartTextureDefs /> : null}
          <title id={titleId}>{title}</title>
          {summary && <desc id={descId}>{summary}</desc>}
          {children}
        </svg>
        {overlay}
      </div>
      {legend}
      {caption && <figcaption className="ds-chart__caption">{caption}</figcaption>}
      {table && tableView === "toggle" && (
        <>
          <button
            type="button"
            className="ds-chart__tabletoggle"
            aria-expanded={tableOpen}
            aria-controls={tableId}
            onClick={() => setTableOpen((v) => !v)}
          >
            {tableOpen ? "Hide Table" : "View as Table"}
          </button>
          {/*
            EXACTLY ONE TABLE REACHES THE ACCESSIBILITY TREE. When the visible
            one is open it IS the accessible one; when it is closed the
            screen-reader copy stands in. Rendering both would read the whole
            dataset out twice, which is the defect a naive "add a visible table"
            ships with.
          */}
          {tableOpen ? (
            <div className="ds-chart__tablewrap" id={tableId}>
              <table className="ds-chart__table">
                {/*
                  THE CAPTION IS THE TABLE'S ACCESSIBLE NAME, AND IT IS NOT
                  PAINTED. On a single-series chart the title, the series name
                  and the value column's header are all the same string, so a
                  visible caption prints it immediately above itself — "nothing
                  said twice". Sighted readers have the chart directly above and
                  the toggle they just pressed; a screen reader still gets the
                  name. Deleting it instead would leave the table unnamed.
                */}
                <caption className="ds-sr-only">{title}</caption>
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
            </div>
          ) : null}
        </>
      )}
      {table && (tableView === "sr-only" || !tableOpen) && (
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
