"use client";

import { useParams } from "next/navigation";
import { Alert, Badge, Card, CardBody, DescriptionList, ListGroup, ListRow, PageHeader, SectionTitle } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant, statusTone } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import { RefText } from "@/components/e-anudaan/worklist-table";
import { instalmentSchedule, releasePatternFact } from "@/lib/e-anudaan/funding";
import { rupees } from "@/lib/e-anudaan/format";

/**
 * Payment status for a sanctioned application — the live bundle's /finance/payment-status/:id.
 *
 * Maintainer note: not linked from any captured nav, so the layout is inferred. Fund release is
 * mocked — this prototype moves no money and calls no PFMS. The page used to say so in a banner;
 * that is a note for the build team, not for a Finance officer (screen QA, 13 Sep 2026).
 */
export default function PaymentStatusPage() {
  const params = useParams<{ appId: string }>();
  const { state, findApp } = useEAnudaan();
  const app = findApp(decodeURIComponent(params.appId));

  if (!app) {
    return <Alert status="warning" title="Application Not Found">This application is not in the register.</Alert>;
  }

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
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title="Payment Status"
        meta={<RefText value={app.id} className="font-mono" />}
        actions={<Badge status={statusTone(app.status)}>{statusLabel(app)}</Badge>}
      />

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
              layout="inline"
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

      {schedule && (
        <Card variant="outlined">
          <CardBody className="space-y-4">
            <SectionTitle title="Instalments" description={`FY ${schedule.financialYear}. ${releasePatternFact(schedule.pattern)}`} />
            <ListGroup aria-label="Instalments">
              {schedule.rows.map((r) => (
                <ListRow
                  key={r.key}
                  title={`${r.label}${r.share != null ? ` · ${r.share}%` : ""}`}
                  description={`Planned ${rupees(r.planned)}${r.claim?.sanction ? ` · sanctioned ${rupees(r.claim.sanction.total)}` : ""} · released ${rupees(r.released)}`}
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
