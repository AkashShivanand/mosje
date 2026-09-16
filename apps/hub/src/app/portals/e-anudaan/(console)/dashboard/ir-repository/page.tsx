"use client";

/**
 * Inspection Report Repository — every inspection report filed, by State.
 *
 * DS Audit: WorklistScreen ✅ existing · FilterSelect ✅ · Search ✅ · Button ✅ · Badge ✅ ·
 * InspectionDialog (portal, view mode) ✅ — nothing new.
 *
 * Live `/dashboard/avyay/ir-repository` (Programme Director and PMU): state-grouped reports with
 * FY, file, NGO, type, date, recommendation and the report. The raw `NON_COMPLIANT` and `OFFLINE`
 * codes live shows are written as words here (inventory §29).
 */

import * as React from "react";
import { Badge, Button, FilterSelect, Search, WorklistScreen, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate } from "@/lib/e-anudaan/format";
import { INSPECTION_STATUS_LABEL } from "@/lib/e-anudaan/officer";
import { inspectionReports, type ReportRow } from "@/lib/e-anudaan/registers";
import { InspectionDialog, RefText, splitRowActions } from "@/components/e-anudaan/worklist-table";

const TONE = { Satisfactory: "success", "Needs improvement": "warning", Unsatisfactory: "danger" } as const;

export default function IrRepositoryPage() {
  const { state } = useEAnudaan();
  const [st, setSt] = React.useState("");
  const [fy, setFy] = React.useState("");
  const [q, setQ] = React.useState("");
  const [viewing, setViewing] = React.useState<ReportRow | null>(null);

  const all = React.useMemo(() => inspectionReports(state), [state]);
  const states = [...new Set(all.map((r) => r.place?.state).filter((s): s is string => !!s))].sort();
  const years = [...new Set(all.map((r) => r.app?.financialYear).filter((y): y is string => !!y))].sort().reverse();
  const needle = q.trim().toLowerCase();
  const rows = all.filter(
    (r) =>
      (!st || r.place?.state === st) &&
      (!fy || r.app?.financialYear === fy) &&
      (!needle || `${r.inspection.institutionId} ${r.inspection.applicationId} ${r.ngo?.name ?? ""}`.toLowerCase().includes(needle)),
  );

  const columns: WorklistColumn<ReportRow>[] = [
    { key: "state", header: "State", priority: 2, exportValue: (r) => r.place?.state ?? "", render: (r) => <span className="whitespace-nowrap">{r.place ? `${r.place.state}` : "—"}<span className="block text-body-3 text-ink-muted">{r.place?.district}</span></span> },
    {
      key: "file",
      header: "Project ID",
      priority: 1,
      exportValue: (r) => `${r.inspection.institutionId} (${r.inspection.applicationId})`,
      render: (r) => (
        <span className="block">
          <span className="block whitespace-nowrap font-mono font-semibold text-ink">{r.inspection.institutionId}</span>
          <RefText value={r.inspection.applicationId} className="mt-0.5 block font-mono text-body-3 text-ink-muted" />
        </span>
      ),
    },
    { key: "ngo", header: "NGO", priority: 2, exportValue: (r) => r.ngo?.name ?? "", render: (r) => <span className="block min-w-[8rem]">{r.ngo?.name ?? "—"}</span> },
    { key: "fy", header: "Financial Year", priority: 3, exportValue: (r) => r.app?.financialYear ?? "", render: (r) => <span className="whitespace-nowrap">{r.app ? `FY ${r.app.financialYear}` : "—"}</span> },
    {
      key: "visit",
      header: "Visit",
      priority: 2,
      exportValue: (r) => `${r.inspection.visitType} ${r.inspection.scheduledFor ? formatDate(r.inspection.scheduledFor) : ""}`,
      render: (r) => (
        <span className="block whitespace-nowrap">
          {r.inspection.scheduledFor ? formatDate(r.inspection.scheduledFor) : "—"}
          <span className="block text-body-3 text-ink-muted">
            {r.inspection.visitType} · {INSPECTION_STATUS_LABEL[r.inspection.status]}
          </span>
        </span>
      ),
    },
    {
      key: "recommendation",
      header: "Recommendation",
      priority: 2,
      exportValue: (r) => r.inspection.recommendation ?? "Not Recorded",
      render: (r) =>
        r.inspection.recommendation ? (
          <Badge status={TONE[r.inspection.recommendation]} size="sm">
            <span className="whitespace-nowrap">{r.inspection.recommendation}</span>
          </Badge>
        ) : (
          <span className="text-ink-muted">Not Recorded</span>
        ),
    },
    {
      key: "action",
      header: "Report",
      priority: 3,
      noExport: true,
      className: "is-sticky-right",
      render: (r) => (
        <Button size="sm" appearance="text" nowrap onClick={() => setViewing(r)} aria-label={`View the inspection report for ${r.inspection.institutionId}`}>
          View Report
        </Button>
      ),
    },
  ];

  const active = (st ? 1 : 0) + (fy ? 1 : 0) + (q.trim() ? 1 : 0);

  return (
    <>
      <WorklistScreen<ReportRow>
        title="Inspection Report Repository"
        meta="Every inspection report filed on a sanctioned file, by State."
        {...splitRowActions(columns)}
        rows={rows}
        registerTotal={all.length}
        getRowId={(r) => r.inspection.id}
        noun="report"
        activeFilterCount={active}
        onClearFilters={() => {
          setSt("");
          setFy("");
          setQ("");
        }}
        filters={
          <>
            <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Project ID or NGO" aria-label="Search inspection reports" />
            <FilterSelect label="State" value={st} onChange={setSt} options={[{ value: "", label: "All States" }, ...states.map((s) => ({ value: s, label: s }))]} />
            <FilterSelect label="Financial Year" value={fy} onChange={setFy} options={[{ value: "", label: "All Years" }, ...years.map((y) => ({ value: y, label: `FY ${y}` }))]} />
          </>
        }
        copy={screenCopy({
          loadingLabel: "Loading inspection reports",
          emptyTitle: "No Inspection Reports Filed",
          emptyDescription: "Reports appear here once the PMU files them.",
          filteredTitle: "No Report Matches",
          filteredDescription: "Clear the filters to see every report.",
          clearFiltersLabel: "Clear Filters",
        })}
      />
      {viewing && (
        <InspectionDialog
          key={viewing.inspection.id}
          insp={viewing.inspection}
          action="view"
          ngoName={viewing.ngo?.name ?? "—"}
          onClose={() => setViewing(null)}
          onSave={() => setViewing(null)}
        />
      )}
    </>
  );
}
