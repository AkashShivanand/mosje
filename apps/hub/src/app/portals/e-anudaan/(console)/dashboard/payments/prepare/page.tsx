"use client";

/**
 * Payment Advices — the Maker's queue (PFMS BRD FR-PDM-001).
 *
 * DS Audit: WorklistScreen ✅ existing · Search ✅ · FilterSelect ✅ · Badge ✅ · screenCopy ✅ —
 * composed, nothing new.
 *
 * ONE LIST, as the screen is drawn after the division's review (handoff file, Officers · Paying
 * Grants through PFMS · PD Maker / Payment Advices / All Cases, 3 Oct 2026). It replaced six tabs:
 * the Maker looks in one place, and the Case column says what each file needs — a fresh advice, a
 * draft to finish, or an advice to correct. Files held for the Bureau (bank details, payee code,
 * scheme code) are not the Maker's to act on, so they are not in this list; the Dashboard counts
 * them under "With the Bureau".
 */

import * as React from "react";
import { Badge, FilterSelect, Search, WorklistScreen, screenCopy, type WorklistColumn } from "@mosje/design-system";
import { splitRowActions, RefText } from "@/components/e-anudaan/worklist-table";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { formatDate } from "@/lib/e-anudaan/format";
import { makerTab, payeeFor, paymentCases, sanctionDate, type PaymentCase } from "@/lib/e-anudaan/pfms/selectors";
import { exact, prepareHref, statusHref, RowLink } from "@/components/e-anudaan/pfms/payment-ui";
import { RESTARTABLE, STAGE_INFO } from "@/lib/e-anudaan/pfms/stages";

type Tone = "neutral" | "warning" | "danger";

/** What the file needs from the Maker, in the words the Case column uses. */
function caseOf(c: PaymentCase): { label: string; tone: Tone } {
  switch (makerTab(c)) {
    case "drafts":
      return { label: `Draft — saved ${formatDate(c.advice!.updatedAt)}`, tone: "neutral" };
    case "returned":
      return { label: "Returned by the Checker", tone: "warning" };
    case "not-accepted":
      return { label: "Not accepted by PFMS", tone: "danger" };
    case "returned-pfms":
      return RESTARTABLE.includes(c.stage) ? { label: STAGE_INFO[c.stage].label, tone: "danger" } : { label: "Returned by PFMS", tone: "warning" };
    default:
      return { label: "Fresh", tone: "neutral" };
  }
}

export default function MakerQueuePage() {
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated } = usePfms();
  const [q, setQ] = React.useState("");
  const [scheme, setScheme] = React.useState("");

  const cases = React.useMemo(
    () =>
      paymentCases(state, pfms)
        .filter((c) => {
          const tab = makerTab(c);
          return tab !== null && tab !== "held";
        })
        .sort((a, b) => sanctionDate(a).localeCompare(sanctionDate(b))),
    [state, pfms],
  );
  const needle = q.trim().toLowerCase();
  const ngoName = (id: string) => state.ngos.find((n) => n.id === id)?.name ?? id;
  const rows = cases.filter(
    (c) => (!scheme || c.app.schemeCode === scheme) && (!needle || `${c.app.id} ${ngoName(c.app.ngoId)} ${c.app.sanction?.orderNo ?? ""}`.toLowerCase().includes(needle)),
  );
  const schemes = [...new Set(cases.map((c) => c.app.schemeCode))].sort();
  const payeeCode = (c: PaymentCase) => {
    const fromAdvice = c.advice?.beneficiaries[0]?.payeeCode;
    if (fromAdvice) return fromAdvice;
    const p = payeeFor(state, pfms, c.app);
    return typeof p === "string" ? undefined : p.payeeCode;
  };

  const action = (c: PaymentCase) => {
    if (!c.advice) return <RowLink href={prepareHref(c.app.id)} label="Prepare Advice" primary />;
    if (c.advice.state === "draft") return <RowLink href={prepareHref(c.app.id)} label="Continue" primary />;
    // Ended at PFMS or the bank: the fresh advice is started from the case page, where the reason is.
    if (RESTARTABLE.includes(c.stage)) return <RowLink href={statusHref(c.app.id)} label="Start Afresh" primary />;
    return <RowLink href={prepareHref(c.app.id)} label="Correct and Resubmit" primary />;
  };

  const columns: WorklistColumn<PaymentCase>[] = [
    {
      key: "payee",
      header: "NGO / Payee",
      priority: 1,
      sortable: true,
      sortValue: (c) => ngoName(c.app.ngoId),
      exportValue: (c) => `${ngoName(c.app.ngoId)} ${payeeCode(c) ?? ""}`,
      render: (c) => {
        const code = payeeCode(c);
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
      header: "Amount",
      priority: 2,
      align: "end",
      sortable: true,
      sortValue: (c) => c.app.sanction?.total ?? 0,
      exportValue: (c) => String(c.app.sanction?.total ?? 0),
      render: (c) => <span className="whitespace-nowrap">{exact(c.app.sanction?.total ?? 0)}</span>,
    },
    {
      key: "case",
      header: "Case",
      priority: 2,
      exportValue: (c) => caseOf(c).label,
      render: (c) => {
        const k = caseOf(c);
        return (
          <Badge status={k.tone} size="sm" className="h-auto whitespace-normal">
            {k.label}
          </Badge>
        );
      },
    },
    { key: "action", header: "Action", priority: 3, noExport: true, render: action },
  ];
  const active = (needle ? 1 : 0) + (scheme ? 1 : 0);

  return (
    <WorklistScreen<PaymentCase>
      title="Payment Advices"
      meta="Sanctioned files waiting for a payment advice."
      loading={!hydrated || !pfmsHydrated}
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={cases.length}
      getRowId={(c) => c.app.id}
      noun="file"
      activeFilterCount={active}
      onClearFilters={() => {
        setQ("");
        setScheme("");
      }}
      filters={
        cases.length > 0 ? (
          <>
            <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Application, NGO or sanction order" aria-label="Search by application, NGO or sanction order" />
            <FilterSelect label="Scheme" value={scheme} onChange={setScheme} options={[{ value: "", label: "All Schemes" }, ...schemes.map((s) => ({ value: s, label: schemeLabel(s) }))]} />
          </>
        ) : undefined
      }
      copy={screenCopy({
        loadingLabel: "Loading the payment advices",
        emptyTitle: "No Files Waiting",
        emptyDescription: "Every sanctioned file has a payment advice.",
        filteredTitle: "No File Matches",
        filteredDescription: "Check the application number or NGO, or clear the filters to see every file.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
