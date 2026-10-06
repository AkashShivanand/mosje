"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { sequentialColor, CHART_INK } from "./internal/palette";
import { sequentialScale, type SequentialLegendKind, type SequentialScaleKind } from "./internal/sequential-scale";
import { normalizeRegionName } from "./geo/india-projection";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import { INDIA_STATES_PATHS, INDIA_STATES_VIEWBOX } from "./geo/india-states.paths";

export interface IndiaMapDatum {
  /** State name. Matched case-insensitively; "and"/"&" are interchangeable. */
  state: string;
  value: number;
}

export interface IndiaMapProps extends ChartStateProps {
  data: IndiaMapDatum[];
  title: string;
  valueFormat?: ValueFormat;
  /** Outline a state by name (e.g. the user's own state). */
  highlightState?: string;
  /**
   * How a figure maps to a shade. `linear` shades by value; `quantile` puts an equal number
   * of States/UTs in each of five shades — use it for a skewed reading, where two outliers
   * would otherwise wash the other thirty-four out to the palest step. @default "linear"
   */
  scale?: SequentialScaleKind;
  /** `steps` names every range; `ramp` is one line, low to high, for a map inside a card. @default "steps" */
  legend?: SequentialLegendKind;
  /** The figures in the legend, where the unit is already in the title. Defaults to `valueFormat`. */
  legendFormat?: ValueFormat;
  /** The State/UT drawn as chosen — an outline, and `aria-pressed` when regions are buttons. */
  selected?: string;
  /** Makes every State/UT a button that chooses it. */
  onSelect?: (state: string) => void;
  className?: string;
}

const normalize = normalizeRegionName;

/**
 * STATES/UTS TOO SMALL TO SEE OR TO HIT. Chandigarh and Delhi are a few pixels across on a
 * 600px map — and on a per-person reading they are often the HIGHEST values. Two treatments,
 * neither of which redraws a boundary:
 *
 *  - a LOCATOR: a hollow ring in the region's own shade around its largest piece, which takes
 *    the focus, the name and the click. Hollow, so the true boundary stays visible inside it.
 *  - an ARCHIPELAGO (Lakshadweep): its islands are already drawn, each at least at the
 *    minimum mark (geo/README.md), so the cluster itself is the shape. An invisible box
 *    around the cluster takes the focus and the click, and shows only when focused or chosen.
 */
const SMALL = 10;
const LOCATOR_R = 5.5;
const ARCHIPELAGO_SPAN = 100;
/** Lakshadweep is 21 islands; Dadra and Nagar Haveli and Daman and Diu, at 5 pieces, is not an archipelago. */
const ARCHIPELAGO_PIECES = 10;

type Target = { kind: "locator"; cx: number; cy: number } | { kind: "archipelago"; x: number; y: number; w: number; h: number };

let TARGETS: Map<string, Target> | null = null;
function targets(): Map<string, Target> {
  if (TARGETS) return TARGETS;
  const out = new Map<string, Target>();
  for (const region of INDIA_STATES_PATHS) {
    const boxes = `${region.d} ${region.islands}`
      .split("Z")
      .map((ring) => ring.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [])
      .filter((n) => n.length >= 6)
      .map((n) => {
        const xs = n.filter((_, i) => i % 2 === 0);
        const ys = n.filter((_, i) => i % 2 === 1);
        return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
      });
    if (!boxes.length || boxes.some((b) => b.x1 - b.x0 >= SMALL || b.y1 - b.y0 >= SMALL)) continue;
    const x0 = Math.min(...boxes.map((b) => b.x0));
    const x1 = Math.max(...boxes.map((b) => b.x1));
    const y0 = Math.min(...boxes.map((b) => b.y0));
    const y1 = Math.max(...boxes.map((b) => b.y1));
    if (boxes.length >= ARCHIPELAGO_PIECES && x1 - x0 < ARCHIPELAGO_SPAN && y1 - y0 < ARCHIPELAGO_SPAN) {
      out.set(region.id, { kind: "archipelago", x: x0 - 3, y: y0 - 3, w: x1 - x0 + 6, h: y1 - y0 + 6 });
      continue;
    }
    const big = boxes.reduce((m, b) => ((b.x1 - b.x0) * (b.y1 - b.y0) > (m.x1 - m.x0) * (m.y1 - m.y0) ? b : m));
    out.set(region.id, { kind: "locator", cx: (big.x0 + big.x1) / 2, cy: (big.y0 + big.y1) / 2 });
  }
  TARGETS = out;
  return out;
}

/**
 * MoSJE / SAMAVESH IndiaMap — State/UT choropleth on the Government's own boundaries
 * (Bharat Maps, NIC; see geo/README.md). Dependency-free: geometry is pre-baked SVG paths,
 * shaded with the sequential token ramp. Regions are keyboard-navigable and announced,
 * buttons when `onSelect` is given; States/UTs too small to see carry a locator; a
 * screen-reader table carries the values.
 */
