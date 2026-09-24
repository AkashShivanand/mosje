/**
 * The Adarsh Gram district officer's rail — the live portal's own, item for item.
 *
 * Read off `pm-ajay.dosje.gov.in` on 2026-09-24 as the AGDistrict role: eleven
 * entries, four of which open a group. The labels are the department's, tidied only
 * to Title Case and to the estate's format naming ("Format I", not "Format – I"),
 * with the divergences recorded in `docs/specs/pm-ajay-portal-rebuild.md`.
 */

import type { PortalNavGroup } from "@mosje/design-system";

export const DISTRICT_BASE = "/portals/pm-ajay/adarsh-gram-district";

const at = (path: string) => `${DISTRICT_BASE}${path}`;

export const DISTRICT_NAV: PortalNavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: at("/dashboard"), icon: "dashboard" },
      {
        label: "Village Formats I to IV",
        href: at("/format-1"),
        icon: "description",
        children: [
          { label: "Format I — Village Level Data", href: at("/format-1") },
          { label: "Format II — Infrastructure Action Plan", href: at("/format-2") },
          { label: "Format III(A) — Household Data", href: at("/format-3a/household") },
          { label: "Format III(B) — Beneficiary Data", href: at("/format-3b") },
          { label: "Format IV — Works Action Plan", href: at("/format-4") },
        ],
      },
      { label: "Agency", href: at("/agency/list"), icon: "apartment" },
      { label: "Village Score (Format VI)", href: at("/format-6"), icon: "scoreboard" },
      {
        label: "Manage VDP",
        href: at("/manage-vdp/generate-complete-vdp"),
        icon: "folder_managed",
        children: [
          { label: "Generate or Finalise Complete VDP", href: at("/manage-vdp/generate-complete-vdp") },
          { label: "Unlock VDP Request", href: at("/manage-vdp/unlock-vdp-request") },
        ],
      },
      { label: "Manage MoM", href: at("/manage-mom"), icon: "event_note" },
      {
        label: "Submit Progress",
        href: at("/submit-progress/format-4"),
        icon: "trending_up",
        children: [
          { label: "Format IV — Works", href: at("/submit-progress/format-4") },
          { label: "Format V — Beneficiary Initiatives", href: at("/submit-progress/format-5") },
          { label: "Format VII — District Report", href: at("/submit-progress/format-7") },
        ],
      },
      {
        label: "Manage Adarsh Gram",
        href: at("/manage-adarsh-gram/declare"),
        icon: "verified",
        children: [
          { label: "Declare Adarsh Gram", href: at("/manage-adarsh-gram/declare") },
          { label: "Declaration Requests", href: at("/manage-adarsh-gram/requests") },
        ],
      },
      { label: "Remove Village", href: at("/remove-village"), icon: "playlist_remove" },
      { label: "User Management", href: at("/user-management"), icon: "manage_accounts" },
      { label: "Reports", href: at("/reports"), icon: "assessment" },
    ],
  },
];
