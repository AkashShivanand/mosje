/**
 * The scheme finder — five questions, a fixed catalogue, and a route at the end.
 *
 * MOCK DATA. Every `id` below is a real slug in `src/content/website/schemes.json`
 * (ingested from dosje.gov.in) and every name, benefit and running body is taken
 * from that page's own text — nothing here is invented. What IS hand-authored is
 * the TAGGING: the `who` / `stage` / `need` / `jurisdiction` axes do not exist in
 * the source catalogue, so they were assigned by reading each page.
 *
 * TODO(catalogue): fold these axes back into the real catalogue
 * (`src/content/website/schemes.json`, read through `lib/website/content`) and
 * derive this table from it, so the estate keeps ONE list of schemes rather than
 * two that can drift. `finder.test.ts` pins every id against the real catalogue
 * in the meantime, so an invented scheme cannot survive a test run — but a
 * scheme added to the catalogue still has to be tagged here by hand.
 *
 * `jurisdiction` is the least certain axis and the one to re-derive first. The
 * State-run entries here are the ones whose scheme names carry a State's own
 * administrative vocabulary (Maharashtra's VJNT / SBC categories); everything
 * else is marked Central or Corporation, which the source pages do state.
 *
 * GOVERNANCE, inherited from `content.ts` and binding on every string below:
 * this module reports what the catalogue RECORDS — which schemes list a person
 * as their target group — and never what a person is entitled to. Whether an
 * application succeeds is the sanctioning authority's decision, not this
 * widget's, and a citizen acting on a wrong answer here has a real cost.
 */

import type { ChatbotQuickReply, ChatbotReply } from "@mosje/design-system";

/* ---------------------------------------------------------------------------
   Axes
   ------------------------------------------------------------------------- */

/**
 * Who a scheme names as its target group.
 *
 * MULTI-VALUED, and that is the whole point of the model: an SC girl in class 11
 * is not filed under one of these. A record must be findable under EVERY axis
 * that applies to it, so `who` is a list and a scholarship for the daughters of
 * safai karamcharis carries both `safai` and `women`.
 */
export type Audience =
  | "sc"
  | "obc"
  | "dnt"
  | "safai"
  | "women"
  | "senior"
  | "trans"
  | "destitute"
  | "drugs"
  | "atrocity"
  | "ngo";

/** Life stage. `any` means the record is not stage-bound and matches all four. */
export type Stage = "school" | "college" | "working" | "senior" | "any";

export type Need = "education" | "money" | "home" | "health" | "safety" | "skills";

/** The five States offered in Q5. */
export type StateCode = "MH" | "UP" | "BR" | "KA" | "TN";

/**
 * Who runs the scheme, which is also who decides.
 *
 * `Corporation` covers the three national finance corporations (NSFDC, NSKFDC,
 * NBCFDC). They lend through State Channelising Agencies everywhere, so a
 * Corporation scheme is never filtered out by a State answer — nor is a Central
 * one. Choosing a State only ADDS that State's own schemes.
 */
export type Jurisdiction = "Central" | "Corporation" | StateCode;

/** Where an application actually happens. */
export interface ApplyVia {
  /** The destination in words — an office or a portal, never a bare URL. */
  label: string;
  /** On-site path, or an absolute URL when the route genuinely leaves the site. */
  href: string;
  /** What to have to hand before starting. Read out in the leaving line. */
  bring: string;
}

export interface Scheme {
  /** Slug in the real catalogue. Also the on-site page: /website/schemes-services/<id> */
  id: string;
  name: string;
  who: readonly Audience[];
  stage: readonly Stage[];
  need: readonly Need[];
  /** What the scheme gives, in the source page's own terms. */
  benefit: string;
  runBy: string;
  jurisdiction: Jurisdiction;
  docs: readonly string[];
  applyVia: ApplyVia;
}

/* ---------------------------------------------------------------------------
   Document sets
   ------------------------------------------------------------------------- */

/*
 * Shared rather than per-scheme, because the exact list differs scheme by
 * scheme and this module is not the authority on it. Every answer that quotes
 * one of these says so and sends the reader to the scheme's own page.
 */
const DOCS_CASTE = ["proof of identity", "a caste certificate", "an income certificate"] as const;
const DOCS_CASTE_BANK = [
  "proof of identity",
  "a caste certificate",
  "an income certificate",
  "bank account details",
] as const;
const DOCS_STUDENT = [
  "proof of identity",
  "a caste certificate",
  "an income certificate",
  "your last mark sheet",
  "your institution's admission or bonafide letter",
] as const;
const DOCS_SENIOR = ["proof of identity", "proof of age"] as const;
const DOCS_ORG = [
  "your organisation's registration certificate",
  "audited accounts for the last three years",
  "the signed project proposal",
] as const;

/* ---------------------------------------------------------------------------
   Destinations
   ------------------------------------------------------------------------- */

/** The scheme's own page on this site — the default, and never a leaving line. */
const onSite = (id: string, bring: string): ApplyVia => ({
  label: "the scheme's page on this site",
  href: `/website/schemes-services/${id}`,
  bring,
});

/** True when following this route leaves dosje.gov.in. */
export function isOffsite(via: ApplyVia): boolean {
  return /^https?:\/\//.test(via.href);
}

