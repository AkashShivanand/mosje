"use client";

import * as React from "react";
import Link from "next/link";
import { Phone, FilePlus2, UserRound } from "lucide-react";
import { PageHeader, Card, Button, Field, TextInput } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";

export default function CallerPage() {
  const { state } = useNhapoa();
  const [mobile, setMobile] = React.useState("");
  const [result, setResult] = React.useState<null | { known: boolean; cases: number }>(null);

  function lookup() {
    const cases = state.cases.filter((c) => c.complainant.mobile === mobile || c.victim?.mobile === mobile).length;
    setResult({ known: cases > 0, cases });
  }

  return (
    <div>
      <PageHeader title="Caller Details" subtitle="Look up or create the caller record from their mobile." />
      <Card className="max-w-xl p-6">
        <Field label="Mobile" required>
          <div className="flex gap-2">
            <TextInput inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" />
            <Button type="button" onClick={lookup} disabled={!/^\d{10}$/.test(mobile)}><Phone className="h-4 w-4" /> GO</Button>
          </div>
        </Field>

        {result && (
          <div className="mt-6 rounded-xl border border-line p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-navy/10 text-navy"><UserRound className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-bold text-ink">{result.known ? "Existing caller" : "New caller"}</p>
                <p className="text-xs text-ink-muted">{result.known ? `${result.cases} grievance(s) on record for +91 ${mobile}` : `No prior records for +91 ${mobile} — create by registering a grievance.`}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/portals/nhapoa/call-center/register-grievance" className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"><FilePlus2 className="h-4 w-4" /> Register Grievance</Link>
              <Link href="/portals/nhapoa/call-center/query" className="inline-flex items-center gap-2 rounded-lg border border-navy/30 px-4 py-2 text-sm font-semibold text-navy hover:bg-navy/5">Log a Query</Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
