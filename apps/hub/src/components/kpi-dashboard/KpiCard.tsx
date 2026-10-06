"use client";

import * as React from "react";
import {
  BarChart,
  ChartCard,
  DataTable,
  DonutChart,
  FunnelChart,
  IndiaMap,
  IndiaTileMap,
  LineChart,
  RankedBarList,
  type CardStateKind,
  type DataProvenance,
} from "@mosje/design-system";
import { OriginChip } from "@/components/website/ProvenanceChip";
import { formatKpi, isoDate, kpiFormatter } from "@/lib/kpi/format";
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
}) {
  const v = reading.value;
  const fmt = kpiFormatter(kpi.unit);
  // The charts draw into a fixed viewBox and scale to the card, so a 12-column card at the
  // default 480 units draws its labels at twice the size of a 6-column one. Widening the
  // viewBox with the span keeps the type the same size in every card.
  const finalSpan = span ?? kpi.span ?? 6;
  const box = { width: Math.round(480 * Math.max(1, finalSpan / 6)), height: 280 };
  let body: React.ReactNode = null;
  let skeleton: "bars" | "donut" | "line" | "rows" | "region" = "bars";

  switch (v.kind) {
    case "breakdown": {
      const unit: KpiUnit = v.unit ?? kpi.unit;
      const data = v.items.map((i) => ({ label: i.label, value: i.value }));
      if (v.chart === "donut") {
        skeleton = "donut";
        const total = data.reduce((t, d) => t + d.value, 0);
        body = (
          <DonutChart
            title={kpi.name}
            data={data}
            valueFormat={kpiFormatter(unit)}
            center={formatKpi(Math.round(total * 100) / 100, unit)}
            centerSub="in total"
            className={donutLayout === "auto" && finalSpan >= 8 ? undefined : "kd-donut"}
            {...(donutLayout === "auto" && finalSpan >= 8 ? { layout: "side" as const, legendValue: "value" as const } : {})}
          />
        );
      } else {
        // A list of labelled bars, not a horizontal BarChart: the chart leaves 116px for a
        // label and truncates the rest ("Reunited with F…"), and at full width three bars
        // stand 280 units tall. The list carries the whole name and keeps its height.
        body = <RankedBarList title={kpi.name} items={data} valueFormat={kpiFormatter(unit)} sort="none" showRank={false} />;
      }
      break;
    }
    case "series": {
      skeleton = v.chart === "line" ? "line" : "bars";
      const series = v.series.map((s) => ({
        name: s.name,
        data: s.data,
        ...(s.pending?.length
          ? {
              withheld: Object.fromEntries(
                s.pending.map((i) => [i, { kind: "not-reported" as const, reason: "Not yet framed for this year" }]),
              ),
            }
          : {}),
      }));
      body =
        v.chart === "line" ? (
          <LineChart title={kpi.name} labels={v.labels} series={series} valueFormat={fmt} {...box} />
        ) : (
          // A crore axis tick ("₹1,76,900 Cr") is wider than the vertical chart's 44-unit gutter
          // and was clipped to "00,000 Cr". Horizontal, the years take the gutter and each
          // value is printed whole at the end of its bar.
          <BarChart
            title={kpi.name}
            labels={v.labels}
            series={series}
            valueFormat={fmt}
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
    case "areas":
      if (areasAreStates && kpi.unit !== "percent") {
        skeleton = "region";
        body = (
          <div className="kd-map-split">
            {stateMap === "tiles" ? (
              <IndiaTileMap title={kpi.name} data={v.rows.map((r) => ({ state: r.area, value: r.value }))} valueFormat={fmt} scale="quantile" />
            ) : (
              <IndiaMap title={kpi.name} data={v.rows.map((r) => ({ state: r.area, value: r.value }))} valueFormat={fmt} />
            )}
            <RankedBarList title={`${kpi.name}, ranked`} items={v.rows.map((r) => ({ label: r.area, value: r.value }))} valueFormat={fmt} showRank pageSize={10} />
          </div>
        );
      } else {
        body = (
          <RankedBarList title={kpi.name} items={v.rows.map((r) => ({ label: r.area, value: r.value }))} valueFormat={fmt} showRank pageSize={10} />
        );
      }
      break;
    case "table": {
      skeleton = "rows";
      const rows = v.rows.map((r, i) => Object.fromEntries([["_key", String(i)], ...v.columns.map((c, j) => [c, r[j]])]));
      body = (
        <DataTable
          caption={kpi.name}
          columns={v.columns.map((c, j) => ({
            key: c,
            header: c,
            align: typeof v.rows[0]?.[j] === "number" ? "end" : "start",
            render: (row: Record<string, string | number>) => {
              const cell = row[c];
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
      exportable={v.kind !== "table"}
      exportName={kpi.id}
      provenance={provenanceOf(reading)}
      actions={
        badge || reading.origin !== "snapshot" ? (
          <span className="kd-marks">
            {badge}
            {chip(reading)}
          </span>
        ) : undefined
      }
      loading={card?.loading}
      state={card?.state}
      onRetry={card?.onRetry}
    >
      {body}
    </ChartCard>
  );
}
