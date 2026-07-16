"use client";

import * as React from "react";
import { FileSearch, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { CitizenShell } from "@/components/nhapoa/citizen-shell";
import { Button, Field, TextInput, Card, StatusPill } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { CASE_STATUS_META, type Case } from "@/lib/nhapoa/store/types";

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
        <h1 className="text-2xl font-bold text-ink">Track Grievance Status</h1>
        <p className="mt-1 text-sm text-ink-muted">Enter your Reference ID to view the current status of your case.</p>
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
            <FileSearch className="h-4 w-4" /> Get OTP &amp; Track Status
          </Button>
        </div>
        <p className="mt-3 text-xs text-ink-hint">For your security, in production a one-time password is sent to the registered mobile before results are shown.</p>
      </Card>

      {result === "notfound" && (
        <Card className="mt-6 flex items-center gap-3 p-6 text-sm">
          <AlertCircle className="h-5 w-5 text-reject-fg" />
          <span className="text-ink">No case found for <span className="font-mono font-semibold">{ref}</span>. Check the Reference ID and try again.</span>
        </Card>
      )}

      {result && result !== "notfound" && (
        <Card className="mt-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
            <div>
              <p className="font-mono text-sm font-bold text-navy">{result.refNo}</p>
              <p className="mt-1 text-sm text-ink-muted">{result.category} · {result.district}, {result.state}</p>
            </div>
            <StatusPill status={result.status} />
          </div>

          <p className="mb-4 mt-6 text-xs font-bold uppercase tracking-wide text-ink-hint">Case Timeline</p>
          <ol className="relative ml-2 border-l border-line">
            {result.timeline.map((t, i) => {
              const last = i === result.timeline.length - 1;
              return (
                <li key={i} className="mb-6 ml-6 last:mb-0">
                  <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${last ? "bg-navy text-white" : "bg-approve text-white"}`}>
                    {last ? <Clock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  </span>
                  <p className="text-sm font-semibold text-ink">{CASE_STATUS_META[t.status].label}</p>
                  <p className="text-xs text-ink-hint">{new Date(t.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}{t.byRole ? ` · ${t.byRole}` : ""}</p>
                  {t.note && <p className="mt-1 text-xs text-ink-muted">{t.note}</p>}
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </CitizenShell>
  );
}
