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
import { STAGE_INFO, TIMELINE_STAGES, isException, stageIndex, type AnyStage, type StageTone } from "@/lib/e-anudaan/pfms/stages";
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
 * The payment's progress as a stepper. An exception is drawn at the step it interrupted, marked as
 * failed, so a reader sees both how far the payment got and that it stopped.
 */
export function PaymentStages({ stage, orientation = "horizontal" }: { stage: AnyStage; orientation?: "horizontal" | "vertical" }) {
  const at = stage === "closed" ? TIMELINE_STAGES.length - 1 : stageIndex(stage);
  const failed = isException(stage);
  const steps: StepperStep[] = TIMELINE_STAGES.map((s, i) => ({
    label: STAGE_INFO[s].label,
    description: STAGE_INFO[s].holder === "—" ? undefined : STAGE_INFO[s].holder,
    ...(i < at || (s === "paid" && (stage === "paid" || stage === "closed")) ? { status: "complete" as const } : {}),
    ...(failed && i === at ? { status: "error" as const } : {}),
  }));
  return (
    <Stepper
      steps={steps}
      current={Math.min(at, TIMELINE_STAGES.length - 1)}
      orientation={orientation}
      size="sm"
      collapse="auto"
      ariaLabel="Payment progress"
    />
  );
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
  return (
    <Link href={href} className={buttonClasses("primary", primary ? "outlined" : "text", "sm", "whitespace-nowrap")}>
      {label} <Icon name={icon} size={16} aria-hidden />
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
      <PageHeader
        eyebrow={eyebrow}
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
