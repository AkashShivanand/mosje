/**
 * OUR OFFERINGS — the schemes, vacancies and tenders the live home page puts
 * forward, shared by all three designs of the website (see home.ts for the
 * rule; .claude/rules/website-shared-content.md).
 *
 * SOURCE: the "Our Offerings" section of https://dosje.gov.in/, read on
 * OFFERINGS_AS_ON. All three lists are the Department's own SELECTION, not the
 * newest rows of a register: the live Vacancies tab carries a Nov 2025 NISD post
 * above internships the register dates later, and each group's schemes are
 * hand-picked. So they are mirrored as published, and a register is not a
 * substitute. When the live section changes, change it here.
 *
 * What is NOT here: What's New, which the live site runs as a newest-first feed.
 * Every design reads the estate's one feed for it, `whatsNew()` in
 * lib/website-next/whats-new.ts.
 */

/** The date the live section was last read for this file. */
export const OFFERINGS_AS_ON = "2026-10-08";

export const OFFERINGS_SECTION = {
  title: "Our Offerings",
  intro: "Discover our schemes, careers, and partnerships.",
} as const;

/* ------------------------------------------------------------------ schemes */

export interface OfferingScheme {
  /** The live card's category line. */
  tag: string;
  /** The scheme's name as the live card prints it. */
  title: string;
  description?: string;
  /**
   * The live scheme page's slug. The estate carries every one of these pages
   * (`/website/schemes-services/<slug>`), redirecting to the scheme master where
   * the two are the same scheme.
   */
  slug?: string;
  /**
   * The scheme master's id, where this card is a scheme the master holds — the
   * DBIM design's scheme pages are keyed by it. The two SMILE cards go to the
   * component of SMILE their group is about.
   */
  masterId?: string;
  /** Where the live card opens a document rather than a page. */
  file?: string;
}

export interface OfferingGroup {
  /** The live site's `?applicant=` value. */
  id: string;
  label: string;
  /**
   * The live group icon, rendered from its SVG to a 192px PNG: the live files
   * are 32px drawings wrapping full-size photographs, up to 1.9MB each (9.5MB
   * for the set); the PNGs are 32–44KB and the drawing is unchanged.
   */
  icon: string;
  schemes: OfferingScheme[];
}

