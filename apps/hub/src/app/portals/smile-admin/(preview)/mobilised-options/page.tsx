"use client";

/**
 * THROWAWAY PREVIEW — Mobilised aggregate KPI card options.
 *
 * Renders six faithful layout variants of the restructured "Total Mobilised"
 * card (10,229 = Shelter Home 7,579 + Child Rehabilitation 2,650) using the
 * real SMILE `KpiCard` DNA (same shell, accent bar, tokens, grid footprint).
 *
 * Reachable at /portals/smile-admin/mobilised-options (no auth — sits outside
 * the (app) guard but inside the smile-admin token wrapper). Delete this whole
 * (preview) folder once a variant is chosen and wired into the live dashboard.
 */

import { Baby, Home, Users } from "lucide-react";
import { KpiCard, KPI_ICONS, type KpiSpec } from "@/components/smile-admin/dashboard/kpi-card";

const SHELL =
  "group relative isolate flex h-full flex-col justify-between gap-sm overflow-hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs transition-all duration-200 ease-swift-out hover:-translate-y-px hover:border-stroke-300 hover:shadow-md md:gap-md md:p-lg";

const TOTAL = "10,229";
const SHELTER = "7,579";
const CHILD = "2,650";
const SHELTER_PCT = 74.1;
const CHILD_PCT = 25.9;

/* ── shared bits ─────────────────────────────────────────────────────────── */

function AccentBar() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-0 top-0 h-1 rounded-t-lg bg-primary opacity-80 transition-opacity duration-200 group-hover:opacity-100"
    />
  );
}

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-sm md:gap-md">
      <div className="min-w-0 space-y-1">
        <div className="text-label-3 font-semibold uppercase tracking-[0.08em] text-primary md:tracking-[0.1em]">
          Total Mobilised
        </div>
        <div className="text-num-lg font-bold leading-none tabular-nums text-foreground md:text-num-xl">
          {TOTAL}
        </div>
      </div>
      <div
        className={`grid ${
          compact ? "h-9 w-9" : "h-9 w-9 md:h-11 md:w-11"
        } shrink-0 place-items-center rounded-md bg-primary-50 ring-1 ring-inset ring-black/5 transition-transform duration-200 group-hover:scale-105`}
      >
        <Users className="h-[18px] w-[18px] text-primary md:h-[22px] md:w-[22px]" />
      </div>
    </div>
  );
}

/* ── Variant A — Total + two tinted pills (Option A) ─────────────────────── */

function VariantA() {
  return (
    <article aria-label="Total Mobilised" className={SHELL}>
      <AccentBar />
      <Header />
      <div className="grid grid-cols-2 gap-xs">
        <div className="rounded-md bg-primary-50/70 p-xs ring-1 ring-inset ring-primary-100">
          <div className="flex items-center gap-xxs text-label-3 font-medium text-foreground-muted">
            <Home aria-hidden className="h-3 w-3 text-primary" /> Shelter Home
          </div>
          <div className="mt-0.5 text-body-1 font-bold tabular-nums text-foreground">{SHELTER}</div>
        </div>
        <div className="rounded-md bg-info-50 p-xs ring-1 ring-inset ring-info-100">
          <div className="flex items-center gap-xxs text-label-3 font-medium text-foreground-muted">
            <Baby aria-hidden className="h-3 w-3 text-info-600" /> Child Rehab
          </div>
          <div className="mt-0.5 text-body-1 font-bold tabular-nums text-foreground">{CHILD}</div>
        </div>
      </div>
    </article>
  );
}

/* ── Variant B — Total + stacked list with mini progress bars (Option B) ─── */

