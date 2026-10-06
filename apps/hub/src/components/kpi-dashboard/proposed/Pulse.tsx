"use client";

import * as React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardIcon,
  CardState,
  CardSubtitle,
  CardTitle,
  DataTable,
  DescriptionList,
  DotPlot,
  FilterSelect,
  FunnelChart,
  HeadlineFigure,
  Icon,
  IndiaTileMap,
  RankedBarList,
  SectionTitle,
  SegmentedControl,
  Sparkline,
  WaffleChart,
} from "@mosje/design-system";
import { ProvenanceChip } from "@/components/website/ProvenanceChip";
import { POPULATION_2011_LAKH } from "@/lib/kpi/geography";
import type { AreaScope, PortalDashboard, PortalId } from "@/lib/kpi/types";
import { MinistryCollection } from "../DashboardViewer";
import {
  COMPONENT_SHORT,
  PROGRAMME_ICON,
  READINESS_LABEL,
  READINESS_TONE,
  SHORT_NAME,
  fundsRows,
  type Readiness,
  type Readings,
  type Viewing,
} from "./model";
import { PROGRAMME_TONE, READINESS_ORDER, READINESS_SLOT, compact, figureOf, perHundred, perHundredRows, populationOf, readinessRows } from "./story";

/**
 * THE PULSE — the proposed dashboard's one page, told as a story in four movements:
 *
 *   1. THE ANSWER     a hero panel with the lead figure in display type, put on a human
 *                     scale against the population it serves, and one figure for each of
 *                     the other programmes beside it.
 *   2. THE PROGRAMMES a bento of five tiles, each with the ONE picture its data is best
 *                     told by: a tile map of NMBA's reach, SMILE's rehabilitation funnel,
 *                     five years of DAPSC allocation, SHRESHTA's 100 students by mode,
 *                     and Senior Citizens' spending pace by component.
 *   3. WHERE          every State/UT as an equal tile — Lakshadweep as legible as Uttar
 *                     Pradesh — per lakh people by default, because a total only ranks
 *                     populations; choosing a tile opens that State/UT beside the map.
 *   4. MONEY          one question, asked of every budget: is spending keeping pace with
 *                     the year? A dot per scheme against the line of the year elapsed.
 *
 * And, for the Ministry and Divisions, 5. THE DATA BEHIND IT: 87 indicators as 87 squares,
 * coloured by where each figure can come from.
 *
 * DS Audit: Card (`accent="fill"` ADDED) / CardHeader / CardIcon / CardBody / CardFooter ✅ ·
 * HeadlineFigure ➕ ADDED · IndiaTileMap ➕ ADDED · DotPlot ➕ ADDED · WaffleChart ➕ ADDED ·
 * FunnelChart ✅ · Sparkline ✅ · RankedBarList ✅ · SectionTitle ✅ · SegmentedControl ✅ ·
 * DescriptionList ✅ · Accordion ✅ · DataTable ✅ · FilterSelect ✅ · CardState ✅ · Badge ✅ ·
 * Button ✅ · Icon ✅ · ProvenanceChip ✅ (app). The stylesheet places them; it styles none.
 */

export interface PulseProps {
  viewing: Viewing;
  readings: Readings;
  national: Readings;
  scope: AreaScope;
  sectionLevel: 2 | 3;
  readinessAllowed: boolean;
  hrefTo: (to: Partial<Record<"programme" | "state", string | null>>) => string;
  go: (to: Partial<Record<"programme" | "state", string | null>>) => void;
}

const mark = (origin: string | undefined) =>
  origin === "modelled" ? <ProvenanceChip kind="mock" /> : origin === "live" ? <ProvenanceChip kind="live" /> : undefined;

const areaName = (scope: AreaScope) => scope.district ?? scope.state ?? "All India";
const sub = (level: 2 | 3) => (level === 2 ? 3 : 4) as 3 | 4;

/* ══ 1 · The answer ═════════════════════════════════════════════════════════ */

