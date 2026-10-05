"use client";

import * as React from "react";
import {
  Badge,
  Button,
  CardState,
  DashboardGrid,
  FilterSelect,
  KpiRow,
  SectionTitle,
  type MetricCardProps,
} from "@mosje/design-system";
import { ProvenanceChip } from "@/components/website/ProvenanceChip";
import { cardStateFor, useDataMode } from "@/lib/data-mode/context";
import { KPI_CATEGORIES } from "@/lib/kpi/categories";
import { formatKpi, isoDate } from "@/lib/kpi/format";
import { areaOptions, covers } from "@/lib/kpi/model";
import { resolveReading, type PortalFeed } from "@/lib/kpi/live";
import { kpisFor, levelsOf, portalById, portalPhrase } from "@/lib/kpi/register";
import type { AreaScope, KpiDefinition, KpiReading, PortalId } from "@/lib/kpi/types";
import { KpiChart, isTile, type KpiCardState } from "./KpiCard";
import "./kpi-dashboard.css";

/**
 * One portal's dashboard — the body shared by the three website designs and the
 * officer view. The page around it (masthead, title, breadcrumb) is the design's.
 *
 * DS Audit: SectionTitle ✅ · FilterSelect ✅ · KpiRow / MetricCard ✅ · DashboardGrid /
 * ChartCard ✅ · CardState ✅ · Button ✅ · Badge ✅. Nothing here is hand-rolled.
 *
 * ONE READING, ONE ANSWER (`data-state-completeness.md` §2). The area is resolved once,
 * `readPortal` is called once with it, and every tile and chart reads that one result.
 * The public page and the officer view call the same function, so a citizen filtering to
 * Maharashtra and the State Nodal Officer for Maharashtra see the same figures.
 *
 * THE STATES, EACH DESIGNED:
 *  - Live data mode → the feed's figures only (NMBA today); for a portal with no feed,
 *    `not-published`. Saying so is the honest answer; zeroes would be a claim.
 *  - An area the portal does not work in → `no-results`, which names the area and offers
 *    the way back to All India. Different words from "not published": the reader chose it.
 *  - A KPI the area cannot carry (States/UTs Covered, inside one state) → absent, not 0.
 *  - Loading, error, restricted and offline → forced from the demo rail, card by card.
 *  - Too much → rankings page at ten; nothing scrolls inside a card.
 */

export interface PortalKpiDashboardProps {
  portalId: PortalId;
  /** The public page shows public KPIs; an officer sees every KPI of the portal. */
  audience: "public" | "officer";
  /** An officer's area ceiling (`access.ts`). The filter cannot widen past it. */
  ceiling?: AreaScope;
  /** Whether the reader may narrow to a district. Never on the public page. */
  allowDistrict?: boolean;
  /** Heading level for the category sections. The page owns the h1. */
  sectionLevel?: 2 | 3;
  /** The portal's live feed, read on the server; absent for a portal without one. */
  feed?: PortalFeed | null;
}

const ALL_INDIA = "";

const capitalise = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);


/**
 * Close every row of the 12-column grid: a card that would leave a row part-empty is
 * widened to fill it. The set of cards differs by audience and by area — States/UTs
 * Covered drops out inside a state, the office KPIs join for an officer — so spans fixed
 * per KPI would leave half a row of white in some of those combinations.
 */
export function closeRows(requested: number[]): number[] {
  const out = [...requested];
  let row = 0;
  out.forEach((span, i) => {
    if (row > 0 && row + span > 12) {
      out[i - 1] = out[i - 1]! + (12 - row);
      row = 0;
    }
    row = (row + span) % 12;
  });
  if (row > 0 && out.length > 0) out[out.length - 1] = out[out.length - 1]! + (12 - row);
  return out;
}

