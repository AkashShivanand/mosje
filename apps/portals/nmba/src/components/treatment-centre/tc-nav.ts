// Role-aware sidebar navigation for the Treatment-Centre portal.
// Routes use clean kebab paths; the legacy URL each mirrors is noted in comments.
// basePath "/portals/nmba" is applied by Next — hrefs here are app-relative.

import {
  LayoutDashboard,
  ClipboardPlus,
  ListChecks,
  CalendarClock,
  RefreshCw,
  Megaphone,
  Users,
  UserPlus,
  CalendarDays,
  Images,
  Activity,
  type LucideIcon,
} from "lucide-react";
import type { TCRole } from "@/lib/treatment-centre/types";

export type NavLeaf = { kind: "leaf"; label: string; href: string; icon: LucideIcon };
export type NavGroup = { kind: "group"; label: string; icon: LucideIcon; children: NavNode[] };
export type NavNode = NavLeaf | NavGroup;

const TC = "/treatment-centre";

// ---- IRCA -------------------------------------------------------------------
// legacy: /registrationPatient/add · /listpatients · /followUppatientlist ·
//         /readmissionlist · /ircaexistingoutreach
const IRCA_ITEMS: NavNode[] = [
  { kind: "leaf", label: "Patient Registration & Details Submission", href: `${TC}/irca/register`, icon: ClipboardPlus },
  { kind: "leaf", label: "Patient List & Details Submission", href: `${TC}/irca/patients`, icon: ListChecks },
  { kind: "leaf", label: "Follow-Up List", href: `${TC}/irca/follow-ups`, icon: CalendarClock },
  { kind: "leaf", label: "Readmission List", href: `${TC}/irca/readmissions`, icon: RefreshCw },
  { kind: "leaf", label: "Details of Awareness Generation Program", href: `${TC}/irca/awareness`, icon: Megaphone },
];

// ---- ODIC -------------------------------------------------------------------
// legacy: /outreachpatient · /odicregister · /OdicFollowUp ·
//         /existingOutreachPatient · /odiclistpatients · /outreachlistpatientlist
const ODIC_ITEMS: NavNode[] = [
  { kind: "leaf", label: "Outreach Beneficiary Registration", href: `${TC}/odic/outreach/register`, icon: UserPlus },
  { kind: "leaf", label: "Drop In Centre Beneficiary Registration", href: `${TC}/odic/register`, icon: ClipboardPlus },
  { kind: "leaf", label: "Follow-up ODIC", href: `${TC}/odic/follow-ups`, icon: CalendarClock },
  { kind: "leaf", label: "Details of Awareness Generation Program", href: `${TC}/odic/awareness`, icon: Megaphone },
  { kind: "leaf", label: "Patient List", href: `${TC}/odic/patients`, icon: ListChecks },
  { kind: "leaf", label: "Outreach Beneficiary List", href: `${TC}/odic/outreach`, icon: ListChecks },
];

// ---- CPLI -------------------------------------------------------------------
// legacy: /peer-educator
const CPLI_ITEMS: NavNode[] = [
  { kind: "leaf", label: "Peer Educator List", href: `${TC}/cpli/peer-educators`, icon: Users },
];

// ---- Shared (every role) ----------------------------------------------------
// legacy: shared module under "Nasha Mukt Bharat Saptah 2026" / /activity /
//         /center/{id}/staff / /center/{id}/photos
function sharedItems(): NavNode[] {
  return [
    { kind: "leaf", label: "Nasha Mukt Bharat Saptah 2026", href: `${TC}/saptah`, icon: CalendarDays },
    { kind: "leaf", label: "Activity List", href: `${TC}/activities`, icon: Activity },
    { kind: "leaf", label: "Staff List", href: `${TC}/staff`, icon: Users },
    { kind: "leaf", label: "Center Photos", href: `${TC}/photos`, icon: Images },
  ];
}

const DASHBOARD_LEAF: NavLeaf = {
  kind: "leaf",
  label: "Dashboard",
  href: `${TC}/dashboard`,
  icon: LayoutDashboard,
};

export function navForRole(role: TCRole): NavNode[] {
  switch (role) {
    case "IRCA":
      return [
        DASHBOARD_LEAF,
        { kind: "group", label: "IRCA Registration", icon: ClipboardPlus, children: IRCA_ITEMS },
        ...sharedItems(),
      ];
    case "ODIC":
      return [
        DASHBOARD_LEAF,
        { kind: "group", label: "ODIC Registration", icon: ClipboardPlus, children: ODIC_ITEMS },
        ...sharedItems(),
      ];
    case "CPLI":
      return [
        DASHBOARD_LEAF,
        { kind: "group", label: "CPLI", icon: Users, children: CPLI_ITEMS },
        ...sharedItems(),
      ];
    case "DDAC":
      // District aggregator — nests IRCA + ODIC + CPLI as sub-groups.
      return [
        DASHBOARD_LEAF,
        {
          kind: "group",
          label: "DDAC Registration",
          icon: ClipboardPlus,
          children: [
            { kind: "group", label: "IRCA", icon: ClipboardPlus, children: IRCA_ITEMS },
            { kind: "group", label: "ODIC", icon: ClipboardPlus, children: ODIC_ITEMS },
            { kind: "group", label: "CPLI", icon: Users, children: CPLI_ITEMS },
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
          icon: ListChecks,
          children: [
            { kind: "leaf", label: "Activity Report Date Wise", href: `${TC}/us/reports/activities`, icon: Activity },
            { kind: "leaf", label: "Treatment Centre Report Date Wise", href: `${TC}/us/reports/centres`, icon: ListChecks },
            { kind: "leaf", label: "State Report Date Wise", href: `${TC}/us/reports/states`, icon: CalendarDays },
            { kind: "leaf", label: "Analytical Report", href: `${TC}/us/reports/analytics`, icon: Activity },
          ],
        },
        {
          kind: "group",
          label: "Masters Management",
          icon: Users,
          children: [
            { kind: "leaf", label: "Drugs Master", href: `${TC}/us/masters/drugs`, icon: Activity },
            { kind: "leaf", label: "Categories Master", href: `${TC}/us/masters/categories`, icon: Users },
            { kind: "leaf", label: "Education Master", href: `${TC}/us/masters/education`, icon: ListChecks },
          ],
        },
        { kind: "leaf", label: "Nasha Mukt Bharat Saptah 2026", href: `${TC}/saptah`, icon: CalendarDays },
      ];
  }
}
