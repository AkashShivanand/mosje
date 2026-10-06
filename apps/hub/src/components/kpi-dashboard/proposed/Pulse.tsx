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
  ChartCard,
  DataTable,
  DescriptionList,
  DotPlot,
  FilterSelect,
  FunnelChart,
  HeadlineFigure,
  Icon,
  IndiaTileMap,
  OrgLogo,
  PORTAL_ORG_LOGOS,
  RankedBarList,
  SectionTitle,
  Sparkline,
  WaffleChart,
} from "@mosje/design-system";
import { FigureSource, noteForReading, type SourceNote } from "@/components/website/FigureSource";
import { OriginChip, ProvenanceChip } from "@/components/website/ProvenanceChip";
import { ABOUT_HERO } from "./hero";
import { ALL_FUND_GROUPS, PROGRAMME_AUDIENCE, shows, type Audience } from "./audience";
import type { AreaScope, PortalDashboard, PortalId } from "@/lib/kpi/types";
import { MinistryCollection } from "../DashboardViewer";
import { DASHBOARD_PAGE } from "@/lib/website-shared/dashboard";
import { Education, ShareOfFundRelease } from "./Education";
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
import { PROGRAMME_TONE, READINESS_ORDER, READINESS_SLOT, areaRows, compact, figureOf, readinessRows } from "./story";

/**
 * THE PULSE — the proposed dashboard's one page, told as a story in five movements:
 *
 *   1. THE ANSWER     a hero panel: NMBA's reach in display type, and beside it the
 *                     Department's own figures (Received) — never an illustrative one.
 *   2. STUDENTS       the Beneficiary Dashboard's figures, received from the Department,
 *                     re-organised as scholarships, places, and one year-by-year chooser
 *                     (`Education.tsx`).
 *   3. THE PROGRAMMES a bento of the portals' tiles, each with the ONE picture its data
 *                     is best told by. A tile with nothing to show is not drawn, and the
 *                     grid closes up around the ones that are.
 *   4. WHERE          every State/UT as an equal tile — Lakshadweep as legible as Uttar
 *                     Pradesh — each State/UT's total as the feed reports it; choosing a
 *                     tile opens that State/UT beside the map. No per-person rate: it would need a
 *                     population the Department does not supply.
 *   5. FUNDS          what was released, scheme by scheme (Received), and this year's
 *                     expenditure against its Budget Estimate (illustrative). Placed after
 *                     the Department's sections, before the portals.
 *
 * Every figure carries its own mark — Live, Received or Illustrative — so the page needs no
 * banner saying so.
 *
 * And, for the Ministry and Divisions, 6. THE DATA BEHIND IT: 87 indicators as 87 squares,
 * coloured by where each figure can come from.
 *
 * DS Audit: Card (`accent="fill"` ADDED) / CardHeader / CardIcon / CardBody / CardFooter ✅ ·
 * HeadlineFigure ➕ ADDED · IndiaTileMap ➕ ADDED · DotPlot ➕ ADDED · WaffleChart ➕ ADDED ·
 * FunnelChart ✅ · Sparkline ✅ · RankedBarList ✅ · SectionTitle ✅ ·
 * DescriptionList ✅ · Accordion ✅ · DataTable ✅ · FilterSelect ✅ · CardState ✅ · Badge ✅ ·
 * Button ✅ · Icon ✅ · OriginChip / ProvenanceChip ✅ (app). The stylesheet places them; it styles none.
 */

export interface PulseProps {
  /** The Type of Applicant filter (`audience.ts`); empty = everyone. */
  audiences: Set<Audience>;
  viewing: Viewing;
  readings: Readings;
  national: Readings;
  scope: AreaScope;
  sectionLevel: 2 | 3;
  readinessAllowed: boolean;
  hrefTo: (to: Partial<Record<"programme" | "state" | "for", string | null>>) => string;
  go: (to: Partial<Record<"programme" | "state" | "for", string | null>>) => void;
}

