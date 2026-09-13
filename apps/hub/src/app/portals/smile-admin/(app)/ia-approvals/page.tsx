"use client";

import { useMemo, useState } from "react";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SearchField } from "@/components/smile-admin/data/data-toolbar";
import { IA_DOCUMENT_COUNT, IA_REQUESTS, type ApprovalState, type IaRequest } from "@/lib/smile-admin/approvals";
import { Badge, Button, WorklistScreen, type WorklistColumn } from "@mosje/design-system";

type Row = IaRequest & Record<string, unknown>;

const STATES = ["All States / UTs", ...Array.from(new Set(IA_REQUESTS.map((r) => r.state)))];
const DECISIONS: Array<ApprovalState | "All"> = ["Pending", "Approved", "Returned", "Rejected", "All"];
const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

const TONE: Record<ApprovalState, "warning" | "success" | "info" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Returned: "info",
  Rejected: "danger",
};

const COLUMNS: WorklistColumn<Row>[] = [
  {
    key: "agency",
    header: "Agency",
    priority: 1,
    sortable: true,
    render: (r) => (
      <>
        <div className="font-semibold text-ink">{r.agency}</div>
        <div className="text-label-2 text-ink-muted">{r.agencyType}</div>
      </>
    ),
    exportValue: (r) => `${r.agency} (${r.agencyType})`,
  },
  { key: "registration", header: "Registration", priority: 3, className: "font-mono text-body-2 text-ink-muted" },
  { key: "darpan", header: "Darpan ID", priority: 3, className: "font-mono text-body-2 text-ink-muted" },
  {
    key: "district",
    header: "District",
    priority: 2,
    sortable: true,
    render: (r) => (
      <>
        {r.district} <span className="text-ink-muted">/ {r.state}</span>
      </>
    ),
    exportValue: (r) => `${r.district} / ${r.state}`,
  },
  { key: "submittedBy", header: "Submitted by", priority: 3 },
  { key: "submittedOn", header: "Submitted on", priority: 2, sortable: true, className: "text-ink-muted" },
  {
    key: "documents",
    header: "Documents",
    priority: 2,
    sortable: true,
    sortValue: (r) => r.documents,
    // A short count, not a tick: "4 of 6" tells the reviewer whether the
    // request can be decided at all. A tick would say only that some arrived.
    render: (r) => (
      <span className={r.documents < IA_DOCUMENT_COUNT ? "text-warning-600" : "text-ink"}>
        {r.documents} of {IA_DOCUMENT_COUNT}
      </span>
    ),
    exportValue: (r) => `${r.documents} of ${IA_DOCUMENT_COUNT}`,
  },
  {
    key: "state_",
    header: "Decision",
    priority: 1,
    sortable: true,
    render: (r) => (
      <Badge status={TONE[r.state_]} dot>
        {r.state_}
      </Badge>
    ),
    exportValue: (r) => r.state_,
  },
];

/**
 * `WorklistScreen`, per docs/design-system/screen-templates.md §2 — the reader
 * decides each row, which is what makes this a worklist and not a register.
 *
 * The title and the sentence under it are the live screen's. Its COLUMNS are
 * not: the live queue is empty — "0 Pending · All registrations have been
 * reviewed" — so it draws no table to transcribe. The columns here are the ones
 * the Implementing Agency Report already prints, which is the nearest verified
 * vocabulary, and they should be checked against the live screen the first time
 * a real registration is pending.
 */
export default function IaApprovalsPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]!);
  const [decision, setDecision] = useState<ApprovalState | "All">("Pending");

  const rows = useMemo(
    () =>
      IA_REQUESTS.filter(
        (r) =>
          (!search || `${r.agency} ${r.district} ${r.registration}`.toLowerCase().includes(search.toLowerCase())) &&
          (state === STATES[0] || r.state === state) &&
          (decision === "All" || r.state_ === decision),
      ),
    [search, state, decision],
  );

  const activeFilterCount =
    (search ? 1 : 0) + (state === STATES[0] ? 0 : 1) + (decision === "All" ? 0 : 1);

  function clearFilters() {
    setSearch("");
    setState(STATES[0]!);
    setDecision("All");
  }

  return (
    <WorklistScreen
      eyebrow="Access Control"
      title="Pending IA Approvals"
      meta="Review and approve/reject pending implementing agency registrations."
      actions={
        <ExportMenu
          filename="smile-ia-approvals"
          title="IA Approvals"
          subtitle="Implementing-agency onboarding requests"
          columns={[
            { header: "Agency", accessor: "agency" },
            { header: "Agency type", accessor: "agencyType" },
            { header: "Registration", accessor: "registration" },
            { header: "Darpan ID", accessor: "darpan" },
            { header: "State", accessor: "state" },
            { header: "District", accessor: "district" },
            { header: "Submitted by", accessor: "submittedBy" },
            { header: "Submitted on", accessor: "submittedOn" },
            { header: "Documents", accessor: (r: IaRequest) => `${r.documents} of ${IA_DOCUMENT_COUNT}` },
            { header: "Decision", accessor: "state_" },
          ]}
          rows={rows}
        />
      }
      filters={
        <>
          <SearchField
            placeholder="Search agency, district or registration…"
            label="Search onboarding requests"
            value={search}
            onChange={setSearch}
          />
          <select aria-label="State or Union Territory" value={state} onChange={(e) => setState(e.target.value)} className={SELECT}>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            aria-label="Decision"
            value={decision}
            onChange={(e) => setDecision(e.target.value as ApprovalState | "All")}
            className={SELECT}
          >
            {DECISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      columns={COLUMNS}
      rows={rows as Row[]}
      registerTotal={IA_REQUESTS.length}
      getRowId={(r) => r.id}
      rowActions={(r) =>
        r.state_ === "Pending" ? (
          <div className="flex flex-wrap gap-xs">
            {/* Approve is disabled until every document is in. A reviewer
                cannot approve an onboarding on a file that is not complete,
                and offering the control anyway invites exactly that. */}
            <Button size="sm" variant="success" appearance="outlined" disabled={r.documents < IA_DOCUMENT_COUNT}>
              Approve
            </Button>
            <Button size="sm" appearance="outlined">
              Return
            </Button>
            <Button size="sm" variant="danger" appearance="text">
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-label-2 text-ink-hint">Decided</span>
        )
      }
      count={rows.length}
      filtered={activeFilterCount > 0}
      noun="onboarding request"
      copy={{
        idleTitle: "Choose a Decision State to Review",
        loadingLabel: "Loading onboarding requests",
        errorTitle: "Onboarding Requests Could Not Be Loaded",
        errorDescription: "The queue did not load. Please try again.",
        retryLabel: "Try again",
        // The live screen's own words for the state it is in today.
        emptyTitle: "No Pending IA Registrations",
        emptyDescription: "All registrations have been reviewed.",
        filteredTitle: "No Registration Matches These Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
