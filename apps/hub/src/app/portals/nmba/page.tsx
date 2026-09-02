"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/nmba/public-shell";
import { PUBLIC_DASHBOARD_STATS, PROGRAMME_STATS, PUBLIC_ACTIVITIES, FACILITIES } from "@/lib/nmba/mock-data";
import { STATES, STATE_DISTRICTS } from "@/lib/nmba/states";
import { Badge, Button, Icon, MetricCard, Select } from "@mosje/design-system";

const BASE = "/portals/nmba";

const FacilityMap = dynamic(
  () => import("@/components/nmba/facility-map").then((m) => m.FacilityMap),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-surface-muted" /> }
);

const CATEGORY_BADGE_STATUS: Record<string, "info" | "success" | "warning"> = {
  "Awareness Rally": "info",
  "School Programme": "success",
  "Panchayat Sabha": "warning",
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
          <p className="mt-1 text-sm text-white">
            Join 98 Lakh+ citizens committed to a drug-free society.
          </p>
        </div>
        <a
          href={`${BASE}/epledge`}
          // NO WHITE TINT BEHIND THE LABEL. `bg-white/10` lightens the #008236 hero to
            // #1a8e4a, where white text measures 4.19:1 and fails AA — and
            // `hover:bg-white/20` made it worse still. The border carries the button
            // shape; hover DARKENS instead, which raises contrast rather than lowering it.
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-black/10"
        >
          Take the Pledge
          <Icon name="arrow_forward" size={16} />
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
            <Select
              aria-label="Filter by state"
              value={state}
              onChange={(e) => { setState(e.target.value); setDistrict(""); }}
            >
              <option value="">All States</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select
              aria-label="Filter by district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
            >
              <option value="">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
        </div>

        {/* Stats — 4 then 3 */}
        <div className="space-y-3">
          {statRows.map((row, ri) => (
            <div key={ri} className={`grid gap-3 ${ri === 0 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
              {row.map(({ label, value }) => (
                <MetricCard key={label} label={label} value={String(value)} />
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
                <Icon name={cat.icon} size={20} className="text-navy" aria-hidden="true" />
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
            <Icon name="arrow_forward" size={14} />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PUBLIC_ACTIVITIES.map((act, i) => (
            <article key={i} className="rounded-xl border border-line bg-white shadow-card">
              {/* Photo slot — neutral token surface with the estate's Material
                  Symbols glyph. (Was a 🌿 emoji on a hardcoded green gradient:
                  emoji are not the SAMAVESH icon system and don't theme.) */}
              <div className="flex h-36 items-center justify-center rounded-t-xl bg-surface-muted">
                <Icon name="image" size={32} className="text-ink-hint" aria-hidden="true" />
              </div>
              <div className="p-4">
                {act.category && (
                  <Badge
                    status={CATEGORY_BADGE_STATUS[act.category] ?? "neutral"}
                    className="mb-2"
                  >
                    {act.category}
                  </Badge>
                )}
                <h3 className="font-semibold text-sm text-ink leading-snug">{act.title}</h3>
                <p className="mt-1 text-xs text-ink-muted line-clamp-2">{act.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-hint">
                  <span className="flex items-center gap-1">
                    <Icon name="location_on" size={12} className="shrink-0" />
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
            <Button href={`${BASE}/facilities`} iconRight={<Icon name="arrow_forward" size={16} />}>
              View Facility Map
            </Button>
          </div>
          <div className="mt-5">
            <FacilityMap facilities={FACILITIES} mini legendCollapsible className="rounded-lg overflow-hidden" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
