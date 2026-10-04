"use client";

/**
 * PFMS Masters — the PFMS master data e-Anudaan holds, the DDOs that can receive an e-Bill, and the
 * Claim Reference pool (PFMS BRD FR-MDM-001…005, BR-MDM-001, FR-DOC-003, Annexure D).
 *
 * Drawn after the Programme Division's review (handoff file, Officers · Paying Grants through PFMS ·
 * Bureau / PFMS Masters / Current · Out of Date, 3 Oct 2026). It folds three earlier pages into one:
 * Master Data, DDO & Division Codes, and Claim References. They were three views of one PFMS
 * synchronisation, and the Bureau refreshed them together.
 *
 * "Sync from PFMS" refreshes the eight master lists and tops up any Division Code's Claim Reference
 * pool for the current year that has fallen below one batch (GetClaimReferenceNumber is a PFMS call
 * like the others). The file draws no separate button for drawing references; the Claim References
 * page that held it is retired.
 *
 * DS Audit: PageHeader ✅ · Button ✅ · Alert ✅ · MetricCard ✅ · Card ✅ · SectionTitle ✅ · DataTable ✅ ·
 * Badge ✅ · Accordion ✅ · RecordScreen ✅ (loading) · useToast ✅ — composed, nothing new.
 */

import * as React from "react";
import { Accordion, AccordionItem, Alert, Badge, Button, Card, CardBody, DataTable, Icon, MetricCard, PageHeader, RecordScreen, SectionTitle, useToast, type DataTableColumn } from "@mosje/design-system";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { formatDate, formatTime } from "@/lib/e-anudaan/format";
import { DDO_KIND_LABEL, mastersAgeHours, mastersStale } from "@/lib/e-anudaan/pfms/masters";
import { poolUtilisation } from "@/lib/e-anudaan/pfms/reports";
import { pfmsFinancialYear } from "@/lib/e-anudaan/pfms/advice";

/** A Division Code's pool is topped up on sync when fewer than one batch of references remain. */
const POOL_TOP_UP_BELOW = 25;

