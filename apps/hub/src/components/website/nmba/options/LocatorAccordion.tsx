"use client";

import * as React from "react";
import { CENTRE_TYPE_META, type DeAddictionCentre } from "@/content/website/deaddiction-centres";
import { CentreMapDynamic, centreKey, filterCentres } from "./locator-shared";
import { Icon, Link, Search } from "@mosje/design-system";

export function LocatorAccordion() {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<DeAddictionCentre | null>(null);

  const filtered = React.useMemo(() => filterCentres({ query }), [query]);

  const byState = React.useMemo(() => {
    const m = new Map<string, DeAddictionCentre[]>();
    filtered.forEach((c) => {
      const arr = m.get(c.state) ?? [];
      arr.push(c);
      m.set(c.state, arr);
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <Search
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          size="sm"
          placeholder="Search centre, area, district or state"
          aria-label="Search centres"
        />
        <p className="mt-2 text-body-3 text-ink-muted">{filtered.length} centres across {byState.length} states — expand a state to explore.</p>
      </div>

      <div className="mt-4 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {byState.map(([st, centres]) => {
          const isOpen = open === st;
          return (
            <div key={st}>
              <button type="button" onClick={() => { setOpen(isOpen ? null : st); setSelected(null); }}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface-muted/50">
                <span className="text-title-2 text-ink">{st}</span>
                <span className="flex items-center gap-3">
                  <span className="rounded-full bg-surface-muted px-2 py-0.5 text-label-2 text-ink-muted">{centres.length}</span>
                  <Icon name="keyboard_arrow_down" size={16} className={`text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              {isOpen && (
                <div className="grid gap-4 border-t border-gray-100 bg-surface-muted/20 p-4 lg:grid-cols-[1fr_1fr]">
                  <ul className="max-h-[300px] space-y-1 overflow-y-auto">
                    {centres.map((c, i) => {
                      const active = selected ? centreKey(selected) === centreKey(c) : false;
                      return (
                        <li key={`${centreKey(c)}#${i}`}>
                          <button type="button" onClick={() => setSelected(c)}
                            className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${active ? "bg-primary/[0.06]" : "hover:bg-white"}`}>
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CENTRE_TYPE_META[c.type].color }} />
                            <span className="min-w-0">
                              <span className="block truncate text-title-3 text-ink">{c.name}</span>
                              <span className="block text-body-3 text-ink-muted">{c.type} · {c.district}</span>
                              {active && (
                                <Link href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`} external variant="standalone" onClick={(e) => e.stopPropagation()}
                                  className="mt-1 text-label-2" iconLeft={<Icon name="navigation" size={12} />}>Directions</Link>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="h-[300px] overflow-hidden rounded-lg border border-gray-200">
                    <CentreMapDynamic centres={centres} selected={selected} userLoc={null} onSelect={setSelected} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
