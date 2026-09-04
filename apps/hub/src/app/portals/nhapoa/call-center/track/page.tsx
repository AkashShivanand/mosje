"use client";

import * as React from "react";
import { PageHeader, Card, Button, Field, TextInput, StatusPill } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { CASE_STATUS_META, type Case } from "@/lib/nhapoa/store/types";
import { Icon } from "@mosje/design-system";

export default function CallCenterTrackPage() {
  const { findByRef } = useNhapoa();
  const [token, setToken] = React.useState("");
  const [result, setResult] = React.useState<Case | null | "notfound">(null);

  function track() {
    const c = findByRef(token);
    setResult(c ?? "notfound");
  }

  return (
    <div>
      <PageHeader title="Track Status" subtitle="Track a grievance by token on behalf of the caller." />
      <Card className="max-w-xl p-6">
        <Field label="Grievance token" required>
          <div className="flex gap-2">
            <TextInput value={token} onChange={(e) => setToken(e.target.value)} placeholder="e.g. SAMBAL/2026/UP/001001" />
            <Button type="button" onClick={track} disabled={!token.trim()}><Icon name="find_in_page" size={16} /> Search</Button>
          </div>
        </Field>
      </Card>

      {result === "notfound" && (
        <Card className="mt-6 flex max-w-xl items-center gap-3 p-6 text-body-2"><Icon name="error" size={20} className="text-reject-fg" /><span className="text-ink">No case found for <span className="font-mono font-semibold">{token}</span>.</span></Card>
      )}

      {result && result !== "notfound" && (
        <Card className="mt-6 max-w-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div><p className="font-mono text-title-3 text-navy">{result.refNo}</p><p className="mt-1 text-body-2 text-ink-muted">{result.category} · {result.district}, {result.state}</p></div>
            <StatusPill status={result.status} />
          </div>
          <ol className="relative ml-2 mt-5 border-l border-line">
            {result.timeline.map((t, i) => {
              const last = i === result.timeline.length - 1;
              return (
                <li key={i} className="mb-5 ml-6 last:mb-0">
                  <span className={`absolute -left-2.5 mt-1 grid h-5 w-5 place-items-center rounded-full ${last ? "bg-navy text-white" : "bg-approve text-white"}`}>{last ? <Icon name="schedule" size={12} /> : <Icon name="check_circle" size={12} />}</span>
                  <p className="text-title-3 text-ink">{CASE_STATUS_META[t.status].label}</p>
                  <p className="text-body-3 text-ink-hint">{new Date(t.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}{t.byRole ? ` · ${t.byRole}` : ""}</p>
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </div>
  );
}
