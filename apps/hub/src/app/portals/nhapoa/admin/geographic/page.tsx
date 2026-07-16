"use client";

import * as React from "react";
import { PageHeader, Card } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";

export default function GeographicPage() {
  const { state } = useNhapoa();

  const byDistrict = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of state.cases) m[c.district] = (m[c.district] ?? 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [state.cases]);
  const maxD = Math.max(1, ...byDistrict.map(([, v]) => v));

  const byState = React.useMemo(() => {
    const m: Record<string, { total: number; resolved: number }> = {};
    for (const c of state.cases) {
      const r = (m[c.state] ??= { total: 0, resolved: 0 });
      r.total += 1;
      if (c.status === "CLOSED") r.resolved += 1;
    }
    return Object.entries(m).sort((a, b) => b[1].total - a[1].total);
  }, [state.cases]);

  return (
    <div>
      <PageHeader title="Geographic View" subtitle="District intensity and state-wise distribution" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-bold text-ink">District Grievance Intensity</h2>
          <div className="mt-5 space-y-3">
            {byDistrict.map(([d, v]) => (
              <div key={d}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-ink-muted">{d}</span><span className="font-semibold text-ink">{v}</span></div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-saffron" style={{ width: `${(v / maxD) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-sm font-bold text-ink">State-wise Summary</h2>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-ink-hint"><th className="py-2.5 font-semibold">State</th><th className="py-2.5 text-right font-semibold">Total</th><th className="py-2.5 text-right font-semibold">Resolved</th></tr></thead>
            <tbody className="divide-y divide-line">
              {byState.map(([st, r]) => (
                <tr key={st}><td className="py-2.5 text-ink">{st}</td><td className="py-2.5 text-right text-ink">{r.total}</td><td className="py-2.5 text-right text-approve-fg">{r.resolved}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
