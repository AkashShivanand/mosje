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
  Menu,
  Modal,
  SectionTitle,
  SegmentedControl,
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
  verdictAttribution,
  type ActionPayload,
  type DecisionContext,
  type Rule,
} from "@/lib/e-anudaan/workflow";
import { formatGrant, schemeLabel, statusTone } from "@/lib/e-anudaan/selectors";
import { formatDate, formatTime, rupees } from "@/lib/e-anudaan/format";
import { answeredSections, ordinal, projectTitleFor } from "@/lib/e-anudaan/applicant";
import { OFFICER_VERDICT } from "@/lib/e-anudaan/glossary";
import {
  answeredDeficiency,
  asoForwardBlockers,
  automaticCheckOf,
  awaitingVerdict,
  bulkVerifiable,
  correctedDocIds,
  isFlagged,
  matchesReviewFilter,
  verdictProgress,
  type ReviewDocFilter,
} from "@/lib/e-anudaan/review-readiness";
import { fieldLabel, type FieldDef } from "@/lib/e-anudaan/form-schema";
import type { DocVerdict } from "@/lib/e-anudaan/doc-verification";
import { holderIsRole, type AuditAction, type Deficiency, type DocReviewStatus, type GrantApplication, type MockDoc, type RoleId } from "@/lib/e-anudaan/types";
import { RefText } from "./worklist-table";
import { ServiceErrorNotice, useServiceErrors } from "./service-error";
import { DocumentPreviewSheet } from "./document-preview-sheet";
import {
  CostNormsReview,
  FundingHistory,
  InspectionsPanel,
  InstalmentsPanel,
  Panel,
  ShowCausePanel,
  canIssueShowCause,
  canScheduleInspection,
  officerCheckLabel,
  schemeNorms,
} from "./review-panels";
import { ReviewReport } from "./review-report";
import { ProjectRecordsSummary } from "./project-records";
import { Findings, rowStateOf } from "./document-centre-parts";
import {
  acceptFromNote,
  applicantFacts,
  docState,
  fileSizeLabel,
  historyEntriesOfRecord,
  REFUSAL_OF,
  rejectionOf,
  rowReason,
} from "@/lib/e-anudaan/document-centre";
import { deviceCheckOfBytes } from "@/lib/e-anudaan/doc-checks";
import { decisionProblems, sanctionAmountsInvalid } from "@/lib/e-anudaan/officer-forms";
import type { DemoFormPreset } from "@/lib/e-anudaan/demo-forms";
import { resolveSanction } from "@/lib/e-anudaan/demo-forms/officer-values";
import { REVIEW_DEFICIENCY } from "@/lib/e-anudaan/demo-forms/review-deficiency";
import { REVIEW_FORWARD } from "@/lib/e-anudaan/demo-forms/review-forward";
import { REVIEW_REJECT } from "@/lib/e-anudaan/demo-forms/review-reject";
import { REVIEW_RESPOND } from "@/lib/e-anudaan/demo-forms/review-respond";
import { REVIEW_RETURN_DIRECTOR } from "@/lib/e-anudaan/demo-forms/review-return-director";
import { REVIEW_RETURN_PREVIOUS } from "@/lib/e-anudaan/demo-forms/review-return-previous";
import { REVIEW_SANCTION } from "@/lib/e-anudaan/demo-forms/review-sanction";
import { REVIEW_SEND_DEFICIENCY } from "@/lib/e-anudaan/demo-forms/review-send-deficiency";
import { useDemoFormFill } from "./use-demo-form-fill";

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
 *
 * Rebuilt again after the design-director audit of 16 Sep 2026:
 *   R-01  the decision panel says what still blocks the forward BEFORE it is pressed, links to the
 *         documents concerned, and reads its reason at text contrast, not in the disabled style.
 *   R-03  verdicts are given in compact rows, two options in the row, with a bulk verdict for the
 *         documents the automatic check found nothing wrong with.
 *   R-02  the documents a correction changed are named, filtered and linked from the banner.
 *   R-04  Schedule Inspection, Issue Show Cause Notice and Generate Review Report moved into
 *         "More Actions" beside the decision; the cards below carry history only.
 *   R-05  the sanction amounts are prefilled with the amounts sought, grouped as they are typed.
 *   R-06  one count of the examination: `verdictProgress`.
 *   R-08  a sticky summary bar carries the decision to the officer on a phone.
 *
 * DS Audit: Accordion ✅ · Alert ✅ · Badge ✅ · Button ✅ · Checkbox ✅ · DescriptionList ✅ ·
 * DocumentChecklist (`bulkAction`, `filters`) ✅ · DocumentRow (`density="compact"`, `clampReason`)
 * ✅ · DocumentHistorySheet ✅ · EventList ✅ · FormField / Input / Textarea ✅ · Icon ✅ ·
 * ListGroup / ListRow ✅ · Menu ✅ · Modal ✅ · SectionTitle ✅ · SegmentedControl ✅ ·
 * StatusScreen ✅ — nothing new. ⚑ The "Before You Forward" checklist and the phone summary bar are
 * assembled here from DS parts: `Stepper` carries no step BODY (a link, a checkbox), and the estate
 * has no sticky action bar yet. Both are proposed for the DS as one `DecisionPanel` template
 * (audit §4.9, §4.10) and should move there when it is built.
 */
