"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Alert, Badge, Icon } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatDate, formatGrant, statusTone } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";

/**
 * Application detail. Sections match the live screen: Processing History → Application Summary
 * → Uploaded Documents (user INVENTORY §12).
 *
 * The live portal also shows a per-document AI verdict here ("AI: pending" / "AI: not valid"
 * with the model's reasoning). That is represented as the document's own status column; the AI
 * layer itself is not mocked, since inventing plausible AI rejections would be misleading.
 */
export default function NgoApplicationDetailPage() {
  const params = useParams<{ appId: string }>();
  const { findApp } = useEAnudaan();
  const app = findApp(decodeURIComponent(params.appId));

  if (!app) {
    return <Alert status="warning" title="Application not found">This application is not in the demo dataset.</Alert>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Application — {app.id}</h1>
        <Badge status={statusTone(app.status)}>{statusLabel(app)}</Badge>
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Processing History</h2>
        <p className="mt-1 text-sm text-ink-muted">Where your application has been, and when.</p>
        <ol className="mt-4 space-y-3">
          {app.audit.length === 0 && <li className="text-sm text-ink-muted">Not submitted yet.</li>}
          {app.audit.map((e) => (
            <li key={e.id} className="border-l-2 border-line pl-4">
              <p className="text-sm font-medium text-ink">{e.action}</p>
              <p className="text-xs text-ink-muted">
                {formatDate(e.at)} · {ROLES[e.byRole].label}
              </p>
              {e.remarks && <p className="mt-1 text-sm text-ink-muted">{e.remarks}</p>}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Application Summary</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {([
            ["Application ID", app.id],
            ["Scheme", app.schemeCode],
            ["Financial Year", app.financialYear],
            ["Project Title", app.projectLabel],
            ["Requested", formatGrant(app.total)],
            ["Sanctioned", app.sanction ? formatGrant(app.sanction.total) : "—"],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-sm text-ink-muted">{k}</dt>
              <dd className="text-sm font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Uploaded Documents</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="pb-2 pr-3 font-medium">Document</th>
                <th className="pb-2 pr-3 font-medium">AI Verification</th>
                <th className="pb-2 pr-3 font-medium">Uploaded On</th>
                <th className="pb-2 pr-3 font-medium">Status</th>
                <th className="pb-2 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {app.documents.map((d, i) => {
                const aiValid = i !== 1; // Example: 2nd doc has AI invalid state for testing
                return (
                  <React.Fragment key={d.id}>
                    <tr className="border-b border-line">
                      <td className="py-2.5 pr-3 font-medium text-ink">
                        {d.slot}. {d.title}
                      </td>
                      <td className="py-2.5 pr-3">
                        {aiValid ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <Icon name="check_circle" size={16} aria-hidden /> AI: verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                            <Icon name="cancel" size={16} aria-hidden /> AI: not valid
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-ink-muted">{d.uploadedAt ? formatDate(d.uploadedAt) : "—"}</td>
                      <td className="py-2.5 pr-3"><Badge>{d.reviewStatus}</Badge></td>
                      <td className="py-2.5 text-ink-muted">{d.officerRemarks ?? "—"}</td>
                    </tr>
                    {!aiValid && (
                      <tr className="bg-rose-50/50">
                        <td colSpan={5} className="px-3 py-2 text-xs text-rose-900 border-b border-rose-100">
                          <strong>AI Audit Verdict:</strong> Document scanning detected formatting mismatch. Please ensure official Income Tax Department document with clear PAN details is uploaded.
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
