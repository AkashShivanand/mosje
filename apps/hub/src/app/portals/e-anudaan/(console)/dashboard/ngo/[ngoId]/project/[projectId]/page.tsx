"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Alert, Breadcrumb, PageHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { projectName, projectRunningSince } from "@/lib/e-anudaan/applicant";
import {
  CctvComplianceCard,
  RecordsSkeleton,
  StaffRosterCard,
  WeeklyAttendanceCard,
} from "@/components/e-anudaan/project-records";

/**
 * Project Records — one project's CCTV compliance, staff roster and weekly attendance, for an
 * officer, beside NGO 360 and the application review (e-Anudaan parity brief §D items 2 and 3).
 *
 * Read-only by construction: this page renders no control that changes a record, and personal
 * identifiers are masked. Linked from NGO 360's institutions and CCTV list, and from the review's
 * Project Records panel.
 *
 * DS Audit: Breadcrumb ✅ · PageHeader ✅ · Alert ✅ · the cards in `project-records.tsx` — nothing new.
 */
export default function ProjectRecordsPage() {
  const params = useParams<{ ngoId: string; projectId: string }>();
  const { state, hydrated, findNgo, findCctv } = useEAnudaan();
  const ngo = findNgo(decodeURIComponent(params.ngoId));
  const projectId = decodeURIComponent(params.projectId);
  const project = ngo?.institutions.find((i) => i.id === projectId);
  const role = state.session ? ROLES[state.session] : null;
  const directory = role?.nav.find((n) => n.href.endsWith("/dashboard/ngo-directory"));
  const ngo360 = ngo ? `/portals/e-anudaan/dashboard/ngo/${encodeURIComponent(ngo.id)}/360` : undefined;

  if (!hydrated) {
    return (
      <div className="space-y-5">
        <RecordsSkeleton label="Loading the project's records" />
      </div>
    );
  }

  if (!ngo || !project) {
    return (
      <Alert status="warning" title="Project Not Found">
        {ngo ? `${ngo.name} has no project with the Project ID ${projectId}.` : "This organisation is not in the NGO register."}
      </Alert>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        linkAs={Link}
        items={[
          directory ? { label: directory.label, href: directory.href } : { label: "Dashboard", href: role?.home },
          { label: ngo.name, href: ngo360 },
          { label: projectName(project) },
        ]}
      />
      <PageHeader
        title={projectName(project)}
        meta={`${project.id} · ${project.nature} · ${project.type} · ${ngo.name}`}
      />
      <CctvComplianceCard setup={findCctv(project.id)} />
      <StaffRosterCard staff={state.employees.filter((e) => e.projectId === project.id)} />
      <WeeklyAttendanceCard
        beneficiaries={state.beneficiaries.filter((b) => b.projectId === project.id)}
        staff={state.employees.filter((e) => e.projectId === project.id)}
        since={projectRunningSince(state, project.id)}
      />
    </div>
  );
}
