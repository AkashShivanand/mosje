"use client";

import * as React from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardIcon,
  CardSubtitle,
  CardTitle,
  ChartCard,
  ComboChart,
  DescriptionList,
  HeadlineFigure,
  LineChart,
  SectionTitle,
  SegmentedControl,
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
import { FundShareDonut, HostelCard, deptAmount } from "../DepartmentCards";
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
 * LineChart ✅ · ComboChart ✅ · RankedBarList ✅ ·
 * SegmentedControl ✅ · SectionTitle ✅ · OriginChip / FigureSource (app) ✅.
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
          <FigureSource
            note={{
              ...receivedNote(`${title}, ${year}`),
              value: format(data[data.length - 1]!),
              breakdown: {
                method: `Pre-Matric and Post-Matric students added together, from the Year by Year Trends series. The line draws the same sum for each year from ${labels[0]!.replace("*", "")}.`,
                rows: parts.map((x, i) => ({ label: x.name, value: format(x.value), op: i === 0 ? undefined : ("+" as const) })),
                result: { label: `Students, ${year}`, value: format(data[data.length - 1]!) },
              },
            }}
          />
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
      exportable
      exportAppearance="text"
      title={BENEFICIARY_TRENDS.cardTitle}
      // With one view left there is no switch to name it, so the card names it.
      subtitle={views.length === 1 ? view.label : undefined}
      actions={
        views.length > 1 ? (
          <SegmentedControl ariaLabel="Students shown" value={id} onChange={setId} options={views.map((v) => ({ value: v.id, label: v.label }))} />
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
      exportable
      exportAppearance="text"
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
      {/* The live page's ring, with each scheme's amount beside it (live structure kept). */}
      <FundShareDonut slices={slices} tableView="sr-only" />
    </ChartCard>
  );
}

/* ── Year on Year Report ───────────────────────────────────────────────────── */

/**
 * One Year on Year card, as the live page draws it: the scheme's count as bars and its fund
 * release as a line, on two axes (instruction, 6 Oct 2026: both in one chart). Three things
 * are ours, to keep two scales readable:
 *  - straight segments — one figure a year, so a curve would draw values nobody reported;
 *  - each measure keeps ONE colour wherever it appears on the page: counts in the first slot,
 *    fund release in the third, so the line is never the green of "Post-Matric" next door;
 *  - the subtitle states both latest-year figures — the answer the chart supports — so the
 *    reader need not read either off its axis.
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
    <ChartCard variant="outlined" headingLevel={headingLevel} exportable exportAppearance="text" title={c.title} subtitle={takeaway}>
      <FitChart fallback={400}>
        {(width) => (
          <ComboChart
            title={`${c.title}: ${c.count.name} and ${c.fund.name}, by year`}
            labels={[...c.labels]}
            bars={[{ name: c.count.name, data: [...c.count.data], color: COUNT_COLOUR }]}
            lines={[{ name: c.fund.name, data: [...c.fund.data], color: FUND_COLOUR }]}
            leftLabel={c.count.axis}
            rightLabel="Fund (₹ Cr)"
            valueFormat={count}
            tableView="sr-only"
            tickCount={6}
            width={width}
            height={300}
          />
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

interface ResultsProps extends MovementProps {
  /** The cards whose cumulative figure the hero is showing (`cardsInHero`) — they lead with the latest year instead. */
  inHero?: Set<string>;
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
 * under it, and the trend line the live page publishes the years for. Hostels and Top Class
 * Education: the live page's own cards (`HostelCard`), intact, each with the yearly line the
 * Year on Year Report publishes for it. The hero's figures jump to these cards (`pd-card-<id>`).
 */
