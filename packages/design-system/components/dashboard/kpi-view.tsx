"use client";

import * as React from "react";
import { Icon } from "../utilities/icon";
import { HeadlineFigure } from "../data-display/headline-figure";
import { DataTable } from "../data-display/data-table";
import { BarChart } from "../data-display/charts/bar-chart";
import { DonutChart } from "../data-display/charts/donut-chart";
import { FunnelChart } from "../data-display/charts/funnel-chart";
import { IndiaMap } from "../data-display/charts/india-map";
import { IndiaTileMap } from "../data-display/charts/india-tile-map";
import { LineChart } from "../data-display/charts/line-chart";
import { RankedBarList } from "../data-display/charts/ranked-bar-list";
import type { DataProvenance } from "../data-display/charts/types";
import { ChartCard } from "./chart-card";
import type { CardStateKind } from "./card-state";
import { compactCount, formatKpi, isoDate, kpiFormatter } from "./kpi-format";
import type { KpiReading, KpiSpec, KpiUnit, ValueOrigin } from "./kpi-types";
import "./kpi-view.css";

/**
 * MoSJE / SAMAVESH KpiView — one KPI, drawn by the SHAPE of its reading, never by its name.
 *
 * Built for the website's Beneficiary Dashboard (Oct 2026) and moved here so any dashboard
 * draws a reading the same way. A breakdown is a ring or a ranked list, a series a line or
 * bars, stages a funnel, a State/UT reading a map beside its ranked list, a table a table —
 * each in a `ChartCard` carrying its source. A new portal's KPIs render the day they are in
 * its register; nothing is drawn by hand.
 *
 * A figure (and a pair, and an area reading with no areas below it) is a TILE, not a chart —
 * `isKpiTile` says which — and a dashboard draws its tiles as a `KpiRow` above its charts, so
 * the reader meets the headline before the breakdown. `KpiView` draws nothing for a tile.
 *
 * PROVENANCE, ON EVERY CARD. A live, received or snapshot figure names its source and the date
 * it is as on. Anything else about origin — an "Illustrative" mark — is the caller's, through
 * `renderOrigin`, because whether marks are shown is a page setting.
 *
 * DS Audit: ChartCard ✅ · DonutChart ✅ · BarChart ✅ · LineChart ✅ · FunnelChart ✅ ·
 * IndiaMap ✅ · IndiaTileMap ✅ · RankedBarList ✅ · DataTable ✅ · HeadlineFigure ✅ · Icon ✅.
 */

export interface KpiViewState {
  loading?: boolean;
  state?: CardStateKind;
  onRetry?: () => void;
}

/** Whether a reading is a tile (`KpiRow`), not a chart (`KpiView`). */
export function isKpiTile(reading: KpiReading): boolean {
  const v = reading.value;
  return v.kind === "figure" || v.kind === "pair" || (v.kind === "areas" && v.rows.length === 0);
}

function provenanceOf(reading: KpiReading): DataProvenance | undefined {
  return reading.origin !== "modelled" && reading.source && reading.asOn
    ? { source: reading.source, asOf: isoDate(reading.asOn) }
    : undefined;
}

/**
 * STATUS BREAKDOWNS TAKE STATUS COLOURS (design review, 7 Oct 2026). A split by progress
 * ("In Progress / Completed / Discontinued") drawn in the categorical order put Completed in
 * red, which on this estate means rejected. Where every label is a known status, each takes
 * its meaning's colour; any other breakdown keeps the categorical order. `quiet` only.
 */
const STATUS_COLOUR: Record<string, string> = {
  completed: "var(--sa-icon-status-success-base)",
  "in progress": "var(--sa-chart-cat-1)",
  ongoing: "var(--sa-chart-cat-1)",
  discontinued: "var(--sa-chart-trend-flat)",
  "dropped out": "var(--sa-chart-trend-flat)",
};
const statusColour = (label: string) => STATUS_COLOUR[label.trim().toLowerCase()];

