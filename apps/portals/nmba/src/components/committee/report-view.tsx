"use client";

// Consolidated committee report: a compact stat summary, .XLS / .PDF export
// (requirement item 7), and the scoped committee table.

import * as React from "react";
import { FileSpreadsheet, FileDown, FileText, ClipboardList, Building } from "lucide-react";
import { Button, MetricCard } from "@mosje/design-system";
import { CommitteeList } from "./committee-list";
import { exportPdf, exportXls } from "@/lib/committee/export";
import type { CommitteeRecord } from "@/lib/committee/types";

interface ReportViewProps {
  records: CommitteeRecord[];
  scopeLabel: string;
  hideColumns?: string[];
}

export function ReportView({ records, scopeLabel, hideColumns = [] }: ReportViewProps) {
  const [busy, setBusy] = React.useState(false);

  const minutesCount = records.reduce((n, r) => n + r.minutes.length, 0);
  const districtsCovered = new Set(records.map((r) => r.district).filter(Boolean)).size;

  const handlePdf = async () => {
    setBusy(true);
    try {
      await exportPdf(records, scopeLabel);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Committees registered"
          value={String(records.length)}
          icon={<FileText className="h-5 w-5" />}
        />
        <MetricCard
          label="Meeting minutes"
          value={String(minutesCount)}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <MetricCard
          label="Districts covered"
          value={String(districtsCovered)}
          icon={<Building className="h-5 w-5" />}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          Scope: <strong className="text-ink">{scopeLabel}</strong>
        </p>
        <div className="flex gap-2">
          <Button
            appearance="outlined"
            onClick={() => exportXls(records, scopeLabel)}
            iconLeft={<FileSpreadsheet className="h-4 w-4" />}
          >
            Export .XLS
          </Button>
          <Button
            appearance="outlined"
            onClick={handlePdf}
            disabled={busy}
            iconLeft={<FileDown className="h-4 w-4" />}
          >
            {busy ? "Preparing…" : "Export .PDF"}
          </Button>
        </div>
      </div>

      <CommitteeList
        records={records}
        showTier
        hideColumns={hideColumns}
        caption={`Consolidated report — ${scopeLabel}`}
        emptyLabel="No committee notifications on record for this scope yet."
      />
    </div>
  );
}
