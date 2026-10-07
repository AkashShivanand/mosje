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
  IndiaMap,
  OrgLogo,
  type CardTone,
  PORTAL_ORG_LOGOS,
  RankedBarList,
  SectionTitle,
  Sparkline,
  WaffleChart,
} from "@mosje/design-system";
import { FigureSource, noteForReading, type SourceNote } from "@/components/website/FigureSource";
import { OriginChip, ProvenanceChip } from "@/components/website/ProvenanceChip";
import { heroFigures } from "./hero";
import { PROGRAMME_AUDIENCE, shows, type Audience } from "./audience";
import type { AreaScope, PortalDashboard, PortalId } from "@/lib/kpi/types";
import { MinistryCollection } from "../DashboardViewer";
import { DASHBOARD_PAGE } from "@/lib/website-shared/dashboard";
import { DepartmentTileContent } from "./Education";
import { DEPARTMENT_NAME, DEPARTMENT_PAGE } from "./DepartmentStory";
import {
  COMPONENT_SHORT,
  PROGRAMME_ICON,
  READINESS_LABEL,
  READINESS_TONE,
  SHORT_NAME,
  fundsRows,
  kpiLabel,
  type Readiness,
  type Readings,
  type Viewing,
} from "./model";
import { PROGRAMME_TONE, READINESS_ORDER, READINESS_SLOT, areaRows, compact, figureOf, readinessRows } from "./story";

/**
 * THE PULSE — the proposed dashboard's one page, GROUPED BY WHO PUBLISHES THE FIGURES
 * (instruction, 6 Oct 2026: reorder logically, keep everything, group it under the right
 * section):
 *
 *   1. THE ANSWER       a hero panel: NMBA's Total Outreach in display type, and beside it
 *                       the Department's cumulative figures, each a link to its card.
 *   2. THE DASHBOARDS   one card for the Department and one per scheme portal (instruction,
 *                       7 Oct 2026: the landing page holds Department and Portal cards; the
 *                       detail is one click in). The Department's card opens its Beneficiary
 *                       Dashboard (`DepartmentStory`), which held 60% of this page until then.
 *   3. WHERE            State/UT-wise Figures — NMBA's
 *                       State/UT breakdown, so it sits with the portals, not the Department.
 *                       No per-person rate: it would need a population the Department does
 *                       not supply, and Census 2011 is fifteen years older than the figures.
 *
 * COLOUR STAYS (instruction, 6 Oct 2026): the hero is the brand's filled panel and each
 * programme's tile keeps its colour on its edge and icon, as the live site's cards do.
 *
 * Every figure carries its own mark — Live, Received or Illustrative — so the page needs no
 * banner saying so.
 *
 * And, for the Ministry and Divisions, 6. THE DATA BEHIND IT: 87 indicators as 87 squares,
 * coloured by where each figure can come from.
 *
 * DS Audit: Card (`accent="fill"` ADDED) / CardHeader / CardIcon / CardBody / CardFooter ✅ ·
 * HeadlineFigure ➕ ADDED · IndiaMap ✅ (the Government's own boundaries, Bharat Maps) · DotPlot ➕ ADDED · WaffleChart ➕ ADDED ·
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
  hrefTo: (to: Partial<Record<"programme" | "state" | "for" | "view", string | null>>) => string;
  go: (to: Partial<Record<"programme" | "state" | "for" | "view", string | null>>) => void;
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
 * A portal card's header is the portal's name with its logo, as the Dashboards by Portal list
 * draws it (instruction, 6 Oct 2026): the registered mark wherever the registry has one
 * (`PORTAL_ORG_LOGOS`), the programme's icon where it has none — today e-Utthaan (DAPSC) and
 * e-Anudaan (SHRESHTA), whose marks the Department has not supplied.
 */
const hasMark = (p: PortalDashboard) => Boolean(PORTAL_ORG_LOGOS[p.logoPath]);

const areaName = (scope: AreaScope) => scope.district ?? scope.state ?? "All India";

