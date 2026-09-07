"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Icon, Link, Search, Select } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";
import {
  CENTRE_TYPE_META,
  CENTRE_TYPE_ORDER,
  TOTAL_CENTRES,
  PUBLISHED_TOTAL,
  HELPLINE,
  isPlottable,
  type CentreType,
  type DeAddictionCentre,
} from "@/content/website/deaddiction-centres";
import {
  districtsOf,
  plottableCount,
  statesOf,
  useCentres,
  useNearViewport,
} from "@/lib/website/deaddiction-centres";

const CentreMapCanvas = dynamic(() => import("./CentreMapCanvas").then((m) => m.CentreMapCanvas), {
  ssr: false,
  loading: () => <div className="h-full min-h-[380px] w-full animate-pulse bg-surface-muted" aria-hidden />,
});

const centreKey = (c: DeAddictionCentre) => `${c.name}|${c.lat}|${c.lng}`;
const LIST_CAP = 150;

/**
 * The register is FETCHED, so the state and district lists are derived per
 * render from whatever has arrived — they used to be module constants computed
 * from a static import. Deriving them from one resolved value is what stops the
 * toolbar offering a state the list cannot show: `data-state-completeness.md` §2,
 * one request, one answer.
 */

function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export interface DeAddictionMapProps {
  /**
   * Which side the map sits on. The dedicated locator page leads with the list
   * (`"right"`, the default); the home-page section leads with the map, which is
   * how the Figma frame has it. Only the column order changes — same component,
   * same behaviour, so the two surfaces cannot drift apart.
   */
  mapSide?: "left" | "right";
  /** Shorter map + list on the home page, where the locator is one section of many. */
  compact?: boolean;
}

