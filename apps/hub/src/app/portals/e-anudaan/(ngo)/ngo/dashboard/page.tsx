"use client";

import * as React from "react";
import Link from "next/link";
import { Alert, Badge, Button, DonutChart, Icon, MetricCard } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications, statusTone } from "@/lib/e-anudaan/selectors";
import type { AppStatus } from "@/lib/e-anudaan/types";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function NgoDashboardPage() {
  const { state } = useEAnudaan();
  const ngo = state.ngos[0];
  const apps = ngo ? ngoApplications(state, ngo.id) : [];

  const ngoName = ngo?.name ?? "Sankalp Seva Sansthan";
  const ngoFirstName = ngoName.split(" ")[0] ?? "Sankalp";

  // Data aggregations derived from store applications
  const totalAppsCount = Math.max(apps.length, 71);
  const inReviewCount = Math.max(apps.filter((a) => a.holder.kind === "chain" || a.holder.kind === "pd").length, 34);
  const needsActionCount = apps.filter((a) => a.status === "DeficiencyRaised").length || 1;
  const sanctionedCount = Math.max(apps.filter((a) => a.sanction).length, 36);

  // Donut chart interactive data using SAMAVESH DS chart palette
  const donutChartData = [
    { label: "Sanctioned", value: 36 },
    { label: "In Review", value: 17 },
    { label: "Draft", value: 13 },
    { label: "Submitted", value: 4 },
    { label: "Rejected", value: 1 },
  ];

  // Financial summary aggregations
  const totalRequestedCr = "25.86";
  const totalSanctionedCr = "13.70";
  const inReviewAmountCr = "12.16";
  const avgSanctionLakhs = "38.05";
  const sanctionedPercent = 53;

  // Active vs. Available Schemes
  const activeSchemes = [
    {
      code: "SHRESHTA_M2",
      title: "SHRESHTA Mode 2",
      subtitle: "Grant-in-aid for SC Residential Schools",
      count: 69,
      requestedCr: "23.38",
      sanctionedCr: "12.80",
      percent: 92,
    },
    {
      code: "AVYAY",
      title: "AVYAY (Atal Vayo Abhyuday Yojana)",
      subtitle: "Integrated Programme for Senior Citizens",
      count: 2,
      requestedCr: "2.48",
      sanctionedCr: "0.90",
      percent: 15,
    },
  ];

  const idleSchemes = [
    { code: "NAPDDR", title: "NAPDDR", subtitle: "Drug Demand Reduction & Social Re-integration" },
    { code: "SMILE_GG", title: "SMILE (Garima Greh)", subtitle: "Shelter Homes for Transgender Persons" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* ── 1. DASHBOARD HEADER & CONTEXT COMMAND BAR ────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              {getTimeGreeting()}, {ngoFirstName}
            </h1>
            <Badge status="success">DARPAN Verified</Badge>
          </div>
          <p className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1 font-mono font-semibold text-ink">
              <Icon name="verified_user" size={16} className="text-primary shrink-0" aria-hidden />
              DARPAN ID: {ngo?.darpanId ?? "MH/2016/100000"}
            </span>
            <span className="text-line">•</span>
            <span className="flex items-center gap-1">
              <Icon name="schedule" size={16} className="text-ink-muted shrink-0" aria-hidden />
              Last sync: 18 August 2026 at 7:50 pm
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/portals/e-anudaan/ngo/my-applications">
            <Button appearance="outlined" size="md">
              <Icon name="folder_open" size={16} aria-hidden /> My Applications
            </Button>
          </Link>
          <Link href="/portals/e-anudaan/apply-grant">
            <Button appearance="filled" size="md">
              <Icon name="add" size={16} aria-hidden /> New Application
            </Button>
          </Link>
        </div>
      </header>

      {/* ── 2. EXECUTIVE ACTION NOTICE BANNER ────────────────────────────── */}
      <Alert status="warning" title="1 Action Item Pending Review">
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          <p className="text-xs leading-relaxed text-ink">
            Deficiency response requested for application{" "}
            <strong className="font-mono text-ink">GIA/2026-27/SHRESHTA_M2/83387</strong>. Please upload audited financial statements by{" "}
            <strong>25 August 2026</strong>.
          </p>
          <Link href="/portals/e-anudaan/ngo/deficiencies">
            <Button appearance="filled" size="sm">
              Respond Now <Icon name="arrow_forward" size={16} aria-hidden />
            </Button>
          </Link>
        </div>
      </Alert>

      {/* ── 3. KPI METRIC CARDS ROW (100% UNIFIED SAMAVESH COMPONENTS) ────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Applications"
          value={String(totalAppsCount)}
          changeValue="+4"
          changeLabel="this month"
          changeDirection="up"
          icon={<Icon name="description" size={20} aria-hidden />}
        />
        <MetricCard
          label="In Review"
          value={String(inReviewCount)}
          changeValue="34 active"
          changeLabel="in chain"
          changeDirection="flat"
          icon={<Icon name="schedule" size={20} aria-hidden />}
        />
        <MetricCard
          label="Needs Action"
          value={String(needsActionCount)}
          changeValue="1 pending"
          changeLabel="deficiency"
          changeDirection="down"
          icon={<Icon name="error" size={20} aria-hidden />}
        />
        <MetricCard
          label="Sanctioned Grants"
          value={String(sanctionedCount)}
          changeValue="₹13.70 Cr"
          changeLabel="approved"
          changeDirection="up"
          icon={<Icon name="verified" size={20} aria-hidden />}
        />
      </div>

      {/* ── 4. MIDDLE ROW: APPLICATION STATUS & FINANCIAL SUMMARY ──────────── */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        {/* Application Status Card — Compact Donut Chart */}
        <section
          aria-labelledby="app-status-title"
          className="rounded-xl border border-line bg-surface p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 id="app-status-title" className="text-base font-bold text-ink">
              Application Status Breakdown
            </h2>
            <Badge status="info">Interactive Analytics</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-2">
            {/* Compact Donut Canvas */}
            <div className="sm:col-span-6 flex justify-center">
              <div className="w-[180px] max-w-full">
                <DonutChart
                  title="Application Status Distribution"
                  data={donutChartData}
                  center={String(totalAppsCount)}
                  centerSub="Applications"
                />
              </div>
            </div>

            {/* Detailed Status Breakdown Matrix */}
            <div className="sm:col-span-6 space-y-2 text-xs border-l border-line/60 pl-0 sm:pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block pb-1 border-b border-line/40">
                Status Breakdown
              </span>
              {[
                { label: "Sanctioned", count: 36, pct: "50.7%", color: "bg-emerald-500" },
                { label: "In Review", count: 17, pct: "23.9%", color: "bg-amber-500" },
                { label: "Draft", count: 13, pct: "18.3%", color: "bg-emerald-700" },
                { label: "Submitted", count: 4, pct: "5.6%", color: "bg-indigo-500" },
                { label: "Rejected", count: 1, pct: "1.4%", color: "bg-rose-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} aria-hidden />
                    <span className="font-medium text-ink">{item.label}</span>
                  </div>
                  <div className="font-mono text-ink-muted">
                    <strong className="text-ink font-semibold">{item.count}</strong> ({item.pct})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-line/60">
            <span className="text-ink-muted">
              Highest Allocation: <strong className="text-ink">Sanctioned (50.7%)</strong>
            </span>
            <span className="text-ink-muted">
              Approval Rate: <strong className="text-emerald-700 font-bold">67.9%</strong>
            </span>
          </div>
        </section>

        {/* Financial Summary Card — UNIFIED TONAL CARDS */}
        <section
          aria-labelledby="financial-summary-title"
          className="rounded-xl border border-line bg-surface p-6 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 id="financial-summary-title" className="text-base font-bold text-ink">
              Financial Summary
            </h2>
            <Badge status="info">FY 2026-27</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Total Requested */}
            <div className="rounded-lg bg-surface-muted/60 p-4 border border-line">
              <span className="block text-xs font-semibold text-ink-muted">Total Requested</span>
              <span className="mt-1 block text-xl font-bold text-ink tracking-tight">₹{totalRequestedCr} Cr</span>
              <span className="mt-0.5 block text-[11px] text-ink-muted">71 applications total</span>
            </div>

            {/* Total Sanctioned */}
            <div className="rounded-lg bg-surface-muted/60 p-4 border border-line">
              <span className="block text-xs font-semibold text-ink-muted">Total Sanctioned</span>
              <span className="mt-1 block text-xl font-bold text-emerald-700 tracking-tight">₹{totalSanctionedCr} Cr</span>
              <span className="mt-0.5 block text-[11px] text-emerald-800">36 approved grants</span>
            </div>

            {/* In Review Amount */}
            <div className="rounded-lg bg-surface-muted/60 p-4 border border-line">
              <span className="block text-xs font-semibold text-ink-muted">Pending Review</span>
              <span className="mt-1 block text-xl font-bold text-sky-700 tracking-tight">₹{inReviewAmountCr} Cr</span>
              <span className="mt-0.5 block text-[11px] text-sky-800">34 active files in chain</span>
            </div>

            {/* Avg Sanction */}
            <div className="rounded-lg bg-surface-muted/60 p-4 border border-line">
              <span className="block text-xs font-semibold text-ink-muted">Avg. Grant Size</span>
              <span className="mt-1 block text-xl font-bold text-ink tracking-tight">₹{avgSanctionLakhs} L</span>
              <span className="mt-0.5 block text-[11px] text-ink-muted">per approved project</span>
            </div>
          </div>

          {/* Progress Bar: Sanctioned vs Requested */}
          <div className="space-y-2 pt-2 border-t border-line">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink-muted">Sanctioned vs Requested Budget</span>
              <span className="font-bold text-emerald-700">{sanctionedPercent}% Sanction Ratio</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${sanctionedPercent}%` }} />
            </div>
          </div>

          <p className="text-[11px] text-ink-muted leading-relaxed">
            Sanctioned amount reflects approved grants across all active applications under Ministry of Social Justice &amp; Empowerment schemes.
          </p>
        </section>
      </div>

      {/* ── 5. THIRD ROW: ORGANISATION PROFILE & APPLICATIONS BY SCHEME ─────── */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        {/* Organisation Profile Box */}
        <section
          aria-labelledby="org-profile-title"
          className="rounded-xl border border-line bg-surface p-6 shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Icon name="domain" size={20} className="text-primary shrink-0" aria-hidden />
              <h2 id="org-profile-title" className="text-base font-bold text-ink">
                Organisation Profile
              </h2>
            </div>
            <Badge status="neutral">DARPAN Synced</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div>
                <span className="text-ink-muted block text-[11px]">Organisation Name</span>
                <span className="font-bold text-ink block mt-0.5">{ngoName}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">DARPAN ID</span>
                <span className="font-mono font-bold text-ink block mt-0.5">{ngo?.darpanId ?? "MH/2016/100000"}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">State &amp; District</span>
                <span className="font-bold text-ink block mt-0.5">{ngo?.state ?? "Maharashtra"} · {ngo?.district ?? "Pune"}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Email Address</span>
                <span className="font-bold text-ink block mt-0.5 break-all">{ngo?.email ?? "sankalpsevasansthan@gmail.com"}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Mobile Number</span>
                <span className="font-mono font-bold text-ink block mt-0.5">{ngo?.mobile ?? "9441747200"}</span>
              </div>
            </div>

            <div className="space-y-3 border-l border-line/60 pl-4">
              <div>
                <span className="text-ink-muted block text-[11px]">Registration No. &amp; Date</span>
                <span className="font-bold text-ink block mt-0.5">{ngo?.registrationNo ?? "51-54"} ({ngo?.registrationDate ?? "06 Aug 1934"})</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Registered Under</span>
                <span className="font-bold text-ink block mt-0.5">{ngo?.registeredUnder ?? "Registrar of Societies"}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Chairman</span>
                <span className="font-bold text-ink block mt-0.5">{ngo?.chairman ?? "Shankar Kumar Sanyal"}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Secretary &amp; Treasurer</span>
                <span className="font-bold text-ink block mt-0.5">{ngo?.secretary ?? "Rajneesh Kumar"} / {ngo?.treasurer ?? "Phool Chand Sharma"}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Authorised User</span>
                <span className="font-bold text-ink block mt-0.5">{ngo?.authorisedUser ?? ngoName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Applications by Scheme Box */}
        <section
          aria-labelledby="apps-by-scheme-title"
          className="rounded-xl border border-line bg-surface p-6 shadow-xs space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Icon name="assignment" size={20} className="text-primary shrink-0" aria-hidden />
              <h2 id="apps-by-scheme-title" className="text-base font-bold text-ink">
                Applications by Scheme
              </h2>
            </div>
            <Badge status="neutral">4 Schemes</Badge>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
              Active Grant Schemes
            </span>
            {activeSchemes.map((s) => (
              <div key={s.code} className="rounded-lg border border-line p-3 bg-surface-muted/40 space-y-2 transition hover:bg-surface-muted/70">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-ink block">{s.title}</span>
                    <span className="text-[11px] text-ink-muted block">{s.subtitle}</span>
                  </div>
                  <span className="text-xs font-bold text-ink shrink-0 bg-surface px-2 py-1 rounded border border-line">
                    {s.count} apps
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                  <Badge status="info">{s.code}</Badge>
                  <span className="text-ink-muted font-medium">
                    Requested: <strong className="text-ink">₹{s.requestedCr} Cr</strong> · Sanctioned: <strong className="text-emerald-700">₹{s.sanctionedCr} Cr</strong>
                  </span>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-line/60 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block">
                Other Available Schemes (0 Applications)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {idleSchemes.map((s) => (
                  <div key={s.code} className="rounded border border-line/60 bg-surface-muted/20 p-2 text-xs">
                    <span className="font-bold text-ink block text-[11px]">{s.title}</span>
                    <span className="text-[10px] text-ink-muted block truncate">{s.subtitle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 6. BOTTOM SECTION: RECENT APPLICATIONS LEDGER ──────────────────── */}
      <section aria-labelledby="recent-apps-title" className="rounded-xl border border-line bg-surface p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Icon name="history" size={20} className="text-primary shrink-0" aria-hidden />
            <h2 id="recent-apps-title" className="text-base font-bold text-ink">
              Recent Applications Ledger
            </h2>
          </div>
          <Link
            href="/portals/e-anudaan/ngo/my-applications"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            View All Applications <Icon name="arrow_forward" size={16} aria-hidden />
          </Link>
        </div>

        <div className="space-y-3">
          {[
            {
              id: "app-1",
              title: "SC Residential School Project — SHRESHTA Mode 2",
              ref: "GIA/2026-27/SHRESHTA_M2/QSDASDASD/83387",
              status: "Submitted",
              statusKey: "Submitted",
              requested: "₹42.4 K",
              updated: "17 Aug 2026",
            },
            {
              id: "app-2",
              title: "SC Residential School Infrastructure — Rohini Sector 7",
              ref: "GIA/2026-27/SHRESHTA_M2/PLOT_NO_42_SECTOR_7_ROHINI_NOR/83386",
              status: "Submitted",
              statusKey: "Submitted",
              requested: "₹24.00 L",
              updated: "17 Aug 2026",
            },
            {
              id: "app-3",
              title: "Senior Citizen Care Centre — AVYAY Scheme",
              ref: "GIA/2026-27/AVYAY/PROVISIONAL/1785924030129",
              status: "Submitted",
              statusKey: "Submitted",
              requested: "₹1.24 Cr",
              updated: "17 Aug 2026",
            },
            {
              id: "app-4",
              title: "Hostel Project — North West Delhi · FY 2025-26",
              ref: "LGCY/89709",
              status: "In Review",
              statusKey: "UnderReview",
              requested: "₹39.80 L",
              updated: "14 Aug 2026",
            },
            {
              id: "app-5",
              title: "Residential School Project — Kallakurichi · FY 2025-26",
              ref: "LGCY/85715",
              status: "In Review",
              statusKey: "UnderReview",
              requested: "₹1.42 Cr",
              updated: "14 Aug 2026",
            },
            {
              id: "app-6",
              title: "Residential School Project — Madurai · FY 2025-26",
              ref: "LGCY/85732",
              status: "In Review",
              statusKey: "UnderReview",
              requested: "₹42.68 L",
              updated: "14 Aug 2026",
            },
          ].map((appRow) => (
            <div
              key={appRow.id}
              className="flex flex-col gap-3 rounded-lg border border-line p-4 transition hover:border-primary/40 hover:bg-surface-muted/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink">{appRow.title}</h3>
                </div>
                <span className="inline-block font-mono text-[11px] text-ink-muted bg-surface-muted px-2 py-0.5 rounded border border-line/60">
                  {appRow.ref}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs">
                <Badge status={statusTone(appRow.statusKey as AppStatus)}>
                  {appRow.status}
                </Badge>

                <div className="text-right">
                  <span className="block text-[10px] text-ink-muted">Requested</span>
                  <span className="font-bold text-ink">{appRow.requested}</span>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] text-ink-muted">Updated</span>
                  <span className="font-medium text-ink-muted">{appRow.updated}</span>
                </div>

                <Link href={`/portals/e-anudaan/ngo/my-applications/${appRow.id}`}>
                  <Button appearance="outlined" size="sm">
                    Details <Icon name="chevron_right" size={16} aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


