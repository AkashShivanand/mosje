"use client";

/**
 * The pieces every payment-leg screen shares, so a stage, a hold and a sanction read the same in
 * the Maker's queue, the Checker's queue, the case page and the review screen's Instalments panel.
 *
 * DS Audit: Badge ✅ · Stepper ✅ · Icon ✅ · buttonClasses ✅ · WorklistColumn ✅ — composed, nothing
 * new. A "where this value came from" tag is a neutral `Badge`; the plan's candidate `SourceTag`
 * is not added to the design system until a second portal needs it.
 */

import * as React from "react";
import Link from "next/link";
import { Badge, Breadcrumb, Icon, PageHeader, Stepper, buttonClasses, type StepperStep, type WorklistColumn } from "@mosje/design-system";
import { formatMoney, formatDate } from "@/lib/e-anudaan/format";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { RefText } from "@/components/e-anudaan/worklist-table";
import { STAGE_INFO, isException, latestRequest, returnedBy, type AnyStage, type StageTone } from "@/lib/e-anudaan/pfms/stages";
import type { PaymentAdvice, PfmsRequest } from "@/lib/e-anudaan/pfms/types";
import { BLOCKER_TEXT, type Blocker, type PaymentCase } from "@/lib/e-anudaan/pfms/selectors";

export const EA = "/portals/e-anudaan";
export const prepareHref = (appId: string) => `${EA}/dashboard/payments/prepare/${encodeURIComponent(appId)}`;
export const authoriseHref = (appId: string) => `${EA}/dashboard/payments/authorise/${encodeURIComponent(appId)}`;
export const statusHref = (appId: string) => `${EA}/finance/payment-status/${encodeURIComponent(appId)}`;

/** A payment advice states rupees exactly: it is the figure PFMS will pay (glossary §2, "exact"). */
export const exact = (n: number) => formatMoney(n, "exact");

const BADGE: Record<StageTone, "neutral" | "info" | "warning" | "success" | "danger"> = {
  neutral: "neutral",
  info: "info",
  warning: "warning",
  success: "success",
  danger: "danger",
};

export function StageBadge({ stage, audience = "officer", size }: { stage: AnyStage; audience?: "officer" | "ngo"; size?: "sm" | "lg" }) {
  const info = STAGE_INFO[stage];
  return (
    <Badge status={BADGE[info.tone]} size={size} className="h-auto whitespace-normal">
      {audience === "ngo" ? info.ngoLabel : info.label}
    </Badge>
  );
}

export function BlockerBadge({ blocker, size }: { blocker: Blocker; size?: "sm" | "lg" }) {
  return (
    <Badge status="warning" size={size} className="h-auto whitespace-normal">
      {BLOCKER_TEXT[blocker].label}
    </Badge>
  );
}

/** "From Sanction Order" — where a pre-filled value came from, beside the value. */
export function SourceTag({ children }: { children: React.ReactNode }) {
  return (
    <Badge status="neutral" size="sm" className="h-auto whitespace-nowrap font-normal">
      {children}
    </Badge>
  );
}

/**
 * The payment's road in six plain stages, as the Payment Status screen is drawn (handoff file,
 * PD Maker / Payment Status / In Progress · Credited · Stopped, 3 Oct 2026). The code's finer stages
 * fold into them; a stop is drawn at the stage where it happened, marked failed. Future stages carry
 * no description — what they mean is the label.
 */
const PLAIN_STAGES = ["Sent to PFMS", "With the DDO", "At the PAO", "At the Bank", "Credited", "Closed"] as const;

function plainIndex(stage: AnyStage, req: PfmsRequest | undefined): number {
  switch (stage) {
    case "received":
    case "bill-with-ddo":
      return 1;
    case "at-pao":
    case "fy-expired":
      return 2;
    case "payment-in-process":
    case "credit-failed":
      return 3;
    case "paid":
      return 4;
    case "closed":
      return 5;
    case "returned-by-pfms":
    case "cancelled":
      // Returned at the DDO, or at the Pay & Accounts Office (Dealing Hand, AAO, PAO).
      return returnedBy(req) === "Drawing & Disbursing Officer" ? 1 : 2;
    default:
      return 0;
  }
}

export function PlainPaymentStages({ stage, advice }: { stage: AnyStage; advice?: PaymentAdvice }) {
  const req = advice ? latestRequest(advice) : undefined;
  const at = plainIndex(stage, req);
  const failed = isException(stage) && req !== undefined && stage !== "not-accepted" && stage !== "waiting-to-resend" && stage !== "returned-by-checker";
  const sent = advice?.requests.find((r) => r.outcome === "accepted");
  const credited = req?.payments.map((p) => p.scrollDate).filter(Boolean).sort().at(-1);
  const describe = (i: number): string | undefined => {
    if (failed && i === at) return req?.statusAt ? `Returned ${formatDate(req.statusAt)}` : undefined;
    if (i > at) return undefined;
    if (i === 0) return sent ? `Signed ${formatDate(sent.sentAt)}` : undefined;
    if (i === 1) return req?.bill ? `Bill ${req.bill.billNumber}` : undefined;
    if (i === 4) return credited ? formatDate(credited) : undefined;
    return undefined;
  };
  const done = stage === "closed" ? PLAIN_STAGES.length : at;
  const steps: StepperStep[] = PLAIN_STAGES.map((label, i) => ({
    label,
    description: describe(i),
    ...(i < done || (stage === "paid" && i === 4) ? { status: "complete" as const } : {}),
    ...(failed && i === at ? { status: "error" as const } : {}),
  }));
  // A closed payment has no current stage: every stage is done, so `current` sits past the last.
  return <Stepper steps={steps} current={stage === "closed" ? PLAIN_STAGES.length : at} size="sm" collapse="auto" ariaLabel="Payment progress" />;
}

