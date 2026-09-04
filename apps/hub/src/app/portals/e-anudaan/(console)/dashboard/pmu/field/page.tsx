"use client";

import { Badge, Icon, MetricCard } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate } from "@/lib/e-anudaan/selectors";

/** PMU field officer landing — "Inspection Dashboard" with an assignments table (§14). */
export default function PmuFieldPage() {
  const { state } = useEAnudaan();
  const insp = state.inspections;
  const pending = insp.filter((i) => i.status === "Pending").length;
  const scheduled = insp.filter((i) => i.status === "Scheduled").length;

  return (
    <div className="space-y-5">
      <h1 className="text-headline-1 text-ink">Inspection Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Awaiting inspection" value={String(pending)} icon={<Icon name="pending" size={20} aria-hidden />} />
        <MetricCard label="Scheduled" value={String(scheduled)} icon={<Icon name="event" size={20} aria-hidden />} />
        <MetricCard label="Total assignments" value={String(insp.length)} icon={<Icon name="travel_explore" size={20} aria-hidden />} />
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-title-2 text-ink">Inspection Assignments</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-body-2">
            <thead>
              <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
                <th className="pb-2 pr-3 font-medium">NGO Name</th>
                <th className="pb-2 pr-3 font-medium">Scheme</th>
                <th className="pb-2 pr-3 font-medium">Visit Type</th>
                <th className="pb-2 pr-3 font-medium">Scheduled Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {insp.map((i) => {
                const ngo = state.ngos.find((n) => n.id === i.ngoId);
                return (
                  <tr key={i.id} className="border-b border-line">
                    <td className="py-2 pr-3 text-ink">{ngo?.name ?? i.ngoId}</td>
                    <td className="py-2 pr-3 text-ink">SHRESHTA_M2</td>
                    <td className="py-2 pr-3 text-ink">{i.visitType}</td>
                    <td className="py-2 pr-3 text-ink-muted">{i.scheduledFor ? formatDate(i.scheduledFor) : "—"}</td>
                    <td className="py-2"><Badge status={i.status === "Reviewed" ? "success" : "info"}>{i.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
