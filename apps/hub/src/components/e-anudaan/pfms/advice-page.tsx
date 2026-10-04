"use client";

/**
 * The payment advice on ONE PAGE — the Maker's workspace and, once it has left the Maker, the
 * read-only record of what was sent.
 *
 * Drawn after the Programme Division's review (handoff file, Officers · Paying Grants through PFMS,
 * PD Maker / Payment Advice / Fresh Case · With Errors · Returned by PFMS · With the Checker,
 * 3 Oct 2026). Five sections in the order PFMS needs the data — Sanction, Where the Bill Lands,
 * Head of Account, Beneficiary, Supporting Documents — in one panel. It replaced a five-step wizard:
 * three choices and four documents do not need five steps. That departs from BRD NFR §6.5, which
 * asks for a wizard, and waits for NeGD's acceptance (handoff page §5h).
 *
 * What stayed is everything the wizard checked: every message is `validateAdvice()`'s, keyed to the
 * field it is about, so the summary above the panel and the message at the field are one sentence;
 * the bill number follows the DDO; documents are fingerprinted in the browser and never uploaded.
 *
 * DS Audit: PageHeader ✅ (status beside the title, added for this) · FormPanel ✅ · SectionTitle ✅ ·
 * DescriptionList ✅ · DataTable ✅ (total row, added for this) · Select ✅ · FormField ✅ · Input ✅ ·
 * NumberInput ✅ · DatePicker ✅ · Accordion ✅ · Modal ✅ · ErrorSummary ✅ · Alert ✅ · Badge ✅ ·
 * Button ✅ · Icon ✅ · useToast ✅ — composed.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Button,
  DataTable,
  DatePicker,
  DescriptionList,
  ErrorSummary,
  FormField,
  FormPanel,
  Icon,
  Input,
  Modal,
  NumberInput,
  PageHeader,
  SectionTitle,
  Select,
  buttonClasses,
  useToast,
  type DataTableColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { formatDate, formatDateTime } from "@/lib/e-anudaan/format";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { DOCUMENT_TYPES, REMARKS_MAX, everyAdvice, isEditable, netOf, nextBillNumber, requiredDocTypes, sumHeads, validateAdvice } from "@/lib/e-anudaan/pfms/advice";
import { configFor, labelOf } from "@/lib/e-anudaan/pfms/masters";
import { sanctionFacts } from "@/lib/e-anudaan/pfms/selectors";
import { STAGE_INFO, latestRequest, returnedBy, stageOf, type AnyStage } from "@/lib/e-anudaan/pfms/stages";
import { pfmsError } from "@/lib/e-anudaan/pfms/errors";
import type { AdviceDocument, AdviceHeader, BeneficiaryLine, DocumentTypeCode, HeadLine, LandingStatus, PaymentAdvice } from "@/lib/e-anudaan/pfms/types";
import { RefText } from "@/components/e-anudaan/worklist-table";
import { SanctionFactsList } from "./advice-summary";
import { SourceTag, StageBadge, exact, fixedCodesLine } from "./payment-ui";

const QUEUE = "/portals/e-anudaan/dashboard/payments/prepare";

/** The names the documents table uses — the sanction ORDER and the PAO's pass order, as the screen reads. */
const DOC_NAME: Record<DocumentTypeCode, string> = { ...DOCUMENT_TYPES, 2: "Sanction Order", 5: "PAO Pass Order" };

/** Where a document is first needed, as BR-DOC-001 escalates it with where the sanction lands. */
function whenNeeded(type: DocumentTypeCode, landing: LandingStatus): string {
  if (requiredDocTypes(landing).includes(type)) return "Now";
  if (type === 4) return "At the DDO stage";
  if (type === 5) return "At the PAO stage";
  return "Optional";
}

/** The stage a payment advice's own badge names while it is still the Maker's. */
function badgeStage(advice: PaymentAdvice): AnyStage {
  switch (advice.state) {
    case "returned":
      return "returned-by-checker";
    case "not-accepted":
      return "not-accepted";
    case "returned-pfms":
      return "returned-by-pfms";
    case "draft":
      return "in-preparation";
    default:
      return stageOf(advice);
  }
}

/** One numbered section of the panel, with where its values came from at its right. */
function AdviceSection({ n, title, source, children }: { n: number; title: string; source?: string; children: React.ReactNode }) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className="space-y-4 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <SectionTitle as={3} headingId={id} title={`${n} · ${title}`}>
        {source ? <SourceTag>{source}</SourceTag> : null}
      </SectionTitle>
      {children}
    </section>
  );
}

