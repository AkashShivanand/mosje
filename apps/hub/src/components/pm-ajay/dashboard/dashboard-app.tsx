"use client";

/* PM-AJAY Dashboard — app shell: routing, filters, drill-down scaling, responsive stage. */

import { useState, useMemo, useRef, useEffect, useLayoutEffect, Fragment, type CSSProperties } from "react";
import { Navbar } from "@/components/pm-ajay/shell/navbar";
import { Sidebar, DrillDownFilters, DashboardFooter, type Filters } from "./ui";
import { VIEW_COMPONENTS, type LevelRow } from "./views";
import {
  FY,
  FY_FACTOR,
  SCHEMES,
  PERIODS,
  STATES,
  KPIS,
  SCHEME_SHARE,
  districtsFor,
  type Kpi,
  type StateRow,
  type District,
  type ViewId,
} from "@/lib/pm-ajay/data";

const CROSS: ViewId[] = ["executive", "financial", "governance"];

interface Meta {
  title: string;
  desc: string;
  banner?: { b: string; t: string };
}

const META: Record<ViewId, Meta> = {
  executive: {
    title: "Executive Summary",
    desc: "Scheme-wide allocation, utilisation and delivery for FY 2025-26 — prepared for the Secretary and Joint Secretaries, MoSJE.",
    banner: {
      b: "FY 2025-26 — 79.0% utilisation against ₹6,718 Cr released",
      t: "9 States / UTs are below 50% utilisation and require review before the next installment cycle.",
    },
  },
  financial: {
    title: "Financial Management",
    desc: "Allocation, sanction, release and utilisation across PM-AJAY, with PFMS transaction health and state-wise drill-down.",
    banner: {
      b: "PFMS transaction success at 97.3%",
      t: "Average release-to-utilisation time has improved to 42 days (down 5 days from last year).",
    },
  },
  gia: {
    title: "Grant-in-Aid (GIA)",
    desc: "Proposals, approvals and fund utilisation for grants to voluntary organisations and institutions under the GIA component.",
    banner: {
      b: "2,548 GIA projects approved this financial year",
      t: "Income generation, skill development and infrastructure projects covering 14.82 lakh beneficiaries.",
    },
  },
  hostel: {
    title: "Hostel Scheme",
    desc: "Construction progress, seat creation and occupancy for Scheduled Caste hostels under PM-AJAY.",
    banner: {
      b: "1,48,200 hostel seats created · 76.0% occupancy",
      t: "514 of 842 approved hostels completed; 328 currently under construction.",
    },
  },
  adarsh: {
    title: "Adarsh Gram (PMAGY)",
    desc: "Village selection, development planning and works completion for the Pradhan Mantri Adarsh Gram Yojana component.",
    banner: {
      b: "7,842 villages declared Adarsh Gram",
      t: "1,02,394 of 1,46,210 identified works completed (70.0%); average village score 78.4 / 100.",
    },
  },
  governance: {
    title: "Governance & Compliance",
    desc: "Utilisation certificates, proposal & sanction processing times, and audit compliance across the scheme.",
    banner: {
      b: "₹612 Cr in installments blocked due to pending UCs",
      t: "412 utilisation certificates are pending beyond 90 days; UC compliance stands at 86.4%.",
    },
  },
};

// Baked-in display defaults (the editor-only Tweaks panel is omitted in production).
const ACCENT = "var(--sa-color-status-info)";
const ACCENT_BG = "var(--sa-color-infoScale-50)";
const CANVAS = "var(--sa-bg-neutral-subtler)";
const SPARK = false;
const DENSITY = "comfortable";

const DEFAULTS: Filters = {
  fy: FY[0]!,
  state: "All India",
  district: "All Districts",
  scheme: SCHEMES[0]!,
  period: PERIODS[0]!,
};

