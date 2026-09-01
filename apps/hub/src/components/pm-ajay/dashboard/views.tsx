"use client";

/* PM-AJAY Dashboard — the six dashboard views.
   Tables use the local sortable SortableTable; rows drill State → District. */

import type { ReactNode } from "react";
import {
  KpiCard,
  SectionHead,
  Panel,
  Status,
  BarCell,
  SortableTable,
  type Column,
  type Filters,
} from "./ui";
import { Donut, HBars, VBars, Funnel, Legend, C } from "./charts";
import {
  STATES,
  MONTHS,
  RELEASED_M,
  UTILIZED_M,
  districtsFor,
  type Kpi,
  type StateRow,
  type ViewId,
} from "@/lib/pm-ajay/data";

const INR = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const NUM = (n: number) => Math.round(n).toLocaleString("en-IN");

export interface LevelRow {
  name: string;
  __label: string;
  level: "state" | "district";
  natShare: number;
  util: number;
  uc: number;
  seats: number;
  villages: number;
  benef: number;
}

export interface ViewProps {
  kpis: Kpi[];
  sp: boolean;
  scope: StateRow | null;
  filters: Filters;
  onDrill: (row: LevelRow) => void;
}

function statusFor(u: number): ReactNode {
  if (u >= 84)
    return (
      <Status tone="green" icon="check_circle">
        On track
      </Status>
    );
  if (u >= 70) return <Status tone="amber">Monitor</Status>;
  if (u >= 50)
    return (
      <Status tone="amber" icon="priority_high">
        Lagging
      </Status>
    );
  return (
    <Status tone="red" icon="priority_high">
      At risk
    </Status>
  );
}
const barColor = (u: number) =>
  u >= 84 ? C.green : u >= 70 ? "var(--pm-accent)" : u >= 50 ? C.amber : C.red;

// rows for the current drill level: states, or districts of the selected state
function levelRows(scope: StateRow | null, filters: Filters, sortBy: "util" | "uc" | "seats" | "villages" = "util"): LevelRow[] {
  let rows: LevelRow[];
  if (!scope) {
    rows = STATES.map((s) => ({
      name: s.name,
      __label: s.name,
      level: "state" as const,
      natShare: s.share,
      util: s.util,
      uc: s.uc,
      seats: s.seats,
      villages: s.villages,
      benef: s.benef,
    }));
  } else {
    const ds =
      filters.district && filters.district !== "All Districts"
        ? districtsFor(scope).filter((d) => d.name === filters.district)
        : districtsFor(scope);
    rows = ds.map((d) => ({
      name: d.name,
      __label: d.name,
      level: "district" as const,
      natShare: d.share * scope.share,
      util: d.util,
      uc: d.uc,
      seats: Math.round(scope.seats * d.share),
      villages: Math.round(scope.villages * d.share),
      benef: scope.benef * d.share,
    }));
  }
  return rows.sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 10);
}

const rankCol: Column<LevelRow> = {
  key: "__rank",
  label: "#",
  sortable: false,
  render: (_r, i) => i + 1,
  cls: "rk",
  thStyle: { width: 18 },
};
function nameCol(scope: StateRow | null, drillable: boolean): Column<LevelRow> {
  return {
    key: "name",
    label: scope ? "District" : "State / UT",
    render: (r) => (
      <span className="nm">
        {r.name}
        {drillable && (
          <span className="material-symbols-rounded drillic" aria-hidden="true" style={{ marginLeft: "var(--sa-inline-6)" }}>
            chevron_right
          </span>
        )}
      </span>
    ),
  };
}
const tableMeta = (scope: StateRow | null) =>
  scope ? `Districts of ${scope.name}` : "All 36 States / UTs · sort or click a row to drill into districts";

