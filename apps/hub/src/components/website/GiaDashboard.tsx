"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Button,
  ChartCard,
  DashboardGrid,
  DonutChart,
  LineChart,
  Select,
  categoricalColor,
  formatIndian,
  sequentialColor,
  useOnlineStatus,
  useScrollReveal,
  useStickyRange,
} from "@mosje/design-system";
import {
  GIA_GENDER_DESCRIPTOR,
  GIA_PHYSICAL_DESCRIPTOR,
  GIA_YEAR_DESCRIPTOR,
  INTERVENTION_KEY,
  scaleRows,
  type GenderReading,
  type GiaData,
  type GiaKey,
} from "@/lib/website/pmajay-api";
import type { DataMode } from "@/lib/data-mode/types";
import { PMAJAY_AS_ON } from "@/lib/website/pmajay-stats";
import { cardStateFor, useDataMode } from "@/lib/data-mode/context";
import type { CardStateKind } from "@mosje/design-system";
import { mergeData, provenanceOf } from "@/lib/data-mode/merge";
import { ProvenanceChip, type CardProvenance } from "./ProvenanceChip";
import "./scheme-dashboard.css";

const ALL = "ALL";
/** Where the sticky header rests: 1px under the site masthead's scrolled edge. */
const HEAD_TOP = 64;

const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);
/** "2023-2024" reads as a range in a legend and as noise on an axis. */
const shortYear = (y: string) => `${y.slice(2, 4)}–${y.slice(7, 9)}`;

/**
 * Grants-in-Aid to States and Districts, in numbers.
 *
 * The same shape as the Adarsh Gram dashboard, because they are two components
 * of one scheme and a citizen moving between them should not have to relearn the
 * page: sticky header carrying the filter, one outcome stated large with the
 * ratios that qualify it, then cards.
 *
 * WHAT IS NOT HERE, AND WHY IT IS NOT HERE. There is no gender card. The
 * gender-distribution feed answers with a complete structure in which every
 * figure is zero — overall, and for each of the four interventions — and the
 * domain report's own `gender_overall` agrees. A donut of zeros does not say
 * "not yet reported", it says no woman has been reached by any intervention in
 * any year, which is a false claim rather than a missing one. The card goes in
 * the day the feed carries figures.
 */
/**
 * A ranked list of bars, for a category axis of long real names.
 *
 * NOT a horizontal `BarChart`, and that is a measured decision rather than a
 * stylistic one. The design system's bar chart draws its category axis in a
 * fixed label column and truncates at 16 characters, which is right for
 * "Odisha" and wrong for "Industry, Service and Business — Retail shops,
 * Grocerys and Showrooms". Four different domains rendered as four identical
 * rows reading "Animal Husbandr…", and a chart whose categories cannot be told
 * apart is not a chart.
 *
 * One hue, not a categorical ramp: every row measures the same thing — approved
 * projects — so giving each its own colour would claim they are different kinds
 * of quantity. Bar length is the whole signal.
 */
