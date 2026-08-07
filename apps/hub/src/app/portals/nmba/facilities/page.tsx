"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/nmba/public-shell";
import { FACILITIES } from "@/lib/nmba/mock-data";
import type { Facility } from "@/lib/nmba/types";
import { useToast } from "@/components/nmba/toast";
import { Icon } from "@mosje/design-system";

const FacilityMap = dynamic(
  () => import("@/components/nmba/facility-map").then((m) => m.FacilityMap),
  { ssr: false, loading: () => <div className="h-[500px] animate-pulse rounded-xl bg-surface-muted" /> }
);

const TYPE_LABELS: Record<string, string> = {
  IRCA: "Integrated Rehabilitation Centre for Addicts",
  CPLI: "Community Peer Led Intervention",
  ODIC: "Outreach and Drop-in Centre",
  DDAC: "District De-addiction Centre",
  ATF: "Addiction Treatment Facility",
};

export default function FacilitiesPage() {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");

  const filtered: Facility[] = query.trim()
    ? FACILITIES.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.address.toLowerCase().includes(query.toLowerCase()) ||
          f.type.toLowerCase().includes(query.toLowerCase())
      )
    : FACILITIES;

  return (
    <PublicShell>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink">De-addiction Facilities</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Locate IRCA, CPLI, ODIC, DDAC, and ATF centres across India.
        </p>
      </div>

      {/* Search + Near Me */}
      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-hint" />
          <input
            type="search"
            aria-label="Search facilities by name, type, or location"
            placeholder="Search by name, type, or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-line pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
          />
        </div>
        <button
          onClick={() => toast("Location access would be requested here.", "info")}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted"
          aria-label="Find facilities near my location"
        >
          <Icon name="location_on" size={16} className="text-navy" />
          Near Me
        </button>
      </div>

      <FacilityMap facilities={filtered} legendCollapsible className="mb-6" />

      {/* Facilities list */}
      <section aria-labelledby="facilities-list-heading">
        <h2 id="facilities-list-heading" className="mb-4 text-base font-semibold text-ink">
          {filtered.length} Facilit{filtered.length === 1 ? "y" : "ies"} found
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f, i) => (
            <div key={i} className="rounded-xl border border-line bg-white p-4 shadow-card">
              <div className="mb-2">
                <span className="rounded-full bg-brandwash px-2 py-0.5 text-xs font-semibold text-navy">
                  {f.type}
                </span>
              </div>
              <h3 className="font-semibold text-ink">{f.name}</h3>
              <p className="mt-0.5 text-xs text-ink-muted">{TYPE_LABELS[f.type]}</p>
              <p className="mt-2 text-xs text-ink-hint">{f.address}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