function Hero({ viewing, readings, scope, sectionLevel }: PulseProps) {
  const has = (id: PortalId) => viewing.programmes.find((p) => p.id === id);
  const kpis = (id: PortalId) => has(id)?.kpis ?? [];
  const lead = has("nmba") ? figureOf("nmba", "nmba.outreach", readings, kpis("nmba")) : null;
  const population = populationOf(scope);
  const inHundred = lead && population ? Math.round((lead.value / population) * 100) : null;

  const side = [
    { id: "smile-beggary" as const, kpi: "smile-beggary.identified", label: "persons engaged in begging identified, under SMILE" },
    { id: "e-utthaan" as const, kpi: "e-utthaan.allocation", label: "DAPSC allocation for the welfare of Scheduled Castes, B.E. 2026-27" },
    { id: "shreshta" as const, kpi: "shreshta.beneficiaries", label: "SC students benefited under SHRESHTA, Mode-I and Mode-II" },
    { id: "senior-citizens" as const, kpi: "senior-citizens.ipsrc.beneficiaries", label: "beneficiaries covered under the Integrated Programme for Senior Citizens" },
  ].flatMap((s) => {
    const f = has(s.id) ? figureOf(s.id, s.kpi, readings, kpis(s.id)) : null;
    return f ? [{ ...s, f }] : [];
  });

  if (!lead && side.length === 0) {
    return <CardState kind="not-published" title={`Figures Not Yet Published for ${areaName(scope)}`} description="None of the programmes on this dashboard publishes a figure for this area yet." />;
  }

  return (
    <Card tone="primary" accent="fill" className="pd-hero">
      {/* Named for the outline and for focus after the area changes; the figures speak for themselves on screen. */}
      <SectionTitle as={sectionLevel} headingId="pd-glance" title={`At a Glance, ${areaName(scope)}`} className="ds-sr-only" />
      <CardBody className="pd-hero__body">
        {lead ? (
          <HeadlineFigure
            size="xl"
            tone="inverse"
            value={compact(lead.value, "number")}
            label={`people reached by Nasha Mukt Bharat Abhiyaan${scope.state ? ` in ${scope.state}` : ""}`}
            context={inHundred !== null ? `About ${inHundred} in every 100 people${scope.state ? ` in ${scope.state}` : " in India"}, at the Census 2011 count.` : undefined}
            mark={mark(lead.origin)}
          />
        ) : null}
        {side.length > 0 ? (
          <ul className="pd-hero__side" aria-label="The other programmes">
            {side.map((s) => (
              <li key={s.id}>
                <HeadlineFigure size="md" tone="inverse" value={compact(s.f.value, s.f.kpi.unit)} label={s.label} mark={mark(s.f.origin)} />
              </li>
            ))}
          </ul>
        ) : null}
      </CardBody>
    </Card>
  );
}

/* ══ 2 · The programmes ═════════════════════════════════════════════════════ */

function Tile({ p, children, figure, hrefTo, note }: { p: PortalDashboard; children?: React.ReactNode; figure?: React.ReactNode; hrefTo: PulseProps["hrefTo"]; note?: string }) {
  return (
    <Card tone={PROGRAMME_TONE[p.id]} accent="edge" className={`pd-tile pd-tile--${p.id}`}>
      <CardHeader>
        <CardIcon name={PROGRAMME_ICON[p.id]} />
        <div className="pd-tile__titles">
          <CardTitle size="sm">{SHORT_NAME[p.id]}</CardTitle>
          <CardSubtitle>{p.name}</CardSubtitle>
        </div>
      </CardHeader>
      <CardBody className="pd-tile__body">
        {note ? <p className="pd-note">{note}</p> : null}
        {figure}
        {children}
      </CardBody>
      <CardFooter>
        <Button appearance="text" size="sm" href={hrefTo({ programme: p.id })} linkAs={Link} iconRight={<Icon name="arrow_forward" size={16} />}>
          Explore {SHORT_NAME[p.id]}
        </Button>
      </CardFooter>
    </Card>
  );
}

