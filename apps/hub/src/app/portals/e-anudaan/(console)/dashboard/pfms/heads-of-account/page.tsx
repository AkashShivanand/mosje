"use client";

/**
 * Heads of Account — each scheme's PFMS scheme code and coded heads (PFMS BRD FR-HOA-001,
 * FR-HOA-002, §3.1 B, §9).
 *
 * DS Audit: SettingsScreen ✅ existing · Card ✅ · SectionTitle ✅ · DataTable ✅ · Alert ✅ · Button ✅ ·
 * Modal ✅ · FormField ✅ · Input ✅ · Select ✅ · ErrorSummary ✅ · Skeleton ✅ · EmptyState ✅ ·
 * useToast ✅ — composed, nothing new.
 *
 * One card per scheme. A coded head is the four codes PFMS validates together — Function Head
 * (13 digits), Object Head (2), Category and Grant Number (3) — and the Maker may choose only from
 * the combinations listed here (FR-HOA-002). A scheme PFMS has not yet allotted a code carries that
 * as a state with the field to record it, not as a blank. Removing a head leaves advices already
 * sent untouched; advices still with the Maker that used it surface on Legacy Files to be retrofitted
 * (FR-HOA-003).
 */

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Button,
  Card,
  CardBody,
  DataTable,
  EmptyState,
  ErrorSummary,
  FormField,
  Icon,
  Input,
  Modal,
  SectionTitle,
  Select,
  SettingsScreen,
  useToast,
  type DataTableColumn,
} from "@mosje/design-system";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { BLOCKER_TEXT } from "@/lib/e-anudaan/pfms/selectors";
import { headCode, labelOf } from "@/lib/e-anudaan/pfms/masters";
import { isEditable } from "@/lib/e-anudaan/pfms/advice";
import type { HeadOfAccount, Masters, SchemePfmsConfig } from "@/lib/e-anudaan/pfms/types";
import { EA } from "@/components/e-anudaan/pfms/payment-ui";

type HeadRow = { index: number; functionHead: string; objectHead: string; category: string; grantNumber: string };

const sameHead = (a: Partial<HeadOfAccount>, b: HeadOfAccount) =>
  a.functionHead === b.functionHead && a.objectHead === b.objectHead && a.category === b.category && a.grantNumber === b.grantNumber;

function Coded({ code, label }: { code: string; label: string }) {
  return (
    <span className="block min-w-[8rem]">
      <span className="block font-mono text-body-2 text-ink">{code}</span>
      {label && <span className="block text-body-3 text-ink-muted">{label}</span>}
    </span>
  );
}

