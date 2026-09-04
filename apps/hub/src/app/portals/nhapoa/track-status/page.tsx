"use client";

import * as React from "react";
import { CitizenShell } from "@/components/nhapoa/citizen-shell";
import { Button, Field, TextInput, Card, StatusPill } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { CASE_STATUS_META, type Case } from "@/lib/nhapoa/store/types";
import { Icon } from "@mosje/design-system";

export default function TrackStatusPage() {
  const { findByRef } = useNhapoa();
  const [ref, setRef] = React.useState("");
  const [result, setResult] = React.useState<Case | null | "notfound">(null);

  function track() {
    const c = findByRef(ref);
    setResult(c ?? "notfound");
  }

  return (
    <CitizenShell>
      <div className="mb-6">
        <h1 className="text-headline-1 text-ink">Track Grievance Status</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Enter your Reference ID to view the current status of your case.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Reference ID" required>
            <TextInput value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. SAMBAL/2026/UP/001001" />
          </Field>
          <Field label="Mobile Number">
            <TextInput inputMode="numeric" maxLength={10} placeholder="Registered mobile" />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" onClick={track} disabled={!ref.trim()}>
            <Icon name="find_in_page" size={16} /> Get OTP &amp; Track Status
          </Button>
        </div>
        <p className="mt-3 text-body-3 text-ink-hint">For your security, in production a one-time password is sent to the registered mobile before results are shown.</p>
      </Card>

      {result === "notfound" && (
        <Card className="mt-6 flex items-center gap-3 p-6 text-body-2">
          <Icon name="error" size={20} className="text-reject-fg" />
          <span className="text-ink">No case found for <span className="font-mono font-semibold">{ref}</span>. Check the Reference ID and try again.</span>
        </Card>
      )}

      {result && result !== "notfound" && (
        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
            <div>
              <p className="font-mono text-title-3 text-navy">{result.refNo}</p>
              <p className="mt-1 text-body-2 text-ink-muted">{result.category} · {result.district}, {result.state}</p>
            </div>
            <StatusPill status={result.status} />
          </div>

          <p className="mb-4 mt-6 text-label-3 uppercase text-ink-hint">Case Timeline</p>
          <ol className="relative ml-2 border-l border-line">
            {result.timeline.map((t, i) => {
              const last = i === result.timeline.length - 1;
              return (
                <li key={i} className="mb-6 ml-6 last:mb-0">
                  <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${last ? "bg-navy text-white" : "bg-approve text-white"}`}>
                    {last ? <Icon name="schedule" size={14} /> : <Icon name="check_circle" size={14} />}
                  </span>
                  <p className="text-title-3 text-ink">{CASE_STATUS_META[t.status].label}</p>
                  <p className="text-body-3 text-ink-hint">{new Date(t.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}{t.byRole ? ` · ${t.byRole}` : ""}</p>
                  {t.note && <p className="mt-1 text-body-3 text-ink-muted">{t.note}</p>}
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </CitizenShell>
  );
}