function fmtLike(orig: string, num: number): string {
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

function initialView(): ViewId {
  if (typeof window === "undefined") return "executive";
  const h = window.location.hash.replace("#", "");
  return h in META ? (h as ViewId) : "executive";
}

export function DashboardApp() {
  const [view, setView] = useState<ViewId>(initialView);
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const stageRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Filters, v: string) =>
    setFilters((f) => ({ ...f, [k]: v, ...(k === "state" ? { district: "All Districts" } : {}) }));
  const reset = () => setFilters(DEFAULTS);
  const goto = (v: ViewId) => {
    setView(v);
    history.replaceState(null, "", "#" + v);
    window.scrollTo({ top: 0 });
  };
  // The rail's items are `#<view>` links, so a click arrives as a hash change.
  useEffect(() => {
    const onHash = () => {
      setView(initialView());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const scope = filters.state === "All India" ? null : STATES.find((s) => s.name === filters.state) || null;
  const district =
    scope && filters.district !== "All Districts"
      ? districtsFor(scope).find((d) => d.name === filters.district) || null
      : null;
  const region: StateRow | District | null = district || scope;
  const onDrill = (row: LevelRow) => {
    if (row.level === "state") setFilters((f) => ({ ...f, state: row.name, district: "All Districts" }));
    else if (row.level === "district") setFilters((f) => ({ ...f, district: row.name }));
    window.scrollTo({ top: 0 });
  };

  const kpis = useMemo(() => {
    const unitShare = (scope ? scope.share : 1) * (district ? district.share : 1);
    const schemeF =
      CROSS.includes(view) && filters.scheme !== "All Schemes" ? SCHEME_SHARE[filters.scheme] || 1 : 1;
    const f = unitShare * schemeF * (FY_FACTOR[filters.fy] || 1) * (filters.period === "Annual" ? 1 : 0.26);
    return KPIS[view].map((kp) => scaleKpi(kp, f, region));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, filters.fy, filters.state, filters.district, filters.scheme, filters.period]);

  // responsive: scale the fixed 1440 canvas to fit viewport width
  useLayoutEffect(() => {
    const fit = () => {
      if (!appRef.current || !stageRef.current) return;
      const s = Math.min(1, window.innerWidth / 1440);
      appRef.current.style.transform = `scale(${s})`;
      stageRef.current.style.height = appRef.current.offsetHeight * s + "px";
    };
    fit();
    window.addEventListener("resize", fit);
    const ro = new ResizeObserver(fit);
    if (appRef.current) ro.observe(appRef.current);
    return () => {
      window.removeEventListener("resize", fit);
      ro.disconnect();
    };
  }, []);

  const ViewComp = VIEW_COMPONENTS[view];
  const meta = META[view];

  const crumbs: { label: string; onClick?: () => void }[] = [
    { label: "PM-AJAY", onClick: () => goto("executive") },
    { label: "Dashboards" },
    { label: meta.title, onClick: scope ? () => set("state", "All India") : undefined },
  ];
  if (scope) crumbs.push({ label: scope.name, onClick: district ? () => set("district", "All Districts") : undefined });
  if (district) crumbs.push({ label: district.name });

  return (
    <div className="pm-stage" ref={stageRef}>
      <div
        className="pm-app"
        data-density={DENSITY}
        ref={appRef}
        style={
          {
            "--pm-accent": ACCENT,
            "--pm-accent-bg": ACCENT_BG,
            "--pm-canvas": CANVAS,
          } as CSSProperties
        }
      >
        <Navbar />
        <div className="pm-body">
          <Sidebar view={view} />
          <div className="pm-content">
            <div className="pm-head">
              <nav className="pm-crumbs" aria-label="Breadcrumb">
                {crumbs.map((c, i) => (
                  <Fragment key={i}>
                    {c.onClick ? (
                      <button type="button" onClick={c.onClick}>
                        {c.label}
                      </button>
                    ) : (
                      <span className={i === crumbs.length - 1 ? "cur" : ""}>{c.label}</span>
                    )}
                    {i < crumbs.length - 1 && (
                      <span className="material-symbols-rounded" aria-hidden="true">
                        chevron_right
                      </span>
                    )}
                  </Fragment>
                ))}
              </nav>
              <h1>{meta.title}</h1>
              <p className="desc">{meta.desc}</p>
              {meta.banner && !scope && (
                <div className="pm-info">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    campaign
                  </span>
                  <div>
                    <b>{meta.banner.b}</b>
                    <span>{meta.banner.t}</span>
                  </div>
                </div>
              )}
            </div>
            <DrillDownFilters filters={filters} set={set} reset={reset} view={view} scope={scope} />
            <main className="pm-page" id="pm-main" aria-label={meta.title}>
              <ViewComp kpis={kpis} sp={SPARK} scope={scope} filters={filters} onDrill={onDrill} />
            </main>
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
