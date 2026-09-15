/**
 * What an application form knows before the applicant types anything.
 *
 * Two sources. DARPAN supplies the organisation's identity and contacts; a renewal carries its
 * sanctioned figures and its bank account forward with the project. Kept here, not in the
 * wizard component, so a test can prove the rule the full-wizard walk of 13 Sep 2026 found broken
 * twice in one day: **a required field the applicant cannot edit must arrive filled**, or the
 * form has a step nobody can pass.
 */

import type { NgoProfile } from "./types.ts";

/** Answers the portal fills from DARPAN and the account on record. */
export function darpanSeed(ngo: NgoProfile | undefined): Record<string, string> {
  return {
    fld_ngo_name: ngo?.name ?? "Sankalp Seva Sansthan",
    fld_darpan_id: ngo?.darpanId ?? "MH/2016/100000",
    fld_registration_number: ngo?.registrationNo ?? "51-54",
    fld_contact_mobile: ngo?.mobile ?? "9441747200",
    fld_contact_email: ngo?.email ?? "sankalpsevasansthan@gmail.com",
    fld_reg_office_state: ngo?.state ?? "Maharashtra",
    fld_reg_office_district: ngo?.district ?? "Pune",
    fld_financial_year: "2026-27",
    // A renewal's account is the one on record; the form shows it and cannot change it.
    fld_bank_account_choice: "State Bank of India · XXXX XXXX 4417 · SBIN0001234 · Pune Main",
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
 * Figures and accounts a renewal carries forward once its project is chosen. The prototype holds
 * no sanction order for the renewal projects these forms list, so the values are illustrative;
 * in the real system they are read from the project's sanction order and bank record.
 */
export const CARRIED_FORWARD: Record<string, Record<string, string>> = {
  NAPDDR: { fld_honorarium_cost: "1800000", fld_rent_admin_cost: "600000", fld_medical_diet_cost: "900000" },
  // AVYAY's account is locked on a renewal; before it was carried forward the locked field was
  // empty and required, and no AVYAY renewal could pass step 4.
  AVYAY: { fld_bank_account_id: "State Bank of India · ••••••••••4417 · SBIN0001234" },
  // SMILE's Project ID is derived from the project chosen (an auto field), so nothing to carry.
};
