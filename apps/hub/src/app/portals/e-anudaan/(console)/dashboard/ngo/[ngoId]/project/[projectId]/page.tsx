"use client";

import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_SCREEN_COPY, RecordScreen } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { projectName, projectRunningSince } from "@/lib/e-anudaan/applicant";
import { CctvComplianceCard, StaffRosterCard, WeeklyAttendanceCard } from "@/components/e-anudaan/project-records";

/**
 * Project Records — one project's CCTV compliance, staff roster and weekly attendance, for an
 * officer, beside NGO 360 and the application review (e-Anudaan parity brief §D items 2 and 3).
 *
 * Read-only by construction: this page renders no control that changes a record, and personal
 * identifiers are masked. Linked from NGO 360's institutions and CCTV list, and from the review's
 * Project Records panel.
 *
 * Composed from `RecordScreen` (check:template-adoption): the three records are its tabs, the open
 * tab is in the address so it can be linked to, and loading and not-found are the template's states.
 *
 * DS Audit: RecordScreen ✅ · the cards in `project-records.tsx` — nothing new.
 */
const TABS = ["cctv", "staff", "attendance"] as const;

export default function ProjectRecordsPage() {
  const params = useParams<{ ngoId: string; projectId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { state, hydrated, findNgo, findCctv } = useEAnudaan();
  const ngo = findNgo(decodeURIComponent(params.ngoId));
  const projectId = decodeURIComponent(params.projectId);
  const project = ngo?.institutions.find((i) => i.id === projectId);
  const role = state.session ? ROLES[state.session] : null;
  const directory = role?.nav.find((n) => n.href.endsWith("/dashboard/ngo-directory"));
  const ngo360 = ngo ? `/portals/e-anudaan/dashboard/ngo/${encodeURIComponent(ngo.id)}/360` : undefined;
  const requested = search.get("tab");
  const activeTab = TABS.find((t) => t === requested) ?? "cctv";
  const staff = project ? state.employees.filter((e) => e.projectId === project.id) : [];

  return (
    <RecordScreen
      loading={!hydrated}
      copy={{
        ...DEFAULT_SCREEN_COPY,
        loadingLabel: "Loading the project's records",
        emptyTitle: "Project Not Found",
        emptyDescription: ngo ? `${ngo.name} has no project with the Project ID ${projectId}.` : "This organisation is not in the NGO register.",
      }}
      breadcrumb={[
        directory ? { label: directory.label, href: directory.href } : { label: "Dashboard", href: role?.home },
        ...(ngo ? [{ label: ngo.name, href: ngo360 }] : []),
        { label: project ? projectName(project) : projectId },
      ]}
      title={project ? projectName(project) : projectId}
      meta={project && ngo ? `${project.id} · ${project.nature} · ${project.type} · ${ngo.name}` : undefined}
      activeTab={activeTab}
      onTabChange={(id) => router.replace(`${pathname}?tab=${id}`, { scroll: false })}
      // No project, no tabs: the template reads an empty tab list as the empty state — "Project Not Found".
      tabs={!project ? [] : [
        { id: "cctv", label: "CCTV Compliance", render: () => <CctvComplianceCard setup={findCctv(project.id)} /> },
        { id: "staff", label: "Staff Roster", render: () => <StaffRosterCard staff={staff} /> },
        {
          id: "attendance",
          label: "Weekly Attendance",
          render: () => (
            <WeeklyAttendanceCard
              beneficiaries={state.beneficiaries.filter((b) => b.projectId === project.id)}
              staff={staff}
              since={projectRunningSince(state, project.id)}
            />
          ),
        },
      ]}
    />
  );
}
