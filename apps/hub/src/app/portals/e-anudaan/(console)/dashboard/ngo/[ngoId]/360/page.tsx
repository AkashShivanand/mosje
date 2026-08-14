"use client";

import { useParams } from "next/navigation";
import { Alert, Badge, Icon, MetricCard } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

/**
 * NGO 360 — every application, institution and inspection for one organisation.
 *
 * Reachable in the live bundle at /dashboard/ngo/:ngoId/360 but not linked from any captured
 * nav, so its layout is inferred; the data it shows is the same the NGO Directory exposes.
 */
export default function Ngo360Page() {
  const params = useParams<{ ngoId: string }>();
  const { state, findNgo } = useEAnudaan();
  const ngo = findNgo(decodeURIComponent(params.ngoId));

  if (!ngo) {
    return <Alert status="warning" title="Organisation not found">No such NGO in the demo dataset.</Alert>;
  }

  const apps = state.applications.filter((a) => a.ngoId === ngo.id);
  const inspections = state.inspections.filter((i) => i.ngoId === ngo.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">{ngo.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {ngo.district}, {ngo.state} · NGO-Darpan {ngo.darpanId} · Registration {ngo.registrationNo}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Applications" value={String(apps.length)} icon={<Icon name="description" size={20} aria-hidden />} />
        <MetricCard label="Sanctioned" value={String(ngo.sanctionedCount)} icon={<Icon name="verified" size={20} aria-hidden />} />
        <MetricCard label="Total grant" value={formatGrant(ngo.totalGrant)} icon={<Icon name="currency_rupee" size={20} aria-hidden />} />
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Institutions</h2>
        <ul className="mt-4 divide-y divide-line">
          {ngo.institutions.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span className="text-sm text-ink">
                <span className="font-medium">{i.id}</span> · {i.name} · {i.district}
              </span>
              <span className="text-sm text-ink-muted">
                {i.nature} · {i.type} · {i.building}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Inspections</h2>
        {inspections.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">No inspection has been raised for this organisation.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {inspections.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="text-sm text-ink">{i.applicationId} · {i.visitType}</span>
                <span className="flex items-center gap-3">
                  <span className="text-sm text-ink-muted">
                    {i.scheduledFor ? formatDate(i.scheduledFor) : "Not scheduled"}
                  </span>
                  <Badge status={i.status === "Reviewed" ? "success" : "info"}>{i.status}</Badge>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <WorklistTable rows={apps} variant="explorer" caption={`Applications from ${ngo.name}`} />

      <p className="text-xs text-ink-muted">
        Last inspection: {ngo.lastInspection ? formatDate(ngo.lastInspection) : "—"} ·
        Current status of most recent application:{" "}
        {apps[0] ? statusLabel(apps[0]) : "—"}
      </p>
    </div>
  );
}
