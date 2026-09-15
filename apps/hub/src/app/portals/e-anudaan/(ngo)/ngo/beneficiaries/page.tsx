"use client";

/**
 * Beneficiaries & Staff — the project's roster, on its own page.
 *
 * DS Audit: WorklistScreen ✅ existing · FormField ✅ · Select ✅ · Search ✅ · SegmentedControl ✅ ·
 * Badge ✅ · Button ✅ · Icon ✅ · roster dialogs (portal, over Modal · FormField · OtpInput ·
 * FileList) ✅ — nothing new in the design system.
 *
 * The roster used to be the second and third tabs of Weekly Attendance. The review call of
 * 11 Sep 2026 asked for it to stand alone (T233–239): an officer told "go and add an employee"
 * would never think to look inside attendance. Attendance now reads this same roster.
 *
 * Project, tab and search live in the URL, so a link to one project's staff list works.
 */

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Badge,
  Button,
  FormField,
  Icon,
  Search,
  SegmentedControl,
  Select,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { projectName, projectsOf } from "@/lib/e-anudaan/applicant";
import { formatDate } from "@/lib/e-anudaan/format";
import type { Beneficiary, Employee } from "@/lib/e-anudaan/roster";
import { AddBeneficiaryDialog, AddEmployeeDialog, PersonDetailsDialog } from "@/components/e-anudaan/roster-dialogs";

type Tab = "beneficiaries" | "staff";

export default function BeneficiariesAndStaffPage() {
  return (
    <React.Suspense fallback={null}>
      <Roster />
    </React.Suspense>
  );
}

