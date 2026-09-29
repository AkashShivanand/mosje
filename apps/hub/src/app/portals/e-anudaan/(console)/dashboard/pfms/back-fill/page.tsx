"use client";

/**
 * Legacy Files — the Bureau's back-fill queue (PFMS BRD FR-NGO-003, BR-BAK-001, FR-HOA-003).
 *
 * DS Audit: WorklistScreen ✅ existing · Tabs ✅ · Search ✅ · FilterSelect ✅ · Alert ✅ · Modal ✅ ·
 * FormField ✅ · Input ✅ · Select ✅ · Checkbox ✅ · ErrorSummary ✅ · DescriptionList ✅ · Button ✅ ·
 * screenCopy ✅ · useToast ✅ — composed, nothing new. Columns and badges come from
 * `components/e-anudaan/pfms/payment-ui`, shared with the Maker's and Checker's queues.
 *
 * Four tabs, one per thing that can hold a sanctioned file back from a payment advice and that the
 * Bureau either clears or needs to see:
 *
 *   Bank Details Needed  — legacy files with no bank account on record. The Bureau enters the bank,
 *                          branch, account, IFSC and PFMS payee code from the file (BR-BAK-001).
 *   Payee Code Needed    — the account exists but the NGO has not given its payee code. Read-only:
 *                          the NGO supplies it (BR-NGO-001), and the Bureau only needs to see who.
 *   Back-Filled          — files whose payee details the Bureau entered, kept visible because a
 *                          back-filled record is a Bureau record and the Bureau answers for it.
 *   Heads to Retrofit    — payment advices still with the Maker whose coded head of account is not
 *                          one configured for the scheme, typically because the heads were finalised
 *                          after the advice was opened (FR-HOA-003).
 */

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Checkbox,
  DescriptionList,
  ErrorSummary,
  FilterSelect,
  FormField,
  Icon,
  Input,
  Modal,
  Search,
  Select,
  Tabs,
  WorklistScreen,
  buttonClasses,
  screenCopy,
  useToast,
  type WorklistColumn,
} from "@mosje/design-system";
import { splitRowActions } from "@/components/e-anudaan/worklist-table";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { formatDate } from "@/lib/e-anudaan/format";
import { BLOCKER_TEXT, paymentCases, payeeFor, sanctionDate, type PaymentCase } from "@/lib/e-anudaan/pfms/selectors";
import { IFSC, PAYEE_CODE, configFor, headCode, labelOf } from "@/lib/e-anudaan/pfms/masters";
import { isEditable } from "@/lib/e-anudaan/pfms/advice";
import type { HeadOfAccount, HeadLine, SchemePfmsConfig } from "@/lib/e-anudaan/pfms/types";
import { EA, RowLink, caseColumns, exact, statusHref } from "@/components/e-anudaan/pfms/payment-ui";

type LegacyTab = "bank" | "payee" | "done" | "heads";

const TABS: readonly { id: LegacyTab; label: string; emptyTitle: string; empty: string }[] = [
  { id: "bank", label: "Bank Details Needed", emptyTitle: "No File Needs Bank Details", empty: "Every sanctioned file has a bank account on record." },
  { id: "payee", label: "Payee Code Needed", emptyTitle: "No File Needs a Payee Code", empty: "Every NGO with a sanctioned file has given its PFMS payee code." },
  { id: "done", label: "Back-Filled", emptyTitle: "No File Back-Filled", empty: "No bank details have been entered by the Bureau." },
  { id: "heads", label: "Heads to Retrofit", emptyTitle: "No Head of Account to Retrofit", empty: "Every payment advice with the Maker uses a head of account configured for its scheme." },
];

const sameHead = (a: Partial<HeadOfAccount>, b: HeadOfAccount) =>
  a.functionHead === b.functionHead && a.objectHead === b.objectHead && a.category === b.category && a.grantNumber === b.grantNumber;

