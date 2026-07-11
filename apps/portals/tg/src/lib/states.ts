/** States + a few districts each — the subset seen across the live TG captures,
 *  enough to drive realistic filters and the apply-wizard address step. */
export const STATE_DISTRICTS: Record<string, string[]> = {
  "Uttar Pradesh": ["Ghaziabad", "Kanpur Nagar", "Noida", "Lucknow"],
  Karnataka: ["Ballari", "Bengaluru Urban", "Mysuru"],
  Gujarat: ["Ahmedabad", "Amreli", "Surat"],
  Maharashtra: ["Ahmednagar", "Mumbai", "Pune"],
  "Arunachal Pradesh": ["Changlang", "Papum Pare"],
  Chandigarh: ["Chandigarh"],
  "Andhra Pradesh": ["Visakhapatnam", "Guntur"],
  Uttarakhand: ["Dehradun", "Haridwar"],
};

export const STATES = Object.keys(STATE_DISTRICTS);

/** State code for certificate/reference numbers. */
export const STATE_CODES: Record<string, string> = {
  "Uttar Pradesh": "UP",
  Karnataka: "KA",
  Gujarat: "GJ",
  Maharashtra: "MH",
  "Arunachal Pradesh": "AR",
  Chandigarh: "CH",
  "Andhra Pradesh": "AP",
  Uttarakhand: "UK",
};

export const EDUCATION_LEVELS = [
  "Illiterate",
  "Primary",
  "Secondary",
  "Higher Secondary",
  "Graduate",
  "Post Graduate",
] as const;

export const CASTE_CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;

export const INCOME_BANDS = [
  "Below 1 Lakh",
  "1–3 Lakh",
  "3–5 Lakh",
  "Above 5 Lakh",
] as const;

export const ID_PROOF_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Voter ID",
  "Passport",
  "Driving Licence",
] as const;

export const GRIEVANCE_CATEGORIES = [
  "Application Delay",
  "Document Rejection",
  "Certificate Error",
  "Welfare Scheme",
  "Other",
] as const;
