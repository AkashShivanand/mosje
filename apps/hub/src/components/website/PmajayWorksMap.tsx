"use client";

import * as React from "react";
import { IndiaBubbleMap, formatIndian } from "@mosje/design-system";
import {
  PMAJAY_REACH_DESCRIPTOR,
  type ReachData,
  type ReachKey,
} from "@/lib/website/pmajay-api";
import { PMAJAY_REACH_AS_ON, type ReachDataset } from "@/lib/website/pmajay-map-snapshot";
import { useDataMode } from "@/lib/data-mode/context";
import { mergeData, provenanceOf } from "@/lib/data-mode/merge";
import { ProvenanceChip } from "./ProvenanceChip";
import "./pmajay-works.css";

type Layer = "villages" | "hostels";

/** How many states the rail shows before "Show all". */
const RAIL_LIMIT = 8;

interface LayerSpec {
  value: Layer;
  label: string;
  lead: string;
  noun: string;
  totalKey: ReachKey;
  stateKey: ReachKey;
  districtKey: ReachKey;
}

/*
 * The two components this feed carries locations for.
 *
 * The leads are the department's own descriptions of each component, trimmed to
 * one sentence — not written here. A map's standfirst is the one place a reader
 * decides what the circles MEAN, so it has to be the scheme's language.
 */
const LAYERS: LayerSpec[] = [
  {
    value: "villages",
    label: "Adarsh Gram",
    lead: "Villages with a substantial Scheduled Caste population, developed to a defined standard and then formally declared.",
    noun: "villages",
    totalKey: "villages",
    stateKey: "villageStates",
    districtKey: "villageDistricts",
  },
  {
    value: "hostels",
    label: "Hostels",
    lead: "Hostels built or repaired so Scheduled Caste students can stay on through secondary and higher education.",
    noun: "hostels",
    totalKey: "hostels",
    stateKey: "hostelStates",
    districtKey: "hostelDistricts",
  },
];

export interface PmajayWorksMapProps {
  data: ReachData;
  /** Live Grants-in-Aid project total, for the third tab. `null` when unread. */
  giaTotal: number | null;
}

/**
 * "Where PM-AJAY works" — the scheme's reach, on a map of India.
 *
 * Built to the standalone design mockup agreed in the Bharat-map session:
 * layer tabs carrying their own counts, a proportional-circle map, and a ranked
 * state rail beside it.
 *
 * ── CIRCLES, NOT SHADING, AND THAT IS THE WHOLE POINT OF THE REDESIGN ────────
 *
 * The first build of this section used `IndiaMap`, which shades each state. For
 * a COUNT that is a systematic lie: the ink a state receives is its land area,
 * so Rajasthan's 1,493 villages and Delhi's 1 were separated far less than
 * Rajasthan and Delhi were. A circle carries its own area — `r ∝ √v`, so a 4×
 * count draws 4× the ink and not 16× — and geography stops competing with the
 * data. `IndiaBubbleMap` in the design system holds that reasoning in full.
 *
 * ── THE RAIL IS NOT A CHART ──────────────────────────────────────────────────
 *
 * It was a horizontal `BarChart`, which had to be stacked below the map because
 * a scaled SVG shrinks rather than reflows — at this page's width its labels
 * rendered at 5.9px. Rows of real text reflow, so the rail sits BESIDE the map
 * where the mockup puts it, and reads at full size at every width.
 *
 * ── THREE TABS, TWO MAPS ─────────────────────────────────────────────────────
 *
 * Grants-in-Aid is on the tab strip because it is a third of the scheme and its
 * total is live — but it is not selectable, because this feed publishes no
 * coordinates for it. The alternative was to leave it off the strip entirely,
 * which tells a reader PM-AJAY has two components, or to draw it as an empty
 * map, which tells them it has reached nowhere. A named, disabled tab carrying
 * its real figure says the true thing: the projects exist, their locations are
 * not published.
 */
