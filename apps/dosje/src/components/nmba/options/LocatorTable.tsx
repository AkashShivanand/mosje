"use client";

import * as React from "react";
import { Search, Navigation, MapPin } from "lucide-react";
import { Select } from "@mosje/design-system";
import { cn } from "@/lib/utils";
import { CENTRE_TYPE_META, CENTRE_TYPE_ORDER, type CentreType, type DeAddictionCentre } from "@/content/deaddiction-centres";
import { CentreMapDynamic, centreKey, filterCentres, ALL_STATES } from "./locator-shared";

const PAGE = 12;

export function LocatorTable() {
  const [query, setQuery] = React.useState("");
  const [state, setState] = React.useState("");
  const [type, setType] = React.useState<CentreType | "">("");
  const [selected, setSelected] = React.useState<DeAddictionCentre | null>(null);
  const [page, setPage] = React.useState(0);

  const filtered = React.useMemo(() => filterCentres({ query, state, type }), [query, state, type]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice(page * PAGE, page * PAGE + PAGE);

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="Search centre, area, district"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[14px] outline-none focus:border-gov-blue" />
          </div>
          <Select value={state} onChange={(e) => { setState(e.target.value); setPage(0); }} aria-label="State" className="sm:w-48">
            <option value="">All States</option>
            {ALL_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["", ...CENTRE_TYPE_ORDER] as const).map((t) => (
            <button key={t || "all"} type="button" onClick={() => { setType(t as CentreType | ""); setPage(0); }}
              className={cn("rounded-full px-3 py-1 text-[12px] font-medium transition-colors",
                type === t ? "bg-gov-blue text-white" : "bg-surface-muted text-ink-muted hover:text-gov-blue-dark")}>
              {t === "" ? `All ${filtered.length}` : `${t} ${CENTRE_TYPE_META[t].count}`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-[260px] overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <CentreMapDynamic centres={filtered} selected={selected} userLoc={null} onSelect={setSelected} />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-gray-200 bg-surface-muted/50 text-[12px] uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Centre</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">District</th>
                <th className="px-4 py-2.5 font-semibold">State</th>
                <th className="px-4 py-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((c, i) => {
                const active = selected ? centreKey(selected) === centreKey(c) : false;
                return (
                  <tr key={`${centreKey(c)}#${i}`} className={cn("cursor-pointer transition-colors", active ? "bg-gov-blue/[0.06]" : "hover:bg-surface-muted/50")} onClick={() => setSelected(c)}>
                    <td className="max-w-[280px] px-4 py-2.5 font-medium text-ink"><span className="line-clamp-1">{c.name}</span></td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: CENTRE_TYPE_META[c.type].color }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: CENTRE_TYPE_META[c.type].color }} />{c.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-ink-muted">{c.district}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{c.state}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right">
                      <span className="inline-flex items-center gap-2">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setSelected(c); }} className="inline-flex items-center gap-1 text-[12px] font-semibold text-gov-blue hover:text-gov-blue-dark"><MapPin className="h-3.5 w-3.5" /> Map</button>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-[12px] font-semibold text-gov-blue hover:text-gov-blue-dark"><Navigation className="h-3.5 w-3.5" /> Directions</a>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-muted">No centres match.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5 text-[12px] text-ink-muted">
          <span>{filtered.length} centres · page {page + 1} of {pages}</span>
          <span className="flex gap-1.5">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-gray-200 px-2.5 py-1 font-medium text-ink disabled:opacity-40">Prev</button>
            <button type="button" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-gray-200 px-2.5 py-1 font-medium text-ink disabled:opacity-40">Next</button>
          </span>
        </div>
      </div>
    </div>
  );
}
