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
 *
 * Design-director audit RP-01 (16 Sep 2026): one table per report, money in full rupees, "12 in the
 * register", no totals and no chart, so a Deputy or Joint Secretary could read neither a total nor
 * a trend. Now each report carries its totals and one chart, both read from the rows the table
 * lists (`reportTotals`, `report.chart`), money in the summary form every other screen uses, and a
 * count line that names what it counts. DS Audit adds: ChartCard ✅ · RankedBarList ✅ · ListGroup ✅.
 */

import * as React from "react";
import {
  Button,
  ChartCard,
  FilterSelect,
  Icon,
  ListGroup,
  ListRow,
  RankedBarList,
  Search,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { officerApplications } from "@/lib/e-anudaan/registers";
import { REPORTS, formatCell, reportById, reportCsv, reportTotals, type ReportRow } from "@/lib/e-anudaan/reports";
import { formatMoney } from "@/lib/e-anudaan/format";
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

  const totals = reportTotals(report, rows);
  const chart = report.chart(rows);
  const figure = (kind: "number" | "money", n: number) => (kind === "money" ? formatMoney(n, "summary") : n.toLocaleString("en-IN"));
  const counted = (n: number) => `${n.toLocaleString("en-IN")} ${n === 1 ? report.noun : report.pluralNoun}`;
  const selection = fy || scheme ? [scheme ? schemeLabel(scheme) : null, fy ? `FY ${fy}` : null].filter(Boolean).join(" · ") : "All schemes and years";
  const trailing = (text: string) => <span className="text-title-3 font-semibold tabular-nums text-ink">{text}</span>;

  /* Totals and the chart follow the same filtered rows the table lists. From a tablet up they sit
     above the filters, as the figures on every officer register do. On a phone the two cards ran
     to about 900px and put the Report picker a screen and a half down, so there they follow the
     table; one copy is always display:none, so a screen reader meets them once. At empty or
     filtered-to-nothing the body's own message answers, and neither copy is drawn. */
  const summaryCards = (
    <>
      <ChartCard title="Totals" subtitle={selection} headingLevel={2}>
        <ListGroup size="sm" aria-label={`${report.title} totals`}>
          <ListRow title={report.pluralNoun.replace(/\b\w/g, (c) => c.toUpperCase())} trailing={trailing(rows.length.toLocaleString("en-IN"))} />
          {totals.map((t) => (
            <ListRow key={t.key} title={t.header} trailing={trailing(figure(t.kind, t.value))} />
          ))}
        </ListGroup>
      </ChartCard>
      <ChartCard
        title={chart.title}
        subtitle={selection}
        headingLevel={2}
        empty={chart.items.every((i) => i.value === 0)}
        emptyTitle="Nothing to Chart"
        emptyLabel="Every figure in this selection is zero."
      >
        <RankedBarList title={chart.title} items={chart.items} valueFormat={(n) => figure(chart.kind, n)} showRank={false} sort="none" pageSize={6} />
      </ChartCard>
    </>
  );

  return (
    <div className="space-y-5">
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
      summary={rows.length === 0 ? undefined : <div className="hidden gap-4 md:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">{summaryCards}</div>}
      countLine={rows.length === all.length ? `${counted(rows.length)}.` : `Showing ${rows.length.toLocaleString("en-IN")} of ${counted(all.length)}, filtered.`}
      getRowId={(r) => r.id}
      noun={report.noun}
      pluralNoun={report.pluralNoun}
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
    {rows.length > 0 && <div className="grid gap-4 md:hidden">{summaryCards}</div>}
    </div>
  );
}
