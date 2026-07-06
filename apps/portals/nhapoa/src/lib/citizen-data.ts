/**
 * Citizen-facing content for the SAMBAL (formerly NHAA) public flows.
 *
 * Sourced from the live capture (tools/design-audit/projects/nhapoa/captures):
 * grievance types, submission roles, rescue fields, and FAQ questions are verbatim
 * from the live portal. Grievance categories use the statutory SC/ST (Prevention of
 * Atrocities) Act Section 3 offence list (the live category master loads async and
 * was not captured in full); the confirmed captured category is included. Reconcile
 * against the live /admin/categories master when that async capture is completed.
 */

export const GRIEVANCE_TYPES = ["FIR", "Relief", "Charge Sheet", "Corruption"] as const;

export const SUBMISSION_ROLES = [
  {
    id: "Informer",
    label: "As an Informer",
    desc: "Reporting on behalf of another person or public interest",
  },
  {
    id: "Victim",
    label: "As a Victim",
    desc: "Directly affected and filing on your own behalf",
  },
  {
    id: "NGO",
    label: "As an NGO",
    desc: "Organisation filing for one or more beneficiaries",
  },
] as const;

/** Statutory PoA Act Section 3 offence categories (real legal content). */
export const GRIEVANCE_CATEGORIES = [
  "Abusing by caste name in any place within public view",
  "Forcing to eat or drink any inedible or obnoxious substance",
  "Dumping excreta, waste, or carcasses in premises or neighbourhood",
  "Garlanding with footwear or parading naked or semi-naked",
  "Wrongful occupation or cultivation of land",
  "Interfering with rights over land, premises, or water",
  "Social or economic boycott",
  "Preventing use of a public place or common water source",
  "Denial of access to public services or places",
  "Intimidating or obstructing the right to vote",
  "Instituting false or malicious legal proceedings",
  "Assault or use of force on a woman with intent to dishonour",
];

export const RESCUE_GENDERS = ["Male", "Female", "LGBTQIA+", "Other"] as const;

export const FAQ_CATEGORIES = ["All", "Submission", "Tracking", "Documents", "SLA & Timelines"] as const;

export interface Faq {
  q: string;
  a: string;
  cat: (typeof FAQ_CATEGORIES)[number];
}

/** Questions are verbatim from the live Help & FAQs capture; answers summarise the
 *  PoA grievance process (live answers were collapsed in capture — verify against live). */
export const FAQS: Faq[] = [
  {
    q: "What is SAMBAL (NHAA)?",
    a: "SAMBAL, the National Helpline Against Atrocities, is an initiative of the Ministry of Social Justice & Empowerment to register, track, and resolve grievances of atrocities against Scheduled Castes and Scheduled Tribes under the PoA Act, and to disburse relief.",
    cat: "Submission",
  },
  {
    q: "Who can use SAMBAL?",
    a: "Any affected person (victim), anyone reporting on their behalf (informer), or an NGO filing for one or more beneficiaries can register a grievance. Identity is verified by mobile OTP.",
    cat: "Submission",
  },
  {
    q: "What types of atrocities can be reported?",
    a: "Offences listed under Section 3 of the SC/ST (Prevention of Atrocities) Act — caste-based abuse, social or economic boycott, wrongful dispossession of land, denial of access to public places or water, assault, and related offences.",
    cat: "Submission",
  },
  {
    q: "What is the SAMBAL helpline number?",
    a: "The 24×7 toll-free helpline is 14566 (and 1800-202-1989). It is confidential and available in regional languages.",
    cat: "Submission",
  },
  {
    q: "How can I track my grievance?",
    a: "Use Track Status with your Reference ID and the registered mobile number. A one-time password is sent to that number, after which you can view the full case timeline.",
    cat: "Tracking",
  },
  {
    q: "What documents are needed to register a grievance?",
    a: "Any supporting evidence — a copy of the FIR (if registered), photographs, medical or incident reports, and identity proof. Documents are optional at submission but strengthen the case.",
    cat: "Documents",
  },
  {
    q: "What is the maximum file size for uploads?",
    a: "Each supporting document may be up to 5 MB. Accepted formats include PDF, JPG, and PNG.",
    cat: "Documents",
  },
  {
    q: "What is the SLA for grievance closure?",
    a: "Each grievance category carries a defined service-level window across investigation, approval, and disbursement. The applicable SLA is shown on your case timeline.",
    cat: "SLA & Timelines",
  },
  {
    q: "What happens if the SLA is breached?",
    a: "A breached SLA is escalated to the next authority (State Authority / Central Authority) and flagged on the SLA monitor for priority action.",
    cat: "SLA & Timelines",
  },
  {
    q: "How do I respond to a clarification request?",
    a: "If an officer raises a clarification, you receive a notification. Open the case from Track Status and submit the requested details or documents within the stated window.",
    cat: "Tracking",
  },
];
