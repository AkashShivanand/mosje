"use client";

import { PortalPageHeader, StatTile, Button } from "@/components/nhapoa/ui";
import { SimpleCaseTable } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { slaDaysLeft } from "@/lib/nhapoa/case-helpers";
import { Icon } from "@mosje/design-system";

export default function AdminSlaMonitorPage() {
  const { state } = useNhapoa();
  const open = state.cases.filter((c) => !["CLOSED", "DISBURSED"].includes(c.status));
  const onTrack = open.filter((c) => slaDaysLeft(c) > 5).length;
  const near = open.filter((c) => { const d = slaDaysLeft(c); return d >= 0 && d <= 5; }).length;
  const breachedList = open.filter((c) => slaDaysLeft(c) < 0);
  const compliance = open.length ? Math.round(((open.length - breachedList.length) / open.length) * 100) : 100;

  return (
    <div>
      <PortalPageHeader title="SLA Monitor" meta="National SLA compliance and escalation queue" actions={<Button variant="outline"><Icon name="download" size={16} /> Export</Button>} />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="On Track" value={onTrack} accent="approve" />
        <StatTile label="Near Deadline (≤5 days)" value={near} accent="await" />
        <StatTile label="SLA Breached" value={breachedList.length} accent="reject" />
        <StatTile label="National Compliance" value={`${compliance}%`} />
      </div>
      <h2 className="mb-3 text-title-2 text-ink">Breached Cases — Escalation Queue</h2>
      <SimpleCaseTable cases={breachedList} emptyLabel="No breached cases — all within SLA." />
    </div>
  );
}