function AlertRow({
  tone,
  icon,
  title,
  desc,
  when,
}: {
  tone: "red" | "amber";
  icon: string;
  title: string;
  desc: string;
  when: string;
}) {
  const bg = tone === "red" ? "var(--sa-color-status-dangerTonal)" : "var(--sa-color-status-warningTonal)",
    fg = tone === "red" ? "var(--sa-color-status-danger)" : "var(--sa-color-status-warning)";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--sa-inline-12)", padding: "var(--sa-padding-12)", border: "1px solid var(--pm-line)", borderRadius: "var(--sa-shape-8)" }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--sa-shape-8)",
          background: bg,
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        <span className="material-symbols-rounded" aria-hidden="true" style={{ fontSize: 19 }}>
          {icon}
        </span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: "600 14px/1.3 var(--font-sans)", color: "var(--pm-ink)" }}>{title}</div>
        <div style={{ font: "400 13px/1.4 var(--font-sans)", color: "var(--pm-muted)", marginTop: "var(--sa-stack-2)" }}>{desc}</div>
      </div>
      <span style={{ marginLeft: "auto", font: "500 12px/1 var(--font-sans)", color: "var(--pm-muted)", whiteSpace: "nowrap" }}>
        {when}
      </span>
    </div>
  );
}
const Row = ({ lab, val }: { lab: string; val: ReactNode }) => (
  <div className="pm-rowline">
    <span className="lab">{lab}</span>
    <span className="val">{val}</span>
  </div>
);

function KpiGrid({ kpis, sp, cls }: { kpis: Kpi[]; sp: boolean; cls?: string }) {
  return (
    <div className={"pm-kpis " + (cls || "")}>
      {kpis.map((k, i) => (
        <KpiCard key={i} kpi={k} showSpark={sp} />
      ))}
    </div>
  );
}

function drillProps(scope: StateRow | null, filters: Filters, onDrill: (r: LevelRow) => void) {
  const single = filters.district && filters.district !== "All Districts";
  return { onRowClick: single ? undefined : onDrill, drillable: !single };
}

/* ============ EXECUTIVE ============ */
function Executive({ kpis, sp, scope, filters, onDrill }: ViewProps) {
  const hero = [kpis[0]!, kpis[4]!, kpis[5]!, kpis[9]!];
  const rest = [1, 2, 3, 6, 7, 8].map((i) => kpis[i]!);
  const dp = drillProps(scope, filters, onDrill);
  const rows = levelRows(scope, filters);
  return (
    <>
      <KpiGrid kpis={hero} sp={sp} cls="cols4" />
      <div style={{ marginTop: "calc(var(--sa-stack-8) * -1)" }}>
        <KpiGrid kpis={rest} sp={sp} cls="cols3" />
      </div>
      <div>
        <SectionHead title="Fund Flow & Utilisation" meta="Figures in ₹ Crore · FY 2025-26" />
        <div className="pm-grid main" style={{ marginTop: "var(--sa-stack-16)" }}>
          <Panel title="Allocation → Utilization" sub="Conversion across the national fund pipeline">
            <Funnel
              stages={[
                { label: "Allocation", pct: 100, value: INR(9250), color: C.navy },
                { label: "Sanction", pct: 88, value: INR(8142), color: "var(--sa-color-action-primary-default)" },
                { label: "Release", pct: 73, value: INR(6718), color: C.blue2 },
                { label: "Utilization", pct: 57, value: INR(5306), color: C.green },
              ]}
            />
            <div style={{ display: "flex", gap: "var(--sa-inline-24)", marginTop: "var(--sa-stack-16)", paddingTop: "var(--sa-padding-16)", borderTop: "1px solid var(--pm-line)" }}>
              <div className="pm-bigstat">
                <span className="v">88%</span>
                <span className="l">Sanction / Allocation</span>
              </div>
              <div className="pm-bigstat">
                <span className="v">83%</span>
                <span className="l">Release / Sanction</span>
              </div>
              <div className="pm-bigstat">
                <span className="v">79%</span>
                <span className="l">Utilization / Release</span>
              </div>
            </div>
          </Panel>
          <Panel title="Overall Utilization" sub="Utilized vs released · target 85%">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-12)" }}>
              <Donut pct={79} size={168} color={C.green} center="79.0%" sub="Utilized" target={85} label="Overall utilization" />
              <div style={{ width: "100%" }} className="pm-rows">
                <Row lab="Utilized" val={INR(5306) + " Cr"} />
                <div className="pm-divider" />
                <Row lab="Unspent balance" val={INR(1412) + " Cr"} />
                <div className="pm-divider" />
                <Row lab="Target" val="85.0%" />
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <div className="pm-grid c2">
        <Panel title="Allocation by Scheme Component" sub="Share of FY 2025-26 budget">
          <HBars
            caption="Allocation by scheme component"
            data={[
              { label: "Grant-in-Aid (GIA)", value: 3145, color: "var(--pm-accent)", display: INR(3145) + " Cr" },
              { label: "Hostel", value: 2775, color: C.blue2, display: INR(2775) + " Cr" },
              { label: "Adarsh Gram", value: 2498, color: C.green, display: INR(2498) + " Cr" },
              { label: "Administration", value: 832, color: C.amber, display: INR(832) + " Cr" },
            ]}
          />
        </Panel>
        <Panel title="Requires Attention" sub="Governance & utilisation flags">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
            <AlertRow tone="red" icon="priority_high" title="9 States below 50% utilization" desc="Bihar, Jharkhand, Chhattisgarh & 6 more" when="Action" />
            <AlertRow tone="amber" icon="description" title="412 UCs pending over 90 days" desc="₹612 Cr next installment blocked" when="14 d" />
            <AlertRow tone="amber" icon="schedule" title="86 projects overdue" desc="Hostel & GIA · avg 47-day slip" when="Review" />
          </div>
        </Panel>
      </div>
      <div>
        <SectionHead title={scope ? `Utilisation — ${scope.name}` : "State-wise Utilisation"} meta={tableMeta(scope)} />
        <Panel style={{ marginTop: "var(--sa-stack-16)" }}>
          <SortableTable<LevelRow>
            caption="Utilisation by region"
            rows={rows}
            getKey={(r) => r.name}
            onRowClick={dp.onRowClick}
            initialSort={{ key: "util", dir: "desc" }}
            columns={[
              rankCol,
              nameCol(scope, dp.drillable),
              {
                key: "util",
                label: "Utilization",
                num: true,
                sortVal: (r) => r.util,
                render: (r) => <BarCell pct={r.util} color={barColor(r.util)} display={r.util + "%"} />,
                thStyle: { width: 200 },
              },
              { key: "rel", label: "Released", num: true, sortVal: (r) => (6718 * r.natShare) / 0.85, render: (r) => INR((6718 * r.natShare) / 0.85) + " Cr" },
              {
                key: "utl",
                label: "Utilized",
                num: true,
                sortVal: (r) => ((6718 * r.natShare) / 0.85) * r.util / 100,
                render: (r) => INR(((6718 * r.natShare) / 0.85) * r.util / 100) + " Cr",
              },
              { key: "uc", label: "UC Compliance", num: true, sortVal: (r) => r.uc, render: (r) => r.uc.toFixed(0) + "%" },
              { key: "st", label: "Status", sortable: false, render: (r) => statusFor(r.util) },
            ]}
          />
        </Panel>
      </div>
    </>
  );
}

