"use client";

/**
 * Authorisation Queue — the Checker's queue (PFMS BRD FR-PDC-001).
 *
 * DS Audit: WorklistScreen ✅ existing · Tabs ✅ · Search ✅ · FilterSelect ✅ · screenCopy ✅ — composed;
 * columns shared with the Maker's queue (`payment-ui`).
 *
 * Two tabs: what is waiting for the Checker's signature, and what the Checker has already sent —
 * so "did my signature go through?" is answered here rather than by opening every file.
 */

import * as React from "react";
import { FilterSelect, Search, Tabs, WorklistScreen, screenCopy } from "@mosje/design-system";
import { splitRowActions } from "@/components/e-anudaan/worklist-table";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { paymentCases, type PaymentCase } from "@/lib/e-anudaan/pfms/selectors";
import { caseColumns, authoriseHref, statusHref, RowLink } from "@/components/e-anudaan/pfms/payment-ui";

const TABS = [
  { id: "waiting", label: "Awaiting Authorisation", empty: "No payment advice is waiting for your authorisation." },
  { id: "sent", label: "Authorised by You", empty: "You have not authorised a payment advice yet." },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function CheckerQueuePage() {
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated } = usePfms();
  const [tab, setTab] = React.useState<Tab>("waiting");
  const [q, setQ] = React.useState("");
  const [scheme, setScheme] = React.useState("");
  const me = state.session;

  const cases = React.useMemo(() => paymentCases(state, pfms).filter((c) => c.advice), [state, pfms]);
  const byTab = (t: Tab) =>
    cases
      .filter((c) => (t === "waiting" ? c.advice!.state === "submitted" : c.advice!.signature?.by === me))
      .sort((a, b) => (a.advice!.submittedAt ?? "").localeCompare(b.advice!.submittedAt ?? ""));
  const inTab = byTab(tab);
  const ngoName = (id: string) => state.ngos.find((n) => n.id === id)?.name ?? id;
  const needle = q.trim().toLowerCase();
  const rows = inTab.filter((c) => (!scheme || c.app.schemeCode === scheme) && (!needle || `${c.app.id} ${ngoName(c.app.ngoId)} ${c.advice?.id}`.toLowerCase().includes(needle)));
  const schemes = [...new Set(cases.map((c) => c.app.schemeCode))].sort();
  const current = TABS.find((t) => t.id === tab)!;

  const action = (c: PaymentCase) =>
    c.advice!.state === "submitted" ? <RowLink href={authoriseHref(c.app.id)} label="Review" primary /> : <RowLink href={statusHref(c.app.id)} label="Payment Status" icon="open_in_new" />;
  const columns = caseColumns({ ngoName, action });

  return (
    <WorklistScreen<PaymentCase>
      title="Authorisation Queue"
      meta="Payment advices prepared by the Maker, waiting for your review and digital signature before they are sent to PFMS."
      loading={!hydrated || !pfmsHydrated}
      views={
        <Tabs
          idBase="checker-queue"
          ariaLabel="Authorisation queue"
          tabs={TABS.map((t) => ({ id: t.id, label: `${t.label} (${byTab(t.id).length})` }))}
          active={TABS.findIndex((t) => t.id === tab)}
          onChange={(i) => setTab(TABS[i]!.id)}
        />
      }
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={inTab.length}
      getRowId={(c) => c.app.id}
      noun="advice"
      pluralNoun="advices"
      activeFilterCount={(needle ? 1 : 0) + (scheme ? 1 : 0)}
      onClearFilters={() => {
        setQ("");
        setScheme("");
      }}
      filters={
        <>
          <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Application, NGO or advice number" aria-label="Search by application, NGO or advice number" />
          <FilterSelect label="Scheme" value={scheme} onChange={setScheme} options={[{ value: "", label: "All Schemes" }, ...schemes.map((s) => ({ value: s, label: schemeLabel(s) }))]} />
        </>
      }
      copy={screenCopy({
        loadingLabel: "Loading the authorisation queue",
        emptyTitle: tab === "waiting" ? "Nothing Awaiting Authorisation" : "Nothing Authorised Yet",
        emptyDescription: current.empty,
        filteredTitle: "No Advice Matches",
        filteredDescription: "Check the application or advice number, or clear the filters.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
