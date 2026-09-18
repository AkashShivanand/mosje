/**
 * Which directory page a body's officers are listed on.
 *
 * ── ONE MAP, BECAUSE THE ANSWER IS ASKED IN TWO DIRECTIONS ───────────────────
 * A directory page asks "which officers belong to me" and an officer's page
 * asks "which directory do I go back to". Deriving those separately is how a
 * body ends up on one page and its Back link on another, which is the defect
 * `whos-who` already carried once: three of four "View All" links pointed at an
 * About page holding no officials at all.
 *
 * The key is the abbreviation the register itself prints in `organisation_cat`
 * — "NCSK", "NISD" — not a slug we chose.
 */
export interface DirectoryTarget {
  /** The organisation abbreviation as the register prints it. */
  organisation: string;
  href: string;
  /** How the page names itself, used for the Back link and the trail. */
  label: string;
}

export const DIRECTORIES: DirectoryTarget[] = [
  { organisation: "MoSJE", href: "/website/mosje-directory", label: "MoSJE Directory" },
  { organisation: "NCSC", href: "/website/chairpersons-office", label: "Chairperson's Office" },
  { organisation: "DAIC", href: "/website/daic-directory", label: "DAIC Directory" },
  { organisation: "DAF", href: "/website/daf-directory", label: "DAF Directory" },
  { organisation: "BJRNF", href: "/website/bjrnf-directory", label: "BJRNF Directory" },
  { organisation: "NBCFDC", href: "/website/nbcfdc-directory", label: "NBCFDC Directory" },
  { organisation: "NCBC", href: "/website/ncbc-directory", label: "NCBC Directory" },
  { organisation: "NCSK", href: "/website/ncsk-directory", label: "NCSK Directory" },
  { organisation: "NISD", href: "/website/nisd-directory", label: "NISD Directory" },
  { organisation: "NSFDC", href: "/website/nsfdc-directory", label: "NSFDC Directory" },
  { organisation: "NSKFDC", href: "/website/nskfdc-directory", label: "NSKFDC Directory" },
  { organisation: "DWBDNC", href: "/website/dwbdnc-directory", label: "DWBDNC Directory" },
  { organisation: "PMAJAY", href: "/website/pm-ajay-directory", label: "PM-AJAY Directory" },
  { organisation: "SCW", href: "/website/scw-directory", label: "SCW Directory" },
  { organisation: "NHAA", href: "/website/nhaa-directory", label: "NHAA Directory" },
];

const byOrganisation = new Map(DIRECTORIES.map((d) => [d.organisation, d]));

/**
 * Where an officer's page goes back to.
 *
 * Six bodies in the register publish officers but no directory page of their
 * own — "Smile Beggary", "Transgender", "E-UTTHAAN" and the two records with no
 * organisation at all. They fall back to Who's Who, which lists every body, so
 * the Back link always leads somewhere that holds the officer rather than
 * somewhere that merely mentions their organisation.
 */
export function directoryHrefFor(organisation: string | undefined): { href: string; label: string } {
  const match = organisation ? byOrganisation.get(organisation) : undefined;
  return match ?? { href: "/website/whos-who", label: "Who's Who" };
}

/**
 * Which listing page a document belongs to.
 *
 * A document's own page needs a way back, and "back to Documents" is not a
 * place — the estate has eighteen document listings and no page that is all of
 * them. A record carrying the "Advices" term goes back to Advices; one carrying
 * a term with no page of its own goes back to Miscellaneous, which is defined
 * as exactly that set (`getMiscellaneousDocuments`), so the Back link always
 * lands on a page the record is actually listed on.
 *
 * The keys are the register's own `documents-type` terms and MUST stay in step
 * with `TYPES_WITH_A_LISTING_PAGE` in the content module — that list decides
 * what Miscellaneous holds, and this one decides where a record goes back to.
 */
const DOCUMENT_LISTINGS: Record<string, { href: string; label: string }> = {
  "Advices": { href: "/website/advices", label: "Advices" },
  "Annual Reports": { href: "/website/annual-reports", label: "Annual Reports" },
  "Acts & Rules": { href: "/website/acts-rules", label: "Acts & Rules" },
  "Advertisement": { href: "/website/advertisement", label: "Advertisement" },
  "Central List of OBC's": { href: "/website/welfare-of-the-other-backward-classes", label: "Welfare of the Other Backward Classes" },
  "Circulars & Notifications": { href: "/website/circulars-notifications", label: "Circulars & Notifications" },
  "Forms & Templates": { href: "/website/forms-templates", label: "Forms & Templates" },
  "Meta Data": { href: "/website/meta-data", label: "Meta Data" },
  "MOU": { href: "/website/mou", label: "Memoranda of Understanding" },
  "Newsletter": { href: "/website/newsletter", label: "Newsletter" },
  "Notice": { href: "/website/notices", label: "Public Notices" },
  "Parliament Questions": { href: "/website/lok-sabha-question-answer", label: "Lok Sabha Question & Answer" },
  "POLICY": { href: "/website/policies", label: "Policies" },
  "Publications": { href: "/website/publications", label: "Publications" },
  "Resources": { href: "/website/resources", label: "Resources" },
  "RTI": { href: "/website/rti", label: "Right to Information (RTI)" },
  "Suo-Moto": { href: "/website/suo-moto-disclosure", label: "Suo Moto Disclosure" },
  "Supreme Court Judgement": { href: "/website/supreme-court-judgement", label: "Supreme Court Judgement" },
};

const MISCELLANEOUS = { href: "/website/miscellaneous", label: "Miscellaneous" };

export function documentListingFor(types: string[] | undefined): { href: string; label: string } {
  for (const t of types ?? []) {
    const match = DOCUMENT_LISTINGS[t];
    if (match) return match;
  }
  return MISCELLANEOUS;
}
