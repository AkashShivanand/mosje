"use client";

import Link from "next/link";
import { Icon, MetricCard } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

/**
 * NGO dashboard. Greeting, four KPI cards and an Application Status breakdown — the anatomy
 * of the live screen (user INVENTORY §1). The demo NGO is the first seeded organisation.
 */
export default function NgoDashboardPage() {
  const { state } = useEAnudaan();
  const ngo = state.ngos[0];
  const apps = ngo ? ngoApplications(state, ngo.id) : [];

  const counts = apps.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});
  const inReview = apps.filter((a) => a.holder.kind === "chain" || a.holder.kind === "pd").length;
  const needsAction = apps.filter((a) => a.status === "DeficiencyRaised").length;
  const sanctioned = apps.filter((a) => a.sanction).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Welcome, {ngo?.name ?? "applicant"} 👋</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {ngo?.district}, {ngo?.state}
        </p>
      </div>

      <Link
        href="/portals/e-anudaan/apply-grant"
        className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        <Icon name="add_circle" size={16} aria-hidden /> New Application
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Applications" value={String(apps.length)} icon={<Icon name="description" size={20} aria-hidden />} />
        <MetricCard label="In Review" value={String(inReview)} icon={<Icon name="schedule" size={20} aria-hidden />} />
        <MetricCard label="Needs Action" value={String(needsAction)} icon={<Icon name="error" size={20} aria-hidden />} />
        <MetricCard label="Sanctioned" value={String(sanctioned)} icon={<Icon name="verified" size={20} aria-hidden />} />
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Application Status</h2>
        <ul className="mt-4 space-y-2">
          {Object.entries(counts).map(([status, n]) => (
            <li key={status} className="flex items-baseline justify-between text-sm">
              <span className="text-ink">{status}</span>
              <span className="text-ink-muted">
                <strong className="text-ink">{n}</strong> ({Math.round((n / Math.max(apps.length, 1)) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
