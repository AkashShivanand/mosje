"use client";

/**
 * Authorise Payment Advice — the Checker's review of one advice (PFMS BRD §5.5, Annexure G).
 *
 * DS Audit: DecisionScreen ✅ existing (one record + a decision to record against it) · RecordScreen ✅
 * (the same advice once it is no longer the Checker's to decide) · Card ✅ · SectionTitle ✅ · Alert ✅ ·
 * FormField ✅ · Textarea ✅ · EmptyState ✅ · useToast ✅ — composed with `AdviceSummary` (the Maker's own
 * review, read-only) and `SignDialog`.
 *
 * The sanction order on the left, the exact payload on the right (FR-PDC-002): the Checker's job is
 * to see that what will be sent is what was sanctioned, so the two sit side by side from 1280px and
 * stack, sanction first, below it. Any figure on the right that does not agree with the left is
 * flagged in words, not only in colour.
 */

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert, Card, CardBody, DecisionScreen, EmptyState, FormField, Icon, RecordScreen, SectionTitle, Textarea, buttonClasses, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { divergences } from "@/lib/e-anudaan/pfms/advice";
import { sanctionFacts } from "@/lib/e-anudaan/pfms/selectors";
import { AdviceSummary, SanctionFactsList } from "@/components/e-anudaan/pfms/advice-summary";
import { SignDialog } from "@/components/e-anudaan/pfms/sign-dialog";
import { StageBadge, exact, statusHref } from "@/components/e-anudaan/pfms/payment-ui";
import { RefText } from "@/components/e-anudaan/worklist-table";
import { schemeLabel } from "@/lib/e-anudaan/selectors";

const QUEUE = "/portals/e-anudaan/dashboard/payments/authorise";
const REMARK_MAX = 500;

