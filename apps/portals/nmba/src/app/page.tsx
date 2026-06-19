"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/public-shell";
import { StatsCard } from "@/components/stats-card";
import {
  DASHBOARD_STATS,
  PUBLIC_ACTIVITIES,
  FACILITIES,
} from "@/lib/mock-data";
import { STATES, STATE_DISTRICTS } from "@/lib/states";
import {
  Users,
  TrendingUp,
  GraduationCap,
  HeartHandshake,
  Activity,
  MapPin,
} from "lucide-react";

const BASE = "/portals/nmba";

const FacilityMap = dynamic(
  () => import("@/components/facility-map").then((m) => m.FacilityMap),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-surface-muted" /> }
);

const selectCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";

export default function NmbaHome() {
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const districts = state ? (STATE_DISTRICTS[state] ?? []) : [];

  return (
    <PublicShell>
      {/* Hero band */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-navy-900 via-navy to-navy-700 px-6 py-8 text-white shadow-pop">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
          Ministry of Social Justice &amp; Empowerment
        </span>
        <h1 className="mt-1 text-2xl font-bold leading-tight">
          Nasha Mukt Bharat Abhiyaan
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/80">
          NMBA is a campaign to reach out to the most drug-affected districts of India and create a drug-free nation through community outreach, pledge drives, and de-addiction facilities.
        </p>
        <a
          href={`${BASE}/epledge`}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-saffron px-5 py-2.5 text-sm font-semibold text-white hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-saffron/50"
        >
          <HeartHandshake className="h-4 w-4" />
          Take the Pledge
        </a>
      </div>

      {/* State/district filter */}
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-line bg-white p-4 shadow-card">
        <select
          aria-label="Filter by state"
          value={state}
          onChange={(e) => { setState(e.target.value); setDistrict(""); }}
          className={selectCls}
        >
          <option value="">All States</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          aria-label="Filter by district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={!state}
          className={selectCls + (!state ? " opacity-50" : "")}
        >
          <option value="">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Stats grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="mb-4 text-base font-semibold text-ink">
          Campaign Impact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard label="Total Pledges" value={DASHBOARD_STATS.totalPledges} icon={<HeartHandshake className="h-5 w-5" />} />
          <StatsCard label="People Reached" value={DASHBOARD_STATS.peopleReached} icon={<Users className="h-5 w-5" />} />
          <StatsCard label="Youth Reached" value={DASHBOARD_STATS.youthReached} icon={<TrendingUp className="h-5 w-5" />} />
          <StatsCard label="Women Reached" value={DASHBOARD_STATS.womenReached} icon={<Users className="h-5 w-5" />} />
          <StatsCard label="Total Activities" value={DASHBOARD_STATS.totalActivities} icon={<Activity className="h-5 w-5" />} />
          <StatsCard label="Educational Institutions" value={DASHBOARD_STATS.educationalInstitutions} icon={<GraduationCap className="h-5 w-5" />} />
        </div>
      </section>

      {/* Recent activities */}
      <section aria-labelledby="activities-heading" className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="activities-heading" className="text-base font-semibold text-ink">Recent Activities</h2>
          <a href={`${BASE}/activities`} className="text-sm font-medium text-navy hover:underline">View all</a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PUBLIC_ACTIVITIES.map((act, i) => (
            <article key={i} className="rounded-xl border border-line bg-white p-4 shadow-card">
              <h3 className="font-semibold text-ink">{act.title}</h3>
              <p className="mt-1 text-sm text-ink-muted line-clamp-2">{act.description}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-hint">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {act.location}
                </span>
                <span>{act.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Facility mini-map */}
      <section aria-labelledby="map-heading" className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="map-heading" className="text-base font-semibold text-ink">De-addiction Facilities</h2>
          <a href={`${BASE}/facilities`} className="text-sm font-medium text-navy hover:underline">View Facility Map</a>
        </div>
        <FacilityMap facilities={FACILITIES} mini legendCollapsible className="mb-4" />
      </section>
    </PublicShell>
  );
}
