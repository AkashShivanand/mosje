"use client";

import * as React from "react";
import { WorklistScreen, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatGrant, schemeLabel } from "@/lib/e-anudaan/selectors";
import { STATUS_LABEL, holderLabel, statusLabel } from "@/lib/e-anudaan/workflow";
import type { GrantApplication } from "@/lib/e-anudaan/types";
import { RefText } from "@/components/e-anudaan/worklist-table";

/**
 * Columns transcribed from the live Reports & Analytics screen (INVENTORY §11).
 *
 * "NGO / VO" is the organisation, resolved from the register. It used to print the project label
 * ("Hostel — Pune · FY 2026-27") under an NGO heading (screen QA, 13 Sep 2026).
 */
function columns(ngoName: (id: string) => string): WorklistColumn<GrantApplication>[] {
  return [
    {
      key: "ngo",
      header: "NGO / VO",
      priority: 1,
      exportValue: (a) => ngoName(a.ngoId),
      render: (a) => (
        <span className="block">
          <span className="block text-ink">{ngoName(a.ngoId)}</span>
          <span className="block text-body-3 text-ink-muted">{a.projectLabel.split(" · ")[0]}</span>
        </span>
      ),
    },
    { key: "id", header: "Application", priority: 2, render: (a) => <RefText value={a.id} className="font-mono text-body-3" /> },
    {
      key: "scheme",
      header: "Scheme",
      priority: 3,
      render: (a) => (
        <span className="block whitespace-nowrap">
          {schemeLabel(a.schemeCode)}
          <span className="block text-body-3 text-ink-muted">FY {a.financialYear}</span>
        </span>
      ),
    },
    { key: "requested", header: "Requested", priority: 2, render: (a) => <span className="whitespace-nowrap">{formatGrant(a.total)}</span> },
    {
      key: "sanctioned",
      header: "Sanctioned",
      priority: 2,
      render: (a) => <span className="whitespace-nowrap">{a.sanction ? formatGrant(a.sanction.total) : "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      priority: 2,
      exportValue: (a) => statusLabel(a),
      // The status, then the seat holding the file on a line of its own, as the worklists' status
      // column sets its note. Run together, the spelled-out grade broke the line mid-title.
      render: (a) => (
        <span className="block">
          <span className="block text-ink">{STATUS_LABEL[a.status]}</span>
          {holderLabel(a.holder) && <span className="block text-body-3 text-ink-muted">{holderLabel(a.holder)}</span>}
        </span>
      ),
    },
  ];
}

export default function ReportsPage() {
  const { state } = useEAnudaan();
  const cols = React.useMemo(() => {
    const names = new Map(state.ngos.map((n) => [n.id, n.name]));
    return columns((id) => names.get(id) ?? "—");
  }, [state.ngos]);

  return (
    <WorklistScreen
      eyebrow="E-ANUDAAN"
      title="Reports &amp; Analytics"
      columns={cols}
      rows={state.applications}
      getRowId={(a) => a.id}
      noun="application"
      copy={{
        idleTitle: "Search the Register",
        loadingLabel: "Loading applications",
        errorTitle: "This Information Could Not Be Loaded",
        errorDescription: "The service did not respond. Please try again.",
        retryLabel: "Try Again",
        emptyTitle: "No Applications in This List",
        filteredTitle: "No Applications Match Your Filters",
        clearFiltersLabel: "Clear Filters",
      }}
    />
  );
}