export function ReviewShell({ appId }: { appId: string }) {
  const router = useRouter();
  const { state, findApp, findNgo, act, reviewDocument } = useEAnudaan();
  const { toast } = useToast();
  /** The simulated request layer: a decision can fail with a catalogued error (error-catalogue.ts). */
  const requests = useServiceErrors();

  const app = findApp(appId);
  const role = state.session ? ROLES[state.session] : null;

  const [remarks, setRemarks] = React.useState("");
  const [certifyTicked, setCertifyTicked] = React.useState(false);
  const [confirming, setConfirming] = React.useState<Rule | null>(null);
  // The sanction amounts are PREFILLED with the amounts sought and may be edited down (audit R-05:
  // the Director retyped two figures on every sanction, ungrouped). Nothing is committed on a
  // single press: the confirmation dialog reads both figures and the total back before the order
  // is issued, which is what UX-03 of 14 Sep asked for when it emptied the fields.
  const [recurring, setRecurring] = React.useState<string | null>(null);
  const [nonRecurring, setNonRecurring] = React.useState<string | null>(null);
  const [previewing, setPreviewing] = React.useState<MockDoc | null>(null);
  const [reportOpen, setReportOpen] = React.useState(false);
  // The dialog the decision panel's "More Actions" opened (audit R-04): both used to be buttons on
  // cards about 5,000px below the decision they belong to.
  const [dialog, setDialog] = React.useState<"showCause" | "inspection" | null>(null);
  // The decision the officer last pressed with something missing. One inline message per missing
  // thing, shown only then — the screen used to explain every disabled button in standing prose.
  const [attempted, setAttempted] = React.useState<Rule | null>(null);
  // A forward asked for while a document stands marked Needs Correction. The file normally goes
  // back to the NGO; the officer may still send it up, and the file then carries that they were
  // asked (coordinator's decision, 16 Sep 2026).
  const [forwardWarning, setForwardWarning] = React.useState<Rule | null>(null);
  /**
   * The document filter, and the rows it was showing when it was chosen. The membership is FROZEN
   * at that moment on purpose: under a live filter, giving a verdict made the row vanish from
   * under the officer's hand and took the focus with it. The chip's count stays live.
   */
  const [docFilter, setDocFilter] = React.useState<{ id: ReviewDocFilter; ids: readonly string[] } | null>(null);
  /**
   * A row to scroll to and focus once the filter it belongs to has been applied. The counter makes
   * a second jump to the SAME row a new value, so the effect runs again without writing state.
   */
  const [focusDoc, setFocusDoc] = React.useState<{ id: string; n: number } | null>(null);

  React.useEffect(() => {
    if (!focusDoc) return;
    const el = document.getElementById(docRowId(focusDoc.id));
    el?.scrollIntoView({ block: "center" });
    el?.focus({ preventScroll: true });
  }, [focusDoc]);

  /**
   * The demo dock's fills for the decision (lib/e-anudaan/demo-forms). A fill sets the remarks, the
   * sanction amounts and, where the preset marks a document, that document's verdict — then shows
   * the message the decision's rule gives, as pressing the button would, without deciding. A
   * decision this seat cannot make on this file says so and changes nothing.
   */
  const fillDecision = (title: string) => (v: Readonly<Record<string, string>>, preset: DemoFormPreset) => {
    if (!app || !role) return;
    const permitted = permittedActions(app, role).filter((a) => a.action !== "certify");
    const pendingCertification = role.caps.includes("certify") && holderIsRole(app.holder, role.id) && !app.certifiedAt;
    const rule =
      permitted.find((a) => a.action === v.decision) ??
      (v.decision === "forward"
        ? pendingCertification
          ? RULES.find((r) => r.action === "forward")
          : permitted.find((a) => a.action === "concur")
        : undefined);
    if (!rule) {
      toast(`${title} is not open to you on this file.`, "info");
      return;
    }
    if (v.mark) {
      if (!canEditDocVerdicts(app, role)) {
        toast("Only the examining officer marks documents on this file.", "info");
        return;
      }
      const doc = app.documents.find((d) => d.fileName && /audit/i.test(d.title)) ?? app.documents.find((d) => d.fileName);
      if (doc) reviewDocument(app.id, doc.id, "Deficient", v.mark === "with-reason" ? (v.markReason ?? "").replace("{document}", doc.title) : "");
    }
    setRemarks(v.remarks ?? "");
    if (rule.action === "sanction") {
      const norm = schemeNorms(app);
      if (v.recurring === "above-norm" && !norm) toast("Cost norms are held for AVYAY files only. The amounts sought are filled.", "info");
      const amounts = resolveSanction(v, { recurring: app.recurring, nonRecurring: app.nonRecurring, norm });
      setRecurring(amounts.recurring);
      setNonRecurring(amounts.nonRecurring);
    }
    setConfirming(null);
    // A forward over a marked document is not an error: it is the question pressing Forward asks.
    const asksFirst = !preset.valid && rule.action === "forward" && !!v.mark;
    setForwardWarning(asksFirst ? rule : null);
    setAttempted(preset.valid || asksFirst ? null : rule);
  };
  useDemoFormFill(REVIEW_SANCTION.id, fillDecision(REVIEW_SANCTION.title));
  useDemoFormFill(REVIEW_FORWARD.id, fillDecision(REVIEW_FORWARD.title));
  useDemoFormFill(REVIEW_DEFICIENCY.id, fillDecision(REVIEW_DEFICIENCY.title));
  useDemoFormFill(REVIEW_SEND_DEFICIENCY.id, fillDecision(REVIEW_SEND_DEFICIENCY.title));
  useDemoFormFill(REVIEW_RESPOND.id, fillDecision(REVIEW_RESPOND.title));
  useDemoFormFill(REVIEW_RETURN_PREVIOUS.id, fillDecision(REVIEW_RETURN_PREVIOUS.title));
  useDemoFormFill(REVIEW_RETURN_DIRECTOR.id, fillDecision(REVIEW_RETURN_DIRECTOR.title));
  useDemoFormFill(REVIEW_REJECT.id, fillDecision(REVIEW_REJECT.title));

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
  const recurringText = recurring ?? String(app.recurring);
  const nonRecurringText = nonRecurring ?? String(app.nonRecurring);
  const sanctionR = Number(recurringText);
  const sanctionNR = Number(nonRecurringText);
  const sanctionEntered = recurringText !== "" || nonRecurringText !== "";
  const sanctionInvalid = sanctioning && sanctionAmountsInvalid({ recurring: recurringText, nonRecurring: nonRecurringText, sought: app.total });

  /* ── One reading of the file, read by everything that states it (audit R-01, R-06) ─────────── */
  const checkOf = (d: MockDoc) => automaticCheckOf(app, d);
  const progress = verdictProgress(app);
  const awaiting = awaitingVerdict(app);
  // The seat that certifies — the Assistant Section Officer. Its forward waits on the verdicts and
  // on the certification, and the panel says which BEFORE the button is pressed (audit R-01).
  const certifyingSeat = holdsFile && role.caps.includes("certify");
  const blockers = certifyingSeat ? asoForwardBlockers(app) : [];
  const forwardBlocked = certifyingSeat && blockers.length > 0;
  const bulk = docsEditable ? bulkVerifiable(app, checkOf) : [];
  const norms = schemeNorms(app);
  // Stated whenever the figure entered is above the norm — including while it is also above the
  // amount sought, when the error below says so too: the two are different facts.
  const overNorm = norms != null && sanctionEntered && sanctionR + sanctionNR > norms.total;
  const corrected = correctedDocIds(app);
  const correctionNote = answeredDeficiency(app);

  const ngoName = ngo?.name ?? app.ngoId;
  /** A forward sent over a marked document says so on the file, in the officer's own entry. */
  const forwardingOverMarked = (rule: Rule) => rule.action === "forward" && markedDocs > 0;
  const payloadFor = (rule: Rule): ActionPayload => ({
    remarks: forwardingOverMarked(rule)
      ? `${remarks.trim()} [Forwarded with ${markedDocs} document${markedDocs === 1 ? "" : "s"} marked Needs Correction; the NGO was not asked to correct ${markedDocs === 1 ? "it" : "them"}.]`
      : remarks,
    certified: certifyTicked,
    items: rule.action === "raiseDeficiency" ? deficiencyItems : undefined,
    sanction: rule.action === "sanction" ? { recurring: sanctionR, nonRecurring: sanctionNR } : undefined,
  });
  const contextFor = (rule: Rule): DecisionContext => ({ app, role, payload: payloadFor(rule), ngoName, project });

  /** What stops this decision, as the messages beside the fields concerned. Empty when it can go. */
  const problemsOf = (rule: Rule) => ({
    ...decisionProblems(rule, { remarks, recurring: recurringText, nonRecurring: nonRecurringText, sought: app.total, items: deficiencyItems }),
    certification: rule.action === "forward" && forwardBlocked ? forwardBlockedReason(blockers, awaiting.length) : undefined,
  });
  const problems: Partial<ReturnType<typeof problemsOf>> = attempted ? problemsOf(attempted) : {};

  const commit = (rule: Rule) => {
    const ctx = contextFor(rule);
    setConfirming(null);
    if (requests.attempt("officer-action")) return;
    requests.clear();
    const res = act(app.id, rule.action, ctx.payload);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(rule.outcome({ ...ctx, after: res.app }), "success");
    setRemarks("");
    if (rule.action !== "certify") router.push(role.home);
  };

  /** An irreversible or outward decision is read back first; everything else commits. */
  const decide = (rule: Rule, { overMarked = false }: { overMarked?: boolean } = {}) => {
    const p = problemsOf(rule);
    if (p.remarks || p.certification || p.sanction || p.deficiency) {
      setAttempted(rule);
      document.getElementById(p.remarks ? "officer-remarks" : p.sanction ? "sanction-recurring" : "officer-decision")?.focus();
      return;
    }
    setAttempted(null);
    // A file with a document the officer has marked as defective normally goes back to the NGO.
    // It may still go up, but the officer is asked, and the answer is written on the file.
    if (!overMarked && forwardingOverMarked(rule)) {
      setForwardWarning(rule);
      return;
    }
    if (rule.confirm?.(contextFor(rule))) setConfirming(rule);
    else commit(rule);
  };
  const confirmCopy = confirming?.confirm?.(contextFor(confirming)) ?? null;
  const openDocument = (doc: MockDoc) => setPreviewing(doc);

  /** Show one question's documents and put the officer on the first of them (audit R-01). */
  const showDocuments = (filter: ReviewDocFilter, focusId?: string) => {
    const ids = documentsInOrder(app)
      .filter((d) => matchesReviewFilter(app, d, filter, checkOf))
      .map((d) => d.id);
    setDocFilter({ id: filter, ids });
    const target = focusId ?? ids[0];
    if (target) setFocusDoc((prev) => ({ id: target, n: (prev?.n ?? 0) + 1 }));
  };

  /** One verdict per document, in the officer's name, after the confirmation (audit R-03). */
  const verifyRemaining = () => {
    for (const d of bulk) reviewDocument(app.id, d.id, "Verified", d.officerRemarks ?? "");
    toast(
      `${bulk.length} document${bulk.length === 1 ? "" : "s"} marked Verified. Each verdict can still be changed.`,
      "success",
    );
  };

  const goToDecision = () => {
    document.getElementById("review-decision")?.scrollIntoView({ block: "start" });
    document.getElementById("officer-decision")?.focus({ preventScroll: true });
  };

  /** "More Actions": everything that is not the decision itself, beside the decision (audit R-04). */
  const moreActions = [
    ...(canScheduleInspection(state, app) ? [{ id: "inspection", label: "Schedule Online Inspection", icon: "videocam" }] : []),
    ...(canIssueShowCause(app, state.session) ? [{ id: "showCause", label: "Issue Show Cause Notice", icon: "gavel" }] : []),
    { id: "report", label: "Generate Review Report", icon: "description" },
  ];
  const onMoreAction = (id: string) => {
    if (id === "report") setReportOpen(true);
    else setDialog(id as "showCause" | "inspection");
  };

  const previewedDoc = previewing ? (app.documents.find((d) => d.id === previewing.id) ?? previewing) : null;

  const primary = decisions.filter((d) => d.intent === "primary");
  const secondary = decisions.filter((d) => d.intent === "secondary");
  const danger = decisions.filter((d) => d.intent === "danger");
  // With a document marked Needs Correction, raising the deficiency is the file's normal next move
  // and leads the buttons; the forward stays available, one press and one question away.
  const deficiencyRule = decisions.find((d) => d.action === "raiseDeficiency");
  const deficiencyLeads = markedDocs > 0 && !!deficiencyRule;

  // A decision on a file that is no longer there, or a role that may not make it, replaces the page.
  if (requests.failure?.target === "page") {
    return <ServiceErrorNotice failure={requests.failure} homeHref={role.home} onDismiss={requests.clear} />;
  }

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
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="min-w-0 space-y-5">
          <OpenItem app={app} onShowDocument={(docId) => showDocuments("changed", docId)} />

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
            viewer={state.session}
            checkOf={checkOf}
            corrected={corrected}
            progressLabel={progress.label}
            filter={docFilter}
            onFilter={(id) => (id ? showDocuments(id) : setDocFilter(null))}
            bulk={bulk}
            onVerifyRemaining={verifyRemaining}
            onOpen={openDocument}
            onReview={(doc, status, remark) => reviewDocument(app.id, doc.id, status, remark)}
          />

          <FundingHistory app={app} />

          <ProjectRecordsSummary app={app} />

          <InstalmentsPanel app={app} />

          <ShowCausePanel app={app} dialogOpen={dialog === "showCause"} onDialogOpen={() => setDialog("showCause")} onDialogClose={() => setDialog(null)} />

          <InspectionsPanel app={app} dialogOpen={dialog === "inspection"} onDialogOpen={() => setDialog("inspection")} onDialogClose={() => setDialog(null)} />

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
        <aside id="review-decision" className="space-y-5 xl:sticky xl:top-4" aria-label="Your decision">
          <ServiceErrorNotice
            failure={requests.failure}
            homeHref={role.home}
            field={{ id: "officer-remarks", label: "Remarks" }}
            onRetry={requests.clear}
            onDismiss={requests.clear}
          />
          {sanctioning && (
            <Panel title="Sanction Order">
              <p className="mb-3 text-body-3 text-ink-muted">
                Both amounts are filled with what the NGO sought. Change either to sanction less; the sanction may not exceed {rupees(app.total)}.
              </p>
              <div className="space-y-3">
                <FormField
                  label="Recurring Grant"
                  id="sanction-recurring"
                  required
                  hint={`Sought: ${rupees(app.recurring)}${norms ? ` · admissible under the norms: ${rupees(norms.recurring)}` : ""}`}
                >
                  {(c) => (
                    <Input
                      {...c}
                      inputMode="numeric"
                      prefix="₹"
                      prefixLabel="rupees"
                      className="tabular-nums"
                      value={grouped(recurringText)}
                      onChange={(e) => setRecurring(digits(e.target.value))}
                    />
                  )}
                </FormField>
                <FormField
                  label="Non-Recurring Grant"
                  id="sanction-non-recurring"
                  required
                  hint={`Sought: ${rupees(app.nonRecurring)}${norms ? ` · admissible under the norms: ${rupees(norms.nonRecurring)}` : ""}`}
                >
                  {(c) => (
                    <Input
                      {...c}
                      inputMode="numeric"
                      prefix="₹"
                      prefixLabel="rupees"
                      className="tabular-nums"
                      value={grouped(nonRecurringText)}
                      onChange={(e) => setNonRecurring(digits(e.target.value))}
                    />
                  )}
                </FormField>
                <p className="text-body-2 text-ink">
                  Total to sanction: <strong className="tabular-nums">{sanctionEntered ? rupees(sanctionR + sanctionNR) : "Not entered"}</strong>
                </p>
                {sanctionEntered && !sanctionInvalid && sanctionR + sanctionNR < app.total && (
                  <p className="text-body-3 text-[var(--sa-text-status-warning-bolder)]">
                    {rupees(app.total - sanctionR - sanctionNR)} less than the amount sought.
                  </p>
                )}
                {/* The cost norms are read here as well as on the panel below, because this is
                    where the figure is decided (coordinator's decision, 16 Sep 2026). */}
                {norms && (
                  <p className={`text-body-3 ${overNorm ? "text-[var(--sa-text-status-warning-bolder)]" : "text-ink-muted"}`}>
                    {overNorm
                      ? `${rupees(sanctionR + sanctionNR - norms.total)} above the ${rupees(norms.total)} admissible under the scheme's cost norms.`
                      : `Admissible under the scheme's cost norms: ${rupees(norms.total)}.`}
                  </p>
                )}
                {(problems.sanction || (sanctionInvalid && sanctionEntered)) && (
                  <p className="text-body-3 text-[var(--sa-text-status-error-bolder)]" role="alert">
                    Enter both amounts. Together they must be more than ₹0 and no more than the {rupees(app.total)} sought.
                  </p>
                )}
              </div>
            </Panel>
          )}

          <Panel
            title="Your Decision"
            actions={
              <Menu items={moreActions} onSelect={onMoreAction} label="More actions on this file">
                <Button appearance="outlined" size="sm" nowrap>
                  More Actions <Icon name="expand_more" size={16} aria-hidden />
                </Button>
              </Menu>
            }
          >
            <span id="officer-decision" tabIndex={-1} className="sr-only">Your decision</span>
            {!holdsFile ? (
              <p className="text-body-2 text-ink-muted">
                This application is not with you. Its status is <strong className="text-ink">{statusLabel(app)}</strong>, and you are viewing it read-only.
              </p>
            ) : (
              <div className="space-y-4">
                {/* What the file still needs, BEFORE the button is pressed (audit R-01). */}
                {certifyingSeat && (
                  <BeforeForwarding
                    progress={progress}
                    awaiting={awaiting.length}
                    certifiedAt={app.certifiedAt}
                    onShowAwaiting={() => showDocuments("awaiting")}
                  />
                )}
                {canCertify && (
                  <div className="space-y-3 rounded-md bg-surface-muted p-3">
                    <Checkbox
                      checked={certifyTicked && awaiting.length === 0}
                      disabled={awaiting.length > 0}
                      onChange={(e) => setCertifyTicked(e.target.checked)}
                      // The certification step the scheme rules require before the file moves on (BR-SM2-05).
                      label="I certify that the application and documents have been examined and are complete and correct as per scheme guidelines."
                      description={
                        awaiting.length > 0
                          ? "Available once every required document has your verdict."
                          : undefined
                      }
                    />
                    <Button
                      appearance="outlined"
                      disabled={!certifyTicked || awaiting.length > 0}
                      onClick={() => decide(actions.find((a) => a.action === "certify")!)}
                    >
                      Record Certification
                    </Button>
                  </div>
                )}
                {!certifyingSeat && corrected.size > 0 && correctionNote && (
                  <p className="text-body-3 text-ink-muted">
                    {corrected.size} document{corrected.size === 1 ? " was" : "s were"} replaced by the NGO on {formatDate(correctionNote.respondedAt!)}.{" "}
                    <Button appearance="text" size="sm" onClick={() => showDocuments("changed")}>
                      Review the Changed Documents
                    </Button>
                  </p>
                )}
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
                  {/* With a document marked Needs Correction, the deficiency leads and the forward
                      steps back to an outlined control: the file's normal next move is the NGO's. */}
                  {deficiencyLeads && (
                    <Button fullWidth onClick={() => decide(deficiencyRule!)}>
                      {deficiencyRule!.label(role, app)}
                    </Button>
                  )}
                  {primary.map((a) => (
                    <Button
                      key={a.action}
                      fullWidth
                      appearance={deficiencyLeads ? "outlined" : undefined}
                      disabled={a.action === "forward" && forwardBlocked}
                      aria-describedby={a.action === "forward" && forwardBlocked ? "forward-blocked" : undefined}
                      onClick={() => decide(a)}
                    >
                      {a.label(role, app)}
                    </Button>
                  ))}
                  {certificationPending && (
                    <Button
                      fullWidth
                      appearance={deficiencyLeads ? "outlined" : undefined}
                      disabled={forwardBlocked}
                      aria-describedby={forwardBlocked ? "forward-blocked" : undefined}
                      onClick={() => decide(forwardRule)}
                    >
                      {forwardRule.label(role, app)}
                    </Button>
                  )}
                  {/* The reason a disabled button is disabled is read at body contrast, not in the
                      disabled style it explains — it was #8f949d on white, 3.04:1 (audit R-01). */}
                  {forwardBlocked && (
                    <p id="forward-blocked" className="text-body-3 text-ink-muted">
                      {forwardBlockedReason(blockers, awaiting.length)}
                    </p>
                  )}
                  {secondary
                    .filter((a) => !(deficiencyLeads && a.action === "raiseDeficiency"))
                    .map((a) => (
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
                {problems.deficiency && (
                  <p className="text-body-3 text-[var(--sa-text-status-error-bolder)]" role="alert">
                    {problems.deficiency}
                  </p>
                )}
              </div>
            )}
          </Panel>
        </aside>
      </div>

      {/*
        On a phone the decision is the last block on a 9,000px page (audit R-08). This bar holds the
        one thing the officer needs to know from anywhere on the file — what is still missing — and
        the way back to the decision. It marks itself as an occupant of the bottom-right corner rail
        (floating-element-placement.md), so the accessibility widget stacks above it rather than on
        it. Above 1280px the decision is beside the file and the bar is not drawn.
      */}
      {holdsFile && (
        <div
          data-sa-corner-occupant=""
          className="sticky bottom-0 z-[var(--sa-z-sticky)] -mx-4 border-t border-border bg-surface px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] xl:hidden"
        >
          {/* The right gutter keeps the button clear of the accessibility widget, which is
              third-party markup parked in the same corner and cannot be moved. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pe-[4.5rem]">
            <p className="min-w-[9rem] flex-1 text-body-3 text-ink-muted">
              <span className="block font-semibold text-ink">Your Decision</span>
              {decisionStandFirst({ blockers, awaiting: awaiting.length, primary, role, app })}
            </p>
            <Button size="sm" nowrap onClick={goToDecision}>
              Go to Decision
            </Button>
          </div>
        </div>
      )}

      {/* A forward over a document the officer has marked as defective. Not a block — the officer
          may have a reason — but the question is asked and the answer goes onto the file. */}
      <Modal
        open={forwardWarning !== null}
        onClose={() => setForwardWarning(null)}
        size="sm"
        title={`Forward with ${markedDocs} Document${markedDocs === 1 ? "" : "s"} Marked Needs Correction?`}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            {deficiencyRule && (
              <Button
                appearance="outlined"
                onClick={() => {
                  setForwardWarning(null);
                  decide(deficiencyRule);
                }}
              >
                Raise Deficiency
              </Button>
            )}
            <Button
              onClick={() => {
                const rule = forwardWarning;
                setForwardWarning(null);
                if (rule) decide(rule, { overMarked: true });
              }}
            >
              Forward Anyway
            </Button>
          </div>
        }
      >
        <p className="text-body-2 text-ink">
          The NGO has not been asked to correct {markedDocs === 1 ? "it" : "them"}. Forwarding sends the file up the chain with the
          {markedDocs === 1 ? " document" : " documents"} as {markedDocs === 1 ? "it stands" : "they stand"}, and your entry on the file records that.
        </p>
      </Modal>

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
            {/* The norm is stated again where the order is issued, not only in the panel above. */}
            {confirming?.action === "sanction" && overNorm && norms && (
              <p className="text-body-2 text-[var(--sa-text-status-warning-bolder)]" role="alert">
                This is {rupees(sanctionR + sanctionNR - norms.total)} above the {rupees(norms.total)} admissible under the scheme&apos;s cost norms.
              </p>
            )}
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
        doc={previewedDoc}
        verdict={previewedDoc ? VERDICT_LABEL[previewedDoc.reviewStatus] : undefined}
        verdictControl={
          previewedDoc && docsEditable ? (
            <VerdictControl
              doc={previewedDoc}
              editable
              onReview={(doc, status, remark) => reviewDocument(app.id, doc.id, status, remark)}
            />
          ) : undefined
        }
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
function OpenItem({ app, onShowDocument }: { app: GrantApplication; onShowDocument: (docId: string) => void }) {
  const proposed = proposedDeficiency(app);
  if (proposed) {
    return (
      <Alert status="warning" title="Deficiency Noted by the ASO — Not Yet Sent to the NGO">
        <p className="text-body-2">
          Noted on {formatDate(proposed.raisedAt)} by {ROLES[proposed.raisedBy]?.label ?? "the ASO"}: {proposed.detail}
        </p>
        <DeficiencyItems deficiency={proposed} app={app} onShowDocument={onShowDocument} />
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
          <DeficiencyItems deficiency={d} app={app} onShowDocument={onShowDocument} />
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
          <DeficiencyItems deficiency={d} app={app} onShowDocument={onShowDocument} />
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

/**
 * What the deficiency asked for, and — once the NGO has answered — what came back. Each corrected
 * DOCUMENT is a way into its own row, and each corrected FIELD prints the answer as submitted
 * beside the answer now on the file: the Section Officer had to hunt the three changed items among
 * twenty rows and could not see what a figure had been changed from (audit R-02).
 */
function DeficiencyItems({
  deficiency,
  app,
  onShowDocument,
}: {
  deficiency: Deficiency;
  app: GrantApplication;
  onShowDocument: (docId: string) => void;
}) {
  const items = deficiency.items ?? [];
  const changes = deficiency.changes ?? [];
  if (items.length === 0 && changes.length === 0) return null;
  const values = app.formValues ?? {};
  return (
    <>
    {changes.length > 0 && (
      // Answers the NGO changed beyond the items asked about, with the reason where the edit policy
      // requires one (edit-policy.ts). Listed so a resubmission never changes a figure unseen.
      <ListGroup size="sm" aria-label="Other answers changed by the NGO" className="mt-2">
        {changes.map((c) => (
          <ListRow
            key={c.fieldName}
            title={`${c.label} — changed by the NGO`}
            description={
              <>
                <span className="block">
                  Submitted {c.from || "not answered"} · now {c.to || "not answered"}
                </span>
                {c.reason && <span className="block">Reason: {c.reason}</span>}
              </>
            }
          />
        ))}
      </ListGroup>
    )}
    <ListGroup size="sm" aria-label="Items to correct" className="mt-2">
      {items.map((it) => {
        const doc = it.docId ? app.documents.find((d) => d.id === it.docId) : undefined;
        const nowValue = it.fieldName ? values[it.fieldName] : undefined;
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
                {it.correctedAt && it.kind === "field" && it.originalValue != null && (
                  <span className="block">
                    Submitted {it.originalValue} · now {nowValue ?? "not recorded"}
                    {it.response && it.response !== "Answer corrected." ? ` · the NGO's note: ${it.response}` : ""}
                  </span>
                )}
              </>
            }
            trailing={
              it.correctedAt && doc ? (
                <Button appearance="text" size="sm" nowrap onClick={() => onShowDocument(doc.id)}>
                  Go to Document
                </Button>
              ) : undefined
            }
          />
        );
      })}
    </ListGroup>
    </>
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

/** The verdict as officers read it, in the glossary's words (OFFICER_VERDICT). */
const VERDICT_LABEL: Record<DocReviewStatus, string> = { ...OFFICER_VERDICT, "Not applicable": "Not Applicable" };

/** The row's id, so the decision panel and the deficiency banner can send the officer to it. */
const docRowId = (docId: string) => `doc-${docId}`;

/** The documents as the list draws them: annual first, each group by checklist number. */
function documentsInOrder(app: Pick<GrantApplication, "documents">): MockDoc[] {
  const bySlot = [...app.documents].sort((a, b) => a.slot - b.slot);
  return [...bySlot.filter((d) => d.group === "annual"), ...bySlot.filter((d) => d.group !== "annual")];
}

/** Digits only — what a rupee field stores. */
const digits = (v: string) => v.replace(/[^\d]/g, "");

/** The same digits with Indian grouping, as the officer types: "6300000" reads "63,00,000". */
const grouped = (v: string) => (v === "" ? "" : Number(v).toLocaleString("en-IN"));

/** Why the forward is not available, in one sentence, at reading contrast (audit R-01). */
function forwardBlockedReason(blockers: readonly ("verdicts" | "certification")[], awaiting: number): string {
  if (blockers.includes("verdicts") && blockers.includes("certification")) {
    return `${awaiting} document${awaiting === 1 ? "" : "s"} still need${awaiting === 1 ? "s" : ""} your verdict, and the certification is not yet recorded.`;
  }
  if (blockers.includes("verdicts")) {
    return `${awaiting} document${awaiting === 1 ? "" : "s"} still need${awaiting === 1 ? "s" : ""} your verdict.`;
  }
  return "Record the certification to forward the file.";
}

/** The phone bar's second line: SHORT — what is missing, or what the decision is. */
function decisionStandFirst({
  blockers,
  awaiting,
  primary,
  role,
  app,
}: {
  blockers: readonly ("verdicts" | "certification")[];
  awaiting: number;
  primary: Rule[];
  role: Parameters<Rule["label"]>[0];
  app: GrantApplication;
}): string {
  if (blockers.includes("verdicts")) return `${awaiting} document${awaiting === 1 ? "" : "s"} need${awaiting === 1 ? "s" : ""} your verdict.`;
  if (blockers.includes("certification")) return "The certification is not yet recorded.";
  const first = primary[0];
  return first ? first.label(role, app) : "Record your decision on this file.";
}

/**
 * What the Assistant Section Officer must do before the file can be forwarded, said BEFORE the
 * button is pressed and with a way to each step (audit R-01). The ASO used to press "Forward", be
 * told to record a certification, find the certification disabled, and scroll 3,700px to learn why.
 *
 * DS Audit: ListGroup / ListRow ✅ · Icon ✅ · Button ✅ — Stepper carries no step BODY (a link, a
 * checkbox), so the steps are a list. A DecisionPanel template is proposed for the DS (audit §4.9).
 */
function BeforeForwarding({
  progress,
  awaiting,
  certifiedAt,
  onShowAwaiting,
}: {
  progress: { reviewed: number; required: number };
  awaiting: number;
  certifiedAt?: string;
  onShowAwaiting: () => void;
}) {
  const verdictsDone = awaiting === 0;
  return (
    <div className="space-y-2">
      <SectionTitle as={3} title="Before You Forward" />
      <ListGroup size="sm" aria-label="Before you forward">
        <ListRow
          leading={<StepMark done={verdictsDone} />}
          title="Give a Verdict on Every Required Document"
          description={
            verdictsDone ? (
              `All ${progress.required} required documents have your verdict.`
            ) : (
              <>
                <span className="block">
                  {progress.reviewed} of {progress.required} done.
                </span>
                <Button appearance="text" size="sm" className="!justify-start !px-0" onClick={onShowAwaiting}>
                  {awaiting} Document{awaiting === 1 ? "" : "s"} Still Need{awaiting === 1 ? "s" : ""} Your Verdict
                </Button>
              </>
            )
          }
        />
        <ListRow
          leading={<StepMark done={!!certifiedAt} />}
          title="Record the Certification"
          description={certifiedAt ? `Recorded on ${formatDate(certifiedAt)}.` : undefined}
        />
      </ListGroup>
    </div>
  );
}

function StepMark({ done }: { done: boolean }) {
  return (
    <Icon
      name={done ? "check_circle" : "radio_button_unchecked"}
      size={20}
      fill={done}
      className={done ? "text-[var(--sa-icon-status-success-bolder)]" : "text-ink-muted"}
      aria-hidden
    />
  );
}

/**
 * The officer's own verdict on one document — two options, in the row, so twenty verdicts are
 * twenty clicks and not twenty dropdowns 185px apart (audit R-03). The remark follows the verdict,
 * as settled in the review call of 11 Sep 2026 (T752-768, O5): nothing to remark while a document
 * is Not Reviewed, an optional remark when it is Verified, and a MANDATORY one when it needs
 * correction. Both are SAVED as they are made, so a refresh keeps them and a deficiency is built
 * from them.
 */
function VerdictControl({
  doc: d,
  editable,
  onReview,
}: {
  doc: MockDoc;
  editable: boolean;
  onReview: (doc: MockDoc, status: DocReviewStatus, remark: string) => void;
}) {
  const reviewer = docReviewerLine(d);
  if (!editable) {
    return (
      <div className="text-body-3">
        {/* Not "Your verdict": read-only, it is an earlier grade's — the line under it says whose. */}
        <span className="block font-semibold text-ink">{VERDICT_LABEL[d.reviewStatus]}</span>
        {reviewer && <span className="block text-ink-muted">{reviewer}</span>}
        {d.officerRemarks && <span className="block text-ink-muted">{d.officerRemarks}</span>}
      </div>
    );
  }
  // A document with no file cannot be "Verified": what is offered is what can honestly be recorded.
  const options: { value: DocReviewStatus; label: string }[] = d.fileName
    ? [
        { value: "Verified", label: VERDICT_LABEL.Verified },
        { value: "Deficient", label: VERDICT_LABEL.Deficient },
      ]
    : d.optional
      ? [
          { value: "Not applicable", label: VERDICT_LABEL["Not applicable"] },
          { value: "Deficient", label: VERDICT_LABEL.Deficient },
        ]
      : [{ value: "Deficient", label: VERDICT_LABEL.Deficient }];
  return (
    <SegmentedControl<DocReviewStatus>
      ariaLabel={`Your verdict on ${d.title}`}
      value={d.reviewStatus}
      options={options}
      onChange={(v) => onReview(d, v, d.officerRemarks ?? "")}
    />
  );
}

/** The remark that follows a verdict, under the row it belongs to. */
function VerdictRemark({
  doc: d,
  onReview,
}: {
  doc: MockDoc;
  onReview: (doc: MockDoc, status: DocReviewStatus, remark: string) => void;
}) {
  const [remark, setRemark] = React.useState(d.officerRemarks ?? "");
  const [touched, setTouched] = React.useState(false);
  const needsRemark = d.reviewStatus === "Deficient";
  return (
    <div className="max-w-xl">
      <FormField
        id={`remark-${d.id}`}
        label={needsRemark ? "What must the NGO correct?" : "Your remark on this document"}
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
              if (remark !== (d.officerRemarks ?? "")) onReview(d, d.reviewStatus, remark);
            }}
          />
        )}
      </FormField>
    </div>
  );
}

/** A folded row's verdict line: "Verified by ASO, 21 Jul 2026 · with a remark". */
function verdictSummary(d: MockDoc): string {
  const by = d.reviewedBy ? ROLES[d.reviewedBy] : undefined;
  const who = by && d.reviewedAt ? ` by ${by.shortLabel}, ${formatDate(d.reviewedAt)}` : "";
  return `${VERDICT_LABEL[d.reviewStatus]}${who}${d.officerRemarks?.trim() ? " · with a remark" : ""}`;
}

/**
 * The Documents list: annual documents (verified and remarked each year) and permanent ones, each
 * row carrying the automatic check as ADVICE and the officer's own verdict beside it — the machine
 * observation kept at the side of the review, never in place of it (review call T752-771).
 *
 * Rebuilt after the design-director audit of 16 Sep 2026: compact rows (R-03), one count (R-06),
 * a filter for each question an officer asks of the list, a bulk verdict for the documents nothing
 * was found wrong with (R-01), and the changed documents of a correction named as such (R-02).
 */
function DocumentsPanel({
  app,
  editable,
  viewer,
  checkOf,
  corrected,
  progressLabel,
  filter,
  onFilter,
  bulk,
  onVerifyRemaining,
  onOpen,
  onReview,
}: {
  app: GrantApplication;
  editable: boolean;
  /** The signed-in officer, so a verdict of THEIRS is never folded away under their hand. */
  viewer: RoleId | null;
  checkOf: (doc: MockDoc) => DocVerdict | undefined;
  corrected: ReadonlySet<string>;
  progressLabel: string;
  filter: { id: ReviewDocFilter; ids: readonly string[] } | null;
  onFilter: (id: ReviewDocFilter | null) => void;
  bulk: MockDoc[];
  onVerifyRemaining: () => void;
  onOpen: (doc: MockDoc) => void;
  onReview: (doc: MockDoc, status: DocReviewStatus, remark: string) => void;
}) {
  const [historyOf, setHistoryOf] = React.useState<MockDoc | null>(null);
  const [reportOpen, setReportOpen] = React.useState<Record<string, boolean>>({});
  // Rows whose optional remark the officer asked for from the menu.
  const [remarkOpen, setRemarkOpen] = React.useState<Record<string, boolean>>({});
  // Which read-only rows are unfolded.
  const [unfolded, setUnfolded] = React.useState<Record<string, boolean>>({});
  const review = (doc: MockDoc, status: DocReviewStatus, remark: string) => {
    // A document that needs correction needs a reason, so its remark opens with the verdict.
    if (status === "Deficient") setRemarkOpen((o) => ({ ...o, [doc.id]: true }));
    onReview(doc, status, remark);
  };
  const ordered = documentsInOrder(app);
  const shown = filter ? new Set(filter.ids) : null;
  const groups = [
    { id: "annual", label: "Annual Documents", hint: "Verified and remarked each year", docs: ordered.filter((d) => d.group === "annual") },
    { id: "permanent", label: "Permanent Documents", hint: "One-time — view only unless re-uploaded this year", docs: ordered.filter((d) => d.group !== "annual") },
  ]
    .map((g) => ({ ...g, docs: shown ? g.docs.filter((d) => shown.has(d.id)) : g.docs }))
    .filter((g) => g.docs.length > 0);
  const progress = verdictProgress(app);
  const facts = applicantFacts(app.formValues ?? {});
  const countOf = (f: ReviewDocFilter) => ordered.filter((d) => matchesReviewFilter(app, d, f, checkOf)).length;
  const awaitingCount = countOf("awaiting");
  const filters = [
    { id: "awaiting" as const, label: editable ? "Needs Your Verdict" : "Not Reviewed", count: awaitingCount, ...(editable && awaitingCount > 0 ? { tone: "danger" as const } : {}) },
    { id: "flagged" as const, label: "Flagged by the Automatic Check", count: countOf("flagged") },
    ...(countOf("correction") > 0 ? [{ id: "correction" as const, label: "Marked Needs Correction", count: countOf("correction") }] : []),
    ...(corrected.size > 0 ? [{ id: "changed" as const, label: "Changed Since the Deficiency", count: countOf("changed") }] : []),
  ];
  // Read-only once the ASO has certified. Each verdict names who gave it; the certification line
  // stands in only where a verdict was recorded without that (a copy saved before it was kept).
  const unattributed = app.documents.some((d) => d.reviewStatus !== "Pending" && !docReviewerLine(d));
  const attribution = editable || !unattributed ? null : verdictAttribution(app);
  return (
    <Panel title="Documents">
      <div className="space-y-6">
        {attribution && <p className="text-body-3 text-ink-muted">{attribution}</p>}
        <DocumentChecklist
          visibleCount={groups.reduce((n, g) => n + g.docs.length, 0)}
          progressLabel={progressLabel}
          ready={progress.reviewed}
          required={progress.required}
          filters={filters}
          activeFilter={filter?.id ?? null}
          onFilterChange={(id) => onFilter((id as ReviewDocFilter | null) ?? null)}
          bulkAction={
            editable
              ? {
                  label: "Mark All Remaining as Verified",
                  count: bulk.length,
                  description: "Required documents with no verdict yet that the automatic check read as consistent. Anything it flagged, and anything the NGO corrected, is left for you.",
                  confirmTitle: `Mark ${bulk.length} Document${bulk.length === 1 ? "" : "s"} as Verified?`,
                  confirmDescription: `A verdict of Verified is recorded in your name against each of the ${bulk.length} documents, and each one is named on the file. You can change any of them before the file is forwarded.`,
                  onConfirm: onVerifyRemaining,
                }
              : undefined
          }
        >
          {groups.map((g) => (
            <DocumentChecklistGroup key={g.id} title={g.label} description={g.hint}>
              {g.docs.map((d) => {
                const verdict = checkOf(d);
                const state = docState(d, verdict ? { verdict } : undefined);
                const flagged = isFlagged(verdict);
                const hasReport = !!verdict && verdict.state !== "pending" && verdict.state !== "unavailable";
                // A settled verdict folds to one line: read-only, or an earlier grade's. The row
                // the officer is working on never folds — the verdict control is IN the row, and
                // folding it under the hand that had just clicked it took the focus with it.
                const settled =
                  (d.reviewStatus === "Verified" || d.reviewStatus === "Not applicable") &&
                  (!editable || (!!d.reviewedBy && d.reviewedBy !== viewer));
                const remarkVisible =
                  editable && d.reviewStatus !== "Pending" && (d.reviewStatus === "Deficient" || !!d.officerRemarks || !!remarkOpen[d.id]);
                const showReport = !!reportOpen[d.id] && hasReport;
                const previous = d.versions?.[d.versions.length - 1];
                return (
                  <DocumentRow
                    key={d.id}
                    id={docRowId(d.id)}
                    linkAs={Link}
                    density="compact"
                    clampReason
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
                        // A corrected file names what it replaced; the version count would say the
                        // same thing again, and "Opened" is the old gate, which is now the verdict.
                        corrected.has(d.id) && d.uploadedAt
                          ? `Corrected ${formatDate(d.uploadedAt)}${previous ? ` · replaces ${previous.fileName}` : ""}`
                          : d.versions?.length
                            ? `${d.versions.length} earlier version${d.versions.length === 1 ? "" : "s"} on record`
                            : null,
                        d.reUploadedThisYear ? "Permanent document, re-uploaded this year" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || undefined
                    }
                    file={d.fileName ? { name: d.fileName, size: d.sizeKb != null ? fileSizeLabel(d.sizeKb) : undefined, date: d.uploadedAt ? formatDate(d.uploadedAt) : undefined } : undefined}
                    reason={flagged ? (verdict?.reasons?.[0] ?? verdict?.summary) : undefined}
                    // The remark belongs under the row it is about; the check's report opens in the
                    // same place, from the row menu. One disclosure, never two fighting each other.
                    findings={
                      remarkVisible || showReport ? (
                        <div className="space-y-3">
                          {remarkVisible && <VerdictRemark key={`${d.id}-${d.reviewStatus}`} doc={d} onReview={review} />}
                          {showReport && <Findings verdict={verdict!} title={d.title} facts={facts} applicationFy={app.financialYear} officer />}
                        </div>
                      ) : undefined
                    }
                    showFindingsToggle={false}
                    findingsOpen
                    action={
                      d.fileName ? (
                        <Button appearance="outlined" size="sm" nowrap onClick={() => onOpen(d)} aria-label={`View ${d.title}`}>
                          <Icon name="visibility" size={16} aria-hidden /> View
                        </Button>
                      ) : undefined
                    }
                    menu={{
                      items: [
                        ...(hasReport ? [{ id: "report", label: reportOpen[d.id] ? "Hide Automatic Check Report" : "Automatic Check Report", icon: "fact_check" }] : []),
                        ...(editable && d.reviewStatus !== "Pending" && !remarkVisible ? [{ id: "remark", label: "Add a Remark", icon: "edit_note" }] : []),
                        ...(editable && d.reviewStatus !== "Pending" ? [{ id: "clear", label: "Clear the Verdict", icon: "undo" }] : []),
                        ...(d.fileName ? [{ id: "history", label: "Upload History", icon: "history" }] : []),
                      ],
                      onSelect: (id: string) => {
                        if (id === "report") setReportOpen((o) => ({ ...o, [d.id]: !o[d.id] }));
                        else if (id === "remark") setRemarkOpen((o) => ({ ...o, [d.id]: true }));
                        else if (id === "clear") {
                          setRemarkOpen((o) => ({ ...o, [d.id]: false }));
                          onReview(d, "Pending", "");
                        } else setHistoryOf(d);
                      },
                    }}
                    aside={<VerdictControl doc={d} editable={editable} onReview={review} />}
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
              // The same checks an applicant's upload meets, on the file's own bytes (doc-checks.ts).
              const chosenTitle = title;
              void f.arrayBuffer().then((buf) => {
                const found = deviceCheckOfBytes(f.name, new Uint8Array(buf));
                if (found) {
                  setRefused(`${f.name}: ${rowReason(REFUSAL_OF[found], undefined, undefined, rule)}`);
                  return;
                }
                setRefused(null);
                addOfficerDocument(app.id, { ...file, title: chosenTitle });
                setTitle("");
              });
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
