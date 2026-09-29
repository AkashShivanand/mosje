"use client";

/**
 * Authorise Payment Advice — the Checker's review of one advice (PFMS BRD §5.5, Annexure G).
 *
 * DS Audit: Card ✅ · SectionTitle ✅ · DescriptionList ✅ · Alert ✅ · Button ✅ · Modal ✅ ·
 * FormField ✅ · Textarea ✅ · EmptyState ✅ · Skeleton ✅ · useToast ✅ — composed with `AdviceSummary`
 * (the Maker's own review, read-only) and `SignDialog`.
 *
 * The sanction order on the left, the exact payload on the right (FR-PDC-002): the Checker's job is
 * to see that what will be sent is what was sanctioned, so the two sit side by side from 1280px and
 * stack, sanction first, below it. Any figure on the right that does not agree with the left is
 * flagged in words, not only in colour.
 */

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert, Button, Card, CardBody, EmptyState, FormField, Icon, Modal, SectionTitle, Skeleton, Textarea, buttonClasses, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { divergences } from "@/lib/e-anudaan/pfms/advice";
import { sanctionFacts } from "@/lib/e-anudaan/pfms/selectors";
import { AdviceSummary, SanctionFactsList } from "@/components/e-anudaan/pfms/advice-summary";
import { SignDialog } from "@/components/e-anudaan/pfms/sign-dialog";
import { CaseHeader, StageBadge, exact, statusHref } from "@/components/e-anudaan/pfms/payment-ui";

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
  const [returning, setReturning] = React.useState(false);
  const [signing, setSigning] = React.useState(false);
  const [remark, setRemark] = React.useState("");
  const [tried, setTried] = React.useState(false);

  if (!hydrated || !pfmsHydrated) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading the payment advice">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
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
  const remarkError = tried && !remark.trim() ? "Enter the reason for returning the advice. The Maker reads it." : undefined;

  const doReturn = () => {
    setTried(true);
    if (!remark.trim()) return;
    const res = returnToMaker(appId, remark);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    setReturning(false);
    toast(`Payment advice ${advice.id} returned to the Maker.`, "success");
    router.push(QUEUE);
  };

  return (
    <div className="space-y-5">
      <CaseHeader
        app={app}
        ngoName={ngoName}
        projectTitle={projectTitleFor(state, app)}
        eyebrow="Authorise Payment Advice"
        back={{ label: "Authorisation Queue", href: QUEUE }}
        actions={
          <>
            <StageBadge stage={waiting ? "awaiting-authorisation" : "received"} />
            <Link href={statusHref(appId)} className={buttonClasses("primary", "outlined", "sm", "whitespace-nowrap")}>
              <Icon name="timeline" size={16} aria-hidden /> Payment Status
            </Link>
          </>
        }
      />

      {!waiting && (
        <Alert status="info" title="Not Awaiting Your Authorisation">
          This advice is {advice.state === "returned" ? "back with the Maker" : "no longer in the authorisation queue"}. It is shown read-only.
        </Alert>
      )}
      {waiting && advice.preparedBy === state.session && (
        <Alert status="warning" title="You Prepared This Advice">
          A payment advice must be authorised by an officer other than the one who prepared it.
        </Alert>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:items-start">
        <Card variant="outlined" className="xl:sticky xl:top-4">
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

      {waiting && role?.caps.includes("authoriseAdvice") && (
        <div className="sticky bottom-0 z-[var(--sa-z-raised)] -mx-4 flex flex-wrap justify-end gap-3 border-t border-line bg-[var(--sa-bg-neutral-base)] px-4 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0" data-sa-rail-clear="">
          <Button appearance="outlined" variant="danger" iconLeft={<Icon name="undo" size={18} aria-hidden />} onClick={() => setReturning(true)}>
            Return to Maker
          </Button>
          <Button iconLeft={<Icon name="verified_user" size={18} aria-hidden />} onClick={() => setSigning(true)} disabled={off.length > 0}>
            Approve and Sign
          </Button>
        </div>
      )}

      <Modal
        open={returning}
        onClose={() => setReturning(false)}
        title="Return to Maker"
        size="md"
        dirty={remark.trim().length > 0}
        footer={
          <>
            <Button appearance="outlined" onClick={() => setReturning(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={doReturn}>
              Return to Maker
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-body-1 text-ink">The advice goes back to the Maker to correct. The sanction itself is not reopened.</p>
          <FormField label="Reason for Returning" id="return-remark" required error={remarkError} hint="The Maker reads this beside the advice." characterCount={{ value: remark, maxLength: REMARK_MAX }}>
            {(c) => <Textarea {...c} rows={4} maxLength={REMARK_MAX} value={remark} onChange={(e) => setRemark(e.target.value)} />}
          </FormField>
        </div>
      </Modal>

      <SignDialog
        open={signing}
        onClose={() => setSigning(false)}
        advice={advice}
        designation={designation}
        officerName={role?.personName ?? ""}
        onFinished={() => router.push(QUEUE)}
      />
    </div>
  );
}
