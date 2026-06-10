"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { FileText, Search, X, ExternalLink } from "lucide-react";

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

function SevChip({ label, count, color }: { label: string; count: number; color: string }) {
  if (!count) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
      {count} {label}
    </span>
  );
}

// ─── Portal card ──────────────────────────────────────────────────────────────

function PortalCard({ p }: { p: PortalReport }) {
  const total = p.findings.Blocker + p.findings.Major + p.findings.Minor;
  return (
    <Link
      href={p.href}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm transition hover:border-gov-blue hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gov-blue"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gov-blue-tonal text-gov-blue">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                Design QC
              </span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                Design Suggestions
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {p.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-ink group-hover:text-gov-blue transition-colors">
              {p.title}
            </h2>
            <p className="text-xs text-ink-muted">{p.subtitle}</p>
          </div>
        </div>
        <time className="flex-shrink-0 text-xs text-ink-muted">{p.date}</time>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1 text-xs text-ink-muted">
          <span className="font-semibold text-ink">{p.screens}</span> screens
        </div>
        <span className="text-border">·</span>
        <div className="flex items-center gap-1 text-xs text-ink-muted">
          <span className="font-semibold text-ink">{total}</span> findings
        </div>
        <span className="text-border">·</span>
        <div className="flex items-center gap-1 text-xs text-ink-muted">
          <span className="font-semibold text-ink">{p.suggestions}</span> suggestions
        </div>
      </div>

      {/* Severity chips */}
      <div className="flex flex-wrap gap-1.5">
        <SevChip label="Blocker" count={p.findings.Blocker} color="bg-red-100 text-red-700" />
        <SevChip label="Major"   count={p.findings.Major}   color="bg-orange-100 text-orange-700" />
        <SevChip label="Minor"   count={p.findings.Minor}   color="bg-amber-100 text-amber-700" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {p.tags.map((t) => (
          <span key={t} className="rounded bg-surface-muted px-1.5 py-0.5 text-xs font-medium text-ink-muted">
            #{t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs font-semibold text-gov-blue group-hover:gap-2.5 transition-all">
        <ExternalLink className="h-3.5 w-3.5" />
        View report
      </div>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return PORTALS;
    return PORTALS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }, [query]);

  const totalFindings = PORTALS.reduce(
    (s, p) => s + p.findings.Blocker + p.findings.Major + p.findings.Minor,
    0
  );
  const totalBlockers   = PORTALS.reduce((s, p) => s + p.findings.Blocker, 0);
  const totalSuggestions = PORTALS.reduce((s, p) => s + p.suggestions, 0);

  return (
    <main className="min-h-screen bg-surface-muted">
      {/* Page header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-[1280px] px-6 py-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gov-blue">
            MoSJE Digital Estate
          </p>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink">
            QC &amp; Audit Reports
          </h1>
          <p className="text-sm text-ink-muted">
            Design quality control audits and design suggestions for MoSJE digital properties.
          </p>

          {/* Summary stats */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "Portals audited", value: PORTALS.length,      color: "text-gov-blue" },
              { label: "Findings",         value: totalFindings,       color: "text-ink" },
              { label: "Blockers",         value: totalBlockers,       color: "text-red-600" },
              { label: "Suggestions",      value: totalSuggestions,    color: "text-purple-600" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="min-w-[90px] rounded-lg border border-border bg-surface px-4 py-3 text-center"
              >
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-ink-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto max-w-[1280px] flex items-center gap-4 px-6 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              placeholder="Search portals or tags…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-gov-blue focus:outline-none focus:ring-1 focus:ring-gov-blue"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <span className="ml-auto text-xs text-ink-muted">
            {filtered.length} of {PORTALS.length} portal{PORTALS.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Portal grid */}
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-12 w-12 text-ink-muted/30 mb-4" />
            <p className="text-sm font-semibold text-ink">No portals match your search</p>
            <button
              onClick={() => setQuery("")}
              className="mt-3 text-xs font-semibold text-gov-blue hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PortalCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {/* Coming next */}
        <div className="mt-10 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Coming next</p>
          <p className="text-sm text-ink-muted">
            eUtthan Ministry role audit · Accessibility compliance report (WCAG 2.1 AA) ·
            PM-AJAY portal QC · SMILE Admin portal QC
          </p>
        </div>
      </div>
    </main>
  );
}
