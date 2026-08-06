// Visibility + permissions for the NAPDDR flow, scoped by the existing portal
// roles (requirement items 4–6, plus the agreed rule that State & District
// officers can both register committees within their jurisdiction).
//
//   Visibility
//     ADMIN    → everything
//     STATE    → own state (its state, district and block committees)
//     DISTRICT → own district (its district committee + its block committees)
//
//   Who can register (add)
//     ADMIN    → nobody adds (oversight: view + reports only)
//     STATE    → State committee (own state) · District & Block committees for
//                any district in their state
//     DISTRICT → District committee (own district) · Block committees in it

import type { CommitteeRecord, CommitteeTier, PortalSession } from "./types";

/** True if `record` is visible to `viewer` under the scope rules. */
export function isVisible(record: CommitteeRecord, viewer: PortalSession): boolean {
  switch (viewer.role) {
    case "ADMIN":
      return true;
    case "STATE":
      return record.state === viewer.state;
    case "DISTRICT":
      return record.state === viewer.state && record.district === viewer.district;
    case "BLOCK":
      return (
        record.state === viewer.state &&
        record.district === viewer.district &&
        record.block === viewer.block
      );
    case "ENTITY":
      // Non-geographic reporters have no committee jurisdiction at all.
      return false;
  }
}

/** Records visible to the viewer, optionally narrowed to one tier. */
export function visibleRecords(
  records: CommitteeRecord[],
  viewer: PortalSession,
  tier?: CommitteeTier,
): CommitteeRecord[] {
  return records.filter((r) => isVisible(r, viewer) && (tier ? r.tier === tier : true));
}

/** Which committee tiers appear in this role's sidebar. */
export function tiersForRole(role: PortalSession["role"]): CommitteeTier[] {
  if (role === "DISTRICT") return ["DISTRICT", "BLOCK"];
  // BLOCK and ENTITY logins exist for Mass Pledge only — NAPDDR stays a
  // State/District responsibility, so they get no committee tiers.
  if (role === "BLOCK" || role === "ENTITY") return [];
  // ADMIN and STATE both see all three tiers (Admin read-only, State scoped).
  return ["STATE", "DISTRICT", "BLOCK"];
}

/** Can this session register a new committee at `tier`? (Admin never adds.) */
export function canAddAtTier(session: PortalSession, tier: CommitteeTier): boolean {
  if (session.role === "STATE") return true; // state, district or block within their state
  if (session.role === "DISTRICT") return tier === "DISTRICT" || tier === "BLOCK";
  // ADMIN is oversight-only; BLOCK and ENTITY are outside the committee flow.
  return false;
}

/** Can this session edit a specific record (e.g. add minutes)? */
export function canManage(record: CommitteeRecord, session: PortalSession): boolean {
  if (session.role === "STATE") return record.state === session.state;
  if (session.role === "DISTRICT") {
    return record.state === session.state && record.district === session.district;
  }
  // ADMIN is oversight-only; BLOCK and ENTITY are outside the committee flow.
  return false;
}

/**
 * The single record a role "owns" at a tier that is one-per-scope:
 *   STATE role  → its State committee
 *   DISTRICT role → its District committee
 * Returns null for multi-record tiers or Admin.
 */
export function ownSingleRecord(
  records: CommitteeRecord[],
  session: PortalSession,
  tier: CommitteeTier,
): CommitteeRecord | null {
  if (session.role === "STATE" && tier === "STATE") {
    return records.find((r) => r.tier === "STATE" && r.state === session.state) ?? null;
  }
  if (session.role === "DISTRICT" && tier === "DISTRICT") {
    return (
      records.find(
        (r) => r.tier === "DISTRICT" && r.state === session.state && r.district === session.district,
      ) ?? null
    );
  }
  return null;
}
