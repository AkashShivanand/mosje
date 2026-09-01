"use client";

/* PM-AJAY — Unified Programme Dashboard (single-screen executive view).
   Distils all 60 KPIs into one curated bento dashboard with live drill-down.
   Faithful port of the Claude Design handoff unified-app.jsx. */

import { useState, useMemo, useRef, useLayoutEffect, type CSSProperties } from "react";
import Link from "next/link";
import { Navbar } from "@/components/pm-ajay/shell/navbar";
import { FilterBar, Status, Footer, pillClass, type Filters } from "./ui";

// basePath is applied automatically by Next.js to <Link>/<Image>/router —
// keep in-app paths basePath-relative (empty prefix) so it is not doubled.
const BASE = "/portals/pm-ajay";
import { Donut, Funnel, LineArea, Sparkline, C } from "./charts";
import {
  FY,
  FY_FACTOR,
  PERIODS,
  SCHEMES,
  STATES,
  MONTHS,
  RELEASED_M,
  UTILIZED_M,
  KPIS,
  SCHEME_SHARE,
  SRC,
  AS_OF,
  districtsFor,
  type Kpi,
  type StateRow,
  type District,
  type ViewId,
} from "@/lib/pm-ajay/data";

const INR = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const NUM = (n: number) => Math.round(n).toLocaleString("en-IN");
const numOf = (kp: Kpi) => {
  const n = parseFloat(String(kp.value).replace(/,/g, ""));
  return isNaN(n) ? -Infinity : n;
};
const deltaOf = (kp: Kpi) => {
  const n = parseFloat(String(kp.delta || "").replace(/[^\d.]/g, ""));
  return (isNaN(n) ? 0 : n) * (kp.dir === "down" ? -1 : 1);
};
const arrow = (d: string) => (d === "up" ? "trending_up" : d === "down" ? "trending_down" : "trending_flat");
const barColor = (u: number) => (u >= 84 ? C.green : u >= 70 ? "var(--pm-accent)" : u >= 50 ? C.amber : C.red);

function sparkDom(kpi: Kpi): { domainMin?: number; domainMax?: number } {
  const d = kpi.spark || [];
  if (!d.length) return {};
  const mx = Math.max(...d);
  if (kpi.type === "percent" || kpi.type === "special") return { domainMin: 0, domainMax: 100 };
  if (kpi.type === "days") return { domainMin: 0, domainMax: mx * 1.35 };
  return { domainMin: 0, domainMax: mx * 1.12 };
}

function TargetMeter({ kpi, compact }: { kpi: Kpi; compact?: boolean }) {
  if (kpi.target == null) return null;
  const v = parseFloat(String(kpi.value).replace(/,/g, ""));
  if (isNaN(v)) return null;
  const t = kpi.target,
    lower = kpi.type === "days";
  let axisMax: number, met: boolean;
  if (kpi.type === "percent" || kpi.type === "special") {
    axisMax = 100;
    met = v >= t;
  } else if (lower) {
    axisMax = Math.max(v, t) * 1.4;
    met = v <= t;
  } else {
    axisMax = Math.max(v, t) * 1.25;
    met = v >= t;
  }
  const near = lower
    ? v <= t * 1.18
    : kpi.type === "percent" || kpi.type === "special"
    ? v >= t - 10
    : v >= t * 0.9;
  const col = met ? C.green : near ? C.amber : C.red;
  const u = kpi.unit && kpi.unit !== "/100" ? kpi.unit : "";
  const ptUnit = kpi.type === "days" ? " days" : kpi.type === "percent" ? " pts" : "";
  const gap = Math.abs(lower ? v - t : t - v);
  const gapTxt = met
    ? lower
      ? "Within target"
      : "Target met"
    : lower
    ? `${gap.toFixed(0)}${ptUnit} over`
    : `${gap.toFixed(1)}${ptUnit} to target`;
  return (
    <div className={"ud-target" + (compact ? " compact" : "")} title={`Target ${t}${u}`}>
      <div className="bar" role="img" aria-label={`Current ${v}${u}, target ${t}${u}, ${gapTxt}`}>
        <div className="fill" style={{ width: Math.min(100, (v / axisMax) * 100) + "%", background: col }} />
        <span className="tick" style={{ left: Math.min(100, (t / axisMax) * 100) + "%" }} />
      </div>
      <div className="tl">
        <span className="tg">Target {t}{u}</span>
        <span className="gp" style={{ color: col }}>{gapTxt}</span>
      </div>
    </div>
  );
}