export function EducationResults({ sectionLevel, state, audiences, inHero = new Set() }: ResultsProps) {
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
  /*
   * THE LATEST YEAR AS A CARD'S LEAD, where the hero is showing the card's cumulative figure
   * (`cardsInHero`): the live label ("Students Beneficiary"), the latest year under it, and the
   * Pre- plus Post-Matric sum it is worked out from behind the info control. The same figure the
   * trend line's sentence used to state, so nothing new is derived.
   */
  const latestLead = (v: (typeof BENEFICIARY_TRENDS.views)[number], m: DeptMetric, title: string) => {
    const series: readonly { name: string; data: readonly number[] }[] = v.series;
    const pre = nth(series, 0);
    const post = nth(series, 1);
    const total = sumSeries(pre.data, post.data);
    const last = v.labels[v.labels.length - 1]!;
    const year = last.replace("*", "");
    const value = lakh(total[total.length - 1]!);
    return (
      <HeadlineFigure
        size="md"
        value={value}
        label={m.label}
        context={`${year}${last.endsWith("*") ? " (provisional)" : ""}`}
        mark={
          <FigureSource
            note={{
              ...receivedNote(`${title}, ${year}`),
              value,
              breakdown: {
                method: "Pre-Matric and Post-Matric students added together, from the Year by Year Trends series.",
                rows: [
                  { label: pre.name, value: lakh(pre.data[pre.data.length - 1]!) },
                  { label: post.name, value: lakh(post.data[post.data.length - 1]!), op: "+" as const },
                ],
                result: { label: `Students, ${year}`, value },
              },
            }}
          />
        }
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
                {inHero.has(x.id) ? latestLead(x.id === "sc" ? scTrend : obcTrend, nth(x.metrics, 2), x.title) : <Lead m={nth(x.metrics, 2)} />}
                <Rest ms={[nth(x.metrics, 0), nth(x.metrics, 1)]} />
                {studentsLine(x.id === "sc" ? scTrend : obcTrend, x.title, !inHero.has(x.id))}
              </Tile>
            </li>
          ))}
          {show("shreyas") ? (
          <li id="pd-card-shreyas">
            <Tile tone={shreyas.tone} icon={shreyas.icon} title={shreyas.title} subtitle={shreyas.subtitle}>
              {/* Scholars Funded (cumulative) leads unless the hero is showing it; then the
                  live card's own Latest Year (2025-26) leads instead. */}
              {inHero.has("shreyas") ? (
                <>
                  <Lead m={nth(shreyas.metrics, 2)} />
                  <Rest ms={[nth(shreyas.metrics, 0)]} />
                </>
              ) : (
                <>
                  <Lead m={nth(shreyas.metrics, 1)} />
                  <Rest ms={[nth(shreyas.metrics, 0), nth(shreyas.metrics, 2)]} />
                </>
              )}
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

/** The Department's series followed over the years: Year by Year Trends, then Year on Year Report. */
export function EducationTrends({ sectionLevel, state, audiences }: MovementProps) {
  const cardLevel = (sectionLevel + 1) as 3 | 4;
  const showTrends = BENEFICIARY_TRENDS.views.some((v) => shows(audiences, TREND_AUDIENCE[v.id] ?? "obc"));
  const showShare = FUND_SHARE.slices.some((sl) => shows(audiences, FUND_SLICE_AUDIENCE[sl.label] ?? "obc"));
  const yoyCards = YEAR_ON_YEAR.cards.filter((c) => shows(audiences, YOY_AUDIENCE[c.id] ?? ["obc"]));
  if (!showTrends && !showShare && yoyCards.length === 0) return null;
  return (
    <>
      {showTrends || showShare ? (
      <section className="pd-section" aria-labelledby="pd-trends">
        <SectionTitle as={sectionLevel} headingId="pd-trends" size="display" title={BENEFICIARY_TRENDS.title}>
          <span className="pd-actions">
            {allIndiaBadge(state)}
            {sectionMarks(BENEFICIARY_TRENDS.title)}
          </span>
        </SectionTitle>
        {/* As the live page groups them: the students chart and the Share of Fund Release ring
            side by side under Year by Year Trends (live structure kept, 6 Oct 2026). */}
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
      </section>
      ) : null}

      {yoyCards.length > 0 ? (
      <section className="pd-section" aria-labelledby="pd-yoy">
        <SectionTitle as={sectionLevel} headingId="pd-yoy" size="display" title={YEAR_ON_YEAR.title}>
          <span className="pd-actions">
            {allIndiaBadge(state)}
            {sectionMarks(YEAR_ON_YEAR.title)}
          </span>
        </SectionTitle>
        <ul className={`pd-bento pd-bento--n${yoyCards.length}`} aria-label={YEAR_ON_YEAR.title}>
          {yoyCards.map((c) => (
            <li key={c.id}>
              <YearOnYearCard c={c} headingLevel={cardLevel} />
            </li>
          ))}
        </ul>
      </section>
      ) : null}
    </>
  );
}