/* ── The page ─────────────────────────────────────────────────────────────── */

export function AdvicePage({ advice, canEdit }: { advice: PaymentAdvice; canEdit: boolean }) {
  const { toast } = useToast();
  const { state } = useEAnudaan();
  const { pfms, saveAdvice, submit, now } = usePfms();
  const app = state.applications.find((a) => a.id === advice.appId)!;
  const facts = sanctionFacts(pfms, app)!;
  const config = configFor(pfms.configs, advice.schemeCode);
  const editable = canEdit && isEditable(advice);
  const ngoName = state.ngos.find((n) => n.id === app.ngoId)?.name ?? app.ngoId;

  const [draft, setDraft] = React.useState(() => ({ header: advice.header, heads: advice.heads, beneficiaries: advice.beneficiaries, documents: advice.documents }));
  // A locked advice always shows what was sent; an editable one shows the Maker's work over it.
  const working: PaymentAdvice = editable ? { ...advice, ...draft } : advice;
  const issues = validateAdvice(working, { masters: pfms.masters, configs: pfms.configs, now: now() });
  // A returned or refused advice opens with its problems already showing; a draft shows them after a first try.
  const [tried, setTried] = React.useState(advice.state === "returned" || advice.state === "not-accepted" || advice.state === "returned-pfms");
  const shown = editable && tried ? issues.filter((i) => i.field !== "hdr-scheme" && i.field !== "hdr-masters") : [];
  const issue = (field: string) => shown.find((i) => i.field === field)?.message;
  const summaryRef = React.useRef<HTMLDivElement>(null);
  // Each failed submit re-opens any collapsed section holding a field the summary links to.
  const [attempt, setAttempt] = React.useState(0);

  const persist = () => {
    const res = saveAdvice(advice.appId, draft);
    if (!res.ok) toast(res.error, "error");
    else if (res.advice) setDraft((d) => ({ ...d, header: res.advice!.header }));
    return res.ok;
  };

  const router = useRouter();
  const doSubmit = () => {
    if (!persist()) return;
    const res = submit(advice.appId);
    if (!res.ok) {
      setTried(true);
      setAttempt((n) => n + 1);
      toast(res.error, "error");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    toast(`Payment advice ${advice.id} submitted to the Checker.`, "success");
    router.push(QUEUE);
  };

  const ddo = pfms.masters.ddos.find((d) => d.code === working.header.ddoCode);
  const req = latestRequest(advice);
  const replaced = advice.requests.length === 0 ? advice.earlier?.at(-1) : undefined;
  const pageLevel = editable ? issues.filter((i) => i.field === "hdr-scheme" || i.field === "hdr-masters") : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={ngoName}
        status={<StageBadge stage={badgeStage(advice)} />}
        meta={
          <span className="block space-y-1">
            <span className="block text-body-2 text-ink">
              {projectTitleFor(state, app)} · {schemeLabel(app.schemeCode)} · FY {app.financialYear}
            </span>
            <span className="block text-body-3 text-ink-muted">
              Application No. <RefText value={app.id} className="text-ink" /> · Project ID {app.institutionId}
            </span>
          </span>
        }
        actions={
          editable ? (
            <Button
              appearance="outlined"
              size="sm"
              iconLeft={<Icon name="save" size={16} aria-hidden />}
              onClick={() => {
                if (persist()) toast(`Saved as a draft at ${formatDateTime(now())}.`, "success");
              }}
            >
              Save as Draft
            </Button>
          ) : undefined
        }
      />

      {pageLevel.map((i) => (
        <Alert key={i.field} status="warning" title={i.field === "hdr-scheme" ? "Scheme Code Awaited" : "Master Data Out of Date"}>
          {i.message}
        </Alert>
      ))}

      <FormPanel
        title="Payment Advice"
        footer={
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <Link href={QUEUE} className={buttonClasses("primary", "outlined", "md", "whitespace-nowrap")} onClick={() => editable && persist()}>
              <Icon name="arrow_back" size={16} aria-hidden /> Back to Payment Advices
            </Link>
            {editable && (
              <Button iconRight={<Icon name="arrow_forward" size={16} aria-hidden />} onClick={doSubmit}>
                Submit for Authorisation
              </Button>
            )}
          </div>
        }
      >
        <StateNotice advice={advice} editable={editable} />
        {replaced && (
          <Alert status="info" title="A Fresh Payment Advice">
            Replaces {replaced.id}, which ended as {STAGE_INFO[stageOf(replaced)].label}.
          </Alert>
        )}
        {shown.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} className="outline-none">
            <ErrorSummary
              title={`${shown.length === 1 ? "1 Thing" : `${shown.length} Things`} to Fix Before You Can Submit`}
              errors={shown.map((i) => ({ fieldId: i.field, message: i.message }))}
              headingLevel={3}
            />
          </div>
        )}

        <SanctionSection advice={advice} facts={facts} pfmsSchemeCode={config?.pfmsSchemeCode ?? null} />

        <AdviceSection n={2} title="Where the Bill Lands">
          {editable ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="DDO Code" id="hdr-ddo" required error={ddo && !ddo.eBillActive ? undefined : issue("hdr-ddo")}>
                {(c) => (
                  <Select
                    {...c}
                    invalid={(ddo && !ddo.eBillActive) || !!issue("hdr-ddo")}
                    value={draft.header.ddoCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setDraft((d) => ({
                        ...d,
                        // The bill number belongs to the DDO's own series (FR-PDM-005).
                        header: { ...d.header, ddoCode: code, pdCode: "", billNumber: code ? nextBillNumber(everyAdvice(pfms.advices).filter((a) => a.id !== advice.id), code, advice.financialYear) : "" },
                      }));
                    }}
                  >
                    <option value="">Select the DDO</option>
                    {pfms.masters.ddos
                      .filter((d) => config?.ddoCodes.includes(d.code))
                      .map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.code} — {d.name}
                        </option>
                      ))}
                  </Select>
                )}
              </FormField>
              <FormField label="PD Code" id="hdr-pd" required error={issue("hdr-pd")}>
                {(c) => (
                  <Select {...c} value={draft.header.pdCode} disabled={!draft.header.ddoCode} onChange={(e) => setDraft((d) => ({ ...d, header: { ...d.header, pdCode: e.target.value } }))}>
                    <option value="">Select the code</option>
                    {pfms.masters.pdCodes
                      .filter((p) => p.ddoCode === draft.header.ddoCode)
                      .map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.code} — {p.label}
                        </option>
                      ))}
                  </Select>
                )}
              </FormField>
            </div>
          ) : null}
          {editable && ddo && !ddo.eBillActive && (
            <Alert status="error" title={`DDO ${ddo.code} Is Not Active for e-Bills`}>
              Choose another DDO, or ask the Bureau to activate this one.
            </Alert>
          )}
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              ...(!editable
                ? [
                    { term: "DDO Code", value: ddo ? `${ddo.code} — ${ddo.name}` : "Not chosen" },
                    { term: "PD Code", value: working.header.pdCode ? `${working.header.pdCode} — ${labelOf(pfms.masters.pdCodes, working.header.pdCode)}` : "Not chosen" },
                  ]
                : []),
              {
                term: "Bill Number and Date",
                value: working.header.billNumber ? (
                  <span id="hdr-bill-number">
                    {working.header.billNumber}
                    {working.header.billDate ? ` · ${formatDate(working.header.billDate)}` : ""}
                  </span>
                ) : (
                  <span id="hdr-bill-number" className="text-ink-muted">
                    Generated when the DDO is chosen
                  </span>
                ),
              },
              ...(req ? [{ term: "Previous Unique Identifier", value: <span className="font-mono">{req.uniqueIdentifier}</span> }] : []),
              { term: "Fixed Codes", value: fixedCodesLine(working), wide: !req },
            ]}
          />
        </AdviceSection>

        <HeadsSection
          allowed={config?.heads ?? []}
          heads={working.heads}
          editable={editable}
          sanctionAmount={advice.sanctionAmount}
          onChange={(heads) => setDraft((d) => ({ ...d, heads }))}
          header={working.header}
          onHeaderChange={(header) => setDraft((d) => ({ ...d, header }))}
          issue={issue}
          tried={tried}
        />

        <BeneficiarySection
          beneficiaries={working.beneficiaries}
          editable={editable}
          header={working.header}
          onChange={(beneficiaries) => setDraft((d) => ({ ...d, beneficiaries }))}
          onHeaderChange={(header) => setDraft((d) => ({ ...d, header }))}
          issue={issue}
          attempt={attempt}
        />

        <DocumentsSection
          documents={working.documents}
          editable={editable}
          landing={ddo?.landing ?? "Approved"}
          returnReason={advice.state === "returned-pfms" ? req?.returnReason : undefined}
          returnedAt={advice.state === "returned-pfms" ? req?.statusAt : undefined}
          onChange={(documents) => setDraft((d) => ({ ...d, documents }))}
          issue={issue}
        />
      </FormPanel>
    </div>
  );
}

