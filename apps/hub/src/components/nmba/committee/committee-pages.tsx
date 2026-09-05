"use client";

// Page shells for the NAPDDR flow inside the existing portal. Each wraps the
// shared AdminShell (which renders a role-appropriate sidebar) around a
// role-scoped committee tier screen or the consolidated report.

import { AdminShell } from "@/components/nmba/admin-shell";
import { CommitteeTierScreen } from "./committee-screen";
import { CoveragePanel } from "./coverage-panel";
import { ReportView } from "./report-view";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { useCommitteeStore } from "@/lib/nmba/committee/store";
import { visibleRecords } from "@/lib/nmba/committee/scope";
import type { CommitteeTier } from "@/lib/nmba/committee/types";

function ReportsScreen() {
  const session = usePortalSession();
  const { records } = useCommitteeStore();

  const scoped = visibleRecords(records, session);
  const scopeLabel =
    session.role === "ADMIN"
      ? "All India"
      : session.role === "STATE"
        ? session.state ?? ""
        : `${session.district}, ${session.state}`;
  const hideColumns =
    session.role === "STATE" ? ["state"] : session.role === "DISTRICT" ? ["state", "district"] : [];
  const subtitle =
    session.role === "ADMIN"
      ? "Every committee notification and meeting minute uploaded across all States/UTs, with .XLS / .PDF export."
      : "Committee notifications and meeting minutes within your jurisdiction, with .XLS / .PDF export.";

  return (
    <div>
      <h1 className="text-headline-1 text-ink">Consolidated Report</h1>
      <p className="mt-1 mb-6 text-body-2 text-ink-muted">{subtitle}</p>
      <div className="mb-6">
        <CoveragePanel records={scoped} session={session} />
      </div>
      <ReportView records={scoped} scopeLabel={scopeLabel} hideColumns={hideColumns} />
    </div>
  );
}

export function NapddrPage({ view }: { view: CommitteeTier | "REPORTS" }) {
  return (
    <AdminShell>{view === "REPORTS" ? <ReportsScreen /> : <CommitteeTierScreen tier={view} />}</AdminShell>
  );
}
