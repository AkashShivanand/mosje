"use client";

import { PageHeader, StatTile } from "@/components/ui";
import { SimpleCaseTable } from "@/components/case-views";
import { useNhapoa } from "@/lib/store/store";
import { slaDaysLeft } from "@/lib/case-helpers";

export default function SASlaPage() {
  const { state } = useNhapoa();
  const pending = state.cases.filter((c) => c.status === "PENDING_APPROVAL");
  const onTrack = pending.filter((c) => slaDaysLeft(c) > 5).length;
  const near = pending.filter((c) => { const d = slaDaysLeft(c); return d >= 0 && d <= 5; }).length;
  const breached = pending.filter((c) => slaDaysLeft(c) < 0).length;
  const compliance = pending.length ? Math.round(((pending.length - breached) / pending.length) * 100) : 100;
  return (
    <div>
      <PageHeader title="SLA Monitor" subtitle="Approval-stage service level compliance" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="On Track" value={onTrack} accent="approve" />
        <StatTile label="Near Deadline (≤5 days)" value={near} accent="await" />
        <StatTile label="SLA Breached" value={breached} accent="reject" />
        <StatTile label="Compliance Rate" value={`${compliance}%`} />
      </div>
      <SimpleCaseTable cases={pending} emptyLabel="No pending cases to monitor." />
    </div>
  );
}
