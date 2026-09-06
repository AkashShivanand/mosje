"use client";

import { PortalPageHeader, StatTile } from "@/components/nhapoa/ui";
import { CaseTable } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { doQueue, slaDaysLeft } from "@/lib/nhapoa/case-helpers";

export default function DOSlaPage() {
  const { state } = useNhapoa();
  const queue = doQueue(state.cases);
  const onTrack = queue.filter((c) => slaDaysLeft(c) > 5).length;
  const near = queue.filter((c) => { const d = slaDaysLeft(c); return d >= 0 && d <= 5; }).length;
  const breached = queue.filter((c) => slaDaysLeft(c) < 0).length;
  const compliance = queue.length ? Math.round(((queue.length - breached) / queue.length) * 100) : 100;

  return (
    <div>
      <PortalPageHeader title="SLA Monitor" meta="Track service level compliance across all assigned cases" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="On Track" value={onTrack} accent="approve" />
        <StatTile label="Near Deadline (≤5 days)" value={near} accent="await" />
        <StatTile label="SLA Breached" value={breached} accent="reject" />
        <StatTile label="Compliance Rate" value={`${compliance}%`} />
      </div>
      <CaseTable cases={queue} detailBase="/portals/nhapoa/district-officer/cases" />
    </div>
  );
}
