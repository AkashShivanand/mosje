"use client";

/**
 * A payment advice, read-only, in the order PFMS receives it (Annexure F): header, heads of
 * account, beneficiary payment, supporting documents.
 *
 * One component, three readers — the Maker's review step, the Maker's locked view after submitting,
 * and the Checker's review, where it is the "read-only mirror of the exact payload" of FR-PDC-002.
 * One rendering is what lets the Checker trust that what they sign is what the Maker saw.
 *
 * DS Audit: Card ✅ · SectionTitle ✅ · DescriptionList ✅ · Badge ✅ · Button ✅ · Icon ✅ — composed.
 */

import * as React from "react";
import { Badge, Button, Card, CardBody, DescriptionList, Icon, SectionTitle } from "@mosje/design-system";
import { formatDate, formatDateTime } from "@/lib/e-anudaan/format";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { DOCUMENT_TYPES, FIXED_VALUES, LANDING_LABEL, STEP_LABEL, netOf, requiredDocTypes, sumHeads } from "@/lib/e-anudaan/pfms/advice";
import { headCode, labelOf } from "@/lib/e-anudaan/pfms/masters";
import type { AdviceStep, Masters, PaymentAdvice } from "@/lib/e-anudaan/pfms/types";
import type { SanctionFacts } from "@/lib/e-anudaan/pfms/selectors";
import { SourceTag, exact } from "./payment-ui";

export function SanctionFactsList({ facts, columns = 2 }: { facts: SanctionFacts; columns?: 1 | 2 | 3 }) {
  return (
    <DescriptionList
      columns={columns}
      size="sm"
      items={[
        { term: "Sanction Number", value: facts.orderNo },
        { term: "Sanction Date", value: formatDate(facts.sanctionedAt) },
        { term: "Sanction Amount", value: <span className="tabular-nums">{exact(facts.amount)}</span> },
        { term: "Financial Year", value: facts.financialYear },
        { term: "IFD Concurrence Number", value: facts.ifdNumber },
        { term: "IFD Concurrence Date", value: formatDate(facts.ifdDate) },
        { term: "Scheme", value: schemeLabel(facts.schemeCode) },
        { term: "PFMS Scheme Code", value: facts.pfmsSchemeCode ?? "Not yet allotted" },
      ]}
    />
  );
}

function Section({ step, title, onEdit, children, flagged }: { step: AdviceStep; title: string; onEdit?: (s: AdviceStep) => void; children: React.ReactNode; flagged?: boolean }) {
  return (
    <section aria-labelledby={`sum-${step}`} className="space-y-3">
      <SectionTitle
        as={3}
        headingId={`sum-${step}`}
        title={title}
        description={flagged ? <span className="text-[var(--sa-text-status-error-bolder)]">Needs attention before it can be sent.</span> : undefined}
      >
        {onEdit && (
          <Button size="sm" appearance="text" onClick={() => onEdit(step)} iconLeft={<Icon name="edit" size={16} aria-hidden />}>
            Change
          </Button>
        )}
      </SectionTitle>
      {children}
    </section>
  );
}

