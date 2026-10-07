"use client";

import { DashboardGrid, KpiRow, type MetricCardProps } from "@mosje/design-system";
import { FigureSource, noteForReading } from "@/components/website/FigureSource";
import { OriginChip } from "@/components/website/ProvenanceChip";
import { cardStateFor, useDataMode } from "@/lib/data-mode/context";
import { formatKpi, isoDate } from "@/lib/kpi/format";
import type { KpiDefinition, KpiReading, PortalReading } from "@/lib/kpi/types";
import { KpiChart, isTile } from "../KpiCard";
import { closeRows } from "../PortalKpiDashboard";
import { COMPONENT_SHORT, formatHeadline, headlineOf, mergeFundCharts } from "./model";

/**
 * The proposed dashboard's two shapes of KPI — a figure tile and a chart card.
 *
 * DS Audit: KpiRow / MetricCard ✅ · ChartCard (via KpiChart) ✅ · DashboardGrid ✅ ·
 * ProvenanceChip ✅ (app) · FigureSource ✅ (app).
 *
 * WHAT A FIGURE MEANS IS ON THE TILE; WHERE IT CAME FROM IS ONE CONTROL AWAY. The tile's
 * line is the proforma's definition. Its source system, update frequency, formula and the
 * portal's API endpoints open in the one Source and Calculation panel the whole dashboard
 * uses (`FigureSource`), drawn only while the demo rail's "Show sources and calculations"
 * is on. This replaced a separate About This Figure panel (6 Oct 2026): it repeated the
 * tile's definition, was empty for 35 of 60 public figures, and showed citizens how the
 * dashboard was built. The officer-only columns it carried — the proforma S. No. and what
 * each portal has yet to supply — are in `docs/audit/kpi-dashboard-proforma-gaps.md`.
 */

/** A KPI's note for the Source and Calculation panel, with the figure as the page shows it. */
function noteOf(k: KpiDefinition, r: KpiReading) {
  const h = headlineOf(k, r);
  return noteForReading(k, r, k.name, h ? formatHeadline(h) : undefined);
}

function chipFor(r: KpiReading) {
  return r.origin === "snapshot" ? undefined : <OriginChip origin={r.origin} />;
}

/**
 * How many lines the longest label in a row of tiles runs to, so the row reserves that many
 * for every label and its figures stand level (design review, 7 Oct 2026). Estimated from the
 * label's length against the room a tile has in a row of that many — a row whose labels all
 * fit on one line reserves nothing, and opens no gap under them.
 */
function labelLines(tiles: KpiDefinition[]): 1 | 2 | 3 {
  const perRow = Math.min(tiles.length, 6);
  // Characters a label line holds at Label 2 in a tile of that row, measured at 1440px.
  const room = perRow >= 5 ? 18 : perRow === 4 ? 27 : perRow === 3 ? 40 : perRow === 2 ? 66 : 140;
  const most = Math.max(...tiles.map((k) => Math.ceil(k.name.length / room)));
  return most >= 3 ? 3 : most === 2 ? 2 : 1;
}

/** A tile's figure and the line under it, for any tile-shaped reading. */
function tileText(k: KpiDefinition, r: KpiReading): { value: string; detail?: string } {
  const v = r.value;
  if (v.kind === "pair") {
    const [a, b] = v.items;
    return { value: formatKpi(a.value, a.unit), detail: `${a.label}, with ${formatKpi(b.value, b.unit)} ${b.label.toLowerCase()}` };
  }
  const h = headlineOf(k, r);
  return { value: h ? formatHeadline(h) : "", detail: k.definition };
}

/**
 * A section's KPIs: the figures as one row of tiles, then the charts on the grid. Every tile
 * and chart card carries its source and calculation while the demo rail shows them.
 */
