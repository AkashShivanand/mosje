"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Button,
  Checkbox,
  DescriptionList,
  DocumentChecklist,
  DocumentChecklistGroup,
  DocumentHistorySheet,
  DocumentRow,
  EventList,
  FormField,
  Icon,
  Input,
  ListGroup,
  ListRow,
  Modal,
  SectionTitle,
  Select,
  StatusScreen,
  Textarea,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { GRADE_FULL, ROLES } from "@/lib/e-anudaan/roles";
import {
  ACTION_LABEL,
  RULES,
  canEditDocVerdicts,
  deficiencyItemsFrom,
  docReviewerLine,
  permittedActions,
  proposedDeficiency,
  statusLabel,
  unexaminedRequiredDocs,
  verdictAttribution,
  type ActionPayload,
  type DecisionContext,
  type Rule,
} from "@/lib/e-anudaan/workflow";
import { formatGrant, schemeLabel, statusTone } from "@/lib/e-anudaan/selectors";
import { formatDate, formatTime, rupees } from "@/lib/e-anudaan/format";
import { answeredSections, ordinal, projectTitleFor } from "@/lib/e-anudaan/applicant";
import { fieldLabel, type FieldDef } from "@/lib/e-anudaan/form-schema";
import type { AuditAction, Deficiency, DocReviewStatus, GrantApplication, MockDoc } from "@/lib/e-anudaan/types";
import { RefText } from "./worklist-table";
import { DocumentPreviewSheet } from "./document-preview-sheet";
import { CostNormsReview, FundingHistory, InspectionsPanel, InstalmentsPanel, Panel, ShowCausePanel, officerCheckLabel } from "./review-panels";
import { ReviewReport } from "./review-report";
import { Findings, rowStateOf } from "./document-centre-parts";
import type { DocVerdict } from "@/lib/e-anudaan/doc-verification";
import {
  acceptFromNote,
  applicantFacts,
  docState,
  fileSizeLabel,
  historyEntriesOfRecord,
  rejectionOf,
  simulateCheck,
} from "@/lib/e-anudaan/document-centre";

/**
 * The officer review screen — ONE component behind all ten grades and the Programme Director.
 *
 * Rebuilt after the screen audit of 14 Sep 2026, which found an officer could not examine the
 * file they were asked to decide on: no form answers, no movement history, and the query, return
 * or deficiency that brought the file back shown nowhere. The screen now reads top-down as a
 * decision: what is open on the file, what the applicant answered, the documents, what happened
 * before — with the decision itself held beside it on a wide screen, so an officer never scrolls
 * three thousand pixels to act.
 *
 * The action set still comes entirely from `permittedActions`, so no screen logic knows about grades.
 */
