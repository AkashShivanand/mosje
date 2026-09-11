"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { KpiCard, KPI_ICONS, type KpiSpec } from "@/components/smile-admin/dashboard/kpi-card";
import {
  DISTRICT_ROWS,
  DISTRICT_STATES,
  STATE_ROWS,
  totals,
  type GeoRow,
} from "@/lib/smile-admin/geography";
import { PROGRAMME_KPI_ALL_INDIA } from "@/lib/smile-admin/mock-data";
import { DATA_VERSIONS } from "@/lib/smile-admin/mis-reports";
import { formatNumber } from "@/lib/smile-admin/utils";
import {
  BarChart,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DataTable,
  IndiaMap,
  SectionTitle,
  type DataTableColumn,
} from "@mosje/design-system";

type Scope = "state" | "district";

const MEASURES = [
  { key: "identified", label: "Identified", colour: "#1d4ed8" },
  { key: "mobilised", label: "Mobilised", colour: "#0f766e" },
  { key: "rehabilitated", label: "Rehabilitated", colour: "#b45309" },
] as const;

const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

/**
 * Programme Overview, broken down by State/UT or by district.
 *
 * Two screens, one component. They differ in exactly two ways — which register
 * they read, and whether a state has to be chosen first — and writing them
 * twice would leave two copies of the map, the register, the total row and the
 * three charts to keep in step.
 */
