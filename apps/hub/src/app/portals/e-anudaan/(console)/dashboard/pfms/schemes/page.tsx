"use client";

/**
 * Schemes and Checkers — each scheme's PFMS code and coded heads of account, and who prepares and
 * signs the advices for each DDO (PFMS BRD FR-HOA-001…003, BR-DSC-001, §3.1 B, §4, §9, §10;
 * NFR §6.4).
 *
 * Drawn after the Programme Division's review (handoff file, Officers · Paying Grants through PFMS ·
 * Bureau / Schemes and Checkers / All Schemes, 3 Oct 2026). It folds two earlier pages into one:
 * Heads of Account and Maker & Checker. Both answer "can this scheme be paid, and who signs?".
 *
 * Two seats reach it. The Bureau keeps the configuration and edits all of it. The Under Secretary,
 * who designates the Maker and the Checker (§4), edits the designations and reads the schemes.
 *
 * Kept from the earlier pages, though the file does not draw them:
 *   - "Enter Scheme Code", beside a scheme PFMS has not yet allotted a code. The code arrives after
 *     the scheme is configured (§9), and without this the scheme could never be paid.
 *   - The DDO in Add Scheme. A scheme is paid by a DDO, and the Maker's DDO list is the scheme's.
 *
 * DS Audit: PageHeader ✅ · SectionTitle ✅ · DataTable ✅ · Badge ✅ · Button ✅ · Modal ✅ · FormField ✅ ·
 * Input ✅ · Select ✅ · DatePicker ✅ · ErrorSummary ✅ · DescriptionList ✅ · Alert ✅ · EmptyState ✅ ·
 * RecordScreen ✅ (loading) · useToast ✅ — composed, nothing new.
 */

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  DataTable,
  DatePicker,
  DescriptionList,
  EmptyState,
  ErrorSummary,
  FormField,
  Icon,
  Input,
  Modal,
  PageHeader,
  RecordScreen,
  SectionTitle,
  Select,
  useToast,
  type DataTableColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatDate, formatDateTime } from "@/lib/e-anudaan/format";
import { formatFunctionHead, headCode, labelOf, schemeTitle } from "@/lib/e-anudaan/pfms/masters";
import { isEditable } from "@/lib/e-anudaan/pfms/advice";
import type { Designation, HeadOfAccount, Masters, SchemePfmsConfig } from "@/lib/e-anudaan/pfms/types";
import type { RoleId } from "@/lib/e-anudaan/types";
import { EA } from "@/components/e-anudaan/pfms/payment-ui";

const OLDER_FILES = `${EA}/dashboard/pfms/older-files`;
const DAY = 86_400_000;
const CERT_WARN_DAYS = 30;

type HeadRow = { index: number; functionHead: string; objectHead: string; category: string; grantNumber: string };
// A mapped copy of `Designation`: an interface carries no index signature, which DataTable rows need.
type CheckerRow = { [K in keyof Designation]: Designation[K] } & { ddoName: string };

const sameHead = (a: Partial<HeadOfAccount>, b: HeadOfAccount) =>
  a.functionHead === b.functionHead && a.objectHead === b.objectHead && a.category === b.category && a.grantNumber === b.grantNumber;

/**
 * Who may be designated: the Maker and Checker seats, and any officer of the Programme Division's
 * approval chain — the BRD places both duties "within the Programme Division" and leaves open
 * whether they are seats of their own or duties added to an existing grade (open question 2).
 */
const OFFICERS: RoleId[] = (Object.keys(ROLES) as RoleId[]).filter((id) => id === "pd-maker" || id === "pd-checker" || ROLES[id].division === "pd");
const officer = (id: RoleId) => `${ROLES[id].personName}, ${ROLES[id].label}`;

function certificateState(expires: string, today: string): { label: string; status: "danger" | "warning" | "success" } {
  const days = Math.round((Date.parse(expires) - Date.parse(today)) / DAY);
  if (days < 0) return { label: "Expired", status: "danger" };
  if (days === 0) return { label: "Expires today", status: "warning" };
  if (days <= CERT_WARN_DAYS) return { label: `Expires in ${days} day${days === 1 ? "" : "s"}`, status: "warning" };
  return { label: "Valid", status: "success" };
}

