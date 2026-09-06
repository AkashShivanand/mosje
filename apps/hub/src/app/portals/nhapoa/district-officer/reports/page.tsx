"use client";

import { PortalPageHeader, StatTile, Button } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { doQueue } from "@/lib/nhapoa/case-helpers";
import { CASE_STATUS_META, type CaseStatus } from "@/lib/nhapoa/store/types";
import { Icon , Card} from "@mosje/design-system";

const ROWS: CaseStatus[] = ["SUBMITTED", "ASSIGNED", "UNDER_INVESTIGATION", "PENDING_APPROVAL", "SENT_BACK"];

export default function DOReportsPage() {
  const { state } = useNhapoa();
  const queue = doQueue(state.cases);
  const count = (s: CaseStatus) => queue.filter((c) => c.status === s).length;

  return (
    <div>
      <PortalPageHeader
        title="My Reports"
        meta="Case activity and disposal summary for your district"
        actions={<Button variant="outline"><Icon name="download" size={16} /> Export PDF</Button>}
      />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Assigned" value={queue.length} />
        <StatTile label="In Investigation" value={count("UNDER_INVESTIGATION")} accent="await" />
        <StatTile label="Sent for Approval" value={count("PENDING_APPROVAL")} accent="approve" />
      </div>
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2 text-title-2 text-ink"><Icon name="assessment" size={16} className="text-navy" /> Disposal by status</div>
        <table className="w-full text-left text-body-2">
          <thead><tr className="border-b border-line text-label-3 uppercase text-ink-hint"><th className="py-2.5 font-semibold">Status</th><th className="py-2.5 text-right font-semibold">Cases</th></tr></thead>
          <tbody className="divide-y divide-line">
            {ROWS.map((s) => (
              <tr key={s}><td className="py-2.5 text-ink-muted">{CASE_STATUS_META[s].label}</td><td className="py-2.5 text-right font-semibold text-ink">{count(s)}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