export function KpiBlocks({ kpis: listed, reading: read, areasAreStates, headingLevel, startIndex = 0, showComponent = true }: {
  kpis: KpiDefinition[];
  reading: PortalReading;
  areasAreStates: boolean;
  headingLevel: 3 | 4;
  /** Position of the first card on the page, so the demo rail's "one card" preview hits one card. */
  startIndex?: number;
  /**
   * Name each KPI's component before it ("RVY · Total Number of Beneficiaries Covered"), for a
   * view that shows several components' KPIs together. On a component's own section the
   * heading already says it.
   */
  showComponent?: boolean;
}) {
  const demo = useDataMode();
  const { kpis: given, reading } = mergeFundCharts(listed, read);
  const kpis = given.map((k) =>
    showComponent && k.component ? { ...k, name: `${COMPONENT_SHORT[k.id.split(".")[1] ?? ""] ?? k.component} · ${k.name}` } : k,
  );
  let index = startIndex;
  const cardOf = () => ({ ...cardStateFor(demo, index++), onRetry: () => demo.setPreview("normal") });

  const tiles = kpis.filter((k) => isTile(reading[k.id]!));
  const charts = kpis.filter((k) => !isTile(reading[k.id]!));
  /*
   * A FEW FIGURES AND THEIR CHART SHARE A ROW (design review, 7 Oct 2026). Up to three tiles
   * beside a single chart stack in a third of the row, and the chart takes the rest.
   *
   * ONE FIGURE BESIDE ITS CHARTS HEADS THE FIRST OF THEM (design review, 7 Oct 2026). A lone
   * tile stretched to the chart's height stood as a tall, mostly empty card; set at the head
   * of the chart it summarises, the figure leads and the chart takes the full row.
   */
  const lone = tiles.length === 1 && charts.length > 0 ? tiles[0]! : undefined;
  const side = !lone && charts.length === 1 && tiles.length > 1 && tiles.length <= 3;
  // The tiles' third is counted when rows are closed, then dropped: the charts' spans only.
  const spans = side
    ? closeRows([4, 8]).slice(1)
    : lone
      ? closeRows(charts.map((c, i) => (i === 0 ? 12 : (c.span ?? 6))))
      : closeRows(charts.map((c) => c.span ?? 6));
  const headline = lone
    ? (() => {
        const r = reading[lone.id]!;
        const { value, detail } = tileText(lone, r);
        return { value, label: lone.name, detail, mark: <>{chipFor(r)}<FigureSource note={noteOf(lone, r)} /></> };
      })()
    : undefined;

  const tileProps = (k: KpiDefinition): MetricCardProps & { key: string } => {
    const r = reading[k.id]!;
    const { value, detail } = tileText(k, r);
    const card = cardOf();
    return {
      key: k.id,
      // At rest on the page, as every card on the dashboard is (`elevation/flat`).
      variant: "outlined",
      label: k.name,
      value,
      detail,
      loading: card.loading,
      state: card.state,
      provenance: r.origin === "snapshot" && r.source && r.asOn ? { source: r.source, asOf: isoDate(r.asOn) } : undefined,
      aside: (
        <>
          {chipFor(r)}
          <FigureSource note={noteOf(k, r)} />
        </>
      ),
    };
  };

  return (
    <>
      {tiles.length > 0 && !side && !lone && <KpiRow className={labelLines(tiles) > 1 ? `pd-labels-${labelLines(tiles)}` : undefined} items={tiles.map(tileProps)} />}
      {charts.length > 0 && (
        <DashboardGrid>
          {side ? <KpiRow span={4} className="pd-tile-stack" items={tiles.map(tileProps)} /> : null}
          {charts.map((k, i) => (
            <KpiChart
              key={k.id}
              kpi={k}
              reading={reading[k.id]!}
              card={cardOf()}
              areasAreStates={areasAreStates}
              headingLevel={headingLevel}
              span={spans[i]}
              headline={i === 0 ? headline : undefined}
              donutLayout="auto"
              quiet
              stateMap="choropleth"
              badge={<FigureSource note={noteOf(k, reading[k.id]!)} />}
            />
          ))}
        </DashboardGrid>
      )}
    </>
  );
}
