"use client";

/**
 * Reports & Analytics.
 *
 * DS Audit: WorklistScreen ✅ existing · FilterSelect ✅ · Search ✅ · Button ✅ · Icon ✅ ·
 * screenCopy ✅ — nothing new.
 *
 * Live offers nine reports with Scheme, Financial Year and NGO filters and PDF · Excel · CSV
 * export; ours was one applications table with no controls (inventory §34). The nine are defined
 * as data in `reports.ts`, so the table and the downloaded file are the same rows.
 *
 * Export, in this prototype: the CSV is generated in the browser (it opens in Excel), and PDF is
 * the browser's own print dialog. No Excel workbook is generated.
 */

import * as React from "react";
import { Button, FilterSelect, Icon, Search, WorklistScreen, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { officerApplications } from "@/lib/e-anudaan/registers";
import { REPORTS, formatCell, reportById, reportCsv, type ReportRow } from "@/lib/e-anudaan/reports";
import { RefText } from "@/components/e-anudaan/worklist-table";

export default function ReportsPage() {
  const { state } = useEAnudaan();
  const [reportId, setReportId] = React.useState(REPORTS[0]!.id);
  const [scheme, setScheme] = React.useState("");
  const [fy, setFy] = React.useState("");
  const [ngo, setNgo] = React.useState("");

  const report = reportById(reportId) ?? REPORTS[0]!;
  const files = React.useMemo(() => officerApplications(state), [state]);
  const schemes = [...new Set(files.map((a) => a.schemeCode))].sort();
  const years = [...new Set(files.map((a) => a.financialYear))].sort().reverse();

  const now = React.useMemo(() => new Date(), []);
  const all = React.useMemo(() => report.rows(state, { scheme: "", fy: "", ngo: "" }, now), [report, state, now]);
  const rows = React.useMemo(() => report.rows(state, { scheme, fy, ngo }, now), [report, state, scheme, fy, ngo, now]);

  const columns = React.useMemo<WorklistColumn<ReportRow>[]>(
    () =>
      report.columns.map((c, i) => ({
        key: c.key,
        header: c.header,
        priority: i === 0 ? 1 : i < 5 ? 2 : 3,
        sortable: c.kind === "number" || c.kind === "money" || c.kind === "date" || c.kind === "datetime",
        sortValue: (r: ReportRow) => r[c.key] ?? "",
        className: c.kind === "number" || c.kind === "money" ? "text-right" : undefined,
        exportValue: (r: ReportRow) => formatCell(r[c.key] ?? null, c.kind),
        render: (r: ReportRow) =>
          c.kind === "reference" && r[c.key] ? (
            <RefText value={String(r[c.key])} className="font-mono text-body-3" />
          ) : (
            <span className={c.kind === "money" || c.kind === "date" || c.kind === "datetime" ? "whitespace-nowrap" : undefined}>
              {formatCell(r[c.key] ?? null, c.kind)}
            </span>
          ),
      })),
    [report],
  );

  const download = () => {
    const blob = new Blob([reportCsv(report, rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}${scheme ? `-${scheme.toLowerCase()}` : ""}${fy ? `-${fy}` : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const active = (scheme ? 1 : 0) + (fy ? 1 : 0) + (ngo.trim() ? 1 : 0);

  return (
    <WorklistScreen<ReportRow>
      title="Reports &amp; Analytics"
      meta={report.description}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button appearance="outlined" onClick={download} disabled={rows.length === 0}>
            <Icon name="download" size={20} aria-hidden /> Download CSV
          </Button>
          <Button appearance="outlined" onClick={() => window.print()} disabled={rows.length === 0}>
            <Icon name="print" size={20} aria-hidden /> Print or Save as PDF
          </Button>
        </div>
      }
      columns={columns}
      rows={rows}
      registerTotal={all.length}
      getRowId={(r) => r.id}
      noun="row"
      activeFilterCount={active}
      onClearFilters={() => {
        setScheme("");
        setFy("");
        setNgo("");
      }}
      filters={
        <>
          <FilterSelect label="Report" value={report.id} onChange={setReportId} options={REPORTS.map((r) => ({ value: r.id, label: r.title }))} />
          <FilterSelect
            label="Scheme"
            value={scheme}
            onChange={setScheme}
            options={[{ value: "", label: "All Schemes" }, ...schemes.map((s) => ({ value: s, label: schemeLabel(s) }))]}
          />
          <FilterSelect
            label="Financial Year"
            value={fy}
            onChange={setFy}
            options={[{ value: "", label: "All Years" }, ...years.map((y) => ({ value: y, label: `FY ${y}` }))]}
          />
          <Search value={ngo} onChange={(e) => setNgo(e.target.value)} onClear={() => setNgo("")} placeholder="NGO name or DARPAN" aria-label="Filter by NGO name, NGO-Darpan ID or registration number" />
        </>
      }
      copy={screenCopy({
        loadingLabel: "Preparing the report",
        emptyTitle: "Nothing to Report",
        emptyDescription: "No record falls under this report yet.",
        filteredTitle: "Nothing Matches These Filters",
        filteredDescription: "Clear the filters to see the whole report.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
