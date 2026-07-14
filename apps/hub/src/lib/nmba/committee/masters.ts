// NAPDDR committee master data: fixed designations, upload limits, and the
// role-aware demo logins for the EXISTING NMBA portal (Admin / State Nodal
// Officer / District Nodal Officer). No new roles are introduced — these map to
// the roles already defined in `src/lib/types.ts` and seeded in mock-data.

import type { PortalSession } from "./types";

/** Auto-populated designations, per the requirement. */
export const DESIGNATIONS = {
  districtChairperson: "District Collector / Deputy Commissioner",
  districtMemberSecretary: "District Social Welfare Officer",
  blockChairperson: "Block Development Officer",
} as const;

/** Max committee members offered by the numeric dropdown. */
export const MAX_COMMITTEE_MEMBERS = 50;

/** Committee-notification / minutes upload cap. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_UPLOAD_MIME = "application/pdf";

/** Shared demo password (mock-auth accepts any, but this is the documented one). */
export const DEMO_PASSWORD = "Demo@123";

/**
 * Demo accounts for the existing portal login, keyed by mobile. The session
 * (role + scope) is resolved from the account so the sidebar and NAPDDR forms
 * behave "as per the login". State/District identities mirror real rows in
 * mock-data (Maharashtra SNO, Pune DNO).
 */
export interface DemoPortalAccount {
  id: string; // login mobile
  password: string;
  session: PortalSession;
}

export const DEMO_PORTAL_ACCOUNTS: DemoPortalAccount[] = [
  {
    id: "9999999999",
    password: DEMO_PASSWORD,
    session: { role: "ADMIN", accountId: "9999999999", displayName: "Rajesh Pilli" },
  },
  {
    id: "9890123456",
    password: DEMO_PASSWORD,
    session: {
      role: "STATE",
      accountId: "9890123456",
      displayName: "Anjali Patil (Maharashtra SNO)",
      state: "Maharashtra",
    },
  },
  {
    id: "9890001234",
    password: DEMO_PASSWORD,
    session: {
      role: "DISTRICT",
      accountId: "9890001234",
      displayName: "Anjali Desai (Pune DNO)",
      state: "Maharashtra",
      district: "Pune",
    },
  },
];

/** Resolve a demo account by login mobile. Returns null for unknown numbers. */
export function accountFromMobile(mobile: string): DemoPortalAccount | null {
  const trimmed = mobile.trim();
  return DEMO_PORTAL_ACCOUNTS.find((a) => a.id === trimmed) ?? null;
}
