/**
 * PM-AJAY — the portal map.
 *
 * Every screen the live MIS (pmajay-dev.mosje.in) publishes, per role, as captured
 * on 2026-09-12: 223 screens across twelve signed-in roles, plus the sign-in surface.
 * GENERATED from the design-audit capture inventory
 * (`tools/design-audit/projects/pm-ajay/out/capture-bundle.json`) — the record of what
 * the live portal actually serves, not a wish list.
 *
 * It is the rebuild's spine: the routes to build, the order they are built in, and the
 * measure of how far the rebuild has got. `status` is the only field a build changes.
 *
 *   planned  — not built yet
 *   built    — the screen renders from the design system with its states
 *   verified — checked against the live screen for content and behaviour
 */

/** What a screen IS, which decides the template and the states it owes the reader. */
export type PmScreenKind =
  | "dashboard"
  | "report"
  | "worklist"
  | "form"
  | "search"
  | "manage"
  | "page";

export type PmScreenStatus = "planned" | "built" | "verified";

export interface PmScreen {
  /** The live portal's own path. Ours mounts at /portals/pm-ajay + this. */
  route: string;
  /** Title Case, as the estate writes titles. */
  title: string;
  /** The rail group it sits under. */
  section: string;
  kind: PmScreenKind;
  status: PmScreenStatus;
}

export interface PmRole {
  id: string;
  label: string;
  screens: PmScreen[];
}

