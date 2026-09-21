/**
 * Small presentational pieces shared by the register and an issue's page.
 * Server-rendered; no state.
 */

import Link from "next/link";
import { Badge, Breadcrumb, type BadgeStatus } from "@mosje/design-system";
import type { IssueStatus, Severity } from "@/lib/website-issues/types";

export const BASE = "/reports/dosje-website";

const SEV_TONE: Record<Severity, BadgeStatus> = { Blocker: "danger", Major: "warning", Minor: "info", Nit: "neutral" };
const STATUS_TONE: Record<IssueStatus, BadgeStatus> = {
  Open: "neutral",
  "In progress": "info",
  "Needs decision": "warning",
  Fixed: "primary",
  Verified: "success",
  "Won't fix": "neutral",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge status={SEV_TONE[severity]} size="sm">{severity}</Badge>;
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <Badge status={STATUS_TONE[status]} size="sm" emphasis={status === "Verified" ? "solid" : "subtle"}>
      {status}
    </Badge>
  );
}

export function RegisterHeader({
  crumbs,
  title,
  lede,
  children,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="sa-container pb-8 pt-10">
        <Breadcrumb linkAs={Link} items={[{ label: "Home", href: "/" }, { label: "Reports", href: "/reports" }, ...crumbs]} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-headline-1 text-ink">{title}</h1>
            {lede ? <p className="mt-3 max-w-measure text-body-1 text-ink-muted">{lede}</p> : null}
          </div>
          {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? iso + "T00:00:00" : iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
}