export function ReviewShell({ appId }: { appId: string }) {
  const router = useRouter();
  const { state, findApp, findNgo, act, reviewDocument } = useEAnudaan();
  const { toast } = useToast();

  const app = findApp(appId);
  const role = state.session ? ROLES[state.session] : null;

  const [remarks, setRemarks] = React.useState("");
  const [certifyTicked, setCertifyTicked] = React.useState(false);
  const [confirming, setConfirming] = React.useState<Rule | null>(null);
  // The sanction amounts start EMPTY, with the amount sought shown as the hint. Prefilled to the
  // full sum, the Programme Director's ₹68,00,000 sanction went through on one click without the
  // figure ever being entered or read back (UX audit UX-03, 14 Sep 2026).
  const [recurring, setRecurring] = React.useState("");
  const [nonRecurring, setNonRecurring] = React.useState("");
  const [previewing, setPreviewing] = React.useState<MockDoc | null>(null);
  // Documents opened in this sitting. With a verdict, this is what "examined" means for the
  // certification gate.
  const [opened, setOpened] = React.useState<ReadonlySet<string>>(() => new Set());
  const [reportOpen, setReportOpen] = React.useState(false);
  // The decision the officer last pressed with something missing. One inline message per missing
  // thing, shown only then — the screen used to explain every disabled button in standing prose.
  const [attempted, setAttempted] = React.useState<Rule | null>(null);

  if (!app || !role) {
    return (
      <StatusScreen
        kind="404"
        title="Application Not Found"
        description="No application with this reference is in the register. It may have been withdrawn, or the link may be incomplete."
        primaryAction={{ label: "Back to My Queue", onClick: () => router.push(role?.home ?? "../") }}
        searchUrl={null}
        wayfindingLinks={[]}
      />
    );
  }

  const ngo = findNgo(app.ngoId);
  const actions = permittedActions(app, role);
  const decisions = actions.filter((a) => a.action !== "certify");
  const canCertify = actions.some((a) => a.action === "certify");
  const holdsFile = actions.length > 0;
  const gradeTitle = role.grade ? GRADE_FULL[role.grade] : role.label;
  const project = projectTitleFor(state, app);

  // The ASO's forward is gated on certification. It used to vanish until then, leaving Reject as
  // the only filled button on the screen; it now stays in place, disabled, saying why.
  const forwardRule = RULES.find((r) => r.action === "forward")!;
  const certificationPending =
    holdsFile && role.caps.includes("certify") && !app.certifiedAt && !decisions.some((d) => d.action === "forward");

  const deficiencyItems = deficiencyItemsFrom(app, remarks);
  const docsEditable = canEditDocVerdicts(app, role);
  const markedDocs = app.documents.filter((d) => d.reviewStatus === "Deficient").length;
  const sendsMessage = decisions.some((d) => d.action === "communicateDeficiency");
  const sanctioning = decisions.some((d) => d.action === "sanction");
  const sanctionR = Number(recurring);
  const sanctionNR = Number(nonRecurring);
  const sanctionEntered = recurring !== "" || nonRecurring !== "";
  const sanctionInvalid =
    sanctioning &&
    (recurring === "" || nonRecurring === "" || sanctionR + sanctionNR <= 0 || sanctionR + sanctionNR > app.total);
  const unexamined = canCertify ? unexaminedRequiredDocs(app, opened) : [];

  const ngoName = ngo?.name ?? app.ngoId;
  const payloadFor = (rule: Rule): ActionPayload => ({
    remarks,
    certified: certifyTicked,
    items: rule.action === "raiseDeficiency" ? deficiencyItems : undefined,
    sanction: rule.action === "sanction" ? { recurring: sanctionR, nonRecurring: sanctionNR } : undefined,
  });
  const contextFor = (rule: Rule): DecisionContext => ({ app, role, payload: payloadFor(rule), ngoName, project });

  /** What stops this decision, as the messages beside the fields concerned. Empty when it can go. */
  const problemsOf = (rule: Rule) => ({
    remarks: rule.requiresRemarks && !remarks.trim() ? "Enter your remarks." : undefined,
    certification: rule.action === "forward" && certificationPending ? "Record the certification before forwarding the file." : undefined,
    sanction: rule.action === "sanction" && sanctionInvalid ? `Enter both amounts. Together they must be more than ₹0 and no more than the ${rupees(app.total)} sought.` : undefined,
    deficiency:
      rule.action === "raiseDeficiency" && deficiencyItems.some((it) => !it.remark.trim()) ? "Give a reason for every document marked for correction." : undefined,
  });
  const problems: Partial<ReturnType<typeof problemsOf>> = attempted ? problemsOf(attempted) : {};

  const commit = (rule: Rule) => {
    const ctx = contextFor(rule);
    const res = act(app.id, rule.action, ctx.payload);
    setConfirming(null);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(rule.outcome({ ...ctx, after: res.app }), "success");
    setRemarks("");
    if (rule.action !== "certify") router.push(role.home);
  };

  /** An irreversible or outward decision is read back first; everything else commits. */
  const decide = (rule: Rule) => {
    const p = problemsOf(rule);
    if (p.remarks || p.certification || p.sanction || p.deficiency) {
      setAttempted(rule);
      document.getElementById(p.remarks ? "officer-remarks" : p.sanction ? "sanction-recurring" : "officer-decision")?.focus();
      return;
    }
    setAttempted(null);
    if (rule.confirm?.(contextFor(rule))) setConfirming(rule);
    else commit(rule);
  };
  const confirmCopy = confirming?.confirm?.(contextFor(confirming)) ?? null;
  const openDocument = (doc: MockDoc) => {
    setPreviewing(doc);
    setOpened((prev) => (prev.has(doc.id) ? prev : new Set(prev).add(doc.id)));
  };

  const primary = decisions.filter((d) => d.intent === "primary");
  const secondary = decisions.filter((d) => d.intent === "secondary");
  const danger = decisions.filter((d) => d.intent === "danger");

  return (
    <div className="space-y-5">
      {/* ── Header: who and what, not the reference in 40px ─────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 basis-full space-y-1 md:basis-auto md:flex-1">
          {/* Spelled out: "PD" named both the Programme Division and the Programme Director. */}
          <p className="text-body-3 text-ink-muted">
            Review · {gradeTitle}
            {role.division ? `, ${role.division === "finance" ? "Integrated Finance Division" : "Programme Division"}` : ""}
          </p>
          <h1 className="text-headline-3 text-ink">{ngo?.name ?? app.ngoId}</h1>
          <p className="text-body-2 text-ink">
            {project} · {schemeLabel(app.schemeCode)} · FY {app.financialYear}
          </p>
          <p className="text-body-3 text-ink-muted">
            Application No. <RefText value={app.id} breakAtEverySlash className="text-ink" /> · Project ID {app.institutionId}
          </p>
        </div>
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">
          {/* Wraps on a phone: "Under Examination · With the Under Secretary, Integrated Finance" ran 45px off a 375px screen. */}
          <Badge status={statusTone(app.status)} className="h-auto max-w-full whitespace-normal">
            {statusLabel(app)}
          </Badge>
          <Button appearance="outlined" size="sm" onClick={() => setReportOpen(true)}>
            <Icon name="description" size={16} aria-hidden /> Generate Review Report
          </Button>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="min-w-0 space-y-5">
          <OpenItem app={app} />

          <Panel title="Summary">
            <Facts
              items={[
                ["NGO-Darpan ID", ngo?.darpanId ?? "—"],
                ["Case Type", app.caseType === "New" ? "New project" : `${app.instalment ? ordinal(app.instalment) : "Next"} instalment of an ongoing project`],
                ["Total Beneficiaries", `${app.totalBeneficiaries} (SC ${app.scBeneficiaries} · other ${app.otherBeneficiaries})`],
                ["Grant Sought", `${formatGrant(app.total)} (recurring ${formatGrant(app.recurring)} · non-recurring ${formatGrant(app.nonRecurring)})`],
                ["Submitted On", app.submittedAt ? formatDate(app.submittedAt) : "—"],
                ["ASO Certified", app.certifiedAt ? `Yes · ${formatDate(app.certifiedAt)}` : "Not yet"],
              ]}
            />
          </Panel>

          <CostNormsReview app={app} />

          <ApplicationAnswers app={app} />

          <DocumentsPanel
            app={app}
            editable={docsEditable}
            opened={opened}
            onOpen={openDocument}
            onReview={(doc, status, remark) => reviewDocument(app.id, doc.id, status, remark)}
          />

          <FundingHistory app={app} />

          <InstalmentsPanel app={app} />

          <ShowCausePanel app={app} />

          <InspectionsPanel app={app} />

          <Panel title="File Movement and Remarks">
            <EventList
              linkAs={Link}
              label="File movement and remarks"
              events={[...app.audit].reverse().map((e) => ({
                id: e.id,
                at: e.at,
                actor: e.byRole === "ngo" ? (ngo?.name ?? "Applicant") : e.byName,
                actorRole: e.byRole === "ngo" ? "Applicant" : ROLES[e.byRole]?.label,
                action: ACTION_LABEL[e.action],
                note: e.remarks,
                tone: toneOf(e.action),
              }))}
            />
          </Panel>
        </div>

        {/* ── The decision, held beside the file on a wide screen ─────────────────── */}
        <aside className="space-y-5 xl:sticky xl:top-4" aria-label="Your decision">
          {canCertify && (
            <Panel title="Certification (Mandatory)">
              <Checkbox
                checked={certifyTicked && unexamined.length === 0}
                disabled={unexamined.length > 0}
                onChange={(e) => setCertifyTicked(e.target.checked)}
                // The certification step the scheme rules require before the file moves on (BR-SM2-05).
                label="I certify that the application and documents have been examined and are complete and correct as per scheme guidelines."
                description={
                  unexamined.length > 0
                    ? `Open or give a verdict on every required document first. ${unexamined.length} of ${app.documents.filter((d) => !d.optional).length} required documents have not been examined.`
                    : undefined
                }
              />
              <div className="mt-3">
                <Button
                  appearance="outlined"
                  disabled={!certifyTicked || unexamined.length > 0}
                  onClick={() => decide(actions.find((a) => a.action === "certify")!)}
                >
                  Record Certification
                </Button>
              </div>
            </Panel>
          )}

          {sanctioning && (
            <Panel title="Sanction Order">
              <p className="mb-3 text-body-3 text-ink-muted">
                Amount sought: {rupees(app.total)}. The sanction may not exceed it.
              </p>
              <div className="space-y-3">
                <FormField label="Recurring Grant (₹)" id="sanction-recurring" required hint={`Amount sought: ${rupees(app.recurring)}`}>
                  {(c) => <Input {...c} inputMode="numeric" value={recurring} onChange={(e) => setRecurring(e.target.value.replace(/[^\d]/g, ""))} />}
                </FormField>
                <FormField label="Non-Recurring Grant (₹)" id="sanction-non-recurring" required hint={`Amount sought: ${rupees(app.nonRecurring)}`}>
                  {(c) => <Input {...c} inputMode="numeric" value={nonRecurring} onChange={(e) => setNonRecurring(e.target.value.replace(/[^\d]/g, ""))} />}
                </FormField>
                <p className="text-body-2 text-ink">
                  Total to sanction: <strong>{sanctionEntered ? rupees(sanctionR + sanctionNR) : "Not entered"}</strong>
                </p>
                {(problems.sanction || (sanctionInvalid && sanctionEntered)) && (
                  <p className="text-body-3 text-[var(--sa-text-status-error-bolder)]" role="alert">
                    Enter both amounts. Together they must be more than ₹0 and no more than the {rupees(app.total)} sought.
                  </p>
                )}
              </div>
            </Panel>
          )}

          <Panel title="Your Decision">
            <span id="officer-decision" tabIndex={-1} className="sr-only">Your decision</span>
            {!holdsFile ? (
              <p className="text-body-2 text-ink-muted">
                This application is not with you. Its status is <strong className="text-ink">{statusLabel(app)}</strong>, and you are viewing it read-only.
              </p>
            ) : (
              <div className="space-y-4">
                {decisions.some((d) => d.action === "raiseDeficiency") && (
                  <p className="text-body-3 text-ink-muted">
                    {markedDocs > 0
                      ? `${markedDocs} document${markedDocs === 1 ? "" : "s"} marked for correction. Raising a deficiency sends ${markedDocs === 1 ? "it" : "them"}, with your reasons, to the Section Officer.`
                      : "No document is marked for correction. Raising a deficiency sends your remarks to the Section Officer as a clarification request."}
                  </p>
                )}
                <FormField
                  label={sendsMessage ? "Message to the NGO" : "Remarks"}
                  id="officer-remarks"
                  required
                  error={problems.remarks}
                  hint={sendsMessage ? "The NGO reads this above the items it must correct." : "Recorded on the file's movement history."}
                >
                  {(control) => (
                    <Textarea {...control} value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={4} />
                  )}
                </FormField>

                <div className="flex flex-col gap-2">
                  {primary.map((a) => (
                    <Button key={a.action} fullWidth onClick={() => decide(a)}>
                      {a.label(role, app)}
                    </Button>
                  ))}
                  {certificationPending && (
                    <Button fullWidth onClick={() => decide(forwardRule)}>
                      {forwardRule.label(role, app)}
                    </Button>
                  )}
                  {secondary.map((a) => (
                    <Button
                      key={a.action}
                      fullWidth
                      appearance="outlined"
                      onClick={() => decide(a)}
                    >
                      {a.label(role, app)}
                    </Button>
                  ))}
                  {danger.map((a) => (
                    <Button
                      key={a.action}
                      fullWidth
                      appearance="outlined"
                      variant="danger"
                      onClick={() => decide(a)}
                    >
                      {a.label(role, app)}
                    </Button>
                  ))}
                </div>
                {(problems.certification || problems.deficiency) && (
                  <p className="text-body-3 text-[var(--sa-text-status-error-bolder)]" role="alert">
                    {problems.certification ?? problems.deficiency}
                  </p>
                )}
              </div>
            )}
          </Panel>
        </aside>
      </div>

      {/* One confirmation for every irreversible or outward decision; its words come from the rule. */}
      <Modal
        open={confirming !== null && confirmCopy !== null}
        onClose={() => setConfirming(null)}
        title={confirmCopy?.title ?? ""}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button appearance="outlined" onClick={() => setConfirming(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmCopy?.tone === "danger" ? "danger" : undefined}
              onClick={() => confirming && commit(confirming)}
            >
              {confirmCopy?.confirmLabel}
            </Button>
          </div>
        }
      >
        {confirmCopy && (
          <div className="space-y-4">
            <p className="text-body-2 text-ink">{confirmCopy.summary}</p>
            <DescriptionList columns={1} layout="inline" size="sm" divided items={confirmCopy.facts} />
          </div>
        )}
      </Modal>

      <ReviewReport
        app={app}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        overallRemark={remarks.trim() || ([...app.audit].reverse().find((e) => e.byRole === state.session && e.remarks)?.remarks ?? "")}
      />

      <DocumentPreviewSheet
        doc={previewing ? (app.documents.find((d) => d.id === previewing.id) ?? previewing) : null}
        verdict={previewing ? DOC_STATUS_LABEL[(app.documents.find((d) => d.id === previewing.id) ?? previewing).reviewStatus] : undefined}
        onClose={() => setPreviewing(null)}
      />
    </div>
  );
}

