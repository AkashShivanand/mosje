"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Button,
  ChartCard,
  DashboardGrid,
  FunnelChart,
  IndiaMap,
  LineChart,
  Select,
  formatCompact,
  formatIndian,
  sequentialColor,
  useOnlineStatus,
  useScrollReveal,
  useStickyRange,
} from "@mosje/design-system";
import {
  PROGRESS_SERIES,
  PROGRESS_STATES,
  PROGRESS_YEARS,
  PROGRESS_YEAR_END_INDEX,
  PROGRESS_MONTHS,
} from "@/lib/website/adarsh-gram-series";
import { ADARSH_GRAM_DESCRIPTOR, type AdarshGramFeed, type CountKey } from "@/lib/website/adarsh-gram-api";
import { cardStateFor, useDataMode } from "@/lib/data-mode/context";
import type { CardStateKind } from "@mosje/design-system";
import { mergeData, provenanceOf } from "@/lib/data-mode/merge";
import { ProvenanceChip } from "./ProvenanceChip";
import {
  ADARSH_GRAM_AS_ON,
  ADARSH_GRAM_CONVERGENCE,
  ADARSH_GRAM_REFERENCE,
  ADARSH_GRAM_TOP_STATES,
} from "@/lib/website/adarsh-gram-stats";
import "./scheme-dashboard.css";

const ALL = "ALL";
/** Where the sticky header rests: 1px under the site masthead's scrolled bottom
 *  edge (measured at 65px). Mirrored by `top` in scheme-dashboard.css. */
const HEAD_TOP = 64;
const CRORE = 1_00_00_000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

/** One rule for every figure: full Indian grouping below a crore, compact above. */
const figure = (n: number) => (n >= CRORE ? formatCompact(n) : formatIndian(Math.round(n)));

/**
 * Adarsh Gram progress.
 *
 * The source reports eighteen counts of equal weight, which is a list rather
 * than a picture. Here each figure gets the form it earns: the outcome once and
 * large, the six-stage journey as a funnel, paired numbers as ratios, geography
 * as a map, and the plain counts demoted to a reference strip.
 *
 * The State and Year controls are page-level. Anything that can answer them
 * does; anything that only exists nationally says so on its own card, so the
 * filter never implies a scope it cannot deliver.
 */
export interface AdarshGramDashboardProps {
  /** What the feed said, plus the mirrored snapshot. Merged here, not on the server. */
  feed: AdarshGramFeed;
}

