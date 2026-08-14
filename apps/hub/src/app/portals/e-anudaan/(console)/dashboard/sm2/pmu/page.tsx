"use client";

import { Badge } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

/** "PMU Inspection — SHRESHTA Mode-2", section "Awaiting inspection" (§13). */
export default function PmuInspectionWorklistPage() {
  const { state } = useEAnudaan();
  const rows = state.inspections.filter((i) => i.status !== "Reviewed");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">PMU Inspection — SHRESHTA Mode-2</h1>
        <p className="mt-1 text-sm text-ink-muted">Awaiting inspection</p>
      </div>
      <section className="rounded-xl border border-line bg-surface p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="pb-2 pr-3 font-medium">Reference</th>
              <th className="pb-2 pr-3 font-medium">NGO</th>
              <th className="pb-2 pr-3 font-medium">FY</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const ngo = state.ngos.find((n) => n.id === i.ngoId);
              const app = state.applications.find((a) => a.id === i.applicationId);
              return (
                <tr key={i.id} className="border-b border-line">
                  <td className="py-2 pr-3 text-ink">{i.applicationId}</td>
                  <td className="py-2 pr-3 text-ink">{ngo?.name ?? i.ngoId}</td>
                  <td className="py-2 pr-3 text-ink">{app?.financialYear ?? "—"}</td>
                  <td className="py-2"><Badge status="info">{i.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
