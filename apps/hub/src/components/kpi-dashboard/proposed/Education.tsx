"use client";

import * as React from "react";
import {
  Badge,
  BarChart,
  Card,
  CardBody,
  CardHeader,
  CardIcon,
  CardSubtitle,
  CardTitle,
  ChartCard,
  DescriptionList,
  HeadlineFigure,
  LineChart,
  RankedBarList,
  SectionTitle,
  Sparkline,
  type CardTone,
} from "@mosje/design-system";
import { FigureSource, type SourceNote } from "@/components/website/FigureSource";
import { OriginChip } from "@/components/website/ProvenanceChip";
import {
  BENEFICIARY_TRENDS,
  DEPARTMENT_DASHBOARD_AS_ON,
  DEPARTMENT_DASHBOARD_ORIGIN,
  DEPARTMENT_DASHBOARD_SOURCE,
  DEPARTMENT_DASHBOARD_URL,
  FUND_SHARE,
  HOSTELS,
  SCHOLARSHIPS,
  YEAR_ON_YEAR,
  type DeptMetric,
} from "@/lib/website-shared/dashboard";
import { FitChart } from "../DepartmentOverview";
import { HostelCard, deptAmount } from "../DepartmentCards";
import { SegmentedButtons } from "./SegmentedButtons";
import { CARD_AUDIENCE, FUND_SLICE_AUDIENCE, TREND_AUDIENCE, YOY_AUDIENCE, shows, type Audience } from "./audience";

/**
 * THE DEPARTMENT'S BENEFICIARY DASHBOARD, in the proposed dashboard's style.
 *
 * ONLY THE PRESENTATION CHANGES (instruction, 6 Oct 2026). Every figure, label, title,
 * series name and axis title is the live page's — https://www.dosje.gov.in/dashboard/,
 * re-read 6 Oct 2026 — taken from the shared record (`lib/website-shared/dashboard.ts`),
 * never re-typed here. Card titles and labels are never altered.
 *
 * WHAT IS OURS IS THE ARRANGEMENT (instruction, 6 Oct 2026):
 *   - Scholarships and Fellowship · Hostels and Top Class Education: each live card is a
 *     tile with its lead figure in display type, and — where the live page publishes the
 *     years behind it — a trend line from that series.
 *   - Year by Year Trends: Beneficiary Students, full width, with its SC / OBC / SHREYAS views,
 *     drawn with straight segments: the series are one figure a year, and a curve between two
 *     years draws values nobody reported (design audit, 6 Oct 2026).
 *   - Year on Year Report: the three cards side by side, so they can be compared. Each draws
 *     the count as bars and the fund release as a line, on two axes, as the live page does
 *     (instruction, 6 Oct 2026) — with straight segments, the fund line in its own colour,
 *     and both latest-year figures stated in the subtitle.
 *   - The results (scholarships, places) and the trends are two movements of the page, so the
 *     portals' results can sit beside the Department's before either is followed over time
 *     (`EducationResults`, `EducationTrends`).
 *   - Each scheme's tile keeps the live card's colour on its edge and icon (instruction,
 *     6 Oct 2026: the dashboard stays colourful, as the live site is). Colour is identity,
 *     never data: the charts draw from the chart palette.
 *   - Share of Fund Release moves to the page's Funds section, beside expenditure, because it
 *     is a split of money, not a trend (`ShareOfFundRelease`). It is drawn as ranked bars:
 *     nine slices, one of them two-thirds of the whole, compare far better by length than by
 *     angle, each with its amount and share as the live ring's tooltip gives them.
 *
 * DERIVED FIGURES, EACH WITH ITS WORKING behind the demo rail's sources switch: the Pre- plus
 * Post-Matric students on the two scholarship lines, and each scheme's share of the fund
 * total. Nothing else is calculated.
 *
 * DS Audit: Card / CardHeader / CardIcon / CardBody ✅ · HeadlineFigure ✅ · DescriptionList ✅ ·
 * Badge ✅ · Sparkline (`startLabel`/`endLabel`/`markLast` ➕ ADDED) ✅ · ChartCard (`variant` ➕ ADDED) ✅ ·
 * LineChart ✅ · BarChart ✅ · RankedBarList ✅ · ButtonGroup (SegmentedButtons) ✅ ·
 * SectionTitle ✅ · OriginChip / FigureSource (app) ✅.
 */