/* ── What is open on the file ─────────────────────────────────────────────── */

/**
 * The query, return or deficiency that is live on the file, pinned first. An SO was offered
 * "Resolve Query and Send Back" with the query's text shown nowhere, and an ASO saw "Returned
 * for Rework · By the Programme Director" without the Director's reason (screen audit, 14 Sep).
 */
function OpenItem({ app }: { app: GrantApplication }) {
  const proposed = proposedDeficiency(app);
  if (proposed) {
    return (
      <Alert status="warning" title="Deficiency Noted by the ASO — Not Yet Sent to the NGO">
        <p className="text-body-2">
          Noted on {formatDate(proposed.raisedAt)} by {ROLES[proposed.raisedBy]?.label ?? "the ASO"}: {proposed.detail}
        </p>
        <DeficiencyItems deficiency={proposed} app={app} />
        <p className="mt-2 text-body-3">
          Send it to the NGO with a message, or return it to the ASO without sending. The file cannot be forwarded until then.
        </p>
      </Alert>
    );
  }

  if (app.status === "DeficiencyRaised") {
    const d = [...app.deficiencies].reverse().find((x) => x.communicatedAt && !x.respondedAt);
    if (d) {
      return (
        <Alert status="info" title={`With the NGO for Correction since ${formatDate(d.communicatedAt!)}`}>
          {d.message && <p className="text-body-2">Message sent: {d.message}</p>}
          <DeficiencyItems deficiency={d} app={app} />
        </Alert>
      );
    }
  }

  if (app.status === "DeficiencyResponded") {
    const d = [...app.deficiencies].reverse().find((x) => x.respondedAt);
    if (d) {
      return (
        <Alert status="info" title={`Corrected by the NGO on ${formatDate(d.respondedAt!)}`}>
          {d.response && <p className="text-body-2">The NGO&apos;s note: {d.response}</p>}
          <DeficiencyItems deficiency={d} app={app} />
        </Alert>
      );
    }
  }

  const query = [...app.queries].reverse().find((q) => !q.resolvedAt);
  if (app.status === "QueryRaised" && query) {
    const by = ROLES[query.raisedBy];
    return (
      <Alert status="warning" title="Returned to You from the Previous Level">
        <p className="text-body-2">
          {by ? `${by.personName}, ${by.grade ? GRADE_FULL[by.grade] : by.label}` : "An officer"}, returned this file on {formatDate(query.raisedAt)}: {query.detail}
        </p>
        <p className="mt-2 text-body-3">Answer it in your remarks and send the file back.</p>
      </Alert>
    );
  }

  if (app.status === "Returned") {
    const back = [...app.audit].reverse().find((e) => e.action === "return");
    if (back) {
      return (
        <Alert status="warning" title="Returned by the Programme Director">
          <p className="text-body-2">
            Returned on {formatDate(back.at)}: {back.remarks ?? "No reason was recorded."}
          </p>
        </Alert>
      );
    }
  }

  return null;
}

