"use client";

import { useParams } from "next/navigation";
import { Alert, Badge, Card, CardBody, Icon, ListGroup, ListRow, MetricCard, PageHeader, SectionTitle } from "@mosje/design-system";
import { INSPECTION_STATUS_LABEL, INSPECTION_STATUS_TONE } from "@/lib/e-anudaan/officer";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant } from "@/lib/e-anudaan/selectors";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { accountsFor, maskedAccount } from "@/lib/e-anudaan/applicant";
import { currentAddressOf } from "@/lib/e-anudaan/change-requests";
import { attendanceOf, officerApplications } from "@/lib/e-anudaan/registers";
import { RefText, WorklistTable } from "@/components/e-anudaan/worklist-table";

/**
 * NGO 360 — every application, institution and inspection for one organisation.
 *
 * Reachable in the live bundle at /dashboard/ngo/:ngoId/360 but not linked from any captured
 * nav, so its layout is inferred. Linked from the NGO Directory and from the NGO name on every
 * officer register (inventory §33). Each project shows the address and bank account the Ministry
 * holds for it, after any approved change.
 */
export default function Ngo360Page() {
  const params = useParams<{ ngoId: string }>();
  const { state, findNgo } = useEAnudaan();
  const ngo = findNgo(decodeURIComponent(params.ngoId));

  if (!ngo) {
    return <Alert status="warning" title="Organisation Not Found">This organisation is not in the NGO register.</Alert>;
  }

  const apps = officerApplications(state).filter((a) => a.ngoId === ngo.id);
  const inspections = state.inspections.filter((i) => i.ngoId === ngo.id);
  const attendance = attendanceOf(state, ngo);
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;

  return (
    <div className="space-y-5">
      <PageHeader
        title={ngo.name}
        meta={`${ngo.district}, ${ngo.state} · NGO-Darpan ${ngo.darpanId} · Registration ${ngo.registrationNo}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Applications" value={String(apps.length)} icon={<Icon name="description" size={20} aria-hidden />} />
        <MetricCard label="Sanctioned" value={String(apps.filter((a) => a.sanction).length)} icon={<Icon name="verified" size={20} aria-hidden />} />
        <MetricCard label="Total Grant" value={formatGrant(ngo.totalGrant)} icon={<Icon name="currency_rupee" size={20} aria-hidden />} />
        <MetricCard
          label="Attendance"
          value={attendance.percent === null ? (attendance.running ? "Not Filed" : "No Returns Due") : `${attendance.percent}%`}
          detail={attendance.missed ? `${attendance.missed} project${attendance.missed === 1 ? "" : "s"} with a return not filed` : undefined}
          icon={<Icon name="checklist" size={20} aria-hidden />}
        />
      </div>

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle title="Institutions" />
          <ListGroup>
            {ngo.institutions.map((i) => {
              const account = accountsFor(state, i.id).current;
              return (
                <ListRow
                  key={i.id}
                  title={`${i.id} · ${i.name} · ${i.district}`}
                  description={
                    <>
                      <span className="block">{`${i.nature} · ${i.type} · ${i.building}`}</span>
                      <span className="block">Address: {currentAddressOf(state, i.id)}</span>
                      <span className="block">
                        Bank Account: {account ? `${account.bank} · ${maskedAccount(account.last4)} · ${account.ifsc}` : "Not recorded"}
                      </span>
                    </>
                  }
                />
              );
            })}
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

      <div className="space-y-3">
        <SectionTitle title="Applications" />
        <WorklistTable
          rows={apps}
          variant="explorer"
          reviewBase={key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined}
          caption={`Applications from ${ngo.name}`}
        />
      </div>
    </div>
  );
}