function fmtLike(orig: string, num: number) {
  const dec = (orig.split(".")[1] || "").length;
  return num.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function scaleKpi(kpi: Kpi, factor: number, region: StateRow | District | null): Kpi {
  let value = kpi.value;
  if (kpi.type === "amount" || kpi.type === "count") {
    const num = parseFloat(String(kpi.value).replace(/,/g, ""));
    if (!isNaN(num)) value = fmtLike(String(kpi.value), num * factor);
  } else if (kpi.type === "percent" && region) {
    if (/UC|Compliance/i.test(kpi.label) && !/PFMS/i.test(kpi.label)) value = region.uc.toFixed(1);
    else if (/Utiliz|Utilis|Occupancy/i.test(kpi.label) && !/Time/i.test(kpi.label)) value = region.util.toFixed(1);
  }
  return { ...kpi, value };
}

function RibbonStat({ kpi, sp }: { kpi: Kpi; sp: boolean }) {
  const pc = pillClass(kpi);
  const prefix = kpi.type === "amount" ? "₹" : "";
  const sparkColor = kpi.tone === "green" ? C.green : kpi.tone === "amber" ? C.amber : kpi.tone === "red" ? C.red : "var(--pm-accent)";
  return (
    <div className="ud-stat">
      <div className="ud-stat-top">
        <span className="lab">{kpi.label}</span>
        {sp && kpi.spark && <Sparkline data={kpi.spark} color={sparkColor} w={66} h={24} {...sparkDom(kpi)} />}
      </div>
      <div className="val">
        {prefix}{kpi.value}{kpi.unit && <span className="u">{kpi.unit}</span>}
      </div>
      <div className="foot">
        {kpi.delta && (
          <span className={"pm-pill " + pc}>
            <span className="material-symbols-rounded" aria-hidden="true">{arrow(kpi.dir)}</span>
            <span>{kpi.delta}</span>
          </span>
        )}
        {kpi.sub && <span className="sub">{kpi.sub}</span>}
      </div>
      <TargetMeter kpi={kpi} compact />
    </div>
  );
}

interface SchemeCfg {
  key: ViewId;
  label: string;
  icon: string;
  tone: "blue" | "navy" | "green";
  sb: string;
  hero: number;
  cap: string;
  minis: { l: string; v: number; fmt: (v: number) => string; scale?: boolean }[];
  prog: { l: string; pct: number };
}

const SCHEME_CFGS: SchemeCfg[] = [
  {
    key: "gia", label: "Grant-in-Aid (GIA)", icon: "volunteer_activism", tone: "blue", sb: "Grants to NGOs & institutions",
    hero: 2548, cap: "projects approved",
    minis: [{ l: "Funds Utilized", v: 1712, fmt: INR, scale: true }, { l: "Beneficiaries", v: 14.82, fmt: (v) => v.toFixed(2) + " L", scale: true }],
    prog: { l: "Physical progress", pct: 73.4 },
  },
  {
    key: "hostel", label: "Hostel", icon: "apartment", tone: "navy", sb: "SC hostels — build & occupancy",
    hero: 148200, cap: "seats created · 76% filled",
    minis: [{ l: "Hostels Completed", v: 514, fmt: (v) => NUM(v) + " / 842", scale: true }, { l: "Funds Utilized", v: 1894, fmt: INR, scale: true }],
    prog: { l: "Completion of approved", pct: 61.0 },
  },
  {
    key: "adarsh", label: "Adarsh Gram (PMAGY)", icon: "holiday_village", tone: "green", sb: "Village development",
    hero: 7842, cap: "villages declared",
    minis: [{ l: "Works Completed", v: 102394, fmt: NUM, scale: true }, { l: "Avg Village Score", v: 78.4, fmt: (v) => v.toFixed(1) + "/100" }],
    prog: { l: "Works completion", pct: 70.0 },
  },
];
const progColor = (pct: number) => (pct >= 75 ? C.green : pct >= 60 ? "var(--pm-accent)" : C.amber);

function SchemeMod({
  cfg, base, onOpen, onScope, active,
}: {
  cfg: SchemeCfg; base: number; onOpen: () => void; onScope: () => void; active: boolean;
}) {
  const st: ["green" | "blue" | "amber", string] =
    cfg.prog.pct >= 75 ? ["green", "On track"] : cfg.prog.pct >= 60 ? ["blue", "Steady"] : ["amber", "Monitor"];
  return (
    <div className={"ud-scheme" + (active ? " on" : "")}>
      <div className="ud-scheme-top">
        <div className={"ud-scheme-ic " + cfg.tone}>
          <span className="material-symbols-rounded" aria-hidden="true">{cfg.icon}</span>
        </div>
        <div className="tt"><div className="nm">{cfg.label}</div><div className="sb">{cfg.sb}</div></div>
        <Status tone={st[0]}>{st[1]}</Status>
      </div>
      <div className="ud-scheme-hero"><span className="v">{NUM(cfg.hero * base)}</span><span className="cap">{cfg.cap}</span></div>
      <div className="ud-scheme-foot">
        {cfg.minis.map((m, i) => (
          <div className="mini" key={i}><div className="l">{m.l}</div><div className="v">{m.fmt(m.scale ? m.v * base : m.v)}</div></div>
        ))}
      </div>
      <div>
        <div className="ud-prog-top"><span className="l">{cfg.prog.l}</span><span className="v">{cfg.prog.pct.toFixed(1)}%</span></div>
        <div className="ud-prog-track"><div className="ud-prog-fill" style={{ width: cfg.prog.pct + "%", background: progColor(cfg.prog.pct) }} /></div>
      </div>
      <div className="ud-scheme-actions">
        <button type="button" className={"ud-scheme-scope" + (active ? " on" : "")} onClick={onScope}
          aria-pressed={active} aria-label={active ? `Clear ${cfg.label} filter` : `Filter whole dashboard to ${cfg.label}`}>
          <span className="material-symbols-rounded" aria-hidden="true">{active ? "filter_alt_off" : "filter_alt"}</span>
          {active ? "Filtering — clear" : "Filter dashboard"}
        </button>
        <button type="button" className="ud-scheme-link" onClick={onOpen} aria-label={`Open all 10 ${cfg.label} indicators`}>
          10 indicators<span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function Alert({
  tone, icon, title, desc, when, onOpen,
}: {
  tone: "red" | "amber"; icon: string; title: string; desc: string; when: string; onOpen?: () => void;
}) {
  const props = onOpen
    ? {
        role: "button",
        tabIndex: 0,
        onClick: onOpen,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); }
        },
      }
    : {};
  return (
    <div className={"ud-alert " + tone + (onOpen ? " click" : "")} {...props}>
      <div className="ic"><span className="material-symbols-rounded" aria-hidden="true">{icon}</span></div>
      <div style={{ minWidth: 0, flex: 1 }}><div className="tt">{title}</div><div className="ds">{desc}</div></div>
      <span className="when">{when}{onOpen && <span className="material-symbols-rounded go" aria-hidden="true">chevron_right</span>}</span>
    </div>
  );
}

