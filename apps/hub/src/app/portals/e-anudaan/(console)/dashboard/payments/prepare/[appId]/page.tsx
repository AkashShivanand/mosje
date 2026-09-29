"use client";

/**
 * Prepare Payment Advice — the Maker's workspace for one sanctioned file (PFMS BRD §5.4, Annexure F).
 *
 * DS Audit: Wizard ✅ · ErrorSummary ✅ · Alert ✅ · Button ✅ · Card ✅ · Skeleton ✅ · EmptyState ✅ ·
 * useToast ✅ — composed with the steps in `components/e-anudaan/pfms/advice-steps` and the read-only
 * `AdviceSummary`, which the Checker also reads.
 *
 * The order is the order PFMS needs the data: header → heads of account → beneficiary →
 * documents → review (NFR §6.5). "Save and Continue" saves as it moves; "Save as Draft" leaves
 * without submitting (FR-PDM-010). Once submitted the advice is locked until the Checker returns it
 * (FR-PDM-011), and the page becomes a read-only record of what was sent.
 *
 * Every message is `validateAdvice()`'s, keyed to the field it is about — the summary above the
 * form and the message under the field are one sentence.
 */

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, EmptyState, ErrorSummary, Icon, Skeleton, Wizard, buttonClasses, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { STEP_LABEL, STEP_ORDER, isEditable, nextBillNumber, validateAdvice } from "@/lib/e-anudaan/pfms/advice";
import { configFor } from "@/lib/e-anudaan/pfms/masters";
import { paymentCase, sanctionFacts, BLOCKER_TEXT } from "@/lib/e-anudaan/pfms/selectors";
import { pfmsError } from "@/lib/e-anudaan/pfms/errors";
import type { AdviceStep, PaymentAdvice, ValidationIssue } from "@/lib/e-anudaan/pfms/types";
import { AdviceSummary } from "@/components/e-anudaan/pfms/advice-summary";
import { BeneficiaryStep, DocumentsStep, HeadsStep, HeaderStep, issueLookup } from "@/components/e-anudaan/pfms/advice-steps";
import { CaseHeader, StageBadge, statusHref } from "@/components/e-anudaan/pfms/payment-ui";

const QUEUE = "/portals/e-anudaan/dashboard/payments/prepare";

/**
 * `NumberInput` and `DatePicker` put their control at `<id>-input`. The summary's link must land on
 * the control itself, which is also what receives focus, so those fields are mapped here.
 */
const controlId = (field: string) => (/^(head-\d+-amount|ben-\d+-gross|hdr-npb)$/.test(field) ? `${field}-input` : field);

/** Local issues that are not the Maker's to fix on a step — shown once, at the top, never gating a step. */
const PAGE_LEVEL = new Set(["hdr-scheme", "hdr-masters"]);