/** The bare domain, for the leaving line. */
export function destinationDomain(via: ApplyVia): string {
  return via.href.replace(/^https?:\/\//, "").split("/")[0] ?? via.href;
}

/**
 * The Department that handles disability, which is NOT this one.
 *
 * Kept here as data rather than prose because the routing answer and the
 * free-text answer must say the same thing.
 */
export const DEPWD_ROUTE =
  "That is handled by the Department of Empowerment of Persons with Disabilities at depwd.gov.in — same ministry, different department. Nothing on this site covers it.";

/* ---------------------------------------------------------------------------
   The catalogue
   ------------------------------------------------------------------------- */

/**
 * A working slice of the Department's schemes — not all of them.
 *
 * Ordered by division rather than alphabetically so that a human editing the
 * tagging can see the neighbours a record ought to resemble.
 */
export const SCHEMES: readonly Scheme[] = [
  /* -- Scheduled Castes: education ---------------------------------------- */
  {
    id: "pre-matric-scholarships-scheme-for-scheduled-castes-others",
    name: "Pre-Matric Scholarship for Scheduled Castes & Others",
    who: ["sc"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "support for schooling before class 10, so fewer children drop out",
    runBy: "the Department, through State Governments and UT administrations",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "pre-matric-scholarships-scheme-for-scheduled-castes-others",
      "the child's school details and the family's income certificate",
    ),
  },
  {
    id: "post-matric-scholarship-for-sc-students",
    name: "Post-Matric Scholarship for SC Students",
    who: ["sc"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "financial assistance after class 10 to finish a course in India",
    runBy: "the Department, with awardees selected by the State or UT government",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "post-matric-scholarship-for-sc-students",
      "your admission letter and the family's income certificate",
    ),
  },
  {
    id: "central-sector-scholarship-of-top-class-education-for-sc-students",
    name: "Top Class Education for SC Students",
    who: ["sc"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "financial support to study beyond class 12 at a listed institution",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "central-sector-scholarship-of-top-class-education-for-sc-students",
      "your admission offer from a listed institution",
    ),
  },
  {
    id: "national-overseas-scholarship-nos-for-sc-etc-candidates",
    name: "National Overseas Scholarship",
    who: ["sc", "dnt"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "assistance to read for a master's degree or PhD abroad, on a fixed number of slots each year",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: {
      label: "the National Overseas Scholarship portal",
      href: "https://nosmsje.gov.in",
      bring: "your degree certificates and the offer letter from the foreign institution",
    },
  },
  {
    id: "national-fellowship-for-scheduled-caste-students",
    name: "National Fellowship for Scheduled Caste Students",
    who: ["sc"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "a fellowship for PhD study at a UGC-recognised university, on 2,000 new slots a year",
    runBy: "the Department, with the University Grants Commission",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "national-fellowship-for-scheduled-caste-students",
      "your PhD registration and your qualifying examination result",
    ),
  },
  {
    id: "upgadation-of-merit-of-sc-students",
    name: "Upgradation of Merit of SC Students",
    who: ["sc"],
    stage: ["school"],
    need: ["education"],
    benefit: "remedial and special coaching through classes 9 to 12",
    runBy: "the Department, through State Governments",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite("upgadation-of-merit-of-sc-students", "the student's school details"),
  },
  {
    id: "dr-ambedkar-national-merit-award-for-meritorious-students-of-secondary-examination-belonging-to-scheduled-castes-and-scheduled-tribes-2",
    name: "Dr. Ambedkar National Merit Award (Secondary Examination)",
    who: ["sc"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "an award for a high mark in a recognised board's class 10 examination",
    runBy: "Dr. Ambedkar Foundation",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "dr-ambedkar-national-merit-award-for-meritorious-students-of-secondary-examination-belonging-to-scheduled-castes-and-scheduled-tribes-2",
      "the class 10 mark sheet",
    ),
  },
  {
    id: "dr-ambedkar-national-merit-award-scheme-for-meritorious-students-of-senior-secondary-school-examination-belonging-to-scheduled-caste-2",
    name: "Dr. Ambedkar National Merit Award (Senior Secondary Examination)",
    who: ["sc"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "an award for a high mark in a recognised board's class 12 examination",
    runBy: "Dr. Ambedkar Foundation",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "dr-ambedkar-national-merit-award-scheme-for-meritorious-students-of-senior-secondary-school-examination-belonging-to-scheduled-caste-2",
      "the class 12 mark sheet",
    ),
  },
  {
    id: "scheme-for-residential-education-for-students-in-high-schools-in-targeted-areas-shreshta",
    name: "SHRESHTA",
    who: ["sc", "ngo"],
    stage: ["school"],
    need: ["education"],
    benefit: "residential schooling for Scheduled Caste students in high schools in targeted areas",
    runBy: "the Department, with voluntary-sector schools",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "scheme-for-residential-education-for-students-in-high-schools-in-targeted-areas-shreshta",
      "the student's school records and the family's income certificate",
    ),
  },
  {
    id: "free-coaching-for-scs-obcs-and-beneficiaries-of-pm-cares-children-scheme",
    name: "Free Coaching for SCs, OBCs and PM CARES Children",
    who: ["sc", "obc"],
    stage: ["college", "working"],
    need: ["education", "skills"],
    benefit: "coaching for competitive examinations and for admission to technical and professional institutions",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: onSite(
      "free-coaching-for-scs-obcs-and-beneficiaries-of-pm-cares-children-scheme",
      "your caste and income certificates",
    ),
  },
  {
    id: "dr-ambedkar-centre-of-excellence-free-coaching-scheme-2",
    name: "Dr. Ambedkar Centre of Excellence — Free Coaching",
    who: ["sc", "obc"],
    stage: ["college"],
    need: ["education", "skills"],
    benefit: "the Free Coaching Scheme delivered through centres run by Dr. Ambedkar Foundation",
    runBy: "Dr. Ambedkar Foundation",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: onSite(
      "dr-ambedkar-centre-of-excellence-free-coaching-scheme-2",
      "your caste and income certificates",
    ),
  },

  /* -- Other Backward Classes and EBC ------------------------------------- */
  {
    id: "pm-yasasvi",
    name: "PM-YASASVI",
    who: ["obc", "dnt"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "tuition and hostel fees at a listed top-class school for classes 9 to 12, with 30% of places reserved for girls",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite("pm-yasasvi", "the student's mark sheet and the family's income certificate"),
  },
  {
    id: "national-fellowship-for-obc-students-nf-obc",
    name: "National Fellowship for OBC Students",
    who: ["obc"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "a fellowship towards an MPhil or PhD at a university or research institution",
    runBy: "the Department, with the University Grants Commission",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "national-fellowship-for-obc-students-nf-obc",
      "your research registration and your qualifying result",
    ),
  },
  {
    id: "dr-ambedkar-scheme-of-interest-subsidy-on-educational-loan-for-overseas-studies-for-obcs-ebcs",
    name: "Interest Subsidy on Educational Loans for Overseas Study",
    who: ["obc"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "the interest on an education loan for study abroad, met for OBC and EBC borrowers",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "dr-ambedkar-scheme-of-interest-subsidy-on-educational-loan-for-overseas-studies-for-obcs-ebcs",
      "your sanctioned loan papers and the foreign admission letter",
    ),
  },
  {
    id: "scholarships-for-higher-education-for-young-achievers-scheme-shreyas-obc-others-2021-22-to-2025-26",
    name: "SHREYAS (OBC & Others)",
    who: ["obc", "dnt"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "the Department's umbrella of higher-education scholarships for OBC and other backward classes",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "scholarships-for-higher-education-for-young-achievers-scheme-shreyas-obc-others-2021-22-to-2025-26",
      "your admission letter and the family's income certificate",
    ),
  },
  {
    id: "top-class-education-in-colllege-for-obc-ebc-and-dnt-students",
    name: "Top Class Education in College for OBC, EBC and DNT Students",
    who: ["obc", "dnt"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "support to study at a listed college for OBC, EBC and DNT students",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "top-class-education-in-colllege-for-obc-ebc-and-dnt-students",
      "your admission offer from a listed college",
    ),
  },
  {
    id: "construction-of-hostels-for-obc-boys-and-girls",
    name: "Construction of Hostels for OBC Boys and Girls",
    who: ["obc", "women"],
    stage: ["school", "college"],
    need: ["education", "home"],
    benefit: "hostel places so students from rural areas can stay on for secondary and higher education",
    runBy: "the Department, through State Governments",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "construction-of-hostels-for-obc-boys-and-girls",
      "the student's admission details",
    ),
  },
  {
    id: "entrepreneurial-schemes-of-nbcfdc",
    name: "Entrepreneurial Schemes of NBCFDC",
    who: ["obc"],
    stage: ["working"],
    need: ["money", "skills"],
    benefit: "concessional finance for members of the backward classes to start or grow a business",
    runBy: "National Backward Classes Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NBCFDC",
      href: "https://nbcfdc.gov.in",
      bring: "your caste and income certificates and your bank account details",
    },
  },

  /* -- De-notified, nomadic and semi-nomadic communities ------------------- */
  {
    id: "seed-free-coaching",
    name: "SEED — Free Coaching",
    who: ["dnt"],
    stage: ["school", "college"],
    need: ["education", "skills"],
    benefit: "coaching for competitive examinations for DNT students under the SEED umbrella",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite("seed-free-coaching", "your community certificate and your last mark sheet"),
  },
  {
    id: "assistance-to-students-of-dnts-studying-in-self-financed-institutes",
    name: "Assistance to DNT Students in Self-Financed Institutes",
    who: ["dnt"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "a scholarship towards examination fees and college admission fees",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "assistance-to-students-of-dnts-studying-in-self-financed-institutes",
      "your community certificate and the institute's fee receipt",
    ),
  },
  {
    id: "talent-pool-scheme-for-dnts",
    name: "Talent Pool Scheme for DNTs",
    who: ["dnt"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "support for DNT students in classes 5 and 10 who have done well in their examinations",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite("talent-pool-scheme-for-dnts", "the student's semester result and the family's income certificate"),
  },
  {
    id: "seed-housing",
    name: "SEED — Housing",
    who: ["dnt"],
    stage: ["any"],
    need: ["home"],
    benefit: "housing support for DNT families, given through the PM-AWAS scheme",
    runBy: "the Department, delivered through PM-AWAS",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: {
      label: "the PM Awas Yojana portal",
      href: "https://pmaymis.gov.in",
      bring: "your community certificate and proof of where you live",
    },
  },
  {
    id: "seed-health-insurance",
    name: "SEED — Health Insurance",
    who: ["dnt"],
    stage: ["any"],
    need: ["health"],
    benefit: "annual health cover of Rs. 5 lakh at no cost, through registration under Ayushman Bharat",
    runBy: "the Department, delivered through Ayushman Bharat",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: {
      label: "the Ayushman Bharat PM-JAY site",
      href: "https://pmjay.gov.in",
      bring: "your community certificate and proof of identity",
    },
  },
  {
    id: "seed-livelihood",
    name: "SEED — Livelihood",
    who: ["dnt"],
    stage: ["working"],
    need: ["money", "skills"],
    benefit: "livelihood support for DNT families in villages and rural areas, through the NRLM and NULM missions",
    runBy: "the Department, delivered through the Ministry of Rural Development",
    jurisdiction: "Central",
    docs: DOCS_CASTE_BANK,
    applyVia: onSite("seed-livelihood", "your community certificate and your bank account details"),
  },
  {
    id: "basti-development-scheme",
    name: "Basti Development Scheme",
    who: ["dnt"],
    stage: ["any"],
    need: ["home"],
    benefit: "drinking water, electrification, latrines, drainage and approach roads for tandas and bastis of at least fifty people",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: onSite("basti-development-scheme", "the name of your basti or settlement"),
  },
  {
    id: "vimukt-jaati-basti-development-scheme",
    name: "Vimukt Jaati Basti Development Scheme",
    who: ["dnt"],
    stage: ["any"],
    need: ["home"],
    benefit: "infrastructure in de-notified, nomadic and semi-nomadic settlements, villages, wards and mohallas",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: onSite("vimukt-jaati-basti-development-scheme", "the name of your settlement"),
  },

  /* -- Maharashtra's own, for the DNT and OBC categories it defines -------- */
  {
    id: "savitribai-phule-scholarship-for-vjnt-and-sbc-girl-students",
    name: "Savitribai Phule Scholarship for VJNT and SBC Girl Students",
    who: ["dnt", "obc", "women"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "a monthly scholarship for girls in classes 5 to 10, with no income limit",
    runBy: "the Government of Maharashtra",
    jurisdiction: "MH",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "savitribai-phule-scholarship-for-vjnt-and-sbc-girl-students",
      "the student's school details and community certificate",
    ),
  },
  {
    id: "rajarshi-chhatrapati-shahu-maharaj-merit-scholarship",
    name: "Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship",
    who: ["dnt", "obc"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "a merit scholarship for VJNT, nomadic tribe and special backward class students in classes 11 and 12",
    runBy: "the Government of Maharashtra",
    jurisdiction: "MH",
    docs: DOCS_STUDENT,
    applyVia: onSite(
      "rajarshi-chhatrapati-shahu-maharaj-merit-scholarship",
      "the class 10 mark sheet and the community certificate",
    ),
  },
  {
    id: "training-of-motor-driving-to-vjnt-sbc-obcs",
    name: "Training of Motor Driving for VJNT, SBC and OBC Candidates",
    who: ["dnt", "obc"],
    stage: ["working"],
    need: ["skills"],
    benefit: "light and heavy motor driving and conductor training",
    runBy: "the Government of Maharashtra",
    jurisdiction: "MH",
    docs: DOCS_CASTE,
    applyVia: onSite(
      "training-of-motor-driving-to-vjnt-sbc-obcs",
      "your community certificate and a learner's licence where the Motor Vehicles Act requires one",
    ),
  },
  {
    id: "vocational-training-for-vjnt-and-sbc-candidates-studying-in-government-industrial-training-institute",
    name: "Vocational Training for VJNT and SBC Candidates in Government ITIs",
    who: ["dnt", "obc"],
    stage: ["college", "working"],
    need: ["skills", "education"],
    benefit: "vocational training at a Government Industrial Training Institute, with students selected by the Principal",
    runBy: "the Government of Maharashtra",
    jurisdiction: "MH",
    docs: DOCS_CASTE,
    applyVia: onSite(
      "vocational-training-for-vjnt-and-sbc-candidates-studying-in-government-industrial-training-institute",
      "your community certificate and your ITI admission details",
    ),
  },

  /* -- Safai karamcharis and sanitation work ------------------------------- */
  {
    id: "10663",
    name: "Pre-Matric Scholarship for Children of Workers in Hazardous Cleaning Occupations",
    who: ["safai", "women"],
    stage: ["school"],
    need: ["education", "money"],
    benefit: "a pre-matric scholarship for the children of those in occupations involving cleaning and prone to health hazards",
    runBy: "the Department, through State Governments",
    jurisdiction: "Central",
    docs: DOCS_STUDENT,
    applyVia: onSite("10663", "the parent's occupation certificate and the child's school details"),
  },
  {
    id: "national-action-for-mechanised-sanitation-ecosystem-namaste",
    name: "NAMASTE",
    who: ["safai"],
    stage: ["working"],
    need: ["safety", "skills", "money"],
    benefit: "an end to hazardous cleaning, with training, certification and safety equipment for sanitation workers",
    runBy: "the Department, with the Ministry of Housing and Urban Affairs",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: {
      label: "the NAMASTE portal",
      href: "https://bmsnamaste.dosje.gov.in",
      bring: "proof of identity and your employer or urban local body details",
    },
  },
  {
    id: "self-employment-scheme-for-rehabilitation-of-manual-scavengers-srms-applicable-from-november-2013-3",
    name: "Self Employment Scheme for Rehabilitation of Manual Scavengers",
    who: ["safai"],
    stage: ["working"],
    need: ["money", "skills"],
    benefit: "self-employment support for the rehabilitation of manual scavengers",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_CASTE_BANK,
    applyVia: onSite(
      "self-employment-scheme-for-rehabilitation-of-manual-scavengers-srms-applicable-from-november-2013-3",
      "proof of identity and your bank account details",
    ),
  },
  {
    id: "swachhta-udyami-yojana-suy",
    name: "Swachhta Udyami Yojana",
    who: ["safai"],
    stage: ["working"],
    need: ["money"],
    benefit: "finance to buy and run sanitation vehicles, and to operate pay-and-use toilets",
    runBy: "National Safai Karamcharis Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSKFDC",
      href: "https://nskfdc.nic.in",
      bring: "proof of identity, your bank account details and your project cost estimate",
    },
  },
  {
    id: "sanitary-marts-scheme",
    name: "Sanitary Marts Scheme",
    who: ["safai"],
    stage: ["working"],
    need: ["money"],
    benefit: "finance to open a sanitary mart — a shop and service centre for sanitation and hygiene goods",
    runBy: "National Safai Karamcharis Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSKFDC",
      href: "https://nskfdc.nic.in",
      bring: "proof of identity, your bank account details and your project cost estimate",
    },
  },
  {
    id: "green-business-scheme",
    name: "Green Business Scheme",
    who: ["safai"],
    stage: ["working"],
    need: ["money"],
    benefit: "finance for business activities that both earn an income and cut pollution",
    runBy: "National Safai Karamcharis Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSKFDC",
      href: "https://nskfdc.nic.in",
      bring: "proof of identity, your bank account details and your project cost estimate",
    },
  },
  {
    id: "micro-credit-finance-mcf",
    name: "Micro Credit Finance",
    who: ["safai"],
    stage: ["working"],
    need: ["money"],
    benefit: "a small loan for petty trade and other income-generating work, lent through State Channelising Agencies and banks",
    runBy: "National Safai Karamcharis Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSKFDC",
      href: "https://nskfdc.nic.in",
      bring: "proof of identity and your bank account details",
    },
  },
  {
    id: "mahila-adhikarita-yojana-may",
    name: "Mahila Adhikarita Yojana",
    who: ["safai", "women"],
    stage: ["working"],
    need: ["money", "skills"],
    benefit: "a loan for small trade or business, for safai karamchari and scavenger women and their dependent daughters",
    runBy: "National Safai Karamcharis Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSKFDC",
      href: "https://nskfdc.nic.in",
      bring: "proof of identity and your bank account details",
    },
  },
  {
    id: "mahila-samridhi-yojna-msy",
    name: "Mahila Samridhi Yojana",
    who: ["safai", "women"],
    stage: ["working"],
    need: ["money"],
    benefit: "a loan for small trade and sundry income-generating work, lent through State Channelising Agencies and banks",
    runBy: "National Safai Karamcharis Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSKFDC",
      href: "https://nskfdc.nic.in",
      bring: "proof of identity and your bank account details",
    },
  },
  {
    id: "education-loan-el",
    name: "Education Loan for Safai Karamcharis and their Dependants",
    who: ["safai"],
    stage: ["college"],
    need: ["education", "money"],
    benefit: "a loan for graduate and higher professional or technical study — medicine, engineering, management, law, computing, and general degrees",
    runBy: "National Safai Karamcharis Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_STUDENT,
    applyVia: {
      label: "NSKFDC",
      href: "https://nskfdc.nic.in",
      bring: "your admission letter and your bank account details",
    },
  },

  /* -- Senior citizens ----------------------------------------------------- */
  {
    id: "atal-vayo-abhyuday-yojana-avyay",
    name: "Atal Vayo Abhyuday Yojana (AVYAY)",
    who: ["senior", "ngo"],
    stage: ["senior"],
    need: ["health", "home", "safety"],
    benefit: "the Department's umbrella of senior-citizen welfare programmes",
    runBy: "the Department, with States, local bodies and voluntary organisations",
    jurisdiction: "Central",
    docs: DOCS_SENIOR,
    applyVia: onSite("atal-vayo-abhyuday-yojana-avyay", "proof of age and proof of identity"),
  },
  {
    id: "rashtriya-vayoshri-yojana-rvy",
    name: "Rashtriya Vayoshri Yojana",
    who: ["senior"],
    stage: ["senior"],
    need: ["health"],
    benefit: "assisted-living devices for age-related loss of vision, hearing, teeth or movement",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_SENIOR,
    applyVia: onSite("rashtriya-vayoshri-yojana-rvy", "proof of age and a medical assessment"),
  },
  {
    id: "elderline",
    name: "Elderline",
    who: ["senior"],
    stage: ["senior"],
    need: ["safety", "health"],
    benefit: "a toll-free helpline on 14567, run in every State and UT, open every day from 8 AM to 8 PM",
    runBy: "the Department, with the States and UTs",
    jurisdiction: "Central",
    docs: [],
    applyVia: onSite("elderline", "nothing — dial 14567"),
  },
  {
    id: "integrated-programme-for-senior-citizens-ipsrc",
    name: "Integrated Programme for Senior Citizens",
    who: ["senior", "destitute", "ngo"],
    stage: ["senior"],
    need: ["home", "health"],
    benefit: "shelter, food, medical care and company, run through State governments, local bodies and voluntary organisations",
    runBy: "the Department, through implementing agencies",
    jurisdiction: "Central",
    docs: DOCS_SENIOR,
    applyVia: onSite("integrated-programme-for-senior-citizens-ipsrc", "proof of age"),
  },
  {
    id: "seniorcare-ageing-growth-engine-sage",
    name: "SAGE",
    who: ["senior", "ngo"],
    stage: ["senior", "working"],
    need: ["money"],
    benefit: "equity support for start-ups with new ideas in elderly care — health, housing and care centres",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_ORG,
    applyVia: onSite("seniorcare-ageing-growth-engine-sage", "your start-up's incorporation papers and the proposal"),
  },
  {
    id: "geriatric-caregivers-training",
    name: "Geriatric Caregivers Training",
    who: ["senior"],
    stage: ["working"],
    need: ["skills"],
    benefit: "training to work as a caregiver for older people",
    runBy: "the Department, with State Governments and voluntary organisations",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: onSite("geriatric-caregivers-training", "proof of identity and your education certificates"),
  },

  /* -- Economic empowerment ------------------------------------------------ */
  {
    id: "national-scheduled-castes-finance-and-development-corporation-nsfdc",
    name: "NSFDC",
    who: ["sc"],
    stage: ["working"],
    need: ["money", "skills"],
    benefit: "concessional finance and skills training for income-generating work",
    runBy: "National Scheduled Castes Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSFDC",
      href: "https://nsfdc.nic.in",
      bring: "your caste certificate, income certificate and bank account details",
    },
  },
  {
    id: "aajeevika-microfinance-yojana",
    name: "Aajeevika Microfinance Yojana",
    who: ["sc"],
    stage: ["working"],
    need: ["money"],
    benefit: "micro-finance at a low rate of interest for small business, lent through NBFC-MFIs",
    runBy: "National Scheduled Castes Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_CASTE_BANK,
    applyVia: {
      label: "NSFDC",
      href: "https://nsfdc.nic.in",
      bring: "your caste certificate and bank account details",
    },
  },
  {
    id: "credit-enhancement-guarantee-scheme-for-the-scheduled-castes-scs",
    name: "Credit Enhancement Guarantee Scheme for Scheduled Castes",
    who: ["sc"],
    stage: ["working"],
    need: ["money"],
    benefit: "a guarantee that lets a bank lend to a Scheduled Caste entrepreneur who would otherwise be turned down",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_CASTE_BANK,
    applyVia: onSite(
      "credit-enhancement-guarantee-scheme-for-the-scheduled-castes-scs",
      "your business papers and your bank's assessment",
    ),
  },
  {
    id: "scheme-of-assistance-to-scheduled-castes-development-corporations-scdcs",
    name: "Assistance to Scheduled Castes Development Corporations",
    who: ["sc"],
    stage: ["working"],
    need: ["money"],
    benefit: "share capital for the 27 State-level Corporations that finance Scheduled Caste enterprise",
    runBy: "the Department, with the State Governments",
    jurisdiction: "Central",
    docs: DOCS_CASTE_BANK,
    applyVia: onSite(
      "scheme-of-assistance-to-scheduled-castes-development-corporations-scdcs",
      "your State Corporation's application form",
    ),
  },
  {
    id: "pradhan-mantri-anusuchit-jaati-abhyuday-yojna-pm-ajay",
    name: "PM-AJAY",
    who: ["sc"],
    stage: ["any"],
    need: ["money", "home", "skills"],
    benefit: "work, skills and village infrastructure in Scheduled Caste dominated villages",
    runBy: "the Department, through State Governments",
    jurisdiction: "Central",
    docs: DOCS_CASTE,
    applyVia: {
      label: "the PM-AJAY portal",
      href: "https://pmajay.dosje.gov.in",
      bring: "your caste certificate and your village or ward details",
    },
  },
  {
    id: "pm-daksh",
    name: "PM-DAKSH",
    who: ["sc", "obc", "dnt", "safai"],
    stage: ["working"],
    need: ["skills"],
    benefit: "free skills training, open all year, with the course length depending on the trade",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: ["a self-declaration of caste", "proof of date of birth", "a mobile number for OTP verification"],
    applyVia: {
      label: "the PM-DAKSH portal",
      href: "https://pmdaksh.dosje.gov.in",
      bring: "a working mobile number, because the profile is verified by OTP",
    },
  },

  /* -- Social defence ------------------------------------------------------ */
  {
    id: "support-for-marginalized-individuals-for-livelihood-and-enterprise-smile",
    name: "SMILE",
    who: ["trans", "destitute"],
    stage: ["any"],
    need: ["money", "skills", "home", "health"],
    benefit: "rehabilitation for transgender persons and for people engaged in the act of begging, under one umbrella",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: ["proof of identity", "a transgender identity certificate where the transgender component applies"],
    applyVia: {
      label: "the National Portal for Transgender Persons",
      href: "https://transgender.dosje.gov.in",
      bring: "proof of identity and an address you can be reached at",
    },
  },
  {
    id: "national-action-plan-for-drug-demand-reduction",
    name: "National Action Plan for Drug Demand Reduction",
    who: ["drugs", "ngo"],
    stage: ["any"],
    need: ["health"],
    benefit: "treatment and prevention for alcohol and drug dependence, delivered through assisted voluntary organisations",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: [],
    applyVia: onSite(
      "national-action-plan-for-drug-demand-reduction",
      "nothing — the centres listed under the Drug Division take walk-ins",
    ),
  },
  {
    id: "dr-ambedkar-medical-aid-scheme",
    name: "Dr. Ambedkar Medical Aid Scheme",
    who: ["sc"],
    stage: ["any"],
    need: ["health"],
    benefit: "medical aid grants for serious illness needing surgery of the kidney, heart, liver, brain, an organ transplant, spinal surgery or cancer care",
    runBy: "Dr. Ambedkar Foundation",
    jurisdiction: "Central",
    docs: ["proof of identity", "a caste certificate", "an income certificate", "the hospital's estimate and medical papers"],
    applyVia: onSite(
      "dr-ambedkar-medical-aid-scheme",
      "the hospital's estimate and the family's income certificate",
    ),
  },
  {
    id: "centrally-sponsored-scheme-for-implementation-of-the-protection-of-civil-rights-act-1955-and-the-scheduled-castes-and-the-scheduled-tribes-prevention-of-atrocities-act-1989",
    name: "Implementation of the PCR Act and the PoA Act",
    who: ["sc", "atrocity"],
    stage: ["any"],
    need: ["safety"],
    benefit: "relief, legal support and enforcement machinery under the two Acts against untouchability and atrocities",
    runBy: "the Department, with the State Governments",
    jurisdiction: "Central",
    docs: ["a copy of the First Information Report", "proof of identity", "a caste certificate"],
    applyVia: onSite(
      "centrally-sponsored-scheme-for-implementation-of-the-protection-of-civil-rights-act-1955-and-the-scheduled-castes-and-the-scheduled-tribes-prevention-of-atrocities-act-1989",
      "the FIR number and the district you reported it in",
    ),
  },
  {
    id: "dr-ambedkar-scheme-for-social-integration-through-inter-caste-marriages-dr-ambedkar-national-relief-to-the-scheduled-castes-scheduled-tribes-victims-of-atrocities-2",
    name: "Social Integration through Inter-Caste Marriages, and National Relief to Victims of Atrocities",
    who: ["sc", "atrocity"],
    stage: ["any"],
    need: ["safety", "money"],
    benefit: "incentive for an inter-caste marriage, and relief for victims of atrocities — both now merged into the PCR and PoA scheme",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: ["proof of identity", "a caste certificate", "the marriage certificate or the FIR, as the case may be"],
    applyVia: onSite(
      "dr-ambedkar-scheme-for-social-integration-through-inter-caste-marriages-dr-ambedkar-national-relief-to-the-scheduled-castes-scheduled-tribes-victims-of-atrocities-2",
      "the marriage certificate, or the FIR number where the claim is for relief",
    ),
  },

  /* -- Organisations ------------------------------------------------------- */
  {
    id: "performance-linked-grants-in-aid-schemeplgia",
    name: "Performance Linked Grants-in-aid Scheme",
    who: ["ngo"],
    stage: ["any"],
    need: ["money"],
    benefit: "grant-in-aid released against an organisation's recorded performance",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_ORG,
    applyVia: {
      label: "the e-Anudaan grants portal",
      href: "https://grants-msje.gov.in",
      bring: "your registration certificate, audited accounts and the signed proposal",
    },
  },
  {
    id: "awareness-program-and-grant",
    name: "Awareness Programme and Grant",
    who: ["ngo", "dnt"],
    stage: ["any"],
    need: ["money"],
    benefit: "grant for organisations running awareness work with de-notified and nomadic communities",
    runBy: "the Department",
    jurisdiction: "Central",
    docs: DOCS_ORG,
    applyVia: {
      label: "the e-Anudaan grants portal",
      href: "https://grants-msje.gov.in",
      bring: "your registration certificate, audited accounts and the signed proposal",
    },
  },
  {
    id: "assistance-for-skill-development-of-obcs-dnts-ebcs",
    name: "Assistance for Skill Development of OBCs, DNTs and EBCs",
    who: ["ngo", "obc", "dnt"],
    stage: ["any"],
    need: ["money", "skills"],
    benefit: "grant to organisations that run skills training for OBC, DNT and EBC trainees",
    runBy: "National Backward Classes Finance and Development Corporation",
    jurisdiction: "Corporation",
    docs: DOCS_ORG,
    applyVia: {
      label: "NBCFDC",
      href: "https://nbcfdc.gov.in",
      bring: "your registration certificate, audited accounts and the training proposal",
    },
  },
];

