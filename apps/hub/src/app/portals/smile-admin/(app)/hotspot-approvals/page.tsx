"use client";

import { useMemo, useState } from "react";
import { HOTSPOT_FORMS, type HotspotForm, type HotspotStatus } from "@/lib/smile-admin/mock-data";
import { Badge, Button, WorklistScreen, type WorklistColumn } from "@mosje/design-system";

const TABS = [
  { id: "Hotspot", label: "Hotspot forms" },
  { id: "Re-inspection", label: "Re-inspection forms" },
] as const;

const STATUSES: Array<HotspotStatus | "All"> = ["Pending", "Approved", "Rejected", "All"];

const TONE: Record<HotspotStatus, "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

const COLUMNS: WorklistColumn<HotspotForm & Record<string, unknown>>[] = [
  { key: "hotspot", header: "Hotspot", priority: 1, sortable: true },
  { key: "locationType", header: "Survey-location type", priority: 2, sortable: true },
  {
    key: "subLocations",
    header: "Sub-locations",
    priority: 3,
    sortable: true,
    className: "tabular-nums",
    sortValue: (r) => r.subLocations,
  },
  { key: "state", header: "State", priority: 2, sortable: true },
  { key: "district", header: "District", priority: 2, sortable: true },
  { key: "declaredBy", header: "Declared by", priority: 3 },
  { key: "declaredOn", header: "Declared on", priority: 3, sortable: true },
  {
    key: "status",
    header: "Status",
    priority: 1,
    sortable: true,
    render: (r) => (
      <Badge status={TONE[r.status]} dot>
        {r.status}
      </Badge>
    ),
    exportValue: (r) => r.status,
  },
];

/**
 * `WorklistScreen`, by the decision table in
 * docs/design-system/screen-templates.md §2: the reader ACTS on these rows —
 * approves or rejects a hotspot declaration — which is what separates a worklist
 * from a report.
 */
export default function HotspotApprovalsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("Hotspot");
  const [status, setStatus] = useState<HotspotStatus | "All">("Pending");

  const inTab = useMemo(() => HOTSPOT_FORMS.filter((f) => f.kind === tab), [tab]);
  const rows = useMemo(
    () => inTab.filter((f) => status === "All" || f.status === status),
    [inTab, status],
  );

  const noun = tab === "Hotspot" ? "hotspot form" : "re-inspection form";

  return (
    <WorklistScreen
      eyebrow="Field Operations"
      title="Hotspot Approvals"
      meta="Review the Implementing Agency hotspot declarations — the sub-locations recorded against each survey-location type — and the re-inspections filed against them."
      actions={
        <div role="tablist" aria-label="Form type" className="inline-flex gap-xs rounded-lg border border-stroke-200 bg-white p-xs shadow-xs">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-md bg-primary px-md py-xs text-label-1 font-semibold text-white"
                  : "rounded-md px-md py-xs text-label-1 text-ink-muted hover:bg-neutral-100 hover:text-ink"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      }
      filters={
        <label htmlFor="hotspot-status" className="flex items-center gap-xs text-label-2 text-ink-muted">
          Status
          <select
            id="hotspot-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as HotspotStatus | "All")}
            className={SELECT}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      }
      activeFilterCount={status === "All" ? 0 : 1}
      onClearFilters={() => setStatus("All")}
      columns={COLUMNS}
      rows={rows as Array<HotspotForm & Record<string, unknown>>}
      registerTotal={inTab.length}
      getRowId={(r) => r.id}
      rowActions={(r) =>
        r.status === "Pending" ? (
          <div className="flex gap-xs">
            <Button size="sm" variant="success" appearance="outlined">
              Approve
            </Button>
            <Button size="sm" variant="danger" appearance="text">
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-label-2 text-ink-hint">Reviewed</span>
        )
      }
      count={rows.length}
      filtered={status !== "All"}
      noun={noun}
      copy={{
        idleTitle: "Choose a Status to Review",
        loadingLabel: `Loading ${noun}s`,
        errorTitle: "These Forms Could Not Be Loaded",
        errorDescription: "The queue did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "Nothing Is Waiting for Review",
        emptyDescription: `No ${noun} has been filed yet.`,
        filteredTitle: `No ${noun.charAt(0).toUpperCase() + noun.slice(1)} at This Status`,
        clearFiltersLabel: "Show all statuses",
      }}
    />
  );
}