export function AdarshGramDashboard({ feed }: AdarshGramDashboardProps) {
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

  // The merge is the ONLY place a figure is chosen. Grouped by the invariants in
  // ADARSH_GRAM_DESCRIPTOR, so the three ratios can never take a numerator from
  // one source and a denominator from the other — the defect that published
  // "gap-filling funds utilised: 138%".
  const merged = React.useMemo(
    () => mergeData(ADARSH_GRAM_DESCRIPTOR, feed.reading, feed.mock, mode),
    [feed, mode],
  );
  const counts = merged.values;
  const prov = React.useCallback(
    (...keys: CountKey[]) => provenanceOf(merged, keys),
    [merged],
  );
  const [state, setState] = React.useState(ALL);
  const [year, setYear] = React.useState(ALL);

  const root = React.useRef<HTMLElement>(null);
  useScrollReveal(root);

  // Whether the header has pinned. An IntersectionObserver on a zero-height
  // sentinel sitting where the header starts: the sentinel leaves the viewport
  // exactly when the header stops moving with the page, so this is the pinned
  // state itself rather than a scroll offset that approximates it.
  //
  // A `view()` timeline was tried first and cannot do this job. A scroll-driven
  // range measures an element's position in the scrollport, and a pinned
  // element's position stops changing — which is the very moment we need to
  // detect. The observer answers it directly, and works everywhere.
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

  const filtered = state !== ALL || year !== ALL;
  const resetFilters = React.useCallback(() => {
    setState(ALL);
    setYear(ALL);
  }, []);

  const isNational = state === ALL;
  const series = PROGRESS_SERIES[state] ?? PROGRESS_SERIES[ALL]!;
  const stateName = isNational
    ? "All India"
    : (PROGRESS_STATES.find((s) => s.code === state)?.name ?? "All India");

  const picks = React.useMemo(() => {
    if (year === ALL) {
      return PROGRESS_YEAR_END_INDEX.map((i, n) => ({ index: i, label: PROGRESS_YEARS[n]! }));
    }
    return PROGRESS_MONTHS.map((m, i) => ({ m, i }))
      .filter(({ m }) => m.endsWith(`-${year}`))
      .map(({ m, i }) => ({ index: i, label: MONTHS[Number(m.split("-")[0]) - 1]! }));
  }, [year]);

  const endIndex = picks[picks.length - 1]?.index ?? PROGRESS_MONTHS.length - 1;
  const at = (k: keyof typeof series) => picks.map((p) => series[k][p.index] ?? 0);

  // The published tile figures are a single latest snapshot with no year in
  // them, so they are only right when nothing is filtered. As soon as a state or
  // a year is picked the hero reads the implementation series like every other
  // card, or it sits there showing the 2026 national total under a 2022 heading.
  const useTiles = isNational && year === ALL;
  const declared = useTiles ? counts.adarsh_gram_declared : (series.declared[endIndex] ?? 0);
  const villages = useTiles ? counts.villages : (series.selected[endIndex] ?? 0);
  const declaredPct = pct(declared, villages);

  // Six stages nationally. A state has only the four the series carries, so it
  // shows four rather than inventing the two it does not have.
  const journey = useTiles
    ? [
        { label: "Villages selected", value: counts.villages },
        { label: "Assessment initiated", value: counts.assessment_initiated },
        { label: "Assessment completed", value: counts.assessment_completed },
        { label: "Village Development Plan drawn", value: counts.vdp_generated },
        { label: "Plan approved by DLCC", value: counts.vdp_dlcc_approved },
        { label: "Declared Adarsh Gram", value: counts.adarsh_gram_declared },
      ]
    : [
        { label: "Villages selected", value: series.selected[endIndex] ?? 0 },
        { label: "Village Development Plan drawn", value: series.generated[endIndex] ?? 0 },
        { label: "Plan approved by DLCC", value: series.approved[endIndex] ?? 0 },
        { label: "Declared Adarsh Gram", value: series.declared[endIndex] ?? 0 },
      ];
  const journeyDrop = pct(journey[journey.length - 1]!.value, journey[0]!.value);

  // Declared villages per state AT THE SELECTED YEAR. The map and the ranking
  // used to read a fixed snapshot, so they sat still while every other card
  // moved with the Year filter. Both are derived from the same per-state series
  // the trend chart uses, so the whole section now answers the same question.
  const declaredByState = React.useMemo(
    () =>
      PROGRESS_STATES.map((st) => ({
        state: st.name,
        value: PROGRESS_SERIES[st.code]?.declared[endIndex] ?? 0,
      }))
        .filter((d) => d.value > 0)
        .sort((a, b) => b.value - a.value),
    [endIndex],
  );

  // The three delivery ratios, built from the feed. Each is a pair that only
  // means anything together, and each can arrive unpopulated: the dev feed
  // returns 0 for works completed, works under gap-filling and funds utilised.
  // A 0 there means "not reported", so the card says that instead of drawing a
  // 0% bar that reads as "nothing has been done".
  const ratios = [
    {
      id: "works",
      keys: ["works_completed", "works_identified"] as CountKey[],
      label: "Infrastructure works completed",
      done: counts.works_completed,
      total: counts.works_identified,
      doneText: figure(counts.works_completed),
      totalText: figure(counts.works_identified),
      doneLabel: "completed",
      totalLabel: "identified for execution",
    },
    {
      id: "funds",
      keys: ["gap_filling_utilized_lakh", "gap_filling_release_lakh"] as CountKey[],
      label: "Gap-filling funds utilised",
      done: counts.gap_filling_utilized_lakh,
      total: counts.gap_filling_release_lakh,
      // Reported in lakh; restated in crore, the unit used at this size.
      doneText: `\u20B9${formatIndian(Math.round(counts.gap_filling_utilized_lakh / 100))} Cr`,
      totalText: `\u20B9${formatIndian(Math.round(counts.gap_filling_release_lakh / 100))} Cr`,
      doneLabel: "utilised",
      totalLabel: "released",
    },
    {
      id: "beneficiaries",
      keys: ["beneficiaries_covered", "beneficiaries_identified"] as CountKey[],
      label: "Beneficiaries reached",
      done: counts.beneficiaries_covered,
      total: counts.beneficiaries_identified,
      doneText: figure(counts.beneficiaries_covered),
      totalText: figure(counts.beneficiaries_identified),
      doneLabel: "provided the service",
      totalLabel: "identified as prospective",
    },
  ];

  const period = year === ALL ? "2019 to 2026" : year;
  const scope = `${stateName}, ${period}`;

  // Works by state, as a share of each state's own workload.
  //
  // Absolute counts do not work here: Uttar Pradesh has 1,04,505 works not
  // started against Assam's 5,575, so a raw stacked bar gave UP a bar twenty
  // times the next longest and squashed every other state into a sliver. Two
  // earlier attempts at a fix each broke something else: putting the rate in
  // the axis label overflowed the chart's fixed 116px label column, and moving
  // it out to the caption left the bars sorted by a key the reader could not
  // see.
  //
  // Normalising each row to 100% resolves all three at once. Bar length IS the
  // completion rate, so the sort order explains itself; every state is
  // comparable regardless of workload; and all three stages survive.
  const works = [...ADARSH_GRAM_TOP_STATES]
    .map((s) => {
      const total = s.completed + s.inProgress + s.notStarted || 1;
      // Each row has to sum to EXACTLY 100. Rounding the three shares
      // independently pushed one state to 100.1, and the axis then rounded up
      // to a nice 150 — so every bar stopped two thirds across and a third of
      // the card sat empty. The remainder absorbs the rounding instead.
      const completedPct = Math.round((s.completed / total) * 1000) / 10;
      const inProgressPct = Math.round((s.inProgress / total) * 1000) / 10;
      return {
        ...s,
        total,
        completedPct,
        inProgressPct,
        notStartedPct: Math.round((100 - completedPct - inProgressPct) * 10) / 10,
      };
    })
    .sort((a, b) => b.completedPct - a.completedPct);

  const topGapFilling = [...ADARSH_GRAM_TOP_STATES]
    .sort((a, b) => b.gapFilling - a.gapFilling)
    .slice(0, 3);

  return (
    <section
      id="adarsh-gram-progress"
      className="sd-dash"
      aria-labelledby="sd-dash-title"
      ref={root}
    >
      {/* Zero-height marker for the sticky header above. It sits in normal flow
          where the header starts, so its leaving the viewport IS the header
          pinning. */}
      <div ref={sentinel} aria-hidden className="sd-dash__sentinel" />

      <header className="sd-dash__head" data-stick={stick}>
        {/* No strapline. It said "live figures from the MIS" — true, but a
            sentence that has to collapse when the header pins, and its collapsed
            box kept leaving an empty line under the title. The last-updated date
            is in the footer per DBIM 5.6, so nothing compliance-bearing is lost.
            The one case a reader genuinely needs told is the OTHER one: that the
            feed was unreachable and these are mirrored figures. That gets a chip,
            and only then. */}
        <h2 id="sd-dash-title" className="sd-dash__title">
          Adarsh Gram, in numbers
        </h2>

        {/* Figma 51875:56255 — two pills and a reset, no standing labels.
            "All States" and "All Years" name the filter in the value itself, so
            a label above each one would say the same word twice and cost the
            toolbar 20px of height it needs back when the header condenses. The
            accessible name is still there, just not drawn. */}
        <div className="sd-dash__filters">
          <label htmlFor="ag-state" className="sr-only">
            Filter by state
          </label>
          <Select
            id="ag-state"
            appearance="filter"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value={ALL}>All States</option>
            {PROGRESS_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </Select>

          <label htmlFor="ag-year" className="sr-only">
            Filter by year
          </label>
          <Select
            id="ag-year"
            appearance="filter"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value={ALL}>All Years</option>
            {/* Newest first. A reader reaching for a year wants the latest
                far more often than 2019, and every other date control on the
                estate reads most-recent-first. */}
            {[...PROGRESS_YEARS].reverse().map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>

          {/* Always present, disabled with nothing to reset. Showing and hiding
              it would change the toolbar's width under the reader's cursor
              every time a filter is set — in a strip that is pinned to the top
              of the screen while they scroll. */}
          <Button
            type="button"
            variant="primary"
            appearance="outlined"
            size="sm"
            className="sd-dash__reset"
            onClick={resetFilters}
            disabled={!filtered}
          >
            Reset filters
          </Button>
        </div>
      </header>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {scope}.
      </p>

      {/* Said once, before the reader starts, when the whole section is
          illustrative. The chips say it per card; this stops someone forming an
          impression from the big number before they reach one. */}
      {marks && merged.allMock && (
        <p className="dm-banner">
          <b>Illustrative figures.</b>&nbsp;The live report feed is not
          answering, so these are the last published totals, mirrored on{" "}
          {ADARSH_GRAM_AS_ON}. Nothing here is a current departmental figure.
        </p>
      )}

      {/* Outcome, with the three ratios that qualify it. */}
      <div className="sd-dash__hero" data-sa-reveal>
        <div>
          <p className="sd-dash__hero-label">
            Villages declared Adarsh Gram
            <ProvenanceChip
              kind={useTiles ? prov("adarsh_gram_declared", "villages") : "mock"}
            />
          </p>
          <strong className="sd-dash__hero-value">{formatIndian(declared)}</strong>
          <p className="sd-dash__hero-of">
            {declaredPct}% of the {formatIndian(villages)} villages selected.
            Each scored 70 or above out of 100 and is Open Defecation Free.
          </p>
          <div
            className="sd-dash__hero-track"
            role="img"
            aria-label={`${declaredPct} percent of selected villages declared Adarsh Gram in ${stateName}`}
          >
            <span className="sd-dash__hero-fill" style={{ width: `${declaredPct}%` }} />
          </div>
        </div>

        <div className="sd-dash__ratios" aria-label="National delivery ratios">
          {ratios.map((r) => {
            const share = pct(r.done, r.total);
            return (
              <div key={r.id} className="sd-dash__ratio">
                <div className="sd-dash__ratio-head">
                  <span className="sd-dash__ratio-label">
                    {r.label}
                    <ProvenanceChip kind={prov(...r.keys)} />
                  </span>
                  <span className="sd-dash__ratio-value">{share}%</span>
                </div>
                <div
                  className="sd-dash__ratio-track"
                  role="img"
                  aria-label={`${r.label}: ${r.doneText} ${r.doneLabel} of ${r.totalText} ${r.totalLabel}, ${share} percent`}
                >
                  <span className="sd-dash__ratio-fill" style={{ width: `${share}%` }} />
                </div>
                <p className="sd-dash__ratio-note">
                  {r.doneText} {r.doneLabel} of {r.totalText} {r.totalLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <DashboardGrid ref={gridRef}>
        <ChartCard

          {...cardProps(0)}
          skeleton="rows"          data-sa-reveal
          exportable
          span={6}
          actions={<ProvenanceChip kind={prov("villages","assessment_initiated","assessment_completed","vdp_generated","vdp_dlcc_approved","adarsh_gram_declared")} />}
          title="From selection to declaration"
          subtitle={`Where villages stand along the scheme's stages, ${stateName}`}
          footer={
            <p className="sd-dash__caption">
              <strong>{journeyDrop}%</strong> of selected villages complete the
              whole journey.{" "}
              {useTiles
                ? "The largest single drop is between a finished survey and a drafted plan, where a quarter of villages fall away."
                : "Filtered figures cover the four stages the implementation series reports; the two survey stages are published only as a national total."}
            </p>
          }
        >
          <FunnelChart
            title={`Villages by stage, ${stateName}`}
            stages={journey.map((s, i) => ({
              ...s,
              /* One ordered process, so one hue that deepens. Categorical
                 colours would claim the stages are different kinds of thing;
                 they are the same villages at successive moments. */
              color: sequentialColor(0.35 + (i / Math.max(1, journey.length - 1)) * 0.65),
            }))}
          />
        </ChartCard>

        <ChartCard

          {...cardProps(1)}
          skeleton="line"          data-sa-reveal
          exportable
          span={6}
          /* Drawn from the committed per-state series, not the counters feed —
             illustrative in every mode until the department publishes a
             state-wise endpoint. */
          actions={<ProvenanceChip kind="mock" />}
          title="Implementation progress"
          subtitle={
            year === ALL
              ? `Cumulative villages at each stage, year end, ${stateName}`
              : `Cumulative villages at each stage by month in ${year}, ${stateName}`
          }
          footer={
            <p className="sd-dash__caption">
              <strong>{scope}</strong>: {formatIndian(series.declared[endIndex] ?? 0)}{" "}
              villages declared by the end of the period, against{" "}
              {formatIndian(series.selected[endIndex] ?? 0)} selected.
            </p>
          }
        >
          <LineChart
            key={`${state}-${year}`}
            title={`Cumulative villages by stage, ${scope}`}
            labels={picks.map((p) => p.label)}
            series={[
              { name: "Villages selected", data: at("selected") },
              { name: "Plans drawn", data: at("generated") },
              { name: "Plans approved", data: at("approved") },
              { name: "Declared Adarsh Gram", data: at("declared") },
            ]}
            height={300}
          />
        </ChartCard>

        <ChartCard

          /* Real: a year early enough that no state had declared a village yet. */
          {...cardProps(2, declaredByState.length === 0 ? "no-results" : undefined)}
          skeleton="region"          data-sa-reveal
          exportable
          span={5}
          /* Drawn from the committed per-state series, not the counters feed —
             illustrative in every mode until the department publishes a
             state-wise endpoint. */
          actions={<ProvenanceChip kind="mock" />}
          emptyLabel={`No village had been declared an Adarsh Gram anywhere by ${period}. Clear the year filter to see the latest position.`}
          title="Where the Adarsh Grams are"
          subtitle={`Villages declared by state, ${period}`}
          footer={
            <p className="sd-dash__caption">
              {declaredByState.length} states had declared villages by{" "}
              {year === ALL ? "2026" : year}. The top two hold{" "}
              <strong>
                {Math.round(
                  (((declaredByState[0]?.value ?? 0) + (declaredByState[1]?.value ?? 0)) /
                    Math.max(1, declaredByState.reduce((t, d) => t + d.value, 0))) *
                    100,
                )}
                %
              </strong>{" "}
              of them between them.
            </p>
          }
        >
          <IndiaMap
            title="Declared Adarsh Grams by state"
            data={declaredByState}
            highlightState={isNational ? undefined : stateName}
          />
          {/* A choropleth is good at "where" and poor at "in what order". The
              map keeps its aspect ratio and cannot stretch to its neighbour's
              height, so the space underneath carries the ranking it cannot show
              rather than being left blank. */}
          <ol className="sd-dash__rank">
            {(() => {
              const top = declaredByState.slice(0, 5);
              const rank = declaredByState.findIndex((d) => d.state === stateName);
              const rows =
                !isNational && rank >= 5
                  ? [...top, { ...declaredByState[rank]!, _rank: rank }]
                  : top;
              return rows.map((r, i) => {
                const pos = "_rank" in r ? (r as { _rank: number })._rank : i;
                const isPicked = !isNational && r.state === stateName;
                return (
                  <li
                    key={r.state}
                    className={`sd-dash__rank-row${isPicked ? " sd-dash__rank-row--on" : ""}`}
                    aria-current={isPicked ? "true" : undefined}
                  >
                    <span className="sd-dash__rank-pos">{pos + 1}</span>
                    <span className="sd-dash__rank-name">{r.state}</span>
                    <span className="sd-dash__rank-value">{formatIndian(r.value)}</span>
                  </li>
                );
              });
            })()}
          </ol>
        </ChartCard>

        <ChartCard

          {...cardProps(3)}
          skeleton="bars"          data-sa-reveal
          exportable
          span={7}
          /* Drawn from the committed per-state series, not the counters feed —
             illustrative in every mode until the department publishes a
             state-wise endpoint. */
          actions={<ProvenanceChip kind="mock" />}
          title="How far each state has got"
          subtitle="Ten states with the most completed works, latest figures. Every bar is that state's own workload, at 100%"
          footer={
            <p className="sd-dash__caption">
              {!isNational &&
                (works.some((w) => w.state === stateName)
                  ? `${stateName} is in this ten. `
                  : `${stateName} is not in this ten; these are the ten states with the most completed works. `)}
              Odisha has finished <strong>36%</strong> of the works it identified;
              Uttar Pradesh <strong>2%</strong>, on the largest workload in the
              country at 1,04,505 works not yet started. Most gap-filling work
              sits with {topGapFilling.map((s) => s.state).join(", ")}.
            </p>
          }
        >
          <BarChart
            title="Share of identified works by stage, for each state"
            orientation="horizontal"
            variant="stacked"
            labels={works.map((s) => s.state)}
            series={[
              {
                name: "Completed",
                data: works.map((s) => s.completedPct),
                color: "var(--sa-color-status-success)",
              },
              {
                name: "In progress",
                data: works.map((s) => s.inProgressPct),
                color: "var(--sa-color-status-warning)",
              },
              {
                name: "Not started",
                data: works.map((s) => s.notStartedPct),
                color: "var(--sa-color-neutralScale-400)",
              },
            ]}
            height={380}
          />
        </ChartCard>

        <ChartCard

          {...cardProps(4)}
          skeleton="rows"          data-sa-reveal
          span={8}
          /* Drawn from the committed per-state series, not the counters feed —
             illustrative in every mode until the department publishes a
             state-wise endpoint. */
          actions={<ProvenanceChip kind="mock" />}
          title="What the villages received"
          subtitle="Achieved against target, on eight of the 50 monitorable indicators. National, all years"
          footer={
            <p className="sd-dash__caption">
              The bar shows achievement. The figure on the right is the target.
            </p>
          }
        >
          <ul className="sd-dash__conv">
            {[...ADARSH_GRAM_CONVERGENCE]
              .sort((a, b) => b.achieved / b.target - a.achieved / a.target)
              .map((c) => {
                const share = pct(c.achieved, c.target);
                return (
                  <li key={c.label} className="sd-dash__conv-row">
                    <div className="sd-dash__conv-head">
                      <span className="sd-dash__conv-label">{c.label}</span>
                      <span className="sd-dash__conv-figure">
                        <b>{formatIndian(c.achieved)}</b> of {formatIndian(c.target)} ({share}%)
                      </span>
                    </div>
                    <div
                      className="sd-dash__conv-track"
                      role="img"
                      aria-label={`${c.label}: ${formatIndian(c.achieved)} achieved of ${formatIndian(c.target)} targeted, ${share} percent`}
                    >
                      <span className="sd-dash__conv-fill" style={{ width: `${share}%` }} />
                    </div>
                  </li>
                );
              })}
          </ul>
        </ChartCard>
        <ChartCard

          {...cardProps(5)}
          skeleton="figures"          data-sa-reveal
          span={4}
          actions={<ProvenanceChip kind={prov("states_covered","districts_covered","villages","total_population","sc_population","households","works_gap_filling")} />}
          title="Reach and coverage"
          subtitle="National figures"
          footer={
            <p className="sd-dash__caption">
              &ldquo;Need assessments filed&rdquo; counts Format-1 household
              entries rather than distinct households, which is why it runs well
              above the number of villages.
            </p>
          }
        >
          <dl className="sd-dash__ref-grid">
            {[
              { label: "States covered", value: counts.states_covered },
              { label: "Districts covered", value: counts.districts_covered },
              { label: "Gram Panchayats", value: ADARSH_GRAM_REFERENCE[2]!.value },
              { label: "Villages selected", value: counts.villages },
              { label: "Total population", value: counts.total_population },
              { label: "SC population", value: counts.sc_population },
              { label: "Need assessments filed", value: counts.households },
              { label: "Works under gap-filling", value: counts.works_gap_filling },
            ].map((s) => (
              <div key={s.label} className="sd-dash__ref-item">
                <dt className="sd-dash__ref-label">{s.label}</dt>
                <dd className="sd-dash__ref-value">{figure(s.value)}</dd>
              </div>
            ))}
          </dl>
        </ChartCard>
      </DashboardGrid>

      {/* Sits at the last row's bottom edge. `useStickyRange` turns that into
          both of its thresholds using the row's measured height. */}
      <div ref={endSentinel} aria-hidden className="sd-dash__sentinel" />

    </section>
  );
}
