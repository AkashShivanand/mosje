/**
 * What an application form knows before the applicant types anything.
 *
 * Two sources. DARPAN supplies the organisation's identity and contacts; a renewal carries its
 * sanctioned figures and its bank account forward with the project. Kept here, not in the
 * wizard component, so a test can prove the rule the full-wizard walk of 13 Sep 2026 found broken
 * twice in one day: **a required field the applicant cannot edit must arrive filled**, or the
 * form has a step nobody can pass.
 */

import { currentFinancialYear } from "./instalments.ts";
import type { NgoProfile } from "./types.ts";

/** Answers the portal fills from DARPAN and the account on record. */
export function darpanSeed(ngo: NgoProfile | undefined, now: Date = new Date()): Record<string, string> {
  return {
    fld_ngo_name: ngo?.name ?? "Sankalp Seva Sansthan",
    fld_darpan_id: ngo?.darpanId ?? "MH/2016/100000",
    fld_registration_number: ngo?.registrationNo ?? "51-54",
    fld_contact_mobile: ngo?.mobile ?? "9441747200",
    fld_contact_email: ngo?.email ?? "sankalpsevasansthan@gmail.com",
    fld_reg_office_state: ngo?.state ?? "Maharashtra",
    fld_reg_office_district: ngo?.district ?? "Pune",
    // The year now running, not a constant: a new application is always for it (T328–329).
    fld_financial_year: currentFinancialYear(now),
  };
}

/**
 * The declaration's date and time: the moment the applicant signs, which the portal knows.
 *
 * Both were free fields and accepted 2015 (form-path QA, 13 Sep 2026). They are now read-only,
 * set to now when the form opens, and set again at the moment of submission — so a draft opened
 * on Monday and submitted on Wednesday is declared on Wednesday.
 */
export function declarationStamp(now: Date = new Date()): { fld_auth_date: string; fld_auth_time: string } {
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    fld_auth_date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    fld_auth_time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
}

/**
 * Figures and accounts a renewal carries forward. Empty since 16 Sep 2026: every scheme's renewal
 * now carries the chosen project's own sanctioned figures and account (`instalments.ts`
 * `renewalAnswers`), not a constant. Kept as a named export for the tests that read it.
 */
export const CARRIED_FORWARD: Record<string, Record<string, string>> = {};