function Roster() {
  const { state, hydrated, addBeneficiary, addEmployee, setBeneficiaryActive, setEmployeeActive } = useEAnudaan();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const ngo = state.ngos[0];
  const projects = ngo ? projectsOf(state, ngo.id) : [];

  const projectId = params.get("project") ?? projects[0]?.id ?? "";
  const tab: Tab = params.get("tab") === "staff" ? "staff" : "beneficiaries";
  const q = params.get("q") ?? "";
  const project = projects.find((p) => p.id === projectId);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const [adding, setAdding] = React.useState<Tab | null>(null);
  const [viewing, setViewing] = React.useState<
    { kind: "beneficiary"; data: Beneficiary } | { kind: "employee"; data: Employee } | null
  >(null);

  const beneficiaries = state.beneficiaries.filter((b) => b.projectId === projectId);
  const employees = state.employees.filter((e) => e.projectId === projectId);
  const needle = q.trim().toLowerCase();

  const benRows = beneficiaries
    .filter((b) => !needle || b.name.toLowerCase().includes(needle) || b.idNumber.includes(needle))
    .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));
  const empRows = employees
    .filter((e) => !needle || e.name.toLowerCase().includes(needle) || (e.designation ?? "").toLowerCase().includes(needle))
    .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));

  const status = (active: boolean) => <Badge status={active ? "success" : "neutral"} size="sm">{active ? "Active" : "Deactivated"}</Badge>;

  const benColumns: WorklistColumn<Beneficiary>[] = [
    { key: "name", header: "Name", priority: 1 },
    { key: "gender", header: "Gender", priority: 2 },
    { key: "category", header: "Category", priority: 3, render: (r) => r.category ?? "—" },
    { key: "idType", header: "Identity Document", priority: 3, render: (r) => `${r.idType} ending ${r.idNumber.slice(-4)}` },
    { key: "admissionDate", header: "Admitted On", priority: 2, render: (r) => (r.admissionDate ? formatDate(r.admissionDate) : "—") },
    { key: "active", header: "Status", priority: 2, render: (r) => status(r.active), exportValue: (r) => (r.active ? "Active" : "Deactivated") },
  ];
  const empColumns: WorklistColumn<Employee>[] = [
    { key: "name", header: "Name", priority: 1 },
    { key: "designation", header: "Designation", priority: 2, render: (r) => r.designation ?? "—" },
    { key: "qualification", header: "Qualification", priority: 2, render: (r) => r.qualification ?? "—" },
    {
      key: "mobile",
      header: "Mobile",
      priority: 3,
      render: (r) =>
        r.mobile ? (
          <span className="inline-flex items-center gap-1">
            XXXXXX{r.mobile.slice(-4)}
            {r.mobileVerifiedAt && (
              <>
                <Icon name="verified" size={16} aria-hidden className="text-[var(--sa-text-status-success-base)]" />
                <span className="sr-only">verified</span>
              </>
            )}
          </span>
        ) : (
          "—"
        ),
    },
    { key: "docs", header: "Certificates", priority: 3, render: (r) => String(r.qualificationDocs?.length ?? 0) },
    { key: "active", header: "Status", priority: 2, render: (r) => status(r.active), exportValue: (r) => (r.active ? "Active" : "Deactivated") },
  ];

  const activeBen = beneficiaries.filter((b) => b.active).length;
  const activeEmp = employees.filter((e) => e.active).length;

  const filters = (
    <div className="grid w-full gap-3 md:grid-cols-[minmax(0,1.4fr)_auto_minmax(0,1fr)] md:items-end">
      <FormField label="Project" id="roster-project">
        {(c) => (
          <Select {...c} value={projectId} onChange={(e) => setParam("project", e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {projectName(p)}
              </option>
            ))}
          </Select>
        )}
      </FormField>
      <SegmentedControl<Tab>
        ariaLabel="Show"
        value={tab}
        onChange={(v) => setParam("tab", v === "beneficiaries" ? "" : v)}
        options={[
          { value: "beneficiaries", label: "Beneficiaries" },
          { value: "staff", label: "Staff" },
        ]}
      />
      <Search
        value={q}
        onChange={(e) => setParam("q", e.target.value)}
        placeholder={tab === "staff" ? "Name or designation" : "Name or document no."}
        aria-label={tab === "staff" ? "Search staff" : "Search beneficiaries"}
      />
    </div>
  );

  const addButton = (
    <Button onClick={() => setAdding(tab)} disabled={!project}>
      <Icon name="person_add" size={16} aria-hidden /> {tab === "staff" ? "Add Employee" : "Add Beneficiary"}
    </Button>
  );

  const common = {
    title: "Beneficiaries & Staff",
    // The active / registered split, stated once. The tab labels used to repeat the active count
    // beside the template's "124 in the register", which read as two different totals.
    meta: project
      ? tab === "staff"
        ? `${projectName(project)} · ${activeEmp} Active of ${employees.length} Registered Staff`
        : `${projectName(project)} · ${activeBen} Active of ${beneficiaries.length} Registered Beneficiaries`
      : undefined,
    actions: addButton,
    filters,
    loading: !hydrated,
    asked: hydrated,
    activeFilterCount: needle ? 1 : 0,
    onClearFilters: () => setParam("q", ""),
    copy: screenCopy({
      retryLabel: "Try Again",
      clearFiltersLabel: "Clear Search",
      emptyTitle: tab === "staff" ? "No staff on this project." : "No beneficiaries on this project.",
      emptyDescription: tab === "staff" ? "Add an employee to start the register." : "Add a beneficiary to start the register.",
      filteredTitle: tab === "staff" ? "No staff match this search." : "No beneficiaries match this search.",
      filteredDescription: "Clear the search to see the whole register.",
    }),
  };

  return (
    <>
      {tab === "beneficiaries" ? (
        <WorklistScreen<Beneficiary>
          {...common}
          columns={benColumns}
          rows={benRows}
          registerTotal={beneficiaries.length}
          // The heading already says "110 Active of 124 Registered"; the list's own count line
          // would say the register total a second time.
          countLine={null}
          getRowId={(r) => r.id}
          noun="beneficiary"
          pluralNoun="beneficiaries"
          emptyAction={addButton}
          rowActions={(r) => (
            <span className="flex gap-1">
              <Button appearance="text" size="sm" onClick={() => setViewing({ kind: "beneficiary", data: r })} aria-label={`View ${r.name}`}>
                View
              </Button>
              <Button appearance="text" size="sm" onClick={() => setBeneficiaryActive(r.id, !r.active)} aria-label={`${r.active ? "Deactivate" : "Reactivate"} ${r.name}`}>
                {r.active ? "Deactivate" : "Reactivate"}
              </Button>
            </span>
          )}
        />
      ) : (
        <WorklistScreen<Employee>
          {...common}
          columns={empColumns}
          rows={empRows}
          registerTotal={employees.length}
          // The heading already says "110 Active of 124 Registered"; the list's own count line
          // would say the register total a second time.
          countLine={null}
          getRowId={(r) => r.id}
          noun="employee"
          pluralNoun="employees"
          emptyAction={addButton}
          rowActions={(r) => (
            <span className="flex gap-1">
              <Button appearance="text" size="sm" onClick={() => setViewing({ kind: "employee", data: r })} aria-label={`View ${r.name}`}>
                View
              </Button>
              <Button appearance="text" size="sm" onClick={() => setEmployeeActive(r.id, !r.active)} aria-label={`${r.active ? "Deactivate" : "Reactivate"} ${r.name}`}>
                {r.active ? "Deactivate" : "Reactivate"}
              </Button>
            </span>
          )}
        />
      )}

      <AddBeneficiaryDialog
        open={adding === "beneficiaries"}
        projectId={projectId}
        projectName={project ? projectName(project) : ""}
        onClose={() => setAdding(null)}
        onCreate={addBeneficiary}
      />
      <AddEmployeeDialog
        open={adding === "staff"}
        projectId={projectId}
        projectName={project ? projectName(project) : ""}
        onClose={() => setAdding(null)}
        onCreate={addEmployee}
      />
      <PersonDetailsDialog person={viewing} onClose={() => setViewing(null)} />
    </>
  );
}
