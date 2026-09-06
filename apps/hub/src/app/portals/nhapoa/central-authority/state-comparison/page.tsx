"use client";

import * as React from "react";
import { PortalPageHeader, StatTile } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { Icon, Card, Button } from "@mosje/design-system";

interface Row { st: string; total: number; resolved: number; pending: number; }

export default function StateComparisonPage() {
  const { state } = useNhapoa();

  const rows: Row[] = React.useMemo(() => {
    const m: Record<string, Row> = {};
    for (const c of state.cases) {
      const r = (m[c.state] ??= { st: c.state, total: 0, resolved: 0, pending: 0 });
      r.total += 1;
      if (c.status === "CLOSED") r.resolved += 1; else r.pending += 1;
    }
    return Object.values(m).sort((a, b) => b.total - a.total);
  }, [state.cases]);

  const highestVol = rows[0];

  return (
    <div>
      <PortalPageHeader title="State Comparison Dashboard" meta="Performance comparison across all states" actions={<Button appearance="outlined"><Icon name="download" size={16} /> Export</Button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Highest Grievance Volume" value={highestVol ? `${highestVol.total}` : "0"} />
        <StatTile label="States Reporting" value={rows.length} accent="await" />
        <StatTile label="Highest SLA Compliance" value="100%" accent="approve" />
        <StatTile label="National Avg. Closure" value={state.cases.length ? "—" : "—"} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 text-title-2 text-ink">State-wise Performance Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-body-2">
            <thead>
              <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
                <th className="py-2.5 pr-4 font-semibold">Rank</th>
                <th className="py-2.5 pr-4 font-semibold">State</th>
                <th className="py-2.5 pr-4 text-right font-semibold">Total</th>
                <th className="py-2.5 pr-4 text-right font-semibold">Resolved</th>
                <th className="py-2.5 pr-4 text-right font-semibold">Pending</th>
                <th className="py-2.5 text-right font-semibold">Resolution %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r, i) => (
                <tr key={r.st}>
                  <td className="py-3 pr-4 text-ink-hint">{i + 1}</td>
                  <td className="py-3 pr-4 font-medium text-ink">{r.st}</td>
                  <td className="py-3 pr-4 text-right text-ink">{r.total}</td>
                  <td className="py-3 pr-4 text-right text-approve-fg">{r.resolved}</td>
                  <td className="py-3 pr-4 text-right text-await-fg">{r.pending}</td>
                  <td className="py-3 text-right font-semibold text-navy">{r.total ? Math.round((r.resolved / r.total) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
