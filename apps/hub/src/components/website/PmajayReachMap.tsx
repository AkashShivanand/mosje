"use client";

import * as React from "react";
import {
  BarChart,
  IndiaMap,
  SectionTitle,
  SegmentedControl,
  formatIndian,
  sequentialColor,
} from "@mosje/design-system";
import {
  PMAJAY_REACH_DESCRIPTOR,
  type ReachData,
  type ReachKey,
} from "@/lib/website/pmajay-api";
import { PMAJAY_REACH_AS_ON, type ReachDataset } from "@/lib/website/pmajay-map-snapshot";
import { useDataMode } from "@/lib/data-mode/context";
import { mergeData, provenanceOf } from "@/lib/data-mode/merge";
import { ProvenanceChip } from "./ProvenanceChip";
import "./pmajay-reach.css";

type Layer = "villages" | "hostels";

const LAYERS: { value: Layer; label: string }[] = [
  { value: "villages", label: "Adarsh Gram villages" },
  { value: "hostels", label: "Hostels" },
];

/** How many states the ranking draws before it says "and N more". */
const RANK_LIMIT = 10;

/**
 * The ranking's viewBox, and the one number in this file that is tuned rather
 * than chosen.
 *
 * `ChartFrame` scales its SVG to the container, so a label renders at its
 * authored size times (container ÷ viewBox width). The band this sits in runs
 * ~808px at a 1280 viewport and ~1090px at 1920, so a 640-unit viewBox keeps the
 * chart's 10px labels between 12 and 17px across everything the estate supports.
 * The default 480 would render them at 17–23px — a ranking shouting over the map
 * above it. See `pmajay-reach.css` for the measurement that settled the layout.
 */
const RANK_VIEWBOX = { width: 640, height: 320 };

const COPY: Record<
  Layer,
  { noun: string; mapTitle: string; rankTitle: string; totalKey: ReachKey; stateKey: ReachKey; districtKey: ReachKey }
> = {
  villages: {
    noun: "villages",
    mapTitle: "Adarsh Gram villages by state",
    rankTitle: "Villages by state",
    totalKey: "villages",
    stateKey: "villageStates",
    districtKey: "villageDistricts",
  },
  hostels: {
    noun: "hostels",
    mapTitle: "Hostels by state",
    rankTitle: "Hostels by state",
    totalKey: "hostels",
    stateKey: "hostelStates",
    districtKey: "hostelDistricts",
  },
};

export interface PmajayReachMapProps {
  data: ReachData;
}

/**
 * Where PM-AJAY has landed, on a map of India.
 *
 * ── WHY A CHOROPLETH AND NOT THE POINTS THE FEED PUBLISHES ───────────────────
 *
 * `map-points` carries a coordinate for every one of 19,767 Adarsh Gram villages
 * and 202 hostels. Plotted raw that is a 3.5 MB payload drawing a smear over the
 * Gangetic plain — 19,767 dots at national scale is ink, not information, and it
 * cannot be read by anyone who is not using a mouse. Aggregated to states it
 * answers the question a reader of this page actually has: *has the scheme
 * reached my state, and how far.* The aggregation happens server-side, so the
 * page ships about 2 KB.
 *
 * ── THE MAP NEVER STANDS ALONE ───────────────────────────────────────────────
 *
 * Area is not value. Rajasthan is enormous and reports 1,493; Delhi is a dot and
 * reports 1. A choropleth systematically over-weights large states and hides
 * small ones, so it is paired with a ranked bar chart that puts them in order —
 * the map to find the gap, the bars to read the figures. `IndiaMap` also emits a
 * screen-reader table of every state, so nothing here is mouse-only.
 *
 * ── TWO LAYERS, AND THE THIRD IS DELIBERATELY ABSENT ─────────────────────────
 *
 * PM-AJAY has three components. This feed carries points for two of them, so the
 * toggle offers two and the footnote says why the third is missing. An empty
 * "Grants-in-Aid" layer would state that GIA has reached nowhere — false, rather
 * than merely absent, which is the distinction `live-data-fallback.md` exists to
 * protect.
 *
 * ── PROVENANCE ───────────────────────────────────────────────────────────────
 *
 * The scalars merge through `PMAJAY_REACH_DESCRIPTOR`. The per-state ROWS cannot
 * — a list whose length the feed decides has no fixed key set — so they follow
 * the provenance their own dataset's total resolved to. That keeps the map and
 * the totals above it from ever disagreeing about which source they came from,
 * which is the one way this section could mislead: live totals over mirrored
 * geography would read as a live map.
 */