const mark = (origin: string | undefined) => (origin && origin !== "snapshot" ? <OriginChip origin={origin} /> : undefined);

/** The source note for one KPI's reading, or none where there is no reading. */
function noteOf(
  viewing: Viewing,
  readings: Readings,
  programme: PortalId,
  kpiId: string,
  value?: string,
  breakdown?: SourceNote["breakdown"],
  title?: string,
): SourceNote | undefined {
  const k = viewing.programmes.find((p) => p.id === programme)?.kpis.find((x) => x.id === kpiId);
  const r = readings[programme]?.[kpiId];
  return k && r ? noteForReading(k, r, title ?? k.name, value, breakdown) : undefined;
}

/** A chip and an info control, side by side in a figure's mark slot. */
const marked = (origin: string | undefined, note: SourceNote | undefined) => (
  <>
    {mark(origin)}
    <FigureSource note={note} />
  </>
);
const pct = (n: number) => `${n}%`;

/**
 * Portals whose registered mark is their OWN (`PORTAL_ORG_LOGOS`). The Senior Citizens Welfare
 * portal's registered mark is the State Emblem, which names the Department rather than the
 * programme and would make its card the one card without a distinguishing mark — so it keeps
 * its icon. DAPSC (e-Utthaan) and SHRESHTA (e-Anudaan) have no mark in the registry at all.
 */
const OWN_MARK = new Set(["/portals/nmba", "/portals/smile-admin"]);

const areaName = (scope: AreaScope) => scope.district ?? scope.state ?? "All India";
const sub = (level: 2 | 3) => (level === 2 ? 3 : 4) as 3 | 4;

/* ══ 1 · The answer ═════════════════════════════════════════════════════════ */

