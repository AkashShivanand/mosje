"use client";

import * as React from "react";
import {
  Badge,
  ChartCard,
  ComboChart,
  LineChart,
  SectionTitle,
  SegmentedControl,
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
} from "@/lib/website-shared/dashboard";
import { FitChart } from "../DepartmentOverview";
import { FundShareDonut, HostelCard, ScholarshipCard } from "../DepartmentCards";
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
      <FundShareDonut slices={slices} />
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
    <ChartCard variant="outlined" headingLevel={headingLevel} exportable title={c.title} subtitle={takeaway}>
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
 * The Department's results: Scholarships and Fellowship, then Hostels and Top Class
 * Education — THE LIVE PAGE'S CARDS, INTACT (instruction, 6 Oct 2026). Each card is the shared
 * `ScholarshipCard` / `HostelCard` the current dashboard draws, with the live page's figures,
 * labels and order; nothing re-arranged and nothing added inside a card. The hero's figures
 * jump to these cards by id (`pd-card-<id>`).
 */
export function EducationResults({ sectionLevel, state, audiences }: MovementProps) {
  const show = (cardId: string) => shows(audiences, CARD_AUDIENCE[cardId] ?? "obc");
  const scholarshipCards = SCHOLARSHIPS.cards.filter((c) => show(c.id));
  const placeCards = HOSTELS.cards.filter((c) => show(c.id));
  // As the live page sets it: a badge, at the right of the heading, not a sentence under it.
  const period = (
    <Badge status="neutral" size="sm">
      {SCHOLARSHIPS.period}
    </Badge>
  );

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
            {scholarshipCards.map((c) => (
              <li key={c.id} id={`pd-card-${c.id}`}>
                <ScholarshipCard c={c} />
              </li>
            ))}
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
                <HostelCard c={c} tone={c.id === "ambedkar" ? "info" : undefined} />
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
