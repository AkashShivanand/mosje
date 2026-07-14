// Role-aware sidebar navigation for the Treatment-Centre portal.
// Routes use clean kebab paths; the legacy URL each mirrors is noted in comments.
// Native hub mount — no basePath, so hrefs must be absolute under /portals/nmba.

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
  Pill,
  Tag,
  GraduationCap,
  Briefcase,
  Wallet,
  Heart,
  Stethoscope,
  MapPin,
  FileText,
  Bell,
  UserCog,
  Share2,
  type LucideIcon,
} from "lucide-react";
import type { TCRole } from "@/lib/nmba/treatment-centre/types";

export type NavLeaf = { kind: "leaf"; label: string; href: string; icon: LucideIcon };
export type NavGroup = { kind: "group"; label: string; icon: LucideIcon; children: NavNode[] };
export type NavNode = NavLeaf | NavGroup;

const TC = "/portals/nmba/treatment-centre";

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
          // 13 masters, mirroring the live Under-Secretary "Masters Management"
          // menu order (captured 2026-06-29 via login USDP1), plus the NMBA
          // activity-category master that powers the Activity List filter.
          kind: "group",
          label: "Masters Management",
          icon: UserCog,
          children: [
            { kind: "leaf", label: "Content Management", href: `${TC}/us/masters/content`, icon: FileText },
            { kind: "leaf", label: "What's New", href: `${TC}/us/masters/whats-new`, icon: Bell },
            { kind: "leaf", label: "Category Master", href: `${TC}/us/masters/categories`, icon: Tag },
            { kind: "leaf", label: "Drugs Master", href: `${TC}/us/masters/drugs`, icon: Pill },
            { kind: "leaf", label: "Education Master", href: `${TC}/us/masters/education`, icon: GraduationCap },
            { kind: "leaf", label: "Employment Master", href: `${TC}/us/masters/employment`, icon: Briefcase },
            { kind: "leaf", label: "Income Master", href: `${TC}/us/masters/income`, icon: Wallet },
            { kind: "leaf", label: "Marital Status Master", href: `${TC}/us/masters/marital-status`, icon: Heart },
            { kind: "leaf", label: "Occupation Master", href: `${TC}/us/masters/occupation`, icon: Briefcase },
            { kind: "leaf", label: "Referral Master", href: `${TC}/us/masters/referral`, icon: Share2 },
            { kind: "leaf", label: "Cause of Substance Use Master", href: `${TC}/us/masters/substance-cause`, icon: Stethoscope },
            { kind: "leaf", label: "Gender Master", href: `${TC}/us/masters/gender`, icon: Users },
            { kind: "leaf", label: "Place of Residence Master", href: `${TC}/us/masters/place-of-residence`, icon: MapPin },
            { kind: "leaf", label: "Activity Category Master", href: `${TC}/us/masters/activity-categories`, icon: Activity },
          ],
        },
        { kind: "leaf", label: "Activity List", href: `${TC}/activities`, icon: Activity },
        { kind: "leaf", label: "Nasha Mukt Bharat Saptah 2026", href: `${TC}/saptah`, icon: CalendarDays },
      ];
  }
}