function Coded({ code, label }: { code: string; label: string }) {
  return (
    <span className="block">
      <span className="block text-ink">{code}</span>
      {label && <span className="block text-body-3 text-ink-muted">{label}</span>}
    </span>
  );
}

function Person({ id }: { id: RoleId }) {
  const r = ROLES[id];
  return (
    <span className="block">
      <span className="block text-ink">{r.personName}</span>
      <span className="block text-body-3 text-ink-muted">{r.label}</span>
    </span>
  );
}

export default function SchemesAndCheckersPage() {
  const { state } = useEAnudaan();
  const { pfms, hydrated, now, setSchemeHeads } = usePfms();
  const { toast } = useToast();
  const role = state.session ? ROLES[state.session] : null;
  const canConfigure = !!role?.caps.includes("configurePfms");
  const canDesignate = !!role?.caps.includes("designateOfficers");
  const [adding, setAdding] = React.useState<string | null>(null);
  const [addingScheme, setAddingScheme] = React.useState(false);
  const [codeFor, setCodeFor] = React.useState<string | null>(null);
  const [removing, setRemoving] = React.useState<{ schemeCode: string; index: number } | null>(null);
  // `null` is closed; `""` is "Change a Checker", which asks for the DDO first.
  const [editing, setEditing] = React.useState<string | null>(null);

  if (!hydrated) return <RecordScreen title="Schemes and Checkers" loading tabs={[]} />;

  const today = now().slice(0, 10);
  const removingCfg = removing ? pfms.configs.find((c) => c.schemeCode === removing.schemeCode) : undefined;
  const removingHead = removing && removingCfg ? removingCfg.heads[removing.index] : undefined;
  const inUse = removing && removingHead ? pfms.advices.filter((a) => a.schemeCode === removing.schemeCode && isEditable(a) && a.heads.some((h) => sameHead(h, removingHead))).length : 0;
  const addingCfg = adding ? pfms.configs.find((c) => c.schemeCode === adding) : undefined;
  const codeCfg = codeFor ? pfms.configs.find((c) => c.schemeCode === codeFor) : undefined;

  const confirmRemove = () => {
    if (!removingCfg || !removing) return;
    const res = setSchemeHeads(removingCfg.schemeCode, removingCfg.heads.filter((_, i) => i !== removing.index));
    if (res.ok) toast(`Head of account removed from ${schemeTitle(removingCfg)}.`, "success");
    else toast(res.error, "error");
    setRemoving(null);
  };

  const checkers: CheckerRow[] = pfms.designations.map((d) => ({ ...d, ddoName: pfms.masters.ddos.find((x) => x.code === d.ddoCode)?.name ?? d.ddoCode }));
  const checkerColumns: DataTableColumn<CheckerRow>[] = [
    { key: "ddo", header: "DDO", render: (r) => <Coded code={r.ddoName} label={r.ddoCode} /> },
    { key: "maker", header: "Maker", render: (r) => <Person id={r.maker} /> },
    { key: "checker", header: "Checker", render: (r) => <Person id={r.checker} /> },
    { key: "serial", header: "Certificate Serial", render: (r) => <span className="whitespace-nowrap">{r.certificateSerial}</span> },
    {
      key: "expires",
      header: "Certificate Expiry",
      render: (r) => {
        const s = certificateState(r.certificateExpires, today);
        return (
          <span className="block whitespace-nowrap">
            <span className="block">{formatDate(r.certificateExpires)}</span>
            <Badge status={s.status} size="sm" className="mt-1">
              {s.label}
            </Badge>
          </span>
        );
      },
    },
    {
      key: "designated",
      header: "Designated",
      render: (r) => (
        <span className="block whitespace-nowrap">
          <span className="block">{formatDate(r.designatedAt)}</span>
          <span className="block text-body-3 text-ink-muted">{ROLES[r.designatedBy].personName}</span>
        </span>
      ),
    },
    ...(canDesignate
      ? [
          {
            key: "action",
            header: "Actions",
            align: "end" as const,
            render: (r: CheckerRow) => (
              <Button size="sm" appearance="outlined" nowrap iconLeft={<Icon name="edit" size={16} aria-hidden />} onClick={() => setEditing(r.ddoCode)} aria-label={`Edit the Maker and Checker for ${r.ddoName}`}>
                Edit
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Schemes and Checkers"
        actions={
          canConfigure ? (
            <Button size="sm" iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => setAddingScheme(true)}>
              Add Scheme
            </Button>
          ) : undefined
        }
      />

      {pfms.configs.length === 0 ? (
        <EmptyState title="No Scheme Configured" description="No scheme is set up for payment through PFMS." />
      ) : (
        pfms.configs.map((cfg) => (
          <SchemeSection
            key={cfg.schemeCode}
            cfg={cfg}
            masters={pfms.masters}
            editable={canConfigure}
            onAdd={() => setAdding(cfg.schemeCode)}
            onEnterCode={() => setCodeFor(cfg.schemeCode)}
            onRemove={(index) => setRemoving({ schemeCode: cfg.schemeCode, index })}
          />
        ))
      )}

      <section aria-labelledby="designated-checkers" className="space-y-3">
        <SectionTitle as={2} headingId="designated-checkers" title="Designated Checkers" count={checkers.length}>
          {canDesignate && (
            <Button size="sm" appearance="outlined" iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => setEditing("")}>
              Change a Checker
            </Button>
          )}
        </SectionTitle>
        <p className="text-body-2 text-ink-muted">
          {checkers.length} DDO{checkers.length === 1 ? "" : "s"}.
        </p>
        <DataTable<CheckerRow> columns={checkerColumns} data={checkers} total={checkers.length} caption="The Maker and Checker designated for each DDO, and the Checker's signing certificate" emptyLabel="No DDO is in the PFMS master data. Synchronise the PFMS masters." />
      </section>

      {addingScheme && <AddSchemeDialog masters={pfms.masters} onClose={() => setAddingScheme(false)} />}
      {addingCfg && <AddHeadDialog key={addingCfg.schemeCode} cfg={addingCfg} masters={pfms.masters} onClose={() => setAdding(null)} />}
      {codeCfg && <SchemeCodeDialog key={codeCfg.schemeCode} cfg={codeCfg} onClose={() => setCodeFor(null)} />}
      {editing !== null && <EditDesignationDialog key={editing || "choose"} rows={checkers} ddoCode={editing} onClose={() => setEditing(null)} />}

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
              Remove {headCode({ ...removingHead, functionHead: formatFunctionHead(removingHead.functionHead) })} from {schemeTitle(removingCfg)}? The Maker will no longer be able to choose it. Payment advices already sent to PFMS are not affected.
            </p>
            {inUse > 0 && (
              <Alert status="warning" title={`${inUse} Payment Advice${inUse === 1 ? "" : "s"} Use This Head`}>
                {inUse === 1 ? "It is" : "They are"} still with the Maker and will be listed under{" "}
                <Link href={OLDER_FILES} className="underline">
                  Older Files
                </Link>{" "}
                for a new head of account.
              </Alert>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ── One scheme ─────────────────────────────────────────────────────────── */

function SchemeSection({
  cfg,
  masters,
  editable,
  onAdd,
  onEnterCode,
  onRemove,
}: {
  cfg: SchemePfmsConfig;
  masters: Masters;
  editable: boolean;
  onAdd: () => void;
  onEnterCode: () => void;
  onRemove: (index: number) => void;
}) {
  const name = schemeTitle(cfg);
  const rows: HeadRow[] = cfg.heads.map((h, index) => ({ index, ...h }));
  const columns: DataTableColumn<HeadRow>[] = [
    { key: "functionHead", header: "Function Head", render: (r) => <Coded code={formatFunctionHead(r.functionHead)} label={labelOf(masters.functionHeads, r.functionHead)} /> },
    { key: "objectHead", header: "Object Head", render: (r) => <Coded code={r.objectHead} label={labelOf(masters.objectHeads, r.objectHead)} /> },
    { key: "category", header: "Category", render: (r) => <Coded code={r.category} label={labelOf(masters.categories, r.category)} /> },
    { key: "grantNumber", header: "Grant Number", render: (r) => <Coded code={r.grantNumber} label={labelOf(masters.grantNumbers, r.grantNumber)} /> },
    ...(editable
      ? [
          {
            key: "remove",
            header: "Action",
            align: "end" as const,
            render: (r: HeadRow) => (
              <Button size="sm" appearance="text" nowrap iconLeft={<Icon name="delete" size={16} aria-hidden />} onClick={() => onRemove(r.index)} aria-label={`Remove head ${headCode(r)} from ${name}`}>
                Remove
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <section aria-labelledby={`scheme-${cfg.schemeCode}`} className="space-y-3">
      <SectionTitle as={2} headingId={`scheme-${cfg.schemeCode}`} title={name} description={cfg.pfmsSchemeCode ? `PFMS scheme code ${cfg.pfmsSchemeCode}` : "PFMS scheme code awaited"} count={cfg.heads.length}>
        {editable && (
          <span className="flex flex-wrap items-center gap-2">
            {!cfg.pfmsSchemeCode && (
              <Button size="sm" appearance="text" onClick={onEnterCode}>
                Enter Scheme Code
              </Button>
            )}
            <Button size="sm" appearance="outlined" iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={onAdd}>
              Add Head of Account
            </Button>
          </span>
        )}
      </SectionTitle>
      <DataTable<HeadRow>
        caption={`Coded heads of account for ${name}`}
        columns={columns}
        data={rows}
        total={rows.length}
        emptyLabel="No head of account is configured. The Maker cannot prepare a payment advice for this scheme until one is added."
      />
    </section>
  );
}

/* ── The scheme code, once PFMS allots it (§9) ──────────────────────────── */

function SchemeCodeDialog({ cfg, onClose }: { cfg: SchemePfmsConfig; onClose: () => void }) {
  const { setSchemeCode } = usePfms();
  const { toast } = useToast();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const name = schemeTitle(cfg);

  const save = () => {
    const res = setSchemeCode(cfg.schemeCode, code.trim());
    if (!res.ok) {
      setError(res.error);
      return;
    }
    toast(`PFMS scheme code ${code.trim()} recorded for ${name}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Enter Scheme Code: ${name}`}
      size="sm"
      dirty={!!code}
      footer={
        <>
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save Scheme Code</Button>
        </>
      }
    >
      <FormField label="PFMS Scheme Code" id="sc-code" required error={error} hint="Numeric, for example 3817, as PFMS allotted it.">
        {(f) => (
          <Input
            {...f}
            inputMode="numeric"
            autoComplete="off"
            maxLength={5}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(undefined);
            }}
          />
        )}
      </FormField>
    </Modal>
  );
}

/* ── Add a scheme (NFR §6.4) ────────────────────────────────────────────── */

function AddSchemeDialog({ masters, onClose }: { masters: Masters; onClose: () => void }) {
  const { addScheme } = usePfms();
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [ddo, setDdo] = React.useState("");
  const [tried, setTried] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | undefined>();

  const errors: Record<string, string> = {};
  if (!name.trim()) errors["as-name"] = "Enter the scheme's name.";
  if (code.trim() && !/^\d{3,5}$/.test(code.trim())) errors["as-code"] = "Enter the numeric PFMS scheme code, for example 3817, or leave it blank.";
  if (!ddo) errors["as-ddo"] = "Choose the DDO that pays this scheme.";
  if (serverError && !errors["as-name"]) errors["as-name"] = serverError;
  const shown = tried ? errors : {};
  const summary = Object.entries(shown).map(([fieldId, message]) => ({ fieldId, message }));

  const save = () => {
    setTried(true);
    if (Object.keys(errors).length > 0) return;
    const res = addScheme({ name, pfmsSchemeCode: code, ddoCodes: [ddo] });
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    toast(`${name.trim()} added. Add its heads of account next.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Add Scheme"
      size="md"
      dirty={!!(name || code || ddo)}
      footer={
        <>
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Add Scheme</Button>
        </>
      }
    >
      <div className="space-y-4">
        {summary.length > 0 && <ErrorSummary errors={summary} headingLevel={3} />}
        <p className="text-body-2 text-ink-muted">The scheme can be paid through PFMS once it has a PFMS scheme code and at least one head of account.</p>
        <FormField label="Scheme Name" id="as-name" required error={shown["as-name"]}>
          {(f) => (
            <Input
              {...f}
              value={name}
              autoComplete="off"
              onChange={(e) => {
                setName(e.target.value);
                setServerError(undefined);
              }}
            />
          )}
        </FormField>
        <FormField label="PFMS Scheme Code (Optional)" id="as-code" error={shown["as-code"]} hint="Leave blank until PFMS allots it.">
          {(f) => <Input {...f} inputMode="numeric" autoComplete="off" maxLength={5} value={code} onChange={(e) => setCode(e.target.value)} />}
        </FormField>
        <FormField label="DDO" id="as-ddo" required error={shown["as-ddo"]} hint="The DDO that pays this scheme's grants.">
          {(f) => (
            <Select
              {...f}
              value={ddo}
              onChange={(e) => setDdo(e.target.value)}
              placeholder="Choose a DDO"
              options={masters.ddos.map((d) => ({ value: d.code, label: `${d.code} — ${d.name}${d.eBillActive ? "" : " (e-Bill not active)"}`, disabled: !d.eBillActive }))}
            />
          )}
        </FormField>
      </div>
    </Modal>
  );
}

/* ── Add a head ─────────────────────────────────────────────────────────── */

function AddHeadDialog({ cfg, masters, onClose }: { cfg: SchemePfmsConfig; masters: Masters; onClose: () => void }) {
  const { setSchemeHeads } = usePfms();
  const { toast } = useToast();
  const [head, setHead] = React.useState<HeadOfAccount>({ functionHead: "", objectHead: "", category: "", grantNumber: "" });
  const [tried, setTried] = React.useState(false);
  const name = schemeTitle(cfg);

  const errors: Record<string, string> = {};
  if (!head.functionHead) errors["ah-function"] = "Choose the Function Head.";
  if (!head.objectHead) errors["ah-object"] = "Choose the Object Head.";
  if (!head.category) errors["ah-category"] = "Choose the Category.";
  if (!head.grantNumber) errors["ah-grant"] = "Choose the Grant Number.";
  if (Object.keys(errors).length === 0 && cfg.heads.some((h) => sameHead(head, h))) errors["ah-function"] = "This head of account is already configured for the scheme.";
  const shown = tried ? errors : {};
  const summary = Object.entries(shown).map(([fieldId, message]) => ({ fieldId, message }));
  const set = (k: keyof HeadOfAccount) => (e: React.ChangeEvent<HTMLSelectElement>) => setHead((h) => ({ ...h, [k]: e.target.value }));
  const opts = (list: readonly { code: string; label: string }[], fmt: (c: string) => string = (c) => c) => list.map((i) => ({ value: i.code, label: `${fmt(i.code)} — ${i.label}` }));

  const save = () => {
    setTried(true);
    if (Object.keys(errors).length > 0) return;
    const res = setSchemeHeads(cfg.schemeCode, [...cfg.heads, head]);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Head of account added to ${name}.`, "success");
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
          {(f) => <Select {...f} value={head.functionHead} onChange={set("functionHead")} placeholder="Choose a Function Head" options={opts(masters.functionHeads, formatFunctionHead)} />}
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

/* ── Maker and Checker for one DDO (BR-DSC-001, §10) ───────────────────── */

function EditDesignationDialog({ rows, ddoCode, onClose }: { rows: CheckerRow[]; ddoCode: string; onClose: () => void }) {
  const { setDesignation } = usePfms();
  const { toast } = useToast();
  const [ddo, setDdo] = React.useState(ddoCode);
  const row = rows.find((r) => r.ddoCode === ddo);
  const [maker, setMaker] = React.useState<RoleId | "">(row?.maker ?? "");
  const [checker, setChecker] = React.useState<RoleId | "">(row?.checker ?? "");
  const [serial, setSerial] = React.useState(row?.certificateSerial ?? "");
  const [expires, setExpires] = React.useState(row?.certificateExpires ?? "");
  const [tried, setTried] = React.useState(false);

  const pick = (code: string) => {
    const r = rows.find((x) => x.ddoCode === code);
    setDdo(code);
    setMaker(r?.maker ?? "");
    setChecker(r?.checker ?? "");
    setSerial(r?.certificateSerial ?? "");
    setExpires(r?.certificateExpires ?? "");
  };

  // The Maker/Checker clash is shown the moment it happens, not only on save: it is the one rule
  // the officer choosing names needs to see while choosing.
  const errors: Record<string, string> = {};
  if (tried && !ddo) errors["dg-ddo"] = "Choose the DDO.";
  if (tried && !maker) errors["dg-maker"] = "Choose the Maker.";
  if (tried && !checker) errors["dg-checker"] = "Choose the Checker.";
  if (maker && maker === checker) errors["dg-checker"] = "The Checker must be a different officer from the Maker.";
  if (tried && !serial.trim()) errors["dg-serial"] = "Enter the serial number of the Checker's certificate.";
  if (tried && !expires) errors["dg-expires"] = "Enter the date the certificate expires.";
  const summary = tried ? Object.entries(errors).map(([fieldId, message]) => ({ fieldId, message })) : [];
  const dirty = !!row && (maker !== row.maker || checker !== row.checker || serial !== row.certificateSerial || expires !== row.certificateExpires);
  const options = OFFICERS.map((id) => ({ value: id, label: officer(id) }));

  const save = () => {
    setTried(true);
    if (!ddo || !maker || !checker || maker === checker || !serial.trim() || !expires) return;
    const res = setDesignation(ddo, { maker, checker, certificateSerial: serial.trim().toUpperCase(), certificateExpires: expires });
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Maker and Checker saved for ${row?.ddoName ?? ddo}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={ddoCode ? "Edit Maker and Checker" : "Change a Checker"}
      size="md"
      dirty={dirty}
      footer={
        <>
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save Designation</Button>
        </>
      }
    >
      <div className="space-y-4">
        {ddoCode && row ? (
          <DescriptionList
            size="sm"
            columns={2}
            items={[
              { term: "DDO", value: `${row.ddoName} (${row.ddoCode})` },
              { term: "Last Designated", value: `${formatDateTime(row.designatedAt)} by ${ROLES[row.designatedBy].personName}` },
            ]}
          />
        ) : null}
        {summary.length > 0 && <ErrorSummary errors={summary} headingLevel={3} />}
        {!ddoCode && (
          <FormField label="DDO" id="dg-ddo" required error={errors["dg-ddo"]}>
            {(f) => <Select {...f} value={ddo} onChange={(e) => pick(e.target.value)} placeholder="Choose a DDO" options={rows.map((r) => ({ value: r.ddoCode, label: `${r.ddoCode} — ${r.ddoName}` }))} />}
          </FormField>
        )}
        <FormField label="Maker" id="dg-maker" required error={errors["dg-maker"]} hint="Prepares the payment advice.">
          {(f) => <Select {...f} value={maker} onChange={(e) => setMaker(e.target.value as RoleId)} placeholder="Choose the Maker" options={options} />}
        </FormField>
        <FormField label="Checker" id="dg-checker" required error={errors["dg-checker"]} hint="Authorises and digitally signs the payment advice.">
          {(f) => <Select {...f} value={checker} onChange={(e) => setChecker(e.target.value as RoleId)} placeholder="Choose the Checker" options={options} />}
        </FormField>
        <FormField label="Certificate Serial Number" id="dg-serial" required error={errors["dg-serial"]} hint="The serial number of the Checker's signing certificate.">
          {(f) => <Input {...f} autoComplete="off" value={serial} onChange={(e) => setSerial(e.target.value)} />}
        </FormField>
        <DatePicker id="dg-expires" label="Certificate Expiry Date" required value={expires} onChange={setExpires} error={errors["dg-expires"]} invalid={!!errors["dg-expires"]} />
      </div>
    </Modal>
  );
}