/** An advice the Maker can still change, carrying a head the scheme does not list (FR-HOA-003). */
function needsRetrofit(c: PaymentCase, configs: readonly SchemePfmsConfig[]): boolean {
  if (!c.advice || !isEditable(c.advice)) return false;
  const cfg = configFor(configs, c.advice.schemeCode);
  return c.advice.heads.some((h) => !cfg?.heads.some((x) => sameHead(h, x)));
}

export default function LegacyFilesPage() {
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated } = usePfms();
  const [tab, setTab] = React.useState<LegacyTab>("bank");
  const [q, setQ] = React.useState("");
  const [scheme, setScheme] = React.useState("");
  const [entering, setEntering] = React.useState<PaymentCase | null>(null);
  const [retrofitting, setRetrofitting] = React.useState<PaymentCase | null>(null);

  const ngoName = React.useCallback((id: string) => state.ngos.find((n) => n.id === id)?.name ?? id, [state.ngos]);

  // One reading of the payment leg; every tab and every count is a filter over it.
  const cases = React.useMemo(() => paymentCases(state, pfms).sort((a, b) => sanctionDate(a).localeCompare(sanctionDate(b))), [state, pfms]);
  const tabOf = React.useCallback(
    (c: PaymentCase): LegacyTab[] => {
      const out: LegacyTab[] = [];
      if (c.blocker === "needs-backfill") out.push("bank");
      if (c.blocker === "needs-payee-code") out.push("payee");
      const payee = payeeFor(state, pfms, c.app);
      if (typeof payee !== "string" && payee.source === "bureau") out.push("done");
      if (needsRetrofit(c, pfms.configs)) out.push("heads");
      return out;
    },
    [state, pfms],
  );
  const byTab = React.useMemo(() => {
    const m: Record<LegacyTab, PaymentCase[]> = { bank: [], payee: [], done: [], heads: [] };
    for (const c of cases) for (const t of tabOf(c)) m[t].push(c);
    return m;
  }, [cases, tabOf]);

  const inTab = byTab[tab];
  const needle = q.trim().toLowerCase();
  const rows = inTab.filter((c) => (!scheme || c.app.schemeCode === scheme) && (!needle || `${c.app.id} ${ngoName(c.app.ngoId)} ${c.app.institutionId}`.toLowerCase().includes(needle)));
  const schemes = [...new Set(inTab.map((c) => c.app.schemeCode))].sort();
  const current = TABS.find((t) => t.id === tab)!;

  const action = (c: PaymentCase) => {
    if (tab === "bank")
      return (
        <Button size="sm" appearance="outlined" nowrap iconLeft={<Icon name="edit" size={16} aria-hidden />} onClick={() => setEntering(c)}>
          Enter Bank Details
        </Button>
      );
    if (tab === "heads")
      return (
        <Button size="sm" appearance="outlined" nowrap iconLeft={<Icon name="account_tree" size={16} aria-hidden />} onClick={() => setRetrofitting(c)}>
          Set Head of Account
        </Button>
      );
    return <RowLink href={statusHref(c.app.id)} label="View" icon="open_in_new" />;
  };

  const extra: WorklistColumn<PaymentCase>[] =
    tab === "done"
      ? [
          {
            key: "bank",
            header: "Bank Details",
            priority: 2,
            exportValue: (c) => {
              const b = pfms.backfilled.find((x) => x.projectId === c.app.institutionId);
              return b ? `${b.bank}, ${b.branch}, ${b.ifsc}, account ending ${b.last4}` : "";
            },
            render: (c) => {
              const b = pfms.backfilled.find((x) => x.projectId === c.app.institutionId);
              if (!b) return null;
              return (
                <span className="block min-w-[12rem]">
                  <span className="block text-ink">
                    {b.bank}, {b.branch}
                  </span>
                  <span className="block text-body-3 text-ink-muted">
                    IFSC {b.ifsc} · Account ending {b.last4}
                  </span>
                </span>
              );
            },
          },
          {
            key: "payee",
            header: "PFMS Payee Code",
            priority: 2,
            exportValue: (c) => pfms.backfilled.find((x) => x.projectId === c.app.institutionId)?.payeeCode ?? "",
            render: (c) => <span className="font-mono text-body-2">{pfms.backfilled.find((x) => x.projectId === c.app.institutionId)?.payeeCode}</span>,
          },
          {
            key: "entered",
            header: "Entered On",
            priority: 3,
            sortable: true,
            sortValue: (c) => pfms.backfilled.find((x) => x.projectId === c.app.institutionId)?.enteredAt ?? "",
            render: (c) => {
              const b = pfms.backfilled.find((x) => x.projectId === c.app.institutionId);
              return b ? <span className="whitespace-nowrap">{formatDate(b.enteredAt)}</span> : null;
            },
          },
        ]
      : tab === "heads"
        ? [
            {
              key: "advice",
              header: "Payment Advice",
              priority: 2,
              exportValue: (c) => c.advice?.id ?? "",
              render: (c) => <span className="whitespace-nowrap">{c.advice?.id}</span>,
            },
            {
              key: "head",
              header: "Current Head of Account",
              priority: 2,
              exportValue: (c) => c.advice?.heads.map((h) => headCode(h)).join("; ") ?? "",
              render: (c) => (
                <span className="block font-mono text-body-3">
                  {c.advice?.heads.map((h) => (
                    <span key={h.id} className="block whitespace-nowrap">
                      {headCode(h)}
                    </span>
                  ))}
                </span>
              ),
            },
          ]
        : [];
  const base = caseColumns({ ngoName, action });
  const at = base.findIndex((c) => c.key === "status");
  const columns = [...base.slice(0, at), ...extra, ...base.slice(at)];
  const active = (needle ? 1 : 0) + (scheme ? 1 : 0);

  return (
    <>
      <WorklistScreen<PaymentCase>
        title="Legacy Files"
        meta="Sanctioned files the Bureau completes before a payment advice can be prepared, oldest sanction first."
        loading={!hydrated || !pfmsHydrated}
        views={
          <Tabs
            idBase="legacy-files"
            ariaLabel="Legacy files"
            overflow
            tabs={TABS.map((t) => ({ id: t.id, label: `${t.label} (${byTab[t.id].length})`, badge: (t.id === "bank" || t.id === "heads") && byTab[t.id].length > 0 }))}
            active={TABS.findIndex((t) => t.id === tab)}
            onChange={(i) => {
              setTab(TABS[i]!.id);
              setScheme("");
            }}
          />
        }
        summary={
          tab === "payee" && inTab.length > 0 ? (
            <Alert status="info" title="The NGO Supplies This Code">
              {BLOCKER_TEXT["needs-payee-code"].body} The file moves to the Maker&apos;s queue as soon as the code is on record.
            </Alert>
          ) : tab === "heads" && inTab.length > 0 ? (
            <Alert status="info" title="Heads of Account Not Configured for the Scheme">
              These payment advices are still with the Maker. Set a head of account configured for the scheme; the Maker then submits the advice as usual.
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
            <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Application, NGO or project ID" aria-label="Search by application, NGO or project ID" />
            <FilterSelect label="Scheme" value={scheme} onChange={setScheme} options={[{ value: "", label: "All Schemes" }, ...schemes.map((s) => ({ value: s, label: schemeLabel(s) }))]} />
          </>
        }
        copy={screenCopy({
          loadingLabel: "Loading legacy files",
          emptyTitle: current.emptyTitle,
          emptyDescription: current.empty,
          filteredTitle: "No File Matches",
          filteredDescription: "Check the application number or NGO, or clear the filters to see every file in this tab.",
          clearFiltersLabel: "Clear Filters",
        })}
      />

      {entering && <BackfillDialog key={entering.app.id} c={entering} ngoName={ngoName(entering.app.ngoId)} onClose={() => setEntering(null)} />}
      {retrofitting && <RetrofitDialog key={retrofitting.app.id} c={retrofitting} ngoName={ngoName(retrofitting.app.ngoId)} onClose={() => setRetrofitting(null)} />}
    </>
  );
}