const RECEIVED = <OriginChip origin={DEPARTMENT_DASHBOARD_ORIGIN} />;
/** Every figure in a section: the Department's, as received, shown as published. */
const receivedNote = (title: string): SourceNote => ({
  title,
  kind: "document",
  source: DEPARTMENT_DASHBOARD_SOURCE,
  asOn: DEPARTMENT_DASHBOARD_AS_ON,
  links: [{ label: "Beneficiary Dashboard, as published", href: DEPARTMENT_DASHBOARD_URL }],
});
/** A section's marks: the Received chip, and the info control beside it. */
const sectionMarks = (title: string) => (
  <span className="pd-actions">
    {RECEIVED}
    <FigureSource note={receivedNote(title)} />
  </span>
);


const count = (n: number) => n.toLocaleString("en-IN");

/** A card of the shared record by its id. The record is a constant; a missing id is a bug, not a state. */
function card<T extends { id: string }>(cards: readonly T[], id: string): T {
  const c = cards.find((x) => x.id === id);
  if (!c) throw new Error(`Beneficiary Dashboard record has no card "${id}"`);
  return c;
}
/** The i-th entry of a record's list — present by construction (`dashboard.ts`). */
function nth<T>(list: readonly T[] | undefined, i: number): T {
  const v = list?.[i];
  if (v === undefined) throw new Error(`Beneficiary Dashboard record has no entry ${i}`);
  return v;
}


function Tile({ tone, icon, title, subtitle, children }: { tone: CardTone; icon: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card tone={tone} accent="edge" className="pd-tile">
      <CardHeader>
        <CardIcon name={icon} />
        <div className="pd-tile__titles">
          <CardTitle size="sm">{title}</CardTitle>
          {subtitle ? <CardSubtitle>{subtitle}</CardSubtitle> : null}
        </div>
      </CardHeader>
      <CardBody className="pd-tile__body">{children}</CardBody>
    </Card>
  );
}

/** One live metric as a lead figure: its value, its label, and the line the live page sets under it. */
const Lead = ({ m }: { m: DeptMetric }) => <HeadlineFigure size="md" value={deptAmount(m)} label={m.label} context={m.sub} />;
// At body size, not caption size: the rupee figures under a lead are the card's other half,
// and set at 12px they read as a footnote to the student count (design audit, 6 Oct 2026).
const Rest = ({ ms }: { ms: DeptMetric[] }) => <DescriptionList size="md" columns={2} items={ms.map((m) => ({ term: m.label, value: deptAmount(m) }))} />;


/** The working behind a students figure that adds two published series (Pre- and Post-Matric). */
function studentsNote(title: string, labels: readonly string[], data: number[], parts: { name: string; value: number }[], format: (n: number) => string): SourceNote {
  const year = labels[labels.length - 1]!.replace("*", "");
  return {
    ...receivedNote(`${title}, ${year}`),
    value: format(data[data.length - 1]!),
    breakdown: {
      method: `Pre-Matric and Post-Matric students added together, from the Year by Year Trends series. The line draws the same sum for each year from ${labels[0]!.replace("*", "")}.`,
      rows: parts.map((x, i) => ({ label: x.name, value: format(x.value), op: i === 0 ? undefined : ("+" as const) })),
      result: { label: `Students, ${year}`, value: format(data[data.length - 1]!) },
    },
  };
}

/**
 * A tile's trend line, from a series the live page publishes. Where two published series
 * are added together (Pre-Matric and Post-Matric students), the line says so and its info
 * control sets the sum out for the latest year (instruction, 6 Oct 2026: derived is fine
 * when the working is shown).
 */
