"use client";

import * as React from "react";
import { cn } from "@/lib/website/utils";
import { CENTRE_TYPE_META, CENTRE_TYPE_ORDER, type CentreType, type DeAddictionCentre } from "@/content/website/deaddiction-centres";
import { CentreMapDynamic, centreKey, filterCentres } from "./locator-shared";
import { Icon, Link, Search } from "@mosje/design-system";

export function LocatorMapFirst() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<CentreType | "">("");
  const [selected, setSelected] = React.useState<DeAddictionCentre | null>(null);
  const [listOpen, setListOpen] = React.useState(false);

  const filtered = React.useMemo(() => filterCentres({ query, type }), [query, type]);

  return (
    <div className="relative h-[560px] overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <div className="absolute inset-0 z-0">
        <CentreMapDynamic centres={filtered} selected={selected} userLoc={null} onSelect={setSelected} />
      </div>

      {/* Floating search + chips */}
      <div className="pointer-events-none absolute left-14 right-3 top-3 z-10 flex flex-col gap-2">
        <div className="pointer-events-auto max-w-sm">
          <Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
            size="sm"
            placeholder="Search centres"
            aria-label="Search centres"
          />
        </div>
        <div className="pointer-events-auto flex max-w-full flex-wrap gap-1.5">
          {(["", ...CENTRE_TYPE_ORDER] as const).map((t) => {
            const active = type === t;
            return (
              <button key={t || "all"} type="button" onClick={() => setType(t as CentreType | "")}
                className={cn("rounded-full px-2.5 py-1 text-[12px] font-medium shadow-sm transition-colors",
                  active ? "bg-primary text-white" : "bg-white/95 text-ink-muted hover:text-primary-dark")}>
                {t === "" ? "All" : t}
              </button>
            );
          })}
        </div>
      </div>

      {/* List toggle */}
      <button type="button" onClick={() => setListOpen((v) => !v)}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[13px] font-semibold text-white shadow-sm">
        <Icon name="list" size={16} /> {listOpen ? "Hide" : "List"} ({filtered.length})
      </button>

      {/* Slide-over list */}
      {listOpen && (
        <div className="absolute bottom-0 right-0 top-0 z-20 flex w-80 max-w-[85%] flex-col border-l border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
            <span className="text-[13px] font-semibold text-ink">{filtered.length} centres</span>
            <button type="button" onClick={() => setListOpen(false)} aria-label="Close list"><Icon name="close" size={16} className="text-ink-muted" /></button>
          </div>
          <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto">
            {filtered.slice(0, 120).map((c, i) => (
              <li key={`${centreKey(c)}#${i}`}>
                <button type="button" onClick={() => { setSelected(c); }} className="flex w-full items-start gap-2 px-4 py-2.5 text-left hover:bg-surface-muted">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: CENTRE_TYPE_META[c.type].color }} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-ink">{c.name}</span>
                    <span className="block text-[12px] text-ink-muted">{c.type} · {c.district}, {c.state}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Floating detail card */}
      {selected && (
        <div className="absolute bottom-3 left-3 z-10 w-72 max-w-[80%] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: `${CENTRE_TYPE_META[selected.type].color}1a`, color: CENTRE_TYPE_META[selected.type].color }}>{selected.type}</span>
            <button type="button" onClick={() => setSelected(null)} aria-label="Close"><Icon name="close" size={16} className="text-ink-muted" /></button>
          </div>
          <p className="mt-2 text-[14px] font-semibold leading-snug text-ink">{selected.name}</p>
          <p className="mt-1 text-[12px] text-ink-muted">{selected.address}</p>
          <p className="mt-1 text-[12px] font-medium text-ink">{selected.district}, {selected.state}</p>
          <Link href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`} external variant="standalone"
            className="mt-2 text-[12px] font-semibold" iconLeft={<Icon name="navigation" size={14} />}>
            Get directions
          </Link>
        </div>
      )}
    </div>
  );
}