export default function AuthoriseAdvicePage() {
  const params = useParams<{ appId: string }>();
  const appId = decodeURIComponent(params.appId);
  const router = useRouter();
  const { toast } = useToast();
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated, returnToMaker } = usePfms();
  const role = state.session ? ROLES[state.session] : null;
  const app = state.applications.find((a) => a.id === appId);
  const advice = pfms.advices.find((a) => a.appId === appId);
  const [choice, setChoice] = React.useState("");
  const [signing, setSigning] = React.useState(false);
  const [remark, setRemark] = React.useState("");
  const [tried, setTried] = React.useState(false);

  if (!hydrated || !pfmsHydrated) {
    return <RecordScreen title="Authorise Payment Advice" loading tabs={[]} />;
  }
  if (!app || !advice) {
    return <EmptyState title="Payment Advice Not Found" description="There is no payment advice for this application." action={<Link href={QUEUE} className={buttonClasses("primary", "outlined", "md")}>Back to Authorisation Queue</Link>} />;
  }

  const facts = sanctionFacts(pfms, app)!;
  const ngoName = state.ngos.find((n) => n.id === app.ngoId)?.name ?? app.ngoId;
  const waiting = advice.state === "submitted";
  const off = divergences(advice);
  const designation = pfms.designations.find((d) => d.ddoCode === advice.header.ddoCode);
  const key = role ? reviewKeyOf(role) : null;
  const ownAdvice = advice.preparedBy === state.session;
  const remarkError = tried && choice === "return" && !remark.trim() ? "Enter the reason for returning the advice. The Maker reads it." : undefined;
  const approveError = tried && choice === "approve" ? (off.length > 0 ? "The advice does not agree with the sanction order. Return it to the Maker." : ownAdvice ? "You prepared this advice; an officer other than its Maker must authorise it." : undefined) : undefined;
  const chooseError = tried && !choice ? "Choose whether to approve and sign, or return the advice to the Maker." : undefined;

  const submit = () => {
    setTried(true);
    if (!choice) return;
    if (choice === "approve") {
      if (off.length > 0 || ownAdvice) return;
      setSigning(true);
      return;
    }
    if (!remark.trim()) return;
    const res = returnToMaker(appId, remark);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Payment advice ${advice.id} returned to the Maker.`, "success");
    router.push(QUEUE);
  };

  const meta = (
    <span className="block space-y-1">
      <span className="block text-body-2 text-ink">
        {projectTitleFor(state, app)} · {schemeLabel(app.schemeCode)} · FY {app.financialYear}
      </span>
      <span className="block text-body-3 text-ink-muted">
        Application No. <RefText value={app.id} className="text-ink" /> · Project ID {app.institutionId}
      </span>
    </span>
  );
  const statusLink = (
    <Link href={statusHref(appId)} className={buttonClasses("primary", "outlined", "sm", "whitespace-nowrap")}>
      <Icon name="timeline" size={16} aria-hidden /> Payment Status
    </Link>
  );

  // The record: the sanction order on the left, the exact payload on the right (FR-PDC-002).
  const record = (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:items-start">
      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle as={2} title="Sanction Order" description="As issued by the Under Secretary. The advice may not change it." />
          <SanctionFactsList facts={facts} columns={1} />
          {key && (
            <Link href={`/portals/e-anudaan/dashboard/sm2/${key}/review/${encodeURIComponent(appId)}`} className={buttonClasses("primary", "text", "sm")}>
              <Icon name="description" size={16} aria-hidden /> Open the Sanctioned Application
            </Link>
          )}
        </CardBody>
      </Card>
      <div className="space-y-4">
        <SectionTitle as={2} title="What Will Be Sent to PFMS" description={`Prepared by the Maker, submitted ${advice.submittedAt ? formatDateTime(advice.submittedAt) : ""}.`} />
        {off.length === 0 ? (
          <Alert status="success" title="Agrees with the Sanction Order">
            The heads of account and the amount payable both add up to {exact(advice.sanctionAmount)}.
          </Alert>
        ) : (
          <Alert status="error" title="Does Not Agree with the Sanction Order">
            {off.includes("heads-total") && <span className="block">The heads of account do not add up to the sanction amount.</span>}
            {off.includes("ben-total") && <span className="block">The amount payable does not equal the sanction amount.</span>}
            Return the advice to the Maker.
          </Alert>
        )}
        <AdviceSummary advice={advice} masters={pfms.masters} />
      </div>
    </div>
  );

  // The dialog sits second in BOTH trees below. Signing moves the advice out of "submitted", which
  // swaps DecisionScreen for RecordScreen; a dialog kept at the same position survives the swap, so
  // the Checker reads PFMS's answer instead of watching it vanish (found by the scripted walk).
  const signDialog = (
    <SignDialog
      open={signing}
      onClose={() => setSigning(false)}
      advice={advice}
      designation={designation}
      officerName={role?.personName ?? ""}
      onFinished={() => router.push(QUEUE)}
    />
  );

  // Once the advice has left the Checker, the same record is shown with no decision to take.
  if (!waiting || !role?.caps.includes("authoriseAdvice")) {
    return (
      <>
      <RecordScreen
        breadcrumb={[{ label: "Authorisation Queue", href: QUEUE }, { label: "Authorise Payment Advice" }]}
        eyebrow="Authorise Payment Advice"
        title={ngoName}
        meta={meta}
        status={<StageBadge stage={waiting ? "awaiting-authorisation" : "received"} />}
        actions={statusLink}
        tabs={[
          {
            id: "advice",
            label: "Payment Advice",
            render: () => (
              <div className="space-y-5">
                <Alert status="info" title="Not Awaiting Your Authorisation">
                  This advice is {advice.state === "returned" ? "back with the Maker" : "no longer in the authorisation queue"}. It is shown read-only.
                </Alert>
                {record}
              </div>
            ),
          },
        ]}
      />
      {signDialog}
      </>
    );
  }

  return (
    <>
      <DecisionScreen
        breadcrumb={[{ label: "Authorisation Queue", href: QUEUE }, { label: "Authorise Payment Advice" }]}
        eyebrow="Authorise Payment Advice"
        title={ngoName}
        meta={meta}
        status={<StageBadge stage="awaiting-authorisation" />}
        record={record}
        panelTitle="Your Decision"
        legend="Is this payment advice ready to be sent to PFMS?"
        options={[
          {
            id: "approve",
            label: "Approve and Sign",
            description: "Signs the advice with your digital signature certificate and sends it to PFMS in one request.",
            irreversibleNote: "Once PFMS accepts it, the advice cannot be recalled from e-Anudaan.",
          },
          { id: "return", label: "Return to Maker", description: "The Maker corrects the advice. The sanction itself is not reopened." },
        ]}
        value={choice}
        onChange={(id) => {
          setChoice(id);
          setTried(false);
        }}
        extras={
          ownAdvice ? (
            <Alert status="warning" title="You Prepared This Advice">
              A payment advice must be authorised by an officer other than the one who prepared it.
            </Alert>
          ) : undefined
        }
        remarks={
          choice === "return" ? (
            <FormField label="Reason for Returning" id="return-remark" required error={remarkError} hint="The Maker reads this beside the advice." characterCount={{ value: remark, maxLength: REMARK_MAX }}>
              {(c) => <Textarea {...c} rows={4} maxLength={REMARK_MAX} value={remark} onChange={(e) => setRemark(e.target.value)} />}
            </FormField>
          ) : undefined
        }
        errors={[
          ...(chooseError ? [{ fieldId: "decision", message: chooseError }] : []),
          ...(remarkError ? [{ fieldId: "return-remark", message: remarkError }] : []),
          ...(approveError ? [{ fieldId: "decision", message: approveError }] : []),
        ]}
        submitLabel={choice === "return" ? "Return to Maker" : "Approve and Sign"}
        onSubmit={submit}
        onCancel={() => router.push(QUEUE)}
        cancelLabel="Back to Authorisation Queue"
      />

      {signDialog}
    </>
  );
}
