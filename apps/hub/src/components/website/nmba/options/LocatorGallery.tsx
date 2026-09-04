"use client";

import * as React from "react";
import { cn } from "@/lib/website/utils";
import { CENTRE_TYPE_META, CENTRE_TYPE_ORDER, type CentreType, type DeAddictionCentre } from "@/content/website/deaddiction-centres";
import { CentreMapDynamic, centreKey, filterCentres } from "./locator-shared";
import { Icon, Link, Search } from "@mosje/design-system";

const CAP = 48;

export function LocatorGallery() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<CentreType | "">("");
  const [modal, setModal] = React.useState<DeAddictionCentre | null>(null);

  const filtered = React.useMemo(() => filterCentres({ query, type }), [query, type]);

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
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["", ...CENTRE_TYPE_ORDER] as const).map((t) => (
            <button key={t || "all"} type="button" onClick={() => setType(t as CentreType | "")}
              className={cn("rounded-full px-3 py-1 text-label-2 transition-colors",
                type === t ? "bg-primary text-white" : "bg-surface-muted text-ink-muted hover:text-primary-dark")}>
              {t === "" ? `All ${filtered.length}` : `${t} ${CENTRE_TYPE_META[t].count}`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, CAP).map((c, i) => {
          const meta = CENTRE_TYPE_META[c.type];
          return (
            <button key={`${centreKey(c)}#${i}`} type="button" onClick={() => setModal(c)}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-label-2" style={{ background: `${meta.color}1a`, color: meta.color }}>
                <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />{c.type}
              </span>
              <span className="mt-2.5 line-clamp-2 text-title-3 text-ink">{c.name}</span>
              <span className="mt-1 line-clamp-2 flex-1 text-body-3 text-ink-muted">{c.address}</span>
              <span className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
                <span className="text-label-2 text-ink">{c.district}, {c.state}</span>
                <Icon name="arrow_outward" size={16} className="text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          );
        })}
      </div>
      {filtered.length > CAP && <p className="mt-3 text-center text-body-3 text-ink-muted">Showing {CAP} of {filtered.length} — refine to narrow down.</p>}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="h-56 w-full">
              <CentreMapDynamic centres={[modal]} selected={modal} userLoc={null} onSelect={() => {}} />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <span className="inline-flex rounded-full px-2 py-0.5 text-label-2" style={{ background: `${CENTRE_TYPE_META[modal.type].color}1a`, color: CENTRE_TYPE_META[modal.type].color }}>{modal.type} · {CENTRE_TYPE_META[modal.type].label}</span>
                <button type="button" onClick={() => setModal(null)} aria-label="Close"><Icon name="close" size={20} className="text-ink-muted" /></button>
              </div>
              <p className="mt-2 text-title-1 text-ink">{modal.name}</p>
              <p className="mt-1.5 text-body-2 text-ink-muted">{modal.address}</p>
              <p className="mt-1 text-body-2 font-medium text-ink">{modal.district}, {modal.state}</p>
              <Link href={`https://www.google.com/maps/search/?api=1&query=${modal.lat},${modal.lng}`} external variant="standalone"
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-label-1 text-white hover:bg-primary-dark"
                iconLeft={<Icon name="navigation" size={16} />}>
                Get directions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
