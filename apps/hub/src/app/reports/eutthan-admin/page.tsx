"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import auditRaw from "@/data/eutthan-admin-audit.json";
import figureManifest from "@/data/eutthan-admin-figures.json";
import { Divider, Icon } from "@mosje/design-system";

// Annotation boards that actually exist on disk (public/reports/eutthan-admin/
// figures). The audit data generates more (slug-section) combinations than were
// rendered, so we gate each board on this manifest to avoid 404s for the ones
// that were never produced. Regenerate after adding/removing figures:
//   node -e 'const fs=require("fs");fs.writeFileSync("apps/hub/src/data/eutthan-admin-figures.json",JSON.stringify(fs.readdirSync("apps/hub/public/reports/eutthan-admin/figures").filter(f=>f.endsWith(".png")).sort(),null,2)+"\n")'
const FIGURES = new Set(figureManifest as string[]);

// ─── Types ───────────────────────────────────────────────────────────────────

type Sev = "Blocker" | "Major" | "Minor" | "Nit";
type SugSev = "Critical" | "High" | "Medium" | "Low";
type Tab = "qc" | "suggestions";

interface Finding {
  num: number;
  id: string;
  element: string;
  section: string;
  sectionBox?: number[];
  axis: string;
  severity: Sev;
  figma: string;
  live: string;
  fix: string;
}
interface Screen {
  slug: string;
  name: string;
  note?: string | null;
  figmaUrl?: string;
  liveUrl?: string | null;
  findings: Finding[];
}
interface Suggestion {
  id: string;
  category: string;
  severity: SugSev;
  title: string;
  context: string;
  current: string;
  proposed: string;
  rationale: string;
  action: string;
  figmaRef: string;
}

const audit = auditRaw as { portal: string; generated: string; screens: Screen[] };

// ─── Design suggestions data ──────────────────────────────────────────────────