function TrendLine({ title, labels, data, unit, format, parts, fact = true, width = 420 }: {
  title: string;
  labels: readonly string[];
  data: number[];
  unit: string;
  format: (n: number) => string;
  parts?: { name: string; value: number }[];
  /** The sentence stating the latest year. Off where the card already leads with that figure. */
  fact?: boolean;
  /** The line's drawn width; it scales down to its column. Narrower inside a card's half. */
  width?: number;
}) {
  const last = labels[labels.length - 1]!;
  const year = last.replace("*", "");
  const provisional = last.endsWith("*");
  return (
    <div className="pd-trend">
      {fact ? (
      <p className="pd-fact">
        <b>{format(data[data.length - 1]!)}</b> {unit} in {year}
        {provisional ? " (provisional)" : ""}.
        {parts ? (
          <FigureSource note={studentsNote(title, labels, data, parts, format)} />
        ) : null}
      </p>
      ) : null}
      <Sparkline data={data} width={width} height={44} label={`${title}: ${unit}, each year, ${labels[0]!.replace("*", "")} to ${year}`} startLabel={labels[0]!.replace("*", "")} endLabel={year} markLast />
    </div>
  );
}

const lakh = (n: number) => `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakh`;
const sumSeries = (a: readonly number[], b: readonly number[]) => a.map((v, i) => Math.round((v + (b[i] ?? 0)) * 100) / 100);


/* ── Year by Year Trends ───────────────────────────────────────────────────── */

type TrendId = (typeof BENEFICIARY_TRENDS.views)[number]["id"];

