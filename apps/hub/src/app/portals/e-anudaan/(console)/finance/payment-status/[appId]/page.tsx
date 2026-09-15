"use client";

import { useParams } from "next/navigation";
import { Alert, Badge, Card, CardBody, DescriptionList, ListGroup, ListRow, PageHeader, SectionTitle } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant, statusTone } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import { RefText } from "@/components/e-anudaan/worklist-table";

/**
 * Payment status for a sanctioned application — the live bundle's /finance/payment-status/:id.
 *
 * Maintainer note: not linked from any captured nav, so the layout is inferred. Fund release is
 * mocked — this prototype moves no money and calls no PFMS. The page used to say so in a banner;
 * that is a note for the build team, not for a Finance officer (screen QA, 13 Sep 2026).
 */
export default function PaymentStatusPage() {
  const params = useParams<{ appId: string }>();
  const { findApp } = useEAnudaan();
  const app = findApp(decodeURIComponent(params.appId));

  if (!app) {
    return <Alert status="warning" title="Application Not Found">This application is not in the register.</Alert>;
  }

  const steps = [
    { label: "Sanctioned", done: !!app.sanction },
    { label: "Bill Raised", done: !!app.sanction },
    { label: "Released to PFMS", done: app.status === "Released" },
    { label: "Credited to NGO", done: app.status === "Released" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        eyebrow="E-ANUDAAN"
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
                { term: "Released", value: formatGrant(app.status === "Released" ? app.sanction.total : 0) },
              ]}
            />
          ) : (
            <p className="text-body-2 text-ink-muted">This application has not been sanctioned yet.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