/* ── The one line that says where the advice stands ─────────────────────── */

function StateNotice({ advice, editable }: { advice: PaymentAdvice; editable: boolean }) {
  const { pfms } = usePfms();
  const req = latestRequest(advice);
  if (advice.state === "returned-pfms") {
    return (
      <Alert status="warning" title={`Returned by PFMS on ${req?.statusAt ? formatDate(req.statusAt) : ""}`}>
        Returned by the {returnedBy(req)}. Reason: {req?.returnReason}
      </Alert>
    );
  }
  if (advice.state === "returned" && advice.checkerRemark) {
    return (
      <Alert status="warning" title="Returned by the Checker">
        {advice.checkerRemark}
      </Alert>
    );
  }
  if (advice.state === "not-accepted") {
    return (
      <Alert status="error" title="Not Accepted by PFMS">
        {advice.issues.map((i) => (
          <span key={i.pfmsCode ?? i.field} className="block">
            {pfmsError(i.pfmsCode ?? "", pfms.errorOverrides).message}
          </span>
        ))}
      </Alert>
    );
  }
  if (editable) return null;
  const stage = stageOf(advice);
  if (stage === "awaiting-authorisation") {
    return (
      <Alert status="info" title="With the Checker">
        Since {advice.submittedAt ? formatDateTime(advice.submittedAt) : formatDateTime(advice.updatedAt)}.
      </Alert>
    );
  }
  return (
    <Alert status={STAGE_INFO[stage].tone === "danger" ? "error" : "info"} title={STAGE_INFO[stage].label}>
      {STAGE_INFO[stage].holder === "—" ? "This advice can no longer be changed." : `With the ${STAGE_INFO[stage].holder}.`}
    </Alert>
  );
}