/* ---------------------------------------------------------------------------
   Matching
   ------------------------------------------------------------------------- */

/**
 * What the citizen has told us so far. Every field is optional, and an absent
 * field is a WIDER answer, never a narrower one — that is the property the
 * "skip" affordance depends on and the tests pin.
 */
export interface FinderAnswers {
  /** Who the search is for. `org` routes to grants and skips the personal axes. */
  audienceFor?: "self" | "family" | "org";
  who?: Audience;
  stage?: Exclude<Stage, "any">;
  needs?: readonly Need[];
  /** `other` is a State we hold no State-run schemes for; it filters nothing. */
  state?: StateCode | "other";
}

const matchesWho = (s: Scheme, who: Audience | undefined) => !who || s.who.includes(who);

/** `any` is a wildcard on the record's side, so an undated scheme survives every stage. */
const matchesStage = (s: Scheme, stage: FinderAnswers["stage"]) =>
  !stage || s.stage.includes(stage) || s.stage.includes("any");

/** OR within the axis: picking two needs widens the answer, it does not narrow it. */
const matchesNeed = (s: Scheme, needs: FinderAnswers["needs"]) =>
  !needs || needs.length === 0 || needs.some((n) => s.need.includes(n));

/**
 * Central and Corporation schemes run everywhere, so a State answer can only
 * ADD. `other` adds nothing, and removes nothing either.
 */