function KPICell({ kpi, src }: { kpi: Kpi; src?: string }) {
  const pc = pillClass(kpi);
  const prefix = kpi.type === "amount" ? "₹" : "";
  const sparkColor = kpi.tone === "green" ? C.green : kpi.tone === "amber" ? C.amber : kpi.tone === "red" ? C.red : "var(--pm-accent)";
  return (
    <div className="ud-kpi">
      <div className="ud-kpi-h">
        <div className="lab">{kpi.label}</div>
        {kpi.spark && <Sparkline data={kpi.spark} color={sparkColor} w={60} h={22} {...sparkDom(kpi)} />}
      </div>
      <div className="val">{prefix}{kpi.value}{kpi.unit && <span className="u">{kpi.unit}</span>}</div>
      <div className="foot">
        {kpi.delta && <span className={"pm-pill " + pc}><span className="material-symbols-rounded" aria-hidden="true">{arrow(kpi.dir)}</span><span>{kpi.delta}</span></span>}
        {kpi.sub && <span className="sub">{kpi.sub}</span>}
      </div>
      <TargetMeter kpi={kpi} />
      {src && <div className="ud-kpi-src"><span className="material-symbols-rounded" aria-hidden="true">database</span>{src} · {AS_OF}</div>}
    </div>
  );
}

