/**
 * The four schemes an NGO applies under, as the applicant screens read them.
 *
 * The names themselves live in the glossary (`lib/e-anudaan/glossary.ts`), which the officer side's
 * `schemeLabel()` reads too — one source, so the picker, the dashboard, My Applications and the
 * officer's Scheme column cannot name a scheme differently (audit N-07, X-10).
 *
 * This module stays as the applicant screens' import so their call sites did not have to move.
 */

export type { SchemeName as NgoScheme } from "@/lib/e-anudaan/glossary";
export { SCHEME_NAMES as NGO_SCHEMES, schemeName as ngoScheme } from "@/lib/e-anudaan/glossary";
