import { getOrganisationByAbbr } from "@/data/website/organisations";

/**
 * The ingest labels records with the code the live site's back end uses —
 * "NCSK", "SCW", "Smile Beggary". A reader should see the organisation's name.
 * Resolved against the organisation register; a code the register does not
 * know is shown as the site published it, never guessed at.
 */
const ALIAS: Record<string, string> = {
  "Smile Beggary": "SMILE",
  PMAJAY: "PM-AJAY",
};

/** The Department itself is not in the organisation register. */
const DEPARTMENT = new Set(["MoSJE", "DoSJE", "MSJE"]);

export function organisationName(code?: string): string | undefined {
  if (!code) return undefined;
  if (DEPARTMENT.has(code)) return "Department of Social Justice & Empowerment";
  return getOrganisationByAbbr(ALIAS[code] ?? code)?.name ?? code;
}
