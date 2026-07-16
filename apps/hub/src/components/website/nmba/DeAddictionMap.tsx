"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Phone, Search, X, Navigation, LocateFixed, Loader2 } from "lucide-react";
import { Select } from "@mosje/design-system";
import { cn } from "@/lib/website/utils";
import {
  DEADDICTION_CENTRES,
  CENTRE_TYPE_META,
  CENTRE_TYPE_ORDER,
  TOTAL_CENTRES,
  PUBLISHED_TOTAL,
  HELPLINE,
  type CentreType,
  type DeAddictionCentre,
} from "@/content/website/deaddiction-centres";

const CentreMapCanvas = dynamic(() => import("./CentreMapCanvas").then((m) => m.CentreMapCanvas), {
  ssr: false,
  loading: () => <div className="h-full min-h-[380px] w-full animate-pulse bg-surface-muted" aria-hidden />,
});

const centreKey = (c: DeAddictionCentre) => `${c.name}|${c.lat}|${c.lng}`;
const LIST_CAP = 150;

const ALL_STATES = Array.from(new Set(DEADDICTION_CENTRES.map((c) => c.state))).sort((a, b) =>
  a.localeCompare(b),
);
const districtsForState = (s: string) =>
  Array.from(new Set(DEADDICTION_CENTRES.filter((c) => c.state === s).map((c) => c.district))).sort((a, b) =>
    a.localeCompare(b),
  );

function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function DeAddictionMap() {
  const [query, setQuery] = React.useState("");
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [type, setType] = React.useState<CentreType | "">("");
  const [selected, setSelected] = React.useState<DeAddictionCentre | null>(null);
  const [userLoc, setUserLoc] = React.useState<[number, number] | null>(null);
  const [locating, setLocating] = React.useState(false);
  const [locError, setLocError] = React.useState("");

  const listRef = React.useRef<HTMLUListElement>(null);
  const districts = state ? districtsForState(state) : [];

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = DEADDICTION_CENTRES.filter((c) => {
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
  }, [query, state, district, type, userLoc]);

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
    <div>
      {/* Toolbar */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search centre, area, district or state"
              aria-label="Search de-addiction centres"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[14px] text-ink outline-none placeholder:text-ink-muted focus:border-gov-blue"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:flex">
            <Select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict("");
              }}
              aria-label="Filter by state"
              className="lg:w-40"
            >
              <option value="">All States</option>
              {ALL_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
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
            disabled={locating}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-gov-blue px-4 text-[14px] font-semibold text-white transition-colors hover:bg-gov-blue-dark disabled:opacity-70"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <LocateFixed className="h-4 w-4" aria-hidden />}
            {locating ? "Locating…" : "Use my location"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setType("")}
            aria-pressed={type === ""}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
              type === "" ? "bg-gov-blue text-white" : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark",
            )}
          >
            All <span className={type === "" ? "text-white/70" : "text-ink"}>{TOTAL_CENTRES}</span>
          </button>
          {CENTRE_TYPE_ORDER.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(active ? "" : t)}
                aria-pressed={active}
                title={CENTRE_TYPE_META[t].label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                  active ? "bg-gov-blue text-white" : "bg-surface-muted text-ink-muted hover:bg-gov-blue/10 hover:text-gov-blue-dark",
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: CENTRE_TYPE_META[t].color }} aria-hidden />
                {t} <span className={active ? "text-white/70" : "text-ink"}>{CENTRE_TYPE_META[t].count}</span>
              </button>
            );
          })}
        </div>
        {locError && <p className="mt-2 text-[12px] text-danger">{locError}</p>}
      </div>

      {/* Split view: list + sticky map */}
      <div className="mt-4 grid overflow-hidden rounded-xl border border-gray-200 shadow-sm lg:grid-cols-[360px_1fr]">
        {/* List */}
        <div className="flex max-h-[560px] flex-col border-b border-gray-200 bg-white lg:max-h-none lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
            <span className="text-[13px] font-semibold text-ink">
              {filtered.length} centre{filtered.length === 1 ? "" : "s"}
              {userLoc && filtered.length > 0 && " · nearest first"}
            </span>
            {(query || state || type || userLoc) && (
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
                className="inline-flex items-center gap-1 text-[12px] font-medium text-gov-blue hover:text-gov-blue-dark"
              >
                <X className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-[13px] text-ink-muted">
              No centres match. Try a wider filter, or call the helpline.
            </p>
          ) : (
            <ul ref={listRef} className="flex-1 divide-y divide-gray-100 overflow-y-auto lg:max-h-[560px]">
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
                        active ? "bg-gov-blue/[0.06]" : "hover:bg-surface-muted",
                      )}
                    >
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: meta.color }} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{c.name}</span>
                          {dist !== undefined && (
                            <span className="shrink-0 text-[11px] font-semibold text-gov-blue">
                              {dist < 1 ? "<1 km" : `${Math.round(dist)} km`}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[12px] font-medium" style={{ color: meta.color }}>
                          {c.type}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-ink-muted">{c.address}</span>
                        <span className="mt-0.5 block text-[12px] text-ink-muted">
                          {c.district}, {c.state}
                        </span>
                        {active && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-gov-blue hover:text-gov-blue-dark"
                          >
                            <Navigation className="h-3 w-3" aria-hidden /> Get directions
                          </a>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
              {filtered.length > LIST_CAP && (
                <li className="px-4 py-2.5 text-center text-[12px] text-ink-muted">
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
            <Phone className="h-4 w-4 shrink-0 text-gov-blue" aria-hidden />
            <span className="text-[12px] text-ink-muted">24×7 Helpline</span>
            <span className="ml-auto text-[16px] font-bold tracking-tight text-gov-blue-dark">{HELPLINE}</span>
          </a>
        </div>

        {/* Map */}
        <div className="h-[420px] lg:h-[620px]">
          <CentreMapCanvas centres={filtered} selected={selected} userLoc={userLoc} onSelect={selectCentre} />
        </div>
      </div>

      <p className="mt-3 text-center text-[12px] text-ink-muted">
        {TOTAL_CENTRES} geo-tagged centres shown, from {PUBLISHED_TOTAL} nationwide. Source: Nasha Mukt Bharat Abhiyaan.
      </p>
    </div>
  );
}
