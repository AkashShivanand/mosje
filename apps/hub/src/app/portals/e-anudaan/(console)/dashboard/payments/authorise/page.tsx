"use client";

/**
 * Authorisation Queue — the Checker's queue (PFMS BRD FR-PDC-001).
 *
 * DS Audit: WorklistScreen ✅ existing · Search ✅ · FilterSelect ✅ · Badge ✅ · screenCopy ✅ — composed.
 *
 * ONE LIST, as the screen is drawn after the division's review (handoff file, Officers · Paying
 * Grants through PFMS · PD Checker / Authorisation Queue / Awaiting Authorisation · Nothing Waiting,
 * 3 Oct 2026). It holds only what is waiting for this Checker's signature, oldest first. The tab of
 * advices already signed went with the redraw: "did my signature go through?" is answered on the
 * Dashboard, which follows every file to its credit.
 */

import * as React from "react";
import { Badge, FilterSelect, Search, WorklistScreen, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { splitRowActions, RefText } from "@/components/e-anudaan/worklist-table";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { formatDate } from "@/lib/e-anudaan/format";
import { netOf } from "@/lib/e-anudaan/pfms/advice";
import { paymentCases, type PaymentCase } from "@/lib/e-anudaan/pfms/selectors";
import { authoriseHref, exact, RowLink } from "@/components/e-anudaan/pfms/payment-ui";

/** "29 Sep" — the year is the queue's own; a file older than a year is not waiting for a signature. */
const dayMonth = (iso: string) => formatDate(iso).replace(/ \d{4}$/, "");

export default function CheckerQueuePage() {
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated } = usePfms();
  const [q, setQ] = React.useState("");
  const [scheme, setScheme] = React.useState("");

  const cases = React.useMemo(
    () =>
      paymentCases(state, pfms)
        .filter((c) => c.advice?.state === "submitted")
        .sort((a, b) => (a.advice!.submittedAt ?? "").localeCompare(b.advice!.submittedAt ?? "")),
    [state, pfms],
  );
  const ngoName = (id: string) => state.ngos.find((n) => n.id === id)?.name ?? id;
  const needle = q.trim().toLowerCase();
  const rows = cases.filter((c) => (!scheme || c.app.schemeCode === scheme) && (!needle || `${c.app.id} ${ngoName(c.app.ngoId)} ${c.advice?.id}`.toLowerCase().includes(needle)));
  const schemes = [...new Set(cases.map((c) => c.app.schemeCode))].sort();
  const payable = (c: PaymentCase) => c.advice!.beneficiaries.reduce((s, b) => s + netOf(b), 0);

  const columns: WorklistColumn<PaymentCase>[] = [
    {
      key: "payee",
      header: "NGO / Payee",
      priority: 1,
      sortable: true,
      sortValue: (c) => ngoName(c.app.ngoId),
      exportValue: (c) => `${ngoName(c.app.ngoId)} ${c.advice!.beneficiaries[0]?.payeeCode ?? ""}`,
      render: (c) => {
        const code = c.advice!.beneficiaries[0]?.payeeCode;
        return (
          <span className="block min-w-[12rem]">
            <span className="block text-ink">{ngoName(c.app.ngoId)}</span>
            {code && <span className="block text-body-3 text-ink-muted">Payee code {code}</span>}
          </span>
        );
      },
    },
    { key: "scheme", header: "Scheme", priority: 2, sortable: true, sortValue: (c) => schemeLabel(c.app.schemeCode), exportValue: (c) => schemeLabel(c.app.schemeCode), render: (c) => schemeLabel(c.app.schemeCode) },
    {
      key: "sanction",
      header: "Sanction",
      priority: 2,
      sortable: true,
      sortValue: (c) => c.app.sanction?.sanctionedAt ?? "",
      exportValue: (c) => `${c.app.sanction?.orderNo ?? ""} ${c.app.sanction ? formatDate(c.app.sanction.sanctionedAt) : ""}`,
      render: (c) => (
        <span className="block whitespace-nowrap">
          <RefText value={c.app.sanction?.orderNo ?? ""} className="block" />
          <span className="block text-body-3 text-ink-muted">{c.app.sanction ? formatDate(c.app.sanction.sanctionedAt) : ""}</span>
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount Payable",
      priority: 2,
      align: "end",
      sortable: true,
      sortValue: payable,
      exportValue: (c) => String(payable(c)),
      render: (c) => <span className="whitespace-nowrap">{exact(payable(c))}</span>,
    },
    {
      key: "submitted",
      header: "Submitted",
      priority: 2,
      sortable: true,
      sortValue: (c) => c.advice!.submittedAt ?? "",
      exportValue: (c) => `${c.advice!.submittedAt ? formatDate(c.advice!.submittedAt) : ""} ${ROLES[c.advice!.preparedBy ?? "pd-maker"]?.personName ?? ""}`,
      render: (c) => (
        <Badge status="info" size="sm" className="h-auto whitespace-nowrap">
          {c.advice!.submittedAt ? dayMonth(c.advice!.submittedAt) : ""} · {ROLES[c.advice!.preparedBy ?? "pd-maker"]?.personName ?? "the Maker"}
        </Badge>
      ),
    },
    { key: "action", header: "Action", priority: 3, noExport: true, render: (c) => <RowLink href={authoriseHref(c.app.id)} label="Review and Sign" primary /> },
  ];

  return (
    <WorklistScreen<PaymentCase>
      title="Authorisation Queue"
      meta="Payment advices waiting for your signature."
      loading={!hydrated || !pfmsHydrated}
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={cases.length}
      getRowId={(c) => c.app.id}
      noun="advice"
      pluralNoun="advices"
      activeFilterCount={(needle ? 1 : 0) + (scheme ? 1 : 0)}
      onClearFilters={() => {
        setQ("");
        setScheme("");
      }}
      filters={
        cases.length > 0 ? (
          <>
            <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Application, NGO or advice number" aria-label="Search by application, NGO or advice number" />
            <FilterSelect label="Scheme" value={scheme} onChange={setScheme} options={[{ value: "", label: "All Schemes" }, ...schemes.map((s) => ({ value: s, label: schemeLabel(s) }))]} />
          </>
        ) : undefined
      }
      copy={screenCopy({
        loadingLabel: "Loading the authorisation queue",
        emptyTitle: "Nothing to Sign",
        emptyDescription: "No payment advice is waiting for your signature.",
        filteredTitle: "No Advice Matches",
        filteredDescription: "Check the application or advice number, or clear the filters.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
