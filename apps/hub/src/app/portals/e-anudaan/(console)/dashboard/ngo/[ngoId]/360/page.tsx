"use client";

import { useParams } from "next/navigation";
import { Alert, Badge, Card, CardBody, Icon, ListGroup, ListRow, MetricCard, PageHeader, SectionTitle } from "@mosje/design-system";
import { INSPECTION_STATUS_LABEL, INSPECTION_STATUS_TONE } from "@/lib/e-anudaan/officer";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import { RefText, WorklistTable } from "@/components/e-anudaan/worklist-table";

/**
 * NGO 360 — every application, institution and inspection for one organisation.
 *
 * Reachable in the live bundle at /dashboard/ngo/:ngoId/360 but not linked from any captured
 * nav, so its layout is inferred; the data it shows is the same the NGO Directory exposes.
 */
export default function Ngo360Page() {
  const params = useParams<{ ngoId: string }>();
  const { state, findNgo } = useEAnudaan();
  const ngo = findNgo(decodeURIComponent(params.ngoId));

  if (!ngo) {
    return <Alert status="warning" title="Organisation Not Found">This organisation is not in the NGO register.</Alert>;
  }

  const apps = state.applications.filter((a) => a.ngoId === ngo.id);
  const inspections = state.inspections.filter((i) => i.ngoId === ngo.id);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="E-ANUDAAN"
        title={ngo.name}
        meta={`${ngo.district}, ${ngo.state} · NGO-Darpan ${ngo.darpanId} · Registration ${ngo.registrationNo}`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Applications" value={String(apps.length)} icon={<Icon name="description" size={20} aria-hidden />} />
        <MetricCard label="Sanctioned" value={String(ngo.sanctionedCount)} icon={<Icon name="verified" size={20} aria-hidden />} />
        <MetricCard label="Total Grant" value={formatGrant(ngo.totalGrant)} icon={<Icon name="currency_rupee" size={20} aria-hidden />} />
      </div>

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle title="Institutions" />
          <ListGroup>
            {ngo.institutions.map((i) => (
              <ListRow
                key={i.id}
                title={`${i.id} · ${i.name} · ${i.district}`}
                description={`${i.nature} · ${i.type} · ${i.building}`}
              />
            ))}
          </ListGroup>
        </CardBody>
      </Card>

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle title="Inspections" />
          {inspections.length === 0 ? (
            <p className="text-body-2 text-ink-muted">No inspection has been raised for this organisation.</p>
          ) : (
            <ListGroup>
              {inspections.map((i) => (
                <ListRow
                  key={i.id}
                  title={
                    <>
                      <RefText value={i.applicationId} className="font-mono" /> · {i.visitType}
                    </>
                  }
                  trailing={
                    <>
                      {i.scheduledFor ? formatDate(i.scheduledFor) : "Not Scheduled"}
                      <Badge status={INSPECTION_STATUS_TONE[i.status]}>{INSPECTION_STATUS_LABEL[i.status]}</Badge>
                    </>
                  }
                />
              ))}
            </ListGroup>
          )}
        </CardBody>
      </Card>

      <WorklistTable rows={apps} variant="explorer" caption={`Applications from ${ngo.name}`} />

      <p className="text-body-3 text-ink-muted">
        Last inspection: {ngo.lastInspection ? formatDate(ngo.lastInspection) : "—"} ·
        Current status of most recent application:{" "}
        {apps[0] ? statusLabel(apps[0]) : "—"}
      </p>
    </div>
  );
}
