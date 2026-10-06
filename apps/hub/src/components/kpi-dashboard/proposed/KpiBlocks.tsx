"use client";

import { DashboardGrid, KpiRow, type MetricCardProps } from "@mosje/design-system";
import { FigureSource, noteForReading } from "@/components/website/FigureSource";
import { OriginChip } from "@/components/website/ProvenanceChip";
import { cardStateFor, useDataMode } from "@/lib/data-mode/context";
import { formatKpi, isoDate } from "@/lib/kpi/format";
import type { KpiDefinition, KpiReading, PortalReading } from "@/lib/kpi/types";
import { KpiChart, isTile } from "../KpiCard";
import { closeRows } from "../PortalKpiDashboard";
import { COMPONENT_SHORT, formatHeadline, headlineOf } from "./model";

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
export function KpiBlocks({ kpis: given, reading, areasAreStates, headingLevel, startIndex = 0, showComponent = true }: {
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
  const kpis = given.map((k) =>
    showComponent && k.component ? { ...k, name: `${COMPONENT_SHORT[k.id.split(".")[1] ?? ""] ?? k.component} · ${k.name}` } : k,
  );
  let index = startIndex;
  const cardOf = () => ({ ...cardStateFor(demo, index++), onRetry: () => demo.setPreview("normal") });

  const tiles = kpis.filter((k) => isTile(reading[k.id]!));
  const charts = kpis.filter((k) => !isTile(reading[k.id]!));
  const spans = closeRows(charts.map((c) => c.span ?? 6));

  const tileProps = (k: KpiDefinition): MetricCardProps & { key: string } => {
    const r = reading[k.id]!;
    const { value, detail } = tileText(k, r);
    const card = cardOf();
    return {
      key: k.id,
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
      {tiles.length > 0 && <KpiRow items={tiles.map(tileProps)} />}
      {charts.length > 0 && (
        <DashboardGrid>
          {charts.map((k, i) => (
            <KpiChart
              key={k.id}
              kpi={k}
              reading={reading[k.id]!}
              card={cardOf()}
              areasAreStates={areasAreStates}
              headingLevel={headingLevel}
              span={spans[i]}
              donutLayout="auto"
              stateMap="tiles"
              badge={<FigureSource note={noteOf(k, reading[k.id]!)} />}
            />
          ))}
        </DashboardGrid>
      )}
    </>
  );
}