/* ============ FINANCIAL ============ */
function Financial({ kpis, sp, scope, filters, onDrill }: ViewProps) {
  const dp = drillProps(scope, filters, onDrill);
  const rows = levelRows(scope, filters);
  return (
    <>
      <KpiGrid kpis={kpis} sp={sp} />
      <div>
        <SectionHead title="Fund Flow Over Time" meta="Monthly, ₹ Crore" />
        <div className="pm-grid main" style={{ marginTop: "var(--sa-stack-16)" }}>
          <Panel title="Funds Released vs Utilized" sub="FY 2025-26, by month (₹ Crore)">
            <VBars
              labels={MONTHS}
              unit="₹ Crore"
              series={[
                { name: "Released", color: "var(--pm-accent)", data: RELEASED_M },
                { name: "Utilized", color: C.green, data: UTILIZED_M },
              ]}
              height={210}
            />
            <div style={{ marginTop: "var(--sa-stack-12)" }}>
              <Legend items={[{ label: "Released", color: "var(--pm-accent)" }, { label: "Utilized", color: C.green }]} />
            </div>
          </Panel>
          <Panel title="Overall Utilization" sub="Target 85%">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-16)" }}>
              <Donut pct={79} size={160} color={C.green} center="79.0%" sub="Utilized" target={85} label="Overall utilization" />
              <div style={{ width: "100%" }} className="pm-rows">
                <Row lab="PFMS success rate" val="97.3%" />
                <div className="pm-divider" />
                <Row lab="Avg utilization time" val="42 days" />
                <div className="pm-divider" />
                <Row lab="Unspent balance" val={INR(1412) + " Cr"} />
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <div>
        <SectionHead title={scope ? `Fund Utilization — ${scope.name}` : "State-wise Fund Utilization"} meta={tableMeta(scope)} />
        <Panel style={{ marginTop: "var(--sa-stack-16)" }}>
          <SortableTable<LevelRow>
            caption="Fund utilisation by region"
            rows={rows}
            getKey={(r) => r.name}
            onRowClick={dp.onRowClick}
            initialSort={{ key: "util", dir: "desc" }}
            columns={[
              rankCol,
              nameCol(scope, dp.drillable),
              { key: "alloc", label: "Allocation", num: true, sortVal: (r) => 9250 * r.natShare, render: (r) => INR(9250 * r.natShare) + " Cr" },
              { key: "rel", label: "Released", num: true, sortVal: (r) => 9250 * r.natShare * 0.83, render: (r) => INR(9250 * r.natShare * 0.83) + " Cr" },
              { key: "utl", label: "Utilized", num: true, sortVal: (r) => 9250 * r.natShare * 0.83 * r.util / 100, render: (r) => INR(9250 * r.natShare * 0.83 * r.util / 100) + " Cr" },
              {
                key: "util",
                label: "Utilization",
                num: true,
                sortVal: (r) => r.util,
                render: (r) => <BarCell pct={r.util} color={barColor(r.util)} display={r.util + "%"} />,
                thStyle: { width: 190 },
              },
              { key: "st", label: "Status", sortable: false, render: (r) => statusFor(r.util) },
            ]}
          />
        </Panel>
      </div>
      <div className="pm-grid c2">
        <Panel title="Low Utilization Alerts" sub="States below 70% — installments at risk">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
            {[...STATES]
              .filter((s) => s.util < 70)
              .sort((a, b) => a.util - b.util)
              .slice(0, 4)
              .map((s) => (
                <AlertRow
                  key={s.code}
                  tone={s.util < 50 ? "red" : "amber"}
                  icon={s.util < 50 ? "priority_high" : "trending_down"}
                  title={`${s.name} — ${s.util}% utilization`}
                  desc={`${INR(9250 * s.share)} Cr allocated · UC ${s.uc.toFixed(0)}%`}
                  when={s.util < 50 ? "Action" : "Monitor"}
                />
              ))}
          </div>
        </Panel>
        <Panel title="PFMS & Processing" sub="Transaction health">
          <div className="pm-rows">
            <Row lab="PFMS transaction success" val="97.3%" />
            <div className="pm-divider" />
            <Row lab="Avg release → utilization" val="42 days" />
            <div className="pm-divider" />
            <Row lab="Highest utilization · Andhra Pradesh" val="91.2%" />
            <div className="pm-divider" />
            <Row lab="Lowest utilization · Chhattisgarh" val="57.2%" />
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ============ GIA ============ */
function GIA({ kpis, sp, scope, filters, onDrill }: ViewProps) {
  const dp = drillProps(scope, filters, onDrill);
  const rows = levelRows(scope, filters);
  return (
    <>
      <KpiGrid kpis={kpis} sp={sp} />
      <div>
        <SectionHead title="Approvals & Project Mix" meta="FY 2025-26" />
        <div className="pm-grid main" style={{ marginTop: "var(--sa-stack-16)" }}>
          <Panel title="Proposal & Fund Pipeline" sub="From submission to utilisation">
            <Funnel
              stages={[
                { label: "Submitted", pct: 100, value: "3,412", color: C.navy },
                { label: "Approved", pct: 75, value: "2,548", color: "var(--pm-accent)" },
                { label: "Funds sanctioned", pct: 66, value: INR(2310) + " Cr", color: C.blue2 },
                { label: "Funds utilized", pct: 49, value: INR(1712) + " Cr", color: C.green },
              ]}
            />
          </Panel>
          <Panel title="Project Mix" sub="By intervention type">
            <HBars
              caption="GIA project mix"
              data={[
                { label: "Income Generation", value: 1024, color: C.green, display: "1,024" },
                { label: "Skill Development", value: 768, color: "var(--pm-accent)", display: "768" },
                { label: "Infrastructure", value: 612, color: C.blue2, display: "612" },
              ]}
            />
            <div style={{ marginTop: "var(--sa-stack-16)", paddingTop: "var(--sa-padding-12)", borderTop: "1px solid var(--pm-line)" }} className="pm-rows">
              <Row lab="Physical progress achievement" val="73.4%" />
              <Row lab="Approval rate" val="74.7%" />
            </div>
          </Panel>
        </div>
      </div>
      <div>
        <SectionHead title={scope ? `GIA — ${scope.name}` : "State-wise GIA Performance"} meta={tableMeta(scope)} />
        <Panel style={{ marginTop: "var(--sa-stack-16)" }}>
          <SortableTable<LevelRow>
            caption="GIA performance by region"
            rows={rows}
            getKey={(r) => r.name}
            onRowClick={dp.onRowClick}
            initialSort={{ key: "util", dir: "desc" }}
            columns={[
              rankCol,
              nameCol(scope, dp.drillable),
              { key: "prop", label: "Proposals", num: true, sortVal: (r) => (3412 * r.natShare) / 0.07, render: (r) => NUM((3412 * r.natShare) / 0.07) },
              { key: "appr", label: "Approved", num: true, sortVal: (r) => (3412 * r.natShare) / 0.07 * 0.747, render: (r) => NUM((3412 * r.natShare) / 0.07 * 0.747) },
              { key: "fu", label: "Funds Utilized", num: true, sortVal: (r) => 1712 * r.natShare, render: (r) => INR(1712 * r.natShare) + " Cr" },
              { key: "benef", label: "Beneficiaries", num: true, sortVal: (r) => r.benef, render: (r) => r.benef.toFixed(2) + " L" },
              {
                key: "util",
                label: "Progress",
                num: true,
                sortVal: (r) => r.util,
                render: (r) => <BarCell pct={r.util} color={barColor(r.util)} display={r.util + "%"} />,
                thStyle: { width: 170 },
              },
            ]}
          />
        </Panel>
      </div>
    </>
  );
}

/* ============ HOSTEL ============ */
function Hostel({ kpis, sp, scope, filters, onDrill }: ViewProps) {
  const dp = drillProps(scope, filters, onDrill);
  const rows = levelRows(scope, filters, "seats");
  return (
    <>
      <KpiGrid kpis={kpis} sp={sp} />
      <div>
        <SectionHead title="Construction & Occupancy" meta="FY 2025-26" />
        <div className="pm-grid main" style={{ marginTop: "var(--sa-stack-16)" }}>
          <Panel title="Hostel Construction Status" sub="Approved hostels by stage">
            <VBars labels={["Approved", "Completed", "Under Constr."]} unit="hostels" series={[{ name: "Hostels", color: "var(--pm-accent)", data: [842, 514, 328] }]} height={200} />
            <div style={{ marginTop: "var(--sa-stack-12)", paddingTop: "var(--sa-padding-12)", borderTop: "1px solid var(--pm-line)" }} className="pm-rows">
              <Row lab="Completion rate" val="61.0% of approved" />
              <Row lab="Funds utilized" val={INR(1894) + " Cr of " + INR(2640) + " Cr"} />
            </div>
          </Panel>
          <Panel title="Seat Occupancy" sub="Seats filled vs created · target 80%">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-16)" }}>
              <Donut pct={76} size={160} color="var(--pm-accent)" center="76.0%" sub="Occupied" target={80} label="Seat occupancy" />
              <div style={{ width: "100%" }} className="pm-rows">
                <Row lab="Seats created" val="1,48,200" />
                <div className="pm-divider" />
                <Row lab="Current occupancy" val="1,12,640" />
                <div className="pm-divider" />
                <Row lab="Girls hostel capacity" val="91,884 (62%)" />
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <div>
        <SectionHead title={scope ? `Hostels — ${scope.name}` : "State-wise Hostel Delivery"} meta={tableMeta(scope)} />
        <Panel style={{ marginTop: "var(--sa-stack-16)" }}>
          <SortableTable<LevelRow>
            caption="Hostel delivery by region"
            rows={rows}
            getKey={(r) => r.name}
            onRowClick={dp.onRowClick}
            initialSort={{ key: "seats", dir: "desc" }}
            columns={[
              rankCol,
              nameCol(scope, dp.drillable),
              { key: "seats", label: "Seats Created", num: true, sortVal: (r) => r.seats, render: (r) => NUM(r.seats) },
              {
                key: "occ",
                label: "Occupancy",
                num: true,
                sortVal: (r) => Math.round((r.seats * Math.min(94, r.util * 0.95)) / 100),
                render: (r) => NUM((r.seats * Math.min(94, r.util * 0.95)) / 100),
              },
              {
                key: "occp",
                label: "Occupancy %",
                num: true,
                sortVal: (r) => Math.min(94, Math.round(r.util * 0.95)),
                render: (r) => {
                  const p = Math.min(94, Math.round(r.util * 0.95));
                  return <BarCell pct={p} color={p >= 80 ? C.green : p >= 65 ? "var(--pm-accent)" : C.amber} display={p + "%"} />;
                },
                thStyle: { width: 180 },
              },
              { key: "fu", label: "Funds Utilized", num: true, sortVal: (r) => (1894 * r.natShare) / 0.86, render: (r) => INR((1894 * r.natShare) / 0.86) + " Cr" },
            ]}
          />
        </Panel>
      </div>
    </>
  );
}

