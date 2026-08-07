// Role-aware sidebar navigation for the Treatment-Centre portal.
// Routes use clean kebab paths; the legacy URL each mirrors is noted in comments.
// Native hub mount — no basePath, so hrefs must be absolute under /portals/nmba.

import type { TCRole } from "@/lib/nmba/treatment-centre/types";

export type NavLeaf = { kind: "leaf"; label: string; href: string; icon: string };
export type NavGroup = { kind: "group"; label: string; icon: string; children: NavNode[] };
export type NavNode = NavLeaf | NavGroup;

const TC = "/portals/nmba/treatment-centre";

// ---- IRCA -------------------------------------------------------------------
// legacy: /registrationPatient/add · /listpatients · /followUppatientlist ·
//         /readmissionlist · /ircaexistingoutreach
const IRCA_ITEMS: NavNode[] = [
  { kind: "leaf", label: "Patient Registration & Details Submission", href: `${TC}/irca/register`, icon: "assignment_add" },
  { kind: "leaf", label: "Patient List & Details Submission", href: `${TC}/irca/patients`, icon: "checklist" },
  { kind: "leaf", label: "Follow-Up List", href: `${TC}/irca/follow-ups`, icon: "event" },
  { kind: "leaf", label: "Readmission List", href: `${TC}/irca/readmissions`, icon: "refresh" },
  { kind: "leaf", label: "Details of Awareness Generation Program", href: `${TC}/irca/awareness`, icon: "campaign" },
];

// ---- ODIC -------------------------------------------------------------------
// legacy: /outreachpatient · /odicregister · /OdicFollowUp ·
//         /existingOutreachPatient · /odiclistpatients · /outreachlistpatientlist
const ODIC_ITEMS: NavNode[] = [
  { kind: "leaf", label: "Outreach Beneficiary Registration", href: `${TC}/odic/outreach/register`, icon: "person_add" },
  { kind: "leaf", label: "Drop In Centre Beneficiary Registration", href: `${TC}/odic/register`, icon: "assignment_add" },
  { kind: "leaf", label: "Follow-up ODIC", href: `${TC}/odic/follow-ups`, icon: "event" },
  { kind: "leaf", label: "Details of Awareness Generation Program", href: `${TC}/odic/awareness`, icon: "campaign" },
  { kind: "leaf", label: "Patient List", href: `${TC}/odic/patients`, icon: "checklist" },
  { kind: "leaf", label: "Outreach Beneficiary List", href: `${TC}/odic/outreach`, icon: "checklist" },
];

// ---- CPLI -------------------------------------------------------------------
// legacy: /peer-educator
const CPLI_ITEMS: NavNode[] = [
  { kind: "leaf", label: "Peer Educator List", href: `${TC}/cpli/peer-educators`, icon: "group" },
];

// ---- Shared (every role) ----------------------------------------------------
// legacy: shared module under "Nasha Mukt Bharat Saptah 2026" / /activity /
//         /center/{id}/staff / /center/{id}/photos
function sharedItems(): NavNode[] {
  return [
    { kind: "leaf", label: "Nasha Mukt Bharat Saptah 2026", href: `${TC}/saptah`, icon: "calendar_month" },
    { kind: "leaf", label: "Activity List", href: `${TC}/activities`, icon: "monitoring" },
    { kind: "leaf", label: "Staff List", href: `${TC}/staff`, icon: "group" },
    { kind: "leaf", label: "Center Photos", href: `${TC}/photos`, icon: "collections" },
  ];
}

const DASHBOARD_LEAF: NavLeaf = {
  kind: "leaf",
  label: "Dashboard",
  href: `${TC}/dashboard`,
  icon: "dashboard",
};

