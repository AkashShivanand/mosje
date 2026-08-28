"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChartCard,
  DashboardGrid,
  DonutChart,
  formatIndian,
  useOnlineStatus,
  useScrollReveal,
} from "@mosje/design-system";
import { HOSTEL_DESCRIPTOR, type HostelData } from "@/lib/website/pmajay-api";
import { PMAJAY_AS_ON } from "@/lib/website/pmajay-stats";
import { cardStateFor, useDataMode } from "@/lib/data-mode/context";
import type { CardStateKind } from "@mosje/design-system";
import { mergeData, provenanceOf } from "@/lib/data-mode/merge";
import { ProvenanceChip } from "./ProvenanceChip";
import "./scheme-dashboard.css";

const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

/**
 * Construction and repair of hostels, in numbers.
 *
 * SMALLER THAN ITS TWO SIBLINGS, BECAUSE ITS FEED IS. The public summary
 * endpoint publishes three fields and no parameters — it ignores `fin_year` —
 * so there is no year to filter by, no state to filter by, and nothing for a
 * sticky toolbar to carry. The header therefore does not stick: a strip pinned
 * to the top of the viewport for the whole section, holding a heading the reader
 * has already read, is chrome charging rent.
 *
 * The third field, `completed_hostels`, is 0. For a component that has covered
 * 2.3 lakh beneficiaries that means the column is unpopulated, not that no
 * hostel is finished, so it is not drawn — a zero here would be a claim, and a
 * false one. It is named in the card footer instead, because "why is the obvious
 * number missing" is a question a reader will otherwise ask of the page rather
 * than of the department.
 */
export interface HostelDashboardProps {
  data: HostelData;
}

export function HostelDashboard({ data }: HostelDashboardProps) {
  const root = React.useRef<HTMLElement>(null);
  useScrollReveal(root);

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
  const merged = React.useMemo(
    () => mergeData(HOSTEL_DESCRIPTOR, data.reading, data.mock, mode),
    [data, mode],
  );

  const covered = merged.values.beneficiaries_covered;
  const occupied = merged.values.beneficiaries_occupied;
  const completed = merged.values.completed_hostels;
  const share = pct(occupied, covered);
  const spare = Math.max(0, covered - occupied);
  const occupancyProv = provenanceOf(merged, ["beneficiaries_covered", "beneficiaries_occupied"]);
  const completedProv = provenanceOf(merged, ["completed_hostels"]);

  return (
    <section
      id="hostel-progress"
      className="sd-dash"
      aria-labelledby="hostel-dash-title"
      ref={root}
    >
      <header className="sd-dash__head sd-dash__head--static">
        <h2 id="hostel-dash-title" className="sd-dash__title">
          Hostels, in numbers
        </h2>
      </header>

      {marks && merged.allMock && (
        <p className="dm-banner">
          <b>Illustrative figures.</b>&nbsp;The live summary feed is not
          answering, so these are the last published totals, mirrored on{" "}
          {PMAJAY_AS_ON}. Nothing here is a current departmental figure.
        </p>
      )}

      <div className="sd-dash__hero" data-sa-reveal>
        <div>
          <p className="sd-dash__hero-label">
            Beneficiaries covered
            <ProvenanceChip kind={occupancyProv} />
          </p>
          <strong className="sd-dash__hero-value">{formatIndian(covered)}</strong>
          <p className="sd-dash__hero-of">
            {formatIndian(occupied)} of them are in occupation — {share}% of the
            places the component has provided for.
          </p>
          <div
            className="sd-dash__hero-track"
            role="img"
            aria-label={`${share} percent of covered beneficiaries are in occupation`}
          >
            <span className="sd-dash__hero-fill" style={{ width: `${share}%` }} />
          </div>
        </div>

        <div className="sd-dash__ratios" aria-label="Hostel occupancy">
          <div className="sd-dash__ratio">
            <div className="sd-dash__ratio-head">
              <span className="sd-dash__ratio-label">In occupation</span>
              <span className="sd-dash__ratio-value">{share}%</span>
            </div>
            <div
              className="sd-dash__ratio-track"
              role="img"
              aria-label={`${formatIndian(occupied)} occupied of ${formatIndian(covered)} covered, ${share} percent`}
            >
              <span className="sd-dash__ratio-fill" style={{ width: `${share}%` }} />
            </div>
            <p className="sd-dash__ratio-note">
              {formatIndian(occupied)} occupied of {formatIndian(covered)} covered
            </p>
          </div>

          <div className="sd-dash__ratio">
            <div className="sd-dash__ratio-head">
              <span className="sd-dash__ratio-label">Provided for, not yet occupied</span>
              <span className="sd-dash__ratio-value">{100 - share}%</span>
            </div>
            <div
              className="sd-dash__ratio-track"
              role="img"
              aria-label={`${formatIndian(spare)} places provided for but not yet occupied, ${100 - share} percent`}
            >
              <span
                className="sd-dash__ratio-fill"
                style={{ width: `${100 - share}%` }}
              />
            </div>
            <p className="sd-dash__ratio-note">
              {formatIndian(spare)} places still to be taken up
            </p>
          </div>
        </div>
      </div>

      {/* ONE CARD, NOT TWO. The feed publishes three fields; splitting four
          derived figures across two cards made the ring 500px tall beside a
          column of short numbers, and no amount of spreading fixed a row whose
          two halves have that little in common. Side by side in one card, the
          ring IS the reading of the figures next to it. */}
      <DashboardGrid>
        <ChartCard

          {...cardProps(0)}
          skeleton="donut"          data-sa-reveal
          exportable
          span={12}
          actions={<ProvenanceChip kind={provenanceOf(merged, ["beneficiaries_covered", "beneficiaries_occupied", "completed_hostels"])} />}
          title="Occupancy"
          subtitle="Beneficiaries in occupation as a share of those covered, and every field the public summary carries"
          footer={
            <p className="sd-dash__caption">
              Just over half the places the component has provided for are being
              used; the gap is <strong>{formatIndian(spare)}</strong>.{" "}
              {completedProv === "mock"
                ? "The hostels-completed count is not published by the live feed; the figure shown is illustrative, derived from the places covered at an indicative 100 seats a hostel."
                : "Hostels completed comes from the live feed."}
            </p>
          }
        >
          <div className="sd-dash__split">
            <div className="sd-dash__split-figure">
              <DonutChart
                title="Hostel occupancy"
                value={occupied}
                max={covered}
                center={`${share}%`}
                centerSub="in occupation"
              />
            </div>
            <dl className="sd-dash__ref-grid sd-dash__ref-grid--fill">
              <div className="sd-dash__ref-item">
                <dt className="sd-dash__ref-label">Beneficiaries covered</dt>
                <dd className="sd-dash__ref-value">{formatIndian(covered)}</dd>
              </div>
              <div className="sd-dash__ref-item">
                <dt className="sd-dash__ref-label">Beneficiaries in occupation</dt>
                <dd className="sd-dash__ref-value">{formatIndian(occupied)}</dd>
              </div>
              <div className="sd-dash__ref-item">
                <dt className="sd-dash__ref-label">Places not yet taken up</dt>
                <dd className="sd-dash__ref-value">{formatIndian(spare)}</dd>
              </div>
              <div className="sd-dash__ref-item">
                <dt className="sd-dash__ref-label">
                  Hostels completed <ProvenanceChip kind={completedProv} />
                </dt>
                <dd className="sd-dash__ref-value">{formatIndian(completed)}</dd>
              </div>
            </dl>
          </div>
        </ChartCard>
      </DashboardGrid>
    </section>
  );
}
