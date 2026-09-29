/**
 * What's New — the live home page's list, in its order (issue X-FR-02).
 *
 * SOURCE: https://dosje.gov.in/, the "What's New" section, read on 29 Sep 2026
 * (WHATS_NEW_AS_ON). Its View All goes to /updates/. Titles, labels and dates are as the
 * live list prints them, typos and repeats included: the list is the Department's, and
 * a design may correct a title on display (the DBIM design's `dbimFeedTitle`) but never
 * here. Every entry is already a record in the estate's registers, so each one opens its
 * own page in every design.
 *
 * Until 29 Sep 2026 each design composed What's New itself from the registers, which put
 * FAQs, an SOP and a bank EOI at the top where the live site leads with the Lok Adalat
 * material. Every design now reads this one list (.claude/rules/website-shared-content.md).
 */

export const WHATS_NEW_AS_ON = "2026-09-29";

/** The register a live entry lives in, named as the live address names it. */
export type WhatsNewSource = "documents" | "updates" | "schemes-and-services" | "vacancies";

export interface WhatsNewEntry {
  source: WhatsNewSource;
  /** The slug in the live address, and in the register. */
  slug: string;
  /** As the live list prints it. */
  title: string;
  /** The live list's label for the item: "Results", "Notice", "Announcement" … */
  label: string;
  /** The date the live list prints, as YYYY-MM-DD. */
  date: string;
}

export const WHATS_NEW: readonly WhatsNewEntry[] = [
  { source: "updates", slug: "3rd-national-lok-adalat-awareness-material-2026", title: "3rd National Lok Adalat – Awareness Material 2026", label: "National Lok Adalat", date: "2026-09-12" },
  { source: "documents", slug: "lnviting-expression-of-lnterest-cum-proposal-from-the-eligible-organizations-for-setting-up-of-district-de-addiction-centres-undor-the-scheme-of-national-action-plan-for-drug-demand-reduction-napddr", title: "lnviting Expression of lnterest-cum-proposal from the eligible organizations for setting up of District De-Addiction Centres undor the scheme of National Action Plan for Drug Demand Reduction (NAPDDR)", label: "Announcement", date: "2026-08-04" },
  { source: "documents", slug: "result-of-national-overseas-scholarship-nos-for-the-selection-year-2026-27", title: "Result of National Overseas Scholarship (NOS) for the Selection Year 2026-27", label: "Results", date: "2026-07-31" },
  { source: "updates", slug: "pre-bid-meeting-tender-id-gem-2026-b-7743923", title: "Pre Bid Meeting Tender id GEM/2026/B/7743923", label: "Updates", date: "2026-07-06" },
  { source: "schemes-and-services", slug: "dr-ambedkar-medical-aid-scheme", title: "Dr. Ambedkar Medical Aid Scheme (Revised in 2026)", label: "Schemes And Services", date: "2026-06-06" },
  { source: "vacancies", slug: "extension-of-application-submission-date-for-financial-adviser-fa-post-at-daic", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF", label: "Vacancies", date: "2026-05-19" },
  { source: "documents", slug: "annual-report-2025-26-english", title: "Annual Report 2025-26 (English)", label: "Annual Reports", date: "2026-04-22" },
  { source: "documents", slug: "annual-report-2025-26-hindi", title: "Annual Report 2025-26 (Hindi)", label: "Annual Reports", date: "2026-04-15" },
  { source: "documents", slug: "extension-of-application-submission-date-for-financial-adviser-fa-post-at-daic", title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAIC", label: "Notice", date: "2026-03-23" },
  { source: "documents", slug: "result-of-national-overseas-scholarship-nos-for-sc-etc-candidates-for-the-selection-year-2025-26-2nd-round-2", title: "Result of National Overseas Scholarship (NOS) for SC etc. candidates for the Selection Year 2025-26 (2nd Round)", label: "Results", date: "2026-03-01" },
  { source: "documents", slug: "result-of-nos-for-the-selection-year-2023-24-1st-list", title: "Result of NOS for the Selection Year 2023-24 (1st list)", label: "Results", date: "2026-03-01" },
  { source: "documents", slug: "result-of-nos-for-the-selection-year-2023-24-6th-list", title: "Result of NOS for the Selection Year 2023-24 (6th list)", label: "Results", date: "2026-03-01" },
  { source: "documents", slug: "result-of-national-overseas-scholarship-nos-for-sc-etc-candidates-for-the-selection-year-2025-26-2nd-round", title: "Result of National Overseas Scholarship (NOS) for SC etc. candidates for the Selection Year 2025-26 (2nd Round).", label: "Notice", date: "2026-03-01" },
  { source: "documents", slug: "acceptance-of-transgender-identity-certificate-card-for-change-name-and-gender-in-epfo-records", title: "Acceptance of Transgender Identity Certificate/Card for Change Name and Gender in EPFO Records.", label: "Circulars & Notifications", date: "2026-02-26" },
  { source: "documents", slug: "expression-of-interest-setting-up-or-garima-greh-english", title: "Expression Of interest: Setting up or Garima Greh (English)", label: "Announcement", date: "2026-02-26" },
  { source: "documents", slug: "expression-of-interest-setting-up-of-garima-greh-hindi", title: "Expression of Interest: Setting up of Garima Greh (Hindi)", label: "Announcement", date: "2026-02-26" },
  { source: "documents", slug: "notice-inviting-application-in-respect-of-garima-greh-project-under-smile-scheme-reg", title: "Notice inviting application in respect of Garima Greh project under SMILE Scheme-reg.", label: "Notice", date: "2026-02-26" },
  { source: "documents", slug: "70th-mahaparinirwan-diwas-of-dr-b-r-ambedkar-hindi", title: "70th Mahaparinirwan Diwas of Dr B.R.Ambedkar – Hindi", label: "Advertisement", date: "2026-02-26" },
  { source: "documents", slug: "70th-mahaparinirwan-diwas-of-dr-b-r-ambedkar-english", title: "70th Mahaparinirwan Diwas of Dr B.R.Ambedkar – English", label: "Circulars & Notifications", date: "2026-02-26" },
  { source: "documents", slug: "change-in-funding-pattern-in-elderline-national-helpline-for-senior-citizens", title: "Change in Funding Pattern in Elderline – National Helpline for Senior Citizens", label: "Notice", date: "2025-12-07" },
];
