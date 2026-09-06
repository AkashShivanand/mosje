"use client";

import * as React from "react";
import Link from "next/link";
import { PortalPageHeader, Card, Button, Field, TextInput } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { Icon , Textarea} from "@mosje/design-system";

export default function QueryPage() {
  const { logQuery } = useNhapoa();
  const [mobile, setMobile] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [done, setDone] = React.useState(false);

  function submit() {
    if (!subject) return;
    logQuery(mobile || "—", subject);
    setDone(true);
  }

  if (done) {
    return (
      <div>
        <PortalPageHeader title="Query (FTR)" meta="Log a first-time-resolution query." />
        <Card className="max-w-xl p-8 text-center">
          <Icon name="check_circle" size={48} className="mx-auto text-approve" />
          <p className="mt-3 text-title-3 text-ink">Query logged</p>
          <p className="mt-1 text-body-2 text-ink-muted">The query has been added to the query log.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/portals/nhapoa/call-center/queries" className="rounded-lg bg-navy px-4 py-2 text-label-1 font-semibold text-white hover:bg-navy-800">View Query Log</Link>
            <button type="button" onClick={() => { setDone(false); setSubject(""); setMobile(""); }} className="rounded-lg border border-navy/30 px-4 py-2 text-label-1 font-semibold text-navy hover:bg-navy/5">Log another</button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PortalPageHeader title="Query (FTR)" meta="Log a first-time-resolution query from a caller." />
      <Card className="max-w-xl p-6">
        <div className="space-y-4">
          <Field label="Caller mobile"><TextInput inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile (optional)" /></Field>
          <Field label="Query / subject" required><Textarea rows={3} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Asked about documents needed to file a grievance." /></Field>
        </div>
        <div className="mt-6 flex justify-end"><Button type="button" onClick={submit} disabled={!subject}>Log Query</Button></div>
      </Card>
    </div>
  );
}