function BarRow({
  icon,
  label,
  value,
  pct,
  fill,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pct: number;
  fill: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-xs">
        <div className="flex items-center gap-xxs text-label-2 font-medium text-foreground-muted">
          {icon} {label}
        </div>
        <div className="text-label-1 font-bold tabular-nums text-foreground">{value}</div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function VariantB() {
  return (
    <article aria-label="Total Mobilised" className={SHELL}>
      <AccentBar />
      <Header />
      <div className="space-y-sm">
        <BarRow
          icon={<Home aria-hidden className="h-3 w-3 text-primary" />}
          label="Shelter Home"
          value={SHELTER}
          pct={SHELTER_PCT}
          fill="bg-primary"
        />
        <BarRow
          icon={<Baby aria-hidden className="h-3 w-3 text-info-600" />}
          label="Child Rehab"
          value={CHILD}
          pct={CHILD_PCT}
          fill="bg-info-500"
        />
      </div>
    </article>
  );
}

/* ── Variant C — Single stacked bar + inline legend (Option C) ───────────── */

function VariantC() {
  return (
    <article aria-label="Total Mobilised" className={SHELL}>
      <AccentBar />
      <Header />
      <div className="space-y-sm">
        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-100"
          role="img"
          aria-label={`Shelter Home ${SHELTER_PCT}%, Child Rehab ${CHILD_PCT}%`}
        >
          <div className="h-full bg-primary" style={{ width: `${SHELTER_PCT}%` }} />
          <div className="h-full bg-info-500" style={{ width: `${CHILD_PCT}%` }} />
        </div>
        <div className="flex items-center justify-between gap-xs text-label-2">
          <div className="flex items-center gap-xxs text-foreground-muted">
            <span aria-hidden className="h-2 w-2 rounded-full bg-primary" />
            Shelter Home
            <span className="font-bold tabular-nums text-foreground">{SHELTER}</span>
          </div>
          <div className="flex items-center gap-xxs text-foreground-muted">
            <span aria-hidden className="h-2 w-2 rounded-full bg-info-500" />
            Child Rehab
            <span className="font-bold tabular-nums text-foreground">{CHILD}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Variant D — Total header + vertical split of two mini-stats ─────────── */

function VariantD() {
  return (
    <article aria-label="Total Mobilised" className={SHELL}>
      <AccentBar />
      <Header />
      <div className="grid grid-cols-2 divide-x divide-stroke-200 border-t border-stroke-100 pt-sm">
        <div className="flex flex-col items-center gap-0.5 px-xs text-center">
          <div className="flex items-center gap-xxs text-label-3 font-medium uppercase tracking-[0.06em] text-foreground-muted">
            <Home aria-hidden className="h-3 w-3 text-primary" /> Shelter
          </div>
          <div className="text-body-1 font-bold tabular-nums text-foreground">{SHELTER}</div>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-xs text-center">
          <div className="flex items-center gap-xxs text-label-3 font-medium uppercase tracking-[0.06em] text-foreground-muted">
            <Baby aria-hidden className="h-3 w-3 text-info-600" /> Child Rehab
          </div>
          <div className="text-body-1 font-bold tabular-nums text-foreground">{CHILD}</div>
        </div>
      </div>
    </article>
  );
}

/* ── Variant E — Compact: total + inline breakdown chips (lowest height) ─── */

function VariantE() {
  return (
    <article aria-label="Total Mobilised" className={SHELL}>
      <AccentBar />
      <Header compact />
      <div className="flex flex-wrap items-center gap-xs">
        <span className="inline-flex items-center gap-xxs rounded-full bg-primary-50 px-2 py-0.5 text-label-3 font-semibold text-primary ring-1 ring-inset ring-primary-100">
          <Home aria-hidden className="h-3 w-3" /> Shelter
          <span className="tabular-nums">{SHELTER}</span>
        </span>
        <span className="inline-flex items-center gap-xxs rounded-full bg-info-50 px-2 py-0.5 text-label-3 font-semibold text-info-600 ring-1 ring-inset ring-info-100">
          <Baby aria-hidden className="h-3 w-3" /> Child Rehab
          <span className="tabular-nums">{CHILD}</span>
        </span>
      </div>
    </article>
  );
}

/* ── Variant F — Donut ring accent + legend rows ─────────────────────────── */

function DonutRing() {
  return (
    <svg viewBox="0 0 40 40" className="h-14 w-14 -rotate-90" role="img" aria-label="Split ring">
      <circle cx="20" cy="20" r="15.5" fill="none" strokeWidth="6" className="stroke-neutral-100" />
      <circle
        cx="20"
        cy="20"
        r="15.5"
        pathLength={100}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-primary"
        strokeDasharray={`${SHELTER_PCT} 100`}
      />
      <circle
        cx="20"
        cy="20"
        r="15.5"
        pathLength={100}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        className="stroke-info-500"
        strokeDasharray={`${CHILD_PCT} 100`}
        strokeDashoffset={-SHELTER_PCT}
      />
    </svg>
  );
}

function LegendRow({
  icon,
  label,
  value,
  dot,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dot: string;
}) {
  return (
    <div className="flex items-center justify-between gap-xs">
      <div className="flex items-center gap-xxs text-label-2 text-foreground-muted">
        <span aria-hidden className={`h-2 w-2 rounded-full ${dot}`} />
        {icon}
        {label}
      </div>
      <span className="text-label-1 font-bold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function VariantF() {
  return (
    <article aria-label="Total Mobilised" className={SHELL}>
      <AccentBar />
      <div className="flex items-center justify-between gap-md">
        <div className="min-w-0 space-y-1">
          <div className="text-label-3 font-semibold uppercase tracking-[0.08em] text-primary md:tracking-[0.1em]">
            Total Mobilised
          </div>
          <div className="text-num-lg font-bold leading-none tabular-nums text-foreground md:text-num-xl">
            {TOTAL}
          </div>
        </div>
        <DonutRing />
      </div>
      <div className="space-y-1 border-t border-stroke-100 pt-sm">
        <LegendRow
          dot="bg-primary"
          icon={<Home aria-hidden className="h-3 w-3 text-primary" />}
          label="Shelter Home"
          value={SHELTER}
        />
        <LegendRow
          dot="bg-info-500"
          icon={<Baby aria-hidden className="h-3 w-3 text-info-600" />}
          label="Child Rehab"
          value={CHILD}
        />
      </div>
    </article>
  );
}

/* ── sibling specs (real cards) for the in-context row ───────────────────── */

const SIBLINGS: KpiSpec[] = [
  {
    key: "identified",
    label: "Identified / Surveyed",
    value: 19810,
    icon: KPI_ICONS.identified,
    iconBg: "bg-info-50",
    iconColor: "text-info-600",
    labelColor: "text-info-600",
    delta: "+4.2%",
  },
  {
    key: "shelter",
    label: "Shelter Assigned",
    value: 6,
    icon: KPI_ICONS.shelter,
    iconBg: "bg-warning-50",
    iconColor: "text-warning-600",
    labelColor: "text-warning-600",
    delta: "+1.1%",
  },
  {
    key: "rehab",
    label: "Rehabilitated",
    value: 208,
    icon: KPI_ICONS.rehab,
    iconBg: "bg-success-50",
    iconColor: "text-success-600",
    labelColor: "text-success-600",
    delta: "+6.4%",
  },
  {
    key: "disbursed",
    label: "Fund Disbursed",
    value: 0,
    icon: KPI_ICONS.disbursed,
    iconBg: "bg-danger-50",
    iconColor: "text-danger-600",
    labelColor: "text-danger-600",
    format: "currency",
    meta: "Feb – May 2026",
  },
  {
    key: "utilised",
    label: "Fund Utilised",
    value: 0,
    icon: KPI_ICONS.utilised,
    iconBg: "bg-secondary-50",
    iconColor: "text-secondary-500",
    labelColor: "text-secondary-500",
    format: "currency",
    meta: "Feb – May 2026",
  },
];

/* ── gallery scaffolding ─────────────────────────────────────────────────── */

const VARIANTS = [
  { id: "A", title: "Total + two pills", note: "Recommended", el: <VariantA /> },
  { id: "B", title: "Stacked list + mini bars", note: "Data-dense", el: <VariantB /> },
  { id: "C", title: "Single stacked bar + legend", note: "Share-of-total", el: <VariantC /> },
  { id: "D", title: "Vertical split", note: "Two mini-stats", el: <VariantD /> },
  { id: "E", title: "Compact chips", note: "Lowest height", el: <VariantE /> },
  { id: "F", title: "Donut ring + legend", note: "Most visual", el: <VariantF /> },
];

export default function MobilisedOptionsPreview() {
  return (
    <div className="min-h-screen bg-neutral-50/60 p-lg md:p-2xl">
      <div className="mx-auto max-w-[1200px] space-y-2xl">
        <header className="space-y-1">
          <div className="text-label-3 font-semibold uppercase tracking-[0.1em] text-primary">
            SMILE · dashboard preview
          </div>
          <h1 className="text-heading-2 font-bold text-foreground">
            Mobilised aggregate card — layout options
          </h1>
          <p className="max-w-2xl text-body-2 text-foreground-muted">
            Six faithful variants of the restructured card. Total Mobilised{" "}
            <strong className="text-foreground">10,229</strong> = Shelter Home{" "}
            <strong className="text-foreground">7,579</strong> + Child Rehabilitation{" "}
            <strong className="text-foreground">2,650</strong>. Every variant keeps the real
            KpiCard shell (accent bar, tokens, one grid cell) so it drops straight into the 6-card
            row. Pick one and it goes live.
          </p>
        </header>

        {/* Gallery — 3-col grid at realistic cell width so rows align A·B·C / D·E·F */}
        <section className="grid items-start gap-lg [grid-template-columns:repeat(3,minmax(0,320px))]">
          {VARIANTS.map((v) => (
            <div key={v.id} className="space-y-sm">
              <div className="flex items-baseline justify-between gap-xs">
                <div className="min-w-0 truncate text-body-2 font-semibold text-foreground">
                  Option {v.id} · {v.title}
                </div>
                <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-label-3 font-semibold text-primary">
                  {v.note}
                </span>
              </div>
              {v.el}
            </div>
          ))}
        </section>

        {/* In-context: recommended Option A inside the real 6-card + rail grid */}
        <section className="space-y-md">
          <h2 className="text-heading-3 font-bold text-foreground">
            In context — Option A in the live 6-card row
          </h2>
          <div className="rounded-lg border border-stroke-200 bg-white p-lg">
            <div className="grid grid-cols-2 gap-sm md:gap-lg lg:grid-cols-[2fr_2fr_2fr_280px]">
              <KpiCard spec={SIBLINGS[0]} />
              <VariantA />
              <KpiCard spec={SIBLINGS[1]} />
              <div className="row-span-2 hidden rounded-lg border border-dashed border-stroke-200 bg-neutral-50/60 p-md lg:grid lg:place-items-center">
                <span className="text-label-2 text-foreground-hint">System Users rail</span>
              </div>
              <KpiCard spec={SIBLINGS[2]} />
              <KpiCard spec={SIBLINGS[3]} />
              <KpiCard spec={SIBLINGS[4]} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