export function DeAddictionMap({ mapSide = "right", compact = false }: DeAddictionMapProps = {}) {
  const [query, setQuery] = React.useState("");
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [type, setType] = React.useState<CentreType | "">("");
  const [selected, setSelected] = React.useState<DeAddictionCentre | null>(null);
  const [userLoc, setUserLoc] = React.useState<[number, number] | null>(null);
  const [locating, setLocating] = React.useState(false);
  const [locError, setLocError] = React.useState("");

  const listRef = React.useRef<HTMLUListElement>(null);

  /* THE INTENT GATE. Nothing is fetched until the locator is within a screen of
     the fold, so a reader who never scrolls this far downloads none of the
     register — and on the dedicated locator page, where this is the content, it
     is true on first paint. */
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const near = useNearViewport(sectionRef);
  const { status, centres, retry } = useCentres(near);
  const ready = status === "ready";

  /* Every hook below runs against `centres`, which is `[]` until the register
     arrives — so nothing here is conditional and the RENDER is what branches.
     `data-state-completeness.md` §3. */
  const states = React.useMemo(() => statesOf(centres), [centres]);
  const districts = React.useMemo(
    () => (state ? districtsOf(centres, state) : []),
    [centres, state],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = centres.filter((c) => {
      if (state && c.state !== state) return false;
      if (district && c.district !== district) return false;
      if (type && c.type !== type) return false;
      if (q && !`${c.name} ${c.address} ${c.district} ${c.state} ${c.type}`.toLowerCase().includes(q))
        return false;
      return true;
    });
    if (userLoc) {
      return rows
        .map((c) => ({ ...c, _d: distanceKm(userLoc, [c.lat, c.lng]) }))
        .sort((a, b) => a._d - b._d);
    }
    return rows.map((c) => ({ ...c }) as DeAddictionCentre & { _d?: number });
  }, [centres, query, state, district, type, userLoc]);

  const selectCentre = React.useCallback((c: DeAddictionCentre) => setSelected(c), []);

  // scroll the selected card into view within the list
  React.useEffect(() => {
    if (!selected || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-key="${CSS.escape(centreKey(selected))}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setLocError("Location isn’t available on this device.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocError("Couldn’t get your location. Allow location access, or search by state.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const shown = filtered.slice(0, LIST_CAP);

  return (
    <div ref={sectionRef}>
      {/* Toolbar */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="flex-1">
            {/* Disabled until the register is here — a field that accepts a
                query it cannot answer is worse than one that visibly waits. */}
            <Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              size="sm"
              disabled={!ready}
              placeholder="Search centre, area, district or state"
              aria-label="Search de-addiction centres"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:flex">
            <Select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict("");
              }}
              disabled={!ready}
              aria-label="Filter by state"
              className="lg:w-40"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!ready || !state}
              aria-label="Filter by district"
              className="lg:w-40"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
          <button
            type="button"
            onClick={locate}
            disabled={!ready || locating}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-label-1 text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
          >
            {locating ? <Icon name="progress_activity" size={16} className="animate-spin" aria-hidden /> : <Icon name="my_location" size={16} aria-hidden />}
            {locating ? "Locating…" : "Use my location"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setType("")}
            aria-pressed={type === ""}
            disabled={!ready}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-2 transition-colors",
              type === "" ? "bg-primary text-white" : "bg-surface-muted text-ink-muted hover:bg-primary/10 hover:text-primary-dark",
            )}
          >
            All <span className={type === "" ? "text-white" : "text-ink"}>{TOTAL_CENTRES}</span>
          </button>
          {CENTRE_TYPE_ORDER.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(active ? "" : t)}
                aria-pressed={active}
                disabled={!ready}
                title={CENTRE_TYPE_META[t].label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-2 transition-colors",
                  active ? "bg-primary text-white" : "bg-surface-muted text-ink-muted hover:bg-primary/10 hover:text-primary-dark",
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: CENTRE_TYPE_META[t].color }} aria-hidden />
                {t} <span className={active ? "text-white" : "text-ink"}>{CENTRE_TYPE_META[t].count}</span>
              </button>
            );
          })}
        </div>
        {locError && <p className="mt-2 text-body-3 text-danger">{locError}</p>}
      </div>

      {/* Split view: list + sticky map */}
      <div
        className={cn(
          "mt-4 grid overflow-hidden rounded-xl border border-gray-200 shadow-sm",
          mapSide === "left" ? "lg:grid-cols-[1fr_400px]" : "lg:grid-cols-[360px_1fr]",
        )}
      >
        {/* List */}
        <div
          className={cn(
            "flex flex-col border-b border-gray-200 bg-white lg:max-h-none lg:border-b-0",
            compact ? "max-h-[420px]" : "max-h-[560px]",
            mapSide === "left" ? "lg:order-2 lg:border-l" : "lg:border-r",
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
            <span className="text-title-3 text-ink">
              {ready ? (
                <>
                  {filtered.length} centre{filtered.length === 1 ? "" : "s"}
                  {userLoc && filtered.length > 0 && " · nearest first"}
                </>
              ) : status === "error" ? (
                "Centres"
              ) : (
                /* NOT "0 centres". A count of nothing, before anything has been
                   asked for, is the sentence that makes a working locator look
                   broken — `data-state-completeness.md` §1. */
                "Loading centres…"
              )}
            </span>
            {ready && (query || state || type || userLoc) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setState("");
                  setDistrict("");
                  setType("");
                  setUserLoc(null);
                  setSelected(null);
                }}
                className="inline-flex items-center gap-1 text-label-2 text-primary hover:text-primary-dark"
              >
                <Icon name="close" size={12} /> Reset
              </button>
            )}
          </div>

          {!ready ? (
            status === "error" ? (
              /* ERROR. One sentence, a real retry, and no status code — a
                 citizen cannot act on a 503. The helpline below stays reachable,
                 which on this particular page is the thing that matters most
                 when the list will not load. */
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
                <p className="text-body-2 text-ink-muted">
                  The centre register could not be loaded. The 24×7 helpline is{" "}
                  <a href={`tel:${HELPLINE}`} className="text-primary-dark underline">
                    {HELPLINE}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-label-1 text-white transition-colors hover:bg-primary-dark"
                >
                  <Icon name="refresh" size={16} aria-hidden />
                  Try again
                </button>
              </div>
            ) : (
              /* LOADING — a skeleton in the SHAPE of the result, so nothing
                 moves when the rows land, and `role="status"` so a screen reader
                 is told the wait is deliberate rather than reading an empty
                 list. */
              <div
                role="status"
                aria-live="polite"
                className="flex-1 divide-y divide-gray-100 overflow-hidden"
              >
                <span className="sr-only">Loading the de-addiction centre register…</span>
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex items-start gap-2.5 px-4 py-3" aria-hidden>
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-surface-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block h-3.5 w-3/4 animate-pulse rounded bg-surface-muted" />
                      <span className="mt-2 block h-2.5 w-10 animate-pulse rounded bg-surface-muted" />
                      <span className="mt-2 block h-2.5 w-full animate-pulse rounded bg-surface-muted" />
                      <span className="mt-1.5 block h-2.5 w-1/2 animate-pulse rounded bg-surface-muted" />
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : filtered.length === 0 ? (
            /* FILTERED TO NOTHING — the reader caused this state and can undo
               it, so it names the remedy and offers it. It is deliberately NOT
               worded as "no centres exist".

               THERE IS NO SEPARATE "EMPTY REGISTER" BRANCH, and that is a
               decision rather than an omission. `data-state-completeness.md` §1
               separates empty from error because a feed legitimately publishing
               nothing must not read as broken — but this register is a COMMITTED
               MIRROR in our own repository, so zero rows means the asset is
               broken, not that the department has de-registered all 768 centres.
               `load()` therefore rejects an empty parse, and the honest rendering
               is the error state above: it says so in one sentence, offers a real
               retry, and keeps the helpline reachable. A branch for a state that
               cannot occur is worse than no branch. */
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
              <p className="text-body-2 text-ink-muted">
                No centres match this search. Try a wider filter, or call the helpline.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setState("");
                  setDistrict("");
                  setType("");
                  setUserLoc(null);
                  setSelected(null);
                }}
                className="inline-flex items-center gap-1 text-label-2 text-primary hover:text-primary-dark"
              >
                {/* 16, not the 12 the Reset control above it uses. That 12 is
                    grandfathered debt on the icon-scale ratchet; copying it into
                    a new control is how debt grows, and 16 is the right step
                    beside label-2 text anyway. */}
                <Icon name="close" size={16} /> Clear filters
              </button>
            </div>
          ) : (
            <ul
              ref={listRef}
              className={cn(
                "flex-1 divide-y divide-gray-100 overflow-y-auto",
                compact ? "lg:max-h-[420px]" : "lg:max-h-[560px]",
              )}
            >
              {shown.map((c, i) => {
                const meta = CENTRE_TYPE_META[c.type];
                const active = selected ? centreKey(selected) === centreKey(c) : false;
                const dist = (c as { _d?: number })._d;
                return (
                  <li key={`${centreKey(c)}#${i}`} data-key={centreKey(c)}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className={cn(
                        "flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors",
                        active ? "bg-primary/[0.06]" : "hover:bg-surface-muted",
                      )}
                    >
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: meta.color }} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-title-3 text-ink">{c.name}</span>
                          {dist !== undefined && (
                            <span className="shrink-0 text-label-2 text-primary">
                              {dist < 1 ? "<1 km" : `${Math.round(dist)} km`}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-label-2" style={{ color: meta.color }}>
                          {c.type}
                        </span>
                        <span className="mt-0.5 block truncate text-body-3 text-ink-muted">{c.address}</span>
                        <span className="mt-0.5 block text-body-3 text-ink-muted">
                          {c.district}, {c.state}
                        </span>
                        {active && (
                          <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                            external
                            variant="standalone"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1.5 text-label-2"
                            iconLeft={<Icon name="navigation" size={12} aria-hidden />}
                          >
                            Get directions
                          </Link>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
              {filtered.length > LIST_CAP && (
                <li className="px-4 py-2.5 text-center text-body-3 text-ink-muted">
                  Showing nearest {LIST_CAP} — refine to narrow down.
                </li>
              )}
            </ul>
          )}

          {/* Helpline pinned to the list column */}
          <a
            href={`tel:${HELPLINE}`}
            className="flex items-center gap-2.5 border-t border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-surface-muted"
          >
            <Icon name="call" size={16} className="shrink-0 text-primary" aria-hidden />
            <span className="text-body-3 text-ink-muted">24×7 Helpline</span>
            <span className="ml-auto text-title-2 tabular-nums text-primary-dark">{HELPLINE}</span>
          </a>
        </div>

        {/* Map */}
        <div
          className={cn(
            "h-[420px]",
            compact ? "lg:h-[560px]" : "lg:h-[620px]",
            mapSide === "left" && "lg:order-1",
          )}
        >
          {/* The map takes only centres with usable coordinates. `fitBounds` fits
              the cluster's bounds, so one bad row drags the viewport off the
              planet — the list still shows all of them.

              It renders only once the register is here, which also keeps Leaflet
              and its marker-cluster plugin out of the work until the reader has
              reached the locator: the dynamic import cannot start before the
              element does. */}
          {ready ? (
            <CentreMapCanvas
              centres={filtered.filter(isPlottable)}
              selected={selected}
              userLoc={userLoc}
              onSelect={selectCentre}
            />
          ) : (
            <div
              className="h-full w-full animate-pulse bg-surface-muted"
              aria-hidden
            />
          )}
        </div>
      </div>

      {/* The plotted count is DERIVED from the rows that arrived, so it cannot be
          printed before them. The published totals are constants from the same
          feed and render immediately — a reader waiting for the register still
          sees what the scheme publishes nationally. */}
      <p className="mt-3 text-center text-body-3 text-ink-muted">
        {ready && `${plottableCount(centres)} centres plotted, of `}
        {TOTAL_CENTRES} geo-tagged and {PUBLISHED_TOTAL} published nationwide. Source: Nasha
        Mukt Bharat Abhiyaan.
      </p>
    </div>
  );
}