const matchesState = (s: Scheme, state: FinderAnswers["state"]) =>
  !state ||
  state === "other" ||
  s.jurisdiction === "Central" ||
  s.jurisdiction === "Corporation" ||
  s.jurisdiction === state;

/** The schemes whose catalogue entry lists this person as a target group. */
export function matchSchemes(answers: FinderAnswers): readonly Scheme[] {
  return SCHEMES.filter(
    (s) =>
      matchesWho(s, answers.who) &&
      matchesStage(s, answers.stage) &&
      matchesNeed(s, answers.needs) &&
      matchesState(s, answers.state),
  );
}

/** The axes a citizen can be asked to loosen, in the order the questions ran. */
type Axis = "who" | "stage" | "needs" | "state";

/**
 * Which single answer is holding the count at zero, and what dropping it opens.
 *
 * Tries each axis on its own rather than guessing: the axis whose removal
 * recovers the most schemes is the one worth naming. "No results found" is not
 * an acceptable answer here — it tells a citizen nothing about what to do next.
 */
export function constrainingAnswer(
  answers: FinderAnswers,
): { axis: Axis; recovers: number } | null {
  if (matchSchemes(answers).length > 0) return null;

  const axes: Axis[] = ["needs", "who", "stage", "state"];
  let best: { axis: Axis; recovers: number } | null = null;

  for (const axis of axes) {
    const without: FinderAnswers = { ...answers, [axis]: undefined };
    const recovers = matchSchemes(without).length;
    if (recovers > 0 && (!best || recovers > best.recovers)) best = { axis, recovers };
  }
  return best;
}