/** The case's status cell: a hold wins over a stage, because a held file has no stage yet. */
export function CaseStatus({ c }: { c: PaymentCase }) {
  if (c.blocker) return <BlockerBadge blocker={c.blocker} size="sm" />;
  return <StageBadge stage={c.stage} size="sm" />;
}

export interface CaseColumnOptions {
  ngoName: (ngoId: string) => string;
  action: (c: PaymentCase) => React.ReactNode;
}

/** The columns both payment queues use: file, NGO, scheme, sanction, amount, status, action. */
export function caseColumns({ ngoName, action }: CaseColumnOptions): WorklistColumn<PaymentCase>[] {
  return [
    {
      key: "file",
      header: "Application",
      priority: 1,
      sortable: true,
      sortValue: (c) => c.app.id,
      exportValue: (c) => c.app.id,
      render: (c) => (
        <span className="block min-w-[12rem]">
          <span className="block font-semibold text-ink">{ngoName(c.app.ngoId)}</span>
          <RefText value={c.app.id} className="block text-body-3 text-ink-muted" />
        </span>
      ),
    },
    { key: "scheme", header: "Scheme", priority: 2, sortable: true, sortValue: (c) => schemeLabel(c.app.schemeCode), exportValue: (c) => schemeLabel(c.app.schemeCode), render: (c) => schemeLabel(c.app.schemeCode) },
    {
      key: "sanction",
      header: "Sanction Order",
      priority: 2,
      sortable: true,
      sortValue: (c) => c.app.sanction?.sanctionedAt ?? "",
      exportValue: (c) => `${c.app.sanction?.orderNo ?? ""} ${c.app.sanction ? formatDate(c.app.sanction.sanctionedAt) : ""}`,
      render: (c) => (
        <span className="block whitespace-nowrap">
          <span className="block">{c.app.sanction?.orderNo}</span>
          <span className="block text-body-3 text-ink-muted">{c.app.sanction ? formatDate(c.app.sanction.sanctionedAt) : ""}</span>
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      priority: 2,
      className: "text-right",
      sortable: true,
      sortValue: (c) => c.app.sanction?.total ?? 0,
      exportValue: (c) => String(c.app.sanction?.total ?? 0),
      render: (c) => <span className="whitespace-nowrap tabular-nums">{exact(c.app.sanction?.total ?? 0)}</span>,
    },
    { key: "status", header: "Status", priority: 2, exportValue: (c) => (c.blocker ? BLOCKER_TEXT[c.blocker].label : STAGE_INFO[c.stage].label), render: (c) => <CaseStatus c={c} /> },
    { key: "action", header: "Action", priority: 3, noExport: true, className: "is-sticky-right", render: action },
  ];
}

export function RowLink({ href, label, icon = "arrow_forward", primary }: { href: string; label: string; icon?: string; primary?: boolean }) {
  // A reference (GIA/2026-27/SMILE/NORTH_WEST_DELHI/03627) is a label too long to hold on one
  // line: kept unbroken it pushed the Turnaround report 143px past a 375px screen. It breaks at
  // its slashes; a short action label ("View", "Review") still never wraps.
  const isRef = label.includes("/");
  return (
    <Link href={href} className={buttonClasses("primary", primary ? "outlined" : "text", "sm", isRef ? "h-auto text-left" : "whitespace-nowrap")}>
      {isRef ? <RefText value={label} /> : label} <Icon name={icon} size={16} aria-hidden />
    </Link>
  );
}

/**
 * The head of every payment-leg page about one file: the NGO, the project, scheme and year, both
 * references — the same header the Payment Status page and the review screen carry, so an officer
 * can always confirm they are on the right file (design-director audit O-12).
 */
export function CaseHeader({
  app,
  ngoName,
  projectTitle,
  eyebrow,
  back,
  actions,
}: {
  app: { id: string; institutionId: string; schemeCode: string; financialYear: string };
  ngoName: string;
  projectTitle: string;
  eyebrow: string;
  back: { label: string; href?: string };
  actions?: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb linkAs={Link} items={[back, { label: eyebrow }]} />
      {/* `eyebrow` names the page in the breadcrumb only. Portal headers carry no page-type label
          above the title; the breadcrumb already says where the reader is. */}
      <PageHeader
        title={ngoName}
        meta={
          <span className="block space-y-1">
            <span className="block text-body-2 text-ink">
              {projectTitle} · {schemeLabel(app.schemeCode)} · FY {app.financialYear}
            </span>
            <span className="block text-body-3 text-ink-muted">
              Application No. <RefText value={app.id} className="text-ink" /> · Project ID {app.institutionId}
            </span>
          </span>
        }
        actions={actions ? <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">{actions}</div> : undefined}
      />
    </>
  );
}