export function navForRole(role: TCRole): NavNode[] {
  switch (role) {
    case "IRCA":
      return [
        DASHBOARD_LEAF,
        { kind: "group", label: "IRCA Registration", icon: "assignment_add", children: IRCA_ITEMS },
        ...sharedItems(),
      ];
    case "ODIC":
      return [
        DASHBOARD_LEAF,
        { kind: "group", label: "ODIC Registration", icon: "assignment_add", children: ODIC_ITEMS },
        ...sharedItems(),
      ];
    case "CPLI":
      return [
        DASHBOARD_LEAF,
        { kind: "group", label: "CPLI", icon: "group", children: CPLI_ITEMS },
        ...sharedItems(),
      ];
    case "DDAC":
      // District aggregator — nests IRCA + ODIC + CPLI as sub-groups.
      return [
        DASHBOARD_LEAF,
        {
          kind: "group",
          label: "DDAC Registration",
          icon: "assignment_add",
          children: [
            { kind: "group", label: "IRCA", icon: "assignment_add", children: IRCA_ITEMS },
            { kind: "group", label: "ODIC", icon: "assignment_add", children: ODIC_ITEMS },
            { kind: "group", label: "CPLI", icon: "group", children: CPLI_ITEMS },
          ],
        },
        ...sharedItems(),
      ];
    case "US":
      return [
        DASHBOARD_LEAF,
        {
          kind: "group",
          label: "Reports",
          icon: "checklist",
          children: [
            { kind: "leaf", label: "Activity Report Date Wise", href: `${TC}/us/reports/activities`, icon: "monitoring" },
            { kind: "leaf", label: "Treatment Centre Report Date Wise", href: `${TC}/us/reports/centres`, icon: "checklist" },
            { kind: "leaf", label: "State Report Date Wise", href: `${TC}/us/reports/states`, icon: "calendar_month" },
            { kind: "leaf", label: "Analytical Report", href: `${TC}/us/reports/analytics`, icon: "monitoring" },
          ],
        },
        {
          // 13 masters, mirroring the live Under-Secretary "Masters Management"
          // menu order (captured 2026-06-29 via login USDP1), plus the NMBA
          // activity-category master that powers the Activity List filter.
          kind: "group",
          label: "Masters Management",
          icon: "manage_accounts",
          children: [
            { kind: "leaf", label: "Content Management", href: `${TC}/us/masters/content`, icon: "description" },
            { kind: "leaf", label: "What's New", href: `${TC}/us/masters/whats-new`, icon: "notifications" },
            { kind: "leaf", label: "Category Master", href: `${TC}/us/masters/categories`, icon: "label" },
            { kind: "leaf", label: "Drugs Master", href: `${TC}/us/masters/drugs`, icon: "medication" },
            { kind: "leaf", label: "Education Master", href: `${TC}/us/masters/education`, icon: "school" },
            { kind: "leaf", label: "Employment Master", href: `${TC}/us/masters/employment`, icon: "work" },
            { kind: "leaf", label: "Income Master", href: `${TC}/us/masters/income`, icon: "account_balance_wallet" },
            { kind: "leaf", label: "Marital Status Master", href: `${TC}/us/masters/marital-status`, icon: "favorite" },
            { kind: "leaf", label: "Occupation Master", href: `${TC}/us/masters/occupation`, icon: "work" },
            { kind: "leaf", label: "Referral Master", href: `${TC}/us/masters/referral`, icon: "share" },
            { kind: "leaf", label: "Cause of Substance Use Master", href: `${TC}/us/masters/substance-cause`, icon: "stethoscope" },
            { kind: "leaf", label: "Gender Master", href: `${TC}/us/masters/gender`, icon: "group" },
            { kind: "leaf", label: "Place of Residence Master", href: `${TC}/us/masters/place-of-residence`, icon: "location_on" },
            { kind: "leaf", label: "Activity Category Master", href: `${TC}/us/masters/activity-categories`, icon: "monitoring" },
          ],
        },
        { kind: "leaf", label: "Activity List", href: `${TC}/activities`, icon: "monitoring" },
        { kind: "leaf", label: "Nasha Mukt Bharat Saptah 2026", href: `${TC}/saptah`, icon: "calendar_month" },
      ];
  }
}
