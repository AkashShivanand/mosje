"use client";

import * as React from "react";
import {
  Button,
  Chip,
  Icon,
  IndiaPointMap,
  Pagination,
  Search,
  Select,
  type MapPin,
  type PinKindStyle,
} from "@mosje/design-system";
import {
  CENTRE_TYPE_META,
  CENTRE_TYPE_ORDER,
  HELPLINE,
  isPlottable,
  type CentreType,
  type DeAddictionCentre,
} from "@/content/website/deaddiction-centres";
/* Pure data utilities from the classic tree (fetch + intent gate); no classic visual component. */
import { districtsOf, statesOf, useCentres, useNearViewport } from "@/lib/website/deaddiction-centres";
import "./centre-locator.css";

/*
 * THE DE-ADDICTION CENTRE LOCATOR OF THE REDESIGN.
 *
 * ── WHY THERE IS NO BASEMAP ─────────────────────────────────────────────────
 *
 * The classic locator drew Leaflet over OpenStreetMap tiles. Those tiles draw
 * India's international boundaries as OpenStreetMap depicts them and label the
 * neighbouring countries in their own scripts. On a Government of India page the
 * external boundary must be shown as the Survey of India shows it, and a
 * third-party basemap gives the Department no control over that.
 *
 * Two options were weighed:
 *   (a) ISRO Bhuvan WMS tiles — the Government's own basemap, but a live
 *       third-party dependency on every visit, with its own availability and
 *       rendering, and still a raster of the whole region around India.
 *   (b) No basemap: the centres drawn over the design system's own India
 *       outline (`IndiaPointMap`), which is what this component does.
 *
 * (b) was chosen. The outline draws India alone — no neighbouring country, no
 * foreign label, no network request — and it is the same outline every other
 * map on the estate uses. Checked before choosing it (2026-09-22): the DS
 * geometry (`packages/design-system/components/data-display/charts/geo/`)
 * places Ladakh's extent at 72.5–80.3°E, 32.3–37.1°N, i.e. it includes
 * Gilgit-Baltistan and Aksai Chin, and Jammu and Kashmir includes the area
 * west to 73.4°E; Arunachal Pradesh runs to 29.5°N. That matches the external
 * boundary of the Survey of India political map. The source TopoJSON's
 * certification is not recorded in the repository, so that claim is a check
 * against the published map, not a certificate — see the audit note.
 *
 * What the map loses against a street map is street-level context. The list
 * carries every address, and each centre has a "Get Directions" link.
 *
 * ── WHAT IS NOT ON THE SCREEN, AND WHY ──────────────────────────────────────
 *
 * The classic printed "482 centres plotted, of 487 geo-tagged and 768
 * published nationwide". That is a statement about the feed, not about the
 * scheme (`ui-restraint-and-copy.md` §1). The facts, for the audit trail: the
 * mirrored register (`public/website/data/deaddiction-centres.json`) holds 487
 * geo-tagged centres of the 768 the Abhiyaan publishes; 8 carry coordinates
 * outside India and 3 of those are transposed pairs that `normaliseGeo`
 * repairs, so 482 are drawn. Every one of the 487 is in the LIST.
 *
 * ── STATES ──────────────────────────────────────────────────────────────────
 *
 * idle / loading → skeleton list + the map's own loading state, role="status".
 * error          → one sentence, a retry, the helpline.
 * no-results     → names the filters and offers "Clear Filters".
 * too much       → the list is PAGED (10 a page); never a scrolling box.
 * There is no separate empty-register branch: the register is a committed
 * mirror, and `useCentres` rejects an empty parse as an error.
 */

const PAGE_SIZE = 10;
const fmt = new Intl.NumberFormat("en-IN");

/** Pins stop being individual keyboard stops once there are too many to be worth landing on. */
const INDIVIDUAL_PIN_LIMIT = 40;

const centreKey = (c: DeAddictionCentre) => `${c.name}|${c.lat}|${c.lng}|${c.district}`;

function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

interface Filters {
  q: string;
  state: string;
  district: string;
  type: CentreType | "";
  page: number;
}

const NO_FILTERS: Filters = { q: "", state: "", district: "", type: "", page: 1 };

