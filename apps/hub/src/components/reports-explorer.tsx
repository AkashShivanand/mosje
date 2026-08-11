"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Icon } from "@mosje/design-system";

// ─── Portal report registry ───────────────────────────────────────────────────

interface PortalReport {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  date: string;
  screens: number;
  findings: { Blocker: number; Major: number; Minor: number };
  suggestions: number;
  tags: string[];
  status: "Final" | "Draft" | "In Review";
}

const PORTALS: PortalReport[] = [
  {
    id: "scw",
    title: "SCW — Senior Citizens Welfare",
    subtitle: "Design QC (UAT) — Public · Admin · User",
    href: "/reports/scw",
    date: "2026-06-18",
    screens: 18,
    findings: { Blocker: 3, Major: 23, Minor: 37 },
    suggestions: 0,
    tags: ["scw", "senior-citizens", "uat", "june-2026"],
    status: "Final",
  },
  {
    id: "eutthan-admin",
    title: "eUtthan Admin",
    subtitle: "Design QC + Design Suggestions",
    href: "/reports/eutthan-admin",
    date: "2026-06-10",
    screens: 10,
    findings: { Blocker: 4, Major: 24, Minor: 15 },
    suggestions: 10,
    tags: ["eutthan", "admin", "june-2026"],
    status: "Final",
  },
];

// ─── Severity chip ────────────────────────────────────────────────────────────

function SevChip({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: { bg: string; fg: string };
}) {
  if (!count) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: tone.bg, color: tone.fg }}
    >
      <span className="font-bold">{count}</span>
      {label}
    </span>
  );
}

const SEV = {
  blocker: { bg: "color-mix(in srgb, var(--ds-danger) 14%, transparent)", fg: "var(--ds-danger)" },
  major: { bg: "color-mix(in srgb, var(--ds-saffron) 16%, transparent)", fg: "var(--ds-saffron-dark)" },
  minor: { bg: "color-mix(in srgb, var(--ds-warning) 24%, transparent)", fg: "var(--ds-ink)" },
};

function ReportCard({ p }: { p: PortalReport }) {
  const total = p.findings.Blocker + p.findings.Major + p.findings.Minor;
  return (
    <Link
      href={p.href}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-tonal text-primary">
            <Icon name="description" size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-bold text-ink transition-colors group-hover:text-primary">
              {p.title}
            </h2>
            <p className="text-xs text-ink-muted">{p.subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-success-tonal px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-success">
          {p.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span><span className="font-semibold text-ink">{p.screens}</span> screens</span>
        <span aria-hidden="true" className="text-border">·</span>
        <span><span className="font-semibold text-ink">{total}</span> findings</span>
        <span aria-hidden="true" className="text-border">·</span>
        <span><span className="font-semibold text-ink">{p.suggestions}</span> suggestions</span>
        <time className="ml-auto">{p.date}</time>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <SevChip label="Blocker" count={p.findings.Blocker} tone={SEV.blocker} />
        <SevChip label="Major" count={p.findings.Major} tone={SEV.major} />
        <SevChip label="Minor" count={p.findings.Minor} tone={SEV.minor} />
      </div>

      <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
        View report
        <Icon name="arrow_forward" size={16} aria-hidden="true" />
      </div>
    </Link>
  );
}

export function ReportsExplorer() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return PORTALS;
    return PORTALS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)),
    );
  }, [query]);

  const totalFindings = PORTALS.reduce(
    (s, p) => s + p.findings.Blocker + p.findings.Major + p.findings.Minor,
    0,
  );
  const totalBlockers = PORTALS.reduce((s, p) => s + p.findings.Blocker, 0);
  const totalSuggestions = PORTALS.reduce((s, p) => s + p.suggestions, 0);

  const stats = [
    { label: "Portals audited", value: PORTALS.length, color: "text-primary" },
    { label: "Findings", value: totalFindings, color: "text-ink" },
    { label: "Blockers", value: totalBlockers, color: "text-danger" },
    { label: "Suggestions", value: totalSuggestions, color: "text-primary" },
  ];

  return (
    <>
      {/* Summary stats */}
      <dl className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface px-4 py-3"
          >
            <dd className={`text-2xl font-bold ${color}`}>{value}</dd>
            <dt className="text-xs text-ink-muted">{label}</dt>
          </div>
        ))}
      </dl>

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative w-full max-w-xs">
          <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search reports or tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search reports"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-9 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-muted hover:text-ink"
            >
              <Icon name="close" size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="ml-auto text-xs text-ink-muted" role="status" aria-live="polite">
          {filtered.length} of {PORTALS.length}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Icon name="description" size={40} className="mb-3 text-ink-muted/40" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink">No reports match your search</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ReportCard key={p.id} p={p} />
          ))}
        </div>
      )}

      {/* Coming next */}
      <div className="mt-10 rounded-2xl border border-dashed border-border p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
          Coming next
        </p>
        <p className="text-sm leading-relaxed text-ink-muted">
          eUtthan Ministry role audit · Accessibility compliance report (WCAG
          2.1 AA) · PM-AJAY portal QC · SMILE Admin portal QC
        </p>
      </div>
    </>
  );
}
