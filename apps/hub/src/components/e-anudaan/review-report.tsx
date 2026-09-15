"use client";

/**
 * Generate Review Report — the officer's review, as a document to print or save as PDF.
 *
 * DS Audit: Modal (`printable`) ✅ · DescriptionList ✅ · DataTable ✅ · SectionTitle ✅ · Button ✅ —
 * nothing new. The printable Modal prints the dialog alone (UX-24), so the console's rail and
 * header stay off the paper without this screen knowing about them.
 *
 * Live SM2-PD-US carries "Generate Review Report"; ours had a Print button that printed the whole
 * console (parity inventory §21 (d)). The report holds what the call asked an officer's review to
 * record: the application, each document's automatic check beside the officer's verdict and remark
 * (B11, B12), the file's movement, and the officer's overall remark (B13).
 */

import { Button, DataTable, DescriptionList, Modal, SectionTitle } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { GRADE_FULL, ROLES } from "@/lib/e-anudaan/roles";
import { ACTION_LABEL, statusLabel } from "@/lib/e-anudaan/workflow";
import { formatDate, formatDateTime, rupees } from "@/lib/e-anudaan/format";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { ordinal, projectTitleFor } from "@/lib/e-anudaan/applicant";
import { applicantFacts, simulateCheck } from "@/lib/e-anudaan/document-centre";
import { officerCheckLabel } from "./review-panels";
import type { DocVerdict } from "@/lib/e-anudaan/doc-verification";
import type { AuditEntry, GrantApplication, MockDoc } from "@/lib/e-anudaan/types";
import { officerOf } from "./review-panels";

const VERDICT: Record<MockDoc["reviewStatus"], string> = {
  Pending: "Not reviewed",
  Verified: "Verified",
  Deficient: "Needs correction",
  "Not applicable": "Not applicable",
};

function checkOf(app: GrantApplication, d: MockDoc): DocVerdict | undefined {
  if (!d.fileName) return undefined;
  if (d.aiVerdict) return d.aiVerdict;
  return simulateCheck({
    slot: { n: d.slot, title: d.title },
    checklist: app.documents.map((x) => ({ n: x.slot, title: x.title })),
    fileName: d.fileName,
    sizeKb: d.sizeKb ?? 0,
    applicationFy: app.financialYear,
    facts: applicantFacts(app.formValues ?? {}),
  });
}

export function ReviewReport({
  app,
  open,
  onClose,
  overallRemark,
}: {
  app: GrantApplication;
  open: boolean;
  onClose: () => void;
  /** The remark in the officer's decision box, or their last recorded remark on the file. */
  overallRemark: string;
}) {
  const { state, findNgo } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const ngo = findNgo(app.ngoId);
  const officer = role ? `${role.personName}, ${role.grade ? GRADE_FULL[role.grade] : role.label}${role.division === "finance" ? ", Integrated Finance Division" : role.division === "pd" ? ", Programme Division" : ""}` : "—";
  const docs = [...app.documents].sort((a, b) => a.slot - b.slot);
  type DocRow = { doc: MockDoc; check: string };
  const docRows: DocRow[] = docs.map((d) => ({ doc: d, check: d.fileName ? officerCheckLabel(checkOf(app, d), { column: true }) : "Not uploaded" }));
  const history = [...app.audit].reverse();

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      printable
      title="Review Report"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <Button appearance="outlined" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => window.print()}>Print or Save as PDF</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <DescriptionList
          columns={2}
          size="sm"
          items={[
            { term: "Issued By", value: "Ministry of Social Justice and Empowerment · e-Anudaan" },
            { term: "Generated", value: `${formatDateTime(new Date())} by ${officer}` },
          ]}
        />

        <section className="space-y-3">
          <SectionTitle as={3} title="Application" />
          <DescriptionList
            columns={2}
            size="sm"
            divided
            items={[
              { term: "NGO", value: ngo?.name ?? app.ngoId },
              { term: "NGO-Darpan ID", value: ngo?.darpanId ?? "—" },
              { term: "Project", value: `${projectTitleFor(state, app)} (${app.institutionId})` },
              { term: "Scheme", value: `${schemeLabel(app.schemeCode)} · FY ${app.financialYear}` },
              { term: "Application No.", value: app.id },
              { term: "Case Type", value: app.caseType === "New" ? "New project" : `${app.instalment ? ordinal(app.instalment) : "Next"} instalment of an ongoing project` },
              { term: "Grant Sought", value: `${rupees(app.total)} (recurring ${rupees(app.recurring)} · non-recurring ${rupees(app.nonRecurring)})` },
              { term: "Beneficiaries", value: `${app.totalBeneficiaries} (SC ${app.scBeneficiaries} · other ${app.otherBeneficiaries})` },
              { term: "Submitted On", value: app.submittedAt ? formatDate(app.submittedAt) : "—" },
              { term: "Status", value: statusLabel(app) },
              ...(app.sanction ? [{ term: "Sanction Order", value: `${app.sanction.orderNo} · ${rupees(app.sanction.total)} · ${formatDate(app.sanction.sanctionedAt)}` }] : []),
            ]}
          />
        </section>

        <section className="space-y-3">
          <SectionTitle as={3} title="Documents" />
          <DataTable<DocRow & Record<string, unknown>>
            caption="Document verdicts"
            columns={[
              { key: "slot", header: "No.", render: (r) => r.doc.slot },
              { key: "title", header: "Document", render: (r) => r.doc.title },
              { key: "check", header: "Automatic Check", render: (r) => r.check },
              { key: "verdict", header: "Officer's Verdict", render: (r) => VERDICT[r.doc.reviewStatus] },
              {
                key: "remark",
                header: "Remarks",
                render: (r) => (
                  <span className="block min-w-[10rem]">
                    {r.doc.officerRemarks ?? (r.doc.reviewedBy ? null : "—")}
                    {r.doc.reviewedBy && r.doc.reviewedAt && (
                      <span className="block text-body-3 text-ink-muted">
                        By {officerOf(r.doc.reviewedBy)}, {formatDate(r.doc.reviewedAt)}
                      </span>
                    )}
                  </span>
                ),
              },
            ]}
            data={docRows as (DocRow & Record<string, unknown>)[]}
            total={docRows.length}
            pageSizes={[Math.max(docRows.length, 1)]}
            showPageSizes={false}
          />
        </section>

        <section className="space-y-3">
          <SectionTitle as={3} title="File Movement and Remarks" />
          <DataTable<{ e: AuditEntry } & Record<string, unknown>>
            caption="File movement and remarks"
            columns={[
              { key: "at", header: "Date", render: (r) => <span className="whitespace-nowrap">{formatDateTime(r.e.at)}</span> },
              { key: "by", header: "By", render: (r) => (r.e.byRole === "ngo" ? (ngo?.name ?? "Applicant") : `${r.e.byName}, ${ROLES[r.e.byRole]?.label ?? ""}`) },
              { key: "action", header: "Action", render: (r) => ACTION_LABEL[r.e.action] },
              { key: "remarks", header: "Remarks", render: (r) => r.e.remarks ?? "—" },
            ]}
            data={history.map((e) => ({ e })) as ({ e: AuditEntry } & Record<string, unknown>)[]}
            total={history.length}
            pageSizes={[Math.max(history.length, 1)]}
            showPageSizes={false}
          />
        </section>

        <section className="space-y-2">
          <SectionTitle as={3} title="Overall Remark" />
          <p className="text-body-2 text-ink">{overallRemark.trim() || "No overall remark has been entered."}</p>
        </section>
      </div>
    </Modal>
  );
}