function DeficiencyItems({ deficiency, app }: { deficiency: Deficiency; app: GrantApplication }) {
  const items = deficiency.items ?? [];
  if (items.length === 0) return null;
  return (
    <ListGroup size="sm" aria-label="Items to correct" className="mt-2">
      {items.map((it) => {
        const doc = it.docId ? app.documents.find((d) => d.id === it.docId) : undefined;
        return (
          <ListRow
            key={it.id}
            title={it.label}
            description={
              <>
                {it.remark}
                {it.correctedAt && (
                  <span className="block">
                    Corrected {formatDate(it.correctedAt)}
                    {doc?.fileName ? ` · new file ${doc.fileName}` : ""}
                    {it.response && it.kind === "note" ? ` · answer: ${it.response}` : ""}
                  </span>
                )}
              </>
            }
          />
        );
      })}
    </ListGroup>
  );
}

/* ── The answers ──────────────────────────────────────────────────────────── */

function ApplicationAnswers({ app }: { app: GrantApplication }) {
  const values = app.formValues ?? {};
  const sections = answeredSections(app.schemeCode, values);
  return (
    <Panel title="Application">
      {sections.length === 0 ? (
        <p className="text-body-2 text-ink-muted">The form answers for this application were not recorded in the register.</p>
      ) : (
        // Flush: the panel is already the card. Ten shaded, shadowed cards inside it read as heavy
        // furniture beside the flat form language the applicant filled the same answers in.
        <Accordion variant="flush">
          {sections.map((s) => (
            <AccordionItem
              key={`${s.index}-${s.title}`}
              title={
                <span className="flex w-full flex-wrap items-center justify-between gap-2 pr-2">
                  <span className="text-body-2 font-semibold text-ink">
                    {s.index}. {s.title}
                  </span>
                  <span className="text-body-3 text-ink-muted">
                    {s.fields.length} question{s.fields.length === 1 ? "" : "s"}
                  </span>
                </span>
              }
            >
              <DescriptionList
                columns={2}
                size="sm"
                items={s.fields.map((f: FieldDef) => ({ term: fieldLabel(f, values), value: answer(f, values[f.name]) }))}
              />
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Panel>
  );
}

function answer(field: FieldDef, raw: string | undefined): string {
  const v = (raw ?? "").trim();
  if (!v) return "Not provided";
  if (field.kind === "date") return formatDate(v) || v;
  if (field.kind === "time") return formatTime(v) || v;
  if (field.kind === "checkbox") return v === "true" ? "Yes" : "No";
  return v;
}

/* ── local building blocks ──────────────────────────────────────────────── */

function toneOf(action: AuditAction): "neutral" | "info" | "success" | "warning" | "danger" {
  if (action === "sanction" || action === "concur" || action === "respondDeficiency" || action === "releaseFunds") return "success";
  if (action === "reject") return "danger";
  if (action === "raiseDeficiency" || action === "communicateDeficiency" || action === "raiseQuery" || action === "return" || action === "routeDown" || action === "showCauseIssued") return "warning";
  return "neutral";
}

function Facts({ items }: { items: [string, string][] }) {
  return <DescriptionList columns={2} size="sm" divided items={items.map(([term, value]) => ({ term, value }))} />;
}

const DOC_STATUSES: DocReviewStatus[] = ["Pending", "Verified", "Deficient", "Not applicable"];

/** The verdict as officers read it. "Deficient" is a document that needs correction — not a "query". */
const DOC_STATUS_LABEL: Record<DocReviewStatus, string> = {
  Pending: "Not reviewed",
  Verified: "Verified",
  Deficient: "Needs correction",
  "Not applicable": "Not applicable",
};

/**
 * The officer's own verdict on one document, beside the automatic check. The remark follows the
 * verdict, as settled in the review call of 11 Sep 2026 (T752–768, O5): nothing to remark while a
 * document is not reviewed, an optional remark when it is Verified, and a MANDATORY one when it
 * needs correction. Both are SAVED as they are made, so a refresh keeps them and a deficiency is
 * built from them.
 */
function OfficerVerdict({
  doc: d,
  editable,
  onReview,
}: {
  doc: MockDoc;
  editable: boolean;
  onReview: (doc: MockDoc, status: DocReviewStatus, remark: string) => void;
}) {
  const [remark, setRemark] = React.useState(d.officerRemarks ?? "");
  const [touched, setTouched] = React.useState(false);
  const status = d.reviewStatus;
  const needsRemark = status === "Deficient";
  const reviewer = docReviewerLine(d);

  if (!editable) {
    return (
      <div className="text-body-2">
        {/* Not "Your verdict": read-only, it is an earlier grade's — the line under it says whose. */}
        <span className="block text-body-3 text-ink-muted">Officer&apos;s Verdict</span>
        <span className="font-semibold text-ink">{DOC_STATUS_LABEL[status]}</span>
        {/* Who gave this verdict and when: "Verified by the Assistant Section Officer, 12 Sep 2026". */}
        {reviewer && <span className="block text-body-3 text-ink-muted"> {reviewer}</span>}
        {d.officerRemarks && <span className="block text-body-3 text-ink-muted">{d.officerRemarks}</span>}
      </div>
    );
  }
  return (
    <div className="grid items-start gap-2 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
      <Select
        size="sm"
        value={status}
        onChange={(e) => onReview(d, e.target.value as DocReviewStatus, remark)}
        aria-label={`Your verdict on ${d.title}`}
      >
        {DOC_STATUSES.map((s) => (
          <option key={s} value={s}>
            {DOC_STATUS_LABEL[s]}
          </option>
        ))}
      </Select>
      {status !== "Pending" && (
        <FormField
          id={`remark-${d.id}`}
          label={needsRemark ? "What must the NGO correct?" : `Remarks on ${d.title}`}
          labelHidden={!needsRemark}
          required={needsRemark}
          optional={!needsRemark}
          error={needsRemark && touched && !remark.trim() ? "Give the reason, so the NGO knows what to correct." : undefined}
        >
          {(c) => (
            <Input
              {...c}
              size="sm"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              onBlur={() => {
                setTouched(true);
                if (remark !== (d.officerRemarks ?? "")) onReview(d, status, remark);
              }}
              placeholder={needsRemark ? "" : "Remarks (optional)"}
            />
          )}
        </FormField>
      )}
    </div>
  );
}

/** A folded row's verdict line: "Verified by ASO, 21 Jul 2026 · with a remark". */
function verdictSummary(d: MockDoc): string {
  const by = d.reviewedBy ? ROLES[d.reviewedBy] : undefined;
  const who = by && d.reviewedAt ? ` by ${by.shortLabel}, ${formatDate(d.reviewedAt)}` : "";
  return `${DOC_STATUS_LABEL[d.reviewStatus]}${who}${d.officerRemarks?.trim() ? " · with a remark" : ""}`;
}

/** The automatic check on a submitted file: the one recorded at upload, or the check run now on a seeded file that carries none. */
function automaticCheck(app: GrantApplication, d: MockDoc): DocVerdict | undefined {
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

/**
 * The Documents list, as the live review screen draws it: annual documents (verified and remarked
 * each year) and permanent ones (one-time, view-only unless re-uploaded), each row with the
 * automatic check and its confidence as ADVICE, and the officer's own verdict beside it — the AI
 * observation kept at the side of the review, never in place of it (review call T752–771).
 */
function DocumentsPanel({
  app,
  editable,
  opened,
  onOpen,
  onReview,
}: {
  app: GrantApplication;
  editable: boolean;
  opened: ReadonlySet<string>;
  onOpen: (doc: MockDoc) => void;
  onReview: (doc: MockDoc, status: DocReviewStatus, remark: string) => void;
}) {
  const [historyOf, setHistoryOf] = React.useState<MockDoc | null>(null);
  const [reportOpen, setReportOpen] = React.useState<Record<string, boolean>>({});
  // Which rows are unfolded. A document whose verdict the officer changes in this sitting opens,
  // so a remark field never folds away under the hand that is typing in it.
  const [unfolded, setUnfolded] = React.useState<Record<string, boolean>>({});
  const review = (doc: MockDoc, status: DocReviewStatus, remark: string) => {
    setUnfolded((u) => (u[doc.id] ? u : { ...u, [doc.id]: true }));
    onReview(doc, status, remark);
  };
  const bySlot = [...app.documents].sort((a, b) => a.slot - b.slot);
  const groups = [
    { id: "annual", label: "Annual Documents", hint: "Verified and remarked each year", docs: bySlot.filter((d) => d.group === "annual") },
    { id: "permanent", label: "Permanent Documents", hint: "One-time — view only unless re-uploaded this year", docs: bySlot.filter((d) => d.group === "permanent") },
  ].filter((g) => g.docs.length > 0);
  const reviewed = app.documents.filter((d) => d.reviewStatus !== "Pending").length;
  const uploaded = app.documents.filter((d) => d.fileName).length;
  const facts = applicantFacts(app.formValues ?? {});
  // Read-only once the ASO has certified. Each verdict names who gave it; the certification line
  // stands in only where a verdict was recorded without that (a copy saved before it was kept).
  const unattributed = app.documents.some((d) => d.reviewStatus !== "Pending" && !docReviewerLine(d));
  const attribution = editable || !unattributed ? null : verdictAttribution(app);
  return (
    <Panel title={`Documents (${uploaded} Uploaded of ${app.documents.length} on the Checklist)`}>
      <div className="space-y-6">
        {attribution && <p className="text-body-3 text-ink-muted">{attribution}</p>}
        <DocumentChecklist visibleCount={app.documents.length} progressLabel={`${reviewed} of ${app.documents.length} documents reviewed`} ready={reviewed} required={app.documents.length}>
          {groups.map((g) => (
            <DocumentChecklistGroup key={g.id} title={g.label} description={g.hint}>
              {g.docs.map((d) => {
                const verdict = automaticCheck(app, d);
                const state = docState(d, verdict ? { verdict } : undefined);
                const flagged = state === "invalid" || state === "review";
                // A settled verdict folds to one line. Not reviewed, or needing correction, stays open:
                // those are what the officer must act on. 20 verified rows were 190–260px each.
                const settled = d.reviewStatus === "Verified" || d.reviewStatus === "Not applicable";
                return (
                  <DocumentRow
                    key={d.id}
                    linkAs={Link}
                    number={d.slot}
                    title={d.title}
                    required={!d.optional}
                    state={rowStateOf(state)}
                    statusLabel={d.fileName ? officerCheckLabel(verdict) : d.optional ? "Optional · not uploaded" : "Not uploaded"}
                    collapsible={settled}
                    expanded={!!unfolded[d.id]}
                    onExpandedChange={(open) => setUnfolded((u) => ({ ...u, [d.id]: open }))}
                    summary={verdictSummary(d)}
                    hint={
                      [
                        d.group === "annual" && d.uploadedAt ? "This year's document" : null,
                        d.versions?.length ? `${d.versions.length} earlier version${d.versions.length === 1 ? "" : "s"} on record` : null,
                        d.reUploadedThisYear ? "Permanent document, re-uploaded this year" : null,
                        opened.has(d.id) ? "Opened" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || undefined
                    }
                    file={d.fileName ? { name: d.fileName, size: d.sizeKb != null ? fileSizeLabel(d.sizeKb) : undefined, date: d.uploadedAt ? formatDate(d.uploadedAt) : undefined } : undefined}
                    reason={flagged ? (verdict?.reasons?.[0] ?? verdict?.summary) : undefined}
                    findings={verdict && verdict.state !== "pending" && verdict.state !== "unavailable" ? <Findings verdict={verdict} title={d.title} facts={facts} applicationFy={app.financialYear} officer /> : undefined}
                    findingsLabel="Automatic check report"
                    // Open under the row only where the check found something; otherwise from the menu.
                    showFindingsToggle={flagged}
                    findingsOpen={flagged ? undefined : !!reportOpen[d.id]}
                    action={
                      d.fileName ? (
                        <Button appearance="outlined" size="sm" nowrap onClick={() => onOpen(d)} aria-label={`View ${d.title}`}>
                          <Icon name="visibility" size={16} aria-hidden /> View
                        </Button>
                      ) : undefined
                    }
                    menu={
                      d.fileName
                        ? {
                            items: [
                              ...(!flagged && verdict && verdict.state !== "pending" && verdict.state !== "unavailable"
                                ? [{ id: "report", label: reportOpen[d.id] ? "Hide Automatic Check Report" : "Automatic Check Report", icon: "fact_check" }]
                                : []),
                              { id: "history", label: "Upload History", icon: "history" },
                            ],
                            onSelect: (id: string) => (id === "report" ? setReportOpen((o) => ({ ...o, [d.id]: !o[d.id] })) : setHistoryOf(d)),
                          }
                        : undefined
                    }
                    aside={<OfficerVerdict doc={d} editable={editable} onReview={review} />}
                  />
                );
              })}
            </DocumentChecklistGroup>
          ))}
        </DocumentChecklist>

        <OfficerSupportingDocuments app={app} editable={editable} />
      </div>
      <DocumentHistorySheet
        open={historyOf != null}
        onClose={() => setHistoryOf(null)}
        title={historyOf ? `Upload History — ${historyOf.title}` : ""}
        linkAs={Link}
        entries={historyEntriesOfRecord(historyOf ?? {}).map((h) => ({
          id: h.id,
          fileName: h.fileName,
          size: h.sizeKb != null ? fileSizeLabel(h.sizeKb) : undefined,
          date: h.uploadedOn,
          current: h.current,
          status: h.status,
          note: h.note,
          onView: h.current && historyOf ? () => { onOpen(historyOf); setHistoryOf(null); } : undefined,
        }))}
      />
    </Panel>
  );
}

/**
 * "Officer Supporting Documents (n)" — files an officer attaches to the review, with an optional
 * title, as the live DECISION screens carry them.
 */
function OfficerSupportingDocuments({ app, editable }: { app: GrantApplication; editable: boolean }) {
  const { addOfficerDocument, removeOfficerDocument } = useEAnudaan();
  const [title, setTitle] = React.useState("");
  const [refused, setRefused] = React.useState<string | null>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const files = app.officerDocuments ?? [];
  const rule = acceptFromNote("PDF / JPG / PNG · Max 5 MB per file");
  return (
    <div className="space-y-3">
      <SectionTitle as={3} title={`Officer Supporting Documents (${files.length})`} description={editable ? "Attached to your forward, deficiency or query, and kept with the file." : undefined} />
      {files.length > 0 ? (
        <ListGroup size="sm" aria-label="Officer supporting documents">
          {files.map((f) => (
            <ListRow
              key={f.id}
              leading={<Icon name="attach_file" size={20} className="text-ink-muted" />}
              title={f.title ?? f.fileName}
              description={`${f.title ? `${f.fileName} · ` : ""}${fileSizeLabel(f.sizeKb)} · ${ROLES[f.uploadedBy]?.label ?? "Officer"}, ${formatDate(f.uploadedAt)}`}
              trailing={
                editable ? (
                  <Button appearance="text" size="sm" onClick={() => removeOfficerDocument(app.id, f.id)} aria-label={`Remove ${f.title ?? f.fileName}`}>
                    Remove
                  </Button>
                ) : undefined
              }
            />
          ))}
        </ListGroup>
      ) : (
        <p className="text-body-2 text-ink-muted">No supporting document has been attached.</p>
      )}
      {editable && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-64">
            <FormField id={`odoc-title-${app.id}`} label="Document Title" optional hint={rule.label}>
              {(c) => <Input {...c} size="sm" value={title} onChange={(e) => setTitle(e.target.value)} />}
            </FormField>
          </div>
          <Button appearance="outlined" size="sm" onClick={() => input.current?.click()}>
            <Icon name="upload" size={16} aria-hidden /> Upload PDF, JPG or PNG
          </Button>
          <input
            ref={input}
            type="file"
            accept={rule.inputAccept}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              const file = { name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) };
              const why = rejectionOf(file, rule);
              if (why) {
                setRefused(why === "rejected-size" ? `${f.name} is ${fileSizeLabel(file.sizeKb)}. The limit is 5 MB.` : `${f.name} is not a PDF, JPG or PNG file.`);
                return;
              }
              setRefused(null);
              addOfficerDocument(app.id, { ...file, title });
              setTitle("");
            }}
          />
          {refused && (
            <p className="basis-full text-body-3 text-[var(--sa-text-status-error-bolder)]" role="alert">
              {refused}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