export default function HeadsOfAccountPage() {
  const { pfms, hydrated, setSchemeHeads } = usePfms();
  const { toast } = useToast();
  const [adding, setAdding] = React.useState<string | null>(null);
  const [removing, setRemoving] = React.useState<{ schemeCode: string; index: number } | null>(null);


  const removingCfg = removing ? pfms.configs.find((c) => c.schemeCode === removing.schemeCode) : undefined;
  const removingHead = removing && removingCfg ? removingCfg.heads[removing.index] : undefined;
  const inUse = removing && removingHead ? pfms.advices.filter((a) => a.schemeCode === removing.schemeCode && isEditable(a) && a.heads.some((h) => sameHead(h, removingHead))).length : 0;

  const confirmRemove = () => {
    if (!removingCfg || !removing) return;
    const res = setSchemeHeads(removingCfg.schemeCode, removingCfg.heads.filter((_, i) => i !== removing.index));
    if (res.ok) toast(`Head of account removed from ${schemeLabel(removingCfg.schemeCode)}.`, "success");
    else toast(res.error, "error");
    setRemoving(null);
  };
  const addingCfg = adding ? pfms.configs.find((c) => c.schemeCode === adding) : undefined;

  return (
    <>
      <SettingsScreen
        title="Heads of Account"
        meta="The PFMS scheme code and the coded heads of account a payment advice may use, by scheme."
        loading={!hydrated}
        sections={[
          {
            id: "schemes",
            title: "Schemes",
            description: "Each scheme's PFMS code and the heads the Maker may choose from.",
            children:
              pfms.configs.length === 0 ? (
                <EmptyState title="No Scheme Configured" description="No scheme is set up for payment through PFMS." />
              ) : (
                <div className="space-y-5">
                  {pfms.configs.map((cfg) => (
                    <SchemeCard key={cfg.schemeCode} cfg={cfg} masters={pfms.masters} onAdd={() => setAdding(cfg.schemeCode)} onRemove={(index) => setRemoving({ schemeCode: cfg.schemeCode, index })} />
                  ))}
                </div>
              ),
          },
        ]}
      />

      {addingCfg && <AddHeadDialog key={addingCfg.schemeCode} cfg={addingCfg} masters={pfms.masters} onClose={() => setAdding(null)} />}

      <Modal
        open={!!removingHead}
        onClose={() => setRemoving(null)}
        title="Remove Head of Account"
        size="sm"
        footer={
          <>
            <Button appearance="outlined" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              Remove
            </Button>
          </>
        }
      >
        {removingHead && removingCfg && (
          <div className="space-y-3">
            <p className="text-body-1 text-ink">
              Remove <span className="font-mono">{headCode(removingHead)}</span> from {schemeLabel(removingCfg.schemeCode)}? The Maker will no longer be able to choose it. Payment advices already sent to PFMS are not affected.
            </p>
            {inUse > 0 && (
              <Alert status="warning" title={`${inUse} Payment Advice${inUse === 1 ? "" : "s"} Use This Head`}>
                {inUse === 1 ? "It is" : "They are"} still with the Maker and will be listed under{" "}
                <Link href={`${EA}/dashboard/pfms/back-fill`} className="underline">
                  Legacy Files
                </Link>{" "}
                for a new head of account.
              </Alert>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

/* ── One scheme ─────────────────────────────────────────────────────────── */

function SchemeCard({ cfg, masters, onAdd, onRemove }: { cfg: SchemePfmsConfig; masters: Masters; onAdd: () => void; onRemove: (index: number) => void }) {
  const { setSchemeCode } = usePfms();
  const { toast } = useToast();
  const [code, setCode] = React.useState("");
  const [codeError, setCodeError] = React.useState<string | undefined>();
  const name = schemeLabel(cfg.schemeCode);
  const fieldId = `scheme-code-${cfg.schemeCode}`;

  const saveCode = () => {
    const res = setSchemeCode(cfg.schemeCode, code.trim());
    if (!res.ok) {
      setCodeError(res.error);
      return;
    }
    setCodeError(undefined);
    setCode("");
    toast(`PFMS scheme code ${code.trim()} recorded for ${name}.`, "success");
  };

  const rows: HeadRow[] = cfg.heads.map((h, index) => ({ index, ...h }));
  const columns: DataTableColumn<HeadRow>[] = [
    { key: "functionHead", header: "Function Head", render: (r) => <Coded code={r.functionHead} label={labelOf(masters.functionHeads, r.functionHead)} /> },
    { key: "objectHead", header: "Object Head", render: (r) => <Coded code={r.objectHead} label={labelOf(masters.objectHeads, r.objectHead)} /> },
    { key: "category", header: "Category", render: (r) => <Coded code={r.category} label={labelOf(masters.categories, r.category)} /> },
    { key: "grantNumber", header: "Grant Number", render: (r) => <Coded code={r.grantNumber} label={labelOf(masters.grantNumbers, r.grantNumber)} /> },
    {
      key: "remove",
      header: "Action",
      noExport: true,
      render: (r) => (
        <Button size="sm" appearance="text" variant="danger" nowrap iconLeft={<Icon name="delete" size={16} aria-hidden />} onClick={() => onRemove(r.index)} aria-label={`Remove head ${headCode(r)}`}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle
          as={2}
          title={name}
          description={cfg.pfmsSchemeCode ? `PFMS scheme code ${cfg.pfmsSchemeCode}` : "PFMS scheme code awaited"}
          count={cfg.heads.length}
        >
          <Button size="sm" appearance="outlined" iconLeft={<Icon name="add" size={20} aria-hidden />} onClick={onAdd}>
            Add Head of Account
          </Button>
        </SectionTitle>

        {cfg.pendingDecision && (
          <Alert status="info" title="Decision Awaited">
            {cfg.pendingDecision}
          </Alert>
        )}

        {!cfg.pfmsSchemeCode && (
          <div className="space-y-3">
            <Alert status="warning" title={BLOCKER_TEXT["scheme-code-pending"].label}>
              {BLOCKER_TEXT["scheme-code-pending"].body} Record the code below once PFMS allots it.
            </Alert>
            <div className="space-y-3">
              <FormField label="PFMS Scheme Code" id={fieldId} error={codeError} hint="Numeric, for example 3817." className="max-w-xs">
                {(f) => (
                  <Input
                    {...f}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={5}
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeError(undefined);
                    }}
                  />
                )}
              </FormField>
              <Button size="md" onClick={saveCode}>
                Save Scheme Code
              </Button>
            </div>
          </div>
        )}

        <DataTable<HeadRow>
          caption={`Coded heads of account for ${name}`}
          columns={columns}
          data={rows}
          total={rows.length}
          emptyLabel="No head of account is configured. The Maker cannot prepare a payment advice for this scheme until one is added."
        />
      </CardBody>
    </Card>
  );
}

/* ── Add a head ─────────────────────────────────────────────────────────── */

function AddHeadDialog({ cfg, masters, onClose }: { cfg: SchemePfmsConfig; masters: Masters; onClose: () => void }) {
  const { setSchemeHeads } = usePfms();
  const { toast } = useToast();
  const [head, setHead] = React.useState<HeadOfAccount>({ functionHead: "", objectHead: "", category: "", grantNumber: "" });
  const [tried, setTried] = React.useState(false);
  const name = schemeLabel(cfg.schemeCode);

  const errors: Record<string, string> = {};
  if (!head.functionHead) errors["ah-function"] = "Choose the Function Head.";
  if (!head.objectHead) errors["ah-object"] = "Choose the Object Head.";
  if (!head.category) errors["ah-category"] = "Choose the Category.";
  if (!head.grantNumber) errors["ah-grant"] = "Choose the Grant Number.";
  if (Object.keys(errors).length === 0 && cfg.heads.some((h) => sameHead(head, h))) errors["ah-function"] = "This head of account is already configured for the scheme.";
  const shown = tried ? errors : {};
  const summary = Object.entries(shown).map(([fieldId, message]) => ({ fieldId, message }));
  const set = (k: keyof HeadOfAccount) => (e: React.ChangeEvent<HTMLSelectElement>) => setHead((h) => ({ ...h, [k]: e.target.value }));
  const opts = (list: readonly { code: string; label: string }[]) => list.map((i) => ({ value: i.code, label: `${i.code} — ${i.label}` }));

  const save = () => {
    setTried(true);
    if (Object.keys(errors).length > 0) return;
    const res = setSchemeHeads(cfg.schemeCode, [...cfg.heads, head]);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Head of account ${headCode(head)} added to ${name}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Add Head of Account: ${name}`}
      size="md"
      dirty={Object.values(head).some(Boolean)}
      footer={
        <>
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Add Head of Account</Button>
        </>
      }
    >
      <div className="space-y-4">
        {summary.length > 0 && <ErrorSummary errors={summary} headingLevel={3} />}
        <p className="text-body-2 text-ink-muted">The four codes are validated together by PFMS. Choose them from the master data synchronised from PFMS.</p>
        <FormField label="Function Head" id="ah-function" required error={shown["ah-function"]} hint="13 digits.">
          {(f) => <Select {...f} value={head.functionHead} onChange={set("functionHead")} placeholder="Choose a Function Head" options={opts(masters.functionHeads)} />}
        </FormField>
        <FormField label="Object Head" id="ah-object" required error={shown["ah-object"]} hint="2 digits.">
          {(f) => <Select {...f} value={head.objectHead} onChange={set("objectHead")} placeholder="Choose an Object Head" options={opts(masters.objectHeads)} />}
        </FormField>
        <FormField label="Category" id="ah-category" required error={shown["ah-category"]}>
          {(f) => <Select {...f} value={head.category} onChange={set("category")} placeholder="Choose a Category" options={opts(masters.categories)} />}
        </FormField>
        <FormField label="Grant Number" id="ah-grant" required error={shown["ah-grant"]} hint="3 digits.">
          {(f) => <Select {...f} value={head.grantNumber} onChange={set("grantNumber")} placeholder="Choose a Grant Number" options={opts(masters.grantNumbers)} />}
        </FormField>
      </div>
    </Modal>
  );
}
