"use client";

/**
 * The Maker's four entry steps (Annexure F, in the order the Maker completes them).
 *
 * Every step shows what e-Anudaan already knows as read-only facts with a tag saying where each came
 * from, and asks only for what PFMS additionally needs (BRD §2.4). Messages come from
 * `validateAdvice()` keyed by field id, so an inline message and the error summary above the form
 * are the same sentence.
 *
 * DS Audit: FormField ✅ · Select ✅ · Input ✅ · NumberInput ✅ · DatePicker ✅ · CharacterCount (via
 * FormField) ✅ · DescriptionList ✅ · Card ✅ · SectionTitle ✅ · Alert ✅ · Badge ✅ · Button ✅ ·
 * MediaUpload ✅ · Icon ✅ — composed. The coded head picker is four linked `Select`s; the running
 * total is a `DescriptionList` and an `Alert`. Both stay here until a second portal needs them
 * (plan §3, candidates `CodedAccountHeadField` and `AmountAllocation`).
 */

import * as React from "react";
import { Alert, Badge, Button, Card, CardBody, DatePicker, DescriptionList, FormField, Icon, Input, MediaUpload, NumberInput, SectionTitle, Select } from "@mosje/design-system";
import { formatDate, formatDateTime } from "@/lib/e-anudaan/format";
import { DOCUMENT_TYPES, FIXED_VALUES, LANDING_LABEL, REMARKS_MAX, netOf, requiredDocTypes, sumHeads } from "@/lib/e-anudaan/pfms/advice";
import { labelOf } from "@/lib/e-anudaan/pfms/masters";
import type { AdviceDocument, AdviceHeader, BeneficiaryLine, DocumentTypeCode, HeadLine, Masters, SchemePfmsConfig, ValidationIssue } from "@/lib/e-anudaan/pfms/types";
import type { SanctionFacts } from "@/lib/e-anudaan/pfms/selectors";
import { SanctionFactsList } from "./advice-summary";
import { SourceTag, exact } from "./payment-ui";

export type IssueFor = (field: string) => string | undefined;

export function issueLookup(issues: readonly ValidationIssue[]): IssueFor {
  return (field) => issues.find((i) => i.field === field)?.message;
}

/* ── 1 · Sanction Header ─────────────────────────────────────────────────── */

