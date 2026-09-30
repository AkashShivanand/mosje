"use client";

/**
 * Master Data — the PFMS masters e-Anudaan holds, and how old they are (PFMS BRD FR-MDM-005,
 * BR-MDM-001, Annexure D).
 *
 * DS Audit: SettingsScreen ✅ existing (the template for configuration the reader administers) · KpiRow ✅ · Alert ✅ · Accordion ✅ · AccordionItem ✅ · DataTable ✅ ·
 * Button ✅ · Icon ✅ · Skeleton ✅ · useToast ✅ — composed, nothing new.
 *
 * Eight lists, each a PFMS web method (GetController, GetPAO, GetDDO, GetPDCode, GetFunctionHead,
 * GetObjectHead, GetCategory, GetGrantNumber). They are refreshed on a daily schedule and can be
 * refreshed on demand here. A copy older than MASTER_MAX_AGE_HOURS stops the Maker submitting any
 * advice until it is refreshed (BR-MDM-001), so the age is the headline and the warning names that
 * consequence. The lists themselves sit folded below the counts: they are for looking a code up.
 */

import * as React from "react";
import { Accordion, AccordionItem, Alert, Button, DataTable, Icon, KpiRow, SettingsScreen, useToast, type DataTableColumn } from "@mosje/design-system";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { MASTER_MAX_AGE_HOURS, mastersStale } from "@/lib/e-anudaan/pfms/masters";

type CodeRow = { code: string; label: string; detail: string };

interface MasterList {
  key: string;
  title: string;
  /** What the third column holds, where the list has one. */
  detailHeader?: string;
  rows: CodeRow[];
}

export default function MasterDataPage() {
  const { pfms, hydrated, now, refreshMasters } = usePfms();
  const { toast } = useToast();

  const m = pfms.masters;
  const stale = mastersStale(m, now());
  const paoName = (code: string) => m.paos.find((p) => p.code === code)?.name ?? code;
  const lists: MasterList[] = [
    { key: "controllers", title: "Controllers", rows: m.controllers.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "paos", title: "Pay & Accounts Offices", detailHeader: "Controller", rows: m.paos.map((p) => ({ code: p.code, label: p.name, detail: m.controllers.find((c) => c.code === p.controllerCode)?.label ?? p.controllerCode })) },
    { key: "ddos", title: "Drawing & Disbursing Officers", detailHeader: "PAO", rows: m.ddos.map((d) => ({ code: d.code, label: d.name, detail: paoName(d.paoCode) })) },
    { key: "pd", title: "Division Codes (PD Codes)", detailHeader: "DDO", rows: m.pdCodes.map((p) => ({ code: p.code, label: p.label, detail: m.ddos.find((d) => d.code === p.ddoCode)?.name ?? p.ddoCode })) },
    { key: "function", title: "Function Heads", rows: m.functionHeads.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "object", title: "Object Heads", rows: m.objectHeads.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "category", title: "Categories", rows: m.categories.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
    { key: "grant", title: "Grant Numbers", rows: m.grantNumbers.map((c) => ({ code: c.code, label: c.label, detail: "" })) },
  ];

  const refresh = () => {
    refreshMasters();
    toast("Master data refreshed from PFMS.", "success");
  };

  return (
    <SettingsScreen
      title="Master Data"
      meta={`Last synchronised with PFMS ${formatDateTime(m.syncedAt)}. Refreshed automatically once a day, and on demand.`}
      loading={!hydrated}
      actions={
        <Button iconLeft={<Icon name="sync" size={20} aria-hidden />} onClick={refresh}>
          Refresh Now
        </Button>
      }
      sections={[
        {
          id: "synchronisation",
          title: "Synchronisation",
          description: "How many entries each PFMS list held at the last refresh.",
          children: (
            <div className="space-y-4">
              {stale && (
                <Alert status="error" title="Master Data Is Out of Date">
                  The master data is more than {MASTER_MAX_AGE_HOURS} hours old. No payment advice can be submitted until it is refreshed.
                </Alert>
              )}
              <KpiRow items={lists.map((l) => ({ key: l.key, label: l.title, value: String(l.rows.length), size: "sm" as const }))} />
            </div>
          ),
        },
        {
          id: "lists",
          title: "Master Lists",
          description: "Open a list to look a code up.",
          children: (
            <Accordion variant="flush">
              {lists.map((l) => {
                const columns: DataTableColumn<CodeRow>[] = [
                  { key: "code", header: "Code", sortable: true, sortValue: (r) => r.code, render: (r) => <span className="font-mono">{r.code}</span> },
                  { key: "label", header: "Name", sortable: true, sortValue: (r) => r.label },
                  ...(l.detailHeader ? [{ key: "detail", header: l.detailHeader }] : []),
                ];
                return (
                  <AccordionItem key={l.key} title={`${l.title} (${l.rows.length})`}>
                    <DataTable<CodeRow> caption={`${l.title} from PFMS master data`} columns={columns} data={l.rows} total={l.rows.length} emptyLabel="PFMS returned no entries for this list at the last refresh." />
                  </AccordionItem>
                );
              })}
            </Accordion>
          ),
        },
      ]}
    />
  );
}
