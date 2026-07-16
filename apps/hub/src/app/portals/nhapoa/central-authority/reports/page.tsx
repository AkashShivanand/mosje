"use client";

import { FileText, Sheet, FileBarChart } from "lucide-react";
import { PageHeader, Card, StatTile, Button } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtINR } from "@/lib/nhapoa/case-helpers";

export default function CAReportsPage() {
  const { state } = useNhapoa();
  const disbursed = state.disbursements.reduce((s, d) => s + d.amount, 0);
  const allocated = state.allocations.reduce((s, a) => s + a.amount, 0);

  const REPORTS = [
    { name: "National Grievance Register", desc: "All grievances across states with status and SLA" },
    { name: "Fund Utilisation Report", desc: "Allocation vs disbursement reconciliation" },
    { name: "State Performance Report", desc: "Ranked state comparison with resolution rates" },
    { name: "Scheme Impact Summary", desc: "Beneficiaries served and category breakdown" },
  ];

  return (
    <div>
      <PageHeader title="Reports & Export" subtitle="Generate national-level reports for review and audit" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total Grievances" value={state.cases.length} />
        <StatTile label="Funds Allocated" value={fmtINR(allocated)} />
        <StatTile label="Funds Disbursed" value={fmtINR(disbursed)} accent="approve" />
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
