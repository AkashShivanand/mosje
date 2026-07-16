"use client";

import * as React from "react";
import { PageHeader, StatTile, Card } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { fmtINR } from "@/lib/nhapoa/case-helpers";

export default function UtilisationPage() {
  const { state } = useNhapoa();
  const sanctioned = state.allocations.reduce((s, a) => s + a.amount, 0);
  const disbursed = state.disbursements.reduce((s, d) => s + d.amount, 0);
  const remaining = Math.max(0, sanctioned - disbursed);
  const rate = sanctioned ? Math.round((disbursed / sanctioned) * 100) : 0;

  // Disbursed by category (join through cases)
  const byCat = React.useMemo(() => {
    const caseCat = new Map(state.cases.map((c) => [c.id, c.category]));
    const m: Record<string, number> = {};
    for (const d of state.disbursements) {
      const cat = caseCat.get(d.caseId) ?? "Other";
      m[cat] = (m[cat] ?? 0) + d.amount;
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [state.disbursements, state.cases]);
  const maxCat = Math.max(1, ...byCat.map(([, v]) => v));

  return (
    <div>
      <PageHeader title="Fund Utilisation Report" subtitle="Reconciliation-ready disbursement analytics" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total Sanctioned" value={fmtINR(sanctioned)} />
        <StatTile label="Total Disbursed" value={fmtINR(disbursed)} accent="approve" />
        <StatTile label="Remaining Balance" value={fmtINR(remaining)} accent="await" />
        <StatTile label="Utilisation Rate" value={`${rate}%`} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-bold text-ink">Category Breakdown</h2>
        <p className="text-xs text-ink-hint">Disbursed relief by grievance category</p>
        {byCat.length === 0 ? (
          <p className="mt-6 rounded-lg bg-surface-muted px-4 py-8 text-center text-sm text-ink-hint">No category data yet — process a disbursement to populate this report.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {byCat.map(([cat, val]) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-ink-muted line-clamp-1">{cat}</span><span className="font-semibold text-ink">{fmtINR(val)}</span></div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-navy/70" style={{ width: `${(val / maxCat) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
