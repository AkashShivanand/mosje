"use client";

import * as React from "react";
import {
  Chip,
  cn,
  Icon,
  IndiaPointMap,
  Legend,
  Pagination,
  Search,
  SectionTitle,
  formatIndian,
  type LegendItem,
  type MapPin,
  type MapBubble,
} from "@mosje/design-system";
import { PMAJAY_REACH_DESCRIPTOR, type ReachData, type ReachKey } from "@/lib/website/pmajay-api";
import type { HostelType, ReachSnapshot, StateRow } from "@/lib/website/pmajay-map-reduce";
import { PMAJAY_REACH_AS_ON } from "@/lib/website/pmajay-map-snapshot";
import { useDataMode } from "@/lib/data-mode/context";
import { mergeData, provenanceOf } from "@/lib/data-mode/merge";
import { ProvenanceChip } from "./ProvenanceChip";
import "./pmajay-works.css";

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
  { kind: "unrecorded", label: "Not recorded", color: "var(--sa-chart-axis)" },
];

/** Which column the rail is ordered by. */
type SortKey = "name" | "villages" | "hostels";
/** `null` is the default ranked order — see `toggleSort`. */
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

/**
 * Which way each column sorts on its FIRST click — the way that column is
 * usually wanted. A name is asked for A–Z; a count is asked for highest-first.
 * Declared once so the comparator and the button's spoken name cannot drift.
 */
const FIRST_DIR: Record<SortKey, "asc" | "desc"> = {
  name: "asc",
  villages: "desc",
  hostels: "desc",
};

/**
 * One clickable column heading.
 *
 * Three states, and the third is the one usually left out: ascending,
 * descending, and NOT SORTING BY THIS AT ALL — which is where the list starts
 * and has to be reachable again. The glyph says which: an up or down arrow
 * when this column is the sort, and a faint pair of arrows when it is merely
 * available. A heading with no mark at all would look like plain text, which
 * is what these were.
 */
function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  what,
  numeric = false,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  /** What the column holds, for the spoken name: "Sort by villages…". */
  what: string;
  /** Numeric columns are right-aligned and read "highest/lowest first". */
  numeric?: boolean;
}) {
  const active = sort?.key === sortKey;
  const dir = active ? sort.dir : null;
  const first = FIRST_DIR[sortKey];
  /*
    A NUMBER'S "DESCENDING" AND A NAME'S ARE NOT THE SAME WORD. "Z to A" on a
    column of village counts means nothing, and "highest first" on a column of
    state names means less. One helper, so the two never drift apart — an
    earlier draft of this button announced a name column sorted "A to Z" while
    it was showing Z to A.
  */
  const word = (d: "asc" | "desc") =>
    numeric ? (d === "desc" ? "highest first" : "lowest first") : d === "desc" ? "Z to A" : "A to Z";
  // A button is named for what the NEXT click does — except while it is the
  // active sort, where the reader also needs to hear the state it is in.
  const next =
    dir == null
      ? word(first)
      : dir === first
        ? word(first === "asc" ? "desc" : "asc")
        : "the default order";
  return (
    <button
      type="button"
      className={cn("pmw__colbtn", active && "is-active", numeric && "pmw__colbtn--num")}
      onClick={() => onSort(sortKey)}
      aria-label={
        dir == null
          ? `Sort by ${what}, ${next}`
          : `Sorted by ${what}, ${word(dir)}. Change to ${next}`
      }
    >
      <span>{label}</span>
      <Icon
        name={dir == null ? "unfold_more" : dir === "desc" ? "arrow_downward" : "arrow_upward"}
        size={16}
        className="pmw__colsort"
        aria-hidden
      />
    </button>
  );
}

const HOSTEL_LABEL: Record<HostelType, string> = {
  girls: "Girls' hostel",
  boys: "Boys' hostel",
  unrecorded: "Hostel, type not recorded",
};

