/**
 * THE FINDER'S REGISTER — real schemes, tagged on the eligibility model.
 *
 * Every record here is a page that exists on dosje.gov.in. Titles are the
 * Department's own (Title Case applied per `ui-restraint-and-copy.md`), `url` is
 * the scheme's page there, and `forWhom` / `provides` are written from that
 * page's text — `apps/hub/src/content/website/schemes.json` holds the scrape.
 * Nothing is invented; where a page carries no body text (SRMS, SHREYAS) the
 * line is drawn from the title alone and says no more than the title does.
 *
 * The TAGS are the point of the exercise. The live site tags a scheme with one
 * target group or none, so a Scheduled Caste student must choose between
 * "Scheduled Castes" and "Students" and neither answer is true. Here every axis
 * is multi-valued — a scheme is findable under every value that applies at once
 * — which is the model `docs/plans/HANDOFF-service-discovery.md` §3 proposes and
 * every option in the register depends on.
 *
 * Two boundaries the data keeps:
 *
 *  · No record states that anyone is ELIGIBLE. `forWhom` is who the scheme
 *    lists; the sanctioning authority decides an application. The same rule is
 *    set out in `apps/hub/src/lib/chatbot/content.ts`.
 *  · `apply` is present only where the Department, or the organisation running
 *    the scheme, publishes a portal or a number — and only URLs the estate
 *    already records (`organisation-details.ts`, the portals registry). A scheme
 *    with no published route links to its own page and nothing else.
 *
 * The VJNT/SBC schemes are marked Maharashtra: "Vimukta Jati and Nomadic Tribes"
 * and "Special Backward Class" are that State's categories, one of the pages
 * names the Government of Maharashtra outright, and the rest route through the
 * Zilla Parishad and the Assistant Commissioner of Social Welfare. The
 * Mukhyamantri Swarozgar Yojana names Madhya Pradesh in its own eligibility.
 *
 * Weight: about 20 KB of source, under 6 KB gzipped, bundled with the option.
 * It is read on the exploration page only.
 */

export type GroupId =
  | "sc"
  | "obc"
  | "dnt"
  | "safai"
  | "senior"
  | "tg"
  | "substance"
  | "vo"
  /** Asked so the Department's boundary can be named; never matched to a scheme. */
  | "pwd";

export type StageId = "school" | "college" | "working" | "senior";
export type NeedId =
  | "education"
  | "finance"
  | "skills"
  | "housing"
  | "care"
  | "legal";

export interface Jurisdiction {
  kind: "central-sector" | "centrally-sponsored" | "corporation" | "state";
  /** Only for `state`. The State's own name, as it appears in the States list. */
  state?: string;
}

export interface Scheme {
  id: string;
  title: string;
  /** The scheme's page on dosje.gov.in, or the running organisation's published page. */
  url: string;
  /** Who the scheme lists, in the Department's terms. Never an eligibility ruling. */
  forWhom: string;
  /** What the scheme provides, from its own page. */
  provides: string;
  /** Who runs it, where the page says. */
  runBy?: string;
  jurisdiction: Jurisdiction;
  groups: GroupId[];
  stages: StageId[];
  needs: NeedId[];
  /** A published place to apply or to call. Absent where none is published. */
  apply?: { label: string; href: string; kind: "portal" | "phone" };
}

export interface Option<Id extends string> {
  id: Id;
  label: string;
  description: string;
  /** Material Symbols Rounded glyph name. */
  icon: string;
}

export const GROUPS: readonly Option<GroupId>[] = [
  {
    id: "sc",
    label: "Scheduled Castes",
    description:
      "Communities listed in the Presidential Orders under Article 341",
    icon: "groups",
  },
  {
    id: "obc",
    label: "Other Backward Classes",
    description: "Other Backward Classes and Economically Backward Classes",
    icon: "diversity_3",
  },
  {
    id: "dnt",
    label: "De-notified, Nomadic and Semi-Nomadic Tribes",
    description: "DNT, NT and SNT communities; VJNT and SBC in Maharashtra",
    icon: "hiking",
  },
  {
    id: "safai",
    label: "Safai Karamcharis",
    description: "Sanitation workers, manual scavengers and their dependants",
    icon: "cleaning_services",
  },
  {
    id: "senior",
    label: "Senior Citizens",
    description: "Aged 60 years and above",
    icon: "elderly",
  },
  {
    id: "tg",
    label: "Transgender Persons",
    description:
      "Under the SMILE scheme and the National Portal for Transgender Persons",
    icon: "transgender",
  },
  {
    id: "substance",
    label: "Persons Affected by Substance Use",
    description: "The person, or a member of their family",
    icon: "medication",
  },
  {
    id: "vo",
    label: "Voluntary Organisations",
    description: "NGOs and institutions applying for grant-in-aid",
    icon: "volunteer_activism",
  },
  {
    id: "pwd",
    label: "Persons with Disabilities",
    description:
      "Served by the Department of Empowerment of Persons with Disabilities",
    icon: "accessible",
  },
];

