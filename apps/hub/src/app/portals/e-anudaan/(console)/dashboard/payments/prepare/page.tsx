"use client";

/**
 * Payment Advices — the Maker's queue (PFMS BRD FR-PDM-001).
 *
 * DS Audit: WorklistScreen ✅ existing · Tabs ✅ · Search ✅ · FilterSelect ✅ · Alert ✅ · screenCopy ✅ —
 * composed, nothing new. Columns and badges come from `components/e-anudaan/pfms/payment-ui`, shared
 * with the Checker's queue so a stage reads the same in both.
 *
 * Sanctioned files, oldest sanction first, split the way the Maker works through them: New, the
 * ones the Checker sent back, the ones PFMS refused, drafts, and files on hold. "On Hold" is its own
 * tab rather than a greyed row: the Maker cannot act on those files, and a queue that mixes work
 * with things you cannot touch makes both harder to see (BR-BAK-001, BR-NGO-001, §9).
 */

import * as React from "react";
import { Alert, FilterSelect, Search, Tabs, WorklistScreen, screenCopy } from "@mosje/design-system";
import { splitRowActions } from "@/components/e-anudaan/worklist-table";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { MAKER_TABS, BLOCKER_TEXT, makerTab, paymentCases, sanctionDate, type MakerTab, type PaymentCase } from "@/lib/e-anudaan/pfms/selectors";
import { caseColumns, prepareHref, statusHref, RowLink } from "@/components/e-anudaan/pfms/payment-ui";

export default function MakerQueuePage() {
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated } = usePfms();
  const [tab, setTab] = React.useState<MakerTab>("new");
  const [q, setQ] = React.useState("");
  const [scheme, setScheme] = React.useState("");

  const cases = React.useMemo(
    () => paymentCases(state, pfms).filter((c) => makerTab(c) !== null).sort((a, b) => sanctionDate(a).localeCompare(sanctionDate(b))),
    [state, pfms],
  );
  const inTab = cases.filter((c) => makerTab(c) === tab);
  const needle = q.trim().toLowerCase();
  const ngoName = (id: string) => state.ngos.find((n) => n.id === id)?.name ?? id;
  const rows = inTab.filter(
    (c) => (!scheme || c.app.schemeCode === scheme) && (!needle || `${c.app.id} ${ngoName(c.app.ngoId)} ${c.app.sanction?.orderNo ?? ""}`.toLowerCase().includes(needle)),
  );
  const schemes = [...new Set(cases.map((c) => c.app.schemeCode))].sort();
  const current = MAKER_TABS.find((t) => t.id === tab)!;

  const action = (c: PaymentCase) => {
    if (c.blocker) return <RowLink href={statusHref(c.app.id)} label="View" icon="open_in_new" />;
    if (!c.advice) return <RowLink href={prepareHref(c.app.id)} label="Prepare Advice" primary />;
    if (c.advice.state === "draft") return <RowLink href={prepareHref(c.app.id)} label="Continue" primary />;
    return <RowLink href={prepareHref(c.app.id)} label="Correct" primary />;
  };
  const columns = caseColumns({ ngoName, action });
  const active = (needle ? 1 : 0) + (scheme ? 1 : 0);

  return (
    <WorklistScreen<PaymentCase>
      title="Payment Advices"
      meta="Sanctioned files waiting for a payment advice to PFMS, oldest sanction first."
      loading={!hydrated || !pfmsHydrated}
      views={
        <Tabs
          idBase="maker-queue"
          ariaLabel="Payment advice queue"
          overflow
          tabs={MAKER_TABS.map((t) => {
            const n = cases.filter((c) => makerTab(c) === t.id).length;
            return { id: t.id, label: `${t.label} (${n})`, badge: (t.id === "returned" || t.id === "not-accepted") && n > 0 };
          })}
          active={MAKER_TABS.findIndex((t) => t.id === tab)}
          onChange={(i) => setTab(MAKER_TABS[i]!.id)}
        />
      }
      summary={
        tab === "held" && rows.length > 0 ? (
          <Alert status="info" title="These Files Cannot Be Prepared Yet">
            {[...new Set(rows.map((r) => r.blocker!))].map((b) => (
              <span key={b} className="block">
                <strong>{BLOCKER_TEXT[b].label}.</strong> {BLOCKER_TEXT[b].body}
              </span>
            ))}
          </Alert>
        ) : undefined
      }
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={inTab.length}
      getRowId={(c) => c.app.id}
      noun="file"
      activeFilterCount={active}
      onClearFilters={() => {
        setQ("");
        setScheme("");
      }}
      filters={
        <>
          <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Application, NGO or sanction order" aria-label="Search by application, NGO or sanction order" />
          <FilterSelect label="Scheme" value={scheme} onChange={setScheme} options={[{ value: "", label: "All Schemes" }, ...schemes.map((s) => ({ value: s, label: schemeLabel(s) }))]} />
        </>
      }
      copy={screenCopy({
        loadingLabel: "Loading the payment advice queue",
        emptyTitle: `No Files: ${current.label}`,
        emptyDescription: current.empty,
        filteredTitle: "No File Matches",
        filteredDescription: "Check the application number or NGO, or clear the filters to see every file in this tab.",
        clearFiltersLabel: "Clear Filters",
      })}
    />
  );
}