/**
 * Series colours for `quiet` grouped bars: the categorical order without
 * its second slot, red, which reads as a fault beside a figure that is not one (R.E. beside
 * B.E., design review, 7 Oct 2026). The palette itself is SAMAVESH's to change; recorded.
 */
const QUIET_SERIES = ["var(--sa-chart-cat-1)", "var(--sa-chart-cat-3)", "var(--sa-chart-cat-4)", "var(--sa-chart-cat-6)", "var(--sa-chart-cat-5)"];

export interface KpiViewProps {
  kpi: KpiSpec;
  reading: KpiReading;
  card?: KpiViewState;
  /** Whether an area reading's rows are States/UTs, which can be drawn on the map. */
  areasAreStates: boolean;
  /** @default 3 */
  headingLevel?: 3 | 4;
  /** A mark the page adds beside the title, e.g. "Officers Only". */
  badge?: React.ReactNode;
  /** The span the dashboard gives this card after closing its row; defaults to the KPI's own. */
  span?: number;
  /**
   * `auto` sets a donut's legend beside the ring, with amounts, once the card is wider than
   * half the grid — a lone donut on a full row otherwise floats in white space. @default "stacked"
   */
  donutLayout?: "stacked" | "auto";
  /** How a States/UTs reading is mapped: the choropleth, or equal tiles. @default "choropleth" */
  stateMap?: "choropleth" | "tiles";
  /**
   * The public dashboard's chart chrome: an outlined card at rest on the page, no Chart / Table
   * switch — each chart keeps its table for screen readers — no download control, a two-part
   * ring drawn as two bars against their whole, breakdowns largest first, status breakdowns in
   * status colours, and red never used as a category. Off, the card is the analyst's: the
   * switch, the download and the categorical order. @default false
   */
  quiet?: boolean;
  /**
   * A section's one figure, set at the head of the chart it summarises, in place of a lone
   * figure card stretched to the chart's height beside it.
   */
  headline?: { value: string; label: string; detail?: string; mark?: React.ReactNode };
  /** The mark for a reading's origin — an "Illustrative" chip. Not called for a snapshot. */
  renderOrigin?: (origin: ValueOrigin) => React.ReactNode;
  className?: string;
}