/* ============ ADARSH GRAM ============ */
function Adarsh({ kpis, sp, scope, filters, onDrill }: ViewProps) {
  const dp = drillProps(scope, filters, onDrill);
  const rows = levelRows(scope, filters, "villages");
  return (
    <>
      <KpiGrid kpis={kpis} sp={sp} />
      <div>
        <SectionHead title="Village Development Pipeline" meta="PMAGY · FY 2025-26" />
        <div className="pm-grid main" style={{ marginTop: "var(--sa-stack-16)" }}>
          <Panel title="Selected → Declared" sub="Adarsh Gram readiness pipeline">
            <Funnel
              stages={[
                { label: "Villages selected", pct: 100, value: "12,640", color: C.navy },
                { label: "Need assessments", pct: 86, value: "10,842", color: "var(--sa-color-action-primary-default)" },
                { label: "VDPs generated", pct: 75, value: "9,418", color: "var(--pm-accent)" },
                { label: "DLCC approved", pct: 65, value: "8,206", color: C.blue2 },
                { label: "Adarsh Gram declared", pct: 62, value: "7,842", color: C.green },
              ]}
            />
          </Panel>
          <Panel title="Works & Score" sub="Completion · target 80%">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-16)" }}>
              <Donut pct={70} size={150} color={C.green} center="70.0%" sub="Works done" target={80} label="Works completion" />
              <div style={{ width: "100%" }} className="pm-rows">
                <Row lab="Works identified" val="1,46,210" />
                <div className="pm-divider" />
                <Row lab="Works completed" val="1,02,394" />
                <div className="pm-divider" />
                <Row lab="Avg village score" val="78.4 / 100" />
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <div>
        <SectionHead title={scope ? `Adarsh Gram — ${scope.name}` : "State-wise Adarsh Gram Progress"} meta={tableMeta(scope)} />
        <Panel style={{ marginTop: "var(--sa-stack-16)" }}>
          <SortableTable<LevelRow>
            caption="Adarsh Gram progress by region"
            rows={rows}
            getKey={(r) => r.name}
            onRowClick={dp.onRowClick}
            initialSort={{ key: "villages", dir: "desc" }}
            columns={[
              rankCol,
              nameCol(scope, dp.drillable),
              { key: "villages", label: "Villages", num: true, sortVal: (r) => r.villages, render: (r) => NUM(r.villages) },
              { key: "decl", label: "Declared", num: true, sortVal: (r) => r.villages * (r.util / 100) * 0.86, render: (r) => NUM(r.villages * (r.util / 100) * 0.86) },
              { key: "works", label: "Works Done", num: true, sortVal: (r) => (r.villages * 8.1 * r.util) / 100, render: (r) => NUM((r.villages * 8.1 * r.util) / 100) },
              {
                key: "declp",
                label: "Declared %",
                num: true,
                sortVal: (r) => Math.round((r.util / 100) * 0.86 * 100),
                render: (r) => {
                  const p = Math.round((r.util / 100) * 0.86 * 100);
                  return <BarCell pct={p} color={barColor(r.util)} display={p + "%"} />;
                },
                thStyle: { width: 160 },
              },
              { key: "st", label: "Status", sortable: false, render: (r) => statusFor(r.util) },
            ]}
          />
        </Panel>
      </div>
    </>
  );
}