export const STAGES: readonly Option<StageId>[] = [
  {
    id: "school",
    label: "In School",
    description: "Class I to XII, including ITI",
    icon: "school",
  },
  {
    id: "college",
    label: "In College or Higher Study",
    description: "Graduation, professional courses, research and study abroad",
    icon: "menu_book",
  },
  {
    id: "working",
    label: "Of Working Age",
    description: "In work, self-employed or seeking work",
    icon: "work",
  },
  {
    id: "senior",
    label: "Aged 60 or Above",
    description: "Senior citizens and those caring for them",
    icon: "elderly",
  },
];

export const NEEDS: readonly Option<NeedId>[] = [
  {
    id: "education",
    label: "Education, Fees and Hostels",
    description: "Scholarships, fellowships, coaching and hostel places",
    icon: "history_edu",
  },
  {
    id: "finance",
    label: "Loans and Finance for Work",
    description: "Term loans, micro-credit and grants for livelihood",
    icon: "payments",
  },
  {
    id: "skills",
    label: "Skills, Training and Jobs",
    description: "Vocational training and placement",
    icon: "engineering",
  },
  {
    id: "housing",
    label: "Housing and Basic Amenities",
    description: "A house, or roads, water and sanitation in the settlement",
    icon: "home",
  },
  {
    id: "care",
    label: "Health, Care and Shelter",
    description: "Medical aid, assistive devices, treatment and shelter homes",
    icon: "medical_services",
  },
  {
    id: "legal",
    label: "Legal Aid and Protection",
    description: "Relief and enforcement under the protective Acts",
    icon: "gavel",
  },
];

/** The 28 States and 8 Union Territories, as the Government of India lists them. */
export const STATES: readonly string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const DOSJE = "https://www.dosje.gov.in/schemes-and-services";
const NSP = {
  label: "National Scholarship Portal",
  href: "https://scholarships.gov.in/",
  kind: "portal" as const,
};
const NSFDC = {
  label: "NSFDC",
  href: "https://nsfdc.nic.in/",
  kind: "portal" as const,
};
const NSKFDC = {
  label: "NSKFDC",
  href: "https://nskfdc.nic.in",
  kind: "portal" as const,
};
const ALL_STAGES: StageId[] = ["school", "college", "working", "senior"];

