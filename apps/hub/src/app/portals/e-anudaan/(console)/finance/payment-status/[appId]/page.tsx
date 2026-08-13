"use client";

import { useParams } from "next/navigation";
import { Alert, Badge } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant, statusTone } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";

/**
 * Payment status for a sanctioned application — the live bundle's /finance/payment-status/:id.
 *
 * Not linked from any captured nav, so the layout is inferred. Fund release itself is mocked:
 * this demo moves no money and integrates with no PFMS.
 */
export default function PaymentStatusPage() {
  const params = useParams<{ appId: string }>();
  const { findApp } = useEAnudaan();
  const app = findApp(decodeURIComponent(params.appId));

  if (!app) {
    return <Alert status="warning" title="Application not found">No such application in the demo dataset.</Alert>;
  }

  const steps = [
    { label: "Sanctioned", done: !!app.sanction },
    { label: "Bill raised", done: !!app.sanction },
    { label: "Released to PFMS", done: app.status === "Released" },
    { label: "Credited to NGO", done: app.status === "Released" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Payment status — {app.id}</h1>
        <Badge status={statusTone(app.status)}>{statusLabel(app)}</Badge>
      </div>

      <Alert status="info" title="Fund release is mocked">
        This demo shows the shape of the disbursement chain. No PFMS call is made and no funds move.
      </Alert>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Disbursement</h2>
        <ol className="mt-4 space-y-3">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-sm text-ink">{s.label}</span>
              <Badge status={s.done ? "success" : "neutral"}>{s.done ? "Done" : "Pending"}</Badge>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Sanction</h2>
        {app.sanction ? (
          <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {([
              ["Order No.", app.sanction.orderNo],
              ["Sanction Date", formatDate(app.sanction.sanctionedAt)],
              ["Recurring", formatGrant(app.sanction.recurring)],
              ["Non-recurring", formatGrant(app.sanction.nonRecurring)],
              ["Total sanctioned", formatGrant(app.sanction.total)],
              ["Released", app.status === "Released" ? formatGrant(app.sanction.total) : "₹0"],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
                <dt className="text-sm text-ink-muted">{k}</dt>
                <dd className="text-sm font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">This application has not been sanctioned yet.</p>
        )}
      </section>
    </div>
  );
}
