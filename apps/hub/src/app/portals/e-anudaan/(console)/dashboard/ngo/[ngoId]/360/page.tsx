"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Alert,
  Badge,
  Breadcrumb,
  buttonClasses,
  Card,
  CardBody,
  Icon,
  ListGroup,
  ListRow,
  MetricCard,
  PageHeader,
  Pagination,
  Search,
  SectionTitle,
} from "@mosje/design-system";
import { INSPECTION_STATUS_LABEL, INSPECTION_STATUS_TONE } from "@/lib/e-anudaan/officer";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant } from "@/lib/e-anudaan/selectors";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { accountsFor, maskedAccount } from "@/lib/e-anudaan/applicant";
import { currentAddressOf } from "@/lib/e-anudaan/change-requests";
import { attendanceOf, officerApplications } from "@/lib/e-anudaan/registers";
import { RefText, WorklistTable } from "@/components/e-anudaan/worklist-table";
import { CCTV_STATUS_LABEL, cctvCompliance, type CctvStatus } from "@/lib/e-anudaan/cctv";
import { CctvStatusBadge } from "@/components/e-anudaan/cctv-parts";
import { projectRecordsHref } from "@/components/e-anudaan/project-records";

/** Institutions per page. Five fit one screen at 1440; 30 of them ran to 6,325px (audit O-11). */
const INSTITUTIONS_PER_PAGE = 5;

/**
 * NGO 360 — every application, institution and inspection for one organisation.
 *
 * Reachable in the live bundle at /dashboard/ngo/:ngoId/360 but not linked from any captured
 * nav, so its layout is inferred. Linked from the NGO Directory and from the NGO name on every
 * officer register (inventory §33). Each project shows the address and bank account the Ministry
 * holds for it, after any approved change.
 *
 * Design-director audit O-11 (16 Sep 2026): more than 30 institution rows (6,325px) came before
 * anything else, with no search, paging or way back, and Total Grant read ₹22.28 Cr here against
 * ₹22,27,97,125 in Reports. Now: funding first, then applications, inspections and the
 * institutions, searchable and five to a page; a breadcrumb back to the directory; and the grant
 * figure is the sum of this organisation's sanction orders — the expression Reports adds up — in
 * the summary form every screen uses.
 *
 * CCTV compliance and Project Records (parity brief §D items 2 and 3, 17 Sep 2026): every project's
 * CCTV standing, read from the same `cctvCompliance` the project's own records show, the projects
 * with a requirement not met listed first, five to a page; and each institution links to its
 * read-only Project Records (staff roster, weekly attendance).
 *
 * DS Audit: Breadcrumb ✅ · Search ✅ · Pagination ✅ added to the existing PageHeader · MetricCard ·
 * Card · ListGroup — nothing new.
 */