export default function PrepareAdvicePage() {
  const params = useParams<{ appId: string }>();
  const appId = decodeURIComponent(params.appId);
  const router = useRouter();
  const { toast } = useToast();
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated, openAdvice, saveAdvice, submit, now } = usePfms();
  const role = state.session ? ROLES[state.session] : null;
  const app = state.applications.find((a) => a.id === appId);
  const advice = pfms.advices.find((a) => a.appId === appId);
  const c = app ? paymentCase(state, pfms, app) : null;

  // "Prepare Advice" is the intent: the advice is opened the first time the Maker lands here.
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (!pfmsHydrated || opened.current || !app || advice || c?.blocker) return;
    opened.current = true;
    const res = openAdvice(app.id);
    if (!res.ok) toast(res.error, "error");
  }, [pfmsHydrated, app, advice, c?.blocker, openAdvice, toast]);

  if (!hydrated || !pfmsHydrated || (!advice && app && !c?.blocker)) {
    return (
      <div className="space-y-4" role="status" aria-label="Opening the payment advice">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!app || !app.sanction) {
    return <EmptyState title="Sanctioned File Not Found" description="This application is not in the register of sanctioned files." action={<Link href={QUEUE} className={buttonClasses("primary", "outlined", "md")}>Back to Payment Advices</Link>} />;
  }
  const ngoName = state.ngos.find((n) => n.id === app.ngoId)?.name ?? app.ngoId;
  const header = (actions?: React.ReactNode) => (
    <CaseHeader app={app} ngoName={ngoName} projectTitle={projectTitleFor(state, app)} eyebrow="Payment Advice" back={{ label: "Payment Advices", href: QUEUE }} actions={actions} />
  );

  if (c?.blocker) {
    return (
      <div className="space-y-5">
        {header()}
        <Alert status="warning" title={BLOCKER_TEXT[c.blocker].label}>
          {BLOCKER_TEXT[c.blocker].body}
        </Alert>
      </div>
    );
  }
  if (!advice) return null;

  if (!isEditable(advice) || !role?.caps.includes("prepareAdvice")) {
    return <LockedAdvice advice={advice} header={header} />;
  }
  return <AdviceWizard key={advice.id} advice={advice} header={header} saveAdvice={saveAdvice} submit={submit} now={now} onDone={() => router.push(QUEUE)} />;
}

/* ── The locked record, once the advice has left the Maker ───────────────── */

function LockedAdvice({ advice, header }: { advice: PaymentAdvice; header: (a?: React.ReactNode) => React.ReactNode }) {
  const { pfms } = usePfms();
  const lead: Record<string, { title: string; body: string }> = {
    submitted: { title: "With the Checker", body: "This advice is waiting for the Checker's authorisation. It cannot be changed unless the Checker returns it." },
    transmitted: { title: "Sent to PFMS", body: "The Checker has signed this advice and PFMS has received it. Its progress is on the Payment Status page." },
    queued: { title: "Waiting to Resend", body: "PFMS could not be reached when this advice was sent. It will be sent again automatically." },
    cancelled: { title: "Returned and Cancelled at PFMS", body: "A cancelled sanction cannot be revived. A fresh sanction must be issued from e-Anudaan." },
  };
  const l = lead[advice.state] ?? lead.submitted!;
  return (
    <div className="space-y-5">
      {header(
        <>
          <StageBadge stage={advice.state === "submitted" ? "awaiting-authorisation" : advice.state === "queued" ? "waiting-to-resend" : advice.state === "cancelled" ? "cancelled" : "received"} />
          <Link href={statusHref(advice.appId)} className={buttonClasses("primary", "outlined", "sm", "whitespace-nowrap")}>
            <Icon name="timeline" size={16} aria-hidden /> Payment Status
          </Link>
        </>,
      )}
      <Alert status={advice.state === "cancelled" ? "error" : "info"} title={l.title}>
        {l.body}
      </Alert>
      <AdviceSummary advice={advice} masters={pfms.masters} />
    </div>
  );
}

/* ── The wizard ──────────────────────────────────────────────────────────── */

