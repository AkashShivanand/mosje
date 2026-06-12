// DEMO ONLY — remove before production / replace with NIC SSO
// TODO(pre-prod): replace with NIC employee SSO; never commit real credentials
export const BASE = "/portals/eutthan-admin";

export const DEMO_CREDENTIALS = [
  { role: "admin" as const, label: "Admin", username: "9990000011", demoPin: "admin@2026" },
  { role: "ministry" as const, label: "Ministry", username: "shivendra123", demoPin: "shivendra123" },
] as const;

export function normalizePath(p: string): string {
  return p.startsWith(BASE) ? p.slice(BASE.length) || "/" : p;
}

export function portalLink(p: string): string {
  return `${BASE}${p}`;
}
