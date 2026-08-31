"use client";

import * as React from "react";
import { IndiaPointMap, formatIndian, type MapPin, type MapBubble } from "@mosje/design-system";
import { PMAJAY_REACH_DESCRIPTOR, type ReachData, type ReachKey } from "@/lib/website/pmajay-api";
import type { HostelType, ReachSnapshot, StateRow } from "@/lib/website/pmajay-map-reduce";
import { PMAJAY_REACH_AS_ON } from "@/lib/website/pmajay-map-snapshot";
import { useDataMode } from "@/lib/data-mode/context";
import { mergeData, provenanceOf } from "@/lib/data-mode/merge";
import { ProvenanceChip } from "./ProvenanceChip";
import "./pmajay-works.css";

/** How many rail rows show before "Show all". */
const RAIL_LIMIT = 8;

/**
 * Hostel marks: teal, amber and grey.
 *
 * DELIBERATELY NOT PINK-AND-BLUE. A girls'/boys' split is the one place a
 * designer reaches for that pair without thinking, and on a government page it
 * states something about children that the department did not.
 *
 * Colour is a REDUNDANT encoding here, never the only one (WCAG 1.4.1): each
 * type has its own filter chip that isolates it, every pin's tooltip and
 * accessible name says its type in words, and the rail counts them separately.
 * A reader who cannot separate teal from amber loses nothing.
 */
const HOSTEL_KINDS: { kind: HostelType; label: string; color: string }[] = [
  { kind: "girls", label: "Girls", color: "var(--sa-chart-cat-3)" },
  { kind: "boys", label: "Boys", color: "var(--sa-chart-cat-2)" },
  { kind: "unrecorded", label: "Type not recorded", color: "var(--sa-chart-axis)" },
];

const HOSTEL_LABEL: Record<HostelType, string> = {
  girls: "Girls' hostel",
  boys: "Boys' hostel",
  unrecorded: "Hostel, type not recorded",
};

export interface PmajayWorksMapProps {
  data: ReachData;
  /** Live Grants-in-Aid project total, for the third card. `null` when unread. */
  giaTotal: number | null;
}

/**
 * "Where PM-AJAY works" — the scheme on the ground, at three grains.
 *
 * ── WHAT CHANGED, AND WHY IT HAD TO ─────────────────────────────────────────
 *
 * The first two builds of this section drew one circle per state: first shaded
 * (`IndiaMap`), then proportional (`IndiaBubbleMap`). Both took a feed of 19,971
 * COORDINATES and reduced it to 24 numbers before drawing anything, so the only
 * thing the department published coordinates FOR — where the work actually is —
 * was thrown away on the server. The visible consequence was that PM-AJAY looked
 * like a scheme distributed across states, when it is a scheme concentrated in a
 * belt: West Bengal and Bihar alone hold 44% of every Adarsh Gram village.
 *
 * ── TWO COMPONENTS, TWO MARKS, BECAUSE THEY ARE NOT THE SAME KIND OF THING ──
 *
 * 19,348 villages are a DENSITY — too many to tell apart, and the question a
 * reader has is "where is it thickest". They are a hex field.
 *
 * 200 hostels are INDIVIDUALS — few enough to count, and each one is a building
 * a reader might be looking for. They are pins, coloured by type.
 *
 * Drawing both with one mark would flatter neither: the villages would become an
 * unreadable smear of 19,000 dots, or the hostels would vanish into a shade.
 *
 * ── THE THIRD COMPONENT IS ON THE PAGE AND NOT ON THE MAP ───────────────────
 *
 * Grants-in-Aid is a third of PM-AJAY and its project total is live, but this
 * feed publishes no coordinates for it. It gets a card carrying its real figure
 * and saying plainly that its locations are not published. The alternatives were
 * to leave it off — which tells a reader PM-AJAY has two components — or to draw
 * an empty layer, which tells them it has reached nowhere.
 *
 * ── THE COVERAGE LINE IS NOT A FOOTNOTE ─────────────────────────────────────
 *
 * 493 of 19,971 records cannot be placed. 423 carry no usable coordinate at all
 * — absent, zeroed, or outside the country's ranges. The other 70 are the
 * subtler class: coordinates that pass every range check and put a village in
 * the Arabian Sea, caught by `isOnIndianLand` rather than by a bounds test. A
 * further 152 were published with latitude and longitude the wrong way round
 * and are drawn repaired.
 *
 * All of them are COUNTED — the totals are the department's own — and the page
 * says how many are drawn, because a map that silently omits 493 places while
 * printing "19,768 villages" underneath is telling the reader it drew them all.
 */
