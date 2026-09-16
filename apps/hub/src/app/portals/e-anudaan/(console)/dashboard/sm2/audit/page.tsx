"use client";

/**
 * Audit Trail — JS grades and the Programme Director on the live portal. Its columns are the
 * source of the workflow's action vocabulary (INVENTORY §12); the action is shown in words and the
 * stored key ("communicateDeficiency") never reaches the screen.
 *
 * DS Audit: WorklistScreen ✅ existing · Search ✅ · FilterSelect ✅ · DatePicker ✅ · Button ✅ ·
 * Icon ✅ · screenCopy ✅ — nothing new.
 *
 * Design-director audit A-01 (16 Sep 2026): 1,280 rows with no search, filter, date range or
 * export, and no way from a row to its file. An auditor opens this page to find one file's trail.
 * The rows, the count line and the download all read `filterAuditTrail` once (registers.ts), so the
 * file downloaded is the list on the screen.
 */

import * as React from "react";
import Link from "next/link";
import { Button, DatePicker, FilterSelect, Icon, Search, WorklistScreen, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { formatDateTime } from "@/lib/e-anudaan/format";
import {
  AUDIT_OFFICES,
  NO_AUDIT_FILTERS,
  activeAuditFilterCount,
  auditFilterOptions,
  auditTrail,
  filterAuditTrail,
  type AuditTrailFilters,
  type AuditTrailRow,
} from "@/lib/e-anudaan/registers";
import { auditTrailCsv } from "@/lib/e-anudaan/reports";
import { RefText } from "@/components/e-anudaan/worklist-table";

export default function AuditTrailPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  const [f, setF] = React.useState<AuditTrailFilters>(NO_AUDIT_FILTERS);
  const set = <K extends keyof AuditTrailFilters>(k: K, v: AuditTrailFilters[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const all = React.useMemo(() => auditTrail(state), [state]);
  const rows = React.useMemo(() => filterAuditTrail(all, f), [all, f]);
  const options = React.useMemo(() => auditFilterOptions(all), [all]);
  /* Office and seat are one menu: each office, then its seats. Two selects plus a date range and
     a search did not fit one row at 1440, and the "To" date wrapped alone onto a second line. An
     office with a single seat (the Programme Director, the PMU, the NGO) is listed once. */
  const whoOptions = React.useMemo(() => {
    const seatsOf = (office: string) => options.roles.filter((r) => all.some((row) => row.roleId === r.value && row.office === office));
    return AUDIT_OFFICES.flatMap((office) => {
      const seats = seatsOf(office);
      if (seats.length === 0) return [];
      if (seats.length === 1) return [{ value: `office:${office}`, label: office }];
      return [{ value: `office:${office}`, label: `${office} — All Seats` }, ...seats.map((r) => ({ value: `role:${r.value}`, label: r.label }))];
    });
  }, [all, options.roles]);
  const who = f.role ? `role:${f.role}` : f.office ? `office:${f.office}` : "";
  const setWho = (v: string) =>
    setF((prev) => {
      // One menu is one filter: a seat already names its office, so the office is left unset.
      if (v.startsWith("role:")) return { ...prev, role: v.slice(5), office: "" };
      return { ...prev, office: v.startsWith("office:") ? v.slice(7) : "", role: "" };
    });
  const active = activeAuditFilterCount(f);

  const columns: WorklistColumn<AuditTrailRow>[] = [
    // Date AND time: an audit log read by date alone cannot order two actions taken the same day.
    { key: "at", header: "Timestamp", priority: 2, exportValue: (r) => formatDateTime(r.at), render: (r) => <span className="whitespace-nowrap">{formatDateTime(r.at)}</span> },
    /* The application is the row's name: an auditor scans this log for what happened to a given
       file, not for who was on duty. It opens the file, where the reader's own seat can review it. */
    {
      key: "application",
      header: "Application",
      priority: 1,
      exportValue: (r) => r.application,
      render: (r) => (
        <span className="block min-w-[12rem]">
          {key ? (
            <Link
              href={`/portals/e-anudaan/dashboard/sm2/${key}/review/${encodeURIComponent(r.application)}`}
              className="text-body-3 font-semibold text-[var(--sa-text-brand-primary-base)] underline-offset-2 hover:underline"
              aria-label={`Open application ${r.application}`}
            >
              <RefText value={r.application} />
            </Link>
          ) : (
            <RefText value={r.application} className="text-body-3" />
          )}
          <span className="block text-body-3 text-ink-muted">
            {r.project} · {r.ngo}
          </span>
        </span>
      ),
    },
    { key: "user", header: "User", priority: 2 },
    { key: "role", header: "Role", priority: 3 },
    { key: "action", header: "Action", priority: 2 },
    { key: "remarks", header: "Remarks", priority: 3, render: (r) => r.remarks || "—" },
  ];

  const download = () => {
    const blob = new Blob([auditTrailCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trail${f.from ? `-from-${f.from}` : ""}${f.to ? `-to-${f.to}` : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <WorklistScreen<AuditTrailRow>
      title="Audit Trail"
      meta="Every action recorded on an application, newest first."
      actions={
        <Button appearance="outlined" onClick={download} disabled={rows.length === 0}>
          <Icon name="download" size={20} aria-hidden /> Download CSV
        </Button>
      }
      columns={columns}
      rows={rows}
      registerTotal={all.length}
      getRowId={(r) => r.id}
      noun="entry"
      pluralNoun="entries"
      activeFilterCount={active}
      onClearFilters={() => setF(NO_AUDIT_FILTERS)}
      filters={
        <>
          <Search
            value={f.q}
            onChange={(e) => set("q", e.target.value)}
            onClear={() => set("q", "")}
            placeholder="Application or NGO"
            aria-label="Search by application number, project ID, NGO, officer or remarks"
          />
          <FilterSelect label="Office or Seat" value={who} onChange={setWho} options={[{ value: "", label: "All Offices" }, ...whoOptions]} />
          <FilterSelect
            label="Action"
            value={f.action}
            onChange={(v) => set("action", v)}
            options={[{ value: "", label: "All Actions" }, ...options.actions]}
          />
          <DatePicker label="From" value={f.from} onChange={(v) => set("from", v)} max={f.to || undefined} />
          <DatePicker label="To" value={f.to} onChange={(v) => set("to", v)} min={f.from || undefined} />
        </>
      }
      copy={screenCopy({
        loadingLabel: "Loading the audit trail",
        /* An audit log with no entries is a real answer, not a broken panel — nothing has been
           done to any application yet. */
        emptyTitle: "No Activity Recorded",
        emptyDescription: "No action has been taken on any application under this scheme.",
        filteredTitle: "No Entries Match Your Filters",
        filteredDescription: "Check the application number or the dates, or clear the filters to see the whole trail.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
