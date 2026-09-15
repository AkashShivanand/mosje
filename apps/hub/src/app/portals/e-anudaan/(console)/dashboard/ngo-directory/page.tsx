"use client";

/**
 * NGO Directory.
 *
 * DS Audit: WorklistScreen ✅ existing · Search ✅ · FilterSelect ✅ · Icon ✅ · screenCopy ✅ —
 * nothing new.
 *
 * Live: a directory searchable "by NGO name, DARPAN or registration no.", a State filter, an
 * Attendance column and View on every row. Ours had none of them, and no row led anywhere, so
 * NGO 360 was unreachable (inventory §32, §33).
 *
 * Attendance is read from the same monthly returns the NGO's own Attendance page shows
 * (`attendanceOf`), so the Ministry and the organisation see one figure. It left the directory
 * on 13 Sep because no organisation carried one; the returns now exist for every running project.
 */

import * as React from "react";
import { splitRowActions } from "@/components/e-anudaan/worklist-table";
import Link from "next/link";
import { FilterSelect, Icon, Search, WorklistScreen, buttonClasses, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant } from "@/lib/e-anudaan/selectors";
import { attendanceOf, officerApplications, type AttendanceSummary } from "@/lib/e-anudaan/registers";
import type { NgoProfile } from "@/lib/e-anudaan/types";

type Row = NgoProfile & { attendance: AttendanceSummary; filed: number; sanctioned: number };

export default function NgoDirectoryPage() {
  const { state } = useEAnudaan();
  const [q, setQ] = React.useState("");
  const [st, setSt] = React.useState("");

  const all = React.useMemo<Row[]>(() => {
    const files = officerApplications(state);
    const now = new Date();
    return state.ngos.map((n) => ({
      ...n,
      attendance: attendanceOf(state, n, now),
      filed: files.filter((a) => a.ngoId === n.id).length,
      sanctioned: files.filter((a) => a.ngoId === n.id && a.sanction).length,
    }));
  }, [state]);
  const states = [...new Set(all.map((n) => n.state))].sort();

  const needle = q.trim().toLowerCase();
  const rows = all.filter(
    (n) => (!st || n.state === st) && (!needle || `${n.name} ${n.darpanId} ${n.registrationNo}`.toLowerCase().includes(needle)),
  );

  const columns: WorklistColumn<Row>[] = [
    {
      key: "name",
      header: "NGO",
      priority: 1,
      sortable: true,
      sortValue: (n) => n.name,
      exportValue: (n) => n.name,
      render: (n) => (
        <span className="block min-w-[10rem]">
          <span className="block font-semibold text-ink">{n.name}</span>
          <span className="block font-mono text-body-3 text-ink-muted">NGO-Darpan {n.darpanId}</span>
        </span>
      ),
    },
    { key: "location", header: "Location", priority: 2, sortable: true, sortValue: (n) => `${n.state} ${n.district}`, exportValue: (n) => `${n.district}, ${n.state}`, render: (n) => `${n.district}, ${n.state}` },
    { key: "filed", header: "Applications", priority: 2, sortable: true, sortValue: (n) => n.filed, exportValue: (n) => String(n.filed), render: (n) => String(n.filed) },
    { key: "sanctioned", header: "Sanctioned", priority: 2, sortable: true, sortValue: (n) => n.sanctioned, exportValue: (n) => String(n.sanctioned), render: (n) => String(n.sanctioned) },
    { key: "totalGrant", header: "Total Grant", priority: 3, sortable: true, sortValue: (n) => n.totalGrant, exportValue: (n) => formatGrant(n.totalGrant), render: (n) => <span className="whitespace-nowrap">{formatGrant(n.totalGrant)}</span> },
    {
      key: "attendance",
      header: "Attendance",
      priority: 2,
      sortable: true,
      sortValue: (n) => n.attendance.percent ?? -1,
      exportValue: (n) => (n.attendance.percent === null ? "No returns due" : `${n.attendance.percent}%`),
      render: (n) =>
        n.attendance.running === 0 ? (
          <span className="text-ink-muted">No returns due</span>
        ) : (
          <span className="block whitespace-nowrap">
            {n.attendance.percent === null ? "Not filed" : `${n.attendance.percent.toLocaleString("en-IN")}%`}
            {n.attendance.missed > 0 && (
              <span className="block text-body-3 text-[var(--sa-text-status-warning-bolder)]">
                {n.attendance.missed} project{n.attendance.missed === 1 ? "" : "s"} with a return not filed
              </span>
            )}
          </span>
        ),
    },
    {
      key: "lastInspection",
      header: "Last Inspection",
      priority: 3,
      exportValue: (n) => (n.lastInspection ? formatDate(n.lastInspection) : ""),
      render: (n) => <span className="whitespace-nowrap">{n.lastInspection ? formatDate(n.lastInspection) : "—"}</span>,
    },
    {
      key: "action",
      header: "Action",
      priority: 3,
      noExport: true,
      className: "is-sticky-right",
      render: (n) => (
        <Link
          href={`/portals/e-anudaan/dashboard/ngo/${encodeURIComponent(n.id)}/360`}
          className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}
          aria-label={`View ${n.name}`}
        >
          <Icon name="open_in_new" size={16} aria-hidden /> View
        </Link>
      ),
    },
  ];

  const active = (q.trim() ? 1 : 0) + (st ? 1 : 0);

  return (
    <WorklistScreen<Row>
      title="NGO Directory"
      meta="Every voluntary organisation registered on E-Anudaan under the Department's schemes."
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={all.length}
      getRowId={(n) => n.id}
      noun="organisation"
      activeFilterCount={active}
      onClearFilters={() => {
        setQ("");
        setSt("");
      }}
      filters={
        <>
          <Search
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onClear={() => setQ("")}
            placeholder="NGO name, DARPAN or registration no."
            aria-label="Search by NGO name, NGO-Darpan ID or registration number"
          />
          <FilterSelect label="State" value={st} onChange={setSt} options={[{ value: "", label: "All States" }, ...states.map((s) => ({ value: s, label: s }))]} />
        </>
      }
      copy={screenCopy({
        loadingLabel: "Loading the NGO directory",
        emptyTitle: "No Organisations Registered",
        emptyDescription: "No voluntary organisation has been registered on this portal yet.",
        filteredTitle: "No Organisation Matches",
        filteredDescription: "Check the name or number, or clear the filters to see every organisation.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