/** Filter state lives in the URL (DESIGN-SPEC "Filters"), read once after hydration. */
function readUrl(): Filters {
  const p = new URLSearchParams(window.location.search);
  const type = p.get("type") ?? "";
  return {
    q: p.get("q") ?? "",
    state: p.get("state") ?? "",
    district: p.get("district") ?? "",
    type: (CENTRE_TYPE_ORDER as string[]).includes(type) ? (type as CentreType) : "",
    page: Math.max(1, Number(p.get("page")) || 1),
  };
}

function writeUrl(f: Filters) {
  const url = new URL(window.location.href);
  const set = (k: string, v: string) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
  set("q", f.q);
  set("state", f.state);
  set("district", f.district);
  set("type", f.type);
  set("page", f.page > 1 ? String(f.page) : "");
  window.history.replaceState(window.history.state, "", url);
}

export interface CentreLocatorProps {
  /** Heading level of each centre's name: 3 under a page's h2, 2 where the locator is the page. */
  headingLevel?: 2 | 3;
}

export function CentreLocator({ headingLevel = 3 }: CentreLocatorProps) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const [f, setF] = React.useState<Filters>(NO_FILTERS);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [userLoc, setUserLoc] = React.useState<[number, number] | null>(null);
  const [locating, setLocating] = React.useState(false);
  const [locError, setLocError] = React.useState("");
  const listTop = React.useRef<HTMLDivElement>(null);

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const near = useNearViewport(sectionRef);
  const { status, centres, retry } = useCentres(near);
  const ready = status === "ready";

  /* URL → state once, after hydration (deferred: no synchronous setState in an effect). */
  React.useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => {
      if (alive) setF(readUrl());
    });
    return () => {
      alive = false;
    };
  }, []);

  const update = (patch: Partial<Filters>) => {
    setF((prev) => {
      const next = { ...prev, ...patch, page: patch.page ?? 1 };
      writeUrl(next);
      return next;
    });
  };

  /* Every derivation runs against `centres` ([] until the register arrives); only the RENDER branches. */
  const states = React.useMemo(() => statesOf(centres), [centres]);
  const districts = React.useMemo(() => (f.state ? districtsOf(centres, f.state) : []), [centres, f.state]);

  /** Everything except the type filter — so each type chip can say how many it would show. */
  const placeMatches = React.useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return centres.filter((c) => {
      if (f.state && c.state !== f.state) return false;
      if (f.district && c.district !== f.district) return false;
      if (q && !`${c.name} ${c.address} ${c.district} ${c.state} ${c.type}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [centres, f.q, f.state, f.district]);

  const filtered = React.useMemo(() => {
    const rows = f.type ? placeMatches.filter((c) => c.type === f.type) : placeMatches;
    const withD = rows.map((c) => ({ c, d: userLoc && isPlottable(c) ? distanceKm(userLoc, [c.lat, c.lng]) : undefined }));
    if (userLoc) withD.sort((a, b) => (a.d ?? Infinity) - (b.d ?? Infinity));
    return withD;
  }, [placeMatches, f.type, userLoc]);

  const typeCounts = React.useMemo(() => {
    const m = new Map<CentreType, number>();
    for (const c of placeMatches) m.set(c.type, (m.get(c.type) ?? 0) + 1);
    return m;
  }, [placeMatches]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(f.page, totalPages);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pins: MapPin[] = React.useMemo(() => {
    const out = filtered
      .filter(({ c }) => isPlottable(c))
      .map(({ c }) => {
        const key = centreKey(c);
        return {
          id: key,
          lon: c.lng,
          lat: c.lat,
          label: c.name,
          kind: key === selected ? "selected" : c.type,
          detail: `${CENTRE_TYPE_META[c.type].label}, ${c.district}, ${c.state}`,
        };
      });
    // The selected centre paints last, so it sits on top of its neighbours.
    return out.sort((a, b) => Number(a.kind === "selected") - Number(b.kind === "selected"));
  }, [filtered, selected]);

  const pinKinds: PinKindStyle[] = React.useMemo(
    () => [
      ...CENTRE_TYPE_ORDER.map((t) => ({ kind: t, label: CENTRE_TYPE_META[t].label, color: CENTRE_TYPE_META[t].color })),
      { kind: "selected", label: "Selected centre", color: "var(--sa-text-neutral-bolder)" },
    ],
    [],
  );

  const stateTable = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const { c } of filtered) m.set(c.state, (m.get(c.state) ?? 0) + 1);
    return {
      columns: ["State", "Centres"],
      rows: [...m].sort((a, b) => a[0].localeCompare(b[0])).map(([s, n]) => [s, n] as (string | number)[]),
    };
  }, [filtered]);

  const activeFilters = [
    f.q && `“${f.q.trim()}”`,
    f.district || f.state,
    f.type && CENTRE_TYPE_META[f.type].label,
  ].filter(Boolean) as string[];
  const hasFilters = activeFilters.length > 0;

  const clearAll = () => {
    update({ ...NO_FILTERS });
    setSelected(null);
    setUserLoc(null);
  };

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setLocError("Location is not available on this device. Search by state or district instead.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
        update({ page: 1 });
      },
      () => {
        setLocError("Your location could not be found. Allow location access, or search by state or district.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const goToPage = (p: number) => {
    update({ page: p });
    listTop.current?.focus({ preventScroll: false });
  };

  const mapState = !ready ? (status === "error" ? "error" : "loading") : filtered.length === 0 ? "no-results" : undefined;

  return (
    <div ref={sectionRef} className="cl">
      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="cl-toolbar" role="search" aria-label="Find a de-addiction centre" data-sa-rail-clear="">
        <div className="cl-toolbar__row">
          <div className="cl-toolbar__search">
            <Search
              value={f.q}
              onChange={(e) => update({ q: e.target.value })}
              onClear={() => update({ q: "" })}
              disabled={!ready}
              placeholder="Search by centre name, area, district or state"
              aria-label="Search de-addiction centres"
            />
          </div>
          <Select
            value={f.state}
            onChange={(e) => update({ state: e.target.value, district: "" })}
            disabled={!ready}
            aria-label="Filter by state"
            className="cl-toolbar__select"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select
            value={f.district}
            onChange={(e) => update({ district: e.target.value })}
            disabled={!ready || !f.state}
            aria-label="Filter by district"
            className="cl-toolbar__select"
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          <Button
            variant="primary"
            appearance="outlined"
            onClick={locate}
            disabled={!ready || locating}
            iconLeft={<Icon name={locating ? "progress_activity" : "my_location"} size={20} aria-hidden />}
          >
            {locating ? "Locating" : "Use My Location"}
          </Button>
        </div>
        <div className="cl-toolbar__types" role="group" aria-label="Filter by type of centre">
          {CENTRE_TYPE_ORDER.map((t) => (
            <Chip
              key={t}
              size="sm"
              tone="neutral"
              selected={f.type === t}
              disabled={!ready}
              onSelectedChange={(on) => update({ type: on ? t : "" })}
              leadingIcon={<span className="cl-dot" style={{ backgroundColor: CENTRE_TYPE_META[t].color }} aria-hidden />}
              count={ready ? fmt.format(typeCounts.get(t) ?? 0) : undefined}
              countLabel="centres"
              title={CENTRE_TYPE_META[t].label}
            >
              {t}
            </Chip>
          ))}
        </div>
        {locError && <p className="cl-toolbar__error">{locError}</p>}
      </div>

      {/* ── List + map ──────────────────────────────────────────────────── */}
      <div className="cl-body">
        <div className="cl-list">
          <div className="cl-list__head" ref={listTop} tabIndex={-1}>
            <p className="cl-list__count" role="status" aria-live="polite">
              {ready
                ? filtered.length === 0
                  ? "No centres found"
                  : `${fmt.format(filtered.length)} ${filtered.length === 1 ? "centre" : "centres"}${userLoc ? ", nearest first" : ""}`
                : status === "error"
                  ? ""
                  : "Loading centres"}
            </p>
            {ready && (hasFilters || userLoc) && (
              <button type="button" className="cl-link" onClick={clearAll}>
                <Icon name="close" size={16} aria-hidden />
                Clear Filters
              </button>
            )}
          </div>

          {!ready && status === "error" ? (
            <div className="cl-state">
              <p>The list of de-addiction centres could not be loaded.</p>
              <Button variant="primary" onClick={retry} iconLeft={<Icon name="refresh" size={20} aria-hidden />}>
                Try Again
              </Button>
            </div>
          ) : !ready ? (
            <ul className="cl-items" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="cl-item cl-item--skeleton">
                  <span className="cl-skel cl-skel--title" />
                  <span className="cl-skel cl-skel--short" />
                  <span className="cl-skel" />
                </li>
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            <div className="cl-state">
              <p>No centre matches {activeFilters.join(", ")}.</p>
              <Button variant="primary" appearance="outlined" onClick={clearAll}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <ul className="cl-items">
                {shown.map(({ c, d }, i) => {
                  const key = centreKey(c);
                  const meta = CENTRE_TYPE_META[c.type];
                  const isSel = key === selected;
                  return (
                    <li key={`${key}#${i}`} className={`cl-item${isSel ? " cl-item--selected" : ""}`}>
                      <H className="cl-item__name">{c.name}</H>
                      <p className="cl-item__type">
                        <span className="cl-dot" style={{ backgroundColor: meta.color }} aria-hidden />
                        {meta.label} ({c.type})
                        {d !== undefined && <span className="cl-item__dist">{d < 1 ? "Under 1 km" : `${fmt.format(Math.round(d))} km`}</span>}
                      </p>
                      {c.address && <p className="cl-item__addr">{c.address}</p>}
                      <p className="cl-item__addr">
                        {c.district}, {c.state}
                      </p>
                      <p className="cl-item__actions">
                        {isPlottable(c) && (
                          <button
                            type="button"
                            className="cl-link"
                            aria-pressed={isSel}
                            onClick={() => setSelected(isSel ? null : key)}
                          >
                            <Icon name="location_on" size={16} aria-hidden />
                            {isSel ? "Shown on Map" : "Show on Map"}
                            <span className="sr-only">: {c.name}</span>
                          </button>
                        )}
                        {isPlottable(c) && (
                          <a
                            className="cl-link"
                            href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon name="directions" size={16} aria-hidden />
                            Get Directions
                            <span className="sr-only">
                              {" "}
                              to {c.name} (opens in a new window)
                            </span>
                          </a>
                        )}
                      </p>
                    </li>
                  );
                })}
              </ul>
              {totalPages > 1 && (
                <div className="cl-pager">
                  <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} label="Centre list pages" size="sm" siblings={1} />
                </div>
              )}
            </>
          )}

          <a href={`tel:${HELPLINE}`} className="cl-helpline">
            <Icon name="call" size={20} aria-hidden />
            <span className="cl-helpline__label">24×7 Helpline</span>
            <span className="cl-helpline__num">{HELPLINE}</span>
          </a>
        </div>

        <div className="cl-map">
          <IndiaPointMap
            title="De-addiction centres across India"
            pins={pins}
            pinKinds={pinKinds}
            interactivePins={pins.length <= INDIVIDUAL_PIN_LIMIT}
            focusRegion={
              selected
                ? (filtered.find(({ c }) => centreKey(c) === selected)?.c.state ?? f.state) || null
                : f.state || null
            }
            onSelectRegion={(region) => {
              const match = states.find((s) => s.toLowerCase() === region.toLowerCase()) ?? region;
              if (states.includes(match)) update({ state: match, district: "" });
            }}
            state={mapState}
            /* The frame offers Retry on "error" and Clear on "no-results" through this one handler. */
            onRetry={mapState === "no-results" ? clearAll : retry}
            filterLabel={activeFilters.join(", ")}
            table={stateTable}
            tableView="sr-only"
            summary={ready ? `${fmt.format(pins.length)} centres shown on the map of India.` : undefined}
            legend={
              <ul className="cl-legend" aria-hidden="true">
                {CENTRE_TYPE_ORDER.map((t) => (
                  <li key={t}>
                    <span className="cl-dot" style={{ backgroundColor: CENTRE_TYPE_META[t].color }} />
                    {t}
                  </li>
                ))}
              </ul>
            }
          />
          {ready && f.state && (
            <p className="cl-map__back">
              <button type="button" className="cl-link" onClick={() => { update({ state: "", district: "" }); setSelected(null); }}>
                <Icon name="zoom_out_map" size={16} aria-hidden />
                Show All of India
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
