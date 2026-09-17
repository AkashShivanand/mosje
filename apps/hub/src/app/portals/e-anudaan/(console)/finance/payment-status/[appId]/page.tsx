"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  Badge,
  Breadcrumb,
  Card,
  CardBody,
  DescriptionList,
  Icon,
  ListGroup,
  ListRow,
  PageHeader,
  SectionTitle,
  buttonClasses,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant, schemeLabel, statusTone } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { RefText } from "@/components/e-anudaan/worklist-table";
import { instalmentSchedule, releasePatternFact } from "@/lib/e-anudaan/funding";
import { ServiceErrorNotice, useFailureOnLoad } from "@/components/e-anudaan/service-error";

/**
 * Payment status for a sanctioned application — the live bundle's /finance/payment-status/:id.
 *
 * Maintainer note: not linked from any captured nav, so the layout is inferred. Fund release is
 * mocked — this prototype moves no money and calls no PFMS. The page used to say so in a banner;
 * that is a note for the build team, not for a Finance officer (screen QA, 13 Sep 2026).
 *
 * Design-director audit O-12 (16 Sep 2026): the header showed only "LGCY/76001" — no NGO, project
 * or scheme, so the officer could not confirm they were on the right file — `₹29.00 L` sat beside
 * `₹48,00,000` on one page, and there was no way back. The header now follows the review screen
 * (NGO · project · scheme · FY · both references) under a breadcrumb.
 *
 * Money: every amount is in the SUMMARY form (glossary §2), the sanction figures and the instalment
 * rows alike. This page answers "where has the money reached?" — a status read, not the place a
 * figure is entered, confirmed or legally stated. The exact rupees are stated on the sanction order
 * and the review screen's Sanction Order panel, one press away through View Application; restating
 * them here in a second form is what put two shapes of one figure on the page.
 *
 * Width: fluid like every portal surface (X-07), the two short cards side by side from xl.
 */
export default function PaymentStatusPage() {
  const params = useParams<{ appId: string }>();
  const { state, findApp } = useEAnudaan();
  const app = findApp(decodeURIComponent(params.appId));
  const role = state.session ? ROLES[state.session] : null;
  // The status is read from PFMS when the page opens; that read can fail (error-catalogue.ts).
  const [failure, clearFailure] = useFailureOnLoad("payment");

  if (failure?.target === "page") {
    return <ServiceErrorNotice failure={failure} homeHref={role?.home} onRetry={clearFailure} onDismiss={clearFailure} />;
  }

  if (!app) {
    return <Alert status="warning" title="Application Not Found">This application is not in the register.</Alert>;
  }

  const ngo = state.ngos.find((n) => n.id === app.ngoId);
  const key = role ? reviewKeyOf(role) : null;
  // Payment Status is opened from Sanctioned Applications; an officer without that register goes back home.
  const register = role?.nav.find((n) => n.href.endsWith("/sanctioned"));

  // Released is read from the release the Under Secretary recorded on the review screen, not
  // from the status alone, so this page and the review's Instalments panel give one answer.
  const released = !!app.release;
  const steps = [
    { label: "Sanctioned", done: !!app.sanction },
    { label: "Bill Raised", done: !!app.sanction },
    { label: "Released to PFMS", done: released },
    { label: "Credited to NGO", done: released },
  ];
  const schedule = instalmentSchedule(state, app);

  return (
    <div className="space-y-5">
      <Breadcrumb
        linkAs={Link}
        items={[
          register ? { label: register.label, href: register.href } : { label: "Dashboard", href: role?.home },
          { label: "Payment Status" },
        ]}
      />
      <PageHeader
        eyebrow="Payment Status"
        title={ngo?.name ?? app.ngoId}
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
        actions={
          <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">
            <Badge status={statusTone(app.status)} className="h-auto max-w-full whitespace-normal">
              {statusLabel(app)}
            </Badge>
            {key && (
              <Link
                href={`/portals/e-anudaan/dashboard/sm2/${key}/review/${encodeURIComponent(app.id)}`}
                className={buttonClasses("primary", "outlined", "sm", "whitespace-nowrap")}
              >
                <Icon name="description" size={16} aria-hidden /> View Application
              </Link>
            )}
          </div>
        }
      />

      <ServiceErrorNotice failure={failure} homeHref={role?.home} onRetry={clearFailure} onDismiss={clearFailure} />

      <div className="grid gap-5 xl:grid-cols-2 xl:items-start">
        <Card variant="outlined">
          <CardBody className="space-y-4">
            <SectionTitle title="Disbursement" />
            <ListGroup aria-label="Disbursement steps">
              {steps.map((s) => (
                <ListRow
                  key={s.label}
                  title={s.label}
                  trailing={<Badge status={s.done ? "success" : "neutral"}>{s.done ? "Done" : "Pending"}</Badge>}
                />
              ))}
            </ListGroup>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardBody className="space-y-4">
            <SectionTitle title="Sanction" />
            {app.sanction ? (
              <DescriptionList
                columns={2}
                divided
                items={[
                  { term: "Order No.", value: app.sanction.orderNo },
                  { term: "Sanction Date", value: formatDate(app.sanction.sanctionedAt) },
                  { term: "Recurring", value: formatGrant(app.sanction.recurring) },
                  { term: "Non-Recurring", value: formatGrant(app.sanction.nonRecurring) },
                  { term: "Total Sanctioned", value: formatGrant(app.sanction.total) },
                  { term: "Released", value: app.release ? `${formatGrant(app.release.amount)} · ${formatDate(app.release.releasedAt)}` : formatGrant(0) },
                ]}
              />
            ) : (
              <p className="text-body-2 text-ink-muted">This application has not been sanctioned yet.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {schedule && (
        <Card variant="outlined">
          <CardBody className="space-y-4">
            <SectionTitle title="Instalments" description={`FY ${schedule.financialYear}. ${releasePatternFact(schedule.pattern)}`} />
            <ListGroup aria-label="Instalments">
              {schedule.rows.map((r) => (
                <ListRow
                  key={r.key}
                  title={`${r.label}${r.share != null ? ` · ${r.share}%` : ""}`}
                  description={`Planned ${formatGrant(r.planned)}${r.claim?.sanction ? ` · sanctioned ${formatGrant(r.claim.sanction.total)}` : ""} · released ${formatGrant(r.released)}`}
                  trailing={
                    <Badge status={r.state === "released" ? "success" : r.state === "to-release" ? "warning" : "neutral"}>
                      {r.state === "released" ? "Released" : r.state === "to-release" ? "Awaiting Release" : r.state === "claimed" ? "Under Examination" : r.state === "open" ? "Open for Claim" : "Not Opened"}
                    </Badge>
                  }
                />
              ))}
            </ListGroup>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