/* ---------------------------------------------------------------------------
   Words for the axes
   ------------------------------------------------------------------------- */

/** How a target group is described back to a citizen, in the catalogue's terms. */
const AUDIENCE_WORDS: Record<Audience, string> = {
  sc: "Scheduled Caste applicants",
  obc: "Other Backward Class and Economically Backward Class applicants",
  dnt: "de-notified, nomadic and semi-nomadic communities",
  safai: "safai karamcharis, manual scavengers and their dependants",
  women: "women and girls",
  senior: "senior citizens",
  trans: "transgender persons",
  destitute: "people engaged in the act of begging",
  drugs: "people affected by alcohol or drug dependence",
  atrocity: "victims of atrocities under the PCR and PoA Acts",
  ngo: "voluntary organisations and NGOs",
};

const STAGE_WORDS: Record<Exclude<Stage, "any">, string> = {
  school: "in school",
  college: "in college or beyond",
  working: "of working age",
  senior: "a senior citizen",
};

const NEED_WORDS: Record<Need, string> = {
  education: "education",
  money: "money to work with",
  home: "a home",
  health: "health and care",
  safety: "safety and legal help",
  skills: "skills and a job",
};

const STATE_WORDS: Record<StateCode | "other", string> = {
  MH: "Maharashtra",
  UP: "Uttar Pradesh",
  BR: "Bihar",
  KA: "Karnataka",
  TN: "Tamil Nadu",
  other: "somewhere else",
};

const AXIS_WORDS: Record<Axis, string> = {
  who: "the community",
  stage: "the life stage",
  needs: "the kind of help",
  state: "the State",
};