export function PortalKpiDashboard({ portalId, audience, ceiling = {}, allowDistrict = false, sectionLevel = 2, feed }: PortalKpiDashboardProps) {
  const portal = portalById(portalId)!;
  const demo = useDataMode();
  const [wanted, setWanted] = React.useState<AreaScope>(ceiling);
  /** Where focus goes when the control that held it disappears ("Show All India"). */
  const rootRef = React.useRef<HTMLDivElement>(null);

  // The area, resolved ONCE and held under the ceiling.
  const area: AreaScope = {
    state: ceiling.state ?? wanted.state,
    district: ceiling.district ?? (allowDistrict ? wanted.district : undefined),
  };
  const level = area.district ? "district" : area.state ? "state" : "national";
  const reading = React.useMemo(
    () => resolveReading(portalId, area, demo.mode, feed),
    [portalId, area.state, area.district, demo.mode, feed], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const kpis = kpisFor(portal, audience).filter((k) => levelsOf(k, portal).includes(level) && reading[k.id]);
  const origins = new Set(kpis.map((k) => reading[k.id]!.origin));
  const areaName = area.district ?? area.state ?? "All India";

  const stateOptions = areaOptions(portalId);
  const districtOptions = area.state ? areaOptions(portalId, area.state) : [];
  const showState = portal.levels.includes("state") && !ceiling.state;
  const showDistrict = allowDistrict && portal.levels.includes("district") && Boolean(area.state) && !ceiling.district;

  let index = 0;
  const cardOf = (): KpiCardState => {
    const forced = cardStateFor(demo, index++);
    return { ...forced, onRetry: () => demo.setPreview("normal") };
  };

  const officerOnly = (k: KpiDefinition) =>
    audience === "officer" && k.audience === "officer" ? <Badge status="info" size="sm">Officers Only</Badge> : null;

  const tileProps = (k: KpiDefinition, r: KpiReading): MetricCardProps & { key: string } => {
    const v = r.value;
    let value = "";
    let detail = k.definition;
    if (v.kind === "figure") value = formatKpi(v.value, k.unit);
    else if (v.kind === "areas") value = formatKpi(v.total, k.unit);
    else if (v.kind === "pair") {
      const [a, b] = v.items;
      value = formatKpi(a.value, a.unit);
      detail = `${a.label}, with ${formatKpi(b.value, b.unit)} ${b.label.toLowerCase()}`;
    }
    const card = cardOf();
    return {
      key: k.id,
      label: k.name,
      value,
      detail,
      loading: card.loading,
      state: card.state,
      provenance: r.origin !== "modelled" && r.source && r.asOn ? { source: r.source, asOf: isoDate(r.asOn) } : undefined,
      aside: r.origin === "modelled" ? <ProvenanceChip kind="mock" /> : r.origin === "live" ? <ProvenanceChip kind="live" /> : undefined,
    };
  };

  const filters = (showState || showDistrict || ceiling.state) && (
    <div className="kd-filters" role="group" aria-label="Figures for">
      {showState ? (
        <FilterSelect
          label="State / UT"
          value={area.state ?? ALL_INDIA}
          onChange={(v) => setWanted({ state: v || undefined })}
          options={[{ value: ALL_INDIA, label: "All India" }, ...stateOptions.map((s) => ({ value: s, label: s }))]}
        />
      ) : ceiling.state ? (
        <p className="kd-scope">
          <span className="kd-scope__label">State / UT</span> {ceiling.state}
        </p>
      ) : null}
      {showDistrict ? (
        <FilterSelect
          label="District"
          value={area.district ?? ALL_INDIA}
          onChange={(v) => setWanted({ state: area.state, district: v || undefined })}
          options={[{ value: ALL_INDIA, label: `All of ${area.state}` }, ...districtOptions.map((d) => ({ value: d, label: d }))]}
        />
      ) : ceiling.district ? (
        <p className="kd-scope">
          <span className="kd-scope__label">District</span> {ceiling.district}
        </p>
      ) : null}
    </div>
  );

  let body: React.ReactNode;
  if (kpis.length === 0 && demo.mode === "live") {
    body = (
      <CardState
        kind="not-published"
        title="Live Figures Not Yet Available"
        description={`${capitalise(portalPhrase(portal))} has not yet connected its indicators to this dashboard.`}
      />
    );
  } else if (!covers(portalId, area)) {
    body = (
      <CardState
        kind="no-results"
        title={`No Figures for ${areaName}`}
        description={`${portal.name.split(" – ")[0]} is not yet implemented in ${areaName}.`}
        action={
          <Button
            appearance="outlined"
            size="sm"
            onClick={() => {
              setWanted({});
              // The button unmounts with this state; hand focus to the dashboard, not <body>.
              rootRef.current?.focus();
            }}
          >
            Show All India
          </Button>
        }
      />
    );
  } else {
    body = KPI_CATEGORIES.map((cat) => {
      const inCat = kpis.filter((k) => k.category === cat.id);
      if (inCat.length === 0) return null;
      const tiles = inCat.filter((k) => isTile(reading[k.id]!));
      const charts = inCat.filter((k) => !isTile(reading[k.id]!));
      const headingId = `kd-${portalId}-${cat.id}`;
      return (
        <section key={cat.id} className="kd-section" aria-labelledby={headingId}>
          <SectionTitle as={sectionLevel} headingId={headingId} title={cat.title} />
          {/* Office-only figures sit in their own row under one label: a badge on every
              tile squeezed its label into a column a few words wide. */}
          {[tiles.filter((k) => k.audience === "public" || audience === "public"), tiles.filter((k) => k.audience === "officer" && audience === "officer")].map((row, i) =>
            row.length === 0 ? null : i === 0 ? (
              <KpiRow key="public" items={row.map((k) => tileProps(k, reading[k.id]!))} />
            ) : (
              <div key="office" className="kd-office-row">
                <Badge status="info" size="sm">Officers Only</Badge>
                <KpiRow items={row.map((k) => tileProps(k, reading[k.id]!))} />
              </div>
            ),
          )}
          {charts.length > 0 && (
            <DashboardGrid>
              {charts.map((k, i, all) => (
                <KpiChart
                  key={k.id}
                  kpi={k}
                  reading={reading[k.id]!}
                  card={cardOf()}
                  areasAreStates={!area.state}
                  headingLevel={sectionLevel === 2 ? 3 : 4}
                  badge={officerOnly(k)}
                  span={closeRows(all.map((c) => c.span ?? 6))[i]}
                />
              ))}
            </DashboardGrid>
          )}
        </section>
      );
    });
  }

  return (
    <div className="kd" data-portal-dashboard={portalId} ref={rootRef} tabIndex={-1}>
      <div className="kd-head">
        {filters}
        {/* A status: changing the filter rewrites every figure below, and this line says for where. */}
        <p className="kd-period" role="status">
          {portal.period}
          {area.state ? ` · ${areaName}` : ""}
        </p>
      </div>
      {origins.has("modelled") && (
        // SAID ONCE, BEFORE THE READER STARTS, AND NOT BEHIND THE MARKS TOGGLE. The chips
        // follow the demo rail's marks setting as on every other dashboard; this line does
        // not, because here no figure comes from a connected feed at all. A screenshot of
        // this page must carry its own disclosure (`prototype-data-modes.md`).
        <p className="dm-banner kd-banner" data-sa-rail-clear="">
          {origins.has("snapshot") || origins.has("live") ? (
            <>
              <b>Part illustrative.</b>&nbsp;Figures that name a source are the Department&apos;s, as published on the date shown. The rest are illustrative and are not departmental figures.
            </>
          ) : (
            <>
              <b>Illustrative figures.</b>&nbsp;This dashboard is not yet connected to {portalPhrase(portal)}. The figures show how it will read and are not departmental figures.
            </>
          )}
        </p>
      )}
      {body}
    </div>
  );
}