export const SCHEMES: readonly Scheme[] = [
  /* ── Scheduled Castes ─────────────────────────────────────────────────── */
  {
    id: "post-matric-sc",
    title: "Post-Matric Scholarship for SC Students",
    url: `${DOSJE}/post-matric-scholarship-for-sc-students/`,
    forWhom:
      "Scheduled Caste students at the post-matriculation or post-secondary stage, with a focus on the poorest households.",
    provides:
      "Financial assistance to complete education after Class X, for studies in India.",
    runBy: "State Governments and Union Territories",
    jurisdiction: { kind: "centrally-sponsored" },
    groups: ["sc"],
    stages: ["college"],
    needs: ["education"],
    apply: NSP,
  },
  {
    id: "pre-matric-sc",
    title: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others",
    url: `${DOSJE}/pre-matric-scholarships-scheme-for-scheduled-castes-others/`,
    forWhom:
      "Children of Scheduled Caste and other disadvantaged families studying at the pre-matric stage.",
    provides:
      "A scholarship that supports parents with school education and reduces drop-out.",
    runBy: "State Governments and Union Territories",
    jurisdiction: { kind: "centrally-sponsored" },
    groups: ["sc"],
    stages: ["school"],
    needs: ["education"],
    apply: NSP,
  },
  {
    id: "top-class-sc",
    title: "Central Sector Scholarship of Top Class Education for SC Students",
    url: `${DOSJE}/central-sector-scholarship-of-top-class-education-for-sc-students/`,
    forWhom:
      "Scheduled Caste students pursuing studies beyond Class XII at notified institutions.",
    provides:
      "Financial support for fees and allowances at premier institutions.",
    jurisdiction: { kind: "central-sector" },
    groups: ["sc"],
    stages: ["college"],
    needs: ["education"],
    apply: NSP,
  },
  {
    id: "nos",
    title: "National Overseas Scholarship (NOS) for SC etc. Candidates",
    url: `${DOSJE}/national-overseas-scholarship-nos-for-sc-etc-candidates/`,
    forWhom:
      "Low-income meritorious students from Scheduled Castes, De-notified Nomadic and Semi-Nomadic Tribes, landless agricultural labourers and traditional artisans.",
    provides:
      "A Master's degree or Ph.D abroad: tuition, maintenance and contingency allowances.",
    jurisdiction: { kind: "central-sector" },
    groups: ["sc", "dnt"],
    stages: ["college"],
    needs: ["education"],
    apply: {
      label: "NOS Portal",
      href: "https://nosmsje.gov.in/",
      kind: "portal",
    },
  },
  {
    id: "nf-sc",
    title: "National Fellowship for Scheduled Caste Students",
    url: `${DOSJE}/national-fellowship-for-scheduled-caste-students/`,
    forWhom: "Scheduled Caste students registered for an M.Phil or Ph.D.",
    provides: "Junior and senior research fellowships.",
    runBy: "NSFDC",
    jurisdiction: { kind: "central-sector" },
    groups: ["sc"],
    stages: ["college"],
    needs: ["education"],
    apply: {
      label: "NSFDC",
      href: "https://nsfdc.nic.in/en/national-fellowship-for-scheduled-castes-students-nfsc",
      kind: "portal",
    },
  },
  {
    id: "shreshta",
    title:
      "Scheme for Residential Education for Students in High Schools in Targeted Areas (SHRESHTA)",
    url: `${DOSJE}/scheme-for-residential-education-for-students-in-high-schools-in-targeted-areas-shreshta/`,
    forWhom:
      "Scheduled Caste students, through residential schools run with voluntary organisations and training institutions of repute.",
    provides:
      "Residential education and hostel places; no fee is charged to admitted students.",
    jurisdiction: { kind: "central-sector" },
    groups: ["sc", "vo"],
    stages: ["school"],
    needs: ["education", "housing"],
  },
  {
    id: "free-coaching",
    title:
      "Free Coaching for SCs, OBCs and Beneficiaries of PM CARES Children Scheme",
    url: `${DOSJE}/free-coaching-for-scs-obcs-and-beneficiaries-of-pm-cares-children-scheme/`,
    forWhom:
      "Economically disadvantaged Scheduled Caste and Other Backward Class candidates, and PM CARES children, preparing for competitive examinations.",
    provides:
      "Good-quality coaching for competitive examinations and for entrance to technical and professional institutions.",
    runBy: "Dr. Ambedkar Foundation",
    jurisdiction: { kind: "central-sector" },
    groups: ["sc", "obc"],
    stages: ["college", "working"],
    needs: ["education", "skills"],
  },
  {
    id: "medical-aid",
    title: "Dr. Ambedkar Medical Aid Scheme",
    url: `${DOSJE}/dr-ambedkar-medical-aid-scheme/`,
    forWhom:
      "Scheduled Caste and Scheduled Tribe patients with serious ailments, where family income is not more than ₹5 lakh a year.",
    provides:
      "Medical aid grants for surgery of the kidney, heart, liver, brain, for cancer and for other life-threatening conditions.",
    runBy: "Dr. Ambedkar Foundation",
    jurisdiction: { kind: "central-sector" },
    groups: ["sc"],
    stages: ALL_STAGES,
    needs: ["care"],
  },
  {
    id: "pm-ajay",
    title: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)",
    url: `${DOSJE}/pradhan-mantri-anusuchit-jaati-abhyuday-yojna-pm-ajay/`,
    forWhom:
      "Scheduled Caste communities, and villages where Scheduled Castes are the majority.",
    provides:
      "Development of Adarsh Gram villages, grants-in-aid for livelihood projects and hostels, and skill development.",
    runBy: "State Governments",
    jurisdiction: { kind: "centrally-sponsored" },
    groups: ["sc"],
    stages: ["working"],
    needs: ["housing", "skills", "finance"],
    apply: {
      label: "PM-AJAY Portal",
      href: "https://pmajay.dosje.gov.in/",
      kind: "portal",
    },
  },
  {
    id: "cegs",
    title: "Credit Enhancement Guarantee Scheme for the Scheduled Castes",
    url: `${DOSJE}/credit-enhancement-guarantee-scheme-for-the-scheduled-castes-scs/`,
    forWhom:
      "Scheduled Caste entrepreneurs seeking credit from banks to build a business.",
    provides:
      "A guarantee to lending banks, so that enterprises owned by Scheduled Castes can borrow.",
    jurisdiction: { kind: "central-sector" },
    groups: ["sc"],
    stages: ["working"],
    needs: ["finance"],
  },
  {
    id: "pcr-poa",
    title:
      "Centrally Sponsored Scheme for Implementation of the Protection of Civil Rights Act, 1955 and the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    url: `${DOSJE}/centrally-sponsored-scheme-for-implementation-of-the-protection-of-civil-rights-act-1955-and-the-scheduled-castes-and-the-scheduled-tribes-prevention-of-atrocities-act-1989/`,
    forWhom:
      "Victims of untouchability and of atrocities, as the two Acts define them.",
    provides:
      "Relief and rehabilitation for victims, enforcement machinery through the States, and the incentive for inter-caste marriage merged into it.",
    runBy: "State Governments",
    jurisdiction: { kind: "centrally-sponsored" },
    groups: ["sc"],
    stages: ALL_STAGES,
    needs: ["legal"],
  },
  {
    id: "nsfdc-term-loan",
    title: "NSFDC Term Loan",
    url: `${DOSJE}/2998/`,
    forWhom:
      "Scheduled Caste beneficiaries, through State Channelising Agencies.",
    provides:
      "Loans of up to 90% of project cost for units costing up to ₹50 lakh, at 8% a year.",
    runBy: "NSFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["sc"],
    stages: ["working"],
    needs: ["finance"],
    apply: NSFDC,
  },
  {
    id: "aajeevika",
    title: "Aajeevika Microfinance Yojana",
    url: `${DOSJE}/aajeevika-microfinance-yojana/`,
    forWhom:
      "Scheduled Caste persons pursuing small or micro business activities.",
    provides:
      "Micro finance of up to ₹1.25 lakh through NBFC-MFIs, for projects costing up to ₹1.40 lakh.",
    runBy: "NSFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["sc"],
    stages: ["working"],
    needs: ["finance"],
    apply: NSFDC,
  },
  {
    id: "nsfdc-els",
    title: "Educational Loan Scheme (ELS)",
    url: `${DOSJE}/educational-loan-schemeels/`,
    forWhom:
      "Scheduled Caste students in professional and technical courses, in India or abroad.",
    provides:
      "A loan of up to ₹40 lakh or 90% of course fee, whichever is less, at 6.5% a year.",
    runBy: "NSFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["sc"],
    stages: ["college"],
    needs: ["education", "finance"],
    apply: NSFDC,
  },

  /* ── Other Backward Classes ───────────────────────────────────────────── */
  {
    id: "pm-yasasvi",
    title:
      "PM Young Achievers Scholarship Award Scheme for Vibrant India (PM-YASASVI)",
    url: `${DOSJE}/pm-young-achievers-scholarship-award-scheme-for-vibrant-india-for-obcs-and-others-pm-yasasvi/`,
    forWhom:
      "OBC, EBC and DNT students where total family income is below ₹2.5 lakh a year.",
    provides:
      "Five sub-schemes: pre-matric and post-matric scholarships, top-class school and college education, and hostels.",
    jurisdiction: { kind: "central-sector" },
    groups: ["obc", "dnt"],
    stages: ["school", "college"],
    needs: ["education", "housing"],
    apply: NSP,
  },
  {
    id: "top-class-obc",
    title: "Top Class Education in College for OBC, EBC and DNT Students",
    url: `${DOSJE}/top-class-education-in-colllege-for-obc-ebc-and-dnt-students/`,
    forWhom:
      "OBC, EBC and DNT students admitted to listed colleges, where family income is below ₹2.5 lakh a year; 30% of places are reserved for girls.",
    provides: "Tuition, hostel and other charges at notified institutions.",
    jurisdiction: { kind: "central-sector" },
    groups: ["obc", "dnt"],
    stages: ["college"],
    needs: ["education"],
    apply: NSP,
  },
  {
    id: "nf-obc",
    title: "National Fellowship for OBC Students (NF-OBC)",
    url: `${DOSJE}/national-fellowship-for-obc-students-nf-obc/`,
    forWhom: "Other Backward Class students pursuing an M.Phil or Ph.D.",
    provides: "300 junior and 300 senior research fellowships a year.",
    jurisdiction: { kind: "central-sector" },
    groups: ["obc"],
    stages: ["college"],
    needs: ["education"],
  },
  {
    id: "obc-hostels",
    title: "Construction of Hostels for OBC Boys and Girls",
    url: `${DOSJE}/construction-of-hostels-for-obc-boys-and-girls/`,
    forWhom:
      "Students of socially and educationally backward classes, especially from rural areas, in secondary and higher education.",
    provides:
      "Hostel places, built at ₹3 lakh a seat and ₹3.5 lakh in the North-Eastern and Himalayan regions.",
    runBy: "State Governments",
    jurisdiction: { kind: "centrally-sponsored" },
    groups: ["obc"],
    stages: ["school", "college"],
    needs: ["education", "housing"],
  },
  {
    id: "interest-subsidy-obc",
    title:
      "Dr. Ambedkar Scheme of Interest Subsidy on Educational Loan for Overseas Studies for OBCs & EBCs",
    url: `${DOSJE}/dr-ambedkar-scheme-of-interest-subsidy-on-educational-loan-for-overseas-studies-for-obcs-ebcs/`,
    forWhom:
      "OBC and EBC students who have taken an education loan for study abroad.",
    provides: "An interest subsidy on the education loan.",
    jurisdiction: { kind: "central-sector" },
    groups: ["obc"],
    stages: ["college"],
    needs: ["education", "finance"],
  },
  {
    id: "nbcfdc-individual-loan",
    title: "Individual Loan Scheme",
    url: `${DOSJE}/individual-loan-scheme/`,
    forWhom:
      "Backward Class persons, through the Corporation's channel partners.",
    provides:
      "Term loans for income-generating activities with the potential to provide a livelihood.",
    runBy: "NBCFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["obc"],
    stages: ["working"],
    needs: ["finance"],
    apply: { label: "NBCFDC", href: "https://nbcfdc.gov.in/", kind: "portal" },
  },

  /* ── De-notified, Nomadic and Semi-Nomadic Tribes ─────────────────────── */
  {
    id: "seed-coaching",
    title: "SEED – Free Coaching",
    url: `${DOSJE}/seed-free-coaching/`,
    forWhom:
      "DNT students with family income below ₹8 lakh a year who hold the minimum marks required to sit the examination.",
    provides: "Free coaching for entrance and competitive examinations.",
    jurisdiction: { kind: "central-sector" },
    groups: ["dnt"],
    stages: ["school", "college"],
    needs: ["education"],
  },
  {
    id: "seed-health",
    title: "SEED – Health Insurance",
    url: `${DOSJE}/seed-health-insurance/`,
    forWhom:
      "Members of DNT communities who meet the criteria of the Ayushman Bharat scheme.",
    provides:
      "Annual health insurance cover of ₹5 lakh, free of cost, through registration under Ayushman Bharat.",
    jurisdiction: { kind: "central-sector" },
    groups: ["dnt"],
    stages: ALL_STAGES,
    needs: ["care"],
  },
  {
    id: "seed-livelihood",
    title: "SEED – Livelihood",
    url: `${DOSJE}/seed-livelihood/`,
    forWhom: "DNT persons living in villages and rural areas.",
    provides:
      "Livelihood support through the National Rural and Urban Livelihood Missions.",
    jurisdiction: { kind: "central-sector" },
    groups: ["dnt"],
    stages: ["working"],
    needs: ["finance", "skills"],
  },
  {
    id: "seed-housing",
    title: "SEED – Housing",
    url: `${DOSJE}/seed-housing/`,
    forWhom: "DNT persons seeking support to build a house.",
    provides: "Housing support through the Pradhan Mantri Awas Yojana.",
    jurisdiction: { kind: "central-sector" },
    groups: ["dnt"],
    stages: ["working", "senior"],
    needs: ["housing"],
  },

  /* ── Safai Karamcharis ────────────────────────────────────────────────── */
  {
    id: "namaste",
    title: "National Action for Mechanised Sanitation Ecosystem (NAMASTE)",
    url: `${DOSJE}/national-action-for-mechanised-sanitation-ecosystem-namaste/`,
    forWhom: "Sewer and septic-tank workers and, from 2024-25, waste pickers.",
    provides:
      "Profiling, training and certification in safe cleaning, safety equipment, and capital subsidy for sanitation vehicles.",
    runBy: "NSKFDC, with the Ministry of Housing and Urban Affairs",
    jurisdiction: { kind: "central-sector" },
    groups: ["safai"],
    stages: ["working"],
    needs: ["skills", "care", "finance"],
    apply: {
      label: "NAMASTE Portal",
      href: "https://bmsnamaste.dosje.gov.in/",
      kind: "portal",
    },
  },
  {
    id: "srms",
    title:
      "Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS)",
    url: `${DOSJE}/self-employment-scheme-for-rehabilitation-of-manual-scavengers-srms-applicable-from-november-2013-3/`,
    forWhom: "Identified manual scavengers and their dependants.",
    provides:
      "Rehabilitation through self-employment, applicable from November 2013.",
    runBy: "NSKFDC",
    jurisdiction: { kind: "central-sector" },
    groups: ["safai"],
    stages: ["working"],
    needs: ["finance", "skills"],
    apply: NSKFDC,
  },
  {
    id: "pre-matric-cleaning",
    title:
      "Pre-Matric Scholarship to the Children of Those Engaged in Occupations Involving Cleaning and Prone to Health Hazards",
    url: `${DOSJE}/10663/`,
    forWhom:
      "School-going children whose parents are engaged in cleaning occupations prone to health hazards.",
    provides: "A pre-matric scholarship.",
    jurisdiction: { kind: "centrally-sponsored" },
    groups: ["safai"],
    stages: ["school"],
    needs: ["education"],
    apply: NSP,
  },
  {
    id: "suy",
    title: "Swachhta Udyami Yojana (SUY)",
    url: `${DOSJE}/swachhta-udyami-yojana-suy/`,
    forWhom: "Safai Karamcharis, manual scavengers and their dependants.",
    provides:
      "Financial assistance to procure and operate sanitation-related vehicles.",
    runBy: "NSKFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["safai"],
    stages: ["working"],
    needs: ["finance"],
    apply: NSKFDC,
  },
  {
    id: "may",
    title: "Mahila Adhikarita Yojana (MAY)",
    url: `${DOSJE}/mahila-adhikarita-yojana-may/`,
    forWhom:
      "Women Safai Karamcharis and scavengers, and their dependent daughters.",
    provides:
      "Loans of up to ₹2 lakh for small trade and income-generating activities, through State Channelising Agencies and banks.",
    runBy: "NSKFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["safai"],
    stages: ["working"],
    needs: ["finance"],
    apply: NSKFDC,
  },
  {
    id: "nskfdc-el",
    title: "Education Loan (EL)",
    url: `${DOSJE}/education-loan-el/`,
    forWhom:
      "Students from Safai Karamchari and manual scavenger families pursuing professional or technical education at graduation level and above.",
    provides:
      "An education loan for medical, engineering, management, law, IT and other graduation courses.",
    runBy: "NSKFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["safai"],
    stages: ["college"],
    needs: ["education", "finance"],
    apply: NSKFDC,
  },
  {
    id: "sanitary-marts",
    title: "Sanitary Marts Scheme",
    url: `${DOSJE}/sanitary-marts-scheme/`,
    forWhom:
      "Liberated manual scavengers, Safai Karamcharis and their dependants, individually or as self-help groups.",
    provides:
      "Financial assistance to set up a sanitary mart: a shop and service centre for sanitation and hygiene.",
    runBy: "NSKFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["safai"],
    stages: ["working"],
    needs: ["finance"],
    apply: NSKFDC,
  },

  /* ── Senior Citizens ──────────────────────────────────────────────────── */
  {
    id: "avyay",
    title: "Atal Vayo Abhyuday Yojana (AVYAY)",
    url: `${DOSJE}/atal-vayo-abhyuday-yojana-avyay/`,
    forWhom:
      "Senior citizens, particularly the destitute elderly, through implementing agencies.",
    provides:
      "Shelter, food, medical care and opportunities for active ageing, with support to States, local bodies and voluntary organisations.",
    runBy: "State Governments, local bodies and voluntary organisations",
    jurisdiction: { kind: "central-sector" },
    groups: ["senior", "vo"],
    stages: ["senior"],
    needs: ["care", "housing"],
  },
  {
    id: "rvy",
    title: "Rashtriya Vayoshri Yojana (RVY)",
    url: `${DOSJE}/rashtriya-vayoshri-yojana-rvy/`,
    forWhom:
      "Senior citizens in the BPL category, or with monthly income of not more than ₹15,000, who have an age-related infirmity.",
    provides:
      "Free assisted-living devices: walking sticks, crutches, walkers, hearing aids, wheelchairs, dentures and spectacles.",
    runBy: "ALIMCO",
    jurisdiction: { kind: "central-sector" },
    groups: ["senior"],
    stages: ["senior"],
    needs: ["care"],
  },
  {
    id: "elderline",
    title: "Elderline",
    url: `${DOSJE}/elderline/`,
    forWhom: "Senior citizens, and those caring for them.",
    provides:
      "A toll-free national helpline, 8 AM to 8 PM every day: information, guidance, emotional support, field intervention and rescue.",
    jurisdiction: { kind: "central-sector" },
    groups: ["senior"],
    stages: ["senior"],
    needs: ["care", "legal"],
    apply: { label: "Call 14567", href: "tel:14567", kind: "phone" },
  },

  /* ── Transgender Persons ──────────────────────────────────────────────── */
  {
    id: "smile",
    title:
      "Support for Marginalised Individuals for Livelihood and Enterprise (SMILE)",
    url: `${DOSJE}/support-for-marginalized-individuals-for-livelihood-and-enterprise-smile/`,
    forWhom:
      "Transgender persons, and persons engaged in the act of begging, under two sub-schemes.",
    provides:
      "Comprehensive rehabilitation: identity, welfare and livelihood measures under the umbrella scheme.",
    jurisdiction: { kind: "central-sector" },
    groups: ["tg"],
    stages: ["school", "college", "working"],
    needs: ["care", "housing", "skills"],
    apply: {
      label: "National Portal for Transgender Persons",
      href: "https://transgender.dosje.gov.in/",
      kind: "portal",
    },
  },

  /* ── Substance use ────────────────────────────────────────────────────── */
  {
    id: "napddr",
    title: "National Action Plan for Drug Demand Reduction",
    url: `${DOSJE}/national-action-plan-for-drug-demand-reduction/`,
    forWhom:
      "Persons affected by alcohol and substance use, their families, and the voluntary organisations that serve them.",
    provides:
      "Treatment and counselling through Integrated Rehabilitation Centres for Addicts, and assistance to voluntary organisations for prevention.",
    jurisdiction: { kind: "central-sector" },
    groups: ["substance", "vo"],
    stages: ALL_STAGES,
    needs: ["care"],
    apply: { label: "Call 14446", href: "tel:14446", kind: "phone" },
  },

  /* ── Voluntary organisations ──────────────────────────────────────────── */
  {
    id: "e-anudaan",
    title: "Grant-in-Aid to Voluntary Organisations (e-Anudaan)",
    url: "https://grants-msje.gov.in/",
    forWhom:
      "Registered voluntary organisations running projects under the Department's grant-in-aid schemes.",
    provides:
      "Grants-in-aid, applied for and monitored through the e-Anudaan portal.",
    jurisdiction: { kind: "central-sector" },
    groups: ["vo"],
    stages: ["working"],
    needs: ["finance"],
    apply: {
      label: "e-Anudaan",
      href: "https://grants-msje.gov.in/",
      kind: "portal",
    },
  },
  {
    id: "nbcfdc-skill",
    title: "Assistance for Skill Development of OBCs/DNTs/EBCs",
    url: `${DOSJE}/assistance-for-skill-development-of-obcs-dnts-ebcs/`,
    forWhom:
      "NGOs seeking grants from NBCFDC to run skill training for OBC, DNT and EBC candidates.",
    provides:
      "90% of the cost of an approved new project, and 75% for organisations already funded.",
    runBy: "NBCFDC",
    jurisdiction: { kind: "corporation" },
    groups: ["vo"],
    stages: ["working"],
    needs: ["skills", "finance"],
    apply: { label: "NBCFDC", href: "https://nbcfdc.gov.in/", kind: "portal" },
  },

  /* ── State schemes in the catalogue ───────────────────────────────────── */
  {
    id: "mh-savitribai",
    title: "Savitribai Phule Scholarship for VJNT and SBC Girl Students",
    url: `${DOSJE}/savitribai-phule-scholarship-for-vjnt-and-sbc-girl-students/`,
    forWhom:
      "Girl students of VJNT and SBC communities in Classes V to X; there is no income limit.",
    provides:
      "₹60 a month in Classes V to VII and ₹100 a month in Classes VIII to X, for ten months.",
    runBy: "District Social Welfare Office, through the school",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["school"],
    needs: ["education"],
  },
  {
    id: "mh-meritorious",
    title:
      "Meritorious Scholarships to VJNT and SBC Students Studying in Secondary Schools",
    url: `${DOSJE}/meritorious-scholarships-to-vjnt-and-sbc-students-studying-in-secondary-schools/`,
    forWhom:
      "VJNT and SBC students in Classes V to X who stood first or second with more than 50% marks.",
    provides:
      "₹200 a year in Classes V to VII and ₹400 a year in Classes VIII to X.",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["school"],
    needs: ["education"],
  },
  {
    id: "mh-tuition",
    title:
      "Tuition Fees and Examination Fees for VJNT/SBC Students Studying in High Schools",
    url: `${DOSJE}/tuition-fees-and-examination-fees-for-vjnt-sbc-students-studying-in-high-schools/`,
    forWhom:
      "VJNT and SBC students in Classes IX to XII at recognised high schools; no age or income limit.",
    provides: "Tuition, examination, laboratory and library fees.",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["school"],
    needs: ["education"],
  },
  {
    id: "mh-shahu",
    title: "Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship",
    url: `${DOSJE}/rajarshi-chhatrapati-shahu-maharaj-merit-scholarship/`,
    forWhom:
      "VJNT and SBC students in Classes XI and XII who scored 75% or more in Class X.",
    provides: "₹300 a month for ten months.",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["school"],
    needs: ["education"],
  },
  {
    id: "mh-iti-stipend",
    title: "Award of Stipend to VJNT and SBC Students Studying in ITI",
    url: `${DOSJE}/award-of-stipend-to-vjnt-and-sbc-students-studying-in-iti/`,
    forWhom:
      "VJNT and SBC trainees at approved ITIs, where annual family income is ₹2.5 lakh or less.",
    provides:
      "A maintenance allowance of ₹40 to ₹100 a month for ten months, paid through the ITI.",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["school"],
    needs: ["education", "skills"],
  },
  {
    id: "mh-professional",
    title:
      "Maintenance Allowance to VJNT and SBC Students in Professional Courses",
    url: `${DOSJE}/payment-of-maintenance-allowance-to-vjnt-and-sbc-students-studying-in-professional-courses-and-living-in-hostel-attached-to-professional-colleges/`,
    forWhom:
      "VJNT and SBC students in professional courses who live in the college hostel.",
    provides:
      "₹500 to ₹700 a month by course category, paid through the college principal.",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["college"],
    needs: ["education"],
  },
  {
    id: "mh-hostel",
    title: "Vimukt Jati Hostel Scheme",
    url: `${DOSJE}/vimukt-jati-hostel-scheme/`,
    forWhom:
      "Students of de-notified, nomadic and semi-nomadic tribes studying away from home.",
    provides:
      "Hostel and ashram places, with ₹1,230 a month for boys and ₹1,270 for girls, for ten months.",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["school", "college"],
    needs: ["education", "housing"],
  },
  {
    id: "mh-driving",
    title: "Training of Motor Driving to VJNT, SBC & OBCs",
    url: `${DOSJE}/training-of-motor-driving-to-vjnt-sbc-obcs/`,
    forWhom:
      "VJNT, SBC and OBC candidates who may drive under the Motor Vehicles Act.",
    provides:
      "Light and heavy motor driving and conductor training, with lodging, boarding and licence fees paid.",
    runBy: "Approved motor driving schools, Government of Maharashtra",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt", "obc"],
    stages: ["working"],
    needs: ["skills"],
  },
  {
    id: "mh-iti-vocational",
    title:
      "Vocational Training for VJNT and SBC Candidates Studying in Government ITIs",
    url: `${DOSJE}/vocational-training-for-vjnt-and-sbc-candidates-studying-in-government-industrial-training-institute/`,
    forWhom:
      "VJNT and SBC students at Government ITIs, selected by the Principal.",
    provides:
      "Training fees of ₹400 to ₹2,400 paid to the ITI, and a ₹1,000 tool kit on completion.",
    jurisdiction: { kind: "state", state: "Maharashtra" },
    groups: ["dnt"],
    stages: ["school", "working"],
    needs: ["skills"],
  },
  {
    id: "mp-swarozgar",
    title: "Mukhyamantri Vimukt, Ghumantu and Ardhghumantu Swarozgar Yojana",
    url: `${DOSJE}/mukhyamantri-vimukt-ghumantu-and-ardhghumantu-swarozgar-yojana-cm-self-employment-scheme/`,
    forWhom:
      "Natives of Madhya Pradesh from De-notified, Nomadic and Semi-Nomadic communities, aged 18 to 35.",
    provides:
      "Self-employment loans through the State's self-employment portals.",
    jurisdiction: { kind: "state", state: "Madhya Pradesh" },
    groups: ["dnt"],
    stages: ["working"],
    needs: ["finance"],
  },
];

export interface Answers {
  group?: GroupId;
  stage?: StageId;
  need?: NeedId;
  state?: string;
}

/**
 * The one expression every part of the results reads (`data-state-completeness.md` §2).
 *
 * An unanswered axis does not filter — skipping widens the answer rather than
 * ending it. A State scheme appears only for its own State; Central and
 * Corporation schemes appear for every State, and for no State chosen.
 */
export function matchSchemes(a: Answers): Scheme[] {
  return SCHEMES.filter((s) => {
    if (a.group && !s.groups.includes(a.group)) return false;
    if (a.stage && !s.stages.includes(a.stage)) return false;
    if (a.need && !s.needs.includes(a.need)) return false;
    if (s.jurisdiction.kind === "state" && s.jurisdiction.state !== a.state)
      return false;
    return true;
  });
}

export const JURISDICTION_LABEL: Record<Jurisdiction["kind"], string> = {
  "central-sector": "Central Sector",
  "centrally-sponsored": "Centrally Sponsored",
  corporation: "Corporation Loan",
  state: "State Scheme",
};

export const DEPWD = {
  name: "Department of Empowerment of Persons with Disabilities",
  href: "https://depwd.gov.in/",
};
