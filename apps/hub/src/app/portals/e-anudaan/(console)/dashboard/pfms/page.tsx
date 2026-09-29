"use client";

/**
 * PFMS Set-Up — the Bureau's home (PFMS BRD §4, §3.1 B; FR-NGO-003, FR-HOA-002, FR-MDM-005,
 * FR-DOC-003, BR-DSC-001).
 *
 * DS Audit: OverviewScreen ✅ existing · MetricCard ✅ · Card ✅ · SectionTitle ✅ · DataTable ✅ ·
 * Badge ✅ · Button ✅ · Icon ✅ · screenCopy ✅ · useToast ✅ — composed, nothing new.
 *
 * Five figures, each the one thing that can stop a payment advice before it is prepared: a legacy
 * file with no bank details, a scheme with no PFMS scheme code, master data past its 24-hour limit
 * (BR-MDM-001), a Claim Reference pool running low, and a Checker whose certificate will not sign.
 * Every tile opens the page that clears it. Under them, one line per scheme saying whether it can
 * be paid, because "is this scheme ready?" is the question the Bureau is asked.
 */

import * as React from "react";
import Link from "next/link";
import { Badge, Button, Card, CardBody, DataTable, Icon, OverviewScreen, SectionTitle, screenCopy, useToast, type DataTableColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { paymentCases } from "@/lib/e-anudaan/pfms/selectors";
import { mastersAgeHours, mastersStale } from "@/lib/e-anudaan/pfms/masters";
import { pfmsFinancialYear } from "@/lib/e-anudaan/pfms/advice";
import { poolUtilisation } from "@/lib/e-anudaan/pfms/reports";
import { EA } from "@/components/e-anudaan/pfms/payment-ui";

const PFMS = `${EA}/dashboard/pfms`;
const DAY = 86_400_000;
/** A pool with fewer numbers than this left is flagged (FR-DOC-003). */
const LOW_POOL = 10;
/** A Checker certificate expiring within this many days is flagged (BR-DSC-001). */
const CERT_WARN_DAYS = 30;

/** "2026-09-29T…" → "2026-27": the e-Anudaan financial year a date falls in (April to March). */
function financialYearOf(iso: string): string {
  const y = Number(iso.slice(0, 4));
  const start = Number(iso.slice(5, 7)) >= 4 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

function ageText(hours: number): string {
  if (hours < 1) return "Under 1 hour";
  if (hours < 48) return `${Math.floor(hours)} hour${Math.floor(hours) === 1 ? "" : "s"}`;
  return `${Math.floor(hours / 24)} days`;
}

type SchemeRow = {
  schemeCode: string;
  pfmsSchemeCode: string | null;
  heads: number;
  ddos: number;
  pendingDecision: string | undefined;
};

export default function PfmsSetUpPage() {
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated, now, refreshMasters } = usePfms();
  const { toast } = useToast();
  const loading = !hydrated || !pfmsHydrated;
  const at = now();

  const cases = React.useMemo(() => paymentCases(state, pfms), [state, pfms]);
  const waitingBackfill = cases.filter((c) => c.blocker === "needs-backfill").length;
  const noSchemeCode = pfms.configs.filter((c) => !c.pfmsSchemeCode);
  const ageHours = mastersAgeHours(pfms.masters, at);
  const stale = mastersStale(pfms.masters, at);

  // The pool that matters is this year's: a past year's numbers can no longer be sent.
  const fy = financialYearOf(at);
  const pools = poolUtilisation(pfms.pool, pfms.advices).filter((r) => r.financialYear === pfmsFinancialYear(fy));
  const lowest = pools.reduce<(typeof pools)[number] | null>((min, r) => (!min || r.remaining < min.remaining ? r : min), null);

  const today = at.slice(0, 10);
  const certsDue = pfms.designations.filter((d) => (Date.parse(d.certificateExpires) - Date.parse(today)) / DAY <= CERT_WARN_DAYS);
  const certsExpired = certsDue.filter((d) => d.certificateExpires < today).length;

  const schemeRows: SchemeRow[] = pfms.configs.map((c) => ({
    schemeCode: c.schemeCode,
    pfmsSchemeCode: c.pfmsSchemeCode,
    heads: c.heads.length,
    ddos: c.ddoCodes.length,
    pendingDecision: c.pendingDecision,
  }));
  const schemeColumns: DataTableColumn<SchemeRow>[] = [
    { key: "schemeCode", header: "Scheme", render: (r) => <span className="font-semibold text-ink">{schemeLabel(r.schemeCode)}</span> },
    { key: "pfmsSchemeCode", header: "PFMS Scheme Code", render: (r) => r.pfmsSchemeCode ?? "Awaited" },
    { key: "heads", header: "Heads of Account", align: "end", render: (r) => r.heads },
    { key: "ddos", header: "DDOs", align: "end", render: (r) => r.ddos },
    {
      key: "ready",
      header: "Status",
      render: (r) =>
        !r.pfmsSchemeCode ? (
          <Badge status="warning" size="sm">Scheme Code Awaited</Badge>
        ) : r.heads === 0 ? (
          <Badge status="warning" size="sm">No Head of Account</Badge>
        ) : r.pendingDecision ? (
          <Badge status="info" size="sm">Decision Awaited</Badge>
        ) : (
          <Badge status="success" size="sm">Ready</Badge>
        ),
    },
  ];

  return (
    <OverviewScreen
      title="PFMS Set-Up"
      meta="The configuration a payment advice needs before it can be prepared and sent to PFMS."
      loading={loading}
      actions={
        <Button
          appearance="outlined"
          size="sm"
          iconLeft={<Icon name="sync" size={18} aria-hidden />}
          onClick={() => {
            refreshMasters();
            toast("Master data refreshed from PFMS.", "success");
          }}
        >
          Refresh Master Data
        </Button>
      }
      kpisLoading={loading ? 5 : undefined}
      kpis={
        loading
          ? undefined
          : [
              {
                key: "backfill",
                label: "Legacy Files Waiting for Bank Details",
                value: String(waitingBackfill),
                detail: waitingBackfill === 0 ? "None waiting" : "Sanctioned, with no bank account on record",
                tone: waitingBackfill > 0 ? "warning" : "neutral",
                href: `${PFMS}/back-fill`,
                linkAs: Link,
                icon: <Icon name="history_edu" size={20} aria-hidden />,
              },
              {
                key: "scheme-code",
                label: "Schemes Without a PFMS Scheme Code",
                value: String(noSchemeCode.length),
                detail: noSchemeCode.length === 0 ? "Every scheme has a code" : noSchemeCode.map((c) => schemeLabel(c.schemeCode)).join(", "),
                tone: noSchemeCode.length > 0 ? "warning" : "neutral",
                href: `${PFMS}/heads-of-account`,
                linkAs: Link,
                icon: <Icon name="account_tree" size={20} aria-hidden />,
              },
              {
                key: "masters",
                label: "Master Data Age",
                value: ageText(ageHours),
                detail: `${stale ? "Out of date. " : ""}Last synchronised ${formatDateTime(pfms.masters.syncedAt)}`,
                tone: stale ? "danger" : "neutral",
                href: `${PFMS}/masters`,
                linkAs: Link,
                icon: <Icon name="sync" size={20} aria-hidden />,
              },
              ...(lowest
                ? [
                    {
                      key: "pool",
                      label: "Claim Reference Numbers Remaining",
                      value: String(lowest.remaining),
                      detail: `Lowest pool: division code ${lowest.pdCode}, FY ${fy}`,
                      tone: lowest.remaining < LOW_POOL ? ("warning" as const) : ("neutral" as const),
                      href: `${PFMS}/claim-references`,
                      linkAs: Link,
                      icon: <Icon name="confirmation_number" size={20} aria-hidden />,
                    },
                  ]
                : []),
              {
                key: "certificates",
                label: "Checker Certificates Needing Renewal",
                value: String(certsDue.length),
                detail: certsDue.length === 0 ? `None expiring within ${CERT_WARN_DAYS} days` : `${certsExpired} expired, ${certsDue.length - certsExpired} expiring within ${CERT_WARN_DAYS} days`,
                tone: certsExpired > 0 ? "danger" : certsDue.length > 0 ? "warning" : "neutral",
                href: `${PFMS}/designations`,
                linkAs: Link,
                icon: <Icon name="badge" size={20} aria-hidden />,
              },
            ]
      }
      recent={
        loading ? undefined : (
          <Card variant="outlined">
            <CardBody className="space-y-4">
              <SectionTitle as={2} title="Scheme Readiness" description="Whether each scheme has what a payment advice needs." />
              <DataTable<SchemeRow>
                caption="Scheme readiness for payment through PFMS"
                columns={schemeColumns}
                data={schemeRows}
                total={schemeRows.length}
                emptyLabel="No scheme is configured for payment through PFMS."
              />
            </CardBody>
          </Card>
        )
      }
      copy={screenCopy({ loadingLabel: "Loading the PFMS set-up" })}
    />
  );
}
