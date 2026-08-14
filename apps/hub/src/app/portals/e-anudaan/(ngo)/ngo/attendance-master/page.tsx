"use client";

import { Badge } from "@mosje/design-system";

const ROWS = [
  { month: "March 2026", beneficiaries: 88, avg: 81, pct: "92.0%", status: "Submitted" },
  { month: "February 2026", beneficiaries: 88, avg: 79, pct: "89.8%", status: "Submitted" },
  { month: "January 2026", beneficiaries: 86, avg: 80, pct: "93.0%", status: "Submitted" },
  { month: "December 2025", beneficiaries: 86, avg: 74, pct: "86.0%", status: "Submitted" },
];

/** Monthly returns — columns from the live Attendance Master (§10). */
export default function AttendanceMasterPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Attendance Master</h1>
        <p className="mt-1 text-sm text-ink-muted">Monthly attendance for your selected project.</p>
      </div>
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Recent Attendance Records</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="pb-2 pr-3 font-medium">Month</th>
              <th className="pb-2 pr-3 font-medium">Beneficiaries</th>
              <th className="pb-2 pr-3 font-medium">Avg Present</th>
              <th className="pb-2 pr-3 font-medium">%</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.month} className="border-b border-line">
                <td className="py-2 pr-3 text-ink">{r.month}</td>
                <td className="py-2 pr-3 text-ink">{r.beneficiaries}</td>
                <td className="py-2 pr-3 text-ink">{r.avg}</td>
                <td className="py-2 pr-3 text-ink">{r.pct}</td>
                <td className="py-2"><Badge status="success">{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
