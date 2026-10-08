/**
 * What's New — the live home page's list, in its order (issue X-FR-02).
 *
 * SOURCE: https://dosje.gov.in/, the "What's New" section and its View All page,
 * /updates/, read on 8 Oct 2026 (WHATS_NEW_AS_ON). The live Announcements bar lists the
 * same items in the same order, so the DBIM design's bar reads this list too. Titles,
 * labels and dates are as the live list prints them, typos and repeats included: the list
 * is the Department's, and a design may correct a title on display (the DBIM design's
 * `dbimFeedTitle`) but never here. Every entry is a record in the estate's registers, so
 * each one opens its own page in every design — except an item the live list carries as
 * a LINK to another site or page (`href`), which opens there, as it does on the live site.
 *
 * Read 8 Oct 2026: four items added at the top (JEEVAN, SHATAYU, Vidyanjali, Free Yoga),
 * and three the live list no longer carries removed (the GEM/2026/B/7743923 pre-bid
 * meeting and both Financial Adviser date extensions). The NAPDDR title is as the live
 * list now prints it, its "lnviting", "lnterest" and "undor" corrected by the Department.
 *
 * Until 29 Sep 2026 each design composed What's New itself from the registers, which put
 * FAQs, an SOP and a bank EOI at the top where the live site leads with the Lok Adalat
 * material. Every design now reads this one list (.claude/rules/website-shared-content.md).
 */

export const WHATS_NEW_AS_ON = "2026-10-08";

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
  /**
   * Where the live item opens, when it is a link rather than a record in the estate's
   * registers: an outside site, or a live page the estate does not carry.
   */
  href?: string;
}

export const WHATS_NEW: readonly WhatsNewEntry[] = [
  { source: "updates", slug: "jeevan-app", title: "JEEVAN App – Access Senior Citizen-related Schemes through Your Mobile Phone", label: "Updates", date: "2026-10-05", href: "https://play.google.com/store/apps/details?id=com.mss.seniorcitizenapp&hl=en_IN" },
  { source: "updates", slug: "shatayu-dashboard", title: "SHATAYU – Senior Holistic Care Assistance and Training For Your Utility", label: "Updates", date: "2026-10-05", href: "https://shatayu.dosje.gov.in/" },
  { source: "updates", slug: "mentorship-opportunities-for-senior-citizens", title: "Vidyanjali – Mentorship Opportunities for Senior Citizens", label: "Updates", date: "2026-10-05", href: "https://www.dosje.gov.in/organisation/senior-citizens-welfarescw/become-a-school-volunteer-your-experience-their-future/" },
  { source: "updates", slug: "14-days-online-free-yoga-5-18-october", title: "14 days online Free Yoga. 5 – 18 October 2026", label: "Updates", date: "2026-10-01", href: "https://challenge.srisriyoga.in/oct26/user-msji" },
  { source: "updates", slug: "3rd-national-lok-adalat-awareness-material-2026", title: "3rd National Lok Adalat – Awareness Material 2026", label: "National Lok Adalat", date: "2026-09-12" },
  { source: "documents", slug: "lnviting-expression-of-lnterest-cum-proposal-from-the-eligible-organizations-for-setting-up-of-district-de-addiction-centres-undor-the-scheme-of-national-action-plan-for-drug-demand-reduction-napddr", title: "Inviting Expression of Interest-cum-proposal from the eligible organizations for setting up of District De-Addiction Centres under the scheme of National Action Plan for Drug Demand Reduction (NAPDDR)", label: "Announcement", date: "2026-08-04" },
  { source: "documents", slug: "result-of-national-overseas-scholarship-nos-for-the-selection-year-2026-27", title: "Result of National Overseas Scholarship (NOS) for the Selection Year 2026-27", label: "Results", date: "2026-07-31" },
  { source: "schemes-and-services", slug: "dr-ambedkar-medical-aid-scheme", title: "Dr. Ambedkar Medical Aid Scheme (Revised in 2026)", label: "Schemes And Services", date: "2026-06-06" },
  { source: "documents", slug: "annual-report-2025-26-english", title: "Annual Report 2025-26 (English)", label: "Annual Reports", date: "2026-04-22" },
  { source: "documents", slug: "annual-report-2025-26-hindi", title: "Annual Report 2025-26 (Hindi)", label: "Annual Reports", date: "2026-04-15" },
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
