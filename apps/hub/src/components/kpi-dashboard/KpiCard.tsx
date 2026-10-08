"use client";

import * as React from "react";
import {
  BarChart,
  ChartCard,
  DataTable,
  DonutChart,
  FunnelChart,
  HeadlineFigure,
  Icon,
  IndiaMap,
  IndiaTileMap,
  LineChart,
  RankedBarList,
  type CardStateKind,
  type DataProvenance,
} from "@mosje/design-system";
import { OriginChip } from "@/components/website/ProvenanceChip";
import { compactCount, formatKpi, isoDate, kpiFormatter } from "@/lib/kpi/format";
import type { KpiDefinition, KpiReading, KpiUnit } from "@/lib/kpi/types";

/**
 * One KPI, drawn by the shape of its reading — never by its name.
 *
 * DS Audit: MetricCard ✅ · ChartCard ✅ · DonutChart ✅ · BarChart ✅ · LineChart ✅ ·
 * FunnelChart ✅ · IndiaMap ✅ · RankedBarList ✅ · DataTable ✅ · ProvenanceChip ✅ (app).
 * Nothing is drawn by hand: a new portal's KPIs render the day they are in the register.
 *
 * A figure (and a pair, and an area reading with no areas below it) is a TILE, drawn by
 * the dashboard as a `KpiRow` item; every other shape is a CHART CARD, drawn here. The dashboard puts the tiles of a section in one row
 * above its charts, so the reader meets the headline before the breakdown.
 *
 * PROVENANCE, ON EVERY CARD. A live or snapshot figure names its source and the date it
 * is as on — the Department published it. A modelled figure carries the Illustrative chip, which the
 * demo rail's marks setting draws (`ProvenanceChip` holds that one gate).
 */

export interface KpiCardState {
  loading?: boolean;
  state?: CardStateKind;
  onRetry?: () => void;
}

export function isTile(reading: KpiReading): boolean {
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
 * its meaning's colour; any other breakdown keeps the categorical order. Proposed dashboard only.
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
 * Series colours for the proposed dashboard's grouped bars: the categorical order without
 * its second slot, red, which reads as a fault beside a figure that is not one (R.E. beside
 * B.E., design review, 7 Oct 2026). The palette itself is SAMAVESH's to change; recorded.
 */
const QUIET_SERIES = ["var(--sa-chart-cat-1)", "var(--sa-chart-cat-3)", "var(--sa-chart-cat-4)", "var(--sa-chart-cat-6)", "var(--sa-chart-cat-5)"];

function chip(reading: KpiReading) {
  return reading.origin === "snapshot" ? undefined : <OriginChip origin={reading.origin} />;
}

export function KpiChart({
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
}: {
  kpi: KpiDefinition;
  reading: KpiReading;
  card?: KpiCardState;
  /** Whether an area reading's rows are States/UTs, which can be drawn on the map. */
  areasAreStates: boolean;
  headingLevel?: 3 | 4;
  /** A mark the officer view adds, e.g. "Officers Only". */
  badge?: React.ReactNode;
  /** The span the dashboard gives this card after closing its row; defaults to the KPI's own. */
  span?: number;
  /**
   * `auto` sets a donut's legend beside the ring, with amounts, once the card is wider than
   * half the grid — a lone donut on a full row otherwise floats in white space. The current
   * dashboards keep the stacked legend. @default "stacked"
   */
  donutLayout?: "stacked" | "auto";
  /** How a States/UTs reading is mapped: the choropleth, or equal tiles. @default "choropleth" */
  stateMap?: "choropleth" | "tiles";
  /**
   * The proposed dashboard's chart chrome (instructions, 6–7 Oct 2026): an outlined card at
   * rest on the page (`elevation/flat`, no shadow), no Chart / Table switch — each chart keeps
   * its table for screen readers — no download control until its placement is decided, and a
   * ring always with its legend beside it so it is no taller than the card next to it. Off,
   * the card is as the current dashboard draws it.
   */
  quiet?: boolean;
  /**
   * A section's one figure, set at the head of the chart it summarises, in place of a lone
   * figure card stretched to the chart's height beside it (design review, 7 Oct 2026).
   */
  headline?: { value: string; label: string; detail?: string; mark?: React.ReactNode };
}) {
  const v = reading.value;
  let headline = given;
  const fmt = kpiFormatter(kpi.unit);
  const tableView = quiet ? ("sr-only" as const) : undefined;
  // The charts draw into a fixed viewBox and scale to the card, so a 12-column card at the
  // default 480 units draws its labels at twice the size of a 6-column one. Widening the
  // viewBox with the span keeps the type the same size in every card.
  const finalSpan = span ?? kpi.span ?? 6;
  // A ring with its legend beside it: on a wide card, and on any half-width card of the
  // proposed dashboard, where a stacked ring stood a third taller than the list beside it.
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
            className={side ? "kd-donut-side" : "kd-donut"}
            {...(side ? { layout: "side" as const, legendValue: "value" as const } : {})}
          />
        );
      } else {
        // A list of labelled bars, not a horizontal BarChart: the chart leaves 116px for a
        // label and truncates the rest ("Reunited with F…"), and at full width three bars
        // stand 280 units tall. The list carries the whole name and keeps its height.
        // Largest first on the proposed dashboard: a breakdown's categories have no order of
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
      // Lakh and crore on the proposed dashboard, as its tiles and landing page print them.
      const areaFmt = quiet && kpi.unit === "number" ? compactCount : fmt;
      if (areasAreStates && kpi.unit !== "percent") {
        skeleton = "region";
        body = (
          <div className="kd-map-split">
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
                  <span className={meets ? "kd-against kd-against--meets" : "kd-against kd-against--short"}>
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
        badge || reading.origin !== "snapshot" ? (
          <span className="kd-marks">
            {badge}
            {chip(reading)}
          </span>
        ) : undefined
      }
      footer={v.kind === "series" && v.note ? v.note : undefined}
      loading={card?.loading}
      state={card?.state}
      onRetry={card?.onRetry}
    >
      {headline ? (
        <HeadlineFigure className="kd-chart-headline" size="md" value={headline.value} label={headline.label} context={headline.detail} mark={headline.mark} />
      ) : null}
      {body}
    </ChartCard>
  );
}