/* ── Enter bank details (BR-BAK-001) ────────────────────────────────────── */

function BackfillDialog({ c, ngoName, onClose }: { c: PaymentCase; ngoName: string; onClose: () => void }) {
  const { backfill } = usePfms();
  const { toast } = useToast();
  const [bank, setBank] = React.useState("");
  const [branch, setBranch] = React.useState("");
  // The full account number lives only in this component's state while the officer types it. It is
  // compared with the confirmation, reduced to its last four digits, and discarded: only the last
  // four are ever stored (BackfilledAccount.last4), in keeping with how the NGO's own account is held.
  const [account, setAccount] = React.useState("");
  const [account2, setAccount2] = React.useState("");
  const [ifsc, setIfsc] = React.useState("");
  const [payee, setPayee] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [tried, setTried] = React.useState(false);

  const digits = account.replace(/\s/g, "");
  const code = payee.trim().toUpperCase();
  const ifscCode = ifsc.trim().toUpperCase();
  const errors: Record<string, string> = {};
  if (!bank.trim()) errors["bf-bank"] = "Enter the name of the bank.";
  if (!branch.trim()) errors["bf-branch"] = "Enter the branch.";
  if (!/^\d{9,18}$/.test(digits)) errors["bf-account"] = "Enter the account number: 9 to 18 digits.";
  else if (account2.replace(/\s/g, "") !== digits) errors["bf-account-confirm"] = "The two account numbers do not match. Enter the same number in both fields.";
  if (!IFSC.test(ifscCode)) errors["bf-ifsc"] = "Enter the 11-character IFSC: four letters, a zero, then six letters or digits. For example, SBIN0001763.";
  if (!PAYEE_CODE.test(code)) errors["bf-payee"] = "Enter the PFMS payee code as it appears on the NGO's PFMS registration: two letters and ten digits.";
  if (!confirmed) errors["bf-confirm"] = "Confirm that the details have been checked against the bank record on the file.";
  const shown = tried ? errors : {};
  const summary = Object.entries(shown).map(([fieldId, message]) => ({ fieldId, message }));
  const dirty = [bank, branch, account, account2, ifsc, payee].some((v) => v.trim().length > 0) || confirmed;

  const save = () => {
    setTried(true);
    if (Object.keys(errors).length > 0) return;
    const res = backfill({ projectId: c.app.institutionId, bank: bank.trim(), branch: branch.trim(), last4: digits.slice(-4), ifsc: ifscCode, payeeCode: code });
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Bank details recorded for ${ngoName}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Enter Bank Details"
      size="md"
      dirty={dirty}
      footer={
        <>
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save Bank Details</Button>
        </>
      }
    >
      <div className="space-y-4">
        <DescriptionList
          size="sm"
          columns={2}
          items={[
            { term: "NGO", value: ngoName },
            { term: "Application No.", value: c.app.id },
            { term: "Project ID", value: c.app.institutionId },
            { term: "Sanction Amount", value: exact(c.app.sanction?.total ?? 0) },
          ]}
        />
        {summary.length > 0 && <ErrorSummary errors={summary} headingLevel={3} />}
        <p className="text-body-2 text-ink-muted">Enter the details exactly as they appear on the bank record in the sanctioned file.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Bank Name" id="bf-bank" required error={shown["bf-bank"]}>
            {(f) => <Input {...f} value={bank} onChange={(e) => setBank(e.target.value)} />}
          </FormField>
          <FormField label="Branch" id="bf-branch" required error={shown["bf-branch"]}>
            {(f) => <Input {...f} value={branch} onChange={(e) => setBranch(e.target.value)} />}
          </FormField>
          <FormField label="Account Number" id="bf-account" required error={shown["bf-account"]} hint="Only the last four digits are kept.">
            {(f) => <Input {...f} inputMode="numeric" autoComplete="off" value={account} onChange={(e) => setAccount(e.target.value)} />}
          </FormField>
          <FormField label="Confirm Account Number" id="bf-account-confirm" required error={shown["bf-account-confirm"]}>
            {(f) => <Input {...f} inputMode="numeric" autoComplete="off" value={account2} onChange={(e) => setAccount2(e.target.value)} />}
          </FormField>
          <FormField label="IFSC" id="bf-ifsc" required error={shown["bf-ifsc"]} hint="11 characters, for example SBIN0001763.">
            {(f) => <Input {...f} autoComplete="off" maxLength={11} value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} />}
          </FormField>
          <FormField label="PFMS Payee Code" id="bf-payee" required error={shown["bf-payee"]} hint="Two letters and ten digits.">
            {(f) => <Input {...f} autoComplete="off" maxLength={12} value={payee} onChange={(e) => setPayee(e.target.value.toUpperCase())} />}
          </FormField>
        </div>
        <Checkbox
          id="bf-confirm"
          checked={confirmed}
          onCheckedChange={setConfirmed}
          error={shown["bf-confirm"]}
          label="I have checked these details against the bank record in the sanctioned file."
        />
      </div>
    </Modal>
  );
}