function RankedBars({
  rows,
  unit,
}: {
  rows: { name: string; value: number }[];
  unit: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="sd-dash__conv">
      {rows.map((r) => (
        <li key={r.name} className="sd-dash__conv-row">
          <div className="sd-dash__conv-head">
            <span className="sd-dash__conv-label">{r.name}</span>
            <span className="sd-dash__conv-figure">
              <b>{formatIndian(r.value)}</b>
            </span>
          </div>
          <div
            className="sd-dash__conv-track"
            role="img"
            aria-label={`${r.name}: ${formatIndian(r.value)} ${unit}`}
          >
            <span
              className="sd-dash__conv-fill"
              style={{ width: `${Math.round((r.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** One financial year, merged. Pulled out of the component so the memo around it
 *  has a body the React Compiler can reason about. */
function mergeYear(y: GiaData["years"][number], mode: DataMode) {
  const find = (type: number) => y.mock.interventions.find((i) => i.type === type)?.total ?? 0;
  return {
    finYear: y.finYear,
    approvals: mergeData(
      GIA_YEAR_DESCRIPTOR,
      y.approvals,
      {
        total: y.mock.totalApproved,
        ig: find(1),
        skilling: find(2),
        infra: find(3),
        tutoring: find(6),
      },
      mode,
    ),
    physical: mergeData(
      GIA_PHYSICAL_DESCRIPTOR,
      y.physical,
      { totalProjects: y.mock.physical.totalProjects, inProgress: y.mock.physical.inProgress },
      mode,
    ),
    raw: y,
  };
}

/**
 * An illustrative gender split, scaled to the approvals total on screen.
 *
 * 34% women is a little above the scheme's own floor — PM-AJAY directs at least
 * 15% of released funds to income-generating schemes for Scheduled Caste women
 * and at least 10% to skill development, both stated in the department's
 * description of this component on the page above. It is what a scheme meeting
 * its mandate would look like, and it is never shown without an Illustrative
 * mark.
 */
/** A card is judged as one thing, so the weakest claim among its figures wins. */
function worstOf(kinds: CardProvenance[]): CardProvenance {
  if (kinds.length === 0) return "live";
  if (kinds.every((k) => k === "live")) return "live";
  if (kinds.every((k) => k === "mock")) return "mock";
  return "mixed";
}

function illustrativeGender(total: number) {
  const female = Math.round(total * 0.34);
  const other = Math.round(total * 0.004);
  return { total, female, other, male: total - female - other };
}

type MergedYear = ReturnType<typeof mergeYear>;

/**
 * Breakdown rows for one intervention across the scope.
 *
 * Where the feed published rows, they are used. Where it published none but the
 * intervention carries a total, the snapshot's rows are SCALED to that total —
 * the shape a reader is looking at survives and the rows still add up to the
 * number above them.
 *
 * A module-level function, not a `useCallback`: it loops and accumulates, which
 * the React Compiler declines to memoize, and there is nothing to memoize
 * anyway — its inputs change exactly when the component re-renders.
 */
function breakdownFor(
  scoped: MergedYear[],
  mode: DataMode,
  type: number,
  limit: number,
): { rows: { name: string; value: number }[]; prov: CardProvenance } {
  const key = INTERVENTION_KEY[type]!;
  const acc = new Map<string, number>();
  let liveYears = 0;
  let mockYears = 0;

  for (const y of scoped) {
    const liveRows = mode === "mock" ? [] : (y.raw.breakdowns[type] ?? []);
    const mockRows = y.raw.mock.interventions.find((i) => i.type === type)?.breakdowns ?? [];

    let rows: { name: string; value: number }[];
    if (liveRows.length > 0) {
      rows = liveRows;
      liveYears += 1;
    } else if (mode === "live" || mockRows.length === 0) {
      rows = [];
    } else {
      rows = scaleRows(mockRows, y.approvals.values[key]);
      mockYears += 1;
    }
    for (const r of rows) acc.set(r.name, (acc.get(r.name) ?? 0) + r.value);
  }

  const rows = [...acc]
    .map(([name, value]) => ({ name, value }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
  return {
    rows,
    prov: liveYears > 0 && mockYears > 0 ? "mixed" : liveYears > 0 ? "live" : "mock",
  };
}

export interface GiaDashboardProps {
  data: GiaData;
  gender: GenderReading;
}

export function GiaDashboard({ data, gender }: GiaDashboardProps) {
  const [year, setYear] = React.useState(ALL);
  const demo = useDataMode();
  const { mode, marks } = demo;
  const router = useRouter();
  const online = useOnlineStatus();
  /** Which card is mid-retry. Per card, never page-wide — see `cardProps`. */
  const [retrying, setRetrying] = React.useState<number | null>(null);

  /**
   * Everything a card needs to know about its own state.
   *
   * THE RETRY IS PER CARD IN WHAT IT SHOWS, AND PAGE-LEVEL IN WHAT IT FETCHES,
   * and the split is forced by the data rather than chosen. These figures come
   * from one server render for the whole page — there is no per-card endpoint
   * to re-hit — but `router.refresh()` swaps the server content without
   * unmounting anything, so only the card that was retried needs to show it.
   * Blanking six healthy cards to reload one would contradict the very sentence
   * the error state prints: everything else on the page is unaffected.
   *
   * The retried card passes through LOADING on the way back rather than
   * snapping to content. The skeleton is the acknowledgement that the click did
   * something; without it a failed retry looks identical to no retry at all.
   */
  const cardProps = React.useCallback(
    (index: number, override?: CardStateKind) => {
      const forced = cardStateFor(demo, index);
      const state = forced.state ?? override;
      return {
        loading: forced.loading || retrying === index,
        // A lost connection and a failed request end in the same `catch` and
        // want opposite words. Where the browser knows, it corrects the copy.
        state: !online && state === "error" ? ("offline" as const) : state,
        onRetry: () => {
          setRetrying(index);
          if (demo.preview !== "normal") demo.setPreview("normal");
          else router.refresh();
          window.setTimeout(() => setRetrying(null), 520);
        },
      };
    },
    [demo, retrying, router, online],
  );

  const root = React.useRef<HTMLElement>(null);
  useScrollReveal(root);

  /**
   * The toolbar pins between two markers, not for the whole section.
   *
   * `position: sticky` releases at the CONTAINER's bottom, which is well past
   * the point where anything is left to filter — the bar ended up hovering over
   * the last card's footer and then over the band below it. The end marker sits
   * after the final card instead, so the toolbar retires when the content it
   * governs does. On a section too short to scroll it never pins at all.
   */
  const sentinel = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const endSentinel = React.useRef<HTMLDivElement>(null);
  const stick = useStickyRange(sentinel, gridRef, endSentinel, { offset: HEAD_TOP, height: 60 });

  // ── Everything below is derived from ONE merge per year ────────────────────
  //
  // A year is the unit because that is the level this feed splits on: its four
  // interventions and its total are a declared sum group, so a missing part is
  // derived from the total rather than taken from the snapshot at a size that
  // would not add up. `2021-2022` — a structurally complete year in which every
  // figure is 0 — is recognised as unpopulated by the same rule that recognises
  // Special Tutoring's 0 as a real reading, because one has a non-zero sibling
  // and the other does not.
  const merged = React.useMemo(
    () => data.years.map((y) => mergeYear(y, mode)),
    [data.years, mode],
  );

  const years = merged;
  const scoped = year === ALL ? years : years.filter((y) => y.finYear === year);
  const scopeLabel = year === ALL ? "all years" : year;

  const totalApproved = scoped.reduce((t, y) => t + y.approvals.values.total, 0);

  // The four interventions, summed across the scope, in the source's own order.
  const INTERVENTIONS: { type: number; key: GiaKey; label: string }[] = [
    { type: 1, key: "ig", label: "Income Generation" },
    { type: 2, key: "skilling", label: "Skilling" },
    { type: 3, key: "infra", label: "Infrastructure" },
    { type: 6, key: "tutoring", label: "Special Tutoring" },
  ];
  const interventions = INTERVENTIONS.map((iv) => ({
    ...iv,
    total: scoped.reduce((t, y) => t + y.approvals.values[iv.key], 0),
  }));

  const income = breakdownFor(scoped, mode, 1, 8);
  const skill = breakdownFor(scoped, mode, 2, 6);
  const infra = breakdownFor(scoped, mode, 3, 6);

  const allPhysical = mergeData(
    GIA_PHYSICAL_DESCRIPTOR,
    data.allPhysical,
    data.mockAllPhysical,
    mode,
  );
  const scopedPhysical = scoped.reduce(
    (t, y) => ({
      totalProjects: t.totalProjects + y.physical.values.totalProjects,
      inProgress: t.inProgress + y.physical.values.inProgress,
    }),
    { totalProjects: 0, inProgress: 0 },
  );
  // `fin_year=all` is the source's own all-years total and is NOT the sum of the
  // per-year rows — the years the feed serves do not cover everything it counts.
  const projectsTotal =
    year === ALL ? allPhysical.values.totalProjects : scopedPhysical.totalProjects;
  const projectsInProgress =
    year === ALL ? allPhysical.values.inProgress : scopedPhysical.inProgress;

  // Gender. Illustrative by necessity — see GIA_GENDER_DESCRIPTOR. The
  // illustrative split is scaled to whatever total is on screen so it never
  // contradicts the approvals beside it.
  const genderMerged = mergeData(
    GIA_GENDER_DESCRIPTOR,
    gender.reading,
    illustrativeGender(totalApproved),
    mode,
  );
  const genderProv = provenanceOf(genderMerged, ["male", "female", "other"]);
  const showGender = mode !== "live" || genderProv !== "mock";

  const APPROVAL_KEYS: GiaKey[] = ["total", "ig", "skilling", "infra", "tutoring"];
  const approvalsProv = worstOf(scoped.map((y) => provenanceOf(y.approvals, APPROVAL_KEYS)));
  const allYearsProv = worstOf(merged.map((y) => provenanceOf(y.approvals, APPROVAL_KEYS)));
  const physicalProv = provenanceOf(
    year === ALL ? allPhysical : scoped[0]!.physical,
    ["totalProjects", "inProgress"],
  );
  const allIllustrative = merged.every((y) => y.approvals.allMock);

  const busiest = [...years].sort(
    (a, b) => b.approvals.values.total - a.approvals.values.total,
  )[0];
  const topIntervention = [...interventions].sort((a, b) => b.total - a.total)[0];
  const emptyInterventions = interventions.filter((i) => i.total === 0);

  return (
    <section
      id="gia-progress"
      className="sd-dash"
      aria-labelledby="gia-dash-title"
      ref={root}
    >
      <div ref={sentinel} aria-hidden className="sd-dash__sentinel" />

      <header className="sd-dash__head" data-stick={stick}>
        <h2 id="gia-dash-title" className="sd-dash__title">
          Grants-in-Aid, in numbers
        </h2>

        <div className="sd-dash__filters">
          <label htmlFor="gia-year" className="sr-only">
            Filter by financial year
          </label>
          <Select
            id="gia-year"
            appearance="filter"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value={ALL}>All Years</option>
            {/* Newest first — a reader reaching for a year wants the latest. */}
            {[...years].reverse().map((y) => (
              <option key={y.finYear} value={y.finYear}>
                {y.finYear}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="primary"
            appearance="outlined"
            size="sm"
            className="sd-dash__reset"
            onClick={() => setYear(ALL)}
            disabled={year === ALL}
          >
            Reset filters
          </Button>
        </div>
      </header>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {scopeLabel}.
      </p>

      {marks && allIllustrative && (
        <p className="dm-banner">
          <b>Illustrative figures.</b>&nbsp;The live report feed is not
          answering, so these are the last published totals, mirrored on{" "}
          {PMAJAY_AS_ON}. Nothing here is a current departmental figure.
        </p>
      )}

      <div className="sd-dash__hero" data-sa-reveal>
        <div>
          <p className="sd-dash__hero-label">
            Projects approved for grant
            <ProvenanceChip kind={approvalsProv} />
          </p>
          <strong className="sd-dash__hero-value">{formatIndian(totalApproved)}</strong>
          <p className="sd-dash__hero-of">
            Across {interventions.length} intervention types in{" "}
            {year === ALL ? `${years.length} financial years` : year}.{" "}
            {topIntervention && totalApproved > 0 ? (
              <>
                <strong>{topIntervention.label}</strong> is the largest at{" "}
                {pct(topIntervention.total, totalApproved)}%.
              </>
            ) : null}
          </p>
          <div
            className="sd-dash__hero-track"
            role="img"
            aria-label={`${topIntervention?.label ?? "Largest intervention"} is ${pct(topIntervention?.total ?? 0, totalApproved)} percent of approved projects`}
          >
            <span
              className="sd-dash__hero-fill"
              style={{ width: `${pct(topIntervention?.total ?? 0, totalApproved)}%` }}
            />
          </div>
        </div>

        <div className="sd-dash__ratios" aria-label="Approved projects by intervention">
          {interventions.map((i) => {
            const share = pct(i.total, totalApproved);
            return (
              <div key={i.type} className="sd-dash__ratio">
                <div className="sd-dash__ratio-head">
                  <span className="sd-dash__ratio-label">{i.label}</span>
                  <span className="sd-dash__ratio-value">{share}%</span>
                </div>
                <div
                  className="sd-dash__ratio-track"
                  role="img"
                  aria-label={`${i.label}: ${formatIndian(i.total)} of ${formatIndian(totalApproved)} approved projects, ${share} percent`}
                >
                  <span className="sd-dash__ratio-fill" style={{ width: `${share}%` }} />
                </div>
                <p className="sd-dash__ratio-note">
                  {formatIndian(i.total)} approved
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <DashboardGrid ref={gridRef}>
        <ChartCard

          {...cardProps(0)}
          skeleton="bars"          data-sa-reveal
          exportable
          span={7}
          actions={<ProvenanceChip kind={allYearsProv} />}
          title="Approvals by financial year"
          subtitle="Projects approved for grant in each year, split by intervention. All years, whatever the filter"
          footer={
            <p className="sd-dash__caption">
              <strong>{busiest?.finYear}</strong> is the largest year at{" "}
              {formatIndian(busiest?.approvals.values.total ?? 0)} approvals — more than
              the other {years.length - 1} years put together. This card always
              shows every year, because it is the one that answers the question
              the Year control asks.
            </p>
          }
        >
          <BarChart
            title="Approved projects by financial year and intervention"
            variant="stacked"
            labels={years.map((y) => shortYear(y.finYear))}
            series={interventions.map((iv, n) => ({
              name: iv.label,
              data: years.map((y) => y.approvals.values[iv.key]),
              color: categoricalColor(n),
            }))}
            height={320}
          />
        </ChartCard>

        <ChartCard

          {...cardProps(1)}
          skeleton="donut"          data-sa-reveal
          exportable
          span={5}
          actions={<ProvenanceChip kind={approvalsProv} />}
          title="Which instrument carries the load"
          subtitle={`Share of approved projects by intervention, ${scopeLabel}`}
          footer={
            <p className="sd-dash__caption">
              {emptyInterventions.length > 0 ? (
                <>
                  <strong>
                    {emptyInterventions.map((i) => i.label).join(" and ")}
                  </strong>{" "}
                  {emptyInterventions.length === 1 ? "has" : "have"} no approvals in
                  this period, so {emptyInterventions.length === 1 ? "it is" : "they are"}{" "}
                  absent from the ring rather than drawn at zero.
                </>
              ) : (
                "Every intervention carries approvals in this period."
              )}
            </p>
          }
        >
          <DonutChart
            key={year}
            title={`Approved projects by intervention, ${scopeLabel}`}
            data={interventions
              .filter((i) => i.total > 0)
              .map((i, n) => ({
                label: i.label,
                value: i.total,
                color: categoricalColor(n),
              }))}
            center={formatIndian(totalApproved)}
            centerSub="approved"
          />
        </ChartCard>

        <ChartCard

          /* A real state, not a forced one: pick 2026-2027 and this
             intervention has no approved projects at all. Saying "nothing to
             show yet" would imply the scheme has none; the filter does. */
          {...cardProps(2, income.rows.length === 0 ? "no-results" : undefined)}
          skeleton="rows"          data-sa-reveal
          span={7}
          actions={<ProvenanceChip kind={income.prov} />}
          emptyLabel={`No income-generation projects were approved in ${scopeLabel}. Clear the year filter to see every year.`}
          title="What income-generation grants actually fund"
          subtitle={`The eight largest domains by approved projects, ${scopeLabel}`}
          footer={
            <p className="sd-dash__caption">
              Livestock, retail and food processing dominate — the domains a
              household can start on its own land or in its own premises. Names
              are the source&rsquo;s own, shown as{" "}
              <em>domain — sub-domain</em>.
            </p>
          }
        >
          <RankedBars rows={income.rows} unit="approved projects" />
        </ChartCard>

        <ChartCard

          /* A real state, not a forced one: pick 2026-2027 and this
             intervention has no approved projects at all. Saying "nothing to
             show yet" would imply the scheme has none; the filter does. */
          {...cardProps(3, skill.rows.length === 0 ? "no-results" : undefined)}
          skeleton="rows"          data-sa-reveal
          span={5}
          actions={<ProvenanceChip kind={skill.prov} />}
          emptyLabel={`No skilling projects were approved in ${scopeLabel}. Clear the year filter to see every year.`}
          title="How skilling money is spent"
          subtitle={`Approved skilling projects by type of training, ${scopeLabel}`}
          footer={
            <p className="sd-dash__caption">
              Short-term training is the overwhelming majority. Long-term
              training and up-skilling — the two that change a wage rather than
              start one — remain a small share.
            </p>
          }
        >
          <RankedBars rows={skill.rows} unit="approved projects" />
        </ChartCard>

        <ChartCard

          /* A real state, not a forced one: pick 2026-2027 and this
             intervention has no approved projects at all. Saying "nothing to
             show yet" would imply the scheme has none; the filter does. */
          {...cardProps(4, infra.rows.length === 0 ? "no-results" : undefined)}
          skeleton="rows"          data-sa-reveal
          /* The gender card is present in two of the three modes and absent in
             the third, so this row must close either way: 6+6 with it, 5+7 with
             "From approval to execution" taking its place. A fixed span leaves
             half a row of white in one mode. */
          span={showGender ? 6 : 5}
          actions={<ProvenanceChip kind={infra.prov} />}
          emptyLabel={`No infrastructure projects were approved in ${scopeLabel}. Clear the year filter to see every year.`}
          title="Infrastructure, by project type"
          subtitle={`Approved infrastructure projects, ${scopeLabel}`}
          footer={
            <p className="sd-dash__caption">
              &ldquo;Unspecified&rdquo; is the source&rsquo;s own label for a
              project recorded without a type, and it is the largest single
              category — worth fixing upstream rather than hiding here.
            </p>
          }
        >
          <RankedBars rows={infra.rows} unit="approved projects" />
        </ChartCard>

        {showGender && (
          <ChartCard

          {...cardProps(5)}
          skeleton="donut"            data-sa-reveal
            span={6}
            actions={<ProvenanceChip kind={genderProv} />}
            /* NOT "empty" — the distinction is the point of having six states.
               The feed answers, in full, with zeros: the department has not
               begun publishing this, which is neither a gap in our selection
               nor a failure, and there is nothing the reader can do about it.
               Saying "nothing to show yet" would imply otherwise. */
            {...cardProps(
              6,
              genderMerged.values.total === 0 ? "not-published" : undefined,
            )}
            emptyLabel="The gender feed returns a complete structure in which every figure is zero, for every intervention and every year. It will appear here when the department begins publishing it."
            title="Who the grants reach"
            subtitle={`Beneficiaries by gender, ${scopeLabel}`}
            footer={
              <p className="sd-dash__caption">
                {genderProv === "mock" ? (
                  <>
                    The gender feed returns a complete structure in which every
                    figure is zero, for every intervention and every year, so
                    there is nothing here to report yet. The split shown is{" "}
                    <strong>illustrative</strong>: it sits just above the
                    scheme&rsquo;s own floor of 15% of released funds to
                    income-generating schemes for Scheduled Caste women, which is
                    what a scheme meeting its mandate would look like. It is not
                    a departmental figure.
                  </>
                ) : (
                  "Beneficiaries by gender across the approved projects in this period."
                )}
              </p>
            }
          >
            <div className="sd-dash__ring">
              <DonutChart
                key={`gen-${year}-${mode}`}
                title={`Beneficiaries by gender, ${scopeLabel}`}
                data={[
                  { label: "Women", value: genderMerged.values.female, color: categoricalColor(1) },
                  { label: "Men", value: genderMerged.values.male, color: categoricalColor(0) },
                  { label: "Other", value: genderMerged.values.other, color: categoricalColor(3) },
                ].filter((d) => d.value > 0)}
                center={`${pct(genderMerged.values.female, genderMerged.values.total)}%`}
                centerSub="women"
              />
            </div>
          </ChartCard>
        )}

        <ChartCard

          {...cardProps(6)}
          skeleton="line"          data-sa-reveal
          span={showGender ? 12 : 7}
          actions={<ProvenanceChip kind={physicalProv} />}
          title="From approval to execution"
          subtitle={
            year === ALL
              ? "Projects on the books against projects reported in progress, every year"
              : `Projects on the books against projects reported in progress, ${year}`
          }
          footer={
            <p className="sd-dash__caption">
              These are the department&rsquo;s <strong>project</strong> counts,
              which are larger than the approved-grant counts above and are not
              the same denominator — a grant may carry several projects. Read the
              two as separate questions, not as a funnel.
            </p>
          }
        >
          <div className="sd-dash__pair">
            <div className="sd-dash__pair-item">
              <p className="sd-dash__pair-label">Projects on the books</p>
              <strong className="sd-dash__pair-value">
                {formatIndian(projectsTotal)}
              </strong>
            </div>
            <div className="sd-dash__pair-item">
              <p className="sd-dash__pair-label">Reported in progress</p>
              <strong className="sd-dash__pair-value">
                {formatIndian(projectsInProgress)}
              </strong>
              <p className="sd-dash__pair-note">
                {pct(projectsInProgress, projectsTotal)}% of the total
              </p>
            </div>
          </div>
          <LineChart
            key={`pp-${year}`}
            title="Projects in progress by financial year"
            labels={years.map((y) => shortYear(y.finYear))}
            series={[
              {
                name: "Projects in progress",
                data: years.map((y) => y.physical.values.inProgress),
                color: sequentialColor(0.8),
                fill: true,
              },
            ]}
            height={200}
          />
        </ChartCard>
      </DashboardGrid>

      {/* Sits at the last row's bottom edge. `useStickyRange` turns that into
          both of its thresholds using the row's measured height. */}
      <div ref={endSentinel} aria-hidden className="sd-dash__sentinel" />

    </section>
  );
}
