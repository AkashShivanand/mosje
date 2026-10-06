"use client";

import * as React from "react";
import {
  Badge,
  Button,
  DashboardGrid,
  DescriptionList,
  Icon,
  IconButton,
  KpiRow,
  SideSheet,
  type MetricCardProps,
} from "@mosje/design-system";
import { ProvenanceChip } from "@/components/website/ProvenanceChip";
import { cardStateFor, useDataMode } from "@/lib/data-mode/context";
import { categoryTitle } from "@/lib/kpi/categories";
import { formatKpi, isoDate } from "@/lib/kpi/format";
import { portalById } from "@/lib/kpi/register";
import type { KpiDefinition, KpiReading, PortalReading } from "@/lib/kpi/types";
import { KpiChart, isTile } from "../KpiCard";
import { closeRows } from "../PortalKpiDashboard";
import { COMPONENT_SHORT, READINESS_LABEL, READINESS_TONE, formatHeadline, headlineOf, readinessOf } from "./model";

/**
 * The proposed dashboard's two shapes of KPI — a figure tile and a chart card — and the
 * one panel every figure opens: About This Figure.
 *
 * DS Audit: KpiRow / MetricCard ✅ · ChartCard (via KpiChart) ✅ · DashboardGrid ✅ ·
 * SideSheet ✅ · DescriptionList ✅ · Badge ✅ · IconButton ✅ · Button ✅ · Icon ✅ ·
 * ProvenanceChip ✅ (app).
 *
 * EVERY NUMBER CAN EXPLAIN ITSELF. The proforma asks each portal for a definition, a unit,
 * a source system, an update frequency and a formula. The current dashboards print the
 * definition and drop the rest; here every tile and card opens a panel that carries all of
 * them, in the sheet's own words, beside the figure — so a reader who wants to know what a
 * number means, where it comes from and how often it changes is one tap from the answer,
 * and a reader who does not is never made to read it.
 */

export interface AboutTarget {
  kpi: KpiDefinition;
  reading: KpiReading;
}

const OpenAbout = React.createContext<(t: AboutTarget) => void>(() => {});

/** Wraps a lens so any figure inside it can open the About panel. */
export function AboutProvider({ officer, children }: { officer: boolean; children: React.ReactNode }) {
  const [target, setTarget] = React.useState<AboutTarget | null>(null);
  return (
    <OpenAbout.Provider value={setTarget}>
      {children}
      <KpiAboutSheet target={target} officer={officer} onClose={() => setTarget(null)} />
    </OpenAbout.Provider>
  );
}

export const useOpenAbout = () => React.useContext(OpenAbout);

function chipFor(r: KpiReading) {
  return r.origin === "modelled" ? <ProvenanceChip kind="mock" /> : r.origin === "live" ? <ProvenanceChip kind="live" /> : undefined;
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
 * is a button that opens its About panel; every chart card carries an About control.
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
  const open = useOpenAbout();
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
      onSelect: () => open({ kpi: k, reading: r }),
      opens: "dialog",
      provenance: r.origin === "snapshot" && r.source && r.asOn ? { source: r.source, asOf: isoDate(r.asOn) } : undefined,
      aside: chipFor(r),
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
              badge={
                <IconButton
                  icon={<Icon name="info" />}
                  appearance="text"
                  size="sm"
                  aria-label={`About this figure: ${k.name}`}
                  tooltip="About This Figure"
                  onClick={() => open({ kpi: k, reading: reading[k.id]! })}
                />
              }
            />
          ))}
        </DashboardGrid>
      )}
    </>
  );
}

/**
 * About This Figure — the proforma's columns for one KPI, beside its value. Officer-only
 * columns (the S. No., the portal's API endpoints and its gap note) appear for officers.
 */
function KpiAboutSheet({ target, officer, onClose }: { target: AboutTarget | null; officer: boolean; onClose: () => void }) {
  const kpi = target?.kpi;
  const reading = target?.reading;
  const programme = kpi ? portalById(kpi.id.split(".")[0] ?? "") : undefined;
  const headline = kpi && reading ? headlineOf(kpi, reading) : null;
  const readiness = kpi ? readinessOf(kpi, reading) : "not-stated";

  const items = kpi
    ? [
        { term: "Programme", value: programme?.name ?? "" },
        ...(kpi.component ? [{ term: "Component", value: kpi.component }] : []),
        { term: "Shown To", value: kpi.audience === "public" ? "Everyone" : "Officers" },
        { term: "Theme", value: categoryTitle(kpi.category) },
        { term: "What It Measures", value: kpi.definition ?? "" },
        { term: "How It Is Calculated", value: kpi.formula ?? "" },
        { term: "Source System", value: kpi.source ?? "" },
        { term: "Updated", value: kpi.frequency ?? "" },
        { term: "Figures For", value: programme?.period ?? "" },
        {
          term: "Data Feed",
          value: (
            <Badge status={READINESS_TONE[readiness]} size="sm">
              {READINESS_LABEL[readiness]}
            </Badge>
          ),
        },
        ...(officer
          ? [
              { term: "Proforma S. No.", value: String(kpi.sNo) },
              { term: "API Endpoints", value: kpi.api?.endpoints?.join(" · ") ?? "" },
              { term: "What Is Missing", value: kpi.api?.gap ?? "" },
              { term: "Remarks", value: kpi.remarks ?? "" },
            ]
          : []),
      ]
    : [];

  return (
    <SideSheet
      open={Boolean(target)}
      onClose={onClose}
      // The dialog says what it is, then which figure: "About This Figure · Total Outreach".
      title={
        <>
          <span className="pd-about__kicker">About This Figure</span>
          {kpi?.name ?? ""}
        </>
      }
      size="md"
      footer={
        <Button appearance="outlined" onClick={onClose}>
          Close
        </Button>
      }
    >
      {kpi && reading ? (
        <div className="pd-about">
          <p className="pd-about__figure">
            <span className="pd-about__value">{headline ? formatHeadline(headline) : "See the chart"}</span>
            {headline?.qualifier ? <span className="pd-about__qualifier">{headline.qualifier}</span> : null}
            {chipFor(reading)}
          </p>
          <DescriptionList
            columns={1}
            divided
            emptyText="Not supplied by the portal"
            // A citizen is not shown what the portal left blank; an officer is, to chase it.
            items={officer ? items : items.filter((i) => i.value !== "")}
          />
        </div>
      ) : null}
    </SideSheet>
  );
}