/* ── 1 · Sanction ─────────────────────────────────────────────────────────── */

function SanctionSection({ advice, facts, pfmsSchemeCode }: { advice: PaymentAdvice; facts: NonNullable<ReturnType<typeof sanctionFacts>>; pfmsSchemeCode: string | null }) {
  const [all, setAll] = React.useState(false);
  return (
    <AdviceSection n={1} title="Sanction" source="From Sanction Order">
      {all ? (
        <SanctionFactsList facts={facts} />
      ) : (
        <DescriptionList
          columns={2}
          size="sm"
          items={[
            { term: "Sanction Number", value: facts.orderNo },
            { term: "Sanction Amount", value: exact(advice.sanctionAmount) },
            { term: "Financial Year", value: facts.financialYear },
            { term: "Scheme", value: `${schemeLabel(facts.schemeCode)} · ${pfmsSchemeCode ? `PFMS scheme code ${pfmsSchemeCode}` : "PFMS scheme code awaited"}` },
          ]}
        />
      )}
      <div>
        <Button appearance="outlined" size="sm" aria-expanded={all} onClick={() => setAll((v) => !v)}>
          {all ? "Show Fewer Sanction Details" : "Show All Sanction Details"}
        </Button>
      </div>
    </AdviceSection>
  );
}

/* ── 3 · Head of Account ──────────────────────────────────────────────────── */

type HeadRow = HeadLine & Record<string, unknown>;

