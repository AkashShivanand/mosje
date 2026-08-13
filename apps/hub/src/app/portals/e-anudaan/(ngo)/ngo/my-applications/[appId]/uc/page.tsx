"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Alert, Button, FormField, Input, Textarea, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatGrant } from "@/lib/e-anudaan/selectors";

/**
 * Utilisation Certificate (GFR 12-A).
 *
 * ⚠️ INFERRED. The live route returns "Application not found." for every id tried, including a
 * freshly-opened SANCTIONED application — the exact state a UC applies to (user INVENTORY §14,
 * defect D6). Built from the BRD so the post-sanction half of the lifecycle is demonstrable.
 */
export default function UtilisationCertificatePage() {
  const params = useParams<{ appId: string }>();
  const { findApp } = useEAnudaan();
  const { toast } = useToast();
  const app = findApp(decodeURIComponent(params.appId));
  const [spent, setSpent] = React.useState("");
  const [remarks, setRemarks] = React.useState("");

  if (!app) {
    return <Alert status="warning" title="Application not found">No such application in the demo dataset.</Alert>;
  }

  const sanctioned = app.sanction?.total ?? 0;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Utilisation Certificate — {app.id}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Certify how the sanctioned grant was spent, under GFR 12-A. Must be signed by a
          Chartered Accountant before the next instalment is released.
        </p>
      </div>

      <Alert status="info" title="Inferred screen">
        The live portal&apos;s UC route could not be reached for any application, including
        sanctioned ones. This form follows the BRD. Reported to the dev team as defect D6.
      </Alert>

      {!app.sanction && (
        <Alert status="warning" title="Not yet sanctioned">
          A utilisation certificate can only be filed once the grant has been sanctioned.
        </Alert>
      )}

      <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
            <dt className="text-sm text-ink-muted">Sanctioned</dt>
            <dd className="text-sm font-semibold text-ink">{formatGrant(sanctioned)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
            <dt className="text-sm text-ink-muted">Financial Year</dt>
            <dd className="text-sm font-semibold text-ink">{app.financialYear}</dd>
          </div>
        </dl>

        <FormField label="Amount utilised (₹)" id="spent">
          {(control) => (
            <Input {...control} type="number" value={spent} onChange={(e) => setSpent(e.target.value)} />
          )}
        </FormField>
        <FormField label="Purpose and remarks" id="uc-remarks">
          {(control) => (
            <Textarea {...control} rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          )}
        </FormField>

        <Button
          disabled={!app.sanction || !spent || !remarks.trim()}
          onClick={() => toast("Utilisation certificate filed (demo).", "success")}
        >
          File utilisation certificate
        </Button>
      </section>
    </div>
  );
}