export interface PmajayWorksMapProps {
  data: ReachData;
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
 * ── THE SECTION IS ONE INSTRUMENT, NOT SIX SURFACES ────────────────────────
 *
 * It was a heading block, a row of three component cards, a filter bar, a
 * bordered map card, a bordered list card and a footnote — six surfaces, in
 * which the map got 23% of the area and arrived 397px in. Worse, those three
 * cards restated the three components that the "Components" section directly
 * above already introduces, in a different order and a different card style,
 * 200px apart.
 *
 * Now: a key that is also the switch, then one panel holding the map and the
 * ranked list as two regions divided by a hairline, then one footnote. The
 * counts survive in the key, the switches survive in the key, and the
 * duplication is gone because a legend entry cannot be mistaken for a second
 * telling of the components.
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
 * ── THE THIRD COMPONENT IS NOT HERE, AND THE HEADING SAYS SO ────────────────
 *
 * Grants-in-Aid is a third of PM-AJAY and this feed publishes no coordinates
 * for it. It had a greyed-out card, then a sentence in a footnote; both were a
 * section explaining its own absences to a reader who had not asked.
 *
 * The description under the heading names exactly what is drawn — villages
 * declared as Adarsh Gram, hostels sanctioned — so the section is complete on
 * its own terms, and the Components band directly above introduces all three.
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
export function PmajayWorksMap({ data }: PmajayWorksMapProps) {
  const [showVillages, setShowVillages] = React.useState(true);
  const [showHostels, setShowHostels] = React.useState(true);
  const [types, setTypes] = React.useState<Set<HostelType>>(
    () => new Set<HostelType>(["girls", "boys", "unrecorded"]),
  );
  const [focus, setFocus] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortState>(null);
  const [hoverRow, setHoverRow] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const { mode, marks } = useDataMode();

  /**
   * How many rows a page of the list holds.
   *
   * PAGES, NOT A SCROLL REGION. The list scrolled inside the panel, which fixed
   * the page-length jump but bought a nested scroll — and a nested scroll on a
   * phone is a trap: a reader flicking the page downwards lands in the list and
   * moves the list instead. Seven rows fit the panel at every width, so the
   * same control works on a phone and on a desk.
   */
  const PAGE_SIZE = 7;

  /**
   * Any change of WHAT IS BEING LISTED starts at page one.
   *
   * Landing on page 4 of Karnataka's districts because that is where you were
   * in the list of states is the paging equivalent of inheriting a scroll
   * position — the defect this list had before it was paged.
   *
   * Called from the handlers rather than an effect: an effect that syncs state
   * to state renders twice for every one of these, and there is nothing
   * asynchronous here to justify it.
   */
  const resetPaging = () => setPage(1);

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

  /**
   * What the list is ordered by, and what its bar draws.
   *
   * ── THE BAR USED TO ADD VILLAGES TO HOSTELS ─────────────────────────────
   *
   * `villages + hostels` is a sum of two different units, and it showed:
   * Sikkim (0 villages, 5 hostels), Mizoram (0, 3), Kerala (0, 2) and Delhi
   * (1 village, 0 hostels) all drew the SAME bar, under a column headed
   * "Villages". Four rows with nothing in common, drawn identically.
   *
   * The bar now draws exactly one measure — villages while that layer is on,
   * hostels otherwise — and `barOf` is what it reads. `rankOf` may still
   * combine the two, because ORDERING by "how much of this scheme is here"
   * is a legitimate question where DRAWING one bar for it is not.
   */
  const barOf = (r: RailRow) => (showVillages ? r.villages : r.hostels);
  const rankOf = (r: RailRow) => (showVillages ? r.villages : 0) + (showHostels ? r.hostels : 0);

  /*
   * ── SORTING IS THE COLUMN HEADINGS, NOT A CONTROL BESIDE THEM ────────────
   *
   * The rail already names its three columns. A separate "Sort by" select
   * would put a second, competing statement of the same three fields into a
   * 304px column, and a reader would have to look in two places to learn one
   * thing. Clicking a heading is what a column of figures already implies, and
   * it costs no vertical space at all.
   *
   * `null` is the DEFAULT ranked order the list has always opened in, which
   * answers "where is most of this scheme" — a genuinely different question
   * from "which state has the most villages", because the ranking counts both
   * components. So it stays reachable rather than being quietly collapsed into
   * a villages sort that merely looks the same at the top of the list.
   */
  const toggleSort = (key: SortKey) => {
    // The first click sorts the way the column is USUALLY wanted: a name A–Z,
    // a count highest-first. Hard-coding "descending first" for every column
    // opened the state list at Z, which nobody asks for.
    const first = FIRST_DIR[key];
    setSort((current) =>
      current?.key !== key
        ? { key, dir: first }
        : current.dir === first
          ? { key, dir: first === "asc" ? "desc" : "asc" }
          : // A third click returns to the default rather than cycling forever
            // between two — the ranked order is where the list starts and
            // there has to be a way back to it.
            null,
    );
    resetPaging();
  };

  const visibleRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = railRows
      .filter((r) => rankOf(r) > 0)
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q));

    if (sort == null) {
      return rows.sort((a, b) => rankOf(b) - rankOf(a) || a.name.localeCompare(b.name));
    }

    const sign = sort.dir === "asc" ? 1 : -1;
    return rows.sort((a, b) => {
      if (sort.key === "name") return sign * a.name.localeCompare(b.name);
      const av = sort.key === "villages" ? a.villages : a.hostels;
      const bv = sort.key === "villages" ? b.villages : b.hostels;
      // The tie-break is ALWAYS ascending by name. Flipping it with the
      // direction reshuffles the fifteen states that hold one hostel each
      // every time the arrow is clicked, for no reason a reader could name.
      return sign * (av - bv) || a.name.localeCompare(b.name);
    });
    // `rankOf` closes over the two toggles, which are in the dep list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [railRows, query, showVillages, showHostels, sort]);

  /*
   * The bar's 100% is the largest value of THE MEASURE BEING DRAWN, not of the
   * ranking. With villages on that is West Bengal's 5,792; with only hostels on
   * it is Assam's 33. A bar scaled to a maximum it is not drawing is a bar that
   * cannot be read.
   */
  const barMax = Math.max(1, ...visibleRows.map(barOf));

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  // A filter can shrink the set under the page you are on.
  const currentPage = Math.min(page, totalPages);
  const pageRows = visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /* ── Totals ────────────────────────────────────────────────────────────── */

  /*
    The KEY carries the scheme's total, always. The map's accessible SUMMARY
    carries what is on screen after the filters and the zoom. They are
    different numbers on purpose: a legend that changed its figure every time
    you switched a chip would stop being a statement about the scheme.
  */
  const villageTotal = merged.values.villages;
  const hostelTotal = merged.values.hostels;

  const shownVillages = focus == null ? villageTotal : railRows.reduce((t, r) => t + r.villages, 0);
  const shownHostels = hostels.length;

  const maxBin = bins.length ? Math.max(...bins.map((b) => b.count)) : 0;

  /*
   * The two keys, as data. Villages draw a sequential ramp with its ends named
   * — a shade means nothing without them — and hostels draw the three marks the
   * map actually uses, so the key and the map cannot drift apart.
   */
  const legendItems: LegendItem[] = [
    {
      id: "villages",
      label: "Adarsh Gram villages",
      value: formatIndian(villageTotal),
      color: "var(--sa-chart-seq-500)",
      swatch: "ramp",
      colors: SEQ_STEPS.map((step) => `var(--sa-chart-seq-${step})`),
      scale: ["1", maxBin > 0 ? formatIndian(maxBin) : "—"],
      on: showVillages,
    },
    {
      id: "hostels",
      label: "Hostels",
      value: formatIndian(hostelTotal),
      color: HOSTEL_KINDS[0]!.color,
      swatch: "dots",
      colors: HOSTEL_KINDS.map((k) => k.color),
      on: showHostels,
    },
  ];

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

  const toggleType = (t: HostelType) => {
    resetPaging();
    setTypes((prev) => {
      const next = new Set(prev);
      // Never let the last one out: an empty set draws an empty map that looks
      // like "no hostels anywhere" rather than "you filtered them all away".
      if (next.has(t) && next.size > 1) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <>
      {/*
        THE DESIGN SYSTEM'S SECTION HEADING, NOT A HAND-ROLLED ONE.

        This was a `.pmw__head` of my own: an h2 at 26.3px/700 over a 16px lead,
        while all six sibling bands on this page render `SectionTitle` at
        18.6px/600 over a 12px description. `SectionTitle`'s own docstring says
        to use it "instead of hand-rolling a `<div className='flex
        justify-between'>` with its own heading classes, so section headers stay
        identical estate-wide" — which is exactly what had been done here.

        The provenance chip goes in the component's `children`, which is its
        right-aligned actions slot; it does not need a row of its own.
      */}
      <SectionTitle
        as={2}
        headingId="reach-heading"
        title="Scheme Coverage"
        description="Villages declared as Adarsh Gram and hostels sanctioned under the scheme, at the locations recorded in the PM-AJAY Management Information System."
        className="pmw__head"
      >
        <ProvenanceChip kind={prov} />
      </SectionTitle>

      {marks && prov === "mock" && (
        <p className="dm-banner">
          <b>Illustrative figures.</b>&nbsp;The live map feed is not answering, so this is
          the last published distribution, mirrored on {PMAJAY_REACH_AS_ON}. Nothing here
          is a current departmental figure.
        </p>
      )}

      {/*
        ONE PANEL, NOT THREE CARDS ON A TINT.

        The section used to be six stacked surfaces — a heading block, a row of
        three component cards, a filter bar, a bordered map card, a bordered
        list card, and a footnote. The map, which is the only reason the section
        exists, was the fifth thing a reader reached and got 23% of the section's
        area. Everything else was a container.

        The map and the ranked list are two regions of ONE instrument, so they
        are two regions of one panel divided by a hairline, not two cards
        floating side by side. The panel keeps a border because the family this
        page belongs to is contained white surfaces on a tinted band — the fact
        strip above it is one — and going full-bleed here would break the
        container rhythm the estate holds every other section to.
      */}
      <div className="pmw__instrument">
        <div className="pmw__controls">
          {/*
            THE LEGEND IS THE LAYER SWITCH, AND IT CARRIES THE COUNT.

            These were three cards, and the section directly above this one —
            "Components" — already introduces the same three components with
            icons, descriptions and Read more links. Two card rows for one set
            of three things, 200px apart, in different orders, is a reader
            stopping to work out whether they are the same thing.

            A legend entry cannot be mistaken for that. It reads as a key,
            which is what it is; it happens to be clickable, which is what a
            legend on an interactive map should be; and it costs one line
            instead of a 113px card.

            IT IS THE DS `Legend` NOW. It was a pair of hand-rolled buttons,
            because the DS legend was `aria-hidden` decoration whose swatch
            could only be a solid colour — it could not toggle and it could not
            draw a ramp. Both are now properties of the component rather than of
            this page, so the next chart that wants to switch its own series
            does not hand-roll a third version.
          */}
          <Legend
            className="pmw__layers"
            label="Scheme components drawn on the map"
            items={legendItems}
            onToggle={(id) => {
              if (id === "villages") setShowVillages((v) => !v);
              else setShowHostels((v) => !v);
              resetPaging();
            }}
          />

          <div className="pmw__filters">
            {showHostels && (
              <fieldset className="pmw__chips">
                <legend className="ds-sr-only">Hostel type</legend>
                {HOSTEL_KINDS.map((k) => {
                  const on = types.has(k.kind);
                  const n = snapshot.hostels.filter(
                    (h) => h.type === k.kind && (focus == null || h.state === focus),
                  ).length;
                  return (
                    /*
                      THE DS CHIP, NOT A PILL OF MY OWN. This was a hand-rolled
                      `<button className="pmw__chip">` beside a `Chip` component
                      that already does exactly this — controlled selection,
                      `role="button"`, `aria-pressed`, Enter and Space.

                      The dot stays FILLED in both states now. It used to hollow
                      out when the chip was off, on the reasoning that selection
                      must not be carried by colour alone — but the chip's own
                      selected treatment (tint, border, `aria-pressed`) carries
                      that, and the dot is the KEY, not the state. A key that
                      changes with selection is a key that stops matching the
                      map.
                    */
                    <Chip
                      key={k.kind}
                      selected={on}
                      onSelectedChange={() => toggleType(k.kind)}
                      leadingIcon={
                        <span className="pmw__chipdot" style={{ backgroundColor: k.color }} />
                      }
                      size="sm"
                      count={formatIndian(n)}
                      countLabel="hostels"
                      className="pmw__chip"
                    >
                      {k.label}
                    </Chip>
                  );
                })}
              </fieldset>
            )}
          </div>

        </div>

        <div className="pmw__panel">
          <div className="pmw__map">
            <IndiaPointMap
              title={focus == null ? "PM-AJAY across India" : `PM-AJAY in ${focus}`}
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
              /*
                Searching filtered the list and left the map showing everything,
                so a reader who typed "Bihar" saw one row and twenty-eight
                states. When the query narrows to a single state the map now
                outlines it — the smallest honest thing the map can do about a
                filter that is not its own.
              */
              highlightRegion={
                focus == null
                  ? (query.trim() && visibleRows.length === 1 ? visibleRows[0]!.name : hoverRow)
                  : null
              }
              onSelectRegion={(region) => {
                // Only states the scheme has actually reached are worth opening;
                // zooming to an empty state is a dead end the reader has to undo.
                const hit = snapshot.states.find((s) => s.state === region);
                if (!hit) return;
                setFocus(region);
                setQuery("");
                resetPaging();
              }}
              /*
                NO LEGEND PROP, AND NO CAPTION UNDER THE MAP. Both moved into the
                controls above, where the key is also the control. What sat here
                was three lines of 12px instructions — "Each cell shades by…
                Each dot is… Select a state on the map or in the list to…" — and
                a map that needs instructions has a legend problem, not an
                instructions problem.
              */
              table={{
                columns: [focus == null ? "State" : "District", "Adarsh Gram villages", "Hostels"],
                rows: visibleRows.map((r) => [r.name, r.villages, r.hostels]),
              }}
            />
          </div>

          <div className="pmw__rail">
            {/*
              THE BREADCRUMB AND THE SEARCH BELONG TO THE LIST, NOT THE MAP.

              They sat in the map's control bar, where they pushed it to two
              rows and left the second one holding "India  [Find a state…]"
              alone against the right edge, reading as an orphan rather than a
              group. They are also simply in the wrong place: the search filters
              THIS list, and the breadcrumb names the grain THIS list is at.

              What is left in the control bar is only the key, which is what a
              map's own chrome should be.
            */}
            {/*
              THE COUNT SITS WITH THE BREADCRUMB, NOT WITH THE SEARCH.

              All three used to share one row, which left the field 218px of a
              304px rail — a search box narrower than the placeholder it holds,
              beside two things that are both short. The breadcrumb and the
              count are each a few words and belong on a line together; the
              field is the one thing here that gets longer as you type, so it
              takes the full width on its own line.
            */}
            <div className="pmw__railhead">
                <nav className="pmw__crumbs" aria-label="Map area">
                  <button
                    type="button"
                    className="pmw__crumb"
                    onClick={() => {
                      setFocus(null);
                      resetPaging();
                    }}
                    aria-current={focus == null ? "true" : undefined}
                    disabled={focus == null}
                  >
                    India
                  </button>
                  {focus != null && (
                    <>
                      <Icon name="chevron_right" size={16} className="pmw__crumbsep" aria-hidden />
                      <span className="pmw__crumb pmw__crumb--here" aria-current="true">
                        {focus}
                      </span>
                    </>
                  )}
                </nav>

              {/*
                "28 of 36" means 28 of the country's 36 States and UTs have
                been reached. While a search is narrowing the list that reading
                is false — three matching rows are not "3 of 36 reached" — so
                the phrasing changes with the state it describes.
              */}
              <span className="pmw__railcount">
                {query.trim()
                  ? `${formatIndian(visibleRows.length)} matching`
                  : focus == null
                    ? `${formatIndian(visibleRows.length)} of 36`
                    : `${formatIndian(visibleRows.length)} districts`}
              </span>
            </div>

                {/*
                  The DS `Search`, not an `Input` wearing a magnifier. Both
                  render a field with a leading glyph, and the difference is
                  everything that is easy to leave out by hand: a real
                  `type="search"`, a clear button once there is something to
                  clear, and `dir="auto"` so an English placeholder does not
                  clip from its HEAD when the estate is running in Urdu.

                  `sm` — 40px — because this field sits inside a card, not at
                  the head of a page.
                */}
                <Search
                  size="sm"
                  className="pmw__search"
                  aria-label={`Search ${focus == null ? "states" : `districts in ${focus}`}`}
                  placeholder={focus == null ? "Find a state…" : `Find a district in ${focus}…`}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    resetPaging();
                  }}
                  onClear={() => {
                    setQuery("");
                    resetPaging();
                  }}
                />

            {/*
              COLUMN HEADINGS, so the figures can be bare.
              Every row used to carry its own " villages" and " hostels" on two
              stacked lines. Twenty-eight rows repeating two words each, and the
              state name squeezed into 83px as a result — "Uttar Pradesh" and
              "Andhra Pradesh" were rendering ellipsised on a government page.
              Naming the columns once buys the names their width back.
            */}
            {/*
              THE HEADINGS ARE THE SORT CONTROL.

              They were `aria-hidden` decoration; they are buttons now, which
              is what a column of figures has always implied. Each carries its
              own spoken name — "Sort by villages, highest first" — because
              "Villages" plus an arrow glyph is not a sentence, and the arrow
              is `aria-hidden` for the same reason.

              NOT `aria-sort`: this is a list of rows, not a `<table>`, and
              claiming grid semantics for a flex column tells a screen-reader
              user to expect a navigation model that is not here. The button
              names carry the state instead.
            */}
            {visibleRows.length > 0 && (showVillages || showHostels) && (
              <div className="pmw__railcols">
                <SortHeader
                  label={focus == null ? "By state" : "By district"}
                  sortKey="name"
                  sort={sort}
                  onSort={toggleSort}
                  what={focus == null ? "state name" : "district name"}
                />
                {showVillages && (
                  <SortHeader
                    label="Villages"
                    sortKey="villages"
                    sort={sort}
                    onSort={toggleSort}
                    what="villages"
                    numeric
                  />
                )}
                {showHostels && (
                  <SortHeader
                    label="Hostels"
                    sortKey="hostels"
                    sort={sort}
                    onSort={toggleSort}
                    what="hostels"
                    numeric
                  />
                )}
              </div>
            )}

            {visibleRows.length === 0 ? (
              <p className="pmw__empty">
                {query
                  ? `Nothing matches “${query}”.`
                  : "Both components are switched off, so there is nothing to list."}
              </p>
            ) : (
              <ol className="pmw__list">
                {pageRows.map((r) => {
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
                                resetPaging();
                              },
                            }
                          : {})}
                        className="pmw__rowinner"
                        onPointerEnter={() => setHoverRow(r.key)}
                        onPointerLeave={() => setHoverRow(null)}
                        onFocus={() => setHoverRow(r.key)}
                        onBlur={() => setHoverRow(null)}
                      >
                        <span className="pmw__rowbody">
                          <span className="pmw__state">{r.name}</span>
                          {/* Decorative: the figures beside it carry the same value,
                              so a screen reader would otherwise hear it twice. */}
                          <span className="pmw__track" aria-hidden>
                            <span
                              className="pmw__fill"
                              style={{
                                /*
                                  A ZERO DRAWS NOTHING. The 2% floor exists so
                                  Delhi's single village is still a visible
                                  mark, but applied to zero it drew Sikkim a
                                  bar for the 0 villages it has — the floor
                                  inventing a quantity, in the row of a state
                                  the scheme has reached only with hostels.
                                */
                                width:
                                  barOf(r) === 0
                                    ? 0
                                    : `${Math.max(2, (barOf(r) / barMax) * 100)}%`,
                              }}
                            />
                          </span>
                        </span>
                        {showVillages && (
                          <span className="pmw__value">
                            {formatIndian(r.villages)}
                            <span className="ds-sr-only"> villages</span>
                          </span>
                        )}
                        {showHostels && (
                          <span className="pmw__value pmw__value--alt">
                            {formatIndian(r.hostels)}
                            <span className="ds-sr-only"> hostels</span>
                          </span>
                        )}
                        {/*
                          A row that opens a state has to LOOK like one. These
                          were buttons that rendered as list items, so the only
                          hint was the cursor — which touch users never see.
                          Absolutely positioned in the row's own right padding,
                          so it costs the state name no width.

                          A Material Symbol, not a typed "›". The estate's icons
                          come from `<Icon>` so they share one family, one weight
                          and one optical-size axis; a punctuation character
                          borrows whatever the body font happens to draw.
                        */}
                        {clickable && (
                          <Icon name="chevron_right" size={16} className="pmw__go" aria-hidden />
                        )}
                      </Row>
                    </li>
                  );
                })}
              </ol>
            )}

            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                size="sm"
                siblings={0}
                label={focus == null ? "States" : "Districts"}
                className="pmw__pager"
              />
            )}
          </div>
        </div>
      </div>

      {/*
        ONE LINK, NOT A PARAGRAPH OF DIAGNOSTICS.

        What stood here recited the feed's data quality — how many records were
        drawn, how many carried no coordinates, how many were published outside
        India, how many had latitude and longitude reversed. Every number was
        true and none of it belonged on a citizen's page: it read as the
        documentation of an API rather than a caption, and a caption that needs
        four clauses is telling you the thing above it has not been made clear.

        The figures are not lost — they are in `docs/audit/pm-ajay-content-audit.md`,
        where the people who can act on them will look.
      */}
      <div className="pmw__foot">
        {/*
          THE SCHEME'S SPREAD, WHICH THE KEYS DO NOT CARRY.

          Borrowed from LokOS (lokos.dord.gov.in), whose dashboard puts a second
          row of administrative reach — States, Districts, Blocks, Panchayats,
          Villages — under its headline counts. The idea is right and this
          section had lost it: the totals moved into the legend keys two passes
          ago and the geographic spread went with them.

          It says what the keys do not, so it repeats nothing, and it passes the
          test in `ui-restraint-and-copy.md` — a department would print this
          sentence on a poster about the scheme. "423 records have no usable
          coordinates" would not, which is why that one is in the audit doc.
        */}
        <p className="pmw__reach">
          {`Reaching ${formatIndian(snapshot.districtCount)} districts in ${formatIndian(
            snapshot.states.length,
          )} States and Union Territories.`}
        </p>
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