/** "a, b and c" — Oxford-free, because a bubble is read aloud as often as it is read. */
function list(parts: readonly string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/* ---------------------------------------------------------------------------
   The wizard
   ------------------------------------------------------------------------- */

/** Quick-reply id the top-level script uses to open the finder. */
export const FINDER_ENTRY_ID = "finder";

/** Every finder id carries this prefix, so it can never collide with a scripted one. */
const P = "f:";

export type FinderStep =
  /** Not running. The scripted half of the assistant sits here. */
  | "idle"
  | "for"
  | "who"
  | "stage"
  | "needs"
  | "state"
  | "results"
  | "detail"
  | "change"
  | "depwd"
  | "empty";

export interface FinderState {
  step: FinderStep;
  answers: FinderAnswers;
  /** How many results have already been read out, so "show more" knows where to resume. */
  shown: number;
}

export interface FinderTurn {
  state: FinderState;
  /** Bot messages, in order. One bubble each — a bubble does not honour newlines. */
  say: readonly string[];
  quickReplies: readonly ChatbotQuickReply[];
}

/** How many results go in one turn. Three is what fits without becoming a wall. */
const PAGE = 3;

const reply = (id: string, label: string): ChatbotQuickReply => ({ id, label });

/** On every step, so a citizen is never cornered by a question they cannot answer. */
const ESCAPES: readonly ChatbotQuickReply[] = [
  reply(`${P}skip`, "Skip this"),
  reply(`${P}back`, "Go back"),
  reply(`${P}restart`, "Start over"),
];

const withEscapes = (opts: readonly ChatbotQuickReply[]): ChatbotQuickReply[] => [
  ...opts,
  ...ESCAPES,
];

/** Who the answers are about, for the second person in every sentence. */
function subject(answers: FinderAnswers): string {
  if (answers.audienceFor === "family") return "them";
  if (answers.audienceFor === "org") return "your organisation";
  return "you";
}

/** "That leaves 12." — stated after every answer, including a skip. */
function leaves(answers: FinderAnswers): string {
  return `That leaves ${matchSchemes(answers).length}.`;
}

const QUESTIONS: Record<"for" | "who" | "stage" | "needs" | "state", string> = {
  for: "Question 1 of 5. Who is this for?",
  who: "Question 2 of 5. Which of these describes the person?",
  stage: "Question 3 of 5. What life stage?",
  needs: "Question 4 of 5. What kind of help? Pick as many as apply.",
  state: "Question 5 of 5. Which State?",
};

const FOR_OPTIONS: readonly ChatbotQuickReply[] = [
  reply(`${P}for:self`, "Myself"),
  reply(`${P}for:family`, "Someone in my family"),
  reply(`${P}for:org`, "An organisation I run"),
];

const WHO_OPTIONS: readonly ChatbotQuickReply[] = [
  reply(`${P}who:sc`, "Scheduled Caste"),
  reply(`${P}who:obc`, "OBC or EBC"),
  reply(`${P}who:dnt`, "DNT or nomadic community"),
  reply(`${P}who:safai`, "Sanitation work"),
  reply(`${P}who:trans`, "A transgender person"),
  reply(`${P}who:depwd`, "A person with a disability"),
  reply(`${P}who:unsure`, "Not sure"),
];

const STAGE_OPTIONS: readonly ChatbotQuickReply[] = [
  reply(`${P}stage:school`, "In school"),
  reply(`${P}stage:college`, "In college or beyond"),
  reply(`${P}stage:working`, "Working age"),
  reply(`${P}stage:senior`, "Senior citizen"),
];

const STATE_OPTIONS: readonly ChatbotQuickReply[] = (
  ["MH", "UP", "BR", "KA", "TN", "other"] as const
).map((code) => reply(`${P}state:${code}`, STATE_WORDS[code]));

/** Q4 re-offers only what has not been picked, plus a way out of the loop. */
function needOptions(picked: readonly Need[]): ChatbotQuickReply[] {
  const rest = (Object.keys(NEED_WORDS) as Need[]).filter((n) => !picked.includes(n));
  const opts = rest.map((n) => reply(`${P}need:${n}`, NEED_WORDS[n]));
  if (picked.length > 0) opts.push(reply(`${P}needs:done`, "That's all — show me"));
  return opts;
}

/* -- one builder per step, so the copy for a step lives in one place -------- */

function askFor(): FinderTurn {
  return {
    state: { step: "for", answers: {}, shown: 0 },
    say: [
      "I can narrow it down in five questions. Skip any of them — skipping widens the answer rather than stopping it.",
      QUESTIONS.for,
    ],
    quickReplies: [...FOR_OPTIONS, reply(`${P}restart`, "Start over")],
  };
}

function askWho(answers: FinderAnswers, lead: readonly string[] = []): FinderTurn {
  const person = answers.audienceFor === "family" ? "the person" : "you";
  return {
    state: { step: "who", answers, shown: 0 },
    say: [...lead, `Question 2 of 5. Which of these describes ${person}?`],
    quickReplies: withEscapes(WHO_OPTIONS),
  };
}

function askStage(answers: FinderAnswers, lead: readonly string[] = []): FinderTurn {
  return {
    state: { step: "stage", answers, shown: 0 },
    say: [...lead, QUESTIONS.stage],
    quickReplies: withEscapes(STAGE_OPTIONS),
  };
}

function askNeeds(answers: FinderAnswers, lead: readonly string[] = []): FinderTurn {
  const picked = answers.needs ?? [];
  return {
    state: { step: "needs", answers, shown: 0 },
    say: [...lead, picked.length === 0 ? QUESTIONS.needs : "Anything else?"],
    quickReplies: withEscapes(needOptions(picked)),
  };
}

function askState(answers: FinderAnswers, lead: readonly string[] = []): FinderTurn {
  return {
    state: { step: "state", answers, shown: 0 },
    say: [...lead, QUESTIONS.state],
    quickReplies: withEscapes(STATE_OPTIONS),
  };
}

/**
 * The organisation branch. Grant-in-aid is a different conversation from a
 * citizen's — there is no community and no life stage to ask about — so Q2 and
 * Q3 are skipped rather than asked and ignored.
 */
function askOrg(answers: FinderAnswers): FinderTurn {
  const next: FinderAnswers = { ...answers, who: "ngo", stage: undefined };
  return askNeeds(next, [
    "Then this is the grant-in-aid side. I'll skip the two questions about a person and ask what the work is for.",
    leaves(next),
  ]);
}

/** Zero results, with the answer that caused it named. Never an empty message. */
function showEmpty(answers: FinderAnswers): FinderTurn {
  const cause = constrainingAnswer(answers);
  const state: FinderState = { step: "empty", answers, shown: 0 };

  if (!cause) {
    return {
      state,
      say: [
        "Nothing in the catalogue carries all of those answers together.",
        "No single answer is doing it — it is the combination. Change one and I'll look again.",
      ],
      quickReplies: [
        reply(`${P}change`, "Change an answer"),
        reply(`${P}restart`, "Start over"),
      ],
    };
  }

  // Naming the AXIS is not enough — "the community" does not tell anyone which
  // of their own answers to reconsider. Name the answer they actually gave.
  const given = answerGiven(answers, cause.axis);

  return {
    state,
    say: [
      "Nothing in the catalogue carries all of those answers together.",
      `It is the answer about ${AXIS_WORDS[cause.axis]}${given ? ` — ${given}` : ""}. Drop that one and ${
        cause.recovers
      } ${cause.recovers === 1 ? "scheme comes" : "schemes come"} back.`,
    ],
    quickReplies: [
      reply(`${P}drop:${cause.axis}`, "Drop that answer"),
      reply(`${P}change`, "Change a different answer"),
      reply(`${P}restart`, "Start over"),
    ],
  };
}

/** What the citizen actually said on an axis, in the words they were offered. */
function answerGiven(answers: FinderAnswers, axis: Axis): string | null {
  if (axis === "who") return answers.who ? AUDIENCE_WORDS[answers.who] : null;
  if (axis === "stage") return answers.stage ? STAGE_WORDS[answers.stage] : null;
  if (axis === "state") return answers.state ? STATE_WORDS[answers.state] : null;
  return answers.needs && answers.needs.length > 0
    ? list(answers.needs.map((n) => NEED_WORDS[n]))
    : null;
}

/**
 * The result set, three at a time.
 *
 * A result bubble carries a name, what the scheme gives and who runs it — and
 * deliberately no link. Opening one is a separate, explicit step, because that
 * is where the leaving line has to go.
 */
function showResults(answers: FinderAnswers, from: number): FinderTurn {
  const found = matchSchemes(answers);
  if (found.length === 0) return showEmpty(answers);

  const page = found.slice(from, from + PAGE);
  const shown = from + page.length;
  const rest = found.length - shown;
  const who = subject(answers);

  const lead =
    from === 0
      ? `${found.length} ${found.length === 1 ? "scheme lists" : "schemes list"} ${who} as ${
          found.length === 1 ? "its" : "their"
        } target group. Whether an application succeeds is the sanctioning authority's decision, not mine.`
      : `${rest > 0 ? "Next three" : "The last of them"}:`;

  const quickReplies: ChatbotQuickReply[] = page.map((s) =>
    reply(`${P}open:${s.id}`, `Open ${s.name}`),
  );
  if (rest > 0) {
    quickReplies.push(
      reply(`${P}more`, `Show ${rest > PAGE ? "three more" : rest === 1 ? "the last one" : `the last ${rest}`}`),
    );
  }
  quickReplies.push(reply(`${P}change`, "Change an answer"), reply(`${P}restart`, "Start over"));

  return {
    state: { step: "results", answers, shown },
    say: [lead, ...page.map((s) => `${s.name} — ${s.benefit}, run by ${s.runBy}.`)],
    quickReplies,
  };
}

/**
 * One scheme, in the four things a person actually needs: what you get, who can
 * apply, what to bring, and where to go. The leaving line comes BEFORE the
 * destination whenever the route leaves this site.
 */
function showDetail(answers: FinderAnswers, shown: number, scheme: Scheme): FinderTurn {
  const audiences = list(scheme.who.map((a) => AUDIENCE_WORDS[a]));
  const stages = scheme.stage.includes("any")
    ? "It is not tied to a life stage."
    : `It is for people ${list(scheme.stage.filter((s): s is Exclude<Stage, "any"> => s !== "any").map((s) => STAGE_WORDS[s]))}.`;

  const docs =
    scheme.docs.length === 0
      ? "What you'll need: nothing to hand for this one."
      : `What you'll need: ${list(scheme.docs)}. The scheme's own page lists the exact set — go by that.`;

  const via = scheme.applyVia;
  const apply = isOffsite(via)
    ? [
        `This next step leaves dosje.gov.in. You will be going to ${destinationDomain(via)}. Have ${via.bring} ready before you start.`,
        `How to apply: ${via.label}, at ${via.href}.`,
      ]
    : [`How to apply: start from ${via.label}, at ${via.href}. Have ${via.bring} ready.`];

  return {
    state: { step: "detail", answers, shown },
    say: [
      `${scheme.name} — what you get: ${scheme.benefit}.`,
      `Who can apply: the catalogue lists ${audiences}. ${stages} It is run by ${scheme.runBy}.`,
      docs,
      ...apply,
    ],
    quickReplies: [
      reply(`${P}list`, "Back to the list"),
      reply(`${P}change`, "Change an answer"),
      reply(`${P}restart`, "Start over"),
    ],
  };
}

/** Which answer to revisit. Keeps everything else, so nothing is retyped. */
function showChange(answers: FinderAnswers, shown: number): FinderTurn {
  return {
    state: { step: "change", answers, shown },
    say: ["Which answer should I change?"],
    quickReplies: [
      reply(`${P}goto:who`, "The community"),
      reply(`${P}goto:stage`, "The life stage"),
      reply(`${P}goto:needs`, "The kind of help"),
      reply(`${P}goto:state`, "The State"),
      reply(`${P}list`, "Never mind"),
      reply(`${P}restart`, "Start over"),
    ],
  };
}

/**
 * Disability is not this Department's subject. Say so at once and stop, rather
 * than running four more questions and finishing with nothing.
 */
function showDepwd(answers: FinderAnswers): FinderTurn {
  return {
    state: { step: "depwd", answers, shown: 0 },
    say: [DEPWD_ROUTE],
    quickReplies: [
      reply(`${P}restart`, "Ask about something else"),
      reply("contact", "What can this assistant do?"),
    ],
  };
}

/* -- the dispatcher -------------------------------------------------------- */

/** Where the wizard goes once a question has been answered or skipped. */
function nextQuestion(step: FinderStep, answers: FinderAnswers, lead: readonly string[]): FinderTurn {
  switch (step) {
    case "for":
      return answers.audienceFor === "org" ? askOrg(answers) : askWho(answers, lead);
    case "who":
      return askStage(answers, lead);
    case "stage":
      return askNeeds(answers, lead);
    case "needs":
      return askState(answers, lead);
    default:
      return showResults(answers, 0);
  }
}

/** The opening turn — what "Which scheme applies to me?" produces. */
export function finderStart(): FinderTurn {
  return askFor();
}

/**
 * Advance the wizard by one pressed suggestion.
 *
 * Returns `null` for an id the finder does not own, so the caller can hand it
 * to the scripted answers instead. Everything here is pure: same state and
 * same id, same turn, every time.
 */
export function finderAdvance(state: FinderState, id: string): FinderTurn | null {
  if (id === FINDER_ENTRY_ID) return finderStart();
  if (!id.startsWith(P)) return null;

  const rest = id.slice(P.length);
  const sep = rest.indexOf(":");
  const key = sep === -1 ? rest : rest.slice(0, sep);
  const value = sep === -1 ? "" : rest.slice(sep + 1);
  const answers = state.answers;

  switch (key) {
    case "restart":
      return finderStart();

    case "skip": {
      // A skip clears the axis rather than guessing at it, so the count can
      // only stay where it is or rise. It can never reach zero from here.
      const cleared: FinderAnswers =
        state.step === "who"
          ? { ...answers, who: undefined }
          : state.step === "stage"
            ? { ...answers, stage: undefined }
            : state.step === "needs"
              ? { ...answers, needs: undefined }
              : state.step === "state"
                ? { ...answers, state: undefined }
                : answers;
      if (state.step === "for") return askWho(cleared, ["Skipped."]);
      if (state.step === "state") return showResults(cleared, 0);
      return nextQuestion(state.step, cleared, [`Skipped. ${leaves(cleared)}`]);
    }

    case "for": {
      const next: FinderAnswers = {
        ...answers,
        audienceFor: value === "family" ? "family" : value === "org" ? "org" : "self",
      };
      return nextQuestion("for", next, []);
    }

    case "who": {
      if (value === "depwd") return showDepwd(answers);
      const next: FinderAnswers = {
        ...answers,
        who: value === "unsure" ? undefined : (value as Audience),
      };
      return nextQuestion("who", next, [
        value === "unsure"
          ? `No matter — I'll leave that open. ${leaves(next)}`
          : `Noted. ${leaves(next)}`,
      ]);
    }

    case "stage": {
      const next: FinderAnswers = { ...answers, stage: value as Exclude<Stage, "any"> };
      return nextQuestion("stage", next, [leaves(next)]);
    }

    case "need": {
      const picked = answers.needs ?? [];
      const need = value as Need;
      const next: FinderAnswers = {
        ...answers,
        needs: picked.includes(need) ? picked : [...picked, need],
      };
      return askNeeds(next, [`Added ${NEED_WORDS[need]}. ${leaves(next)}`]);
    }

    case "needs":
      return askState(answers, []);

    case "state": {
      const code = value as StateCode | "other";
      const next: FinderAnswers = { ...answers, state: code };
      // A zero here is its own answer and must not be dressed with a count line.
      if (matchSchemes(next).length === 0) return showEmpty(next);
      const results = showResults(next, 0);
      // Naming the gap beats implying the catalogue is complete for that State.
      const holdsStateSchemes = code !== "other" && SCHEMES.some((s) => s.jurisdiction === code);
      const note = holdsStateSchemes
        ? leaves(next)
        : `${leaves(next)} This catalogue holds the Central and Corporation schemes, which run everywhere; a State's own schemes are on its social justice department's site.`;
      return { ...results, say: [note, ...results.say] };
    }

    case "drop": {
      const next: FinderAnswers = { ...answers, [value as Axis]: undefined };
      return showResults(next, 0);
    }

    case "goto": {
      const axis = value as Axis;
      const next: FinderAnswers = { ...answers, [axis]: undefined };
      if (axis === "who") return askWho(next);
      if (axis === "stage") return askStage(next);
      if (axis === "needs") return askNeeds(next);
      return askState(next);
    }

    case "change":
      return showChange(answers, state.shown);

    case "list":
      return showResults(answers, 0);

    case "more":
      return showResults(answers, state.shown);

    case "open": {
      const scheme = SCHEMES.find((s) => s.id === value);
      return scheme ? showDetail(answers, state.shown, scheme) : showResults(answers, 0);
    }

    default:
      return null;
  }
}

/* ---------------------------------------------------------------------------
   Free text
   ------------------------------------------------------------------------- */

/**
 * What a typed word is taken to mean.
 *
 * WORD BOUNDARIES, not substrings. The input is split into whole words and each
 * word is looked up — so "fir" finds the atrocity route while "confirmation"
 * and "first" do not, which a `String.includes` check would get wrong in a way
 * that is hard to notice and rude when it happens.
 *
 * Hindi and Marathi words are here in Latin script because that is how they are
 * typed into a search box. Devanagari is matched too, where the letters are the
 * ones people actually use.
 */
const SYNONYMS: ReadonlyArray<readonly [intent: string, words: readonly string[]]> = [
  ["depwd", ["divyang", "viklang", "udid", "disability", "disabled", "handicap", "दिव्यांग"]],
  ["ngo", ["anudaan", "ngo", "ngos", "grant", "grants", "trust", "society", "अनुदान"]],
  ["senior", ["pension", "budhapa", "buzurg", "vridha", "elderly", "senior", "old", "बुजुर्ग"]],
  ["safai", ["safai", "sewer", "manhole", "scavenger", "scavengers", "karamchari", "sanitation", "sfai", "सफाई"]],
  ["drugs", ["nasha", "daaru", "sharab", "addiction", "addict", "drugs", "drug", "alcohol", "नशा"]],
  ["education", ["chhatravriti", "chatravriti", "scholarship", "fees", "fee", "padhai", "school", "college", "student", "study", "छात्रवृत्ति"]],
  ["atrocity", ["fir", "atrocity", "atrocities", "casteism", "untouchability", "harassment"]],
  ["women", ["mahila", "women", "woman", "girl", "girls", "beti", "महिला"]],
  ["home", ["makaan", "awas", "ghar", "housing", "house", "home", "shelter", "आवास"]],
  ["money", ["loan", "karza", "karz", "rin", "business", "udyam", "rozgar", "capital", "ऋण"]],
  ["skills", ["kaushal", "skill", "skills", "training", "job", "naukri", "kaam", "कौशल"]],
  ["health", ["ilaj", "health", "medical", "hospital", "surgery", "treatment", "स्वास्थ्य"]],
];

/** Whole words only. Latin letters, digits and Devanagari all count as word characters. */
function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9ऀ-ॿ]+/)
    .filter(Boolean);
}