export function PmajayWorksMap({ data, giaTotal }: PmajayWorksMapProps) {
  const [layer, setLayer] = React.useState<Layer>("villages");
  const [expanded, setExpanded] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);
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

  const spec = LAYERS.find((l) => l.value === layer)!;
  const prov = provenanceOf(merged, [spec.totalKey, spec.stateKey, spec.districtKey]);

  /*
   * The rows follow the total's provenance, not the feed's availability. In
   * `mock` mode the feed may well have answered — the reader asked for the
   * mirror, and a live map under mirrored totals would contradict the chip.
   */
  const dataset: ReachDataset =
    prov === "mock" || data.live == null ? data.mock[layer] : data.live[layer];

  const rows = dataset.rows;
  const shown = expanded ? rows : rows.slice(0, RAIL_LIMIT);
  const top = rows[0]?.value ?? 1;

  const total = merged.values[spec.totalKey];
  const states = merged.values[spec.stateKey];
  const districts = merged.values[spec.districtKey];

  /** Counts on the tab strip come from the merge, so they move with the mode. */
  const tabCount = (l: LayerSpec) => merged.values[l.totalKey];

  const csvHref = React.useMemo(() => {
    const body = ["State,Count", ...rows.map((r) => `${JSON.stringify(r.state)},${r.value}`)].join(
      "\n",
    );
    return `data:text/csv;charset=utf-8,${encodeURIComponent(body)}`;
  }, [rows]);

  return (
    <>
      <div className="pmw__head">
        <div className="pmw__headline">
          <h2 id="reach-heading" className="pmw__title">
            Where PM-AJAY works
          </h2>
          <p className="pmw__lead">{spec.lead}</p>
        </div>
        <ProvenanceChip kind={prov} />
      </div>

      {/*
        A TAB STRIP, NOT A RADIOGROUP. These switch the panel below rather than
        record a choice, which is the tabs pattern — and `SegmentedControl`
        renders an ARIA radiogroup, so using it here would have announced a form
        control that submits nothing. The counts sit inside the tab because the
        mockup puts them there and they are the reason a reader picks one.
      */}
      <div className="pmw__tabs" role="tablist" aria-label="Scheme component">
        {LAYERS.map((l) => (
          <button
            key={l.value}
            type="button"
            role="tab"
            id={`pmw-tab-${l.value}`}
            aria-selected={layer === l.value}
            aria-controls="pmw-panel"
            className={`pmw__tab${layer === l.value ? " pmw__tab--on" : ""}`}
            onClick={() => {
              setLayer(l.value);
              setExpanded(false);
            }}
          >
            <span className="pmw__dot" aria-hidden />
            {l.label}
            <span className="pmw__tab-count">{formatIndian(tabCount(l))}</span>
          </button>
        ))}
        <button
          type="button"
          role="tab"
          aria-selected={false}
          disabled
          className="pmw__tab pmw__tab--off"
          title="The department publishes project counts for Grants-in-Aid, but no locations, so it cannot be drawn on a map."
        >
          <span className="pmw__dot" aria-hidden />
          Grant-in-Aid
          <span className="pmw__tab-count">
            {giaTotal == null ? "—" : formatIndian(giaTotal)}
          </span>
        </button>
      </div>

      {marks && prov === "mock" && (
        <p className="dm-banner">
          <b>Illustrative figures.</b>&nbsp;The live map feed is not answering, so
          this is the last published distribution, mirrored on {PMAJAY_REACH_AS_ON}.
          Nothing here is a current departmental figure.
        </p>
      )}

      <div className="pmw__panel" id="pmw-panel" role="tabpanel" aria-labelledby={`pmw-tab-${layer}`}>
        <div className="pmw__mapcard">
          <IndiaBubbleMap
            data={rows}
            title={`${spec.label} by state`}
            highlightState={hovered ?? undefined}
          />
          {/* The space after the expression is explicit. JSX drops whitespace
              that sits between an expression and a line break, and this line
              rendered "villageson the department's books" without it. */}
          <p className="pmw__mapnote">
            {`One circle per state, area scaled to ${spec.noun} on the department’s books.`}
          </p>
        </div>

        <div className="pmw__rail">
          <div className="pmw__railhead">
            <span className="pmw__raileyebrow">By state</span>
            <span className="pmw__railcount">
              {formatIndian(states)} of 36
            </span>
          </div>
          <ol className="pmw__list">
            {shown.map((r, i) => (
              <li
                key={r.state}
                className="pmw__row"
                onPointerEnter={() => setHovered(r.state)}
                onPointerLeave={() => setHovered(null)}
              >
                <span className="pmw__rank">{i + 1}</span>
                <span className="pmw__rowbody">
                  <span className="pmw__state">{r.state}</span>
                  {/* Decorative: the figure beside it carries the same value, so
                      a screen reader would otherwise hear it twice. */}
                  <span className="pmw__track" aria-hidden>
                    <span
                      className="pmw__fill"
                      style={{ width: `${Math.max(2, (r.value / top) * 100)}%` }}
                    />
                  </span>
                </span>
                <span className="pmw__value">{formatIndian(r.value)}</span>
              </li>
            ))}
          </ol>
          {rows.length > RAIL_LIMIT && (
            <button
              type="button"
              className="pmw__more"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show fewer states" : `Show all ${formatIndian(rows.length)} states`}
            </button>
          )}
        </div>
      </div>

      <div className="pmw__foot">
        <p className="pmw__footfact">
          {formatIndian(total)} {spec.noun} across {formatIndian(states)} states and{" "}
          {formatIndian(districts)} districts
          {prov === "mock" ? " · illustrative" : ""}
        </p>
        <a
          className="pmw__footlink"
          href={csvHref}
          download={`pm-ajay-${layer}-by-state.csv`}
        >
          Download CSV
        </a>
      </div>
    </>
  );
}