/* ============ GOVERNANCE ============ */
function Governance({ kpis, sp, scope, filters, onDrill }: ViewProps) {
  const dp = drillProps(scope, filters, onDrill);
  const rows = levelRows(scope, filters, "uc");
  return (
    <>
      <KpiGrid kpis={kpis} sp={sp} />
      <div>
        <SectionHead title="Compliance & Processing" meta="FY 2025-26" />
        <div className="pm-grid main" style={{ marginTop: "var(--sa-stack-16)" }}>
          <Panel title="Processing Times" sub="Average days at each stage">
            <VBars labels={["Proposal", "Sanction", "Fund Release", "Overall"]} unit="days" series={[{ name: "Days", color: "var(--pm-accent)", data: [38, 54, 28, 120] }]} height={200} />
            <div style={{ marginTop: "var(--sa-stack-12)", paddingTop: "var(--sa-padding-12)", borderTop: "1px solid var(--pm-line)" }} className="pm-rows">
              <Row lab="Proposals pending appraisal" val="426" />
              <Row lab="Overdue projects" val="86" />
            </div>
          </Panel>
          <Panel title="UC Compliance" sub="Accepted / submitted · target 90%">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-16)" }}>
              <Donut pct={86} size={160} color={C.green} center="86.4%" sub="Accepted" target={90} label="UC compliance" />
              <div style={{ width: "100%" }} className="pm-rows">
                <Row lab="UCs submitted" val="13,012" />
                <div className="pm-divider" />
                <Row lab="Pending UCs" val="1,772 (412 > 90 d)" />
                <div className="pm-divider" />
                <Row lab="Installments blocked" val={INR(612) + " Cr"} />
              </div>
            </div>
          </Panel>
        </div>
      </div>
      <div className="pm-grid c2">
        <Panel title="Requires Attention" sub="Open governance items">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
            <AlertRow tone="red" icon="block" title="₹612 Cr installments blocked" desc="412 UCs pending beyond 90 days" when="Action" />
            <AlertRow tone="amber" icon="event_busy" title="86 projects overdue" desc="Average 47-day slippage" when="Review" />
            <AlertRow tone="amber" icon="gavel" title="214 audit observations open" desc="Pending closure across schemes" when="Track" />
          </div>
        </Panel>
        <Panel title="Processing Snapshot" sub="Turnaround & queue">
          <div className="pm-rows">
            <Row lab="Avg proposal processing" val="38 days" />
            <div className="pm-divider" />
            <Row lab="Avg sanction processing" val="54 days" />
            <div className="pm-divider" />
            <Row lab="Proposals pending appraisal" val="426" />
            <div className="pm-divider" />
            <Row lab="Audit observations pending" val="214" />
          </div>
        </Panel>
      </div>
      <div>
        <SectionHead title={scope ? `UC Compliance — ${scope.name}` : "State-wise UC Compliance"} meta={tableMeta(scope)} />
        <Panel style={{ marginTop: "var(--sa-stack-16)" }}>
          <SortableTable<LevelRow>
            caption="UC compliance by region"
            rows={rows}
            getKey={(r) => r.name}
            onRowClick={dp.onRowClick}
            initialSort={{ key: "uc", dir: "desc" }}
            columns={[
              rankCol,
              nameCol(scope, dp.drillable),
              { key: "sub", label: "UCs Submitted", num: true, sortVal: (r) => (13012 * r.natShare) / 0.07, render: (r) => NUM((13012 * r.natShare) / 0.07) },
              { key: "acc", label: "Accepted", num: true, sortVal: (r) => (13012 * r.natShare) / 0.07 * r.uc / 100, render: (r) => NUM((13012 * r.natShare) / 0.07 * r.uc / 100) },
              { key: "pend", label: "Pending", num: true, sortVal: (r) => (13012 * r.natShare) / 0.07 * (1 - r.uc / 100), render: (r) => NUM((13012 * r.natShare) / 0.07 * (1 - r.uc / 100)) },
              {
                key: "uc",
                label: "Compliance",
                num: true,
                sortVal: (r) => r.uc,
                render: (r) => <BarCell pct={r.uc} color={r.uc >= 84 ? C.green : r.uc >= 70 ? "var(--pm-accent)" : C.amber} display={r.uc.toFixed(0) + "%"} />,
                thStyle: { width: 170 },
              },
              {
                key: "st",
                label: "Status",
                sortable: false,
                render: (r) =>
                  r.uc >= 84 ? (
                    <Status tone="green" icon="check_circle">
                      Compliant
                    </Status>
                  ) : r.uc >= 70 ? (
                    <Status tone="amber">Monitor</Status>
                  ) : (
                    <Status tone="red" icon="priority_high">
                      At risk
                    </Status>
                  ),
              },
            ]}
          />
        </Panel>
      </div>
    </>
  );
}

export const VIEW_COMPONENTS: Record<ViewId, (p: ViewProps) => ReactNode> = {
  executive: Executive,
  financial: Financial,
  gia: GIA,
  hostel: Hostel,
  adarsh: Adarsh,
  governance: Governance,
};