export function GeographyOverview({ scope }: { scope: Scope }) {
  const [version, setVersion] = useState(DATA_VERSIONS[0]!);
  const [state, setState] = useState(DISTRICT_STATES[0]!);

  const rows: GeoRow[] = useMemo(
    () => (scope === "state" ? STATE_ROWS : DISTRICT_ROWS.filter((r) => r.state === state)),
    [scope, state],
  );

  const sum = totals(rows);
  const reporting = rows.filter((r) => r.identified > 0).length;

  const kpi = PROGRAMME_KPI_ALL_INDIA;
  // The tiles sum the register on screen, so the meta line has to say what that
  // register covers. The card's default reads "all states", which is a lie on a
  // district screen scoped to one.
  const meta = scope === "state" ? "All-time · all States and UTs" : `All-time · ${state}`;
  const KPIS: KpiSpec[] = [
    { key: "identified", label: "Identified / Surveyed", value: sum.identified, icon: KPI_ICONS.identified, iconBg: "bg-info-50", iconColor: "text-info-600", labelColor: "text-ink-muted", meta },
    { key: "mobilised", label: "Mobilised", value: sum.mobilised, icon: KPI_ICONS.mobilised, iconBg: "bg-primary-50", iconColor: "text-primary", labelColor: "text-ink-muted", meta },
    { key: "rehabilitated", label: "Rehabilitated", value: sum.rehabilitated, icon: KPI_ICONS.rehab, iconBg: "bg-success-50", iconColor: "text-success-600", labelColor: "text-ink-muted", meta },
    { key: "disbursed", label: "Fund Disbursed", value: kpi.fundDisbursed, icon: KPI_ICONS.disbursed, iconBg: "bg-warning-50", iconColor: "text-warning-600", labelColor: "text-ink-muted", format: "currency", meta: "All-time · all States and UTs" },
  ];

  const label = scope === "state" ? "State / UT" : "District";
  const columns: DataTableColumn<GeoRow & Record<string, unknown>>[] = [
    {
      key: scope === "state" ? "state" : "district",
      header: label,
      sortable: true,
      className: "font-medium text-ink",
      render: (r) => (scope === "state" ? r.state : (r.district ?? "—")),
    },
    { key: "identified", header: "Identified", sortable: true, className: "text-right tabular-nums", sortValue: (r) => r.identified, render: (r) => formatNumber(r.identified) },
    { key: "mobilised", header: "Mobilised", sortable: true, className: "text-right tabular-nums", sortValue: (r) => r.mobilised, render: (r) => formatNumber(r.mobilised) },
    { key: "rehabilitated", header: "Rehab.", sortable: true, className: "text-right tabular-nums", sortValue: (r) => r.rehabilitated, render: (r) => formatNumber(r.rehabilitated) },
  ];

  const chartFor = (measure: (typeof MEASURES)[number]) => (
    <Card key={measure.key}>
      <CardHeader>
        <CardTitle>
          {measure.label} Beneficiary {scope === "state" ? "State" : "District"} wise Details
        </CardTitle>
      </CardHeader>
      <CardBody>
        <BarChart
          title={`${measure.label} beneficiaries by ${scope}`}
          orientation="horizontal"
          width={820}
          height={Math.max(240, rows.length * 22)}
          data={[...rows]
            .filter((r) => r[measure.key] > 0)
            .sort((a, b) => b[measure.key] - a[measure.key])
            .map((r) => ({
              label: scope === "state" ? r.state : (r.district ?? r.state),
              value: r[measure.key],
              color: measure.colour,
            }))}
        />
      </CardBody>
    </Card>
  );

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/portals/smile-admin/dashboard" },
          { label: scope === "state" ? "State-wise" : "District-wise" },
        ]}
        eyebrow={scope === "state" ? "State-wise" : "District-wise"}
        title="Programme Overview"
        subtitle="Support for Marginalised Individuals for Livelihood and Enterprise."
        actions={
          <div className="flex flex-wrap items-center gap-sm">
            <label className="flex items-center gap-xs text-label-2 text-ink-muted">
              Data
              <select aria-label="Data version" value={version} onChange={(e) => setVersion(e.target.value)} className="h-9 rounded-md border border-stroke-300 bg-white px-sm text-body-2 text-ink shadow-xs">
                {DATA_VERSIONS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <ExportMenu
              filename={`smile-programme-overview-${scope}-wise`}
              title={`Programme Overview — ${scope === "state" ? "State" : "District"}-wise`}
              subtitle="Identified, mobilised and rehabilitated beneficiaries"
              columns={[
                ...(scope === "district" ? [{ header: "State", accessor: "state" as const }] : []),
                { header: label, accessor: (r: GeoRow) => (scope === "state" ? r.state : (r.district ?? "—")) },
                { header: "Identified", accessor: "identified" as const },
                { header: "Mobilised", accessor: "mobilised" as const },
                { header: "Rehabilitated", accessor: "rehabilitated" as const },
              ]}
              rows={rows}
            />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-md lg:grid-cols-4">
        {KPIS.map((k) => (
          <KpiCard key={k.key} spec={k} />
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-md border-b border-stroke-100 p-lg">
          <div className="space-y-xxs">
            <CardTitle>
              {scope === "state" ? "State-wise" : "District-wise"} Beneficiary Distribution
            </CardTitle>
            <p className="text-body-2 text-ink-muted">
              {scope === "state"
                ? `${reporting} of ${rows.length} States and Union Territories have reported a figure.`
                : `${rows.length} districts in ${state}.`}
            </p>
          </div>
          {scope === "district" ? (
            <label className="flex items-center gap-xs text-label-2 text-ink-muted">
              State
              <select aria-label="Select a state" value={state} onChange={(e) => setState(e.target.value)} className={SELECT}>
                {DISTRICT_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <CardBody className="grid grid-cols-1 gap-lg p-lg lg:grid-cols-[1.2fr_1fr]">
          <div className="relative overflow-hidden rounded-md border border-stroke-100 bg-gradient-to-br from-primary-50/50 to-primary-50/10 p-md">
            <IndiaMap
              title={scope === "state" ? "Beneficiaries identified by state" : `Beneficiaries identified in ${state}`}
              data={STATE_ROWS.map((r) => ({ state: r.state, value: r.identified }))}
              highlightState={scope === "district" ? state : undefined}
            />
          </div>
          <div className="space-y-sm">
            <DataTable
              columns={columns}
              data={rows as Array<GeoRow & Record<string, unknown>>}
              total={rows.length}
              pageSizes={[rows.length || 1]}
              showPageSizes={false}
              caption={`Identified, mobilised and rehabilitated beneficiaries by ${scope}`}
              emptyLabel="No figure has been reported."
            />
            {/* The total is a row of the register, not a fifth card: a reader
                comparing a state against the whole needs both in one column. */}
            <div className="flex items-center justify-between gap-md rounded-md bg-neutral-50 px-md py-sm text-body-2 font-semibold text-ink">
              <span>Total</span>
              <span className="flex gap-lg tabular-nums">
                <span>{formatNumber(sum.identified)}</span>
                <span>{formatNumber(sum.mobilised)}</span>
                <span>{formatNumber(sum.rehabilitated)}</span>
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <SectionTitle
        title={`${scope === "state" ? "State" : "District"}-wise Details`}
        description="Each measure ranked, so the register above can be read as an order rather than scanned."
      />
      <div className="space-y-lg">{MEASURES.map(chartFor)}</div>
    </div>
  );
}
