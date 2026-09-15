"use client";

/**
 * Sent — every file the Programme Director has sent on, as a list or by State.
 *
 * DS Audit: WorklistScreen ✅ existing · SegmentedControl ✅ · Badge ✅ · Icon ✅ · screenCopy ✅ —
 * nothing new.
 *
 * Live `/dashboard/avyay/sent`: file, NGO, State / District, the movement, the date, where the file
 * is now and ageing in days, with a List / By State toggle (inventory §28). Ageing was also asked
 * for in the review call (B8).
 */

import * as React from "react";
import Link from "next/link";
import { Badge, Icon, SegmentedControl, WorklistScreen, buttonClasses, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { formatDate } from "@/lib/e-anudaan/format";
import { auditActionLabel, statusLabel } from "@/lib/e-anudaan/workflow";
import { sentBy, sentByState, type SentByState, type SentRow } from "@/lib/e-anudaan/registers";
import { RefText, splitRowActions } from "@/components/e-anudaan/worklist-table";

type View = "list" | "state";

export default function SentPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  const [view, setView] = React.useState<View>("list");
  const rows = React.useMemo(() => (role ? sentBy(state, role.id) : []), [state, role]);
  const byState = React.useMemo(() => sentByState(rows), [rows]);
  const ngoName = (id: string) => state.ngos.find((n) => n.id === id)?.name ?? "—";

  const listColumns: WorklistColumn<SentRow>[] = [
    {
      key: "file",
      header: "Project ID",
      priority: 1,
      exportValue: (r) => `${r.app.institutionId} (${r.app.id})`,
      render: (r) => (
        <span className="block">
          <span className="block whitespace-nowrap font-mono font-semibold text-ink">{r.app.institutionId}</span>
          <RefText value={r.app.id} className="mt-0.5 block font-mono text-body-3 text-ink-muted" />
        </span>
      ),
    },
    {
      key: "ngo",
      header: "NGO",
      priority: 2,
      exportValue: (r) => ngoName(r.app.ngoId),
      render: (r) => (
        <span className="block min-w-[8rem]">
          <span className="block text-ink">{ngoName(r.app.ngoId)}</span>
          <span className="block text-body-3 text-ink-muted">{r.place ? `${r.place.district}, ${r.place.state}` : ""}</span>
        </span>
      ),
    },
    {
      key: "movement",
      header: "Sent",
      priority: 2,
      exportValue: (r) => `${auditActionLabel(r.entry.action)} ${formatDate(r.entry.at)}`,
      render: (r) => (
        <span className="block whitespace-nowrap">
          {auditActionLabel(r.entry.action)}
          <span className="block text-body-3 text-ink-muted">{formatDate(r.entry.at)}</span>
        </span>
      ),
    },
    { key: "now", header: "Current Status", priority: 2, exportValue: (r) => statusLabel(r.app), render: (r) => <span className="block min-w-[10rem]">{statusLabel(r.app)}</span> },
    {
      key: "days",
      header: "Ageing",
      priority: 2,
      sortable: true,
      sortValue: (r) => (r.pending ? r.days : -1),
      exportValue: (r) => (r.pending ? String(r.days) : ""),
      render: (r) =>
        r.pending ? (
          <span className={`whitespace-nowrap ${r.days > 7 ? "font-semibold text-[var(--sa-text-status-error-base)]" : "text-ink"}`}>
            {r.days} day{r.days === 1 ? "" : "s"}
          </span>
        ) : (
          <Badge status="neutral" size="sm">Closed</Badge>
        ),
    },
    {
      key: "action",
      header: "Action",
      priority: 3,
      noExport: true,
      className: "is-sticky-right",
      render: (r) =>
        key ? (
          <Link
            href={`/portals/e-anudaan/dashboard/sm2/${key}/review/${encodeURIComponent(r.app.id)}`}
            className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}
            aria-label={`View project ${r.app.institutionId}`}
          >
            <Icon name="open_in_new" size={16} aria-hidden /> View
          </Link>
        ) : null,
    },
  ];

  const stateColumns: WorklistColumn<SentByState>[] = [
    { key: "state", header: "State", priority: 1 },
    { key: "sent", header: "Files Sent", priority: 2, render: (s) => String(s.sent) },
    { key: "pending", header: "Still Pending", priority: 2, render: (s) => String(s.pending) },
    { key: "oldestPending", header: "Longest Pending", priority: 2, render: (s) => (s.oldestPending === null ? "—" : `${s.oldestPending} day${s.oldestPending === 1 ? "" : "s"}`) },
  ];

  const toggle = (
    <SegmentedControl<View>
      ariaLabel="Show"
      value={view}
      onChange={setView}
      options={[
        { value: "list", label: "List" },
        { value: "state", label: "By State" },
      ]}
    />
  );
  const copy = screenCopy({
    loadingLabel: "Loading sent files",
    emptyTitle: "No Files Sent",
    emptyDescription: "Files you sanction, return or reject appear here.",
    filteredTitle: "No File Matches",
    clearFiltersLabel: "Clear Filters",
  });
  const meta = "Files you have sanctioned, returned or rejected, and where each is now.";

  return view === "list" ? (
    <WorklistScreen<SentRow> title="Sent" meta={meta} {...splitRowActions(listColumns)} rows={rows} getRowId={(r) => r.app.id} noun="file" filters={toggle} copy={copy} />
  ) : (
    <WorklistScreen<SentByState> title="Sent" meta={meta} columns={stateColumns} rows={byState} getRowId={(s) => s.state} noun="State" filters={toggle} copy={copy} countLine={null} />
  );
}