/** The first intent any word in the sentence matches, or null. */
export function readIntent(text: string): string | null {
  const said = new Set(words(text));
  for (const [intent, list] of SYNONYMS) {
    if (list.some((w) => said.has(w))) return intent;
  }
  return null;
}

/** An intent that names a community, and therefore answers Q2. */
const INTENT_AUDIENCE: Partial<Record<string, Audience>> = {
  senior: "senior",
  safai: "safai",
  drugs: "drugs",
  atrocity: "atrocity",
  women: "women",
  ngo: "ngo",
};

/** An intent that names a kind of help, and therefore answers Q4. */
const INTENT_NEED: Partial<Record<string, Need>> = {
  education: "education",
  home: "home",
  money: "money",
  skills: "skills",
  health: "health",
};

/**
 * A typed question, answered against the same catalogue the five questions use.
 *
 * A recognised word is treated as one answer already given — it seeds the axis
 * and the wizard picks up from the next unanswered question, so typing is a
 * shortcut into the finder rather than a second, weaker finder.
 */
export function finderSubmit(state: FinderState, text: string): FinderTurn {
  const intent = readIntent(text);

  if (intent === "depwd") return showDepwd(state.answers);

  /*
   * A typed word starts a FRESH search rather than refining whatever run
   * happened to be on screen. Merging into the answers already given produced
   * a genuinely misleading count: someone who had narrowed to sanitation work
   * and then typed about pensions was told "That leaves 1", because the old
   * answers were silently still applied. Starting over is announced in the same
   * breath, so nothing is discarded quietly.
   */
  if (intent && INTENT_AUDIENCE[intent]) {
    const who = INTENT_AUDIENCE[intent]!;
    const answers: FinderAnswers = { who };
    return askStage(answers, [
      `I've read that as ${AUDIENCE_WORDS[who]}, and started fresh from there. ${leaves(answers)}`,
    ]);
  }

  if (intent && INTENT_NEED[intent]) {
    const need = INTENT_NEED[intent]!;
    const answers: FinderAnswers = { needs: [need] };
    return askWho(answers, [
      `I've read that as ${NEED_WORDS[need]}, and started fresh from there. ${leaves(answers)}`,
    ]);
  }

  return {
    state: { step: "for", answers: {}, shown: 0 },
    say: [
      "I don't know that word yet. I can find it by asking five questions instead.",
      QUESTIONS.for,
    ],
    quickReplies: [...FOR_OPTIONS, reply(`${P}restart`, "Start over")],
  };
}