function BeneficiaryStudents({ headingLevel, audiences }: { headingLevel: 3 | 4; audiences: Set<Audience> }) {
  const views = BENEFICIARY_TRENDS.views.filter((v) => shows(audiences, TREND_AUDIENCE[v.id] ?? "obc"));
  const [picked, setId] = React.useState<TrendId>("sc");
  // A view the filter has just removed falls back to the first one it allows.
  const view = views.find((v) => v.id === picked) ?? views[0]!;
  const id = view.id;
  return (
    <ChartCard
      variant="outlined"
      headingLevel={headingLevel}
      title={BENEFICIARY_TRENDS.cardTitle}
      // With one view left there is no switch to name it, so the card names it.
      subtitle={views.length === 1 ? view.label : undefined}
      actions={
        views.length > 1 ? (
          <SegmentedButtons label="Students shown" value={id} onChange={setId} options={views.map((v) => ({ value: v.id, label: v.label }))} />
        ) : undefined
      }
      footer={view.provisional ? BENEFICIARY_TRENDS.footnote : undefined}
    >
      <FitChart fallback={640}>
        {(width) => (
          <LineChart
            title={`${BENEFICIARY_TRENDS.cardTitle}, ${view.label}: ${view.unit}`}
            labels={[...view.labels]}
            series={view.series.map((s) => ({ name: s.name, data: [...s.data], color: s.color }))}
            valueFormat={view.unit === "Scholars Funded" ? count : (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            yLabel={view.unit}
            showDots
            tableView="sr-only"
            tickCount={6}
            width={width}
            height={320}
          />
        )}
      </FitChart>
    </ChartCard>
  );
}

export function ShareOfFundRelease({ headingLevel, audiences }: { headingLevel: 3 | 4; audiences: Set<Audience> }) {
  const slices = FUND_SHARE.slices.filter((s) => shows(audiences, FUND_SLICE_AUDIENCE[s.label] ?? "obc"));
  // The share is computed as the live ring's tooltip computes it: slice ÷ the nine slices,
  // to one decimal. The sum itself is never printed — the live page does not print it.
  const whole = FUND_SHARE.slices.reduce((t, s) => t + s.value, 0);
  return (
    <ChartCard
      variant="outlined"
      headingLevel={headingLevel}
      title={FUND_SHARE.title}
      subtitle={FUND_SHARE.subtitle}
      actions={
        <FigureSource
          note={{
            ...receivedNote(FUND_SHARE.title),
            breakdown: {
              method: "Each scheme's share: its fund release ÷ the nine schemes together × 100, to one decimal — as the live chart's own tooltip computes it.",
              rows: FUND_SHARE.slices.map((s) => ({ label: s.label, value: `${s.display} · ${((s.value / whole) * 100).toFixed(1)}%` })),
              result: { label: "Nine schemes together", value: `₹${whole.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr · 100%` },
            },
          }}
        />
      }
    >
      {/* RANKED BARS, NOT THE LIVE PAGE'S RING (design review, 7 Oct 2026): one slice is
          two-thirds of the whole and six are under 2%, past the five a ring can show. The same
          amounts in the same order, each with its share as the live ring's tooltip gives it. */}
      <RankedBarList
        title={`${FUND_SHARE.title}: ${FUND_SHARE.subtitle}`}
        items={slices.map((sl) => ({ label: sl.label, value: sl.value, detail: `${((sl.value / whole) * 100).toFixed(1)}%` }))}
        valueFormat={(n: number) => `₹${Math.round(n).toLocaleString("en-IN")} Cr`}
        sort="desc"
        showRank={false}
        size="md"
      />
    </ChartCard>
  );
}

/* ── Year on Year Report ───────────────────────────────────────────────────── */

/**
 * One Year on Year card: the scheme's count and its fund release, year by year, in ONE card
 * (instruction, 6 Oct 2026) — as two aligned panels over the same years, not one plot on two
 * axes (design review, 7 Oct 2026). Two scales on one plot made the point where the line
 * crossed a bar a product of how the axes were set, and readers took it for a relationship;
 * ONS, the Analysis Function and Few all advise against it. Both panels are bars on the same
 * bands, so each year's count and fund stand one over the other. Kept from before:
 *  - each measure keeps ONE colour wherever it appears on the page: counts in the first slot,
 *    fund release in the third;
 *  - the subtitle states both latest-year figures, so neither is read off an axis.
 */
const COUNT_COLOUR = "var(--sa-chart-cat-1)";
const FUND_COLOUR = "var(--sa-chart-cat-3)";

function YearOnYearCard({ c, headingLevel }: { c: (typeof YEAR_ON_YEAR.cards)[number]; headingLevel: 3 | 4 }) {
  const year = c.labels[c.labels.length - 1]!;
  const lastCount = c.count.data[c.count.data.length - 1]!;
  const lastFund = c.fund.data[c.fund.data.length - 1]!;
  const takeaway = `${year}: ${count(lastCount)} ${c.count.axis} · ₹${lastFund.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  return (
    // No coloured header band: the live page's three bands would make these the only banded
    // cards on the page. The title is the live card's, unaltered.
    <ChartCard variant="outlined" headingLevel={headingLevel} title={c.title} subtitle={takeaway}>
      <FitChart fallback={400}>
        {(width) => (
          <div className="pd-panels">
            <BarChart
              title={`${c.title}: ${c.count.name}, by year`}
              labels={[...c.labels]}
              series={[{ name: c.count.name, data: [...c.count.data], color: COUNT_COLOUR }]}
              yLabel={c.count.axis}
              valueFormat={count}
              tableView="sr-only"
              width={width}
              height={180}
            />
            {/* Bars on the same bands as the counts above, so each year's two figures stand
                one over the other — a line's points fall between bar centres. */}
            <BarChart
              title={`${c.title}: ${c.fund.name}, by year`}
              labels={[...c.labels]}
              series={[{ name: c.fund.name, data: [...c.fund.data], color: FUND_COLOUR }]}
              yLabel="Fund (₹ Cr)"
              valueFormat={(n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              tableView="sr-only"
              width={width}
              height={160}
            />
          </div>
        )}
      </FitChart>
    </ChartCard>
  );
}


/* ── The movement ──────────────────────────────────────────────────────────── */

interface MovementProps {
  sectionLevel: 2 | 3;
  state?: string;
  audiences: Set<Audience>;
}



/**
 * On a State/UT view, a section the Department publishes only for All India says so in its
 * heading row, as a badge beside its period — not as a sentence under the heading, and not
 * once per section in prose (the area bar names which programmes have State/UT figures).
 */
export const allIndiaBadge = (state?: string) =>
  state ? (
    <Badge status="neutral" size="sm">
      All-India Figures
    </Badge>
  ) : null;

/**
 * The Department's results: Scholarships and Fellowship, then Hostels and Top Class Education.
 *
 * TWO STYLES, EACH THE ONE THAT READ BEST (instruction, 6 Oct 2026). Scholarships and
 * Fellowship: each live card as a tile — its lead figure in display type, its two fund figures
 * under it, and the trend line the live page publishes the years for.
 *
 * EVERY FIGURE A LIVE CARD HOLDS STAYS IN THAT CARD (instruction, 6 Oct 2026): the order inside
 * a card is ours, its contents are not. The hero may repeat a card's figure; it never takes
 * one away from the card. Hostels and Top Class
 * Education: the live page's own cards (`HostelCard`), intact, each with the yearly line the
 * Year on Year Report publishes for it. The hero's figures jump to these cards (`pd-card-<id>`).
 */
export function EducationResults({ sectionLevel, state, audiences }: MovementProps) {
  const show = (cardId: string) => shows(audiences, CARD_AUDIENCE[cardId] ?? "obc");
  const sc = card(SCHOLARSHIPS.cards, "sc");
  const obc = card(SCHOLARSHIPS.cards, "obc");
  const shreyas = card(SCHOLARSHIPS.cards, "shreyas");
  const hostels = card(HOSTELS.cards, "hostels");
  const topClass = card(HOSTELS.cards, "top-class");
  const ambedkar = card(HOSTELS.cards, "ambedkar");
  const [schools, colleges] = [nth(topClass.splits, 0), nth(topClass.splits, 1)];
  const scTrend = BENEFICIARY_TRENDS.views.find((v) => v.id === "sc")!;
  const obcTrend = BENEFICIARY_TRENDS.views.find((v) => v.id === "obc")!;
  const shreyasTrend = BENEFICIARY_TRENDS.views.find((v) => v.id === "shreyas")!;
  const studentsLine = (v: (typeof BENEFICIARY_TRENDS.views)[number], title: string, fact = true) => {
    const series: readonly { name: string; data: readonly number[] }[] = v.series;
    const pre = nth(series, 0);
    const post = nth(series, 1);
    return (
      <TrendLine
        title={title}
        labels={v.labels}
        data={sumSeries(pre.data, post.data)}
        unit="students"
        format={lakh}
        fact={fact}
        parts={[
          { name: pre.name, value: pre.data[pre.data.length - 1]! },
          { name: post.name, value: post.data[post.data.length - 1]! },
        ]}
      />
    );
  };
  // As the live page sets it: a badge, at the right of the heading, not a sentence under it.
  // On a State/UT view the page also says these are All-India figures, because the live page
  // publishes no other.
  const period = (
    <Badge status="neutral" size="sm">
      {SCHOLARSHIPS.period}
    </Badge>
  );

  /*
   * THE YEARS BEHIND A HOSTELS AND TOP CLASS FIGURE, from the live page's Year on Year Report:
   * its yearly seats and students add up to the card's own totals (28,865 seats; 45,228 and
   * 37,937 students), so the line is the card's figure, year by year. The Dr. Ambedkar card has
   * no published yearly series and so no line.
   */
  const yoy = (id: string) => YEAR_ON_YEAR.cards.find((c) => c.id === id);
  const yearsLine = (id: string, title: string, unit: string, width?: number) => {
    const c = yoy(id);
    return c ? <TrendLine title={title} labels={c.labels} data={[...c.count.data]} unit={unit} format={count} width={width} /> : null;
  };
  const hostelTrends: Record<string, { trend?: React.ReactNode; splitTrends?: React.ReactNode[] }> = {
    hostels: { trend: yearsLine("hostels", hostels.title, "seats sanctioned") },
    "top-class": {
      splitTrends: [
        yearsLine("tce-schools", `${topClass.title}: ${schools.chip}`, "students placed", 200),
        yearsLine("tce-colleges", `${topClass.title}: ${colleges.chip}`, "students placed", 200),
      ],
    },
  };

  // Which cards the Type of Applicant filter leaves; a section with none left is not drawn, and
  // the grid is laid out for the cards that remain (`pd-bento--n<count>`).
  const scholarshipCards = [sc, obc, shreyas].filter((c) => show(c.id));
  const placeCards = [hostels, topClass, ambedkar].filter((c) => show(c.id));

  return (
    <>
      {scholarshipCards.length ? (
      <section className="pd-section" aria-labelledby="pd-scholarships">
        <SectionTitle as={sectionLevel} headingId="pd-scholarships" size="display" eyebrow={SCHOLARSHIPS.pill} title={SCHOLARSHIPS.title}>
          <span className="pd-actions">
            {allIndiaBadge(state)}
            {period}
            {sectionMarks(SCHOLARSHIPS.title)}
          </span>
        </SectionTitle>
        <ul className={`pd-bento pd-bento--n${scholarshipCards.length}`} aria-label={SCHOLARSHIPS.title}>
          {[sc, obc].filter((x) => show(x.id)).map((x) => (
            <li key={x.id} id={`pd-card-${x.id}`}>
              <Tile tone={x.tone} icon={x.icon} title={x.title} subtitle={x.subtitle}>
                <Lead m={nth(x.metrics, 2)} />
                <Rest ms={[nth(x.metrics, 0), nth(x.metrics, 1)]} />
                {studentsLine(x.id === "sc" ? scTrend : obcTrend, x.title)}
              </Tile>
            </li>
          ))}
          {show("shreyas") ? (
          <li id="pd-card-shreyas">
            <Tile tone={shreyas.tone} icon={shreyas.icon} title={shreyas.title} subtitle={shreyas.subtitle}>
              <Lead m={nth(shreyas.metrics, 1)} />
              <Rest ms={[nth(shreyas.metrics, 0), nth(shreyas.metrics, 2)]} />
              {/* The fact line would restate "Latest Year (2025-26)" above it, so the line alone. */}
              <div className="pd-trend">
                <Sparkline data={[...nth(shreyasTrend.series, 0).data]} width={420} height={44} label={`${shreyas.title}: ${shreyasTrend.unit}, each year, ${shreyasTrend.labels[0]} to ${shreyasTrend.labels[shreyasTrend.labels.length - 1]}`} startLabel={shreyasTrend.labels[0]!.replace("*", "")} endLabel={shreyasTrend.labels[shreyasTrend.labels.length - 1]!.replace("*", "")} markLast />
              </div>
            </Tile>
          </li>
          ) : null}
        </ul>
      </section>
      ) : null}

      {placeCards.length ? (
        <section className="pd-section" aria-labelledby="pd-hostels">
          <SectionTitle as={sectionLevel} headingId="pd-hostels" size="display" title={HOSTELS.title}>
            <span className="pd-actions">
              {allIndiaBadge(state)}
              {sectionMarks(HOSTELS.title)}
            </span>
          </SectionTitle>
          <ul className={`pd-bento pd-bento--n${placeCards.length}`} aria-label={HOSTELS.title}>
            {placeCards.map((c) => (
              <li key={c.id} id={`pd-card-${c.id}`}>
                {/* `info`, not the live page's red, for the overseas loan card: on this estate red means a rejected application. */}
                <HostelCard c={c} tone={c.id === "ambedkar" ? "info" : undefined} {...hostelTrends[c.id]} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

/** The Department's series followed over the years: one Year by Year Trends section. */
export function EducationTrends({ sectionLevel, state, audiences }: MovementProps) {
  const cardLevel = (sectionLevel + 1) as 3 | 4;
  const showTrends = BENEFICIARY_TRENDS.views.some((v) => shows(audiences, TREND_AUDIENCE[v.id] ?? "obc"));
  const showShare = FUND_SHARE.slices.some((sl) => shows(audiences, FUND_SLICE_AUDIENCE[sl.label] ?? "obc"));
  const yoyCards = YEAR_ON_YEAR.cards.filter((c) => shows(audiences, YOY_AUDIENCE[c.id] ?? ["obc"]));
  if (!showTrends && !showShare && yoyCards.length === 0) return null;
  return (
    <>
      <section className="pd-section" aria-labelledby="pd-trends">
        <SectionTitle as={sectionLevel} headingId="pd-trends" size="display" title={BENEFICIARY_TRENDS.title}>
          <span className="pd-actions">
            {allIndiaBadge(state)}
            {sectionMarks(BENEFICIARY_TRENDS.title)}
          </span>
        </SectionTitle>
        {/* As the live page groups them: the students chart and Share of Fund Release side by
            side under Year by Year Trends (live structure kept, 6 Oct 2026). */}
        <ul className="kd-bd__grid kd-bd__grid--charts">
          {showTrends ? (
            <li>
              <BeneficiaryStudents headingLevel={cardLevel} audiences={audiences} />
            </li>
          ) : null}
          {showShare ? (
            <li>
              <ShareOfFundRelease headingLevel={cardLevel} audiences={audiences} />
            </li>
          ) : null}
        </ul>
        {/* THE YEAR ON YEAR REPORT IS THIS SECTION'S SECOND ROW (design review, 7 Oct 2026):
            "Year by Year Trends" then "Year on Year Report" were two headings for one idea. */}
        {yoyCards.length > 0 ? (
          <ul className={`pd-bento pd-bento--n${yoyCards.length}`} aria-label={YEAR_ON_YEAR.title}>
            {yoyCards.map((c) => (
              <li key={c.id}>
                <YearOnYearCard c={c} headingLevel={cardLevel} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>

    </>
  );
}


/* ── The Department's card on the dashboard's landing page ─────────────────── */

/**
 * THE DEPARTMENT'S CARD (design review, 7 Oct 2026). The landing page holds one card per
 * Department and portal; the Beneficiary Dashboard's sections open behind this one, on the
 * Department's own page (`?programme=department`). Its figures are the ones the hero does NOT
 * already lead with — the hero carries the fund total and the three scholarship totals — so
 * the card adds the year's scholarship students, as a line, and the hostels and top class
 * places. Every figure is the live page's, from the shared record.
 */
export function DepartmentTileContent({ audiences, wide = false }: {
  audiences: Set<Audience>;
  /** Drawn across the row (the landing page's lead card): three columns, not one. */
  wide?: boolean;
}): { figure: React.ReactNode; body: React.ReactNode } | null {
  const show = (cardId: string) => shows(audiences, CARD_AUDIENCE[cardId] ?? "obc");
  const views = (["sc", "obc"] as const).filter(show).flatMap((id) => {
    const v = BENEFICIARY_TRENDS.views.find((x) => x.id === id);
    return v ? [v] : [];
  });
  const hostels = card(HOSTELS.cards, "hostels");
  const topClass = card(HOSTELS.cards, "top-class");
  const ambedkar = card(HOSTELS.cards, "ambedkar");
  const [schools, colleges] = [nth(topClass.splits, 0), nth(topClass.splits, 1)];
  const facts = [
    ...(show("hostels") ? [{ term: `${nth(hostels.metrics, 0).label} · OBC Hostels`, value: deptAmount(nth(hostels.metrics, 0)) }] : []),
    ...(show("top-class")
      ? [
          { term: `Top Class Education · ${schools.chip}`, value: schools.value },
          { term: `Top Class Education · ${colleges.chip}`, value: colleges.value },
        ]
      : []),
    ...(show("ambedkar") ? [{ term: `${nth(ambedkar.metrics, 0).label} · Overseas Education Loan`, value: deptAmount(nth(ambedkar.metrics, 0)) }] : []),
  ];
  if (views.length === 0 && facts.length === 0) return null;

  const trend = (v: (typeof views)[number], width?: number) => {
    const sc = card(SCHOLARSHIPS.cards, v.id);
    const series: readonly { name: string; data: readonly number[] }[] = v.series;
    return (
      <TrendLine
        key={v.id}
        title={sc.title}
        labels={v.labels}
        data={sumSeries(nth(series, 0).data, nth(series, 1).data)}
        unit={v.id === "sc" ? "SC students" : "OBC, EBC and DNT students"}
        format={lakh}
        width={width}
        parts={[
          { name: nth(series, 0).name, value: nth(series, 0).data[nth(series, 0).data.length - 1]! },
          { name: nth(series, 1).name, value: nth(series, 1).data[nth(series, 1).data.length - 1]! },
        ]}
      />
    );
  };
  const factList = facts.length ? <DescriptionList size="figure" caps columns={2} items={facts} /> : null;

  if (!wide) {
    const first = views[0];
    return { figure: null, body: <>{first ? trend(first) : null}{factList}</> };
  }

  /*
   * THE LEAD CARD, RICH BUT QUIET (instruction, 7 Oct 2026). Three columns under the live
   * page's own section titles, each answering one question, and none repeating the hero
   * above it: how many students the scholarships reach this year (SC, and OBC, EBC and DNT,
   * each with its twelve-year line), where the fund has gone (the three largest of the nine
   * schemes and the rest together, as shares), and the hostel and top class education
   * figures. No dividers, no sentences beyond the figures' own: the columns' space does the
   * separating.
   */
  const slices = FUND_SHARE.slices.filter((sl) => shows(audiences, FUND_SLICE_AUDIENCE[sl.label] ?? "obc"));
  // Shares of the nine together, as the live chart's tooltip and the Department page give them.
  const whole = FUND_SHARE.slices.reduce((t, sl) => t + sl.value, 0);
  const top = [...slices].sort((a, b) => b.value - a.value);
  const lead3 = top.slice(0, 3);
  const rest = top.slice(3);
  const share = (n: number) => Math.round((n / whole) * 1000) / 10;
  const shareItems = [
    ...lead3.map((sl) => ({ label: sl.label, value: share(sl.value) })),
    ...(rest.length ? [{ label: `Other ${rest.length === 1 ? "Scheme" : `${rest.length} Schemes`}`, value: share(rest.reduce((t, sl) => t + sl.value, 0)) }] : []),
  ];
  const head = (text: string) => <h4 className="pd-dept__head">{text}</h4>;
  const year = (v: (typeof views)[number]) => v.labels[v.labels.length - 1]!.replace("*", "");
  return {
    figure: null,
    body: (
      <div className="pd-dept">
        {views.length ? (
          <div className="pd-dept__col">
            <div>
              {head(BENEFICIARY_TRENDS.cardTitle)}
              <p className="pd-dept__sub">Students Beneficiary, {year(views[0]!)} (provisional)</p>
            </div>
            <DescriptionList
              size="figure"
              caps
              columns={2}
              items={views.map((v) => {
                const series: readonly { name: string; data: readonly number[] }[] = v.series;
                const data = sumSeries(nth(series, 0).data, nth(series, 1).data);
                const parts = series.slice(0, 2).map((x) => ({ name: x.name, value: x.data[x.data.length - 1]! }));
                const title = card(SCHOLARSHIPS.cards, v.id).title;
                return {
                  term: v.label === "SC" ? "SC" : "OBC, EBC and DNT",
                  value: (
                    <>
                      {lakh(data[data.length - 1]!)}
                      <FigureSource note={studentsNote(title, v.labels, data, parts, lakh)} />
                      <Sparkline data={data} width={200} height={36} label={`${title}: students, each year, ${v.labels[0]!.replace("*", "")} to ${year(v)}`} startLabel={v.labels[0]!.replace("*", "")} endLabel={year(v)} markLast />
                    </>
                  ),
                };
              })}
            />
          </div>
        ) : null}
        {slices.length > 1 ? (
          <div className="pd-dept__col">
            {head(FUND_SHARE.title)}
            <RankedBarList
              title={`${FUND_SHARE.title}: ${FUND_SHARE.subtitle}`}
              items={shareItems}
              valueFormat={(n: number) => `${n.toFixed(1)}%`}
              sort="none"
              showRank={false}
              size="sm"
              max={100}
            />
          </div>
        ) : null}
        {factList ? (
          <div className="pd-dept__col">
            {head(HOSTELS.title)}
            {factList}
          </div>
        ) : null}
      </div>
    ),
  };
}
