import * as React from "react";
import { cn } from "../../../../utils/cn";
import { Button } from "../../../actions/button";
import { CardState, actionForState, type CardStateKind } from "../../../dashboard/card-state";
import { SegmentedControl } from "../../../dashboard/filter-bar";
import { ChartTextureDefs } from "./texture";
import type { ChartTable } from "../types";
import "../charts.css";

/** The table view never shows fewer rows than this, however short the chart it replaces. */
const TABLE_MIN_ROWS = 5;
/** One table row, in rem: the cell's padding and its body-3 line. Used only to size a page. */
const TABLE_ROW_REM = 2.125;
/** The header row and the pager, in rem — the part of the held height that holds no rows. */
const TABLE_CHROME_REM = 5.5;

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
  /* The library's Button, neutral and outlined — which is what this control was
     already drawing by hand: a white box with a neutral border and a semibold
     label. `.ds-chart__retry` now only carries the chart's smaller type. */
  const action =
    kind === "retry" && onRetry ? (
      <Button variant="neutral" appearance="outlined" size="sm" className="ds-chart__retry" onClick={onRetry}>
        Try again
      </Button>
    ) : kind === "clear" && onRetry ? (
      <Button variant="neutral" appearance="outlined" size="sm" className="ds-chart__retry" onClick={onRetry}>
        {filterLabel ? `Clear ${filterLabel}` : "Clear filters"}
      </Button>
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
  // The chart by default: it is the primary reading and the table is the way out
  // of it. Every hook sits above the `state` early-return, because a chart that
  // is loading today is a chart with a table tomorrow.
  const [view, setView] = React.useState<"chart" | "table">("chart");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(TABLE_MIN_ROWS);
  const [lockedHeight, setLockedHeight] = React.useState<number | undefined>(undefined);
  const viewRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const tableOpen = view === "table";
  /*
   * FIT THE PAGE TO THE ROWS AS DRAWN. The first page is sized from an estimate, then
   * corrected once the table is on screen from its own header, row and pager heights —
   * a rem estimate alone left a third of a map card empty below seven rows.
   */
  React.useLayoutEffect(() => {
    if (!tableOpen || !lockedHeight || !panelRef.current) return;
    const panel = panelRef.current;
    const head = panel.querySelector("thead")?.getBoundingClientRect().height ?? 0;
    const row = panel.querySelector("tbody tr")?.getBoundingClientRect().height ?? 0;
    const pager = panel.querySelector(".ds-chart__pager")?.getBoundingClientRect().height ?? 0;
    if (row <= 0) return;
    const fits = Math.max(TABLE_MIN_ROWS, Math.floor((lockedHeight - head - pager) / row));
    if (fits !== pageSize) setPageSize(fits);
  }, [tableOpen, lockedHeight, pageSize]);
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
  /* eslint-disable react-hooks/immutability -- MERGING A FORWARDED REF, which is
     the one thing that cannot be done without writing to a prop. The frame needs
     its own handle on the <svg> for the roving-tabindex effect below, and the
     caller may also have passed one; a callback ref that populates both is the
     documented React pattern for that, and React itself writes to `ref.current`
     the same way. The rule's objection — "modifying component props" — is right
     in general and has no alternative here: there is no pure way to hand a node
     back to a ref its owner gave us. Scoped to this callback only. */
  const setSvgRef = React.useCallback(
    (el: SVGSVGElement | null) => {
      ownSvgRef.current = el;
      if (typeof svgRef === "function") svgRef(el);
      else if (svgRef) (svgRef as React.MutableRefObject<SVGSVGElement | null>).current = el;
    },
    [svgRef],
  );
  /* eslint-enable react-hooks/immutability */
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

  /*
   * THE TABLE TAKES THE CHART'S PLACE, AT THE CHART'S SIZE. It used to open
   * BELOW the chart, so a card holding a 36-row map grew by 36 rows and pushed
   * its neighbours out of line — a dashboard whose layout depends on which
   * tables a reader has opened is not a layout. Now the switch swaps the view
   * in place: the chart's height is measured as the reader leaves it, the table
   * is held to at least that height, and its rows are paged to fit inside it.
   * Paged, never scrolled inside the card (`data-state-completeness.md` §4).
   */
  const showView = (next: "chart" | "table") => {
    if (next === "table" && viewRef.current) {
      // The wrapper is `display: contents` and has no box of its own, so its
      // height is the span of the boxes inside it: the canvas and the legend.
      const boxes = [...viewRef.current.children].map((el) => el.getBoundingClientRect()).filter((r) => r.height > 0);
      const h = boxes.length ? Math.max(...boxes.map((r) => r.bottom)) - Math.min(...boxes.map((r) => r.top)) : 0;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setLockedHeight(h);
      setPageSize(Math.max(TABLE_MIN_ROWS, Math.floor((h - TABLE_CHROME_REM * rem) / (TABLE_ROW_REM * rem))));
      setPage(0);
    }
    setView(next);
  };
  const rowCount = table?.rows.length ?? 0;
  const pages = Math.max(1, Math.ceil(rowCount / pageSize));
  const first = page * pageSize;
  const pageRows = table ? table.rows.slice(first, first + pageSize) : [];

  return (
    <figure className={cn("ds-chart", className)}>
      <div className="ds-chart__view" ref={viewRef} hidden={tableOpen}>
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
      </div>
      {table && tableView === "toggle" && tableOpen ? (
        <div
          ref={panelRef}
          className="ds-chart__tablepanel"
          id={tableId}
          style={lockedHeight ? ({ "--ds-chart-view-h": `${lockedHeight}px` } as React.CSSProperties) : undefined}
        >
          <div className="ds-chart__tablewrap">
            <table className="ds-chart__table">
              {/*
                THE CAPTION IS THE TABLE'S ACCESSIBLE NAME, AND IT IS NOT
                PAINTED. On a single-series chart the title, the series name
                and the value column's header are all the same string, so a
                visible caption prints it immediately above itself — "nothing
                said twice". A screen reader still gets the name.
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
                {pageRows.map((row, ri) => (
                  <tr key={first + ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 ? (
            <div className="ds-chart__pager">
              <p className="ds-chart__pagerstatus" aria-live="polite">
                Rows {first + 1}–{Math.min(first + pageSize, rowCount)} of {rowCount}
              </p>
              <Button variant="primary" appearance="text" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="primary" appearance="text" size="sm" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      {caption && <figcaption className="ds-chart__caption">{caption}</figcaption>}
      {table && tableView === "toggle" && (
        /* A VIEW SWITCH, NOT A DISCLOSURE. Chart and Table are two views of one
           figure, so the library's SegmentedControl — one tab stop, arrow keys
           between the views — in its QUIET variant, at the end of the row: it is
           there for the reader who wants the raw figures, not a choice the card
           is built around (feedback, 6 Oct 2026). */
        <SegmentedControl
          variant="quiet"
          className="ds-chart__viewswitch"
          ariaLabel={`Show ${title} as`}
          value={view}
          onChange={showView}
          options={[
            { value: "chart", label: "Chart" },
            { value: "table", label: "Table" },
          ]}
        />
      )}
      {/*
        EXACTLY ONE TABLE REACHES THE ACCESSIBILITY TREE. When the visible one
        is shown it IS the accessible one; otherwise the screen-reader copy, with
        every row, stands in. Rendering both would read the dataset out twice.
      */}
      {table && (tableView === "sr-only" || !tableOpen) && (
        /* The visually-hidden box is a DIV around the table, never the table itself: a table
           cannot be narrower than its content, so `width: 1px` on it is ignored and the hidden
           table still widened the page — 47px on a 375px phone under every chart (e-Anudaan
           screen crawl, 13 Sep 2026). A div honours the 1px box and clips what is inside. */
        <div className="ds-sr-only">
        <table>
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
        </div>
      )}
    </figure>
  );
}
