"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { DATA_VERSIONS, REPORT_STATES, type MisReport } from "@/lib/smile-admin/mis-reports";
import { DataTable, type DataTableColumn } from "@mosje/design-system";

type Row = Record<string, string | number>;

/**
 * One MIS report screen, rendered eight times from `MIS_REPORTS`.
 *
 * The live portal draws these eight as one page with a different column set,
 * and copying that here is the point: the counters, the Data-version / State /
 * District filters, the export pair and the paged register are written once, so
 * a fix to any of them reaches all eight reports rather than one.
 */
export function MisReportPage({ report }: { report: MisReport }) {
  const [version, setVersion] = useState(DATA_VERSIONS[0]!);
  const [state, setState] = useState(REPORT_STATES[0]!);
  const [district, setDistrict] = useState("All Districts");
  const [year, setYear] = useState("All years");

  const districts = useMemo(() => {
    const inState = report.rows.filter((r) => state === REPORT_STATES[0] || r.state === state);
    return ["All Districts", ...Array.from(new Set(inState.map((r) => String(r.district ?? "")).filter(Boolean)))];
  }, [report.rows, state]);

  const years = useMemo(
    () => ["All years", ...Array.from(new Set(report.rows.map((r) => String(r.year ?? "")).filter(Boolean)))],
    [report.rows],
  );

  const rows = useMemo(
    () =>
      report.rows.filter(
        (r) =>
          (state === REPORT_STATES[0] || r.state === state) &&
          (district === "All Districts" || r.district === district) &&
          (!report.hasYear || year === "All years" || String(r.year) === year),
      ),
    [report, state, district, year],
  );

  const activeFilters =
    (state === REPORT_STATES[0] ? 0 : 1) +
    (district === "All Districts" ? 0 : 1) +
    (report.hasYear && year !== "All years" ? 1 : 0);

  const PAGE = 20;
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));

  const columns: DataTableColumn<Row>[] = [
    {
      key: "sno",
      header: "#",
      className: "w-10 tabular-nums text-ink-hint",
      render: (r) => rows.indexOf(r) + 1,
      exportValue: (r) => String(rows.indexOf(r) + 1),
    },
    ...report.columns.map<DataTableColumn<Row>>((c) => ({
      key: c.key,
      header: c.header,
      sortable: true,
      className: c.numeric ? "text-right tabular-nums" : undefined,
      sortValue: c.numeric ? (r: Row) => Number(r[c.key] ?? 0) : undefined,
      render: (r: Row) => {
        const v = r[c.key];
        return v === "" || v === null || v === undefined ? "—" : String(v);
      },
    })),
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Reports" }, { label: "MIS" }, { label: report.title }]}
        eyebrow="Reports & Analytics"
        title={report.title}
        subtitle={report.subtitle}
        actions={
          <div className="flex flex-wrap items-center gap-sm">
            <label className="flex items-center gap-xs text-label-2 text-ink-muted">
              Data
              <select
                aria-label="Data version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="h-9 rounded-md border border-stroke-300 bg-white px-sm text-body-2 text-ink shadow-xs"
              >
                {DATA_VERSIONS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <ExportMenu
              filename={`smile-${report.slug}-report`}
              title={report.title}
              subtitle={report.subtitle}
              columns={report.columns.map((c) => ({ header: c.header, accessor: c.key }))}
              rows={rows}
            />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Total records" value={rows.length} icon="description" tone="primary" />
        <StatPill label="On this page" value={Math.min(PAGE, rows.length)} icon="list" tone="info" />
        <StatPill label="Pages" value={pages} icon="article" tone="success" />
        <StatPill label="Filters applied" value={activeFilters} icon="filter_alt" tone="warning" />
      </div>

      <DataToolbar>
        <select
          aria-label="State or Union Territory"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setDistrict("All Districts");
          }}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {REPORT_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {report.hasYear ? (
          <select
            aria-label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        ) : null}
        <span className="ml-auto text-label-2 text-ink-muted">
          {version}
        </span>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={columns}
          data={rows}
          total={rows.length}
          pageSizes={[PAGE, 50, 100]}
          caption={`${report.title} — ${report.subtitle}`}
          emptyLabel="No record matches these filters."
        />
      </div>
    </div>
  );
}
