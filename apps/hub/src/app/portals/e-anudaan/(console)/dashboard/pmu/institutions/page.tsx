"use client";

/**
 * Institutions — every project once, never visited first.
 *
 * DS Audit: WorklistScreen ✅ existing · Search ✅ · FilterSelect ✅ · Button ✅ · Badge ✅ ·
 * useToast ✅ · InspectionDialog (portal) ✅ — nothing new.
 *
 * Live PMU "Institutions": Location, Applications, Last visited and "Start inspection", ordered so
 * the institutions never or longest unvisited lead (inventory §39).
 */

import * as React from "react";
import { Badge, Button, FilterSelect, Search, WorklistScreen, screenCopy, useToast, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate } from "@/lib/e-anudaan/format";
import { INSPECTION_STATUS_LABEL } from "@/lib/e-anudaan/officer";
import { institutionRegister, type InstitutionRow } from "@/lib/e-anudaan/registers";
import { InspectionDialog, splitRowActions } from "@/components/e-anudaan/worklist-table";
import type { Inspection } from "@/lib/e-anudaan/types";

export default function PmuInstitutionsPage() {
  const store = useEAnudaan();
  const { state } = store;
  const { toast } = useToast();
  const [q, setQ] = React.useState("");
  const [st, setSt] = React.useState("");
  const [scheduling, setScheduling] = React.useState<Inspection | null>(null);

  const all = React.useMemo(() => institutionRegister(state), [state]);
  const states = [...new Set(all.map((r) => r.institution.state))].sort();
  const needle = q.trim().toLowerCase();
  const rows = all.filter(
    (r) =>
      (!st || r.institution.state === st) &&
      (!needle || `${r.institution.id} ${r.institution.name} ${r.ngo.name}`.toLowerCase().includes(needle)),
  );

  const columns: WorklistColumn<InstitutionRow>[] = [
    {
      key: "institution",
      header: "Project",
      priority: 1,
      exportValue: (r) => `${r.institution.id} ${r.institution.name}`,
      render: (r) => (
        <span className="block">
          <span className="block whitespace-nowrap font-mono font-semibold text-ink">{r.institution.id}</span>
          <span className="block text-body-3 text-ink-muted">{r.institution.name}</span>
        </span>
      ),
    },
    { key: "ngo", header: "NGO", priority: 2, exportValue: (r) => r.ngo.name, render: (r) => <span className="block min-w-[8rem]">{r.ngo.name}</span> },
    { key: "location", header: "Location", priority: 2, exportValue: (r) => `${r.institution.district}, ${r.institution.state}`, render: (r) => `${r.institution.district}, ${r.institution.state}` },
    { key: "applications", header: "Applications", priority: 3, exportValue: (r) => String(r.applications), render: (r) => String(r.applications) },
    {
      key: "lastVisited",
      header: "Last Visited",
      priority: 2,
      exportValue: (r) => (r.lastVisited ? formatDate(r.lastVisited) : "Never"),
      render: (r) =>
        r.lastVisited ? <span className="whitespace-nowrap">{formatDate(r.lastVisited)}</span> : <Badge status="warning" size="sm">Never Visited</Badge>,
    },
    {
      key: "action",
      header: "Action",
      priority: 3,
      noExport: true,
      className: "is-sticky-right",
      render: (r) =>
        r.openVisit ? (
          <span className="whitespace-nowrap text-body-2 text-ink-muted">Visit {INSPECTION_STATUS_LABEL[r.openVisit.status]}</span>
        ) : r.inspectable ? (
          <Button
            size="sm"
            appearance="outlined"
            nowrap
            onClick={() => {
              const insp = store.raiseInspection(r.inspectable!.id);
              if (insp) setScheduling(insp);
              else toast("The latest sanctioned file on this project already has an inspection. Open it from PMU Inspections.", "info");
            }}
            aria-label={`Start inspection of ${r.institution.id}`}
          >
            Start Inspection
          </Button>
        ) : (
          <span className="whitespace-nowrap text-body-2 text-ink-muted">No Sanctioned File</span>
        ),
    },
  ];

  const active = (q.trim() ? 1 : 0) + (st ? 1 : 0);

  return (
    <>
      <WorklistScreen<InstitutionRow>
        title="Institutions"
        meta="Every project under the Department's schemes, those never visited first."
        {...splitRowActions(columns)}
        rows={rows}
        registerTotal={all.length}
        getRowId={(r) => r.institution.id}
        noun="institution"
        activeFilterCount={active}
        onClearFilters={() => {
          setQ("");
          setSt("");
        }}
        filters={
          <>
            <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Project ID, name or NGO" aria-label="Search institutions" />
            <FilterSelect label="State" value={st} onChange={setSt} options={[{ value: "", label: "All States" }, ...states.map((s) => ({ value: s, label: s }))]} />
          </>
        }
        copy={screenCopy({
          loadingLabel: "Loading institutions",
          emptyTitle: "No Institutions Registered",
          filteredTitle: "No Institution Matches",
          filteredDescription: "Clear the filters to see every institution.",
          clearFiltersLabel: "Clear Filters",
        })}
      />
      {scheduling && (
        <InspectionDialog
          key={scheduling.id}
          insp={scheduling}
          action="schedule"
          ngoName={state.ngos.find((n) => n.id === scheduling.ngoId)?.name ?? "—"}
          onClose={() => setScheduling(null)}
          onSave={(next, done) => {
            store.saveInspection(next);
            toast(done, "success");
            setScheduling(null);
          }}
        />
      )}
    </>
  );
}