export function HeaderStep({
  facts,
  header,
  onChange,
  masters,
  config,
  issue,
}: {
  facts: SanctionFacts;
  header: AdviceHeader;
  onChange: (h: AdviceHeader) => void;
  masters: Masters;
  config: SchemePfmsConfig | undefined;
  issue: IssueFor;
}) {
  const ddos = masters.ddos.filter((d) => config?.ddoCodes.includes(d.code));
  const ddo = masters.ddos.find((d) => d.code === header.ddoCode);
  const pds = masters.pdCodes.filter((p) => p.ddoCode === header.ddoCode);
  return (
    <div className="space-y-6">
      <Card variant="outlined">
        <CardBody className="space-y-3">
          <SectionTitle as={3} title="From the Sanction Order" description="Filled in from the sanction order and the cost sheet. They cannot be changed at the payment stage.">
            <SourceTag>From Sanction Order</SourceTag>
          </SectionTitle>
          <SanctionFactsList facts={facts} />
        </CardBody>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="DDO" id="hdr-ddo" required error={issue("hdr-ddo")} hint="The Drawing and Disbursing Officer who will draw the bill, from the PFMS master data.">
          {(c) => (
            <Select {...c} value={header.ddoCode} onChange={(e) => onChange({ ...header, ddoCode: e.target.value, pdCode: "" })}>
              <option value="">Select the DDO</option>
              {ddos.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} — {d.name}
                  {d.eBillActive ? "" : " (e-Bill not active)"}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label="Division Code (PD Code)" id="hdr-pd" required error={issue("hdr-pd")} hint={header.ddoCode ? "The codes PFMS lists for this DDO." : "Choose the DDO first."}>
          {(c) => (
            <Select {...c} value={header.pdCode} disabled={!header.ddoCode} onChange={(e) => onChange({ ...header, pdCode: e.target.value })}>
              <option value="">Select the code</option>
              {pds.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </div>

      {ddo && (
        <Alert status={ddo.eBillActive ? "info" : "error"} title={ddo.eBillActive ? LANDING_LABEL[ddo.landing] : "This DDO Cannot Receive an e-Sanction"}>
          {ddo.eBillActive
            ? `The sanction arrives at ${ddo.name}. The ${requiredDocTypes(ddo.landing).map((t) => DOCUMENT_TYPES[t]).join(" and ")} documents are required at this level.`
            : "PFMS reports that e-Bills are not activated for this DDO. Choose another DDO."}
        </Alert>
      )}

      <DescriptionList
        columns={2}
        size="sm"
        items={[
          {
            term: "Bill Number",
            value: header.billNumber ? (
              <span className="inline-flex flex-wrap items-center gap-2 font-mono" id="hdr-bill-number">
                {header.billNumber} <SourceTag>Generated</SourceTag>
              </span>
            ) : (
              <span id="hdr-bill-number" className="text-ink-muted">Generated when the DDO is chosen</span>
            ),
          },
          { term: "Bill Date", value: header.billDate ? formatDate(header.billDate) : "" },
          ...FIXED_VALUES.map((f) => ({ term: f.term, value: f.value })),
          { term: "Request Identifier", value: <span className="text-ink-muted">Generated when the Checker sends the advice to PFMS</span> },
        ]}
      />

      <div className="max-w-sm">
        <DatePicker
          id="hdr-npb"
          label="Not Payable Before (Optional)"
          value={header.npbDate}
          min={header.billDate}
          hint="Leave blank unless the sanction must not be paid before a given date."
          error={issue("hdr-npb")}
          onChange={(v) => onChange({ ...header, npbDate: v })}
        />
      </div>
    </div>
  );
}

/* ── 2 · Heads of Account ────────────────────────────────────────────────── */

const blankHead = (id: string): HeadLine => ({ id, functionHead: "", objectHead: "", category: "", grantNumber: "", amount: 0 });

export function HeadsStep({
  heads,
  onChange,
  sanctionAmount,
  masters,
  config,
  header,
  onHeaderChange,
  issue,
}: {
  heads: HeadLine[];
  onChange: (h: HeadLine[]) => void;
  sanctionAmount: number;
  masters: Masters;
  config: SchemePfmsConfig | undefined;
  header: AdviceHeader;
  onHeaderChange: (h: AdviceHeader) => void;
  issue: IssueFor;
}) {
  const allowed = config?.heads ?? [];
  const total = sumHeads(heads);
  const left = sanctionAmount - total;
  const set = (i: number, patch: Partial<HeadLine>) => onChange(heads.map((h, j) => (j === i ? { ...h, ...patch } : h)));
  const uniq = (xs: string[]) => [...new Set(xs)];

  return (
    <div className="space-y-5">
      {allowed.length === 0 && (
        <Alert status="warning" title="No Head of Account Configured">
          The Bureau has not yet recorded the coded head of account for this scheme. The advice cannot be completed until it does.
        </Alert>
      )}
      {heads.map((h, i) => {
        // Each part narrows the next, so only combinations the Bureau configured can be built.
        const fns = uniq(allowed.map((a) => a.functionHead));
        const objs = uniq(allowed.filter((a) => a.functionHead === h.functionHead).map((a) => a.objectHead));
        const cats = uniq(allowed.filter((a) => a.functionHead === h.functionHead && a.objectHead === h.objectHead).map((a) => a.category));
        const grants = uniq(allowed.filter((a) => a.functionHead === h.functionHead && a.objectHead === h.objectHead && a.category === h.category).map((a) => a.grantNumber));
        const n = heads.length > 1 ? ` ${i + 1}` : "";
        return (
          <Card key={h.id} variant="outlined">
            <CardBody className="space-y-4">
              <SectionTitle as={3} title={`Head of Account${n}`}>
                {heads.length > 1 && (
                  <Button size="sm" appearance="text" variant="danger" iconLeft={<Icon name="delete" size={16} aria-hidden />} onClick={() => onChange(heads.filter((_, j) => j !== i))}>
                    Remove
                  </Button>
                )}
              </SectionTitle>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <FormField label="Function Head" id={`head-${i}-function`} required error={issue(`head-${i}-function`)} hint="13 digits">
                  {(c) => (
                    <Select {...c} value={h.functionHead ?? ""} onChange={(e) => set(i, { functionHead: e.target.value, objectHead: "", category: "", grantNumber: "" })}>
                      <option value="">Select</option>
                      {fns.map((f) => (
                        <option key={f} value={f}>
                          {f} — {labelOf(masters.functionHeads, f)}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormField>
                <FormField label="Object Head" id={`head-${i}-object`} required error={issue(`head-${i}-object`)} hint="2 digits">
                  {(c) => (
                    <Select {...c} value={h.objectHead ?? ""} disabled={!h.functionHead} onChange={(e) => set(i, { objectHead: e.target.value, category: "", grantNumber: "" })}>
                      <option value="">Select</option>
                      {objs.map((o) => (
                        <option key={o} value={o}>
                          {o} — {labelOf(masters.objectHeads, o)}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormField>
                <FormField label="Category" id={`head-${i}-category`} required error={issue(`head-${i}-category`)}>
                  {(c) => (
                    <Select {...c} value={h.category ?? ""} disabled={!h.objectHead} onChange={(e) => set(i, { category: e.target.value, grantNumber: "" })}>
                      <option value="">Select</option>
                      {cats.map((o) => (
                        <option key={o} value={o}>
                          {o} — {labelOf(masters.categories, o)}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormField>
                <FormField label="Grant Number" id={`head-${i}-grant`} required error={issue(`head-${i}-grant`)} hint="3 digits">
                  {(c) => (
                    <Select {...c} value={h.grantNumber ?? ""} disabled={!h.category} onChange={(e) => set(i, { grantNumber: e.target.value })}>
                      <option value="">Select</option>
                      {grants.map((o) => (
                        <option key={o} value={o}>
                          {o} — {labelOf(masters.grantNumbers, o)}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormField>
              </div>
              <div className="max-w-xs">
                <NumberInput
                  id={`head-${i}-amount`}
                  label="Amount Against This Head"
                  required
                  prefix="₹"
                  min={0}
                  value={h.amount || null}
                  error={issue(`head-${i}-amount`)}
                  onValueChange={(v) => set(i, { amount: v ?? 0 })}
                />
              </div>
            </CardBody>
          </Card>
        );
      })}

      <Button appearance="outlined" size="sm" iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => onChange([...heads, blankHead(`h-${heads.length + 1}-${heads.map((h) => h.id).join("").length}`)])} disabled={allowed.length === 0}>
        Add Another Head
      </Button>

      {heads.some((h) => h.objectHead === "33") && (
        <div className="max-w-md">
          <FormField label="CNA Exception Reason" id="hdr-cna" required error={issue("hdr-cna")} hint="Required for an expenditure sanction against Object Head 33.">
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

      {/* The running total: the one rule a Maker most often breaks, checked as they type (NFR §6.5). */}
      <div id="heads-total" tabIndex={-1} className="outline-none" role="status" aria-live="polite">
        <Alert
          status={left === 0 ? "success" : "warning"}
          title={left === 0 ? "Heads Add Up to the Sanction" : left > 0 ? `${exact(left)} Still to Allocate` : `${exact(-left)} More Than the Sanction`}
        >
          Allocated {exact(total)} of the sanctioned {exact(sanctionAmount)}.
        </Alert>
      </div>
    </div>
  );
}

/* ── 3 · Beneficiary Payment ─────────────────────────────────────────────── */

export function BeneficiaryStep({
  beneficiaries,
  onChange,
  sanctionAmount,
  masters,
  issue,
}: {
  beneficiaries: BeneficiaryLine[];
  onChange: (b: BeneficiaryLine[]) => void;
  sanctionAmount: number;
  masters: Masters;
  issue: IssueFor;
}) {
  const set = (i: number, patch: Partial<BeneficiaryLine>) => onChange(beneficiaries.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const setDed = (i: number, k: number, patch: Partial<HeadLine>) =>
    set(i, { deductions: beneficiaries[i]!.deductions.map((d, j) => (j === k ? { ...d, ...patch } : d)) });
  return (
    <div className="space-y-5">
      {beneficiaries.map((b, i) => (
        <Card key={b.id} variant="outlined">
          <CardBody className="space-y-5">
            <SectionTitle as={3} title={b.name} description="Bank details are as the NGO entered and confirmed them. They cannot be changed here.">
              <SourceTag>{b.source === "bureau" ? "Entered by Bureau" : "From NGO Application"}</SourceTag>
            </SectionTitle>
            <DescriptionList
              columns={2}
              size="sm"
              items={[
                { term: "PFMS Payee Code", value: <span id={`ben-${i}-payee`} className="font-mono">{b.payeeCode}</span> },
                { term: "Bank", value: b.bank },
                { term: "Account Number", value: <span id={`ben-${i}-account`}>XXXX XXXX {b.accountLast4}</span> },
                { term: "IFSC", value: <span id={`ben-${i}-ifsc`} className="font-mono">{b.ifsc}</span> },
              ]}
            />
            {(issue(`ben-${i}-payee`) || issue(`ben-${i}-ifsc`)) && (
              <Alert status="error" title="The Payee's Details Need Correcting">
                {issue(`ben-${i}-payee`) ?? issue(`ben-${i}-ifsc`)} Ask the NGO to correct them on Project Bank Accounts, or the Bureau for a legacy file.
              </Alert>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <NumberInput
                id={`ben-${i}-gross`}
                label="Gross Amount"
                required
                prefix="₹"
                min={0}
                value={b.gross || null}
                hint={`The sanction is ${exact(sanctionAmount)}.`}
                error={issue(`ben-${i}-gross`)}
                onValueChange={(v) => set(i, { gross: v ?? 0 })}
              />
              <DescriptionList size="sm" items={[{ term: "Net Amount Payable", value: <span className="text-headline-3 font-semibold tabular-nums">{exact(netOf(b))}</span> }]} />
            </div>

            {/* Beneficiary-wise deductions (Annexure A.3 AccountHeadDetails, AccountType D) — only
                where one applies, so the section starts empty and says so. FR-PDM-004, F.3. */}
            <section aria-labelledby={`ben-${i}-ded-title`} className="space-y-3">
              <SectionTitle as={4} headingId={`ben-${i}-ded-title`} title="Deductions" description={b.deductions.length ? "Each deduction is booked to its own head of account and reduces the net payable." : "None. Add one only where a deduction applies to this payment."} />
              {b.deductions.map((d, k) => (
                <div key={d.id} className="space-y-3 rounded-md border border-line p-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {([
                      ["function", "Function Head", "functionHead", masters.functionHeads],
                      ["object", "Object Head", "objectHead", masters.objectHeads],
                      ["category", "Category", "category", masters.categories],
                      ["grant", "Grant Number", "grantNumber", masters.grantNumbers],
                    ] as const).map(([key, label, prop, list]) => (
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
              <Button
                size="sm"
                appearance="outlined"
                iconLeft={<Icon name="add" size={16} aria-hidden />}
                onClick={() => set(i, { deductions: [...b.deductions, { id: `${b.id}-d${b.deductions.length + 1}`, functionHead: "", objectHead: "", category: "", grantNumber: "", amount: 0 }] })}
              >
                Add a Deduction
              </Button>
            </section>
            <FormField
              label="Payee Remarks"
              id={`ben-${i}-remarks`}
              required
              error={issue(`ben-${i}-remarks`)}
              hint="Printed on the payment. For example, GIA NAPDDR 2027."
              characterCount={{ value: b.remarks, maxLength: REMARKS_MAX }}
            >
              {(c) => <Input {...c} value={b.remarks} maxLength={REMARKS_MAX} onChange={(e) => set(i, { remarks: e.target.value })} />}
            </FormField>
            <DescriptionList
              size="sm"
              items={[
                {
                  term: "Claim Reference Number",
                  value: b.claimReference ? <span className="font-mono">{b.claimReference}</span> : <span className="text-ink-muted">Drawn from the PFMS pool when you submit</span>,
                },
              ]}
            />
          </CardBody>
        </Card>
      ))}
      {issue("ben-total") && (
        <div id="ben-total" tabIndex={-1} className="outline-none">
          <Alert status="warning" title="Gross Amount Does Not Equal the Sanction">
            {issue("ben-total")}
          </Alert>
        </div>
      )}
    </div>
  );
}

/* ── 4 · Supporting Documents ────────────────────────────────────────────── */

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

export function DocumentsStep({
  documents,
  onChange,
  landing,
  issue,
}: {
  documents: AdviceDocument[];
  onChange: (d: AdviceDocument[]) => void;
  landing: Parameters<typeof requiredDocTypes>[0];
  issue: IssueFor;
}) {
  const required = requiredDocTypes(landing);
  const [busy, setBusy] = React.useState<DocumentTypeCode | null>(null);
  const [failed, setFailed] = React.useState<DocumentTypeCode | null>(null);
  const add = async (type: DocumentTypeCode, dataUrl: string, name: string) => {
    setBusy(type);
    setFailed(null);
    try {
      const { hash, bytes } = await sha256Base64(dataUrl);
      const doc = uploadedDocument(type, name, hash, bytes);
      onChange([...documents.filter((d) => d.type !== type || type === 6), doc]);
    } catch {
      setFailed(type);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4" id="doc-list" tabIndex={-1}>
      <Alert status="info" title={LANDING_LABEL[landing]}>
        PFMS receives a SHA-256 fingerprint of each file and a single-use link to view it, never the file itself. {required.map((t) => DOCUMENT_TYPES[t]).join(" and ")} are required where this sanction lands.
      </Alert>
      {([1, 2, 3, 4, 5, 6] as const).map((t) => {
        const doc = [...documents].reverse().find((d) => d.type === t);
        const isRequired = required.includes(t);
        return (
          <Card key={t} variant="outlined" id={`doc-type-${t}`} tabIndex={-1} className="outline-none">
            <CardBody className="space-y-3">
              <SectionTitle as={3} title={DOCUMENT_TYPES[t]}>
                {isRequired ? <Badge status={doc ? "success" : "neutral"} size="sm">{doc ? "Uploaded" : "Required"}</Badge> : <Badge status="neutral" size="sm">Optional</Badge>}
              </SectionTitle>
              {issue(`doc-type-${t}`) && !doc && <p className="text-body-2 text-[var(--sa-text-status-error-bolder)]">{issue(`doc-type-${t}`)}</p>}
              {doc ? (
                <DescriptionList
                  columns={2}
                  size="sm"
                  items={[
                    { term: "File", value: `${doc.name} · ${doc.sizeKb.toLocaleString("en-IN")} KB` },
                    { term: "Uploaded", value: formatDateTime(doc.uploadedAt) },
                    { term: "SHA-256 Fingerprint", value: <span className="break-all font-mono text-body-3">{doc.hash}</span>, wide: true },
                    { term: "PFMS View Link", value: `Single use, valid until ${formatDate(doc.viewLink.expiresAt)}` },
                  ]}
                />
              ) : null}
              <MediaUpload
                id={`doc-upload-${t}`}
                accept="application/pdf"
                maxSizeMb={5}
                promptLabel={doc ? "Replace the file" : `Upload the ${DOCUMENT_TYPES[t]} (PDF)`}
                hintLabel="PDF, up to 5 MB"
                fileName={undefined}
                onChange={(dataUrl, fileName) => void add(t, dataUrl, fileName)}
                onClear={() => onChange(documents.filter((d) => d.type !== t))}
                disabled={busy !== null}
              />
              {busy === t && <p role="status" className="text-body-3 text-ink-muted">Computing the fingerprint…</p>}
              {failed === t && <p role="alert" className="text-body-3 text-[var(--sa-text-status-error-bolder)]">The fingerprint could not be computed. Upload the file again.</p>}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
