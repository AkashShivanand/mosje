import type { PortalId } from "@/lib/kpi/types";

/** The short code each portal card carries — the name the Department uses for the scheme. */
export const PORTAL_DASHBOARD_CODES: Record<PortalId, string> = {
  "smile-beggary": "SMILE",
  nmba: "NMBA",
  "e-utthaan": "DAPSC",
  shreshta: "SHRESHTA",
  "senior-citizens": "SCW",
};

/** The short name a breadcrumb carries. */
export const PORTAL_DASHBOARD_CRUMBS: Record<PortalId, string> = {
  "smile-beggary": "SMILE – Beggary",
  nmba: "Nasha Mukt Bharat Abhiyaan",
  "e-utthaan": "DAPSC",
  shreshta: "SHRESHTA",
  "senior-citizens": "Senior Citizens Welfare",
};

/** PM-AJAY's organisation page in the New and Classic designs, which carries its dashboards. */
export const PMAJAY_ORG_PATH = "/website/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay";