export function PmajayWorksMap({ data, giaTotal }: PmajayWorksMapProps) {
  const [showVillages, setShowVillages] = React.useState(true);
  const [showHostels, setShowHostels] = React.useState(true);
  const [types, setTypes] = React.useState<Set<HostelType>>(
    () => new Set<HostelType>(["girls", "boys", "unrecorded"]),
  );
  const [focus, setFocus] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [hoverRow, setHoverRow] = React.useState<string | null>(null);
  const { mode, marks } = useDataMode();

  const mockScalars = React.useMemo(() => scalarsOf(data.mock), [data.mock]);
  const merged = React.useMemo(
    () => mergeData(PMAJAY_REACH_DESCRIPTOR, data.reading, mockScalars, mode),
    [data.reading, mockScalars, mode],
  );

  const prov = provenanceOf(merged, [
    "villages",
    "villageStates",
    "villageDistricts",
    "hostels",
    "hostelStates",
    "hostelDistricts",
  ]);

  /*
   * The geography follows the totals' provenance, not the feed's availability.
   * In `mock` mode the feed may well have answered — the reader asked for the
   * mirror, and a live map under mirrored totals would contradict the chip.
   */
  const snapshot: ReachSnapshot = prov === "mock" || data.live == null ? data.mock : data.live;

  /* ── Filtering ─────────────────────────────────────────────────────────── */

  const hostels = React.useMemo(
    () =>
      snapshot.hostels.filter(
        (h) => types.has(h.type) && (focus == null || h.state === focus),
      ),
    [snapshot.hostels, types, focus],
  );

  const bins = React.useMemo(
    () => (focus == null ? snapshot.bins : snapshot.bins.filter((b) => b.group === focus)),
    [snapshot.bins, focus],
  );

  const pins: MapPin[] = React.useMemo(
    () =>
      showHostels
        ? hostels
            .filter((h) => h.placed)
            .map((h) => ({
              id: h.id,
              lon: h.lon,
              lat: h.lat,
              kind: h.type,
              label: `${h.district}, ${h.state}`,
              detail: HOSTEL_LABEL[h.type],
            }))
        : [],
    [hostels, showHostels],
  );

  /** District rings, only when zoomed — see `bubbleVariant="outlined"`. */
  const districtRings: MapBubble[] = React.useMemo(() => {
    if (focus == null || !showVillages) return [];
    return snapshot.districts
      .filter((d) => d.state === focus && d.villages > 0 && (d.lat !== 0 || d.lon !== 0))
      .map((d) => ({
        id: `${d.state}/${d.district}`,
        lon: d.lon,
        lat: d.lat,
        value: d.villages,
        label: d.district,
        detail: "villages",
      }));
  }, [snapshot.districts, focus, showVillages]);

  /* ── The rail ──────────────────────────────────────────────────────────── */

  interface RailRow {
    key: string;
    name: string;
    villages: number;
    hostels: number;
    sub: string;
  }

  const railRows: RailRow[] = React.useMemo(() => {
    const typed = (state: string, district?: string) =>
      snapshot.hostels.filter(
        (h) => h.state === state && (district == null || h.district === district) && types.has(h.type),
      ).length;

    if (focus == null) {
      return snapshot.states.map((s: StateRow) => ({
        key: s.state,
        name: s.state,
        villages: s.villages,
        hostels: typed(s.state),
        sub: `${formatIndian(s.districts)} district${s.districts === 1 ? "" : "s"}`,
      }));
    }
    return snapshot.districts
      .filter((d) => d.state === focus)
      .map((d) => ({
        key: `${d.state}/${d.district}`,
        name: d.district,
        villages: d.villages,
        hostels: typed(d.state, d.district),
        sub: focus,
      }));
  }, [snapshot, focus, types]);

  /** Sort and filter by whichever component the reader has left switched on. */
  const primary = (r: RailRow) => (showVillages ? r.villages : 0) + (showHostels ? r.hostels : 0);

  const visibleRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return railRows
      .filter((r) => primary(r) > 0)
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q))
      .sort((a, b) => primary(b) - primary(a) || a.name.localeCompare(b.name));
    // `primary` closes over the two toggles, which are in the dep list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [railRows, query, showVillages, showHostels]);

  const shown = expanded ? visibleRows : visibleRows.slice(0, RAIL_LIMIT);
  const top = visibleRows[0] ? primary(visibleRows[0]) : 1;

  /* ── Totals for the cards ──────────────────────────────────────────────── */

  const villageTotal = merged.values.villages;
  const hostelTotal = merged.values.hostels;

  /** In a filtered or zoomed view the cards must show what is on screen. */
  const filtered = focus != null || types.size < 3;
  const shownVillages = focus == null ? villageTotal : railRows.reduce((t, r) => t + r.villages, 0);
  const shownHostels = hostels.length;

  const maxBin = bins.length ? Math.max(...bins.map((b) => b.count)) : 0;

  const cov = snapshot.coverage;

  const csvHref = React.useMemo(() => {
    const head = focus == null ? "State,Districts reached" : "District,State";
    const body = [
      `${head},Adarsh Gram villages,Hostels`,
      ...visibleRows.map(
        (r) => `${JSON.stringify(r.name)},${JSON.stringify(r.sub)},${r.villages},${r.hostels}`,
      ),
    ].join("\n");
    return `data:text/csv;charset=utf-8,${encodeURIComponent(body)}`;
  }, [visibleRows, focus]);

  const toggleType = (t: HostelType) =>
    setTypes((prev) => {
      const next = new Set(prev);
      // Never let the last one out: an empty set draws an empty map that looks
      // like "no hostels anywhere" rather than "you filtered them all away".
      if (next.has(t) && next.size > 1) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <>
      <div className="pmw__head">
        <div className="pmw__headline">
          <h2 id="reach-heading" className="pmw__title">
            Where PM-AJAY works
          </h2>
          <p className="pmw__lead">
            Every village declared an Adarsh Gram and every hostel sanctioned under the
            scheme, drawn where the department records it standing. Switch a component
            off, filter the hostels, or open a state to see its districts.
          </p>
        </div>
        <ProvenanceChip kind={prov} />
      </div>

      {marks && prov === "mock" && (
        <p className="dm-banner">
          <b>Illustrative figures.</b>&nbsp;The live map feed is not answering, so this is
          the last published distribution, mirrored on {PMAJAY_REACH_AS_ON}. Nothing here
          is a current departmental figure.
        </p>
      )}

      {/*
        The component cards ARE the layer switches. A separate legend plus a
        separate toggle row would say the same three things twice; putting the
        count, the swatch and the control in one card means the thing a reader
        wants to switch off is the thing they are reading.
      */}
      <div className="pmw__layers">
        <button
          type="button"
          className={`pmw__layer${showVillages ? " pmw__layer--on" : ""}`}
          aria-pressed={showVillages}
          onClick={() => setShowVillages((v) => !v)}
        >
          <span className="pmw__layerswatch pmw__layerswatch--density" aria-hidden />
          <span className="pmw__layername">Adarsh Gram villages</span>
          <span className="pmw__layervalue">{formatIndian(villageTotal)}</span>
          <span className="pmw__layermeta">
            {formatIndian(merged.values.villageStates)} states ·{" "}
            {formatIndian(merged.values.villageDistricts)} districts
          </span>
        </button>

        <button
          type="button"
          className={`pmw__layer${showHostels ? " pmw__layer--on" : ""}`}
          aria-pressed={showHostels}
          onClick={() => setShowHostels((v) => !v)}
        >
          <span className="pmw__layerswatch pmw__layerswatch--pins" aria-hidden />
          <span className="pmw__layername">Hostels</span>
          <span className="pmw__layervalue">{formatIndian(hostelTotal)}</span>
          <span className="pmw__layermeta">
            {formatIndian(merged.values.hostelStates)} states ·{" "}
            {formatIndian(merged.values.hostelDistricts)} districts
          </span>
        </button>

        {/*
          Not a button, because there is nothing to switch. A disabled toggle
          invites a click that will never do anything; a card states the fact.
        */}
        <div className="pmw__layer pmw__layer--absent">
          <span className="pmw__layerswatch pmw__layerswatch--absent" aria-hidden />
          <span className="pmw__layername">Grant-in-Aid</span>
          <span className="pmw__layervalue">{giaTotal == null ? "—" : formatIndian(giaTotal)}</span>
          <span className="pmw__layermeta">Project locations are not published</span>
        </div>
      </div>

      <div className="pmw__toolbar">
        <nav className="pmw__crumbs" aria-label="Map area">
          <button
            type="button"
            className="pmw__crumb"
            onClick={() => {
              setFocus(null);
              setExpanded(false);
            }}
            aria-current={focus == null ? "true" : undefined}
            disabled={focus == null}
          >
            India
          </button>
          {focus != null && (
            <>
              <span className="pmw__crumbsep" aria-hidden>
                ›
              </span>
              <span className="pmw__crumb pmw__crumb--here" aria-current="true">
                {focus}
              </span>
            </>
          )}
        </nav>

        <label className="pmw__search">
          <span className="ds-sr-only">
            Search {focus == null ? "states" : `districts in ${focus}`}
          </span>
          <input
            type="search"
            className="pmw__searchinput"
            placeholder={focus == null ? "Find a state…" : `Find a district in ${focus}…`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExpanded(true);
            }}
          />
        </label>

        {showHostels && (
          <fieldset className="pmw__chips">
            <legend className="ds-sr-only">Hostel type</legend>
            {HOSTEL_KINDS.map((k) => {
              const on = types.has(k.kind);
              const n = snapshot.hostels.filter(
                (h) => h.type === k.kind && (focus == null || h.state === focus),
              ).length;
              return (
                <button
                  key={k.kind}
                  type="button"
                  className={`pmw__chip${on ? " pmw__chip--on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggleType(k.kind)}
                >
                  <span
                    className="pmw__chipdot"
                    style={{ backgroundColor: k.color }}
                    aria-hidden
                  />
                  {k.label}
                  <span className="pmw__chipcount">{formatIndian(n)}</span>
                </button>
              );
            })}
          </fieldset>
        )}
      </div>

      <div className="pmw__panel">
        <div className="pmw__mapcard">
          <IndiaPointMap
            title={
              focus == null
                ? "PM-AJAY across India"
                : `PM-AJAY in ${focus}`
            }
            summary={`${formatIndian(shownVillages)} Adarsh Gram villages and ${formatIndian(
              shownHostels,
            )} hostels${focus == null ? " across India" : ` in ${focus}`}.`}
            bins={showVillages ? bins : undefined}
            binNoun="villages"
            bubbles={districtRings}
            bubbleVariant="outlined"
            maxBubbleRadius={26}
            highlightBubbleId={focus != null ? hoverRow : null}
            pins={pins}
            pinKinds={HOSTEL_KINDS}
            /*
              Individually reachable only once the map is framed on a state.
              Across India there are 195 of them, and 195 tab stops between the
              heading and the ranked list is a barrier, not access — the list is
              how a keyboard reader gets to a state in the first place. Inside
              one state there are at most a few dozen, each a building someone
              might be looking for.
            */
            interactivePins={focus != null}
            focusRegion={focus}
            highlightRegion={focus == null ? hoverRow : null}
            onSelectRegion={(region) => {
              // Only states the scheme has actually reached are worth opening;
              // zooming to an empty state is a dead end the reader has to undo.
              const hit = snapshot.states.find((s) => s.state === region);
              if (!hit) return;
              setFocus(region);
              setQuery("");
              setExpanded(false);
            }}
            legend={
              <div className="pmw__legend">
                {showVillages && maxBin > 0 && (
                  <div className="pmw__legendgroup">
                    <span className="pmw__legendlabel">Villages per locality</span>
                    <span className="pmw__ramp" aria-hidden>
                      {Array.from({ length: 10 }, (_, i) => (
                        <span
                          key={i}
                          className="pmw__rampstep"
                          style={{ backgroundColor: `var(--sa-chart-seq-${SEQ_STEPS[i]})` }}
                        />
                      ))}
                    </span>
                    <span className="pmw__rampends">
                      <span>1</span>
                      <span>{formatIndian(maxBin)}</span>
                    </span>
                  </div>
                )}
                {showHostels && (
                  <div className="pmw__legendgroup">
                    <span className="pmw__legendlabel">Hostels</span>
                    <span className="pmw__keys">
                      {HOSTEL_KINDS.filter((k) => types.has(k.kind)).map((k) => (
                        <span key={k.kind} className="pmw__key">
                          <span
                            className="pmw__keydot"
                            style={{ backgroundColor: k.color }}
                            aria-hidden
                          />
                          {k.label}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            }
            table={{
              columns: [focus == null ? "State" : "District", "Adarsh Gram villages", "Hostels"],
              rows: visibleRows.map((r) => [r.name, r.villages, r.hostels]),
            }}
          />
          <p className="pmw__mapnote">
            {showVillages
              ? "Each cell shades by how many Adarsh Gram villages stand within a few kilometres of it. "
              : ""}
            {showHostels && pins.length > 0 ? "Each dot is one hostel. " : ""}
            {focus == null
              ? "Select a state on the map or in the list to open its districts."
              : "Rings mark districts; hover a row to find one."}
          </p>
        </div>

        <div className="pmw__rail">
          <div className="pmw__railhead">
            <span className="pmw__raileyebrow">{focus == null ? "By state" : "By district"}</span>
            <span className="pmw__railcount">
              {formatIndian(visibleRows.length)}
              {focus == null ? " of 36" : ""}
            </span>
          </div>

          {visibleRows.length === 0 ? (
            <p className="pmw__empty">
              {query
                ? `Nothing matches “${query}”.`
                : "Both components are switched off, so there is nothing to list."}
            </p>
          ) : (
            <ol className="pmw__list">
              {shown.map((r, i) => {
                const clickable = focus == null;
                const Row = clickable ? "button" : "div";
                return (
                  <li key={r.key} className="pmw__row">
                    <Row
                      {...(clickable
                        ? {
                            type: "button" as const,
                            onClick: () => {
                              setFocus(r.name);
                              setQuery("");
                              setExpanded(false);
                            },
                          }
                        : {})}
                      className="pmw__rowinner"
                      onPointerEnter={() => setHoverRow(r.key)}
                      onPointerLeave={() => setHoverRow(null)}
                      onFocus={() => setHoverRow(r.key)}
                      onBlur={() => setHoverRow(null)}
                    >
                      <span className="pmw__rank">{i + 1}</span>
                      <span className="pmw__rowbody">
                        <span className="pmw__state">{r.name}</span>
                        {/* Decorative: the figures beside it carry the same value,
                            so a screen reader would otherwise hear it twice. */}
                        <span className="pmw__track" aria-hidden>
                          <span
                            className="pmw__fill"
                            style={{ width: `${Math.max(2, (primary(r) / top) * 100)}%` }}
                          />
                        </span>
                      </span>
                      <span className="pmw__values">
                        {showVillages && (
                          <span className="pmw__value">
                            {formatIndian(r.villages)}
                            <span className="pmw__valuenote"> villages</span>
                          </span>
                        )}
                        {showHostels && (
                          <span className="pmw__value pmw__value--alt">
                            {formatIndian(r.hostels)}
                            <span className="pmw__valuenote"> hostels</span>
                          </span>
                        )}
                      </span>
                    </Row>
                  </li>
                );
              })}
            </ol>
          )}

          {visibleRows.length > RAIL_LIMIT && (
            <button type="button" className="pmw__more" onClick={() => setExpanded((v) => !v)}>
              {expanded
                ? "Show fewer"
                : `Show all ${formatIndian(visibleRows.length)} ${focus == null ? "states" : "districts"}`}
            </button>
          )}
        </div>
      </div>

      <div className="pmw__foot">
        <div className="pmw__footfacts">
          <p className="pmw__footfact">
            {filtered ? "Showing " : ""}
            {formatIndian(shownVillages)} villages and {formatIndian(shownHostels)} hostels
            {focus == null ? " across India" : ` in ${focus}`}
            {prov === "mock" ? " · illustrative" : ""}
          </p>
          {/*
            The coverage line, not a footnote. See the component's own note: a
            map that omits 423 places while printing the full total underneath
            is telling the reader it drew them all.
          */}
          <p className="pmw__coverage">
            {`${formatIndian(cov.villagesPlaced + cov.hostelsPlaced)} of ${formatIndian(
              cov.villagesTotal + cov.hostelsTotal,
            )} records are drawn. ${formatIndian(
              cov.villagesUnplaceable + cov.hostelsUnplaceable,
            )} carry no usable coordinates and ${formatIndian(
              cov.villagesOffshore + cov.hostelsOffshore,
            )} are published at a point outside India; both are counted here but not placed on the map. ${formatIndian(
              cov.villagesRepaired + cov.hostelsRepaired,
            )} had latitude and longitude reversed and are drawn corrected.`}
          </p>
        </div>
        <a
          className="pmw__footlink"
          href={csvHref}
          download={`pm-ajay-${focus == null ? "by-state" : `${focus.toLowerCase().replace(/\s+/g, "-")}-by-district`}.csv`}
        >
          Download CSV
        </a>
      </div>
    </>
  );
}

/** The ten rungs of the sequential ramp, for the legend strip. */
const SEQ_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** Scalars the data-mode merge resolves, pulled off a snapshot. */
function scalarsOf(s: ReachSnapshot): Record<ReachKey, number> {
  return {
    villages: s.villageTotal,
    villageStates: s.states.filter((x) => x.villages > 0).length,
    villageDistricts: s.districts.filter((x) => x.villages > 0).length,
    hostels: s.hostelTotal,
    hostelStates: s.states.filter((x) => x.hostels > 0).length,
    hostelDistricts: s.districts.filter((x) => x.hostels > 0).length,
  };
}