/* ── Retrofit a coded head of account (FR-HOA-003) ──────────────────────── */

function RetrofitDialog({ c, ngoName, onClose }: { c: PaymentCase; ngoName: string; onClose: () => void }) {
  const { pfms, retrofitHeads } = usePfms();
  const { toast } = useToast();
  const [choice, setChoice] = React.useState("");
  const [tried, setTried] = React.useState(false);
  const advice = c.advice!;
  const heads = configFor(pfms.configs, advice.schemeCode)?.heads ?? [];
  const m = pfms.masters;
  const describe = (h: HeadOfAccount) => `${headCode(h)} — ${labelOf(m.objectHeads, h.objectHead)}, ${labelOf(m.categories, h.category)}`;
  const error = tried && !choice ? "Choose the head of account for this payment advice." : undefined;

  const save = () => {
    setTried(true);
    const head = heads[Number(choice)];
    if (!choice || !head) return;
    // One line for the full sanction amount; the Maker may split it across heads before submitting.
    const line: HeadLine = { id: `${advice.id}-h1`, ...head, amount: advice.sanctionAmount };
    const res = retrofitHeads(advice.appId, [line]);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Head of account set on payment advice ${advice.id}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Set Head of Account"
      size="md"
      dirty={choice !== ""}
      footer={
        heads.length > 0 ? (
          <>
            <Button appearance="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save}>Set Head of Account</Button>
          </>
        ) : (
          <Button appearance="outlined" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      <div className="space-y-4">
        <DescriptionList
          size="sm"
          columns={2}
          items={[
            { term: "NGO", value: ngoName },
            { term: "Payment Advice", value: advice.id },
            { term: "Scheme", value: schemeLabel(advice.schemeCode) },
            { term: "Sanction Amount", value: exact(advice.sanctionAmount) },
          ]}
        />
        {heads.length === 0 ? (
          <Alert
            status="warning"
            title="No Head of Account Configured"
            action={
              <Link href={`${EA}/dashboard/pfms/heads-of-account`} className={buttonClasses("primary", "text", "sm")}>
                Heads of Account
              </Link>
            }
          >
            Add a head of account for {schemeLabel(advice.schemeCode)} first.
          </Alert>
        ) : (
          <>
            <FormField label="Head of Account" id="rf-head" required error={error} hint={`Function Head · Object Head · Category · Grant Number. The full ${exact(advice.sanctionAmount)} is placed against it.`}>
              {(f) => <Select {...f} value={choice} onChange={(e) => setChoice(e.target.value)} placeholder="Choose a head of account" options={heads.map((h, i) => ({ value: String(i), label: describe(h) }))} />}
            </FormField>
            <p className="text-body-2 text-ink-muted">The Maker can split the amount across the scheme&apos;s other heads before submitting.</p>
          </>
        )}
      </div>
    </Modal>
  );
}
