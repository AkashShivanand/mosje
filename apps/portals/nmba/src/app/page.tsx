"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/public-shell";
import { PUBLIC_DASHBOARD_STATS, PROGRAMME_STATS, PUBLIC_ACTIVITIES, FACILITIES } from "@/lib/mock-data";
import { STATES, STATE_DISTRICTS } from "@/lib/states";
import { MapPin, ArrowRight } from "lucide-react";

const BASE = "/portals/nmba";

const FacilityMap = dynamic(
  () => import("@/components/facility-map").then((m) => m.FacilityMap),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-surface-muted" /> }
);

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  "Awareness Rally": "bg-blue-50 text-blue-700",
  "School Programme": "bg-green-50 text-green-700",
  "Panchayat Sabha": "bg-amber-50 text-amber-700",
};

export default function NmbaHome() {
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const districts = state ? (STATE_DISTRICTS[state] ?? []) : [];

  const statRows = [
    [
      { label: "Total Pledges", value: PUBLIC_DASHBOARD_STATS.totalPledges },
      { label: "People Reached", value: PUBLIC_DASHBOARD_STATS.peopleReached },
      { label: "Youth Reached", value: PUBLIC_DASHBOARD_STATS.youthReached },
      { label: "Women Reached", value: PUBLIC_DASHBOARD_STATS.womenReached },
    ],
    [
      { label: "Total Activities Conducted", value: PUBLIC_DASHBOARD_STATS.totalActivities },
      { label: "Villages Covered", value: PUBLIC_DASHBOARD_STATS.villagesCovered ?? "" },
      { label: "Educational Institutions Covered", value: PUBLIC_DASHBOARD_STATS.educationalInstitutions },
    ],
  ];

  return (
    <PublicShell>
      {/* Hero band — full-bleed green */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-6 mb-8 flex items-center justify-between gap-6 bg-green-700 px-6 py-7 text-white sm:px-8">
        <div>
          <h1 className="text-xl font-bold leading-snug sm:text-2xl">
            Nasha Mukt Bharat Abhiyaan
          </h1>
          <p className="mt-1 text-sm text-white/80">
            Join 98 Lakh+ citizens committed to a drug-free society.
          </p>
        </div>
        <a
          href={`${BASE}/epledge`}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
        >
          Take the Pledge
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Dashboard */}
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Dashboard</h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              Live impact metrics verified from field reports across 372 districts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Filter by state"
              value={state}
              onChange={(e) => { setState(e.target.value); setDistrict(""); }}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
            >
              <option value="">All States</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              aria-label="Filter by district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
              className={"rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15" + (!state ? " opacity-50" : "")}
            >
              <option value="">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Stats — 4 then 3 */}
        <div className="space-y-3">
          {statRows.map((row, ri) => (
            <div key={ri} className={`grid gap-3 ${ri === 0 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
              {row.map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-line bg-white px-5 py-4 shadow-card">
                  <div className="text-xs text-ink-muted">{label}</div>
                  <div className="mt-1 text-xl font-bold text-ink">{value}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* NUMBER OF PROGRAMMES */}
      <section aria-labelledby="prog-heading" className="mb-8">
        <h2 id="prog-heading" className="mb-4 text-[10px] font-bold uppercase tracking-widest text-ink-muted">
          Number of Programmes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROGRAMME_STATS.map((cat) => (
            <div key={cat.label} className="rounded-xl border border-line bg-white p-5 shadow-card">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                <h3 className="text-sm font-bold text-ink">{cat.label}</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {cat.items.map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[10px] leading-tight text-ink-muted">{label}</div>
                    <div className="mt-0.5 text-sm font-bold text-green-700">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activities */}
      <section aria-labelledby="activities-heading" className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="activities-heading" className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
            Recent Activities Across India
          </h2>
          <a href={`${BASE}/activities`} className="flex items-center gap-1 text-sm font-medium text-navy hover:underline">
            View all Activities
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PUBLIC_ACTIVITIES.map((act, i) => (
            <article key={i} className="rounded-xl border border-line bg-white shadow-card">
              {/* Photo placeholder */}
              <div className="h-36 rounded-t-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <span className="text-3xl opacity-30">🌿</span>
              </div>
              <div className="p-4">
                {act.category && (
                  <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${CATEGORY_BADGE_COLORS[act.category] ?? "bg-surface-muted text-ink-muted"}`}>
                    {act.category}
                  </span>
                )}
                <h3 className="font-semibold text-sm text-ink leading-snug">{act.title}</h3>
                <p className="mt-1 text-xs text-ink-muted line-clamp-2">{act.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-hint">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {act.location}
                  </span>
                  <span>{act.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section aria-labelledby="map-heading">
        <div className="rounded-xl border border-line bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="map-heading" className="text-base font-bold text-navy">Find De-addiction Facilities Near You</h2>
              <p className="mt-1 text-xs text-ink-muted">
                Locate verified Integrated Rehabilitation Centres (IRCA), Outreach Centres (ODIC), and Addiction Treatment Facilities (ATF) in your district.
              </p>
            </div>
            <a
              href={`${BASE}/facilities`}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
            >
              View Facility Map
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-5">
            <FacilityMap facilities={FACILITIES} mini legendCollapsible className="rounded-lg overflow-hidden" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