/** The Government of India's financial year a date falls in: "2026-27" from April 2026. */
function financialYearOf(iso: string): string {
  const d = new Date(iso);
  const start = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

type CodeRow = { code: string; label: string; detail: string };
type DdoRow = { code: string; name: string; paoCode: string; paoName: string; kind?: "NCDDO" | "CDDO"; pdCode: string; pdLabel: string; eBillActive: boolean };

function Coded({ code, label }: { code: string; label: string }) {
  return (
    <span className="block">
      <span className="block text-ink">{code}</span>
      {label && <span className="block text-body-3 text-ink-muted">{label}</span>}
    </span>
  );
}

export default function PfmsMastersPage() {
  const { pfms, hydrated, now, refreshMasters, drawClaimReferences } = usePfms();
  const { toast } = useToast();

  if (!hydrated) return <RecordScreen title="PFMS Masters" loading tabs={[]} />;

  const m = pfms.masters;
  const at = now();
  const stale = mastersStale(m, at);
  const days = Math.max(1, Math.floor(mastersAgeHours(m, at) / 24));
  const fy = financialYearOf(at);
  // The pool keys a year the way PFMS does — "2027" for 2026-27 (pfmsFinancialYear).
  const pool = poolUtilisation(pfms.pool, pfms.advices).filter((r) => r.financialYear === pfmsFinancialYear(fy));
  const drawn = pool.reduce((s, r) => s + r.drawn, 0);
  const consumed = pool.reduce((s, r) => s + r.consumed, 0);

  const sync = () => {
    refreshMasters();
    const low = pool.filter((r) => r.remaining < POOL_TOP_UP_BELOW);
    for (const r of low) drawClaimReferences(r.pdCode, r.financialYear);
    toast(
      low.length > 0
        ? `Master data refreshed from PFMS, and claim references drawn for ${low.length} division code${low.length === 1 ? "" : "s"}.`
        : "Master data refreshed from PFMS.",
      "success",
    );
  };

  const ddoRows: DdoRow[] = m.ddos.map((d) => {
    const pd = m.pdCodes.find((p) => p.ddoCode === d.code);
    return {
      code: d.code,
      name: d.name,
      paoCode: d.paoCode,
      paoName: m.paos.find((p) => p.code === d.paoCode)?.name ?? "",
      kind: d.kind,
      pdCode: pd?.code ?? "",
      pdLabel: pd?.label ?? "",
      eBillActive: d.eBillActive,
    };
  });
  const ddoColumns: DataTableColumn<DdoRow>[] = [
    { key: "ddo", header: "DDO", render: (r) => <Coded code={r.code} label={r.name} /> },
    { key: "pao", header: "Pay & Accounts Office", render: (r) => <Coded code={r.paoCode} label={r.paoName} /> },
    { key: "kind", header: "Type", render: (r) => (r.kind ? <Coded code={r.kind} label={DDO_KIND_LABEL[r.kind]} /> : <span className="text-ink-muted">Read at the next sync</span>) },
    { key: "pd", header: "PD Code", render: (r) => (r.pdCode ? <Coded code={r.pdCode} label={r.pdLabel} /> : "—") },
    {
      key: "ebill",
      header: "e-Bill",
      render: (r) =>
        r.eBillActive ? (
          <Badge status="success" size="sm">Active</Badge>
        ) : (
          <Badge status="danger" size="sm" className="whitespace-nowrap">Not Active</Badge>
        ),
    },
  ];

  const lists: { key: string; title: string; detailHeader?: string; rows: CodeRow[] }[] = [
    { key: "controllers", title: "Controllers", rows: m.controllers.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "paos", title: "Pay & Accounts Offices", detailHeader: "Controller", rows: m.paos.map((p) => ({ code: p.code, label: p.name, detail: m.controllers.find((c) => c.code === p.controllerCode)?.label ?? p.controllerCode })) },
    { key: "pd", title: "Division Codes (PD Codes)", detailHeader: "DDO", rows: m.pdCodes.map((p) => ({ code: p.code, label: p.label, detail: m.ddos.find((d) => d.code === p.ddoCode)?.name ?? p.ddoCode })) },
    { key: "function", title: "Function Heads", rows: m.functionHeads.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "object", title: "Object Heads", rows: m.objectHeads.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "category", title: "Categories", rows: m.categories.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "grant", title: "Grant Numbers", rows: m.grantNumbers.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="PFMS Masters"
        meta={`Last synchronised with PFMS on ${formatDate(m.syncedAt)}, ${formatTime(m.syncedAt)}.`}
        actions={
          <Button size="sm" iconLeft={<Icon name="sync" size={16} aria-hidden />} onClick={sync}>
            Sync from PFMS
          </Button>
        }
      />

      {stale && (
        <Alert status="warning" title={`Master Data Is ${days} Day${days === 1 ? "" : "s"} Old`}>
          {/* What the code does (validateAdvice → hdr-masters): no advice is submitted until the masters are refreshed. */}
          No payment advice can be submitted until it is synchronised again.
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard label="Claim References Remaining" value={(drawn - consumed).toLocaleString("en-IN")} />
        <MetricCard label="Claim References Used" value={`${consumed.toLocaleString("en-IN")} of ${drawn.toLocaleString("en-IN")}`} />
      </div>

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle as={2} title="e-Bill Activation and Claim References" />
          <DataTable<DdoRow> columns={ddoColumns} data={ddoRows} total={ddoRows.length} caption="DDOs, their Pay & Accounts Office, Division Code and e-Bill status, from PFMS" emptyLabel="PFMS returned no DDO at the last synchronisation." />
        </CardBody>
      </Card>

      <Card variant="outlined">
        <CardBody className="space-y-2">
          <SectionTitle as={2} title="Master Lists" />
          <Accordion variant="flush">
            {lists.map((l) => {
              const columns: DataTableColumn<CodeRow>[] = [
                { key: "code", header: "Code", sortable: true, sortValue: (r) => r.code, render: (r) => <span className="whitespace-nowrap">{r.code}</span> },
                { key: "label", header: "Name", sortable: true, sortValue: (r) => r.label },
                ...(l.detailHeader ? [{ key: "detail", header: l.detailHeader }] : []),
              ];
              return (
                <AccordionItem key={l.key} title={`${l.title} (${l.rows.length})`}>
                  <DataTable<CodeRow> caption={`${l.title} from PFMS master data`} columns={columns} data={l.rows} total={l.rows.length} emptyLabel="PFMS returned no entries for this list at the last synchronisation." />
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardBody>
      </Card>
    </div>
  );
}