function Hero({ viewing, readings, scope, sectionLevel, audiences }: PulseProps) {
  const has = (id: PortalId) => (shows(audiences, PROGRAMME_AUDIENCE[id]) ? viewing.programmes.find((p) => p.id === id) : undefined);
  const kpis = (id: PortalId) => has(id)?.kpis ?? [];
  const lead = has("nmba") ? figureOf("nmba", "nmba.outreach", readings, kpis("nmba")) : null;

  /*
   * THE ANSWER IS THE DEPARTMENT'S. All India, the figures beside the lead are the ones
   * the Department has supplied (`ABOUT_HERO`, Received) — never an illustrative figure,
   * because the hero is the part of the page most likely to be screenshotted into a deck.
   * Those figures are not published by State/UT, so a State/UT's hero carries the
   * programme figures that ARE read for it, each with its own mark.
   */
  const side: { key: string; value: string; label: string; origin: string; note?: SourceNote }[] = scope.state
    ? [
        { id: "smile-beggary" as const, kpi: "smile-beggary.identified", label: "persons engaged in begging identified, under SMILE" },
        { id: "senior-citizens" as const, kpi: "senior-citizens.ipsrc.beneficiaries", label: "beneficiaries covered under the Integrated Programme for Senior Citizens" },
      ].flatMap((x) => {
        const f = has(x.id)?.levels.includes("state") ? figureOf(x.id, x.kpi, readings, kpis(x.id)) : null;
        return f ? [{ key: x.kpi, value: compact(f.value, f.kpi.unit), label: x.label, origin: f.origin, note: noteOf(viewing, readings, x.id, x.kpi, compact(f.value, f.kpi.unit)) }] : [];
      })
    // A figure stands only when EVERY group it counts is in view: the nine-scheme total is
    // not an answer for Scheduled Castes alone.
    : ABOUT_HERO.filter((x) => (x.everyOf ? x.everyOf.every((part) => shows(audiences, part)) : shows(audiences, x.audiences))).map((x) => ({ key: x.label, ...x }));
  // Filtered away from NMBA, the hero leads with the first figure that remains; filtered to
  // groups the hero has no departmental figure for, there is no hero — the cards answer.
  const promoted = !lead ? side[0] : undefined;
  const rest = promoted ? side.slice(1) : side;
  if (!lead && !promoted) return null;

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
            context="Cumulative, as reported by the Nasha Mukt Bharat Abhiyaan portal."
            mark={marked(lead.origin, noteOf(viewing, readings, "nmba", "nmba.outreach", compact(lead.value, "number")))}
          />
        ) : promoted ? (
          <HeadlineFigure size="xl" tone="inverse" value={promoted.value} label={promoted.label} mark={marked(promoted.origin, promoted.note)} />
        ) : null}
        {rest.length > 0 ? (
          <ul className="pd-hero__side" aria-label="Other figures">
            {rest.map((s) => (
              <li key={s.key}>
                <HeadlineFigure size="md" tone="inverse" value={s.value} label={s.label} mark={marked(s.origin, s.note)} />
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
        {/* The portal's own mark where it has one that is its own; its icon otherwise. */}
        {OWN_MARK.has(p.logoPath) && PORTAL_ORG_LOGOS[p.logoPath] ? <OrgLogo path={p.logoPath} size="md" name={p.name} /> : <CardIcon name={PROGRAMME_ICON[p.id]} />}
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
          View {SHORT_NAME[p.id]} Dashboard
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

  const nmba = shows(props.audiences, PROGRAMME_AUDIENCE.nmba) ? get("nmba") : undefined;
  if (nmba) {
    const reach = fig("nmba", "nmba.outreach");
    const map = areaRows(national.nmba?.["nmba.outreach-by-state"]);
    const facts = [
      ["nmba.women", "Women Reached"],
      ["nmba.youth", "Youth Reached"],
      ["nmba.pledges", "e-Pledges Taken"],
      ["nmba.mitras", "Nasha Mukti Mitras"],
    ].flatMap(([id, term]) => {
      const f = fig("nmba", id!);
      return f ? [{ term: term!, value: compact(f.value, "number") }] : [];
    });
    if (reach || map.length || facts.length) tiles.push(
      <Tile
        key="nmba"
        p={nmba}
        hrefTo={hrefTo}
        figure={reach ? <HeadlineFigure size="md" value={compact(reach.value, "number")} label="people reached, cumulative since launch" mark={marked(reach.origin, noteOf(viewing, readings, "nmba", "nmba.outreach", compact(reach.value, "number")))} /> : undefined}
      >
        <div className="pd-tile__split">
          {map.length > 0 ? (
            <IndiaTileMap title="People reached, by State/UT" data={map} size="sm" scale="quantile" legend="ramp" selected={scope.state} tableView="sr-only" valueFormat={(v: number) => compact(v, "number")} />
          ) : null}
          {facts.length ? <DescriptionList size="sm" columns={1} divided items={facts} /> : null}
        </div>
      </Tile>,
    );
  }

  const smile = shows(props.audiences, PROGRAMME_AUDIENCE["smile-beggary"]) ? get("smile-beggary") : undefined;
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
    if (stages.length || trend || share !== null) tiles.push(
      <Tile
        key="smile"
        p={smile}
        hrefTo={hrefTo}
        figure={
          stages[0] ? (
            <HeadlineFigure
              size="md"
              value={compact(stages[stages.length - 1]!.value, "number")}
              label={`persons rehabilitated of ${compact(stages[0].value, "number")} identified`}
              mark={marked(
                fig("smile-beggary", "smile-beggary.identified")?.origin,
                noteOf(
                  viewing,
                  readings,
                  "smile-beggary",
                  "smile-beggary.rehabilitated",
                  compact(stages[stages.length - 1]!.value, "number"),
                  {
                    method: "Each stage as a share of persons identified: stage ÷ Identified × 100.",
                    rows: stages.map((x, i) => ({ label: x.label, value: i === 0 ? compact(x.value, "number") : `${compact(x.value, "number")} · ${Math.round((x.value / stages[0]!.value) * 100)}%`, op: i === 0 ? undefined : ("÷" as const) })),
                    result: { label: "Rehabilitated ÷ Identified", value: pct(Math.round((stages[stages.length - 1]!.value / stages[0]!.value) * 100)) },
                  },
                  "Persons Rehabilitated, of Persons Identified",
                ),
              )}
            />
          ) : undefined
        }
      >
        {stages.length >= 2 ? <FunnelChart title="Identification to Rehabilitation" stages={stages.map((x) => ({ ...x, color: "var(--sa-chart-cat-1)" }))} /> : null}
        {trend ? (
          <div className="pd-trend">
            <p className="pd-fact">
              <b>{compact(trend.last, "number")}</b> identified in {trend.lastLabel}, up from {compact(trend.first, "number")} in {trend.firstLabel}.
              <FigureSource
                note={noteOf(viewing, readings, "smile-beggary", "smile-beggary.monthly-trend", compact(trend.last, "number"), {
                  method: "The first and last months of the monthly series.",
                  rows: [
                    { label: `Identified, ${trend.lastLabel}`, value: compact(trend.last, "number") },
                    { label: `Identified, ${trend.firstLabel}`, value: compact(trend.first, "number"), op: "−" },
                  ],
                  result: { label: "Increase over the period", value: `+${compact(trend.last - trend.first, "number")}` },
                })}
              />
            </p>
            <Sparkline data={trend.data} width={420} height={48} label={`Persons identified each month, ${trend.firstLabel} to ${trend.lastLabel}`} />
          </div>
        ) : null}
        {share !== null && released && utilised ? (
          <p className="pd-fact">
            <b>{share}%</b> of funds released has been utilised.
            <FigureSource
              note={noteOf(viewing, readings, "smile-beggary", "smile-beggary.fund-utilised", pct(share), {
                rows: [
                  { label: "Total Fund Utilised", value: compact(utilised.value, "crore") },
                  { label: "Total Fund Released", value: compact(released.value, "crore"), op: "÷" },
                  { label: "As a percentage", value: "100", op: "×" },
                ],
                result: { label: "Share of funds utilised", value: pct(share) },
              }, "Share of Funds Released That Has Been Utilised")}
            />
          </p>
        ) : null}
      </Tile>,
    );
  }

  const dapsc = shows(props.audiences, PROGRAMME_AUDIENCE["e-utthaan"]) ? get("e-utthaan") : undefined;
  if (dapsc) {
    const alloc = readings["e-utthaan"]?.["e-utthaan.allocation"]?.value;
    const exp = readings["e-utthaan"]?.["e-utthaan.expenditure"]?.value;
    const be = alloc?.kind === "series" ? (alloc.series[0]?.data ?? []) : [];
    const growth = be.length > 1 ? Math.round(((be[be.length - 1]! - be[0]!) / be[0]!) * 1000) / 10 : null;
    const spent = exp?.kind === "series" && be.length ? Math.round(((exp.series[0]?.data.at(-1) ?? 0) / be[be.length - 1]!) * 100) : null;
    if (be.length) tiles.push(
      <Tile
        key="dapsc"
        p={dapsc}
        hrefTo={hrefTo}
        note={nationalOnly("e-utthaan") ? NATIONAL_ONLY : undefined}
        figure={be.length ? <HeadlineFigure size="md" value={compact(be[be.length - 1]!, "crore")} label="allocated, B.E. 2026-27" mark={marked(readings["e-utthaan"]?.["e-utthaan.allocation"]?.origin, noteOf(viewing, readings, "e-utthaan", "e-utthaan.allocation", compact(be[be.length - 1]!, "crore")))} /> : undefined}
      >
        {be.length > 1 ? (
          <div className="pd-spark">
            <Sparkline data={be} width={280} height={56} label={`DAPSC allocation, B.E., ${alloc?.kind === "series" ? alloc.labels[0] : ""} to 2026-27: rising from ${compact(be[0]!, "crore")} to ${compact(be[be.length - 1]!, "crore")}`} />
            <DescriptionList
              size="sm"
              columns={2}
              items={[
                ...(growth !== null
                  ? [{
                      term: "Since 2022-23",
                      value: (
                        <>
                          +{growth}%
                          <FigureSource
                            note={noteOf(viewing, readings, "e-utthaan", "e-utthaan.allocation", `+${growth}%`, {
                              rows: [
                                { label: "B.E. 2026-27", value: compact(be[be.length - 1]!, "crore") },
                                { label: "B.E. 2022-23", value: compact(be[0]!, "crore"), op: "−" },
                                { label: "B.E. 2022-23", value: compact(be[0]!, "crore"), op: "÷" },
                                { label: "As a percentage", value: "100", op: "×" },
                              ],
                              result: { label: "Growth since 2022-23", value: `+${growth}%` },
                            }, "Growth in DAPSC Allocation Since 2022-23")}
                          />
                        </>
                      ),
                    }]
                  : []),
                ...(spent !== null && exp?.kind === "series"
                  ? [{
                      term: "Spent, Apr–Sep 2026",
                      value: (
                        <>
                          {spent}%
                          <FigureSource
                            note={noteOf(viewing, readings, "e-utthaan", "e-utthaan.expenditure", pct(spent), {
                              rows: [
                                { label: "Expenditure, Apr–Sep 2026", value: compact(exp.series[0]?.data.at(-1) ?? 0, "crore") },
                                { label: "B.E. 2026-27", value: compact(be[be.length - 1]!, "crore"), op: "÷" },
                                { label: "As a percentage", value: "100", op: "×" },
                              ],
                              result: { label: "Share of B.E. spent", value: pct(spent) },
                            }, "DAPSC Expenditure as a Share of B.E. 2026-27")}
                          />
                        </>
                      ),
                    }]
                  : []),
              ]}
            />
          </div>
        ) : null}
      </Tile>,
    );
  }

  const shreshta = shows(props.audiences, PROGRAMME_AUDIENCE.shreshta) ? get("shreshta") : undefined;
  if (shreshta) {
    const b = readings.shreshta?.["shreshta.beneficiaries"]?.value;
    const funds = fig("shreshta", "shreshta.funds");
    const parts = b?.kind === "breakdown" ? b.items : [];
    const total = parts.reduce((t, x) => t + x.value, 0);
    if (total || funds) tiles.push(
      <Tile
        key="shreshta"
        p={shreshta}
        hrefTo={hrefTo}
        note={nationalOnly("shreshta") ? NATIONAL_ONLY : undefined}
        figure={total ? <HeadlineFigure size="md" value={compact(total, "number")} label="SC students in residential schools" mark={marked(readings.shreshta?.["shreshta.beneficiaries"]?.origin, noteOf(viewing, readings, "shreshta", "shreshta.beneficiaries", compact(total, "number"), {
          method: "The two modes added together. The chart shows each mode's share of every 100 students.",
          rows: parts.map((x, i) => ({ label: x.label, value: compact(x.value, "number"), op: i === 0 ? undefined : ("+" as const) })),
          result: { label: "Students, both modes", value: compact(total, "number") },
        }))} /> : undefined}
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
        {funds ? (
          <p className="pd-fact">
            <b>{compact(funds.value, "crore")}</b> released this year.
            <FigureSource
              note={(() => {
                const f = readings.shreshta?.["shreshta.funds"]?.value;
                const items = f?.kind === "breakdown" ? f.items : [];
                return noteOf(viewing, readings, "shreshta", "shreshta.funds", compact(funds.value, "crore"), {
                  method: "The two modes added together.",
                  rows: items.map((x, i) => ({ label: x.label, value: compact(x.value, "crore"), op: i === 0 ? undefined : ("+" as const) })),
                  result: { label: "Released, both modes", value: compact(funds.value, "crore") },
                });
              })()}
            />
          </p>
        ) : null}
      </Tile>,
    );
  }

  const scw = shows(props.audiences, PROGRAMME_AUDIENCE["senior-citizens"]) ? get("senior-citizens") : undefined;
  if (scw) {
    const rows = fundsRows({ ...viewing, programmes: [scw] }, readings);
    if (rows.length) tiles.push(
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
              mark={marked(rows[0]?.origin === "modelled" ? "modelled" : "live", {
                title: "Senior Citizens Welfare: Expenditure Against Budget",
                value: compact(rows.reduce((t, r) => t + r.spent, 0), "crore"),
                kind: rows[0]?.origin === "modelled" ? "model" : "api",
                source: "Senior Citizens Welfare portal",
                links: viewing.programmes.find((p) => p.id === "senior-citizens")?.kpis.filter((k) => k.id.endsWith(".budget")).flatMap((k) => k.api?.endpoints ?? []).filter((h, i, all) => all.indexOf(h) === i).map((href) => ({ label: href.replace(/^https?:\/\//, ""), href })),
                breakdown: {
                  method: "Each component's expenditure, of its Budget Estimate, added together.",
                  rows: rows.map((r, k) => ({ label: r.label.replace("Senior Citizens · ", ""), value: `${compact(r.spent, "crore")} of ${compact(r.provided, "crore")}`, op: k === 0 ? undefined : ("+" as const) })),
                  result: { label: `All ${rows.length} components`, value: `${compact(rows.reduce((t, r) => t + r.spent, 0), "crore")} of ${compact(rows.reduce((t, r) => t + r.provided, 0), "crore")}` },
                },
              })}
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

  /*
   * A PROGRAMME WITH NOTHING TO SHOW IS NOT DRAWN. In Live mode four of the five have no
   * feed yet, and an outlined tile holding only "Explore DAPSC" told the reader nothing
   * but that something was missing (feedback, 6 Oct 2026). The grid is laid out for the
   * number of tiles that remain (`pd-bento--n<count>`), so it closes up with no gap.
   */
  if (tiles.length === 0) return null;
  return (
    <section className="pd-section" aria-labelledby="pd-programmes">
      <SectionTitle as={sectionLevel} headingId="pd-programmes" size="display" title={DASHBOARD_PAGE.portalsTitle} description={DASHBOARD_PAGE.portalsDescription} />
      <ul className={`pd-bento pd-bento--n${Math.min(tiles.length, 5)}`}>
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
  unit: "number" | "crore";
}

const MAP_METRICS: MapMetric[] = [
  // Only State/UT breakdowns the Department supplies — today NMBA's feed. Nothing is
  // spread across States/UTs by any other figure (instruction, 6 Oct 2026).
  { id: "nmba.outreach-by-state", programme: "nmba", label: "People Reached · NMBA", unit: "number" },
];

function Where({ viewing, national, scope, go, sectionLevel, audiences }: PulseProps) {
  const metrics = MAP_METRICS.filter((m) => shows(audiences, PROGRAMME_AUDIENCE[m.programme]) && viewing.programmes.some((p) => p.id === m.programme) && national[m.programme]?.[m.id]?.value.kind === "areas");
  const [metricId, setMetricId] = React.useState(metrics[0]?.id ?? "");
  // Keyed on the page's State/UT by the caller, so a new page filter starts a new pick.
  const [picked, setPicked] = React.useState<string | undefined>(scope.state);
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0];
  if (!metric) return null;

  const reading = national[metric.programme]?.[metric.id];
  const data = areaRows(reading);
  const fmt = (v: number) => compact(v, metric.unit);
  const tileFmt = (v: number) => compact(v, metric.unit);
  const ranked = [...data].sort((a, b) => b.value - a.value);
  const rank = picked ? ranked.findIndex((r) => r.state === picked) + 1 : 0;
  const title = metric.label;

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
      <SectionTitle as={sectionLevel} headingId="pd-where" size="display" title="State/UT-wise Figures">
        <span className="pd-actions">
          {metrics.length > 1 ? <FilterSelect label="Figure" value={metric.id} onChange={setMetricId} options={metrics.map((m) => ({ value: m.id, label: m.label }))} /> : null}
          <FigureSource note={noteOf(viewing, national, metric.programme, metric.id, undefined, undefined, `${metric.label}, by State/UT`)} />
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
                  <p className="pd-note">Figures for {picked} are not yet published on this dashboard.</p>
                )}
              </CardBody>
              <CardFooter>
                {scope.state === picked ? (
                  <Button appearance="outlined" size="sm" onClick={() => go({ state: null })}>
                    View All-India Figures
                  </Button>
                ) : (
                  <Button appearance="filled" size="sm" onClick={() => go({ state: picked })}>
                    View Figures for {picked}
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
                <p className="pd-note">Select a State/UT on the map to view its figures.</p>
              </CardBody>
            </>
          )}
        </Card>
      </div>
    </section>
  );
}


/* ══ 4 · Money ══════════════════════════════════════════════════════════════ */

function Money({ viewing, readings, scope, sectionLevel, audiences }: PulseProps) {
  // All-India figures; a State/UT view has none.
  const rows = fundsRows(viewing, readings).filter((r) => r.measure.endsWith("B.E.") && shows(audiences, PROGRAMME_AUDIENCE[r.programme]));
  const showShare = shows(audiences, ALL_FUND_GROUPS);
  if (!showShare && rows.length === 0) return null;
  if (scope.state) return null;
  const modelled = rows.some((r) => r.origin === "modelled");
  return (
    <section className="pd-section" aria-labelledby="pd-money">
      <SectionTitle
        as={sectionLevel}
        headingId="pd-money"
        size="display"
        eyebrow="Funds"
        title="Fund Release and Expenditure"
      />
      <div className={showShare && rows.length ? "pd-funds" : "pd-funds pd-funds--one"}>
        {showShare ? <ShareOfFundRelease headingLevel={sub(sectionLevel)} audiences={audiences} /> : null}
        {rows.length ? (
          <ChartCard
            headingLevel={sub(sectionLevel)}
            exportable
            title="Expenditure as a Share of Budget Estimate, by Scheme"
            subtitle="Financial Year 2026-27, up to 30.09.2026"
            actions={
              <>
                {modelled ? <ProvenanceChip kind="mock" /> : null}
                <FigureSource
                  note={{
                    title: "Expenditure as a Share of Budget Estimate",
                    kind: modelled ? "model" : "api",
                    source: "Each scheme's portal: e-Utthaan for DAPSC, the Senior Citizens Welfare portal for its components",
                    breakdown: {
                      method: "For each scheme: expenditure ÷ Budget Estimate × 100, from the two figures shown beside it.",
                      rows: rows.map((r) => ({ label: r.label.replace("Senior Citizens · ", ""), value: `${compact(r.spent, "crore")} ÷ ${compact(r.provided, "crore")} = ${Math.round((r.spent / r.provided) * 1000) / 10}%` })),
                      result: { label: "Reference line: year elapsed at 30.09.2026", value: "6 ÷ 12 months = 50%" },
                    },
                  }}
                />
              </>
            }
          >
            <DotPlot
              title="Expenditure as a share of Budget Estimate, by scheme"
              rows={rows
                .map((r) => ({ label: r.label.replace("Senior Citizens · ", ""), value: Math.round((r.spent / r.provided) * 1000) / 10, detail: `${compact(r.spent, "crore")} of ${compact(r.provided, "crore")}` }))
                .sort((a, b) => b.value - a.value)}
              reference={{ value: 50, label: "Year elapsed" }}
            />
          </ChartCard>
        ) : null}
      </div>
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
        title="Data Source of Each Indicator"
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
      <Education sectionLevel={props.sectionLevel} state={props.scope.state} audiences={props.audiences} />
      <Money {...props} />
      <Programmes {...props} />
      <Where key={props.scope.state ?? "all"} {...props} />
      {props.readinessAllowed ? <DataBehind {...props} /> : null}
    </div>
  );
}
