// Treatment-Centre role configuration + session/cookie helpers.
// Pure data + functions only (no React / no icons) so this module is safe to
// import from server components (the protected layout) and client components.

import type { TCRole, TCSession } from "./types";

export const TC_SESSION_COOKIE = "nmba_tc_session";

/** Center id per role, mirroring the live site. */
export const ROLE_CENTERS: Record<TCRole, { centerId: number; centerName: string }> = {
  IRCA: { centerId: 654, centerName: "IRCA De-Addiction Centre (Demo)" },
  ODIC: { centerId: 653, centerName: "ODIC Outreach & Drop-in Centre (Demo)" },
  CPLI: { centerId: 656, centerName: "CPLI Community Centre (Demo)" },
  DDAC: { centerId: 651, centerName: "District De-Addiction Centre (Demo)" },
  US: { centerId: 100, centerName: "MoSJE Under Secretary Office" },
};

export const TC_ROLES: TCRole[] = ["IRCA", "ODIC", "CPLI", "DDAC", "US"];

/** Resolve the role from a Project Id like "IRCA001". Returns null if unknown. */
export function roleFromProjectId(projectId: string): TCRole | null {
  const match = projectId.trim().toUpperCase().match(/^(IRCA|ODIC|CPLI|DDAC|US)/);
  return match ? (match[1] as TCRole) : null;
}

/** Build a session object from a (valid) Project Id. */
export function sessionFromProjectId(projectId: string): TCSession | null {
  const role = roleFromProjectId(projectId);
  if (!role) return null;
  const { centerId, centerName } = ROLE_CENTERS[role];
  return { projectId: projectId.trim().toUpperCase(), role, centerId, centerName };
}

/** Encode a session for storage in a cookie value. */
export function encodeSession(session: TCSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

/** Decode a cookie value back into a session (null if malformed). */
export function decodeSession(raw: string | undefined): TCSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<TCSession>;
    if (
      !parsed ||
      typeof parsed.projectId !== "string" ||
      !parsed.role ||
      !TC_ROLES.includes(parsed.role) ||
      typeof parsed.centerId !== "number" ||
      typeof parsed.centerName !== "string"
    ) {
      return null;
    }
    return parsed as TCSession;
  } catch {
    return null;
  }
}

/** Which metric a dashboard card reads from the in-session store. */
export type DashboardMetric =
  | "patients"
  | "ircaPatients"
  | "beneficiaries"
  | "odicBeneficiaries"
  | "peerVolunteers"
  | "readmissions"
  | "followUps";

export type DashboardCard = { label: string; metric: DashboardMetric; icon: string };

/** Dashboard stat-card sets per role, matching the audited live dashboards. */
export const DASHBOARD_CARDS: Record<TCRole, DashboardCard[]> = {
  IRCA: [
    { label: "Total Patients", metric: "patients", icon: "folder" },
    { label: "Total IRCA Patients", metric: "ircaPatients", icon: "clipboard" },
    { label: "Total Re-Admissions", metric: "readmissions", icon: "users" },
    { label: "Total Follow-ups", metric: "followUps", icon: "smartphone" },
  ],
  ODIC: [
    { label: "Total Beneficiaries", metric: "beneficiaries", icon: "folder" },
    { label: "Total ODIC Beneficiaries", metric: "odicBeneficiaries", icon: "clipboard" },
    { label: "Total Re-Admissions", metric: "readmissions", icon: "users" },
    { label: "Total Follow-ups", metric: "followUps", icon: "smartphone" },
  ],
  CPLI: [
    { label: "Total Peer Volunteers Trained", metric: "peerVolunteers", icon: "clipboard" },
  ],
  DDAC: [
    { label: "Total Beneficiaries", metric: "beneficiaries", icon: "folder" },
    { label: "Total IRCA Patients", metric: "ircaPatients", icon: "clipboard" },
    { label: "Total ODIC Beneficiaries", metric: "odicBeneficiaries", icon: "clipboard" },
    { label: "Total Peer Volunteers Trained", metric: "peerVolunteers", icon: "clipboard" },
    { label: "Total Re-Admissions", metric: "readmissions", icon: "users" },
    { label: "Total Follow-ups", metric: "followUps", icon: "smartphone" },
  ],
  US: [
    { label: "Total Registration", metric: "patients", icon: "folder" },
    { label: "Total In-Patient", metric: "ircaPatients", icon: "clipboard" },
    { label: "Total Re-Admissions", metric: "readmissions", icon: "users" },
    { label: "Total Follow-ups", metric: "followUps", icon: "smartphone" },
  ],
};