export function PmajayReachMap({ data }: PmajayReachMapProps) {
  const [layer, setLayer] = React.useState<Layer>("villages");
  const { mode, marks } = useDataMode();

  const mockScalars = React.useMemo(
    () => ({
      villages: data.mock.villages.total,
      villageStates: data.mock.villages.states,
      villageDistricts: data.mock.villages.districts,
      hostels: data.mock.hostels.total,
      hostelStates: data.mock.hostels.states,
      hostelDistricts: data.mock.hostels.districts,
    }),
    [data.mock],
  );

  const merged = React.useMemo(
    () => mergeData(PMAJAY_REACH_DESCRIPTOR, data.reading, mockScalars, mode),
    [data.reading, mockScalars, mode],
  );

  const copy = COPY[layer];
  const prov = provenanceOf(merged, [copy.totalKey, copy.stateKey, copy.districtKey]);

  /*
   * The rows follow the total's provenance, not the feed's availability. In
   * `mock` mode the feed may well have answered — the reader asked to see the
   * mirror anyway, and a live map under mirrored totals would contradict the
   * chip sitting above it.
   */
  const dataset: ReachDataset =
    prov === "mock" || data.live == null ? data.mock[layer] : data.live[layer];

  const rows = dataset.rows;
  const ranked = rows.slice(0, RANK_LIMIT);
  const remainder = rows.length - ranked.length;

  const total = merged.values[copy.totalKey];
  const states = merged.values[copy.stateKey];
  const districts = merged.values[copy.districtKey];

  return (
    <>
      <SectionTitle
        as={2}
        title="Where PM-AJAY has reached"
        description="Adarsh Gram villages and hostels on the department's books, by state. Switch the layer to compare the two components."
        headingId="reach-heading"
      >
        <div className="pmr__controls">
          <SegmentedControl
            options={LAYERS}
            value={layer}
            onChange={setLayer}
            ariaLabel="Scheme component"
          />
          <ProvenanceChip kind={prov} />
        </div>
      </SectionTitle>

      {marks && prov === "mock" && (
        <p className="dm-banner">
          <b>Illustrative figures.</b>&nbsp;The live map feed is not answering, so
          this is the last published distribution, mirrored on {PMAJAY_REACH_AS_ON}.
          Nothing here is a current departmental figure.
        </p>
      )}

      <dl className="pmr__totals">
        <div className="pmr__total">
          <dt className="pmr__total-label">
            {layer === "villages" ? "Villages" : "Hostels"}
          </dt>
          <dd className="pmr__total-value">{formatIndian(total)}</dd>
        </div>
        <div className="pmr__total">
          <dt className="pmr__total-label">States &amp; UTs</dt>
          <dd className="pmr__total-value">{formatIndian(states)}</dd>
        </div>
        <div className="pmr__total">
          <dt className="pmr__total-label">Districts</dt>
          <dd className="pmr__total-value">{formatIndian(districts)}</dd>
        </div>
      </dl>

      <div className="pmr__layout">
        <div className="pmr__map">
          <IndiaMap data={rows} title={copy.mapTitle} />
        </div>
        <div className="pmr__rank">
          <BarChart
            orientation="horizontal"
            title={copy.rankTitle}
            /*
             * SHADED FROM THE SAME RAMP AS THE MAP, NOT THE CATEGORICAL ONE.
             *
             * `BarChart`'s single-series default gives every bar its own hue off
             * the categorical palette, which is right when the bars are ten
             * different things. These are ten instances of ONE thing, and the
             * map above them already says "darker means more". Ten hues under a
             * sequential choropleth reads as a second, contradicting encoding —
             * and it makes West Bengal blue and Bihar brown for no reason a
             * reader can name. Sharing the ramp means a state that is dark on
             * the map is dark in the ranking.
             *
             * FLOORED AT 0.3, because the ramp's bottom rung is a near-white
             * that a bar cannot use. On the map that step is legible — it sits
             * inside a stroked outline, beside the distinct grey of "no data".
             * A bar has neither: Maharashtra's 311 against West Bengal's 5,792
             * lands at t=0.05 and drew an all-but-invisible sliver on a white
             * card, under the 3:1 WCAG 2.2 §1.4.11 floor for a non-text graphic.
             * Compressing into the top 70% of the ramp keeps the ordering the
             * eye reads while leaving every bar visible.
             */
            data={ranked.map((r) => ({
              label: r.state,
              value: r.value,
              color: sequentialColor(0.3 + 0.7 * (r.value / (ranked[0]?.value || 1))),
            }))}
            width={RANK_VIEWBOX.width}
            height={RANK_VIEWBOX.height}
            showValues
            caption={
              remainder > 0
                ? `The ${RANK_LIMIT} states reporting most ${copy.noun}. ${remainder} more report fewer; every state is in the map's data table.`
                : `Every state reporting ${copy.noun}.`
            }
          />
        </div>
      </div>

      <p className="pmr__note">
        Grants-in-Aid is not drawn here: the department publishes locations for
        villages and hostels only, and an empty third layer would state that
        Grants-in-Aid has reached nowhere. A state&rsquo;s area is not its count —
        read the ranking for the figures and the map for the gaps.
      </p>
    </>
  );
}
