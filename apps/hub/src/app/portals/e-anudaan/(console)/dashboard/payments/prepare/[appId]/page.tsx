"use client";

/**
 * Payment Advice — the Maker's workspace for one sanctioned file (PFMS BRD §5.4, Annexure F).
 *
 * One page, in five sections, for every state of the advice: being prepared, returned by the
 * Checker or by PFMS, refused by PFMS, and — read-only — once it has left the Maker. The page itself
 * is `AdvicePage` (components/e-anudaan/pfms/advice-page.tsx); this route opens the advice and
 * handles the file that cannot have one yet.
 *
 * DS Audit: RecordScreen ✅ (a file on hold, and the loading state) · Alert ✅ · EmptyState ✅ ·
 * useToast ✅ — composed with `AdvicePage`.
 */

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Alert, EmptyState, RecordScreen, buttonClasses, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { paymentCase, BLOCKER_TEXT } from "@/lib/e-anudaan/pfms/selectors";
import { AdvicePage } from "@/components/e-anudaan/pfms/advice-page";
import { StageBadge } from "@/components/e-anudaan/pfms/payment-ui";
import { RefText } from "@/components/e-anudaan/worklist-table";
import { schemeLabel } from "@/lib/e-anudaan/selectors";

const BREADCRUMB = [{ label: "Payment Advices", href: "/portals/e-anudaan/dashboard/payments/prepare" }, { label: "Payment Advice" }];

const QUEUE = "/portals/e-anudaan/dashboard/payments/prepare";

export default function PrepareAdvicePage() {
  const params = useParams<{ appId: string }>();
  const appId = decodeURIComponent(params.appId);
  const { toast } = useToast();
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated, openAdvice } = usePfms();
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
    return <RecordScreen breadcrumb={BREADCRUMB} title="Payment Advice" loading tabs={[]} />;
  }
  if (!app || !app.sanction) {
    return <EmptyState title="Sanctioned File Not Found" description="This application is not in the register of sanctioned files." action={<Link href={QUEUE} className={buttonClasses("primary", "outlined", "md")}>Back to Payment Advices</Link>} />;
  }

  if (c?.blocker) {
    const blocker = c.blocker;
    const ngoName = state.ngos.find((n) => n.id === app.ngoId)?.name ?? app.ngoId;
    return (
      <RecordScreen
        breadcrumb={BREADCRUMB}
        title={ngoName}
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
        status={<StageBadge stage="awaiting-advice" />}
        tabs={[
          {
            id: "hold",
            label: "On Hold",
            render: () => (
              <Alert status="warning" title={BLOCKER_TEXT[blocker].label}>
                {BLOCKER_TEXT[blocker].body}
              </Alert>
            ),
          },
        ]}
      />
    );
  }
  if (!advice) return null;

  return <AdvicePage key={advice.id} advice={advice} canEdit={!!role?.caps.includes("prepareAdvice")} />;
}
