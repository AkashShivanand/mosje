"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { sequentialColor, CHART_INK } from "./internal/palette";
import { niceTicks } from "./internal/scales";
import { formatCompact, formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import { normalizeRegionName } from "./geo/india-projection";

/**
 * Every State and Union Territory as one equal tile, placed where it sits on the map —
 * columns west to east, rows north to south. A tile cartogram (the FT and NPR shape), so
 * Lakshadweep is as legible as Uttar Pradesh: on a choropleth the north-east and the island
 * UTs are a few pixels, and on a per-person reading they are often the answer.
 */
export const INDIA_TILES: { state: string; code: string; col: number; row: number }[] = [
  { state: "Jammu and Kashmir", code: "JK", col: 3, row: 0 },
  { state: "Ladakh", code: "LA", col: 4, row: 0 },
  { state: "Chandigarh", code: "CH", col: 1, row: 1 },
  { state: "Punjab", code: "PB", col: 2, row: 1 },
  { state: "Himachal Pradesh", code: "HP", col: 3, row: 1 },
  { state: "Uttarakhand", code: "UK", col: 4, row: 1 },
  { state: "Haryana", code: "HR", col: 2, row: 2 },
  { state: "Delhi", code: "DL", col: 3, row: 2 },
  { state: "Uttar Pradesh", code: "UP", col: 4, row: 2 },
  { state: "Bihar", code: "BR", col: 5, row: 2 },
  { state: "Sikkim", code: "SK", col: 6, row: 2 },
  { state: "Arunachal Pradesh", code: "AR", col: 8, row: 2 },
  { state: "Rajasthan", code: "RJ", col: 2, row: 3 },
  { state: "Madhya Pradesh", code: "MP", col: 3, row: 3 },
  { state: "Jharkhand", code: "JH", col: 5, row: 3 },
  { state: "West Bengal", code: "WB", col: 6, row: 3 },
  { state: "Assam", code: "AS", col: 7, row: 3 },
  { state: "Nagaland", code: "NL", col: 8, row: 3 },
  { state: "Gujarat", code: "GJ", col: 2, row: 4 },
  { state: "Maharashtra", code: "MH", col: 3, row: 4 },
  { state: "Chhattisgarh", code: "CG", col: 4, row: 4 },
  { state: "Odisha", code: "OD", col: 5, row: 4 },
  { state: "Meghalaya", code: "ML", col: 7, row: 4 },
  { state: "Manipur", code: "MN", col: 8, row: 4 },
  { state: "Dadra and Nagar Haveli and Daman and Diu", code: "DH", col: 1, row: 5 },
  { state: "Goa", code: "GA", col: 2, row: 5 },
  { state: "Karnataka", code: "KA", col: 3, row: 5 },
  { state: "Telangana", code: "TG", col: 4, row: 5 },
  { state: "Andhra Pradesh", code: "AP", col: 5, row: 5 },
  { state: "Tripura", code: "TR", col: 7, row: 5 },
  { state: "Mizoram", code: "MZ", col: 8, row: 5 },
  { state: "Kerala", code: "KL", col: 3, row: 6 },
  { state: "Tamil Nadu", code: "TN", col: 4, row: 6 },
  { state: "Puducherry", code: "PY", col: 5, row: 6 },
  { state: "Lakshadweep", code: "LD", col: 2, row: 7 },
  { state: "Andaman and Nicobar Islands", code: "AN", col: 6, row: 7 },
];

const COLS = 9;
const ROWS = 8;

export interface IndiaTileMapDatum {
  /** State/UT name. Matched as IndiaMap matches it: case, "&" and "Islands" are ignored. */
  state: string;
  value: number;
}

export interface IndiaTileMapProps extends ChartStateProps {
  data: IndiaTileMapDatum[];
  title: string;
  valueFormat?: ValueFormat;
  /**
   * `md` prints each tile's code and its figure; `sm` the code alone, for a thumbnail in a
   * card. Both carry the figure in the tooltip, the accessible name and the table.
   * @default "md"
   */
  size?: "sm" | "md";
  /** The State/UT drawn as chosen — an outline, and `aria-pressed` when tiles are buttons. */
  selected?: string;
  /** Makes every tile a button that chooses its State/UT. */
  onSelect?: (state: string) => void;
  /** The figure printed on a `md` tile. Defaults to compact Indian notation ("34.8 Cr"). */
  tileFormat?: ValueFormat;
  /**
   * How a figure maps to a shade. `linear` shades by value; `quantile` puts an equal number
   * of States/UTs in each of five shades, so two outliers cannot wash the other thirty-four
   * out to the palest step. Use `quantile` for a skewed reading. @default "linear"
   */
  scale?: "linear" | "quantile";
  /** The figures in the legend, where the unit is already in the title ("9.9–17"). Defaults to `valueFormat`. */
  legendFormat?: ValueFormat;
  /** `steps` names every range; `ramp` is one line, low to high, for a thumbnail. @default "steps" */
  legend?: "steps" | "ramp";
  className?: string;
}

/**
 * MoSJE / SAMAVESH IndiaTileMap — a State/UT tile cartogram on the sequential ramp.
 *
 * Use it for a PER-PERSON or per-unit reading, where every State/UT deserves the same
 * room; use `IndiaMap` where the shape of the country is the point. Tiles are focusable,
 * named "Kerala: 4,702", and buttons when `onSelect` is given; the table carries every
 * figure.
 */
export function IndiaTileMap({
  data,
  title,
  valueFormat = formatIndian,
  tileFormat = formatCompact,
  size = "md",
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
}: IndiaTileMapProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const byState = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const d of data) m.set(normalizeRegionName(d.state), d.value);
    return m;
  }, [data]);

  const cell = 60;
  const gap = 6;
  const view = `0 0 ${COLS * cell + (COLS - 1) * gap} ${ROWS * cell + (ROWS - 1) * gap}`;

  const resolved = state ?? (data.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame marksAreFocusable title={title} viewBox={view} className={className} state={resolved} onRetry={onRetry} filterLabel={filterLabel}>
        {null}
      </ChartFrame>
    );

  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = niceTicks(0, max, 5);
  const top = ticks[ticks.length - 1] ?? max;
  // Quantile: five classes of (near-)equal count, cut at the sorted values.
  const sorted = data.map((d) => d.value).filter((v) => v > 0).sort((a, b) => a - b);
  const CLASSES = 5;
  const cuts = Array.from({ length: CLASSES - 1 }, (_, i) => sorted[Math.floor(((i + 1) * sorted.length) / CLASSES)] ?? max);
  const classOf = (v: number) => cuts.filter((c) => v >= c).length;
  /** 0–1 position on the ramp: by value, or by class. */
  const ratioOf = (v: number) => (scale === "quantile" ? (classOf(v) + 1) / CLASSES : v / top);
  const sel = selected ? normalizeRegionName(selected) : null;
  const lf = legendFormat ?? valueFormat;
  const tipFor = (name: string, v: number | undefined) => (
    <>
      <div className="ds-chart__tooltip-title">{name}</div>
      <div>{v === undefined ? "No data" : valueFormat(v)}</div>
    </>
  );

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={`${title}, by State/UT; ${data.length} with figures, ${valueFormat(0)} to ${valueFormat(max)}`}
      viewBox={view}
      className={className}
      svgClassName={`ds-tilemap ds-tilemap--${size}`}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
      legend={
        legend === "ramp" ? (
          <p className="ds-tilemap__ramp" aria-hidden="true">
            <span>{lf(scale === "quantile" ? (sorted[0] ?? 0) : 0)}</span>
            {Array.from({ length: CLASSES }, (_, i) => (
              <span key={i} className="ds-chart__swatch" style={{ backgroundColor: sequentialColor((i + 1) / CLASSES) }} />
            ))}
            <span>{lf(max)}</span>
          </p>
        ) : scale === "quantile" ? (
          <ul className="ds-chart__legend ds-chart__legend--horizontal" aria-hidden="true">
            <li className="ds-chart__legend-item">
              <span className="ds-chart__swatch" style={{ backgroundColor: CHART_INK.regionEmpty }} />
              <span className="ds-chart__legend-label">No data</span>
            </li>
            {Array.from({ length: CLASSES }, (_, i) => (
              <li key={i} className="ds-chart__legend-item">
                <span className="ds-chart__swatch" style={{ backgroundColor: sequentialColor((i + 1) / CLASSES) }} />
                <span className="ds-chart__legend-label">
                  {i === 0 ? `Under ${lf(cuts[0] ?? max)}` : i === CLASSES - 1 ? `${lf(cuts[CLASSES - 2] ?? 0)} and over` : `${lf(cuts[i - 1] ?? 0)}–${lf(cuts[i] ?? max)}`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="ds-chart__legend ds-chart__legend--horizontal" aria-hidden="true">
            <li className="ds-chart__legend-item">
              <span className="ds-chart__swatch" style={{ backgroundColor: CHART_INK.regionEmpty }} />
              <span className="ds-chart__legend-label">No data</span>
            </li>
            {ticks.slice(0, -1).map((t, i) => (
              <li key={t} className="ds-chart__legend-item">
                <span className="ds-chart__swatch" style={{ backgroundColor: sequentialColor((i + 1) / (ticks.length - 1)) }} />
                <span className="ds-chart__legend-label">
                  {lf(t)}–{lf(ticks[i + 1] ?? top)}
                </span>
              </li>
            ))}
          </ul>
        )
      }
      table={{ columns: ["State/UT", title], rows: data.map((d) => [d.state, d.value]) }}
      tableView={tableView}
    >
      {INDIA_TILES.map((t) => {
        const v = byState.get(normalizeRegionName(t.state));
        const has = v !== undefined && v !== 0;
        const ratio = has ? ratioOf(v) : 0;
        // Ink by the ramp step the fill lands on: white from rung 500, where it clears 4.5:1.
        const dark = has && Math.round(Math.max(0, Math.min(1, ratio)) * 9) >= 5;
        const ink = dark ? "var(--sa-text-neutral-inverse)" : "var(--sa-text-neutral-bolder)";
        const x = t.col * (cell + gap);
        const y = t.row * (cell + gap);
        const isSel = sel !== null && normalizeRegionName(t.state) === sel;
        const interactive = Boolean(onSelect);
        return (
          <g
            key={t.code}
            className={`ds-tilemap__tile${isSel ? " is-selected" : ""}${interactive ? " is-interactive" : ""}`}
            tabIndex={0}
            role={interactive ? "button" : "img"}
            aria-label={`${t.state}: ${has ? valueFormat(v!) : "no data"}`}
            aria-pressed={interactive ? isSel : undefined}
            onClick={interactive ? () => onSelect!(t.state) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect!(t.state);
                    }
                  }
                : undefined
            }
            onPointerMove={(e) => show(tipFor(t.state, v), e.clientX, e.clientY)}
            onPointerLeave={hide}
            onFocus={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              show(tipFor(t.state, v), r.left + r.width / 2, r.top);
            }}
            onBlur={hide}
          >
            <rect x={x} y={y} width={cell} height={cell} rx={8} fill={has ? sequentialColor(ratio) : CHART_INK.regionEmpty} className="ds-tilemap__rect" />
            <text x={x + cell / 2} y={size === "md" ? y + 25 : y + cell / 2 + 6} textAnchor="middle" fill={ink} className="ds-tilemap__code">
              {t.code}
            </text>
            {size === "md" ? (
              <text x={x + cell / 2} y={y + 44} textAnchor="middle" fill={ink} className="ds-tilemap__value">
                {has ? tileFormat(v!) : "—"}
              </text>
            ) : null}
          </g>
        );
      })}
    </ChartFrame>
  );
}