const sub = (level: 2 | 3) => (level === 2 ? 3 : 4) as 3 | 4;

/* ══ 1 · The answer ═════════════════════════════════════════════════════════ */

function Hero(props: PulseProps) {
  const { viewing, readings, scope, sectionLevel, audiences } = props;
  const has = (id: PortalId) => (shows(audiences, PROGRAMME_AUDIENCE[id]) ? viewing.programmes.find((p) => p.id === id) : undefined);
  const kpis = (id: PortalId) => has(id)?.kpis ?? [];
  const lead = has("nmba") ? figureOf("nmba", "nmba.outreach", readings, kpis("nmba")) : null;
  const leadAsOn = readings.nmba?.["nmba.outreach"]?.asOn;

  /*
   * THE ANSWER IS THE DEPARTMENT'S. All India, the figures beside the lead are the ones
   * the Department has supplied (`heroFigures`, Received) — never an illustrative figure,
   * because the hero is the part of the page most likely to be screenshotted into a deck.
   * Those figures are not published by State/UT, so a State/UT's hero carries the
   * programme figures that ARE read for it, each with its own mark.
   */
  const side: { key: string; value: string; label: string; context?: string; origin: string; note?: SourceNote; card?: string }[] = scope.state
    ? [
        { id: "smile-beggary" as const, kpi: "smile-beggary.identified" },
        { id: "senior-citizens" as const, kpi: "senior-citizens.ipsrc.beneficiaries" },
      ].flatMap((x) => {
        const f = has(x.id)?.levels.includes("state") ? figureOf(x.id, x.kpi, readings, kpis(x.id)) : null;
        return f ? [{ key: x.kpi, value: compact(f.value, f.kpi.unit), label: kpiLabel(f.kpi), context: SHORT_NAME[x.id], origin: f.origin, note: noteOf(viewing, readings, x.id, x.kpi, compact(f.value, f.kpi.unit)) }] : [];
      })
    // A figure stands only when EVERY group it counts is in view: the nine-scheme total is
    // not an answer for Scheduled Castes alone.
    : heroFigures(scope, audiences).map((x) => ({ key: x.card ?? x.label, ...x }));
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
            label={`${kpiLabel(lead.kpi)}${scope.state ? `, ${scope.state}` : ""}`}
            // What the figure counts, and when (design review, 7 Oct 2026): 34 crore is people
            // reached by awareness activities, not beneficiaries, and the reader must not have
            // to guess which.
            context={`Persons reached by awareness activities under Nasha Mukt Bharat Abhiyaan, since launch${leadAsOn ? `. As on ${leadAsOn}` : ""}`}
            mark={marked(lead.origin, noteOf(viewing, readings, "nmba", "nmba.outreach", compact(lead.value, "number")))}
          />
        ) : promoted ? (
          <HeadlineFigure size="xl" tone="inverse" value={promoted.value} label={promoted.label} context={promoted.context} mark={marked(promoted.origin, promoted.note)} />
        ) : null}
        {rest.length > 0 ? (
          <ul className={rest.length === 1 ? "pd-hero__side pd-hero__side--one" : "pd-hero__side"} aria-label="Other figures">
            {rest.map((s) => (
              <li key={s.key}>
                {/* A figure that leads a card below is a link to it: the hero is the summary,
                    the card the detail, so the figure appearing twice has a job (instruction,
                    6 Oct 2026: the three figures stay, the live cards stay intact). */}
                {"card" in s && s.card ? (
                  <Link className="pd-hero__jump" href={`${props.hrefTo({ programme: DEPARTMENT_PAGE })}#pd-card-${s.card}`}>
                    <HeadlineFigure
                      size="md"
                      tone="inverse"
                      value={s.value}
                      label={s.label}
                      // No arrow after the card's name: beside a figure, a down arrow reads as a
                      // fall (design review, 7 Oct 2026). The link's underline on hover and focus
                      // is the cue.
                      context={s.context}
                    />
                  </Link>
                ) : (
                  <HeadlineFigure size="md" tone="inverse" value={s.value} label={s.label} context={s.context} mark={marked(s.origin, s.note)} />
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </CardBody>
    </Card>
  );
}

/* ══ 2 · The programmes ═════════════════════════════════════════════════════ */

/**
 * One dashboard's card on the landing page. A PORTAL'S CARD IS TITLED BY THE PORTAL'S NAME
 * (instruction, 6–7 Oct 2026) — e-Utthaan, e-Anudaan — with its mark, and the scheme it
 * reports under it; the Department's card by the Department's name.
 */
function DashboardTile({ id, tone, mark, title, subtitle, href, label, children, figure, note }: {
  id: string;
  tone: CardTone;
  mark: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  /** Names the link for a screen reader: each card's visible link says "View Dashboard". */
  label: string;
  children?: React.ReactNode;
  figure?: React.ReactNode;
  note?: string;
}) {
  return (
    <Card tone={tone} accent="edge" className={`pd-tile pd-tile--${id}`}>
      <CardHeader>
        {/* The name sits beside the mark, so the mark takes no accessible name of its own. */}
        {mark}
        <div className="pd-tile__titles">
          <CardTitle size="sm">{title}</CardTitle>
          <CardSubtitle>{subtitle}</CardSubtitle>
        </div>
      </CardHeader>
      <CardBody className="pd-tile__body">
        {note ? <p className="pd-note">{note}</p> : null}
        {figure}
        {children}
      </CardBody>
      <CardFooter>
        <Button appearance="text" size="sm" href={href} linkAs={Link} aria-label={label} iconRight={<Icon name="arrow_forward" size={16} />}>
          View Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}

function Tile({ p, children, figure, hrefTo, note }: { p: PortalDashboard; children?: React.ReactNode; figure?: React.ReactNode; hrefTo: PulseProps["hrefTo"]; note?: string }) {
  return (
    <DashboardTile
      id={p.id}
      tone={PROGRAMME_TONE[p.id]}
      // The portal's own mark where it has one that is its own; its icon otherwise.
      mark={hasMark(p) ? <OrgLogo path={p.logoPath} size="md" /> : <CardIcon name={PROGRAMME_ICON[p.id]} />}
      title={p.portal}
      subtitle={p.name}
      href={hrefTo({ programme: p.id })}
      label={`View the ${p.portal} Dashboard`}
      figure={figure}
      note={note}
    >
      {children}
    </DashboardTile>
  );
}

function Programmes(props: PulseProps) {
  const { viewing, readings, national, scope, hrefTo, sectionLevel, go } = props;
  const get = (id: PortalId) => viewing.programmes.find((p) => p.id === id);
  const kp = (id: PortalId) => get(id)?.kpis ?? [];
  const fig = (id: PortalId, kpi: string) => (get(id) ? figureOf(id, kpi, readings, kp(id)) : null);
  const nationalOnly = (id: PortalId) => Boolean(scope.state) && !get(id)?.levels.includes("state");
  const NATIONAL_ONLY = "Publishes All-India figures only.";

  const tiles: React.ReactNode[] = [];


  /*
   * NMBA: ITS MAP, AND ITS FOUR OTHER FIGURES. Not its reach again — the hero leads with it
   * (design audit, 6 Oct 2026). The map stays (instruction, 6 Oct 2026) and is a CONTROL
   * here, not a second picture: choosing a State/UT on it sets the page's area, the same
   * choice the State / UT filter makes, so the tile is a way into a State's figures.
   */
  const nmba = shows(props.audiences, PROGRAMME_AUDIENCE.nmba) ? get("nmba") : undefined;
  if (nmba) {
    const map = areaRows(national.nmba?.["nmba.outreach-by-state"]);
    const mapKpi = get("nmba")?.kpis.find((k) => k.id === "nmba.outreach-by-state");
    const facts = ["nmba.women", "nmba.youth", "nmba.pledges", "nmba.mitras"].flatMap((id) => {
      const f = fig("nmba", id);
      return f ? [{ id, term: kpiLabel(f.kpi), value: compact(f.value, "number"), origin: f.origin }] : [];
    });
    if (map.length || facts.length) tiles.push(
      <Tile key="nmba" p={nmba} hrefTo={hrefTo}>
        <div className="pd-tile__split">
          {map.length > 0 ? (
            <IndiaMap
              title={mapKpi ? kpiLabel(mapKpi) : "Total Outreach by State/UT"}
              data={map}
              scale="quantile"
              legend="ramp"
              selected={scope.state}
              onSelect={(state: string) => go({ state })}
              tableView="sr-only"
              valueFormat={(v: number) => compact(v, "number")}
            />
          ) : null}
          {/* The live cards' figure style — a capitalised label over the figure — so every
              card on the page reads the same way (design audit, 6 Oct 2026). */}
          {facts.length ? (
            <div className="pd-tile__figures">
            <DescriptionList
              size="figure"
              caps
              columns={1}
              items={facts.map((x) => ({ term: x.term, value: <>{x.value}{marked(x.origin, noteOf(viewing, readings, "nmba", x.id, x.value))}</> }))}
            />
            </div>
          ) : null}
        </div>
      </Tile>,
    );
  }

  /*
   * SMILE – BEGGARY, IN THE SHEET'S WORDS AND WITHIN THE VIEWER'S KPIs. The stages are three
   * public KPIs and are labelled by their own names. The share each stage keeps of the first
   * IS the conversion rate — KPIs 23 and 24, Office (Post-Login) — so a citizen sees the
   * counts and the bars, and only an officer sees the percentages (instruction, 6 Oct 2026).
   * The funds are the two public KPIs as figures, not a utilisation rate worked out from them.
   */
  const smile = shows(props.audiences, PROGRAMME_AUDIENCE["smile-beggary"]) ? get("smile-beggary") : undefined;
  if (smile) {
    const officer = viewing.audience === "officer";
    const stageFigs = ["smile-beggary.identified", "smile-beggary.mobilised", "smile-beggary.rehabilitated"].flatMap((id) => {
      const f = fig("smile-beggary", id);
      return f ? [f] : [];
    });
    const stages = stageFigs.map((f) => ({ label: kpiLabel(f.kpi), value: f.value }));
    const identified = stageFigs.find((f) => f.kpi.id === "smile-beggary.identified");
    const rehabilitated = stageFigs.find((f) => f.kpi.id === "smile-beggary.rehabilitated");
    const funds = ["smile-beggary.fund-released", "smile-beggary.fund-utilised"].flatMap((id) => {
      const f = fig("smile-beggary", id);
      return f ? [{ term: kpiLabel(f.kpi), value: compact(f.value, "crore") }] : [];
    });
    const series = readings["smile-beggary"]?.["smile-beggary.monthly-trend"]?.value;
    const identifiedSeries = series?.kind === "series" ? series.series.find((x) => x.name === "Identified") : undefined;
    const trend =
      series?.kind === "series" && identifiedSeries && identifiedSeries.data.length > 1
        ? {
            first: identifiedSeries.data[0]!,
            last: identifiedSeries.data[identifiedSeries.data.length - 1]!,
            firstLabel: series.labels[0]!,
            lastLabel: series.labels[series.labels.length - 1]!,
          }
        : null;
    if (stages.length || trend || funds.length) tiles.push(
      <Tile
        key="smile"
        p={smile}
        hrefTo={hrefTo}
        figure={
          rehabilitated ? (
            <HeadlineFigure
              size="md"
              value={compact(rehabilitated.value, "number")}
              label={kpiLabel(rehabilitated.kpi)}
              context={identified ? `of ${compact(identified.value, "number")} ${kpiLabel(identified.kpi)}` : undefined}
              mark={marked(rehabilitated.origin, noteOf(viewing, readings, "smile-beggary", "smile-beggary.rehabilitated", compact(rehabilitated.value, "number")))}
            />
          ) : undefined
        }
      >
        {stages.length >= 2 ? (
          <FunnelChart title="Identification to Rehabilitation" showShare={officer} stages={stages.map((x) => ({ ...x, color: "var(--sa-chart-cat-1)" }))} />
        ) : null}
        {trend && identified ? (
          <p className="pd-fact">
            {kpiLabel(identified.kpi)}: <b>{compact(trend.last, "number")}</b> in {trend.lastLabel}, up from {compact(trend.first, "number")} in {trend.firstLabel}.
            <FigureSource
              note={noteOf(viewing, readings, "smile-beggary", "smile-beggary.monthly-trend", compact(trend.last, "number"), {
                method: "The first and last months of the monthly series.",
                rows: [
                  { label: `${trend.lastLabel}`, value: compact(trend.last, "number") },
                  { label: `${trend.firstLabel}`, value: compact(trend.first, "number"), op: "−" },
                ],
                result: { label: "Increase over the period", value: `+${compact(trend.last - trend.first, "number")}` },
              })}
            />
          </p>
        ) : null}
        {funds.length ? <DescriptionList size="figure" caps columns={2} items={funds} /> : null}
      </Tile>,
    );
  }

  /*
   * THE DEPARTMENT, AFTER NMBA AND SMILE (design review, 7 Oct 2026): its Beneficiary Dashboard
   * opens behind this card. Beside NMBA's map it stood half empty; in the second row it shares
   * the row with e-Utthaan's card, at about its height. It figures in the Type of Applicant
   * filter as its cards do, and publishes for All India only.
   */
  const dept = DepartmentTileContent({ audiences: props.audiences });
  if (dept) tiles.push(
    <DashboardTile
      key="department"
      id="department"
      tone="primary"
      mark={<OrgLogo path={null} size="md" name="" />}
      title={DEPARTMENT_NAME}
      subtitle="Beneficiary Dashboard"
      href={hrefTo({ programme: DEPARTMENT_PAGE })}
      label="View the Department's Beneficiary Dashboard"
      note={scope.state ? NATIONAL_ONLY : undefined}
      figure={dept.figure}
    >
      {dept.body}
    </DashboardTile>,
  );

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
        figure={be.length ? <HeadlineFigure size="md" value={compact(be[be.length - 1]!, "crore")} label="Allocated, B.E. 2026-27" mark={marked(readings["e-utthaan"]?.["e-utthaan.allocation"]?.origin, noteOf(viewing, readings, "e-utthaan", "e-utthaan.allocation", compact(be[be.length - 1]!, "crore")))} /> : undefined}
      >
        {be.length > 1 ? (
          <div className="pd-spark">
            <Sparkline
              data={be}
              width={420}
              height={56}
              label={`DAPSC allocation, B.E., ${alloc?.kind === "series" ? alloc.labels[0] : ""} to 2026-27: rising from ${compact(be[0]!, "crore")} to ${compact(be[be.length - 1]!, "crore")}`}
              startLabel={alloc?.kind === "series" ? alloc.labels[0] : undefined}
              endLabel={alloc?.kind === "series" ? alloc.labels[alloc.labels.length - 1] : undefined}
              markLast
            />
            <DescriptionList
              // The live cards' figure style, as every other card on the page (design audit, 6 Oct 2026).
              size="figure"
              caps
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

  /*
   * SENIOR CITIZENS WELFARE: ITS PUBLIC KPIs FOR A CITIZEN, ITS BUDGET FOR AN OFFICER. The
   * sheet marks every Budget Estimate, Budget Expenditure and Financial Progress row Official
   * (Post-Login), so the readings gate (`readAll`) removes them from a citizen's page and
   * `fundsRows` is empty there. The tile leads with IP-SrC's beneficiaries and lists four of the
   * Pre-Login KPIs, one per component, each labelled by `kpiLabel`.
   */
  const scw = shows(props.audiences, PROGRAMME_AUDIENCE["senior-citizens"]) ? get("senior-citizens") : undefined;
  if (scw) {
    const lead = fig("senior-citizens", "senior-citizens.ipsrc.beneficiaries");
    const facts = ["senior-citizens.rvy.devices", "senior-citizens.pm-special.caregivers", "senior-citizens.elderline.calls", "senior-citizens.sage.startups"].flatMap((id) => {
      const f = fig("senior-citizens", id);
      return f ? [{ term: kpiLabel(f.kpi), value: compact(f.value, f.kpi.unit) }] : [];
    });
    const rows = fundsRows({ ...viewing, programmes: [scw] }, readings);
    const spent = rows.reduce((t, r) => t + r.spent, 0);
    const provided = rows.reduce((t, r) => t + r.provided, 0);
    if (lead || facts.length || rows.length) tiles.push(
      <Tile
        key="scw"
        p={scw}
        hrefTo={hrefTo}
        note={nationalOnly("senior-citizens") ? NATIONAL_ONLY : undefined}
        figure={
          lead ? (
            <HeadlineFigure
              size="md"
              value={compact(lead.value, lead.kpi.unit)}
              label={lead.kpi.name}
              context={lead.kpi.component}
              mark={marked(lead.origin, noteOf(viewing, readings, "senior-citizens", "senior-citizens.ipsrc.beneficiaries", compact(lead.value, lead.kpi.unit)))}
            />
          ) : undefined
        }
      >
        {facts.length ? <DescriptionList size="figure" caps columns={2} items={facts} /> : null}
        {/* Officers only — the readings gate leaves no budget figure on a citizen's page. One
            sentence, not a second copy of the Funds chart (design audit, 6 Oct 2026). */}
        {rows.length && provided ? (
          <p className="pd-fact">
            <b>{compact(spent, "crore")}</b> of {compact(provided, "crore")} Budget Estimate spent by 30 Sep 2026 ({pct(Math.round((spent / provided) * 100))}), with half of the financial year elapsed.
          </p>
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
      <SectionTitle as={sectionLevel} headingId="pd-programmes" size="display" title={DASHBOARD_PAGE.dashboardsTitle} description={DASHBOARD_PAGE.dashboardsDescription} />
      {/* NMBA, the one tile with a map, takes the row; the others share the next one, so
          no map is squeezed into a third of the page (design audit, 6 Oct 2026). */}
      <ul className={`pd-bento pd-bento--n${Math.min(tiles.length, 6)} pd-bento--portals`}>
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
  { id: "nmba.outreach-by-state", programme: "nmba", label: "Total Outreach · NMBA", unit: "number" },
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
          const name = kpiLabel(k).replace(" by State/UT", "");
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
            <IndiaMap title={title} data={data} valueFormat={fmt} legendFormat={tileFmt} scale="quantile" selected={picked} onSelect={setPicked} tableView="sr-only" />
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
                  <CardTitle>Highest and Lowest</CardTitle>
                  <CardSubtitle>{title}</CardSubtitle>
                </div>
              </CardHeader>
              {/* As drawn in Figma (Option B, "Highest and Lowest"): two labelled groups of
                  Ranked Bar Rows, every bar against the highest State/UT. */}
              <CardBody className="pd-extremes">
                <div className="pd-extremes__group">
                  <h4 className="pd-extremes__label">Highest Five</h4>
                  <RankedBarList title={`${title}, highest five`} items={ranked.slice(0, 5).map((r) => ({ label: r.state, value: r.value }))} max={ranked[0]?.value} valueFormat={fmt} showRank size="md" sort="none" />
                </div>
                <div className="pd-extremes__group">
                  <h4 className="pd-extremes__label">Lowest Five</h4>
                  <RankedBarList title={`${title}, lowest five`} items={ranked.slice(-5).map((r, i) => ({ label: r.state, value: r.value, detail: `${ranked.length - 4 + i} of ${ranked.length}` }))} max={ranked[0]?.value} valueFormat={fmt} showRank={false} showBar={false} size="md" sort="none" />
                </div>
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
  // NOT DAPSC. Its B.E. is the allocation for Scheduled Castes across every Ministry — a
  // different kind of figure from this Department's own schemes — and its tile already says
  // what share of it is spent (design audit, 6 Oct 2026).
  const rows = fundsRows(viewing, readings).filter((r) => r.measure.endsWith("B.E.") && r.programme !== "e-utthaan" && shows(audiences, PROGRAMME_AUDIENCE[r.programme]));
  const nameOf = (r: (typeof rows)[number]) => r.fullName ?? r.label.replace("Senior Citizens · ", "");
  // Share of Fund Release sits with Year by Year Trends, as the live page groups it. What is
  // left here is expenditure against the Budget Estimate — officer KPIs, so a citizen's
  // readings (`readAll`) leave this section empty and it is not drawn.
  if (rows.length === 0 || scope.state) return null;
  const modelled = rows.some((r) => r.origin === "modelled");
  return (
    <section className="pd-section" aria-labelledby="pd-money">
      <SectionTitle
        as={sectionLevel}
        headingId="pd-money"
        size="display"
        title="Expenditure Against Budget Estimate"
      />
      <div className="pd-funds pd-funds--one">
        {rows.length ? (
          <ChartCard
            variant="outlined"
            headingLevel={sub(sectionLevel)}
            title="Expenditure as a Share of Budget Estimate, by Scheme"
            subtitle="Financial Year 2026-27, up to 30 Sep 2026"
            actions={
              <>
                {modelled ? <ProvenanceChip kind="mock" /> : null}
                <FigureSource
                  note={{
                    title: "Expenditure as a Share of Budget Estimate",
                    kind: modelled ? "model" : "api",
                    source: "The Senior Citizens Welfare portal, for each of its components",
                    breakdown: {
                      method: "For each scheme: expenditure ÷ Budget Estimate × 100, from the two figures shown beside it.",
                      rows: rows.map((r) => ({ label: nameOf(r), value: `${compact(r.spent, "crore")} ÷ ${compact(r.provided, "crore")} = ${Math.round((r.spent / r.provided) * 1000) / 10}%` })),
                      result: { label: "Reference line: year elapsed at 30 Sep 2026", value: "6 ÷ 12 months = 50%" },
                    },
                  }}
                />
              </>
            }
          >
            <DotPlot
              title="Expenditure as a share of Budget Estimate, by scheme"
              rows={rows
                .map((r) => ({ label: nameOf(r), value: Math.round((r.spent / r.provided) * 1000) / 10, detail: `${compact(r.spent, "crore")} of ${compact(r.provided, "crore")}` }))
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

/**
 * DATA SOURCE OF EACH INDICATOR — its own page (`?view=data-sources`), for the Ministry and
 * Divisions only. It reports on the data pipeline, not on the schemes, so it does not sit in
 * the dashboard a citizen reads (instruction, 6 Oct 2026); the dashboard links to it for the
 * officer roles that may open it.
 */
export function DataBehind({ viewing, readings, sectionLevel }: Pick<PulseProps, "viewing" | "readings" | "sectionLevel">) {
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

/** The officer roles' way to the Data Source of Each Indicator page. */
function DataSourcesLink({ hrefTo }: PulseProps) {
  return (
    <Card className="pd-officer">
      <CardBody className="pd-officer__body">
        <div className="pd-officer__text">
          <CardTitle size="sm">Data Source of Each Indicator</CardTitle>
          <p className="pd-note">Every indicator on this dashboard, its data feed, and the KPI collection status. Ministry and Divisions only.</p>
        </div>
        <Button appearance="outlined" size="sm" href={hrefTo({ view: "data-sources" })} linkAs={Link} iconRight={<Icon name="arrow_forward" size={16} />}>
          Open
        </Button>
      </CardBody>
    </Card>
  );
}

export function Pulse(props: PulseProps) {
  return (
    <div className="pd-story">
      <Hero {...props} />
      <Money {...props} />
      {/* The Department's and the portals' dashboards, one card each, then where they work. */}
      <Programmes {...props} />
      <Where key={props.scope.state ?? "all"} {...props} />
      {props.readinessAllowed ? <DataSourcesLink {...props} /> : null}
    </div>
  );
}