function Programmes(props: PulseProps) {
  const { viewing, readings, national, scope, hrefTo, sectionLevel } = props;
  const get = (id: PortalId) => viewing.programmes.find((p) => p.id === id);
  const kp = (id: PortalId) => get(id)?.kpis ?? [];
  const fig = (id: PortalId, kpi: string) => (get(id) ? figureOf(id, kpi, readings, kp(id)) : null);
  const nationalOnly = (id: PortalId) => Boolean(scope.state) && !get(id)?.levels.includes("state");
  const NATIONAL_ONLY = "Publishes All-India figures only.";

  const tiles: React.ReactNode[] = [];

  const nmba = get("nmba");
  if (nmba) {
    const reach = fig("nmba", "nmba.outreach");
    const map = perHundredRows(national.nmba?.["nmba.outreach-by-state"], true);
    tiles.push(
      <Tile
        key="nmba"
        p={nmba}
        hrefTo={hrefTo}
        figure={reach ? <HeadlineFigure size="md" value={compact(reach.value, "number")} label="people reached, cumulative since launch" mark={mark(reach.origin)} /> : undefined}
      >
        <div className="pd-tile__split">
          {map.length > 0 ? (
            <IndiaTileMap title="People reached per 100 people, by State/UT" data={map} size="sm" scale="quantile" legend="ramp" selected={scope.state} tableView="sr-only" valueFormat={perHundred} />
          ) : null}
          <DescriptionList
            size="sm"
            columns={1}
            divided
            items={[
              ["nmba.women", "Women Reached"],
              ["nmba.youth", "Youth Reached"],
              ["nmba.pledges", "e-Pledges Taken"],
              ["nmba.mitras", "Nasha Mukti Mitras"],
            ].flatMap(([id, term]) => {
              const f = fig("nmba", id!);
              return f ? [{ term: term!, value: compact(f.value, "number") }] : [];
            })}
          />
        </div>
      </Tile>,
    );
  }

  const smile = get("smile-beggary");
  if (smile) {
    const stages = [
      ["smile-beggary.identified", "Identified"],
      ["smile-beggary.mobilised", "Mobilised to Shelter"],
      ["smile-beggary.rehabilitated", "Rehabilitated"],
    ].flatMap(([id, label]) => {
      const f = fig("smile-beggary", id!);
      return f ? [{ label: label!, value: f.value }] : [];
    });
    const released = fig("smile-beggary", "smile-beggary.fund-released");
    const utilised = fig("smile-beggary", "smile-beggary.fund-utilised");
    const share = released && utilised ? Math.round((utilised.value / released.value) * 100) : null;
    const series = readings["smile-beggary"]?.["smile-beggary.monthly-trend"]?.value;
    const identifiedSeries = series?.kind === "series" ? series.series.find((x) => x.name === "Identified") : undefined;
    const trend =
      series?.kind === "series" && identifiedSeries && identifiedSeries.data.length > 1
        ? {
            data: identifiedSeries.data,
            first: identifiedSeries.data[0]!,
            last: identifiedSeries.data[identifiedSeries.data.length - 1]!,
            firstLabel: series.labels[0]!,
            lastLabel: series.labels[series.labels.length - 1]!,
          }
        : null;
    tiles.push(
      <Tile
        key="smile"
        p={smile}
        hrefTo={hrefTo}
        note={stages.length === 0 && scope.state ? `Not implemented in ${scope.state}.` : undefined}
        figure={
          stages[0] ? (
            <HeadlineFigure
              size="md"
              value={compact(stages[stages.length - 1]!.value, "number")}
              label={`persons rehabilitated of ${compact(stages[0].value, "number")} identified`}
              mark={mark(fig("smile-beggary", "smile-beggary.identified")?.origin)}
            />
          ) : undefined
        }
      >
        {stages.length >= 2 ? <FunnelChart title="From identification to rehabilitation" stages={stages.map((x) => ({ ...x, color: "var(--sa-chart-cat-1)" }))} /> : null}
        {trend ? (
          <div className="pd-trend">
            <p className="pd-fact">
              <b>{compact(trend.last, "number")}</b> identified in {trend.lastLabel}, up from {compact(trend.first, "number")} in {trend.firstLabel}.
            </p>
            <Sparkline data={trend.data} width={420} height={48} label={`Persons identified each month, ${trend.firstLabel} to ${trend.lastLabel}`} />
          </div>
        ) : null}
        {share !== null ? <p className="pd-fact"><b>{share}%</b> of funds released has been utilised.</p> : null}
      </Tile>,
    );
  }

  const dapsc = get("e-utthaan");
  if (dapsc) {
    const alloc = readings["e-utthaan"]?.["e-utthaan.allocation"]?.value;
    const exp = readings["e-utthaan"]?.["e-utthaan.expenditure"]?.value;
    const be = alloc?.kind === "series" ? (alloc.series[0]?.data ?? []) : [];
    const growth = be.length > 1 ? Math.round(((be[be.length - 1]! - be[0]!) / be[0]!) * 1000) / 10 : null;
    const spent = exp?.kind === "series" && be.length ? Math.round(((exp.series[0]?.data.at(-1) ?? 0) / be[be.length - 1]!) * 100) : null;
    tiles.push(
      <Tile
        key="dapsc"
        p={dapsc}
        hrefTo={hrefTo}
        note={nationalOnly("e-utthaan") ? NATIONAL_ONLY : undefined}
        figure={be.length ? <HeadlineFigure size="md" value={compact(be[be.length - 1]!, "crore")} label="allocated, B.E. 2026-27" mark={mark(readings["e-utthaan"]?.["e-utthaan.allocation"]?.origin)} /> : undefined}
      >
        {be.length > 1 ? (
          <div className="pd-spark">
            <Sparkline data={be} width={280} height={56} label={`DAPSC allocation, B.E., ${alloc?.kind === "series" ? alloc.labels[0] : ""} to 2026-27: rising from ${compact(be[0]!, "crore")} to ${compact(be[be.length - 1]!, "crore")}`} />
            <DescriptionList
              size="sm"
              columns={2}
              items={[
                ...(growth !== null ? [{ term: "Since 2022-23", value: `+${growth}%` }] : []),
                ...(spent !== null ? [{ term: "Spent, Apr–Sep 2026", value: `${spent}%` }] : []),
              ]}
            />
          </div>
        ) : null}
      </Tile>,
    );
  }

  const shreshta = get("shreshta");
  if (shreshta) {
    const b = readings.shreshta?.["shreshta.beneficiaries"]?.value;
    const funds = fig("shreshta", "shreshta.funds");
    const parts = b?.kind === "breakdown" ? b.items : [];
    const total = parts.reduce((t, x) => t + x.value, 0);
    tiles.push(
      <Tile
        key="shreshta"
        p={shreshta}
        hrefTo={hrefTo}
        note={nationalOnly("shreshta") ? NATIONAL_ONLY : undefined}
        figure={total ? <HeadlineFigure size="md" value={compact(total, "number")} label="SC students in residential schools" mark={mark(readings.shreshta?.["shreshta.beneficiaries"]?.origin)} /> : undefined}
      >
        {parts.length ? (
          <WaffleChart
            title="Every 100 SHRESHTA students, by mode"
            scale="percent"
            unit="student"
            categories={parts.map((x, i) => ({ id: x.label, label: x.label, color: i === 0 ? "var(--sa-chart-cat-1)" : "var(--sa-chart-cat-6)" }))}
            rows={[{ label: "", counts: Object.fromEntries(parts.map((x) => [x.label, x.value])) }]}
          />
        ) : null}
        {funds ? <p className="pd-fact"><b>{compact(funds.value, "crore")}</b> released this year.</p> : null}
      </Tile>,
    );
  }

  const scw = get("senior-citizens");
  if (scw) {
    const rows = fundsRows({ ...viewing, programmes: [scw] }, readings);
    tiles.push(
      <Tile
        key="scw"
        p={scw}
        hrefTo={hrefTo}
        note={nationalOnly("senior-citizens") ? NATIONAL_ONLY : undefined}
        figure={
          rows.length ? (
            <HeadlineFigure
              size="md"
              value={compact(rows.reduce((t, r) => t + r.spent, 0), "crore")}
              label={`spent of ${compact(rows.reduce((t, r) => t + r.provided, 0), "crore")} budgeted, across ${rows.length} components`}
              mark={mark(rows[0]?.origin === "modelled" ? "modelled" : "live")}
            />
          ) : undefined
        }
      >
        {rows.length ? (
          <DotPlot
            title="Senior Citizens Welfare: spent as a share of budget, by component"
            size="sm"
            rows={rows.map((r) => ({ label: r.label.replace("Senior Citizens · ", ""), value: Math.round((r.spent / r.provided) * 100) }))}
            reference={{ value: 50, label: "Year elapsed" }}
          />
        ) : null}
      </Tile>,
    );
  }

  return (
    <section className="pd-section" aria-labelledby="pd-programmes">
      <SectionTitle as={sectionLevel} headingId="pd-programmes" size="display" title="The Programmes" />
      <ul className="pd-bento">
        {tiles.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  );
}

/* ══ 3 · Where ══════════════════════════════════════════════════════════════ */

interface MapMetric {
  id: string;
  programme: PortalId;
  label: string;
  perLakh: boolean;
  unit: "number" | "crore";
}

const MAP_METRICS: MapMetric[] = [
  { id: "nmba.outreach-by-state", programme: "nmba", label: "People Reached · NMBA", perLakh: true, unit: "number" },
  { id: "senior-citizens.sapsrc.budget", programme: "senior-citizens", label: "State Action Plan Budget · Senior Citizens", perLakh: false, unit: "crore" },
];

function Where({ viewing, national, scope, go, sectionLevel }: PulseProps) {
  const metrics = MAP_METRICS.filter((m) => viewing.programmes.some((p) => p.id === m.programme) && national[m.programme]?.[m.id]?.value.kind === "areas");
  const [metricId, setMetricId] = React.useState(metrics[0]?.id ?? "");
  const [perLakh, setPerLakh] = React.useState(true); // per 100 people
  // Keyed on the page's State/UT by the caller, so a new page filter starts a new pick.
  const [picked, setPicked] = React.useState<string | undefined>(scope.state);
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0];
  if (!metric) return null;

  const usePerLakh = metric.perLakh && perLakh;
  const reading = national[metric.programme]?.[metric.id];
  const data = perHundredRows(reading, usePerLakh);
  const fmt = (v: number) => (usePerLakh ? perHundred(v) : metric.unit === "crore" ? compact(v, "crore") : v.toLocaleString("en-IN"));
  const tileFmt = (v: number) =>
    usePerLakh ? v.toLocaleString("en-IN") : metric.unit === "crore" ? `₹${Math.round(v)}` : compact(v, "number").replace(" lakh", "L").replace(" Cr", "Cr");
  const ranked = [...data].sort((a, b) => b.value - a.value);
  const rank = picked ? ranked.findIndex((r) => r.state === picked) + 1 : 0;
  const title = `${metric.label}${usePerLakh ? ", per 100 People" : ""}`;

  // The chosen State/UT across programmes, from the national readings' state rows.
  const stateFacts = picked
    ? viewing.programmes.flatMap((p) =>
        Object.entries(national[p.id] ?? {}).flatMap(([id, r]) => {
          const v = r?.value;
          if (v?.kind !== "areas" || id === "smile-beggary.utilisation-pct") return [];
          const k = p.kpis.find((x) => x.id === id);
          const row = v.rows.find((x) => x.area === picked);
          if (!k || !row || (k.audience === "officer" && viewing.audience === "public")) return [];
          const name = k.component ? `${COMPONENT_SHORT[k.id.split(".")[1] ?? ""] ?? ""} ${k.name}` : k.name.replace(" by State/UT", "");
          return [{ term: `${name} · ${SHORT_NAME[p.id]}`, value: compact(row.value, k.unit === "crore" ? "crore" : "number") }];
        }),
      )
    : [];

  return (
    <section className="pd-section" aria-labelledby="pd-where">
      <SectionTitle as={sectionLevel} headingId="pd-where" size="display" eyebrow="States and Union Territories" title="Where the Programmes Reach">
        <span className="pd-actions">
          {metrics.length > 1 ? <FilterSelect label="Figure" value={metric.id} onChange={setMetricId} options={metrics.map((m) => ({ value: m.id, label: m.label }))} /> : null}
          {metric.perLakh ? (
            <SegmentedControl
              ariaLabel="Show as"
              value={perLakh ? "per-lakh" : "total"}
              onChange={(v) => setPerLakh(v === "per-lakh")}
              options={[
                { value: "per-lakh", label: "Per 100 People" },
                { value: "total", label: "Total" },
              ]}
            />
          ) : null}
        </span>
      </SectionTitle>
      <div className="pd-where">
        <Card variant="outlined" className="pd-where__map">
          <CardBody>
            <IndiaTileMap title={title} data={data} valueFormat={fmt} tileFormat={tileFmt} legendFormat={tileFmt} scale="quantile" selected={picked} onSelect={setPicked} />
          </CardBody>
        </Card>
        <Card variant="outlined" className="pd-where__panel">
          {picked ? (
            <>
              <CardHeader>
                <div>
                  <CardTitle size="sm">{picked}</CardTitle>
                  {rank > 0 ? <CardSubtitle>{`${rank} of ${ranked.length} · ${title}`}</CardSubtitle> : null}
                </div>
              </CardHeader>
              <CardBody>
                {stateFacts.length ? (
                  <DescriptionList size="figure" columns={1} divided items={stateFacts} />
                ) : (
                  <p className="pd-note">No programme on this dashboard publishes figures for {picked} yet.</p>
                )}
                {population(picked) ? <p className="pd-note">Population {compact(population(picked)!, "number")}, Census 2011.</p> : null}
              </CardBody>
              <CardFooter>
                {scope.state === picked ? (
                  <Button appearance="outlined" size="sm" onClick={() => go({ state: null })}>
                    Show All India
                  </Button>
                ) : (
                  <Button appearance="filled" size="sm" onClick={() => go({ state: picked })}>
                    Show {picked} Across the Dashboard
                  </Button>
                )}
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <div>
                  <CardTitle size="sm">Highest and Lowest</CardTitle>
                  <CardSubtitle>{title}</CardSubtitle>
                </div>
              </CardHeader>
              <CardBody>
                <RankedBarList title={`${title}, highest five`} items={ranked.slice(0, 5).map((r) => ({ label: r.state, value: r.value }))} max={ranked[0]?.value} valueFormat={fmt} showRank sort="none" />
                <RankedBarList title={`${title}, lowest five`} items={ranked.slice(-5).map((r, i) => ({ label: r.state, value: r.value, detail: `${ranked.length - 4 + i} of ${ranked.length}` }))} max={ranked[0]?.value} valueFormat={fmt} showRank={false} sort="none" />
                <p className="pd-note">Choose a State/UT on the map to see its figures.</p>
              </CardBody>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}

const population = (state: string) => (POPULATION_2011_LAKH[state] ? POPULATION_2011_LAKH[state]! * 1_00_000 : undefined);

/* ══ 4 · Money ══════════════════════════════════════════════════════════════ */

function Money({ viewing, readings, scope, sectionLevel }: PulseProps) {
  const rows = fundsRows(viewing, readings).filter((r) => r.measure.endsWith("B.E."));
  if (scope.state || rows.length === 0) return null;
  const modelled = rows.some((r) => r.origin === "modelled");
  return (
    <section className="pd-section" aria-labelledby="pd-money">
      <SectionTitle
        as={sectionLevel}
        headingId="pd-money"
        size="display"
        eyebrow="Funds"
        title="Is Spending Keeping Pace with the Year?"
        description="Spent as a share of the Budget Estimate, Financial Year 2026-27 up to 30.09.2026 — half the year."
      >
        {modelled ? <ProvenanceChip kind="mock" /> : null}
      </SectionTitle>
      <Card variant="outlined">
        <CardBody>
          <DotPlot
            title="Spent as a share of the Budget Estimate, by scheme"
            rows={rows
              .map((r) => ({ label: r.label.replace("Senior Citizens · ", ""), value: Math.round((r.spent / r.provided) * 1000) / 10, detail: `${compact(r.spent, "crore")} of ${compact(r.provided, "crore")}` }))
              .sort((a, b) => b.value - a.value)}
            reference={{ value: 50, label: "Year elapsed" }}
          />
        </CardBody>
      </Card>
    </section>
  );
}

/* ══ 5 · The data behind it (Ministry and Divisions) ════════════════════════ */

function DataBehind({ viewing, readings, sectionLevel }: PulseProps) {
  const [programme, setProgramme] = React.useState("");
  const [status, setStatus] = React.useState("");
  const rows = readinessRows(viewing, readings);
  const filtered = rows.filter((r) => (!programme || r.p.id === programme) && (!status || r.status === status));
  return (
    <section className="pd-section" aria-labelledby="pd-data">
      <SectionTitle
        as={sectionLevel}
        headingId="pd-data"
        size="display"
        eyebrow="Data Readiness"
        title="Where Each Figure Comes From"
        description={`${rows.length} indicators on file, one square each, as the portals have reported their feeds.`}
      />
      <Card variant="outlined">
        <CardBody>
          <WaffleChart
            title="Indicators by data feed, per programme"
            unit="indicator"
            categories={READINESS_ORDER.map((s) => ({ id: s, label: READINESS_LABEL[s], color: READINESS_SLOT[s] }))}
            rows={viewing.programmes.map((p) => ({
              label: SHORT_NAME[p.id],
              counts: Object.fromEntries(READINESS_ORDER.map((s) => [s, rows.filter((r) => r.p.id === p.id && r.status === s).length])),
            }))}
          />
        </CardBody>
      </Card>
      <Accordion variant="card">
        <AccordionItem title={`Every Indicator (${rows.length})`}>
          <div className="pd-actions pd-actions--filters">
            <FilterSelect label="Programme" value={programme} onChange={setProgramme} options={[{ value: "", label: "All Programmes" }, ...viewing.programmes.map((p) => ({ value: p.id, label: SHORT_NAME[p.id] }))]} />
            <FilterSelect label="Data Feed" value={status} onChange={setStatus} options={[{ value: "", label: "All" }, ...READINESS_ORDER.map((s) => ({ value: s, label: READINESS_LABEL[s] }))]} />
          </div>
          {filtered.length === 0 ? (
            <CardState
              kind="no-results"
              title="No Indicators Match"
              description="No indicator matches the programme and data feed chosen."
              action={
                <Button appearance="outlined" size="sm" onClick={() => { setProgramme(""); setStatus(""); }}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <DataTable<{ _key: string; programme: string; kpi: string; status: Readiness; gap: string } & Record<string, unknown>>
              caption="Every indicator and its data feed"
              total={filtered.length}
              pageSizes={[10, 25, 50]}
              columns={[
                { key: "programme", header: "Programme", render: (r) => r.programme, sortable: true, sortValue: (r) => r.programme },
                { key: "kpi", header: "Indicator", render: (r) => r.kpi, sortable: true, sortValue: (r) => r.kpi },
                {
                  key: "status",
                  header: "Data Feed",
                  render: (r) => (
                    <Badge status={READINESS_TONE[r.status]} size="sm">
                      {READINESS_LABEL[r.status]}
                    </Badge>
                  ),
                  sortable: true,
                  sortValue: (r) => READINESS_ORDER.indexOf(r.status),
                },
                { key: "gap", header: "What Is Missing", render: (r) => r.gap },
              ]}
              data={filtered.map(({ p, k, status: s }) => ({
                _key: k.id,
                programme: k.component ? `${SHORT_NAME[p.id]} · ${COMPONENT_SHORT[k.id.split(".")[1] ?? ""] ?? ""}` : SHORT_NAME[p.id],
                kpi: k.name,
                status: s,
                gap: k.api?.gap ?? "",
              }))}
            />
          )}
        </AccordionItem>
      </Accordion>
      <MinistryCollection headingLevel={sub(sectionLevel) === 3 ? 3 : 2} />
    </section>
  );
}

export function Pulse(props: PulseProps) {
  return (
    <div className="pd-story">
      <Hero {...props} />
      <Programmes {...props} />
      <Where key={props.scope.state ?? "all"} {...props} />
      <Money {...props} />
      {props.readinessAllowed ? <DataBehind {...props} /> : null}
    </div>
  );
}