export function AdviceSummary({
  advice,
  masters,
  onEdit,
  flaggedSteps = [],
}: {
  advice: PaymentAdvice;
  masters: Masters;
  /** The Maker's review step passes this; the Checker's mirror does not. */
  onEdit?: (step: AdviceStep) => void;
  flaggedSteps?: readonly AdviceStep[];
}) {
  const ddo = masters.ddos.find((d) => d.code === advice.header.ddoCode);
  const pd = masters.pdCodes.find((p) => p.code === advice.header.pdCode);
  const headTotal = sumHeads(advice.heads);
  const gross = advice.beneficiaries.reduce((s, b) => s + b.gross, 0);
  const required = requiredDocTypes(ddo?.landing ?? "Approved");

  return (
    <Card variant="outlined">
      <CardBody className="space-y-6">
        <Section step="header" title={STEP_LABEL.header} onEdit={onEdit} flagged={flaggedSteps.includes("header")}>
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              { term: "DDO", value: ddo ? `${ddo.code} — ${ddo.name}` : "Not chosen" },
              { term: "Division Code (PD Code)", value: pd ? `${pd.code} — ${pd.label}` : "Not chosen" },
              { term: "Bill Number", value: advice.header.billNumber || "Generated when the DDO is chosen" },
              { term: "Bill Date", value: advice.header.billDate ? formatDate(advice.header.billDate) : "" },
              { term: "Not Payable Before", value: advice.header.npbDate ? formatDate(advice.header.npbDate) : "Not set" },
              { term: "Where It Lands", value: ddo ? LANDING_LABEL[ddo.landing] : "" },
              ...FIXED_VALUES.map((f) => ({ term: f.term, value: <span className="inline-flex flex-wrap items-center gap-2">{f.value} <SourceTag>Set by System</SourceTag></span> })),
            ]}
          />
        </Section>

        <Section step="heads" title={STEP_LABEL.heads} onEdit={onEdit} flagged={flaggedSteps.includes("heads")}>
          <ul className="divide-y divide-line rounded-md border border-line">
            {advice.heads.map((h, i) => (
              <li key={h.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
                <span className="min-w-0">
                  <span className="block font-mono text-body-2 text-ink">{headCode(h)}</span>
                  <span className="block text-body-3 text-ink-muted">
                    {labelOf(masters.functionHeads, h.functionHead) || `Head ${i + 1}`} · {labelOf(masters.objectHeads, h.objectHead)}
                  </span>
                </span>
                <span className="tabular-nums font-semibold text-ink">{exact(h.amount)}</span>
              </li>
            ))}
            <li className="flex flex-wrap items-baseline justify-between gap-2 bg-[var(--sa-bg-neutral-subtler)] px-4 py-3">
              <span className="font-semibold text-ink">Total</span>
              <span className={`tabular-nums font-semibold ${headTotal === advice.sanctionAmount ? "text-ink" : "text-[var(--sa-text-status-error-bolder)]"}`}>
                {exact(headTotal)} {headTotal === advice.sanctionAmount ? <Badge status="success" size="sm">Equals Sanction</Badge> : <Badge status="danger" size="sm">Does Not Equal Sanction</Badge>}
              </span>
            </li>
          </ul>
          {advice.header.cnaExceptionReason && <p className="text-body-3 text-ink-muted">CNA exception reason {advice.header.cnaExceptionReason}</p>}
        </Section>

        <Section step="beneficiary" title={STEP_LABEL.beneficiary} onEdit={onEdit} flagged={flaggedSteps.includes("beneficiary")}>
          {advice.beneficiaries.map((b) => (
            <DescriptionList
              key={b.id}
              columns={2}
              size="sm"
              items={[
                { term: "Name as per PFMS", value: b.name },
                { term: "PFMS Payee Code", value: <span className="inline-flex flex-wrap items-center gap-2 font-mono">{b.payeeCode} <SourceTag>{b.source === "bureau" ? "Entered by Bureau" : "From NGO"}</SourceTag></span> },
                { term: "Bank", value: b.bank },
                { term: "Account Number", value: `XXXX XXXX ${b.accountLast4}` },
                { term: "IFSC", value: <span className="font-mono">{b.ifsc}</span> },
                { term: "Gross Amount", value: <span className="tabular-nums">{exact(b.gross)}</span> },
                { term: "Deductions", value: b.deductions.length ? <span className="tabular-nums">{exact(sumHeads(b.deductions))}</span> : "None" },
                { term: "Net Amount", value: <span className="tabular-nums font-semibold">{exact(netOf(b))}</span> },
                { term: "Payee Remarks", value: b.remarks || "Not entered" },
                { term: "Claim Reference Number", value: b.claimReference ? <span className="font-mono">{b.claimReference}</span> : "Drawn from the PFMS pool on submission" },
              ]}
            />
          ))}
          {gross !== advice.sanctionAmount && <p className="text-body-2 text-[var(--sa-text-status-error-bolder)]">The gross amount payable does not equal the sanction amount.</p>}
        </Section>

        <Section step="documents" title={STEP_LABEL.documents} onEdit={onEdit} flagged={flaggedSteps.includes("documents")}>
          <ul className="space-y-2">
            {([1, 2, 3, 4, 5, 6] as const)
              .filter((t) => required.includes(t) || advice.documents.some((d) => d.type === t))
              .map((t) => {
                const docs = advice.documents.filter((d) => d.type === t);
                return (
                  <li key={t} className="rounded-md border border-line px-4 py-3">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{DOCUMENT_TYPES[t]}</span>
                      {required.includes(t) && <Badge status="neutral" size="sm">Required</Badge>}
                      {docs.length === 0 && <Badge status="danger" size="sm">Not Uploaded</Badge>}
                    </span>
                    {docs.map((d) => (
                      <span key={d.id} className="mt-1 block text-body-3 text-ink-muted">
                        {d.name} · {d.sizeKb.toLocaleString("en-IN")} KB · uploaded {formatDateTime(d.uploadedAt)}
                        <span className="block break-all font-mono">SHA-256 {d.hash}</span>
                      </span>
                    ))}
                  </li>
                );
              })}
          </ul>
        </Section>
      </CardBody>
    </Card>
  );
}
