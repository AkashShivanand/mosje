"use client";

import { FileText, Sheet, FileBarChart } from "lucide-react";
import { PageHeader, Card, StatTile, Button } from "@/components/ui";
import { useNhapoa } from "@/lib/store/store";

const REPORTS = [
  { name: "National Grievance Register", desc: "Every grievance with status, SLA and officer" },
  { name: "SLA Compliance Report", desc: "On-track, near-deadline and breached cases" },
  { name: "Officer Performance Report", desc: "Cases handled and disposal by officer" },
  { name: "User & Access Audit", desc: "Active users, roles and last-login audit" },
];

export default function AdminReportsPage() {
  const { state } = useNhapoa();
  return (
    <div>
      <PageHeader title="Reports & Export" subtitle="Generate and export portal-wide reports" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Grievances" value={state.cases.length} />
        <StatTile label="System Users" value={state.users.length} accent="await" />
        <StatTile label="Categories" value={state.categories.length} accent="approve" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {REPORTS.map((r) => (
          <Card key={r.name} className="flex items-start justify-between gap-4 p-5">
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy/10 text-navy"><FileBarChart className="h-5 w-5" /></span>
              <div><p className="text-sm font-bold text-ink">{r.name}</p><p className="mt-0.5 text-xs text-ink-muted">{r.desc}</p></div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button variant="outline" className="px-2.5"><FileText className="h-4 w-4" /></Button>
              <Button variant="outline" className="px-2.5"><Sheet className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