export function IndiaMap({
  data,
  title,
  valueFormat = formatIndian,
  highlightState,
  scale = "linear",
  legend = "steps",
  legendFormat,
  selected,
  onSelect,
  className,
  state,
  onRetry,
  filterLabel,
  tableView,
}: IndiaMapProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();

  const valueByState = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const d of data) m.set(normalize(d.state), d.value);
    return m;
  }, [data]);

  /*
   * WITH NO DATA THIS DREW A COMPLETE GREY INDIA and announced "across 0
   * states". Every region resolved to `undefined`, took the empty tone, and the
   * map looked finished — a citizen had no way to tell a country with no
   * reported figures from a country where every figure was zero. The guard is
   * placed AFTER the memo, per the rule: branch the render, not the derivation.
   */
  const resolved = state ?? (data.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        viewBox={INDIA_STATES_VIEWBOX}
        className={className}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const seq = sequentialScale(data.map((d) => d.value), scale);
  const outlined = new Set([highlightState, selected].filter(Boolean).map((n) => normalize(n!)));
  const sel = selected ? normalize(selected) : null;
  const interactive = Boolean(onSelect);
  const small = targets();

  const colorFor = (v: number | undefined) =>
    v === undefined || v === 0 ? CHART_INK.regionEmpty : sequentialColor(seq.ratioOf(v));
  const tipFor = (name: string, v: number | undefined) => (
    <>
      <div className="ds-chart__tooltip-title">{name}</div>
      <div>{v === undefined ? "No data" : valueFormat(v)}</div>
    </>
  );

  /** The one element a reader focuses and clicks for a State/UT: its path, or its marker. */
  const targetFor = (name: string, v: number | undefined) => ({
    tabIndex: 0,
    role: interactive ? "button" : "img",
    "aria-label": `${name}: ${v === undefined ? "no data" : valueFormat(v)}`,
    "aria-pressed": interactive ? sel === normalize(name) : undefined,
    onClick: interactive ? () => onSelect!(name) : undefined,
    onKeyDown: interactive
      ? (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect!(name);
          }
        }
      : undefined,
    onPointerMove: (e: React.PointerEvent) => show(tipFor(name, v), e.clientX, e.clientY),
    onPointerLeave: hide,
    onFocus: (e: React.FocusEvent<SVGElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      show(tipFor(name, v), r.left + r.width / 2, r.top);
    },
    onBlur: hide,
  });

  // The outlined States/UTs are drawn last, so their outline is not hidden under a neighbour.
  const regions = [...INDIA_STATES_PATHS].sort(
    (a, b) => Number(outlined.has(normalize(a.name))) - Number(outlined.has(normalize(b.name))),
  );

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={`State-wise ${title.toLowerCase()} across ${data.length} states; values ${valueFormat(0)}–${valueFormat(seq.max)}`}
      viewBox={INDIA_STATES_VIEWBOX}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
      legend={seq.legend(legend, legendFormat ?? valueFormat)}
      table={{
        columns: ["State", title],
        rows: data.map((d) => [d.state, d.value]),
      }}
      tableView={tableView}
    >
      {/* The coastline: every region once more beneath, in a quiet neutral, so the outer edge of
          the land — and every small island — reads against the page. Internal borders stay white. */}
      <g aria-hidden="true" className="ds-chart__coast">
        {INDIA_STATES_PATHS.map((region) => (
          <path key={region.id} d={`${region.d} ${region.islands}`} />
        ))}
      </g>
      {regions.map((region) => {
        const v = valueByState.get(normalize(region.name));
        const isOutlined = outlined.has(normalize(region.name));
        const fill = colorFor(v);
        const cls = `ds-chart__region${isOutlined ? " is-selected" : ""}${interactive ? " is-interactive" : ""}`;
        // A small region's own path is drawn true to the boundary but takes no focus: its target does.
        // Islands too small to see are drawn solid, beside the region's own path.
        const islands = region.islands ? <path key={`i-${region.id}`} d={region.islands} fill={fill} className="ds-chart__islands" aria-hidden="true" /> : null;
        if (small.has(region.id) || !region.d)
          return [<path key={region.id} d={region.d} fill={fill} className="ds-chart__region" aria-hidden="true" />, islands];
        return [<path key={region.id} d={region.d} fill={fill} className={cls} {...targetFor(region.name, v)} />, islands];
      })}
      {/* Targets last, so no neighbour drawn after them can cover one. */}
      {regions.flatMap((region) => {
        const t = small.get(region.id);
        if (!t) return [];
        const v = valueByState.get(normalize(region.name));
        const state = `${outlined.has(normalize(region.name)) ? " is-selected" : ""}${interactive ? " is-interactive" : ""}`;
        if (t.kind === "archipelago")
          return [<rect key={`t-${region.id}`} x={t.x} y={t.y} width={t.w} height={t.h} rx={3} className={`ds-chart__archipelago${state}`} {...targetFor(region.name, v)} />];
        return [
          <g key={`t-${region.id}`}>
            <circle cx={t.cx} cy={t.cy} r={LOCATOR_R} className="ds-chart__locator-halo" aria-hidden="true" />
            <circle cx={t.cx} cy={t.cy} r={LOCATOR_R} stroke={colorFor(v)} className={`ds-chart__locator${state}`} {...targetFor(region.name, v)} />
          </g>,
        ];
      })}
    </ChartFrame>
  );
}
