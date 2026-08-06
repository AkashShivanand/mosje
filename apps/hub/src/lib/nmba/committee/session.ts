// Portal session helpers. The NAPDDR flow rides on the EXISTING admin session
// cookie (`nmba_admin_session`) — the login now encodes the role + scope into it
// instead of an opaque token. Pure functions, no React, so this is safe to
// import from the server-side protected layout.

import type { CommitteeTier, PortalRole, PortalSession } from "./types";

/** The existing portal session cookie (unchanged name). */
export const PORTAL_SESSION_COOKIE = "nmba_admin_session";

const ROLES: PortalRole[] = ["ADMIN", "STATE", "DISTRICT", "BLOCK", "ENTITY"];

const ENTITY_KINDS = ["LINE_MINISTRY", "SPIRITUAL_ORG", "HEI", "GIA"] as const;

/** Fallback for the legacy opaque cookie value (`mock-session-token`). */
const LEGACY_ADMIN_SESSION: PortalSession = {
  role: "ADMIN",
  accountId: "9999999999",
  displayName: "Rajesh Pilli",
};

export function encodeSession(session: PortalSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function decodeSession(raw: string | undefined): PortalSession | null {
  if (!raw) return null;
  // Back-compat: a pre-existing admin cookie is an opaque token, not JSON.
  if (raw === "mock-session-token") return LEGACY_ADMIN_SESSION;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<PortalSession>;
    if (
      !parsed ||
      typeof parsed.accountId !== "string" ||
      typeof parsed.displayName !== "string" ||
      !parsed.role ||
      !ROLES.includes(parsed.role)
    ) {
      return null;
    }
    if (parsed.role === "STATE" && typeof parsed.state !== "string") return null;
    if (parsed.role === "DISTRICT" && (typeof parsed.state !== "string" || typeof parsed.district !== "string")) {
      return null;
    }
    if (
      parsed.role === "BLOCK" &&
      (typeof parsed.state !== "string" ||
        typeof parsed.district !== "string" ||
        typeof parsed.block !== "string")
    ) {
      return null;
    }
    if (
      parsed.role === "ENTITY" &&
      (typeof parsed.entityName !== "string" ||
        !parsed.entityKind ||
        !ENTITY_KINDS.includes(parsed.entityKind))
    ) {
      return null;
    }
    return parsed as PortalSession;
  } catch {
    // A non-JSON but present cookie → treat as a legacy admin session.
    return LEGACY_ADMIN_SESSION;
  }
}

/** Human-readable label for a committee tier (menu + report headers). */
export function tierLabel(tier: CommitteeTier): string {
  switch (tier) {
    case "STATE":
      return "State-Level Steering & Monitoring Committee";
    case "DISTRICT":
      return "District-Level Drug Demand Reduction Committee";
    case "BLOCK":
      return "Block-Level Drug Demand Reduction Committee";
  }
}

/** Short role label for the header/account chip. */
export function roleLabel(role: PortalRole): string {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "STATE":
      return "State Nodal Officer";
    case "DISTRICT":
      return "District Nodal Officer";
    case "BLOCK":
      return "Block Nodal Officer";
    case "ENTITY":
      return "Reporting Organisation";
  }
}

/** Scope line for the account chip, e.g. "Haveli, Pune, Maharashtra". */
export function scopeLabel(session: PortalSession): string {
  switch (session.role) {
    case "ADMIN":
      return "All States & UTs";
    case "STATE":
      return session.state ?? "";
    case "DISTRICT":
      return [session.district, session.state].filter(Boolean).join(", ");
    case "BLOCK":
      return [session.block, session.district, session.state].filter(Boolean).join(", ");
    case "ENTITY":
      return session.entityName ?? "";
  }
}