const GROUPS: { n: string; id: ViewId; title: string }[] = [
  { n: "01", id: "financial", title: "Financial Management" },
  { n: "02", id: "gia", title: "GIA (Grant-in-Aid)" },
  { n: "03", id: "hostel", title: "Hostel Scheme" },
  { n: "04", id: "adarsh", title: "Adarsh Gram (PMAGY)" },
  { n: "05", id: "governance", title: "Governance & Compliance" },
  { n: "06", id: "executive", title: "Executive Summary" },
];
const CROSSG: ViewId[] = ["financial", "governance", "executive"];

const DEFAULTS: Filters = { fy: FY[0]!, state: "All India", district: "All Districts", scheme: SCHEMES[0]!, period: PERIODS[0]! };
const ACCENT = "var(--sa-color-action-primary-default)";
const ACCENT_BG = "var(--sa-color-action-primary-tonal)";
const SPARK = true;

interface RankRow { name: string; util: number; level: "state" | "district"; }

export function UnifiedDashboard() {
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const [view, setView] = useState<"dash" | "all">("dash");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [grpFilter, setGrpFilter] = useState("all");
  const stageRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Filters, v: string) =>
    setFilters((f) => ({ ...f, [k]: v, ...(k === "state" ? { district: "All Districts" } : {}) }));
  const reset = () => setFilters(DEFAULTS);

  const scope = filters.state === "All India" ? null : STATES.find((s) => s.name === filters.state) || null;
  const district = scope && filters.district !== "All Districts" ? districtsFor(scope).find((d) => d.name === filters.district) || null : null;
  const region: StateRow | District | null = district || scope;

  const unitShare = (scope ? scope.share : 1) * (district ? district.share : 1);
  const yrPer = (FY_FACTOR[filters.fy] || 1) * (filters.period === "Annual" ? 1 : 0.26);
  const schemeSel = filters.scheme !== "All Schemes";
  const fCross = unitShare * (schemeSel ? SCHEME_SHARE[filters.scheme] || 1 : 1) * yrPer;
  const base = unitShare * yrPer;

  const ribbon = useMemo(() => {
    const ex = KPIS.executive.map((kp) => scaleKpi(kp, fCross, region));
    return [ex[0]!, ex[2]!, ex[4]!, ex[5]!, ex[9]!];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const util = region ? region.util : 79.0;
  const funnel = [
    { label: "Allocation", pct: 100, value: INR(9250 * fCross), color: C.navy },
    { label: "Sanction", pct: 88, value: INR(8142 * fCross), color: "var(--sa-color-action-primary-default)" },
    { label: "Release", pct: 73, value: INR(6718 * fCross), color: C.blue2 },
    { label: "Utilization", pct: 57, value: INR(5306 * fCross), color: C.green },
  ];

  const ranked = useMemo<RankRow[]>(() => {
    if (scope) {
      return districtsFor(scope).map((d) => ({ name: d.name, util: d.util, level: "district" as const })).sort((a, b) => b.util - a.util);
    }
    return STATES.map((s) => ({ name: s.name, util: s.util, level: "state" as const })).sort((a, b) => b.util - a.util);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.state]);
  type ShownRow = RankRow | { divider: true };
  const rankShown: ShownRow[] = scope ? ranked : [...ranked.slice(0, 5), { divider: true }, ...ranked.slice(-3)];
  const onRank = (r: RankRow) => { if (r.level === "state") set("state", r.name); else set("district", r.name); };

  const openGroup = (id: ViewId) => {
    setView("all");
    setTimeout(() => {
      const el = document.getElementById("grp-" + id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
    }, 90);
  };
  const kpisForGroup = (id: ViewId) => KPIS[id].map((kp) => scaleKpi(kp, CROSSG.includes(id) ? fCross : base, region));

  const scopeChips: { k: string; v: string; clear: () => void }[] = [];
  if (filters.fy !== FY[0]) scopeChips.push({ k: "FY", v: filters.fy, clear: () => set("fy", FY[0]!) });
  if (scope) scopeChips.push({ k: "State", v: scope.name, clear: () => set("state", "All India") });
  if (district) scopeChips.push({ k: "District", v: district.name, clear: () => set("district", "All Districts") });
  if (schemeSel) scopeChips.push({ k: "Scheme", v: filters.scheme, clear: () => set("scheme", "All Schemes") });
  if (filters.period !== "Annual") scopeChips.push({ k: "Period", v: filters.period, clear: () => set("period", "Annual") });
  const anyScope = scopeChips.length > 0;

  useLayoutEffect(() => {
    const fit = () => {
      if (!appRef.current || !stageRef.current) return;
      const w = window.innerWidth;
      const fluid = w < 880;
      appRef.current.classList.toggle("fluid", fluid);
      if (fluid) {
        appRef.current.style.transform = "none";
        stageRef.current.style.height = "auto";
      } else {
        const s = Math.min(1, w / 1440);
        appRef.current.style.transform = `scale(${s})`;
        stageRef.current.style.height = appRef.current.offsetHeight * s + "px";
      }
    };
    fit();
    window.addEventListener("resize", fit);
    const ro = new ResizeObserver(fit);
    if (appRef.current) ro.observe(appRef.current);
    return () => { window.removeEventListener("resize", fit); ro.disconnect(); };
  });

  const scopeLabel = district ? district.name : scope ? scope.name : "All India";
  const scopeFull = scopeLabel + (schemeSel ? " · " + filters.scheme : "");

  const allGroups = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return GROUPS.filter((g) => grpFilter === "all" || grpFilter === g.id)
      .map((g) => {
        let items = kpisForGroup(g.id);
        if (ql) items = items.filter((k) => (k.label + " " + (k.sub || "")).toLowerCase().includes(ql));
        if (sortBy === "value") items = [...items].sort((a, b) => numOf(b) - numOf(a));
        else if (sortBy === "label") items = [...items].sort((a, b) => a.label.localeCompare(b.label));
        else if (sortBy === "change") items = [...items].sort((a, b) => deltaOf(b) - deltaOf(a));
        return { ...g, items };
      })
      .filter((g) => g.items.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sortBy, grpFilter, filters]);
  const totalShown = allGroups.reduce((n, g) => n + g.items.length, 0);

  const exportCSV = () => {
    const esc = (s: unknown) => '"' + String(s).replace(/"/g, '""') + '"';
    const head = ["Group", "Indicator", "Value", "Unit", "Change", "Direction", "Target", "Source", "Scope", "As of"];
    const rows = [head.map(esc).join(",")];
    GROUPS.forEach((g) =>
      kpisForGroup(g.id).forEach((k) => {
        rows.push([g.title, k.label, k.value, k.unit || "", k.delta || "", k.dir || "", k.target != null ? k.target : "", SRC[g.id], scopeFull, AS_OF].map(esc).join(","));
      })
    );
    const blob = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PM-AJAY_KPIs_${scopeLabel.replace(/\s+/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const printView = () => window.print();

  const syncAgeDays = 3;
  const fresh = syncAgeDays <= 7;

  const trendR = RELEASED_M.map((v) => v * fCross);
  const trendU = UTILIZED_M.map((v) => v * fCross);

  return (
    <div className="pm-stage" ref={stageRef}>
      <div
        className="pm-app"
        ref={appRef}
        style={{ "--pm-accent": ACCENT, "--pm-accent-bg": ACCENT_BG, "--pm-canvas": "var(--sa-bg-neutral-subtler)" } as CSSProperties}
      >
        <Navbar />
        <div className="ud-content">
          <div className="ud-wrap" id="pm-main">
            {/* Toolbar */}
            <div className="ud-toolbar">
              <div className="ud-title">
                <Link href={`${BASE}/`} className="ud-back-link">
                  <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
                  MIS Dashboard
                </Link>
                <h1>PM-AJAY Programme Dashboard</h1>
                <p className="sub">
                  Funds, scheme delivery and compliance — at a glance for{" "}
                  <b style={{ color: "var(--pm-slate)", fontWeight: 600 }}>{scopeFull}</b>
                </p>
              </div>
              <div className="ud-toolbar-r">
                <FilterBar filters={filters} set={set} reset={reset} view="executive" scope={scope} />
                <span className={"ud-fresh" + (fresh ? "" : " stale")} title={`Sources: PFMS · GIA-MIS · Hostel-MIS · AGMIS · UC Portal — synced ${AS_OF}`}>
                  <span className="dot" aria-hidden="true" />
                  <span className="material-symbols-rounded" aria-hidden="true">{fresh ? "cloud_done" : "cloud_off"}</span>
                  {fresh ? "Live" : "Stale"} · synced {syncAgeDays} d ago
                </span>
              </div>
            </div>

            {/* View bar */}
            <div className="ud-viewbar">
              {anyScope ? (
                <div className="ud-scope">
                  <span className="lbl">Showing</span>
                  {scopeChips.map((c) => (
                    <span className="ud-chip act" key={c.k}>
                      <span className="k">{c.k}</span>{c.v}
                      <button type="button" onClick={c.clear} aria-label={"Clear " + c.k}><span className="material-symbols-rounded" aria-hidden="true">close</span></button>
                    </span>
                  ))}
                  <button type="button" className="clearall" onClick={reset}><span className="material-symbols-rounded" aria-hidden="true">restart_alt</span>Reset</button>
                </div>
              ) : (
                <span className="ud-scope-empty">Showing <b>All India</b> · FY {filters.fy} · All schemes</span>
              )}
              <div className="ud-viewbar-r">
                <div className="ud-export" role="group" aria-label="Export">
                  <button type="button" onClick={exportCSV}><span className="material-symbols-rounded" aria-hidden="true">download</span>CSV</button>
                  <button type="button" onClick={printView}><span className="material-symbols-rounded" aria-hidden="true">print</span>Print / PDF</button>
                </div>
                <div className="ud-toggle" role="tablist" aria-label="Dashboard view">
                  <button type="button" role="tab" aria-selected={view === "dash"} className={view === "dash" ? "on" : ""} onClick={() => setView("dash")}><span className="material-symbols-rounded" aria-hidden="true">dashboard</span>Dashboard</button>
                  <button type="button" role="tab" aria-selected={view === "all"} className={view === "all" ? "on" : ""} onClick={() => setView("all")}><span className="material-symbols-rounded" aria-hidden="true">grid_view</span>All Indicators (60)</button>
                </div>
              </div>
            </div>

            {/* KPI ribbon */}
            <div className="ud-ribbon">
              {ribbon.map((k, i) => <RibbonStat key={i} kpi={k} sp={SPARK} />)}
            </div>

            {view === "all" ? (
              <div className="ud-allwrap">
                <div className="ud-allbar">
                  <div className="ud-search">
                    <span className="material-symbols-rounded" aria-hidden="true">search</span>
                    <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 60 indicators…" aria-label="Search indicators" />
                    {q && <button type="button" className="clr" onClick={() => setQ("")} aria-label="Clear search"><span className="material-symbols-rounded" aria-hidden="true">close</span></button>}
                  </div>
                  <div className="ud-allbar-r">
                    <label className="ud-fld"><span>Group</span>
                      <select value={grpFilter} onChange={(e) => setGrpFilter(e.target.value)} aria-label="Filter by group">
                        <option value="all">All groups</option>
                        {GROUPS.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
                      </select>
                    </label>
                    <label className="ud-fld"><span>Sort</span>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort indicators">
                        <option value="default">Listed order</option>
                        <option value="value">Value (high → low)</option>
                        <option value="change">Change (best → worst)</option>
                        <option value="label">Name (A → Z)</option>
                      </select>
                    </label>
                    <span className="ud-allcount">{totalShown} of 60</span>
                  </div>
                </div>
                {allGroups.length ? (
                  <div className="ud-allgroups">
                    {allGroups.map((g) => (
                      <div className="ud-group" id={"grp-" + g.id} key={g.id}>
                        <div className="ud-grouphead">
                          <span className="ix">{g.n}</span>
                          <h2>{g.title}</h2>
                          <span className="ct">{g.items.length} indicator{g.items.length === 1 ? "" : "s"}</span>
                          <span className="src"><span className="material-symbols-rounded" aria-hidden="true">database</span>{SRC[g.id]} · {AS_OF}</span>
                          <span className="rule" />
                        </div>
                        <div className="ud-kpigrid">
                          {g.items.map((k, i) => <KPICell key={i} kpi={k} src={SRC[g.id]} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ud-empty">
                    <span className="material-symbols-rounded" aria-hidden="true">search_off</span>
                    <div className="tt">No indicators match “{q}”</div>
                    <div className="ds">Try a different term or clear the filters.</div>
                    <button type="button" onClick={() => { setQ(""); setGrpFilter("all"); }}>Clear search &amp; filters</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Row A */}
                <div className="ud-bento">
                  <div className="ud-tile" style={{ gridColumn: "span 5" }}>
                    <div className="ud-tile-h"><span className="t"><span className="material-symbols-rounded" aria-hidden="true">account_tree</span>Fund Flow</span><span className="meta">₹ Crore · {scopeLabel}</span></div>
                    <div className="ud-tile-b">
                      <Funnel stages={funnel} />
                      <p className="ud-note"><span className="material-symbols-rounded" aria-hidden="true">info</span>Bars = share of <b>total allocation</b>. Ratios below = <b>stage-to-stage</b> conversion.</p>
                      <div className="ud-ratios">
                        <div className="ud-ratio"><span className="v">88%</span><span className="l">Sanction / Allocation</span></div>
                        <div className="ud-ratio"><span className="v">83%</span><span className="l">Release / Sanction</span></div>
                        <div className="ud-ratio"><span className="v">79%</span><span className="l">Utilization / Release</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="ud-tile" style={{ gridColumn: "span 3" }}>
                    <div className="ud-tile-h"><span className="t"><span className="material-symbols-rounded" aria-hidden="true">donut_large</span>Utilization Rate</span><span className="meta">Utilized ÷ Released · Tgt 85%</span></div>
                    <div className="ud-tile-b">
                      <div className="ud-gauge">
                        <Donut pct={util} size={158} color={barColor(util)} center={util.toFixed(1) + "%"} sub="of release" target={85} label="Utilization of release" />
                        <div style={{ width: "100%" }} className="pm-rows">
                          <div className="pm-rowline"><span className="lab">Utilized</span><span className="val">{INR(5306 * fCross)} Cr</span></div>
                          <div className="pm-divider" />
                          <div className="pm-rowline"><span className="lab">Unspent balance</span><span className="val">{INR(1412 * fCross)} Cr</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ud-tile" style={{ gridColumn: "span 4" }}>
                    <div className="ud-tile-h"><span className="t"><span className="material-symbols-rounded" aria-hidden="true">notifications_active</span>Requires Attention</span><span className="ud-count" title="Top 4 flags — click any to open its indicator group">Top 4 · click to open</span></div>
                    <div className="ud-tile-b">
                      <div className="ud-alerts">
                        <Alert tone="red" icon="priority_high" title="9 States below 50% utilization" desc="Bihar, Jharkhand, Chhattisgarh & 6 more" when="Action" onOpen={() => openGroup("financial")} />
                        <Alert tone="amber" icon="description" title="412 UCs pending over 90 days" desc="₹612 Cr next installment blocked" when="14 d" onOpen={() => openGroup("governance")} />
                        <Alert tone="amber" icon="event_busy" title="86 projects overdue" desc="Hostel & GIA · avg 47-day slip" when="Review" onOpen={() => openGroup("governance")} />
                        <Alert tone="amber" icon="gavel" title="214 audit observations open" desc="Pending closure across schemes" when="Track" onOpen={() => openGroup("governance")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheme delivery */}
                <div className="ud-sec"><h2>Scheme Delivery</h2></div>
                <div className="ud-schemes">
                  {SCHEME_CFGS.map((c) => (
                    <SchemeMod key={c.key} cfg={c} base={base}
                      active={filters.scheme === c.label}
                      onScope={() => set("scheme", filters.scheme === c.label ? "All Schemes" : c.label)}
                      onOpen={() => openGroup(c.key)} />
                  ))}
                </div>

                {/* Row C */}
                <div className="ud-bento">
                  <div className="ud-tile" style={{ gridColumn: "span 7" }}>
                    <div className="ud-tile-h"><span className="t"><span className="material-symbols-rounded" aria-hidden="true">public</span>{scope ? `${scope.name} — District Utilisation` : "State-wise Utilisation"}</span>
                      {scope ? (
                        <button type="button" className="ud-back" onClick={() => (district ? set("district", "All Districts") : set("state", "All India"))}><span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>{district ? "All districts" : "All states"}</button>
                      ) : (
                        <span className="meta">Click a state to drill into districts</span>
                      )}
                    </div>
                    <div className="ud-tile-b">
                      <div className="ud-rank">
                        {rankShown.map((r, i) =>
                          "divider" in r ? (
                            <div className="ud-rank-divider" key="d"><span>Lowest utilisation</span><span className="r" /></div>
                          ) : (
                            <div className="ud-rank-row" key={r.name} onClick={() => onRank(r)} role="button" tabIndex={0}
                              aria-label={`${r.name} ${r.util}% — drill in`}
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRank(r); } }}>
                              <span className="rk">{scope ? i + 1 : i < 5 ? i + 1 : ranked.length - (rankShown.length - 1 - i) + 1}</span>
                              <span className="nm">{r.name}<span className="material-symbols-rounded" aria-hidden="true">chevron_right</span></span>
                              <div className="ud-rank-track"><div className="ud-rank-fill" style={{ width: r.util + "%", background: barColor(r.util) }} /></div>
                              <span className="pct" style={{ color: r.util < 60 ? C.red : "var(--pm-ink)" }}>{r.util.toFixed(1)}%</span>
                              <Status tone={r.util >= 84 ? "green" : r.util >= 70 ? "blue" : r.util >= 60 ? "amber" : "red"}>{r.util >= 84 ? "On track" : r.util >= 70 ? "Monitor" : r.util >= 60 ? "Lagging" : "At risk"}</Status>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ud-tile" style={{ gridColumn: "span 5" }}>
                    <div className="ud-tile-h"><span className="t"><span className="material-symbols-rounded" aria-hidden="true">show_chart</span>Funds Released vs Utilized</span><span className="meta">FY {filters.fy} · ₹ Cr / month</span></div>
                    <div className="ud-tile-b">
                      <LineArea labels={MONTHS} height={196} series={[
                        { name: "Released", color: "var(--pm-accent)", data: trendR },
                        { name: "Utilized", color: C.green, data: trendU },
                      ]} />
                      <div style={{ display: "flex", gap: "var(--sa-inline-16)", marginTop: "var(--sa-stack-8)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sa-inline-6)", font: "400 12px/1 var(--font-sans)", color: "var(--pm-muted)" }}><span style={{ width: 10, height: 10, borderRadius: "var(--sa-shape-2)", background: "var(--pm-accent)" }} />Released</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sa-inline-6)", font: "400 12px/1 var(--font-sans)", color: "var(--pm-muted)" }}><span style={{ width: 10, height: 10, borderRadius: "var(--sa-shape-2)", background: C.green }} />Utilized</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