/* ---------------------------------------------------------------------------
   The session
   ------------------------------------------------------------------------- */

export interface FinderMessage {
  id: string;
  from: "bot" | "user";
  text: string;
}

/** One complete, renderable moment: the transcript AND what is on offer. */
export interface FinderFrame {
  state: FinderState;
  messages: readonly FinderMessage[];
  quickReplies: readonly ChatbotQuickReply[];
}

/**
 * The whole conversation as a stack of frames.
 *
 * Each frame carries the FULL transcript rather than a delta, which makes "go
 * back" a pop and nothing else. A back that replayed deltas would have to undo
 * the messages it appended, and undoing appends is how a transcript ends up
 * with orphans — a question still on screen that nothing will ever answer.
 */
export interface FinderSession {
  frames: readonly FinderFrame[];
}

/**
 * The scripted half of the assistant, injected rather than imported.
 *
 * `content.ts` owns the words and imports this module; if this module imported
 * it back the two would be a cycle. Passing the script in also lets a test
 * drive the session with a stub.
 */
export interface FinderScript {
  greeting: string;
  quickReplies: readonly ChatbotQuickReply[];
  answer: (id: string) => ChatbotReply;
}

const IDLE: FinderState = { step: "idle", answers: {}, shown: 0 };

const say = (messages: readonly FinderMessage[], from: "bot" | "user", text: string) => ({
  id: `m${messages.length}`,
  from,
  text,
});

function frame(
  previous: readonly FinderMessage[],
  said: string | null,
  bot: readonly string[],
  state: FinderState,
  quickReplies: readonly ChatbotQuickReply[],
): FinderFrame {
  const messages: FinderMessage[] = [...previous];
  if (said !== null) messages.push(say(messages, "user", said));
  for (const text of bot) messages.push(say(messages, "bot", text));
  return { state, messages, quickReplies };
}

/** The frame currently on screen. */
export function finderCurrent(session: FinderSession): FinderFrame {
  return session.frames[session.frames.length - 1]!;
}

/** Whether "Go back" has anywhere to go. */
export function finderCanGoBack(session: FinderSession): boolean {
  return session.frames.length > 1;
}

/** A fresh conversation: the greeting and the top-level suggestions. */
export function finderSessionStart(script: FinderScript): FinderSession {
  return { frames: [frame([], null, [script.greeting], IDLE, script.quickReplies)] };
}

/**
 * A pressed suggestion. Ids the finder does not own fall through to the script,
 * so the two halves of the assistant share one transcript and one history.
 */
export function finderSessionAnswer(
  session: FinderSession,
  script: FinderScript,
  pressed: ChatbotQuickReply,
): FinderSession {
  if (pressed.id === `${P}back`) {
    return finderCanGoBack(session) ? { frames: session.frames.slice(0, -1) } : session;
  }

  const current = finderCurrent(session);
  const turn = finderAdvance(current.state, pressed.id);

  if (turn) {
    return {
      frames: [
        ...session.frames,
        frame(current.messages, pressed.label, turn.say, turn.state, turn.quickReplies),
      ],
    };
  }

  const scripted = script.answer(pressed.id);
  return {
    frames: [
      ...session.frames,
      frame(
        current.messages,
        pressed.label,
        [scripted.text],
        IDLE,
        scripted.quickReplies ?? current.quickReplies,
      ),
    ],
  };
}

/** A typed question. Always goes through the synonym layer. */
export function finderSessionSubmit(
  session: FinderSession,
  _script: FinderScript,
  text: string,
): FinderSession {
  const current = finderCurrent(session);
  const turn = finderSubmit(current.state, text);
  return {
    frames: [
      ...session.frames,
      frame(current.messages, text, turn.say, turn.state, turn.quickReplies),
    ],
  };
}

/**
 * The transcript with what was just said appended and nothing on offer.
 *
 * Shown for the length of the typing beat only. It is NOT a frame — pushing it
 * would put a half-turn on the history stack, and going back would land on a
 * question with no suggestions under it.
 */
export function finderEcho(session: FinderSession, said: string): FinderFrame {
  const current = finderCurrent(session);
  return frame(current.messages, said, [], current.state, []);
}