const SUGGESTIONS: Suggestion[] = [
  {
    id: "DS-PRG-001",
    category: "Program-Level Decisions",
    severity: "Critical",
    title: "Adopt DS typography scale",
    context: "All portal screens use hardcoded font sizes (14px body, 30px headings) that diverge from the DS type ramp.",
    current: "Hardcoded: 14px body · 30px H1 · 20px H2 — no token references",
    proposed: "Map to DS tokens: text-sm (14px) · text-3xl (28px) · text-xl (20px). Every text element bound to a token.",
    rationale: "Typography divergence compounds with each new screen. A single token migration now prevents 20× the rework later.",
    action: "Create a typography token map. Replace all hardcoded sizes in one PR per portal screen.",
    figmaRef: "DS Library → Typography → Type Scale",
  },
  {
    id: "DS-PRG-002",
    category: "Program-Level Decisions",
    severity: "Critical",
    title: "Replace hardcoded colors with DS tokens",
    context: "47 findings include numerous hardcoded hex values (#003366, #374151, #e5eff9, #f9fafb) that should reference DS color tokens.",
    current: "color: #003366 · bg: #e5eff9 · border: #e2e8f0 — hardcoded throughout",
    proposed: "var(--color-primary) · var(--color-primary-50) · var(--color-stroke-200)",
    rationale: "Token drift means design updates require hunt-and-replace across all screens instead of a single variable change.",
    action: "Add a CSS custom-property layer to the portal globals. Map all hardcoded colors in one pass.",
    figmaRef: "DS Library → Colors → Semantic tokens",
  },
  {
    id: "DS-PRG-003",
    category: "Program-Level Decisions",
    severity: "High",
    title: "Enforce 4px grid-aligned spacing",
    context: "Cell padding, button sizes, and gaps use mixed values (py 14, py 16, py 20, py 24) not consistently on the 4px grid.",
    current: "Inconsistent: py-3.5 · py-5 · py-6 throughout tables and buttons",
    proposed: "4px grid tokens: space-2 (8px) · space-4 (16px) · space-6 (24px). Single source of truth.",
    rationale: "Spacing inconsistency across 10 screens creates a rhythmically uneven UI that reads as unpolished.",
    action: "Audit all py/px values. Map to nearest 4px token. Priority: table rows and button padding.",
    figmaRef: "DS Library → Spacing → 4px grid",
  },
  {
    id: "DS-PRG-004",
    category: "Program-Level Decisions",
    severity: "Medium",
    title: "Standardise border-radius to DS tokens",
    context: "Mixed radii (8px, 12px, 14px, 16px) used without token references across cards, buttons, and chips.",
    current: "Card: 14px · Button: 8px · Badge: 12px · Active nav: 8px (Figma spec: 16px)",
    proposed: "radius-sm (4px) · radius-md (8px) · radius-lg (12px) · radius-xl (16px) — DS token references.",
    rationale: "Radius inconsistency is immediately visible in dense table views where cards and badges appear together.",
    action: "Replace all hardcoded radius values with DS radius tokens in one refactor pass.",
    figmaRef: "DS Library → Tokens → Border Radius",
  },
  {
    id: "DS-ADMIN-001",
    category: "Frame-Level Fixes",
    severity: "High",
    title: "Align data table to DS Table component spec",
    context: "Every screen with a data table (7/10 screens) has the same three deviations: row height, header bg, body font-size.",
    current: "Row height 53–84px · header bg transparent/#f3f4f6 · body 14px · px 16px",
    proposed: "Row height 56px (header) / 116px (body) · header bg #f9fafb · body 16px · px 24px",
    rationale: "Fixing at the DS component level fixes all 7 screens simultaneously. Highest-leverage single fix in this audit.",
    action: "Update the shared Table component styles. All screens inherit the fix immediately.",
    figmaRef: "DS Library → Components → Table",
  },
  {
    id: "DS-ADMIN-002",
    category: "Frame-Level Fixes",
    severity: "High",
    title: "Align status badge to DS Badge component spec",
    context: "UTH-FY-003 flagged the Status column is missing entirely on Financial Year. Where badges appear, radius and fill deviate.",
    current: "Status badge: inconsistent radius · fill varies · absent on Financial Year screen",
    proposed: "Active: fill #27682a · text #fff · radius 12px · px 12 / py 4 · h 28. Inactive: outlined variant.",
    rationale: "Status visibility is a core functional requirement — admins can't distinguish active/inactive records at a glance.",
    action: "Implement the DS Badge component with Active/Inactive variants. Restore the Status column in Financial Year.",
    figmaRef: "DS Library → Components → Badge",
  },
  {
    id: "DS-ADMIN-011",
    category: "No-Design Screens",
    severity: "High",
    title: "Design the Role Management screen",
    context: "Role management exists live but has no Figma counterpart. No design source of truth means QC is impossible.",
    current: "No Figma frame for role management.",
    proposed: "DS table + DS badge for role status + DS outlined/primary buttons for actions. Reuse table pattern from Financial Year.",
    rationale: "Without a design source of truth, the build will continue to drift from DS standards with every new feature.",
    action: "Create Figma frame for Role Management. Reuse the table + toolbar pattern established in Financial Year.",
    figmaRef: "MoSJE Portal Handoff → New frame: Role Management",
  },
  {
    id: "DS-ADMIN-012",
    category: "No-Design Screens",
    severity: "Medium",
    title: "Design the PFMS Logs screen",
    context: "PFMS integration logs are live but undesigned. PFMS data is sensitive — a structured layout is operationally critical.",
    current: "No Figma frame for PFMS logs.",
    proposed: "Read-only data table with timestamp, operation, status, and error columns using DS table + badge components.",
    rationale: "Structured log views with clear status indicators aid admin review and accelerate error identification.",
    action: "Create Figma frame for PFMS Logs. Prioritise DS Badge usage for log entry status (success/failure/pending).",
    figmaRef: "MoSJE Portal Handoff → New frame: PFMS Logs",
  },
  {
    id: "DS-ADMIN-013",
    category: "No-Design Screens",
    severity: "Medium",
    title: "Design the Reports/Analytics screen",
    context: "A reports/analytics dashboard is referenced in portal navigation but has no Figma design.",
    current: "No Figma frame for reports/analytics.",
    proposed: "KPI summary cards (reuse Dashboard pattern) + DS chart components + date range filter chip.",
    rationale: "Analytics screens require deliberate data hierarchy decisions — undesigned builds produce cluttered, unreadable dashboards.",
    action: "Create Figma frame for Reports. Reuse KPI card pattern from Dashboard; add chart area with DS chart tokens.",
    figmaRef: "MoSJE Portal Handoff → New frame: Reports/Analytics",
  },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

// pinBg is applied as an inline background on the map pins, so it takes DS
// custom properties directly. The red → saffron → amber → neutral severity ramp
// is preserved, just sourced from tokens instead of raw Tailwind hex.
const SEV: Record<Sev, { pill: string; border: string; pinBg: string }> = {
  Blocker: { pill: "bg-red-100 text-red-700",      border: "border-l-red-500",    pinBg: "var(--sa-color-status-danger)" },
  Major:   { pill: "bg-orange-100 text-orange-700", border: "border-l-orange-500", pinBg: "var(--sa-color-secondaryScale-700)" },
  Minor:   { pill: "bg-amber-100 text-amber-700",   border: "border-l-amber-400",  pinBg: "var(--sa-color-status-warning)" },
  Nit:     { pill: "bg-slate-100 text-slate-600",   border: "border-l-slate-300",  pinBg: "var(--sa-color-neutralScale-500)" },
};

const SSEV: Record<SugSev, { pill: string; border: string }> = {
  Critical: { pill: "bg-red-100 text-red-700",      border: "border-l-red-500" },
  High:     { pill: "bg-orange-100 text-orange-700", border: "border-l-orange-500" },
  Medium:   { pill: "bg-amber-100 text-amber-700",   border: "border-l-amber-400" },
  Low:      { pill: "bg-slate-100 text-slate-600",   border: "border-l-slate-300" },
};

const SCREEN_SHORT: Record<string, string> = {
  GLOBAL:            "Global",
  DASHBOARD:         "Dashboard",
  "FINANCIAL-YEAR":  "Financial Year",
  "MANAGE-MINISTRY": "Ministry",
  "MANAGE-SCHEME":   "Scheme",
  "MANAGE-OUTCOME":  "Outcome",
  DOCUMENTS:         "Documents",
  "MAP-MINISTRY":    "Map Ministry",
  "MANAGE-USER":     "User Mgmt",
  LOGIN:             "Login",
};

const SEC_LABEL: Record<string, string> = {
  "header-band": "Header & Gov Bar",
  "sidebar":     "Navigation Sidebar",
  "profile":     "Top Bar — Profile",
  "heading":     "Page Heading",
  "stat-cards":  "Summary Stat Cards",
  "table":       "Data Table",
  "toolbar":     "Table Toolbar",
  "full-page":   "Full Page",
  "form":        "Login Form",
  "content":     "Content",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function groupBySection(findings: Finding[]): [string, Finding[]][] {
  const map = new Map<string, Finding[]>();
  for (const f of findings) {
    const sec = f.section ?? "content";
    if (!map.has(sec)) map.set(sec, []);
    map.get(sec)!.push(f);
  }
  return [...map.entries()];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FindingCard({ f }: { f: Finding }) {
  const s = SEV[f.severity as Sev] ?? SEV.Nit;
  return (
    <div className={`flex gap-3 rounded-lg border border-border bg-white border-l-4 ${s.border} p-4`}>
      {/* Pin number badge matching the annotation board */}
      <div
        className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
        style={{ background: s.pinBg }}
        aria-label={`Finding ${f.num}`}
      >
        {f.num}
      </div>

      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${s.pill}`}>
            {f.severity}
          </span>
          <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
            {f.id}
          </code>
          <span className="font-semibold text-sm text-ink leading-snug flex-1">{f.element}</span>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-ink-muted">
            {f.axis}
          </span>
        </div>

        {/* Design intent vs As built */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div className="rounded-md border border-blue-100 bg-blue-50 p-2.5">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">Design intent</div>
            <p className="leading-relaxed text-blue-900">{f.figma}</p>
          </div>
          <div className="rounded-md border border-orange-100 bg-orange-50 p-2.5">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-orange-600">As built</div>
            <p className="leading-relaxed text-orange-900">{f.live}</p>
          </div>
        </div>

        {/* Fix */}
        <div className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs">
          <span className="font-bold uppercase tracking-widest text-[10px] text-emerald-700 mr-2">Fix</span>
          <span className="text-emerald-900">{f.fix}</span>
        </div>
      </div>
    </div>
  );
}

function ScreenGroup({ screen, findings }: { screen: Screen; findings: Finding[] }) {
  const counts = { Blocker: 0, Major: 0, Minor: 0, Nit: 0 };
  for (const f of findings) counts[f.severity as Sev]++;

  // When filtering, group only the visible findings — boards show all pins (that's fine)
  const sections = groupBySection(findings);

  // Determine which sections actually have boards on disk
  // (derived dynamically from section key — same convention as the generator)
  const boardUrl = (section: string) =>
    `/reports/eutthan-admin/figures/${screen.slug}-${section}.png`;

  const multiSection = sections.length > 1;

  return (
    <section className="mb-14" id={`screen-${screen.slug}`}>
      {/* Screen header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-ink">{screen.name}</h2>
          {screen.note && (
            <p className="mt-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
              {screen.note}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["Blocker", "Major", "Minor"] as Sev[]).map(
            (sev) =>
              counts[sev] > 0 && (
                <span key={sev} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${SEV[sev].pill}`}>
                  {counts[sev]} {sev}
                </span>
              )
          )}
          {screen.figmaUrl && (
            <a
              href={screen.figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-medium text-primary hover:bg-blue-100 transition"
            >
              <Icon name="open_in_new" size={12} /> Figma
            </a>
          )}
          {screen.liveUrl && (
            <a
              href={screen.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-surface-muted border border-border px-2.5 py-0.5 text-[11px] font-medium text-ink-muted hover:text-ink transition"
            >
              <Icon name="open_in_new" size={12} /> Live
            </a>
          )}
        </div>
      </div>

      {/* Per-section: annotation board inline, then findings below */}
      {sections.map(([section, sFindings]) => (
        <div key={section} className="mb-10">
          {/* Section label — only shown when screen has multiple sections */}
          {multiSection && (
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-muted">
              {SEC_LABEL[section] ?? section.replace(/-/g, " ")}
            </p>
          )}

          {/* Annotation board — only rendered when the figure exists on disk
              (gated by the manifest) so missing boards don't 404. */}
          {FIGURES.has(`${screen.slug}-${section}.png`) && (
            <div className="mb-5 overflow-hidden rounded-xl border border-border/60 shadow-md">
              <div className="relative w-full aspect-video">
                <Image
                  src={boardUrl(section)}
                  alt={`${screen.name} — ${section} annotation board`}
                  fill
                  className="object-contain"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Findings — numbered to match board pins */}
          <div className="space-y-3">
            {sFindings.map((f) => (
              <FindingCard key={f.id} f={f} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function SuggestionCard({ s }: { s: Suggestion }) {
  const st = SSEV[s.severity];
  return (
    <div className={`rounded-lg border border-border bg-white border-l-4 ${st.border} mb-4 last:mb-0`}>
      <div className="flex flex-wrap items-start gap-2 px-4 pt-4 pb-2">
        <span className={`flex-shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${st.pill}`}>
          {s.severity}
        </span>
        <code className="flex-shrink-0 rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">
          {s.id}
        </code>
        <span className="flex-1 text-sm font-semibold text-ink">{s.title}</span>
      </div>

      <p className="mx-4 mb-3 text-xs leading-relaxed text-ink-muted">{s.context}</p>

      <div className="mx-4 mb-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-slate-100 bg-slate-50 p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Current state</div>
          <p className="leading-relaxed text-slate-800">{s.current}</p>
        </div>
        <div className="rounded-md border border-primary/10 bg-blue-50 p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">Proposed</div>
          <p className="leading-relaxed text-blue-900">{s.proposed}</p>
        </div>
      </div>

      <div className="mx-4 mb-3 rounded-md border border-purple-100 bg-purple-50 px-3 py-2.5 text-xs">
        <span className="font-bold uppercase tracking-widest text-[10px] text-purple-700 mr-2">Rationale</span>
        <span className="text-purple-900">{s.rationale}</span>
      </div>

      <div className="mx-4 mb-4 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-xs">
        <span className="font-bold uppercase tracking-widest text-[10px] text-emerald-700 mr-2">Action</span>
        <span className="text-emerald-900">{s.action}</span>
        <span className="ml-3 text-ink-muted">· {s.figmaRef}</span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EutthanAdminReport() {
  const [tab, setTab] = useState<Tab>("qc");
  const [query, setQuery] = useState("");
  const [activeScreen, setActiveScreen] = useState<string>("ALL");
  const [activeSev, setActiveSev] = useState<Sev | "All">("All");

  const allFindings = useMemo(
    () => audit.screens.flatMap((s) => s.findings.map((f) => ({ ...f, screenSlug: s.slug }))),
    []
  );
  const counts = useMemo(() => {
    const c = { Blocker: 0, Major: 0, Minor: 0, Nit: 0 };
    for (const f of allFindings) c[f.severity as Sev]++;
    return c;
  }, [allFindings]);

  const filteredScreens = useMemo(() => {
    const q = query.toLowerCase().trim();
    return audit.screens
      .map((screen) => {
        const findings = screen.findings.filter((f) => {
          if (activeScreen !== "ALL" && screen.slug !== activeScreen) return false;
          if (activeSev !== "All" && f.severity !== activeSev) return false;
          if (q) {
            return (
              f.id.toLowerCase().includes(q) ||
              f.element.toLowerCase().includes(q) ||
              f.axis.toLowerCase().includes(q) ||
              f.fix.toLowerCase().includes(q) ||
              f.figma.toLowerCase().includes(q) ||
              f.live.toLowerCase().includes(q)
            );
          }
          return true;
        });
        return { screen, findings };
      })
      .filter(({ findings }) => findings.length > 0);
  }, [query, activeScreen, activeSev]);

  const matchCount = useMemo(
    () => filteredScreens.reduce((s, g) => s + g.findings.length, 0),
    [filteredScreens]
  );

  const sugCategories = useMemo(
    () => [...new Set(SUGGESTIONS.map((s) => s.category))],
    []
  );

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="sa-container flex items-center gap-4 py-3">
          <Link
            href="/reports"
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition"
          >
            <Icon name="arrow_back" size={14} /> Reports
          </Link>
          <span className="text-border">/</span>
          <span className="text-xs font-semibold text-ink">eUtthan Admin</span>

          <div className="ml-4 flex items-center gap-1 rounded-lg bg-surface-muted p-1">
            {(
              [
                { key: "qc",          label: "Design QC",          badge: allFindings.length },
                { key: "suggestions", label: "Design Suggestions",  badge: SUGGESTIONS.length },
              ] as const
            ).map(({ key, label, badge }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  tab === key ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    tab === key ? "bg-primary text-white" : "bg-border text-ink-muted"
                  }`}
                >
                  {badge}
                </span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={
                tab === "qc"
                  ? "/reports/eUtthan-Admin-Design-QC-Report.pdf"
                  : "/reports/eUtthan-Admin-Design-Suggestions.pdf"
              }
              download
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-surface-muted"
            >
              <Icon name="download" size={14} /> Download PDF
            </a>
          </div>
        </div>
      </header>

      {/* ── QC Tab ── */}
      {tab === "qc" && (
        <>
          {/* Sticky filter bar */}
          <div className="sticky top-[49px] z-10 border-b border-border bg-white/95 backdrop-blur">
            <div className="sa-container py-3 space-y-2">
              <div className="relative w-full max-w-md">
                <Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="search"
                  placeholder="Search findings, elements, axis…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-8 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  >
                    <Icon name="close" size={12} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-ink-muted mr-1">Screen:</span>
                {[
                  { slug: "ALL", name: "All" },
                  ...audit.screens.map((s) => ({ slug: s.slug, name: SCREEN_SHORT[s.slug] ?? s.slug })),
                ].map(({ slug, name }) => {
                  const cnt =
                    slug === "ALL"
                      ? allFindings.length
                      : audit.screens.find((s) => s.slug === slug)?.findings.length ?? 0;
                  return (
                    <button
                      key={slug}
                      onClick={() => setActiveScreen(slug)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                        activeScreen === slug
                          ? "bg-primary text-white"
                          : "bg-surface-muted text-ink-muted hover:text-ink"
                      }`}
                    >
                      {name} <span className="opacity-70">{cnt}</span>
                    </button>
                  );
                })}

                <span className="ml-3 text-[11px] text-ink-muted">Severity:</span>
                {(["All", "Blocker", "Major", "Minor", "Nit"] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setActiveSev(sev)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                      activeSev === sev
                        ? sev === "All"
                          ? "bg-ink text-white"
                          : SEV[sev as Sev].pill + " ring-1 ring-offset-1 ring-current"
                        : "bg-surface-muted text-ink-muted hover:text-ink"
                    }`}
                  >
                    {sev}
                    {sev !== "All" && <span className="ml-1 opacity-70">{counts[sev as Sev]}</span>}
                  </button>
                ))}

                <span className="ml-auto text-[11px] text-ink-muted">
                  {matchCount} finding{matchCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="border-b border-border bg-surface">
            <div className="sa-container flex items-center gap-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-0.5">Portal</p>
                <p className="text-sm font-bold text-ink">{audit.portal}</p>
              </div>
              <Divider orientation="vertical" length={32} />
              <div className="flex flex-wrap gap-5">
                {[
                  { label: "Screens",  value: audit.screens.length,  color: "text-primary" },
                  { label: "Findings", value: allFindings.length,     color: "text-ink" },
                  { label: "Blockers", value: counts.Blocker,         color: "text-red-600" },
                  { label: "Major",    value: counts.Major,           color: "text-orange-600" },
                  { label: "Minor",    value: counts.Minor,           color: "text-amber-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-xl font-bold ${color}`}>{value}</div>
                    <div className="text-[11px] text-ink-muted">{label}</div>
                  </div>
                ))}
              </div>
              <div className="ml-auto text-[11px] text-ink-muted">Generated {audit.generated}</div>
            </div>
          </div>

          {/* Findings */}
          <main className="sa-container py-8">
            {filteredScreens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Icon name="search" size={40} className="text-ink-muted/30 mb-4" />
                <p className="text-sm font-semibold text-ink">No findings match your filters</p>
                <p className="text-xs text-ink-muted mt-1">Try adjusting the search or filter criteria.</p>
                <button
                  onClick={() => { setQuery(""); setActiveScreen("ALL"); setActiveSev("All"); }}
                  className="mt-4 text-xs font-semibold text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredScreens.map(({ screen, findings }) => (
                <ScreenGroup key={screen.slug} screen={screen} findings={findings} />
              ))
            )}
          </main>
        </>
      )}

      {/* ── Suggestions Tab ── */}
      {tab === "suggestions" && (
        <>
          <div className="border-b border-border bg-surface">
            <div className="sa-container flex items-center gap-6 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-0.5">Portal</p>
                <p className="text-sm font-bold text-ink">{audit.portal}</p>
              </div>
              <Divider orientation="vertical" length={32} />
              <div className="flex flex-wrap gap-5">
                {[
                  { label: "Total",    value: SUGGESTIONS.length,                                          color: "text-primary" },
                  { label: "Critical", value: SUGGESTIONS.filter((s) => s.severity === "Critical").length, color: "text-red-600" },
                  { label: "High",     value: SUGGESTIONS.filter((s) => s.severity === "High").length,     color: "text-orange-600" },
                  { label: "Medium",   value: SUGGESTIONS.filter((s) => s.severity === "Medium").length,   color: "text-amber-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-xl font-bold ${color}`}>{value}</div>
                    <div className="text-[11px] text-ink-muted">{label}</div>
                  </div>
                ))}
              </div>
              <div className="ml-auto text-[11px] text-ink-muted">Generated {audit.generated}</div>
            </div>
          </div>

          <main className="sa-container py-8 space-y-10">
            {sugCategories.map((cat) => (
              <section key={cat}>
                <h2 className="mb-4 text-base font-bold text-ink border-b border-border pb-2">{cat}</h2>
                {SUGGESTIONS.filter((s) => s.category === cat).map((s) => (
                  <SuggestionCard key={s.id} s={s} />
                ))}
              </section>
            ))}
          </main>
        </>
      )}
    </div>
  );
}