export const PM_AJAY_PORTAL_MAP: PmRole[] = [
  {
    id: "ministry",
    label: "Ministry",
    screens: [
      { route: "/admin/adarsh-gram-pmajay", title: "Adarsh Gram PM-AJAY", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/adarshgram/dashboard", title: "Dashboard", section: "Adarsh Gram", kind: "dashboard", status: "planned" },
      { route: "/admin/adarshgram/funds/release-fund", title: "Release Fund", section: "Adarsh Gram", kind: "form", status: "planned" },
      { route: "/admin/adarshgram/funds/upload-sanction-order", title: "Upload Sanction Order", section: "Adarsh Gram", kind: "form", status: "planned" },
      { route: "/admin/adarshgram/manage-mom", title: "Manage MoM", section: "Adarsh Gram", kind: "manage", status: "planned" },
      { route: "/admin/adarshgram/manage-uc", title: "Manage UC", section: "Adarsh Gram", kind: "manage", status: "planned" },
      { route: "/admin/adarshgram/monitoring/phase2-central-ministries", title: "Phase 2 Central Ministries", section: "Adarsh Gram", kind: "page", status: "planned" },
      { route: "/admin/adarshgram/monitoring/phase2-program", title: "Phase 2 Program", section: "Adarsh Gram", kind: "page", status: "planned" },
      { route: "/admin/adarshgram/monitoring/phase2-state-program", title: "Phase 2 State Program", section: "Adarsh Gram", kind: "page", status: "planned" },
      { route: "/admin/adarshgram/remove-village", title: "Remove Village", section: "Adarsh Gram", kind: "page", status: "planned" },
      { route: "/admin/adarshgram/reports", title: "Reports", section: "Adarsh Gram", kind: "report", status: "planned" },
      { route: "/admin/courses", title: "Courses", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/courses/create", title: "Create", section: "Masters", kind: "form", status: "planned" },
      { route: "/admin/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/admin/domains", title: "Domains", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/domains/create", title: "Create", section: "Masters", kind: "form", status: "planned" },
      { route: "/admin/executive-summary", title: "Executive Summary", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/admin/financial-management", title: "Financial Management", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/gia-reports/beneficiary-list", title: "Beneficiary List", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/beneficiary-status", title: "Beneficiary Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/cb-iec", title: "CB IEC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/misc", title: "Misc", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/perspective-plan", title: "Perspective Plan", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/project-progress", title: "Project Progress", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/project-status", title: "Project Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/search", title: "Search", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/state-summary", title: "State Summary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/uc", title: "UC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia-reports/uploaded-beneficiary", title: "Uploaded Beneficiary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/admin/gia/generate-sanction", title: "Generate Sanction", section: "Grant-in-Aid", kind: "form", status: "planned" },
      { route: "/admin/gia/pending-list", title: "Pending List", section: "Grant-in-Aid", kind: "worklist", status: "planned" },
      { route: "/admin/governance-compliance", title: "Governance Compliance", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/grant-in-aid", title: "Grant in Aid", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/hos-reports/hostel-report", title: "Hostel Report", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/admin/hos-reports/my-actions", title: "My Actions", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/admin/hos-reports/my-projects", title: "My Projects", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/admin/hos-reports/search", title: "Search", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/admin/hostel-scheme", title: "Hostel Scheme", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/hostel/completion-certificate", title: "Completion Certificate", section: "Hostel", kind: "page", status: "planned" },
      { route: "/admin/hostel/pending-list", title: "Pending List", section: "Hostel", kind: "worklist", status: "planned" },
      { route: "/admin/hostel/sanctioned-list", title: "Sanctioned List", section: "Hostel", kind: "worklist", status: "planned" },
      { route: "/admin/hostel/uc-list", title: "UC List", section: "Hostel", kind: "worklist", status: "planned" },
      { route: "/admin/institutes", title: "Institutes", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/institutes/create", title: "Create", section: "Masters", kind: "form", status: "planned" },
      { route: "/admin/role-management", title: "Role Management", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/sub-domains", title: "Sub Domains", section: "Overview", kind: "page", status: "planned" },
      { route: "/admin/sub-domains/create", title: "Create", section: "Masters", kind: "form", status: "planned" },
      { route: "/admin/user-management", title: "User Management", section: "Overview", kind: "page", status: "planned" },
    ],
  },
  {
    id: "gia-district-maker",
    label: "GIA — District Maker",
    screens: [
      { route: "/gia/beneficiary-list", title: "Beneficiary List", section: "Overview", kind: "worklist", status: "planned" },
      { route: "/gia/create-beneficiary", title: "Create Beneficiary", section: "Overview", kind: "page", status: "planned" },
      { route: "/gia/create-executing-agency", title: "Create Executing Agency", section: "Overview", kind: "page", status: "planned" },
      { route: "/gia/create-project", title: "Create Project", section: "Overview", kind: "page", status: "planned" },
      { route: "/gia/create-project-institute", title: "Create Project Institute", section: "Overview", kind: "page", status: "planned" },
      { route: "/gia/create-tutoring", title: "Create Tutoring", section: "Overview", kind: "page", status: "planned" },
      { route: "/gia/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/gia/gia-reports/beneficiary-list", title: "Beneficiary List", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/beneficiary-status", title: "Beneficiary Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/cb-iec", title: "CB IEC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/misc", title: "Misc", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/perspective-plan", title: "Perspective Plan", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/project-progress", title: "Project Progress", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/project-status", title: "Project Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/search", title: "Search", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/state-summary", title: "State Summary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/uc", title: "UC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/gia-reports/uploaded-beneficiary", title: "Uploaded Beneficiary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/gia/pending-executing-agency", title: "Pending Executing Agency", section: "Overview", kind: "page", status: "planned" },
      { route: "/gia/pending-project", title: "Pending Project", section: "Overview", kind: "page", status: "planned" },
      { route: "/gia/pending-project-institute", title: "Pending Project Institute", section: "Overview", kind: "page", status: "planned" },
    ],
  },
  {
    id: "gia-district-checker",
    label: "GIA — District Checker",
    screens: [
      { route: "/district-checker/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/district-checker/gia-reports/beneficiary-list", title: "Beneficiary List", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/beneficiary-status", title: "Beneficiary Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/cb-iec", title: "CB IEC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/misc", title: "Misc", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/perspective-plan", title: "Perspective Plan", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/project-progress", title: "Project Progress", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/project-status", title: "Project Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/search", title: "Search", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/state-summary", title: "State Summary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/uc", title: "UC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia-reports/uploaded-beneficiary", title: "Uploaded Beneficiary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/district-checker/gia/institutes", title: "Institutes", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/district-checker/gia/projects", title: "Projects", section: "Grant-in-Aid", kind: "page", status: "planned" },
    ],
  },
  {
    id: "gia-state-maker",
    label: "GIA — State Maker",
    screens: [
      { route: "/state/gia", title: "GIA", section: "Overview", kind: "page", status: "planned" },
      { route: "/state/gia/beneficiary-list", title: "Beneficiary List", section: "Grant-in-Aid", kind: "worklist", status: "planned" },
      { route: "/state/gia/create-beneficiary", title: "Create Beneficiary", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state/gia/create-executing-agency", title: "Create Executing Agency", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state/gia/create-project", title: "Create Project", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state/gia/create-tutoring", title: "Create Tutoring", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state/gia/dashboard", title: "Dashboard", section: "Grant-in-Aid", kind: "dashboard", status: "planned" },
      { route: "/state/gia/district-users", title: "District Users", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state/gia/gia-reports/beneficiary-list", title: "Beneficiary List", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/beneficiary-status", title: "Beneficiary Status", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/cb-iec", title: "CB IEC", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/misc", title: "Misc", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/perspective-plan", title: "Perspective Plan", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/project-progress", title: "Project Progress", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/project-status", title: "Project Status", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/search", title: "Search", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/state-summary", title: "State Summary", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/uc", title: "UC", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/gia-reports/uploaded-beneficiary", title: "Uploaded Beneficiary", section: "Grant-in-Aid", kind: "report", status: "planned" },
      { route: "/state/gia/pending-executing-agency", title: "Pending Executing Agency", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state/gia/pending-project", title: "Pending Project", section: "Grant-in-Aid", kind: "page", status: "planned" },
    ],
  },
  {
    id: "gia-state-checker",
    label: "GIA — State Checker",
    screens: [
      { route: "/state-checker/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/state-checker/gia-reports/beneficiary-list", title: "Beneficiary List", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/beneficiary-status", title: "Beneficiary Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/cb-iec", title: "CB IEC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/misc", title: "Misc", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/perspective-plan", title: "Perspective Plan", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/project-progress", title: "Project Progress", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/project-status", title: "Project Status", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/search", title: "Search", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/state-summary", title: "State Summary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/uc", title: "UC", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia-reports/uploaded-beneficiary", title: "Uploaded Beneficiary", section: "GIA Reports", kind: "report", status: "planned" },
      { route: "/state-checker/gia/pending-executing-agency", title: "Pending Executing Agency", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state-checker/gia/pending-institute", title: "Pending Institute", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state-checker/gia/pending-project", title: "Pending Project", section: "Grant-in-Aid", kind: "page", status: "planned" },
      { route: "/state-checker/uc", title: "UC", section: "Overview", kind: "page", status: "planned" },
      { route: "/state-checker/uc/create", title: "Create", section: "UC", kind: "form", status: "planned" },
    ],
  },
  {
    id: "hostel-district-maker",
    label: "Hostel — District Maker",
    screens: [
      { route: "/hos/add-sanctioned-hostel", title: "Add Sanctioned Hostel", section: "Overview", kind: "page", status: "planned" },
      { route: "/hos/create-proposal", title: "Create Proposal", section: "Overview", kind: "page", status: "planned" },
      { route: "/hos/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/hos/hos-reports/hostel-report", title: "Hostel Report", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos/hos-reports/my-actions", title: "My Actions", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos/hos-reports/my-projects", title: "My Projects", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos/hos-reports/search", title: "Search", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos/pending-proposal", title: "Pending Proposal", section: "Overview", kind: "page", status: "planned" },
      { route: "/hos/sanctioned-hostels", title: "Sanctioned Hostels", section: "Overview", kind: "page", status: "planned" },
      { route: "/hos/submit-progress", title: "Submit Progress", section: "Overview", kind: "page", status: "planned" },
    ],
  },
  {
    id: "hostel-district-checker",
    label: "Hostel — District Checker",
    screens: [
      { route: "/hos-checker/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/hos-checker/hos-reports/hostel-report", title: "Hostel Report", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos-checker/hos-reports/my-actions", title: "My Actions", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos-checker/hos-reports/my-projects", title: "My Projects", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos-checker/hos-reports/search", title: "Search", section: "Hostel Reports", kind: "report", status: "planned" },
      { route: "/hos-checker/pending-proposal", title: "Pending Proposal", section: "Overview", kind: "page", status: "planned" },
      { route: "/hos-checker/sanctioned-hostels", title: "Sanctioned Hostels", section: "Overview", kind: "page", status: "planned" },
    ],
  },
  {
    id: "hostel-state-maker",
    label: "Hostel — State Maker",
    screens: [
      { route: "/state/hos", title: "Hostel", section: "Overview", kind: "page", status: "planned" },
      { route: "/state/hos/add-sanctioned-hostel", title: "Add Sanctioned Hostel", section: "Hostel", kind: "page", status: "planned" },
      { route: "/state/hos/create-proposal", title: "Create Proposal", section: "Hostel", kind: "page", status: "planned" },
      { route: "/state/hos/dashboard", title: "Dashboard", section: "Hostel", kind: "dashboard", status: "planned" },
      { route: "/state/hos/hos-reports/hostel-report", title: "Hostel Report", section: "Hostel", kind: "report", status: "planned" },
      { route: "/state/hos/hos-reports/my-actions", title: "My Actions", section: "Hostel", kind: "report", status: "planned" },
      { route: "/state/hos/hos-reports/my-projects", title: "My Projects", section: "Hostel", kind: "report", status: "planned" },
      { route: "/state/hos/hos-reports/search", title: "Search", section: "Hostel", kind: "report", status: "planned" },
      { route: "/state/hos/pending-proposal", title: "Pending Proposal", section: "Hostel", kind: "page", status: "planned" },
      { route: "/state/hos/sanctioned-hostels", title: "Sanctioned Hostels", section: "Hostel", kind: "page", status: "planned" },
      { route: "/state/hos/submit-progress", title: "Submit Progress", section: "Hostel", kind: "page", status: "planned" },
      { route: "/state/hos/uc-create", title: "UC Create", section: "Hostel", kind: "page", status: "planned" },
      { route: "/state/hos/uc-list", title: "UC List", section: "Hostel", kind: "worklist", status: "planned" },
    ],
  },
  {
    id: "hostel-state-checker",
    label: "Hostel — State Checker",
    screens: [
      { route: "/state/hos-checker", title: "Hostel Checker", section: "Overview", kind: "page", status: "planned" },
      { route: "/state/hos-checker/dashboard", title: "Dashboard", section: "Hostel Checker", kind: "dashboard", status: "planned" },
      { route: "/state/hos-checker/hos-reports/hostel-report", title: "Hostel Report", section: "Hostel Checker", kind: "report", status: "planned" },
      { route: "/state/hos-checker/hos-reports/my-actions", title: "My Actions", section: "Hostel Checker", kind: "report", status: "planned" },
      { route: "/state/hos-checker/hos-reports/my-projects", title: "My Projects", section: "Hostel Checker", kind: "report", status: "planned" },
      { route: "/state/hos-checker/hos-reports/search", title: "Search", section: "Hostel Checker", kind: "report", status: "planned" },
      { route: "/state/hos-checker/pending-proposal", title: "Pending Proposal", section: "Hostel Checker", kind: "page", status: "planned" },
      { route: "/state/hos-checker/sanctioned-hostels", title: "Sanctioned Hostels", section: "Hostel Checker", kind: "page", status: "planned" },
      { route: "/state/hos-checker/uc-create", title: "UC Create", section: "Hostel Checker", kind: "page", status: "planned" },
      { route: "/state/hos-checker/uc-list", title: "UC List", section: "Hostel Checker", kind: "worklist", status: "planned" },
    ],
  },
  {
    id: "adarsh-gram-village",
    label: "Adarsh Gram — Village",
    screens: [
      { route: "/adarsh-gram-village/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/adarsh-gram-village/format-1", title: "Format 1", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/format-1/add", title: "Add", section: "Format 1", kind: "form", status: "planned" },
      { route: "/adarsh-gram-village/format-1/edit/28967", title: "28967", section: "Format 1", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/format-2", title: "Format 2", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/format-2/add", title: "Add", section: "Format 2", kind: "form", status: "planned" },
      { route: "/adarsh-gram-village/format-3a/add", title: "Add", section: "Format 3a", kind: "form", status: "planned" },
      { route: "/adarsh-gram-village/format-3a/household-edit", title: "Household Edit", section: "Format 3a", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/format-3a/survey-edit", title: "Survey Edit", section: "Format 3a", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/format-3b/add", title: "Add", section: "Format 3b", kind: "form", status: "planned" },
      { route: "/adarsh-gram-village/format-3b/list", title: "List", section: "Format 3b", kind: "worklist", status: "planned" },
      { route: "/adarsh-gram-village/format-4", title: "Format 4", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/format-4/form", title: "Form", section: "Format 4", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/format-6", title: "Format 6", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/generate-vdp/complete", title: "Complete", section: "Generate Vdp", kind: "page", status: "planned" },
      { route: "/adarsh-gram-village/manage-mom", title: "Manage MoM", section: "Overview", kind: "manage", status: "planned" },
      { route: "/adarsh-gram-village/reports", title: "Reports", section: "Overview", kind: "report", status: "planned" },
      { route: "/adarsh-gram-village/reports/deleted-households", title: "Deleted Households", section: "Reports", kind: "report", status: "planned" },
      { route: "/adarsh-gram-village/reports/households-details", title: "Households Details", section: "Reports", kind: "report", status: "planned" },
      { route: "/adarsh-gram-village/submit-progress/format-7", title: "Format 7", section: "Submit Progress", kind: "page", status: "planned" },
    ],
  },
  {
    id: "adarsh-gram-district",
    label: "Adarsh Gram — District",
    screens: [
      { route: "/adarsh-gram-district/agency/add", title: "Add", section: "Agency", kind: "form", status: "built" },
      { route: "/adarsh-gram-district/agency/list", title: "List", section: "Agency", kind: "worklist", status: "built" },
      { route: "/adarsh-gram-district/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "built" },
      { route: "/adarsh-gram-district/format-1", title: "Format 1", section: "Overview", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/format-1/add", title: "Add", section: "Format 1", kind: "form", status: "built" },
      { route: "/adarsh-gram-district/format-2", title: "Format 2", section: "Overview", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/format-2/create", title: "Create", section: "Format 2", kind: "form", status: "built" },
      { route: "/adarsh-gram-district/format-3a/add", title: "Add", section: "Format 3a", kind: "form", status: "built" },
      { route: "/adarsh-gram-district/format-3a/household", title: "Household", section: "Format 3a", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/format-3a/survey-edit", title: "Survey Edit", section: "Format 3a", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/format-3b", title: "Format 3b", section: "Overview", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/format-3b/add", title: "Add", section: "Format 3b", kind: "form", status: "built" },
      { route: "/adarsh-gram-district/format-3b/list", title: "List", section: "Format 3b", kind: "worklist", status: "built" },
      { route: "/adarsh-gram-district/format-4", title: "Format 4", section: "Overview", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/format-4/form", title: "Form", section: "Format 4", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/format-6", title: "Format 6", section: "Overview", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/manage-adarsh-gram/declare", title: "Declare", section: "Manage Adarsh Gram", kind: "manage", status: "built" },
      { route: "/adarsh-gram-district/manage-adarsh-gram/requests", title: "Requests", section: "Manage Adarsh Gram", kind: "manage", status: "built" },
      { route: "/adarsh-gram-district/manage-mom", title: "Manage MoM", section: "Overview", kind: "manage", status: "built" },
      { route: "/adarsh-gram-district/manage-vdp/generate-complete-vdp", title: "Generate Complete Vdp", section: "Manage Vdp", kind: "form", status: "built" },
      { route: "/adarsh-gram-district/manage-vdp/unlock-vdp-request", title: "Unlock Vdp Request", section: "Manage Vdp", kind: "manage", status: "built" },
      { route: "/adarsh-gram-district/remove-village", title: "Remove Village", section: "Overview", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/reports", title: "Reports", section: "Overview", kind: "report", status: "built" },
      { route: "/adarsh-gram-district/submit-progress/format-4", title: "Format 4", section: "Submit Progress", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/submit-progress/format-5", title: "Format 5", section: "Submit Progress", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/submit-progress/format-7", title: "Format 7", section: "Submit Progress", kind: "page", status: "built" },
      { route: "/adarsh-gram-district/user-management", title: "User Management", section: "Overview", kind: "page", status: "built" },
    ],
  },
  {
    id: "adarsh-gram-state",
    label: "Adarsh Gram — State",
    screens: [
      { route: "/adarsh-gram-state/dashboard", title: "Dashboard", section: "Overview", kind: "dashboard", status: "planned" },
      { route: "/adarsh-gram-state/faq", title: "FAQ", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-state/format-viii/financial-progress", title: "Financial Progress", section: "Format Viii", kind: "page", status: "planned" },
      { route: "/adarsh-gram-state/format-viii/general-information", title: "General Information", section: "Format Viii", kind: "page", status: "planned" },
      { route: "/adarsh-gram-state/funds", title: "Funds", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-state/manage-adarsh-gram/requests", title: "Requests", section: "Manage Adarsh Gram", kind: "manage", status: "planned" },
      { route: "/adarsh-gram-state/manage-uc", title: "Manage UC", section: "Overview", kind: "manage", status: "planned" },
      { route: "/adarsh-gram-state/manage-vdp/unlock-vdp", title: "Unlock Vdp", section: "Manage Vdp", kind: "manage", status: "planned" },
      { route: "/adarsh-gram-state/monitoring", title: "Monitoring", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-state/monitoring/central-ministries", title: "Central Ministries", section: "Monitoring", kind: "page", status: "planned" },
      { route: "/adarsh-gram-state/remove-village", title: "Remove Village", section: "Overview", kind: "page", status: "planned" },
      { route: "/adarsh-gram-state/reports", title: "Reports", section: "Overview", kind: "report", status: "planned" },
      { route: "/adarsh-gram-state/reports/format-viii-state-ut", title: "Format Viii State Ut", section: "Reports", kind: "report", status: "planned" },
      { route: "/adarsh-gram-state/reports/pmagy-funds-release-status", title: "PMAGY Funds Release Status", section: "Reports", kind: "report", status: "planned" },
      { route: "/adarsh-gram-state/upload-image-video", title: "Upload Image Video", section: "Overview", kind: "form", status: "planned" },
      { route: "/adarsh-gram-state/user-management", title: "User Management", section: "Overview", kind: "page", status: "planned" },
    ],
  },
];


/** Every screen, flattened — for counting, for the route table, for progress. */
export const PM_AJAY_SCREENS: (PmScreen & { role: string })[] = PM_AJAY_PORTAL_MAP.flatMap(
  (role) => role.screens.map((screen) => ({ ...screen, role: role.id })),
);

/** How far the rebuild has got, by status. Read by the build's own progress page. */
export function pmAjayProgress(): Record<PmScreenStatus, number> {
  const out: Record<PmScreenStatus, number> = { planned: 0, built: 0, verified: 0 };
  for (const s of PM_AJAY_SCREENS) out[s.status] += 1;
  return out;
}