function HeadsSection({
  allowed,
  heads,
  editable,
  sanctionAmount,
  onChange,
  header,
  onHeaderChange,
  issue,
  tried,
}: {
  allowed: readonly Pick<HeadLine, "functionHead" | "objectHead" | "category" | "grantNumber">[];
  heads: HeadLine[];
  editable: boolean;
  sanctionAmount: number;
  onChange: (h: HeadLine[]) => void;
  header: AdviceHeader;
  onHeaderChange: (h: AdviceHeader) => void;
  issue: (field: string) => string | undefined;
  tried: boolean;
}) {
  const { pfms } = usePfms();
  const [editing, setEditing] = React.useState<{ index: number; head: HeadLine } | null>(null);
  const m = pfms.masters;
  const total = sumHeads(heads);
  const left = sanctionAmount - total;
  const coded = (list: { code: string; label: string }[], code: string | undefined) => (code ? `${code} · ${labelOf(list, code)}` : "—");
  const headIssue = heads.map((_, i) => ["function", "object", "category", "grant", "amount"].map((k) => issue(`head-${i}-${k}`)).find(Boolean)).find(Boolean);

  const columns: DataTableColumn<HeadRow>[] = [
    { key: "functionHead", header: "Function Head", render: (h) => coded(m.functionHeads, h.functionHead) },
    { key: "objectHead", header: "Object Head", render: (h) => coded(m.objectHeads, h.objectHead) },
    { key: "category", header: "Category", render: (h) => coded(m.categories, h.category) },
    { key: "grantNumber", header: "Grant Number", render: (h) => coded(m.grantNumbers, h.grantNumber) },
    { key: "amount", header: "Amount", align: "end", render: (h) => <span className="whitespace-nowrap">{exact(h.amount)}</span> },
    ...(editable
      ? [
          {
            key: "edit",
            header: "Action",
            align: "end" as const,
            render: (h: HeadRow) => {
              const i = heads.findIndex((x) => x.id === h.id);
              return (
                <Button appearance="text" size="sm" onClick={() => setEditing({ index: i, head: heads[i]! })} aria-label={`Edit head of account ${i + 1}`}>
                  Edit
                </Button>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <AdviceSection n={3} title="Head of Account">
      <DataTable<HeadRow>
        columns={columns}
        data={heads as HeadRow[]}
        total={heads.length}
        caption="Heads of account for this payment"
        emptyLabel="No head of account added yet."
        footer={{
          functionHead: "Total",
          grantNumber:
            left === 0 ? (
              <Badge status="success" size="sm">Matches the sanction</Badge>
            ) : (
              <Badge status="danger" size="sm">
                {left > 0 ? `${exact(left)} short of the sanction` : `${exact(-left)} over the sanction`}
              </Badge>
            ),
          amount: <span className="whitespace-nowrap">{exact(total)}</span>,
        }}
      />
      {editable && (
        <div>
          <Button appearance="outlined" size="sm" iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => setEditing({ index: heads.length, head: { id: `h-${Date.now()}`, functionHead: "", objectHead: "", category: "", grantNumber: "", amount: 0 } })}>
            Add Another Head
          </Button>
        </div>
      )}
      {editable && (left !== 0 || (tried && headIssue)) && (
        <div id="heads-total" tabIndex={-1} className="outline-none">
          <Alert status="error" title={left === 0 ? "A Head of Account Needs Attention" : "Heads Do Not Add Up to the Sanction"}>
            {left === 0 ? headIssue : `${exact(total)} of ${exact(sanctionAmount)} allocated. ${left > 0 ? `Add ${exact(left)} to a head.` : `Remove ${exact(-left)} from a head.`}`}
          </Alert>
        </div>
      )}
      {editable && heads.some((h) => h.objectHead === "33") && (
        <div className="max-w-md">
          <FormField label="CNA Exception Reason" id="hdr-cna" required error={issue("hdr-cna")}>
            {(c) => (
              <Select {...c} value={header.cnaExceptionReason} onChange={(e) => onHeaderChange({ ...header, cnaExceptionReason: e.target.value as AdviceHeader["cnaExceptionReason"] })}>
                <option value="">Select</option>
                <option value="01">01 — Payment to a non-CNA entity</option>
                <option value="02">02 — Statutory payment</option>
                <option value="03">03 — Other, as approved</option>
              </Select>
            )}
          </FormField>
        </div>
      )}
      {editing && (
        <HeadDialog
          allowed={allowed}
          initial={editing.head}
          isNew={editing.index >= heads.length}
          onClose={() => setEditing(null)}
          onRemove={heads.length > 1 && editing.index < heads.length ? () => (onChange(heads.filter((_, j) => j !== editing.index)), setEditing(null)) : undefined}
          onSave={(h) => {
            onChange(editing.index >= heads.length ? [...heads, h] : heads.map((x, j) => (j === editing.index ? h : x)));
            setEditing(null);
          }}
        />
      )}
    </AdviceSection>
  );
}

/** One head of account, chosen part by part so only combinations the Bureau configured can be built. */
function HeadDialog({
  allowed,
  initial,
  isNew,
  onClose,
  onSave,
  onRemove,
}: {
  allowed: readonly Pick<HeadLine, "functionHead" | "objectHead" | "category" | "grantNumber">[];
  initial: HeadLine;
  isNew: boolean;
  onClose: () => void;
  onSave: (h: HeadLine) => void;
  onRemove?: () => void;
}) {
  const { pfms } = usePfms();
  const [h, setH] = React.useState(initial);
  const m = pfms.masters;
  const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))];
  const fns = uniq(allowed.map((a) => a.functionHead));
  const objs = uniq(allowed.filter((a) => a.functionHead === h.functionHead).map((a) => a.objectHead));
  const cats = uniq(allowed.filter((a) => a.functionHead === h.functionHead && a.objectHead === h.objectHead).map((a) => a.category));
  const grants = uniq(allowed.filter((a) => a.functionHead === h.functionHead && a.objectHead === h.objectHead && a.category === h.category).map((a) => a.grantNumber));
  const complete = !!(h.functionHead && h.objectHead && h.category && h.grantNumber && h.amount > 0);
  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Add a Head of Account" : "Edit Head of Account"}
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          {onRemove ? (
            <Button appearance="text" variant="danger" size="sm" iconLeft={<Icon name="delete" size={16} aria-hidden />} onClick={onRemove}>
              Remove This Head
            </Button>
          ) : (
            <span />
          )}
          <span className="flex gap-3">
            <Button appearance="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(h)} disabled={!complete}>
              {isNew ? "Add Head" : "Save Head"}
            </Button>
          </span>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["Function Head", "functionHead", fns, m.functionHeads, { objectHead: "", category: "", grantNumber: "" }],
            ["Object Head", "objectHead", objs, m.objectHeads, { category: "", grantNumber: "" }],
            ["Category", "category", cats, m.categories, { grantNumber: "" }],
            ["Grant Number", "grantNumber", grants, m.grantNumbers, {}],
          ] as const
        ).map(([label, prop, opts, list, reset], k) => (
          <FormField key={prop} label={label} id={`dlg-head-${prop}`} required>
            {(c) => (
              <Select {...c} value={h[prop] ?? ""} disabled={k > 0 && !h[(["functionHead", "objectHead", "category"] as const)[k - 1]!]} onChange={(e) => setH({ ...h, ...reset, [prop]: e.target.value })}>
                <option value="">Select</option>
                {opts.map((o) => (
                  <option key={o} value={o}>
                    {o} — {labelOf(list, o)}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
        ))}
        <NumberInput id="dlg-head-amount" label="Amount" required prefix="₹" min={0} value={h.amount || null} onValueChange={(v) => setH({ ...h, amount: v ?? 0 })} />
      </div>
    </Modal>
  );
}

/* ── 4 · Beneficiary ──────────────────────────────────────────────────────── */

function BeneficiarySection({
  beneficiaries,
  editable,
  header,
  onChange,
  onHeaderChange,
  issue,
  attempt,
}: {
  beneficiaries: BeneficiaryLine[];
  editable: boolean;
  header: AdviceHeader;
  onChange: (b: BeneficiaryLine[]) => void;
  onHeaderChange: (h: AdviceHeader) => void;
  issue: (field: string) => string | undefined;
  attempt: number;
}) {
  const { pfms } = usePfms();
  const m = pfms.masters;
  const set = (i: number, patch: Partial<BeneficiaryLine>) => onChange(beneficiaries.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const setDed = (i: number, k: number, patch: Partial<HeadLine>) => set(i, { deductions: beneficiaries[i]!.deductions.map((d, j) => (j === k ? { ...d, ...patch } : d)) });
  const source = beneficiaries.some((b) => b.source === "bureau") ? "Entered by the Bureau" : "From the Application";
  return (
    <AdviceSection n={4} title="Beneficiary" source={source}>
      {beneficiaries.map((b, i) => (
        <div key={b.id} className="space-y-4">
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              { term: "Payee — Name as per PFMS", value: <span id={`ben-${i}-payee`}>{b.name} · {b.payeeCode}</span> },
              { term: "Account Number · IFSC", value: <span id={`ben-${i}-ifsc`}>XXXX XXXX {b.accountLast4} · {b.ifsc} · {b.bank}</span> },
              { term: "Amount Payable", value: exact(netOf(b)) },
              { term: "Payee Remarks", value: b.remarks || <span className="text-ink-muted">Not entered</span> },
              { term: "Claim Reference Number", value: b.claimReference ?? <span className="text-ink-muted">Drawn from the PFMS pool when you submit</span> },
            ]}
          />
          {(issue(`ben-${i}-payee`) || issue(`ben-${i}-ifsc`)) && (
            <Alert status="error" title="The Payee's Details Need Correcting">
              {issue(`ben-${i}-payee`) ?? issue(`ben-${i}-ifsc`)}
            </Alert>
          )}
          {editable && (
            <Accordion variant="flush">
              <AccordionItem key={attempt} title="More Options — Deductions and Not Payable Before" defaultOpen={!!(issue(`ben-${i}-gross`) || issue(`ben-${i}-remarks`) || b.deductions.length)}>
                <div className="space-y-5 pt-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <NumberInput id={`ben-${i}-gross`} label="Gross Amount" required prefix="₹" min={0} value={b.gross || null} error={issue(`ben-${i}-gross`)} onValueChange={(v) => set(i, { gross: v ?? 0 })} />
                    <FormField label="Payee Remarks" id={`ben-${i}-remarks`} required error={issue(`ben-${i}-remarks`)} characterCount={{ value: b.remarks, maxLength: REMARKS_MAX }}>
                      {(c) => <Input {...c} value={b.remarks} maxLength={REMARKS_MAX} onChange={(e) => set(i, { remarks: e.target.value })} />}
                    </FormField>
                  </div>
                  {b.deductions.map((d, k) => (
                    <div key={d.id} className="space-y-3 rounded-md border border-line p-4">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {(
                          [
                            ["function", "Function Head", "functionHead", m.functionHeads],
                            ["object", "Object Head", "objectHead", m.objectHeads],
                            ["category", "Category", "category", m.categories],
                            ["grant", "Grant Number", "grantNumber", m.grantNumbers],
                          ] as const
                        ).map(([key, label, prop, list]) => (
                          <FormField key={key} label={label} id={`ben-${i}-ded-${k}-${key}`} required error={key === "function" ? issue(`ben-${i}-ded-${k}-function`) : undefined}>
                            {(c) => (
                              <Select {...c} value={d[prop] ?? ""} onChange={(e) => setDed(i, k, { [prop]: e.target.value })}>
                                <option value="">Select</option>
                                {list.map((o) => (
                                  <option key={o.code} value={o.code}>
                                    {o.code} — {o.label}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </FormField>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="max-w-xs">
                          <NumberInput id={`ben-${i}-ded-${k}-amount`} label="Deduction Amount" required prefix="₹" min={0} value={d.amount || null} error={issue(`ben-${i}-ded-${k}-amount`)} onValueChange={(v) => setDed(i, k, { amount: v ?? 0 })} />
                        </div>
                        <Button size="sm" appearance="text" variant="danger" iconLeft={<Icon name="delete" size={16} aria-hidden />} onClick={() => set(i, { deductions: b.deductions.filter((_, j) => j !== k) })}>
                          Remove Deduction
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-end gap-6">
                    <Button
                      size="sm"
                      appearance="outlined"
                      iconLeft={<Icon name="add" size={16} aria-hidden />}
                      onClick={() => set(i, { deductions: [...b.deductions, { id: `${b.id}-d${b.deductions.length + 1}`, functionHead: "", objectHead: "", category: "", grantNumber: "", amount: 0 }] })}
                    >
                      Add a Deduction
                    </Button>
                    {i === 0 && (
                      <div className="max-w-sm">
                        <DatePicker id="hdr-npb" label="Not Payable Before (Optional)" value={header.npbDate} min={header.billDate} error={issue("hdr-npb")} onChange={(v) => onHeaderChange({ ...header, npbDate: v })} />
                      </div>
                    )}
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      ))}
      {issue("ben-total") && (
        <div id="ben-total" tabIndex={-1} className="outline-none">
          <Alert status="error" title="Gross Amount Does Not Equal the Sanction">
            {issue("ben-total")}
          </Alert>
        </div>
      )}
    </AdviceSection>
  );
}

/* ── 5 · Supporting Documents ─────────────────────────────────────────────── */

/** SHA-256 of the file's bytes, Base64 — computed in the browser; the file itself never leaves (FR-DOC-001). */
async function sha256Base64(dataUrl: string): Promise<{ hash: string; bytes: number }> {
  const b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  let s = "";
  digest.forEach((x) => (s += String.fromCharCode(x)));
  return { hash: btoa(s), bytes: bytes.length };
}

/** The uploaded file's record: its fingerprint and a single-use link valid for seven days (FR-DOC-002). */
function uploadedDocument(type: DocumentTypeCode, name: string, hash: string, bytes: number): AdviceDocument {
  const at = Date.now();
  return {
    id: `doc-${at}`,
    type,
    name,
    sizeKb: Math.max(1, Math.round(bytes / 1024)),
    hash,
    uploadedAt: new Date(at).toISOString(),
    viewLink: { token: hash.replace(/[^A-Za-z0-9]/g, "").slice(0, 16), expiresAt: new Date(at + 7 * 86_400_000).toISOString(), used: false },
  };
}

interface DocRow extends Record<string, unknown> {
  id: string;
  type: DocumentTypeCode;
  doc?: AdviceDocument;
}

function DocumentsSection({
  documents,
  editable,
  landing,
  returnReason,
  returnedAt,
  onChange,
  issue,
}: {
  documents: AdviceDocument[];
  editable: boolean;
  landing: LandingStatus;
  returnReason?: string;
  returnedAt?: string;
  onChange: (d: AdviceDocument[]) => void;
  issue: (field: string) => string | undefined;
}) {
  const [busy, setBusy] = React.useState<DocumentTypeCode | null>(null);
  const [failed, setFailed] = React.useState<string | null>(null);
  const inputs = React.useRef<Partial<Record<string, HTMLInputElement | null>>>({});
  const latest = (t: DocumentTypeCode) => [...documents].reverse().find((d) => d.type === t);
  const rows: DocRow[] = [
    ...([1, 2, 3, 4, 5] as const).map((t) => ({ id: `t-${t}`, type: t, doc: latest(t) })),
    ...documents.filter((d) => d.type === 6).map((d) => ({ id: d.id, type: 6 as const, doc: d })),
  ];
  // The document PFMS's return reason names, until the Maker replaces it after the return.
  const flagged = (r: DocRow) => !!returnReason && !!r.doc && returnReason.toLowerCase().includes(DOC_NAME[r.type].toLowerCase()) && (!returnedAt || r.doc.uploadedAt <= returnedAt);

  const add = async (type: DocumentTypeCode, file: File) => {
    setBusy(type);
    setFailed(null);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(String(fr.result));
        fr.onerror = () => rej(fr.error);
        fr.readAsDataURL(file);
      });
      const { hash, bytes } = await sha256Base64(dataUrl);
      const doc = uploadedDocument(type, file.name, hash, bytes);
      onChange([...documents.filter((d) => d.type !== type || type === 6), doc]);
    } catch {
      setFailed(DOC_NAME[type]);
    } finally {
      setBusy(null);
    }
  };
  const picker = (key: string, type: DocumentTypeCode) => (
    <input
      ref={(el) => {
        inputs.current[key] = el;
      }}
      type="file"
      accept="application/pdf"
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) void add(type, f);
      }}
    />
  );

  const status = (r: DocRow) => {
    if (flagged(r)) return <Badge status="danger" size="sm">{returnReason!.toLowerCase().includes("not signed") ? "Not signed" : "Returned by PFMS"}</Badge>;
    if (r.doc) return <Badge status="success" size="sm">Attached</Badge>;
    const when = whenNeeded(r.type, landing);
    if (when === "Now") return <Badge status={issue(`doc-type-${r.type}`) ? "danger" : "warning"} size="sm">Needed now</Badge>;
    return <Badge status="neutral" size="sm">{when === "Optional" ? "Optional" : "Not yet needed"}</Badge>;
  };

  const columns: DataTableColumn<DocRow>[] = [
    { key: "document", header: "Document", render: (r) => <span id={`doc-type-${r.type}`} className="font-semibold">{DOC_NAME[r.type]}</span> },
    { key: "when", header: "When Needed", render: (r) => whenNeeded(r.type, landing) },
    { key: "file", header: "File", render: (r) => (r.doc ? `${r.doc.name} · ${r.doc.sizeKb.toLocaleString("en-IN")} KB` : "—") },
    { key: "status", header: "Status", render: status },
    ...(editable
      ? [
          {
            key: "action",
            header: "Action",
            align: "end" as const,
            render: (r: DocRow) => {
              const when = whenNeeded(r.type, landing);
              if (!r.doc && when !== "Now" && when !== "Optional") return null;
              return (
                <>
                  {picker(r.id, r.type)}
                  <Button appearance="text" size="sm" disabled={busy !== null} onClick={() => inputs.current[r.id]?.click()} aria-label={`${r.doc ? "Replace" : "Attach"} the ${DOC_NAME[r.type]}`}>
                    {r.doc ? "Replace" : "Attach"}
                  </Button>
                </>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <AdviceSection n={5} title="Supporting Documents">
      <div id="doc-list" tabIndex={-1} className="outline-none">
        <DataTable<DocRow> columns={columns} data={rows} total={rows.length} caption="Supporting documents" />
      </div>
      {busy !== null && <p role="status" className="text-body-3 text-ink-muted">Computing the fingerprint…</p>}
      {failed && <p role="alert" className="text-body-3 text-[var(--sa-text-status-error-bolder)]">The fingerprint of the {failed} could not be computed. Attach the file again.</p>}
      {editable && (
        <div>
          {picker("other", 6)}
          <Button appearance="outlined" size="sm" iconLeft={<Icon name="add" size={16} aria-hidden />} disabled={busy !== null} onClick={() => inputs.current.other?.click()}>
            Attach a Document
          </Button>
        </div>
      )}
    </AdviceSection>
  );
}