/** The eleven groups, in the live order, each with the schemes the live site shows for it. */
export const OFFERING_GROUPS: readonly OfferingGroup[] = [
  {
    id: "students",
    label: "Students",
    icon: "/website/images/offerings/students.png",
    schemes: [
      { tag: "Residential Schools, Hostels and Coaching", title: "PM Young Achievers Scholarship Award Scheme for Vibrant India for OBCs and Others (PM -YASASVI)", slug: "pm-young-achievers-scholarship-award-scheme-for-vibrant-india-for-obcs-and-others-pm-yasasvi" },
      { tag: "Scholarships and Fellowships", title: "Top Class Education in College for OBC EBC and DNT Students", description: "The objective of the scheme is to recognize and promote quality education amongst Students belonging to OBC, EBC and DNT categories by providing full financial support. The Scheme will cover OBC/EBC/DNT students for pursuing studies beyond class XIIth.", slug: "top-class-education-in-colllege-for-obc-ebc-and-dnt-students", masterId: "yasasvi-college" },
      { tag: "Scholarships and Fellowships", title: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others", slug: "pre-matric-scholarships-scheme-for-scheduled-castes-others", masterId: "pre-matric-sc" },
    ],
  },
  {
    id: "scheduled-castes",
    label: "Scheduled Castes",
    icon: "/website/images/offerings/scheduled-castes.png",
    schemes: [
      { tag: "Housing and Settlement", title: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)", slug: "pradhan-mantri-anusuchit-jaati-abhyuday-yojna-pm-ajay", masterId: "pm-ajay" },
      { tag: "Protection, Relief and Grievance", title: "Centrally Sponsored Scheme for implementation of the Protection of Civil Rights Act, 1955 and the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989", slug: "centrally-sponsored-scheme-for-implementation-of-the-protection-of-civil-rights-act-1955-and-the-scheduled-castes-and-the-scheduled-tribes-prevention-of-atrocities-act-1989", masterId: "pcr-poa" },
      { tag: "Scholarships and Fellowships", title: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others", slug: "pre-matric-scholarships-scheme-for-scheduled-castes-others", masterId: "pre-matric-sc" },
    ],
  },
  {
    id: "other-backward-classes",
    label: "Other Backward Classes",
    icon: "/website/images/offerings/other-backward-classes.png",
    schemes: [
      { tag: "Residential Schools, Hostels and Coaching", title: "PM Young Achievers Scholarship Award Scheme for Vibrant India for OBCs and Others (PM -YASASVI)", slug: "pm-young-achievers-scholarship-award-scheme-for-vibrant-india-for-obcs-and-others-pm-yasasvi" },
      { tag: "Scholarships and Fellowships", title: "Top Class Education in College for OBC EBC and DNT Students", description: "The objective of the scheme is to recognize and promote quality education amongst Students belonging to OBC, EBC and DNT categories by providing full financial support. The Scheme will cover OBC/EBC/DNT students for pursuing studies beyond class XIIth.", slug: "top-class-education-in-colllege-for-obc-ebc-and-dnt-students", masterId: "yasasvi-college" },
      { tag: "Residential Schools, Hostels and Coaching", title: "Dr. Ambedkar Centre of Excellence – Free Coaching Scheme", description: "Provides free competitive exam coaching and financial support for eligible SC/OBC students.", slug: "dr-ambedkar-centre-of-excellence-free-coaching-scheme-2", masterId: "free-coaching" },
    ],
  },
  {
    id: "de-notified-nomadic-and-semi-nomadic-tribes",
    label: "De-notified, Nomadic and Semi-Nomadic Tribes",
    icon: "/website/images/offerings/de-notified-nomadic-and-semi-nomadic-tribes.png",
    schemes: [
      { tag: "Residential Schools, Hostels and Coaching", title: "PM Young Achievers Scholarship Award Scheme for Vibrant India for OBCs and Others (PM -YASASVI)", slug: "pm-young-achievers-scholarship-award-scheme-for-vibrant-india-for-obcs-and-others-pm-yasasvi" },
      { tag: "Scholarships and Fellowships", title: "Top Class Education in College for OBC EBC and DNT Students", description: "The objective of the scheme is to recognize and promote quality education amongst Students belonging to OBC, EBC and DNT categories by providing full financial support. The Scheme will cover OBC/EBC/DNT students for pursuing studies beyond class XIIth.", slug: "top-class-education-in-colllege-for-obc-ebc-and-dnt-students", masterId: "yasasvi-college" },
      { tag: "Housing and Settlement", title: "Seed – Housing", slug: "seed-housing", masterId: "seed" },
    ],
  },
  {
    id: "safai-karamcharis",
    label: "Safai Karamcharis",
    icon: "/website/images/offerings/safai-karamcharis.png",
    schemes: [
      { tag: "Care, Health and Shelter", title: "Revised Scheme Guidelines For inclusion of Waste Pickers Component under NAMASTE", file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/05/Annexure-II-Revised-Wastepickers-Scheme-Guidelines-in-English-and-Hindi_compressed.pdf" },
      { tag: "Care, Health and Shelter", title: "Revised Guidelines of National Action for Mechanized Sanitation Ecosystem (NAMASTE) Scheme", file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/05/Annexure-I-Revised-Scheme-Guidelines-for-SSWs-in-English-and-Hindi.pdf" },
      { tag: "Scholarships and Fellowships", title: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others", slug: "pre-matric-scholarships-scheme-for-scheduled-castes-others", masterId: "pre-matric-sc" },
    ],
  },
  {
    id: "senior-citizens",
    label: "Senior Citizens",
    icon: "/website/images/offerings/senior-citizens.png",
    schemes: [
      { tag: "Care, Health and Shelter", title: "Integrated Programme for Senior Citizens (IPSrC)", slug: "integrated-programme-for-senior-citizens-ipsrc", masterId: "avyay-ipsrc" },
      { tag: "Care, Health and Shelter", title: "State Action Plan for Senior Citizens (SAPSrC)", slug: "state-action-plan-for-senior-citizens-sapsrc" },
      { tag: "Care, Health and Shelter", title: "Rashtriya Vayoshri Yojana (RVY)", slug: "rashtriya-vayoshri-yojana-rvy", masterId: "avyay-rvy" },
    ],
  },
  {
    id: "transgender-persons",
    label: "Transgender Persons",
    icon: "/website/images/offerings/transgender-persons.png",
    schemes: [
      { tag: "Care, Health and Shelter", title: "Support for Marginalized Individuals for Livelihood and Enterprise (SMILE)", slug: "support-for-marginalized-individuals-for-livelihood-and-enterprise-smile", masterId: "smile-tg" },
    ],
  },
  {
    id: "persons-affected-by-substance-use",
    label: "Persons Affected by Substance Use",
    icon: "/website/images/offerings/persons-affected-by-substance-use.png",
    schemes: [
      { tag: "Awards and Recognition", title: "Scheme of National Awards for Outstanding Services in the field of Prevention of Alcoholism and Substance (Drug) Abuse", slug: "scheme-of-national-awards-for-outstanding-services-in-the-field-of-prevention-of-alcoholism-and-substance-drug-abuse" },
      { tag: "De-addiction and Counselling", title: "National Action Plan for Drug Demand Reduction", slug: "national-action-plan-for-drug-demand-reduction", masterId: "napddr" },
    ],
  },
  {
    id: "persons-engaged-in-begging",
    label: "Persons Engaged in Begging",
    icon: "/website/images/offerings/persons-engaged-in-begging.png",
    schemes: [
      { tag: "Care, Health and Shelter", title: "Support for Marginalized Individuals for Livelihood and Enterprise (SMILE)", slug: "support-for-marginalized-individuals-for-livelihood-and-enterprise-smile", masterId: "smile-begging" },
    ],
  },
  {
    id: "victims-of-atrocities",
    label: "Victims of Atrocities",
    icon: "/website/images/offerings/victims-of-atrocities.png",
    schemes: [
      { tag: "Protection, Relief and Grievance", title: "Centrally Sponsored Scheme for implementation of the Protection of Civil Rights Act, 1955 and the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989", slug: "centrally-sponsored-scheme-for-implementation-of-the-protection-of-civil-rights-act-1955-and-the-scheduled-castes-and-the-scheduled-tribes-prevention-of-atrocities-act-1989", masterId: "pcr-poa" },
      { tag: "Protection, Relief and Grievance", title: "List of 46 offences under the SC and ST PoA Act, 1989", file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/List-of-46-offences.pdf" },
      { tag: "Protection, Relief and Grievance", title: "Data of Central Assistance released to States/UTs for last 5 years i.e 2020-21 to 2024-25 along with no. of atrocity victims and no. of couples provided incentives", file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/Release-Data-2020-25-1.pdf" },
    ],
  },
  {
    id: "voluntary-organisations",
    label: "Voluntary Organisations",
    icon: "/website/images/offerings/voluntary-organisations.png",
    schemes: [
      { tag: "Care, Health and Shelter", title: "Integrated Programme for Senior Citizens (IPSrC)", slug: "integrated-programme-for-senior-citizens-ipsrc", masterId: "avyay-ipsrc" },
      { tag: "Grants to Voluntary Organisations", title: "Dr. Ambedkar Scheme for Celebration of Birth /Death Anniversary of Great Saints (Revised in 2022)", description: "Dr. Ambedkar Scheme for celebrating of Birth/Death Anniversary of Great Saints", slug: "dr-ambedkar-scheme-for-celebration-of-birth-death-anniversary-of-great-saints-revised-in-2022-2" },
      { tag: "Grants to Voluntary Organisations", title: "Babu Jagjivan Ram Scheme for Celebration of Birth-Death Anniversary of Great Saints", file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Babu-Jagjivan-Ram-Scheme-for-Celebration-of-Birth-Death-Anniversary-of-Great-Saints.pdf" },
    ],
  },
];

/**
 * Every scheme the section names, once each, in the order it first appears.
 * The DBIM design's Key Offerings has no groups (DBIM 3.0 §A.4.1 vi), so it
 * lists the first five of these.
 */
export function offeringSchemesInOrder(): OfferingScheme[] {
  const seen = new Set<string>();
  return OFFERING_GROUPS.flatMap((g) => g.schemes).filter((s) => {
    const key = s.slug ?? s.file ?? s.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * The five schemes of the live home page's Key Offerings tab, in its order — read
 * 8 Oct 2026, when dosje.gov.in took the DBIM layout and began listing its own five
 * rather than the first five of the groups above. Each is a scheme the groups already
 * carry, so the record (title, master id) is not repeated here.
 */
export const KEY_OFFERING_SCHEME_SLUGS: readonly string[] = [
  "pradhan-mantri-anusuchit-jaati-abhyuday-yojna-pm-ajay",
  "pm-young-achievers-scholarship-award-scheme-for-vibrant-india-for-obcs-and-others-pm-yasasvi",
  "centrally-sponsored-scheme-for-implementation-of-the-protection-of-civil-rights-act-1955-and-the-scheduled-castes-and-the-scheduled-tribes-prevention-of-atrocities-act-1989",
  "top-class-education-in-colllege-for-obc-ebc-and-dnt-students",
  "pre-matric-scholarships-scheme-for-scheduled-castes-others",
];

/** The live Key Offerings schemes, then the rest of the section's in its order. */
export function keyOfferingSchemes(): OfferingScheme[] {
  const all = offeringSchemesInOrder();
  const picked = KEY_OFFERING_SCHEME_SLUGS.flatMap((slug) => all.filter((s) => s.slug === slug));
  return [...picked, ...all.filter((s) => !picked.includes(s))];
}

/* ------------------------------------------------------- vacancies, tenders */

export interface OfferingNotice {
  title: string;
  /** Who issued it, as the live card names it. */
  issuer: string;
  /** Tender number, where the live card prints one. */
  reference?: string;
  /** Further lines the live card prints — a closing date, a place. */
  details?: string[];
  description?: string;
  /** The live document the card's "View PDF" opens. */
  file: string;
  /** "PDF · 443.0 KB", as printed. */
  size: string;
}

/**
 * Four, as the live Key Offerings shows on OFFERINGS_AS_ON: the DAIC October 2026
 * internship (applications closed 30 Sep 2026) is no longer listed.
 */
export const OFFERING_VACANCIES: readonly OfferingNotice[] = [
  {
    issuer: "Dr. Ambedkar International Centre (DAIC)",
    title: "Vacancy Circular for the post of Financial Advisor",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/FA-31-07-2026.pdf",
    size: "PDF · 1.9 MB",
  },
  {
    issuer: "National Backward Classes Finance and Development Corporation (NBCFDC)",
    title: "Recruitment Notification for Deputy General Manager (Finance) – E-5 Level",
    details: ["New Delhi"],
    description:
      "The Corporation is looking for qualified candidates with work experience commensurate with the advertised post. Considering the core function of the Corporation, preference will be given to candidate with Finance and related field background.",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/01/advertisement-E-5-10.12.2025_1.pdf",
    size: "PDF · 157.4 KB",
  },
  {
    issuer: "National Institute of Social Defence (NISD)",
    title:
      "Filling up the post of Junior Research Officer, Technical Assistant & Stenographer Grade-III in National Institute of Social Defence (NISD) on deputation basis.",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Application_for_the_post_of_JRO_TA_Steno_NISD.pdf",
    size: "PDF · 179.3 KB",
  },
  {
    issuer: "National Institute of Social Defence (NISD)",
    title:
      "Filling up the post of Deputy Director (Trg.) on deputation basis in National Institute of Social Defence, New Delhi under Ministry of Social Justice & Empowerment, Government of India.",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Application_for_the_post_of_DD_TRG.pdf",
    size: "PDF · 2.7 MB",
  },
];

/**
 * Five, as the live Key Offerings shows on OFFERINGS_AS_ON, each a record in the tender
 * register. The live list names no issuer; each is named here from its title — the
 * Dr. Ambedkar National Memorial (DANM) and NSFDC — and the DAIC notice keeps the
 * issuer its earlier live card printed. Files and sizes are each live tender page's.
 */
export const OFFERING_TENDERS: readonly OfferingNotice[] = [
  {
    issuer: "DAIC",
    title: "Notice Inviting Expression of Interest",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/07/EOI.pdf",
    size: "PDF · 2.1 MB",
  },
  {
    issuer: "DANM",
    title: "Extension of date for submission of RFP/Bids for running canteen/ cafeteria at DANM",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/Extension-of-date-for-submission-of-RFPBids-for-running-canteen-cafeteria-at-DANM.pdf",
    size: "PDF · 249.7 KB",
  },
  {
    issuer: "DANM",
    title: "Request for Proposal for “Empanelment of Caterer for Running Canteen/Cafeteria at Dr. Ambedkar National Memorial (DANM)”",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/RFP.pdf",
    size: "PDF · 7.4 MB",
  },
  {
    issuer: "NSFDC",
    title: "Announcements with respect to tendering for new NSFDC Website (GeM Bid Ref. No. GEM/2025/B/6519656)",
    reference: "GEM/2025/B/6519656",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/announcement20for20new20nsfdc20website2006082025.pdf",
    size: "PDF · 20.2 KB",
  },
  {
    issuer: "NSFDC",
    title: "Corrigendum and clarification for tender of new NSFDC Website 14.08.2025",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/corrigendumandclarificationfortenderofnewnsfdcwebsite140825.pdf",
    size: "PDF · 953.5 KB",
  },
];