function AdviceWizard({
  advice,
  header,
  saveAdvice,
  submit,
  now,
  onDone,
}: {
  advice: PaymentAdvice;
  header: (a?: React.ReactNode) => React.ReactNode;
  saveAdvice: ReturnType<typeof usePfms>["saveAdvice"];
  submit: ReturnType<typeof usePfms>["submit"];
  now: () => string;
  onDone: () => void;
}) {
  const { toast } = useToast();
  const { state } = useEAnudaan();
  const { pfms } = usePfms();
  const app = state.applications.find((a) => a.id === advice.appId)!;
  const facts = sanctionFacts(pfms, app)!;
  const config = configFor(pfms.configs, advice.schemeCode);
  const [draft, setDraft] = React.useState(() => ({ header: advice.header, heads: advice.heads, beneficiaries: advice.beneficiaries, documents: advice.documents }));
  // The live advice with the Maker's unsaved edits over it — what every check runs against.
  const working: PaymentAdvice = { ...advice, ...draft };
  const all = validateAdvice(working, { masters: pfms.masters, configs: pfms.configs, now: now() });
  const pageLevel = all.filter((i) => PAGE_LEVEL.has(i.field));
  // PFMS's own errors ride on the advice until the Maker resubmits (FR-STS-006).
  const pfmsIssues = advice.state === "not-accepted" ? advice.issues : [];

  // A returned or refused advice opens on the first step with something to fix.
  const firstFlagged = (issues: readonly ValidationIssue[]) => {
    const i = STEP_ORDER.findIndex((s) => issues.some((x) => x.step === s && !PAGE_LEVEL.has(x.field)));
    return i < 0 ? 0 : i;
  };
  const [current, setCurrent] = React.useState(() => (advice.state === "draft" ? 0 : firstFlagged([...pfmsIssues.map((i) => ({ ...i, step: pfmsError(i.pfmsCode ?? "").step })), ...all])));
  const [tried, setTried] = React.useState<Set<AdviceStep>>(() => new Set());
  const errorRef = React.useRef<HTMLDivElement>(null);
  const step = STEP_ORDER[current]!;
  const stepIssues = all.filter((i) => i.step === step && !PAGE_LEVEL.has(i.field));
  const shown = tried.has(step) ? stepIssues : [];
  const issue = issueLookup(shown);

  const persist = React.useCallback(() => {
    const res = saveAdvice(advice.appId, draft);
    if (!res.ok) toast(res.error, "error");
    else if (res.advice) setDraft((d) => ({ ...d, header: res.advice!.header }));
    return res.ok;
  }, [saveAdvice, advice.appId, draft, toast]);

  const go = (i: number) => {
    persist();
    setCurrent(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (stepIssues.length > 0) {
      setTried((t) => new Set(t).add(step));
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    go(current + 1);
  };

  const doSubmit = () => {
    if (!persist()) return;
    const res = submit(advice.appId);
    if (!res.ok) {
      setTried(new Set(STEP_ORDER));
      toast(res.error, "error");
      if (res.issues?.length) setCurrent(firstFlagged(res.issues));
      return;
    }
    toast(`Payment advice ${advice.id} submitted to the Checker.`, "success");
    onDone();
  };

  const steps = STEP_ORDER.map((s) => ({
    label: STEP_LABEL[s],
    ...(tried.has(s) && all.some((i) => i.step === s && !PAGE_LEVEL.has(i.field)) ? { status: "error" as const } : {}),
  }));
  const flagged = STEP_ORDER.filter((s) => all.some((i) => i.step === s && !PAGE_LEVEL.has(i.field)));
  const ddo = pfms.masters.ddos.find((d) => d.code === draft.header.ddoCode);

  return (
    <div className="space-y-5">
      {header(
        <>
          <StageBadge stage={advice.state === "returned" ? "returned-by-checker" : advice.state === "not-accepted" ? "not-accepted" : "in-preparation"} />
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
        </>,
      )}

      {pageLevel.map((i) => (
        <Alert key={i.field} status="warning" title={i.field === "hdr-scheme" ? "Scheme Code Awaited" : "Master Data Out of Date"}>
          {i.message}
        </Alert>
      ))}

      {advice.state === "returned" && advice.checkerRemark && (
        <Alert status="warning" title="Returned by the Checker">
          {advice.checkerRemark}
        </Alert>
      )}
      {advice.state === "not-accepted" && (
        <Alert status="error" title="PFMS Did Not Accept This Advice">
          <span className="block">Nothing was created at PFMS. Correct the following and submit it again; the Checker signs it again before it is resent.</span>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {pfmsIssues.map((i) => {
              const e = pfmsError(i.pfmsCode ?? "", pfms.errorOverrides);
              return (
                <li key={i.pfmsCode}>
                  {e.message}{" "}
                  <Button appearance="text" size="sm" onClick={() => go(STEP_ORDER.indexOf(e.step))}>
                    Go to {STEP_LABEL[e.step]}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Alert>
      )}

      <Wizard
        steps={steps}
        current={current}
        title={STEP_LABEL[step]}
        description={
          step === "header"
            ? "Choose the DDO and the division code. Everything else comes from the sanction order."
            : step === "heads"
              ? "Choose the coded head of account. The amounts must add up to the sanction."
              : step === "beneficiary"
                ? "Confirm the amount payable to the NGO and the remarks PFMS prints on the payment."
                : step === "documents"
                  ? "Upload the supporting documents. PFMS receives their fingerprints."
                  : "Check the payment advice before it goes to the Checker."
        }
        onBack={() => go(Math.max(current - 1, 0))}
        onCancel={() => {
          persist();
          onDone();
        }}
        cancelLabel="Back to Payment Advices"
        onNext={next}
        onSubmit={doSubmit}
        nextLabel="Save and Continue"
        submitLabel="Submit for Authorisation"
        nextDisabled={step === "review" && pageLevel.length > 0}
        nextBlockedReason={pageLevel[0]?.message}
        stepperCollapse="auto"
        error={shown.length > 0 ? `${shown.length === 1 ? "One thing needs" : `${shown.length} things need`} attention on this step.` : undefined}
        errorRef={errorRef}
      >
        {shown.length > 0 && <ErrorSummary errors={shown.map((i) => ({ fieldId: controlId(i.field), message: i.message }))} headingLevel={3} />}
        {step === "header" && (
          <HeaderStep
            facts={facts}
            header={draft.header}
            onChange={(h) =>
              setDraft((d) => ({
                ...d,
                // The bill number belongs to the DDO's own series: a new DDO takes the next number in
                // its series at once, so the Maker sees it the moment they choose (FR-PDM-005).
                header:
                  h.ddoCode && h.ddoCode !== d.header.ddoCode
                    ? { ...h, billNumber: nextBillNumber(pfms.advices.filter((a) => a.appId !== advice.appId), h.ddoCode, advice.financialYear) }
                    : h.ddoCode
                      ? h
                      : { ...h, billNumber: "" },
              }))
            }
            masters={pfms.masters}
            config={config}
            issue={issue}
          />
        )}
        {step === "heads" && (
          <HeadsStep
            heads={draft.heads}
            onChange={(h) => setDraft((d) => ({ ...d, heads: h }))}
            sanctionAmount={advice.sanctionAmount}
            masters={pfms.masters}
            config={config}
            header={draft.header}
            onHeaderChange={(h) => setDraft((d) => ({ ...d, header: h }))}
            issue={issue}
          />
        )}
        {step === "beneficiary" && (
          <BeneficiaryStep beneficiaries={draft.beneficiaries} onChange={(b) => setDraft((d) => ({ ...d, beneficiaries: b }))} sanctionAmount={advice.sanctionAmount} issue={issue} />
        )}
        {step === "documents" && <DocumentsStep documents={draft.documents} onChange={(docs) => setDraft((d) => ({ ...d, documents: docs }))} landing={ddo?.landing ?? "Approved"} issue={issue} />}
        {step === "review" && (
          <div className="space-y-4">
            {flagged.length > 0 ? (
              <Alert status="warning" title="Not Ready to Submit">
                {flagged.map((s) => STEP_LABEL[s]).join(", ")} {flagged.length === 1 ? "needs" : "need"} attention. Use Change beside the section to correct it.
              </Alert>
            ) : (
              <Alert status="success" title="Ready for the Checker">
                Every check that can be made before PFMS has passed. Submitting locks the advice until the Checker authorises or returns it.
              </Alert>
            )}
            <AdviceSummary advice={working} masters={pfms.masters} onEdit={(s) => go(STEP_ORDER.indexOf(s))} flaggedSteps={flagged} />
          </div>
        )}
      </Wizard>
    </div>
  );
}