export default function Ngo360Page() {
  const params = useParams<{ ngoId: string }>();
  const { state, findNgo } = useEAnudaan();
  const ngo = findNgo(decodeURIComponent(params.ngoId));
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [cctvPage, setCctvPage] = React.useState(1);

  if (!ngo) {
    return <Alert status="warning" title="Organisation Not Found">This organisation is not in the NGO register.</Alert>;
  }

  const apps = officerApplications(state).filter((a) => a.ngoId === ngo.id);
  const sanctioned = apps.filter((a) => a.sanction);
  const granted = sanctioned.reduce((s, a) => s + (a.sanction?.total ?? 0), 0);
  const inspections = state.inspections.filter((i) => i.ngoId === ngo.id);
  const attendance = attendanceOf(state, ngo);
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  const directory = role?.nav.find((n) => n.href.endsWith("/dashboard/ngo-directory"));

  const needle = q.trim().toLowerCase();
  const institutions = ngo.institutions.filter(
    (i) => !needle || `${i.id} ${i.name} ${i.district} ${i.state} ${i.nature} ${i.type}`.toLowerCase().includes(needle),
  );
  const pages = Math.max(1, Math.ceil(institutions.length / INSTITUTIONS_PER_PAGE));
  const safePage = Math.min(page, pages);
  const shown = institutions.slice((safePage - 1) * INSTITUTIONS_PER_PAGE, safePage * INSTITUTIONS_PER_PAGE);

  // One reading per project, behind the counts and the list alike.
  const cctv = ngo.institutions.map((i) => ({ institution: i, compliance: cctvCompliance(state.cctv.find((c) => c.projectId === i.id)) }));
  const cctvCount = (s: CctvStatus) => cctv.filter((r) => r.compliance.status === s).length;
  const cctvOrder: Record<CctvStatus, number> = { "action-needed": 0, "no-cameras": 1, "not-configured": 2, compliant: 3 };
  const cctvOutstanding = cctv
    .filter((r) => r.compliance.status !== "compliant")
    .sort((a, b) => cctvOrder[a.compliance.status] - cctvOrder[b.compliance.status] || a.institution.id.localeCompare(b.institution.id));
  const cctvPages = Math.max(1, Math.ceil(cctvOutstanding.length / INSTITUTIONS_PER_PAGE));
  const cctvSafePage = Math.min(cctvPage, cctvPages);
  const cctvShown = cctvOutstanding.slice((cctvSafePage - 1) * INSTITUTIONS_PER_PAGE, cctvSafePage * INSTITUTIONS_PER_PAGE);

  return (
    <div className="space-y-5">
      <Breadcrumb
        linkAs={Link}
        items={[
          directory ? { label: directory.label, href: directory.href } : { label: "Dashboard", href: role?.home },
          { label: ngo.name },
        ]}
      />
      <PageHeader
        title={ngo.name}
        meta={`${ngo.district}, ${ngo.state} · NGO-Darpan ${ngo.darpanId} · Registration ${ngo.registrationNo}`}
      />

      <section aria-labelledby="ngo360-funding" className="space-y-3">
        <SectionTitle title="Funding" headingId="ngo360-funding" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Applications" value={String(apps.length)} icon={<Icon name="description" size={20} aria-hidden />} />
          <MetricCard label="Sanctioned" value={String(sanctioned.length)} icon={<Icon name="verified" size={20} aria-hidden />} />
          <MetricCard label="Total Grant Sanctioned" value={formatGrant(granted)} icon={<Icon name="currency_rupee" size={20} aria-hidden />} />
          <MetricCard
            label="Attendance"
            value={attendance.percent === null ? (attendance.running ? "Not Filed" : "No Returns Due") : `${attendance.percent}%`}
            detail={attendance.missed ? `${attendance.missed} project${attendance.missed === 1 ? "" : "s"} with a return not filed` : undefined}
            icon={<Icon name="checklist" size={20} aria-hidden />}
          />
        </div>
      </section>

      <div className="space-y-3">
        <SectionTitle title="Applications" />
        <WorklistTable
          rows={apps}
          variant="explorer"
          reviewBase={key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined}
          caption={`Applications from ${ngo.name}`}
        />
      </div>

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
                      <RefText value={i.applicationId} /> · {i.visitType}
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

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle
            title="CCTV Compliance"
            description={
              ngo.institutions.length
                ? (["compliant", "action-needed", "no-cameras", "not-configured"] as const)
                    .map((s) => `${CCTV_STATUS_LABEL[s]} ${cctvCount(s)}`)
                    .join(" · ")
                : undefined
            }
          />
          {ngo.institutions.length === 0 ? (
            <p className="text-body-2 text-ink-muted">No institution is registered for this organisation.</p>
          ) : cctvOutstanding.length === 0 ? (
            <p className="text-body-2 text-ink">Every project of {ngo.name} meets the CCTV requirements.</p>
          ) : (
            <>
              <ListGroup aria-label="Projects with CCTV requirements outstanding">
                {cctvShown.map(({ institution: i, compliance }) => (
                  <ListRow
                    key={i.id}
                    title={`${i.id} · ${i.name} · ${i.district}`}
                    description={
                      compliance.flags.length
                        ? compliance.flags.join(" ")
                        : compliance.status === "not-configured"
                          ? "CCTV has not been set up at this project."
                          : undefined
                    }
                    trailing={
                      <span className="flex flex-wrap items-center justify-end gap-3">
                        <CctvStatusBadge compliance={compliance} />
                        <Link href={projectRecordsHref(ngo.id, i.id)} className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}>
                          Project Records
                        </Link>
                      </span>
                    }
                  />
                ))}
              </ListGroup>
              {cctvPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-body-3 text-ink-muted">
                    {(cctvSafePage - 1) * INSTITUTIONS_PER_PAGE + 1}–{Math.min(cctvSafePage * INSTITUTIONS_PER_PAGE, cctvOutstanding.length)} of {cctvOutstanding.length} projects not compliant
                  </p>
                  <Pagination page={cctvSafePage} totalPages={cctvPages} onPageChange={setCctvPage} label="CCTV compliance pages" size="sm" />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle title="Institutions" count={ngo.institutions.length}>
            <div className="w-full sm:w-72">
              <Search
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                onClear={() => {
                  setQ("");
                  setPage(1);
                }}
                placeholder="Project ID, name or district"
                aria-label="Search this organisation's institutions"
              />
            </div>
          </SectionTitle>
          {institutions.length === 0 ? (
            <p className="text-body-2 text-ink-muted" role="status">
              {ngo.institutions.length === 0
                ? "No institution is registered for this organisation."
                : `No institution of ${ngo.name} matches “${q.trim()}”. Clear the search to see all ${ngo.institutions.length}.`}
            </p>
          ) : (
            <>
              <ListGroup aria-label="Institutions">
                {shown.map((i) => {
                  const account = accountsFor(state, i.id).current;
                  return (
                    <ListRow
                      key={i.id}
                      title={`${i.id} · ${i.name} · ${i.district}`}
                      trailing={
                        <Link href={projectRecordsHref(ngo.id, i.id)} className={buttonClasses("primary", "text", "sm", "whitespace-nowrap")}>
                          Project Records
                        </Link>
                      }
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
              {pages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-body-3 text-ink-muted">
                    {(safePage - 1) * INSTITUTIONS_PER_PAGE + 1}–{Math.min(safePage * INSTITUTIONS_PER_PAGE, institutions.length)} of {institutions.length}
                  </p>
                  <Pagination page={safePage} totalPages={pages} onPageChange={setPage} label="Institution pages" size="sm" />
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