export function KpiView({
  kpi,
  reading,
  card,
  areasAreStates,
  headingLevel = 3,
  badge,
  span,
  donutLayout = "stacked",
  stateMap = "choropleth",
  quiet = false,
  headline: given,
  renderOrigin,
  className,
}: KpiViewProps) {
  const v = reading.value;
  let headline = given;
  const fmt = kpiFormatter(kpi.unit);
  const tableView = quiet ? ("sr-only" as const) : undefined;
  // The charts draw into a fixed viewBox and scale to the card, so a 12-column card at the
  // default 480 units draws its labels at twice the size of a 6-column one. Widening the
  // viewBox with the span keeps the type the same size in every card.
  const finalSpan = span ?? kpi.span ?? 6;
  // A ring with its legend beside it: on a wide card, and on any half-width card of the
  // `quiet` card, where a stacked ring stood a third taller than the list beside it.
  const side = donutLayout === "auto" && (finalSpan >= 8 || (quiet && finalSpan >= 6));
  const box = { width: Math.round(480 * Math.max(1, finalSpan / 6)), height: 280 };
  let body: React.ReactNode = null;
  let skeleton: "bars" | "donut" | "line" | "rows" | "region" = "bars";

  switch (v.kind) {
    case "breakdown": {
      const unit: KpiUnit = v.unit ?? kpi.unit;
      const statuses = quiet && v.items.length > 1 && v.items.every((i) => statusColour(i.label));
      // RED IS NEVER A CATEGORY (design review, 7 Oct 2026): on this estate it means an error,
      // so a ring's slices take the quiet order, as grouped bars do.
      const data = v.items.map((i, ii) => ({
        label: i.label,
        value: i.value,
        ...(statuses ? { color: statusColour(i.label) } : quiet ? { color: QUIET_SERIES[ii % QUIET_SERIES.length] } : {}),
      }));
      const total = Math.round(data.reduce((t, d) => t + d.value, 0) * 100) / 100;
      // A TWO-PART RING IS A SPLIT, AND A SPLIT READS AS BARS (design review, 7 Oct 2026): a
      // reader judges two angles less surely than two lengths. The whole leads; each part is a
      // bar against it, with its count and its share.
      const split = quiet && v.chart === "donut" && data.length === 2 && unit !== "percent";
      if ((split || (quiet && kpi.totalled)) && !headline) headline = { value: unit === "number" ? compactCount(total) : formatKpi(total, unit), label: "In Total" };
      if (split) {
        body = (
          <RankedBarList
            title={kpi.name}
            items={data.map((d) => ({ label: d.label, value: d.value, detail: `${((d.value / total) * 100).toFixed(1)}%` }))}
            valueFormat={kpiFormatter(unit)}
            max={total}
            sort="none"
            showRank={false}
            size="md"
          />
        );
      } else if (v.chart === "donut") {
        skeleton = "donut";
        body = (
          <DonutChart
            title={kpi.name}
            data={data}
            tableView={tableView}
            valueFormat={kpiFormatter(unit)}
            center={formatKpi(Math.round(total * 100) / 100, unit)}
            centerSub="in total"
            className={side ? "ds-kpi-view__donut-side" : "ds-kpi-view__donut"}
            {...(side ? { layout: "side" as const, legendValue: "value" as const } : {})}
          />
        );
      } else {
        // A list of labelled bars, not a horizontal BarChart: the chart leaves 116px for a
        // label and truncates the rest ("Reunited with F…"), and at full width three bars
        // stand 280 units tall. The list carries the whole name and keeps its height.
        // Largest first when `quiet`: a breakdown's categories have no order of
        // their own, and a sorted list is read top-down (design review, 7 Oct 2026).
        body = <RankedBarList title={kpi.name} items={data} valueFormat={kpiFormatter(unit)} sort={quiet ? "desc" : "none"} showRank={false} />;
      }
      break;
    }
    case "series": {
      skeleton = v.chart === "line" ? "line" : "bars";
      const series = v.series.map((s, si) => ({
        name: s.name,
        data: s.data,
        ...(quiet && v.series.length > 1 ? { color: QUIET_SERIES[si % QUIET_SERIES.length] } : {}),
        ...(s.pending?.length
          ? {
              withheld: Object.fromEntries(
                s.pending.map((i) => [i, { kind: (quiet ? "not-due" : "not-reported") as "not-due" | "not-reported", reason: "Not yet framed for this year" }]),
              ),
            }
          : {}),
      }));
      body =
        v.chart === "line" ? (
          <LineChart title={kpi.name} labels={v.labels} series={series} valueFormat={fmt} tableView={tableView} {...box} />
        ) : (
          // A crore axis tick ("₹1,76,900 Cr") is wider than the vertical chart's 44-unit gutter
          // and was clipped to "00,000 Cr". Horizontal, the years take the gutter and each
          // value is printed whole at the end of its bar.
          <BarChart
            title={kpi.name}
            labels={v.labels}
            series={series}
            valueFormat={fmt}
            tableView={tableView}
            orientation={kpi.unit === "crore" ? "horizontal" : "vertical"}
            showValues={kpi.unit === "crore"}
            {...box}
            height={kpi.unit === "crore" ? Math.max(280, v.labels.length * v.series.length * 30) : box.height}
          />
        );
      break;
    }
    case "stages":
      body = <FunnelChart title={kpi.name} stages={v.stages} valueFormat={fmt} />;
      break;
    case "areas": {
      // Lakh and crore when `quiet`, as a public dashboard's tiles print them.
      const areaFmt = quiet && kpi.unit === "number" ? compactCount : fmt;
      if (areasAreStates && kpi.unit !== "percent") {
        skeleton = "region";
        body = (
          <div className="ds-kpi-view__map-split">
            {stateMap === "tiles" ? (
              <IndiaTileMap title={kpi.name} data={v.rows.map((r) => ({ state: r.area, value: r.value }))} valueFormat={fmt} scale="quantile" tableView={tableView} />
            ) : (
              <IndiaMap title={kpi.name} data={v.rows.map((r) => ({ state: r.area, value: r.value }))} valueFormat={areaFmt} tableView={tableView} {...(quiet ? { scale: "quantile" as const } : {})} />
            )}
            <RankedBarList title={`${kpi.name}, ranked`} items={v.rows.map((r) => ({ label: r.area, value: r.value }))} valueFormat={areaFmt} showRank pageSize={10} />
          </div>
        );
      } else {
        body = (
          <RankedBarList title={kpi.name} items={v.rows.map((r) => ({ label: r.area, value: r.value }))} valueFormat={areaFmt} showRank pageSize={10} />
        );
      }
      break;
    }
    case "table": {
      skeleton = "rows";
      const rows = v.rows.map((r, i) => Object.fromEntries([["_key", String(i)], ...v.columns.map((c, j) => [c, r[j]])]));
      // The current dashboard keeps its plain difference column.
      const against = quiet ? v.againstMinimum : undefined;
      // THE TABLE'S ANSWER, BEFORE ITS ROWS (design review, 7 Oct 2026): how many meet their
      // mandate, counted from the same column the rows mark.
      if (against && !headline) {
        const marks = v.rows.map((r) => r[against.column]).filter((c): c is number => typeof c === "number");
        headline = { value: `${marks.filter((c) => c >= 0).length} of ${marks.length}`, label: "Meet Their Mandated Allocation" };
      }
      body = (
        <DataTable
          caption={kpi.name}
          columns={v.columns.map((c, j) => ({
            key: c,
            header: against?.column === j ? against.header : c,
            align: typeof v.rows[0]?.[j] === "number" ? "end" : "start",
            render: (row: Record<string, string | number>) => {
              const cell = row[c];
              if (against?.column === j && typeof cell === "number") {
                const meets = cell >= 0;
                const n = Math.abs(cell).toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                return (
                  <span className={meets ? "ds-kpi-view__against ds-kpi-view__against--meets" : "ds-kpi-view__against ds-kpi-view__against--short"}>
                    <Icon name={meets ? "check_circle" : "error"} size={16} />
                    {meets ? `Meets, +${n} ${against.unit}` : `Short by ${n} ${against.unit}`}
                  </span>
                );
              }
              return typeof cell === "number" ? cell.toLocaleString("en-IN") : cell;
            },
          }))}
          data={rows}
          total={rows.length}
          hidePagerWhenFits
        />
      );
      break;
    }
    default:
      return null;
  }

  return (
    <ChartCard
      title={kpi.name}
      subtitle={kpi.definition}
      headingLevel={headingLevel}
      span={finalSpan}
      skeleton={skeleton}
      exportable={!quiet && v.kind !== "table"}
      exportName={kpi.id}
      variant={quiet ? "outlined" : undefined}
      provenance={provenanceOf(reading)}
      actions={
        badge || (reading.origin !== "snapshot" && renderOrigin) ? (
          <span className="ds-kpi-view__marks">
            {badge}
            {reading.origin !== "snapshot" ? renderOrigin?.(reading.origin) : null}
          </span>
        ) : undefined
      }
      footer={v.kind === "series" && v.note ? v.note : undefined}
      loading={card?.loading}
      state={card?.state}
      onRetry={card?.onRetry}
      className={className}
    >
      {headline ? (
        <HeadlineFigure className="ds-kpi-view__headline" size="md" value={headline.value} label={headline.label} context={headline.detail} mark={headline.mark} />
      ) : null}
      {body}
    </ChartCard>
  );
}
