/**
 * The answers the demo dock types into a grant application — ONE applicant, told consistently.
 *
 * Before this, every free-text answer read `Illustrative response for "Project Location (full
 * address, PIN, landmark)", entered by the SAMAVESH prototype demo tools.`, every count was 12 (a
 * 12 sq ft home with 12 rooms), and a Pune society's project sat in the Andaman and Nicobar Islands
 * because State took the first option in the list. A reviewer reading the Review page read the demo
 * tooling, not an application.
 *
 * The applicant is the prototype's demo NGO, Sankalp Seva Sansthan of Pune. Every name, address,
 * number and account below is invented and resolves to nobody: mobiles are in the 98000 00xxx
 * range, the IFSC is SBI's documented sample branch code, the PAN's check letter is valid in shape
 * only. The sample documents (`tools/e-anudaan-samples/subjects.mjs`) tell the same story, so a
 * document placed from the dock agrees with the answers it is checked against.
 */

import type { FieldDef } from "./form-schema.ts";

export const DEMO_APPLICANT = {
  name: "Sankalp Seva Sansthan",
  state: "Maharashtra",
  district: "Pune",
  city: "Pune",
  address: "Plot 7, Sai Vihar Society, Magarpatta Road, Hadapsar, Pune, Maharashtra 411028",
  projectAddress: "Sankalp Seniors' Home, Survey No. 42, Near Hadapsar Gaon Bus Stop, Hadapsar, Pune, Maharashtra 411028",
  pin: "411028",
  email: "office@sankalpseva.example.org",
  website: "https://sankalpseva.example.org",
  mobile: "9800000101",
  telephone: "020 2699 0101",
  bank: "State Bank of India",
  branch: "Hadapsar, Pune",
  ifsc: "SBIN0000001",
  micr: "411002045",
  account: "123456789012",
  pan: "AAATS0000A",
} as const;

/** People, by the role their field names. Mobiles are consecutive so each person has their own. */
const PEOPLE: ReadonlyArray<readonly [RegExp, string, string]> = [
  [/auth_person|head_/, "Sunita Deshpande", "Secretary"],
  [/incharge|site_incharge/, "Anil Kulkarni", "Superintendent"],
  [/key_staff_1|key_person_1|functionary_1/, "Meera Joshi", "Counsellor"],
  [/key_staff_2/, "Prakash Rane", "Nurse"],
  [/ddac_chief/, "Dr Rajesh Sharma", "Chief Functionary"],
  [/project_director/, "Dr Rajesh Sharma", "Project Director"],
  [/project_manager/, "Kavita Patil", "Project Manager"],
  [/counsellor/, "Meera Joshi", "Counsellor"],
  [/doctor/, "Dr Sameer Gokhale", "Doctor"],
  [/accountant/, "Rohit Jadhav", "Accountant"],
  [/bridge_coordinator/, "Asha Pawar", "Coordinator"],
  [/cook/, "Lata Shinde", "Cook"],
  [/sweeper/, "Ganesh Kamble", "Sweeper"],
  [/multi_task/, "Vijay More", "Multi-Task Worker"],
  [/watchman_1/, "Santosh Gaikwad", "Watchman"],
  [/watchman_2/, "Ravi Salunkhe", "Watchman"],
  [/watchman_3/, "Mahesh Chavan", "Watchman"],
];

const MOBILES: ReadonlyArray<readonly [RegExp, string]> = [
  [/auth_person|head_/, "9800000102"],
  [/incharge/, "9800000103"],
  [/key_staff_1|key_person_1|functionary_1/, "9800000104"],
  [/key_staff_2/, "9800000105"],
  [/ddac_chief/, "9800000106"],
];

/** Answers by field name — the ones a pattern would get wrong. */
const BY_NAME: Readonly<Record<string, string>> = {
  fld_reg_office_address: DEMO_APPLICANT.address,
  fld_head_address: DEMO_APPLICANT.address,
  fld_key_person_1_address: "Flat 12, Shanti Apartments, Hadapsar, Pune 411028",
  fld_project_location: DEMO_APPLICANT.projectAddress,
  fld_location_address: DEMO_APPLICANT.projectAddress,
  fld_site_address: DEMO_APPLICANT.projectAddress,
  fld_institution_location: `${DEMO_APPLICANT.projectAddress}. Contact 020 2699 0101.`,
  fld_reg_office_city: DEMO_APPLICANT.city,
  fld_reg_office_district: DEMO_APPLICANT.district,
  fld_reg_office_state: DEMO_APPLICANT.state,
  fld_site_city: "Hadapsar, Pune",
  fld_site_landmark: "Near Hadapsar Gaon Bus Stop",
  fld_railway_station_bus_stand: "Hadapsar railway station, 2 km; Hadapsar Gaon bus stop, 200 m",
  fld_auth_place: DEMO_APPLICANT.city,
  fld_bank_name: DEMO_APPLICANT.bank,
  fld_bank_branch: DEMO_APPLICANT.branch,
  fld_bank_rtgs_micr: DEMO_APPLICANT.micr,
  fld_bank_joint_operators: "Sunita Deshpande (Secretary) and Anil Deshpande (Treasurer), Plot 7, Sai Vihar Society, Hadapsar, Pune 411028",
  fld_bank_resource_mobilisation: "Individual donations ₹3,45,000 a year; CSR support from two Pune firms ₹6,00,000 a year.",
  fld_contact_fax: "020 2699 0109",
  fld_website_url: DEMO_APPLICANT.website,
  fld_org_website: DEMO_APPLICANT.website,
  fld_live_feed_url: "https://sankalpseva.example.org/cctv",
  fld_registration_act: "Societies Registration Act, 1860",
  fld_statute_act: "Societies Registration Act, 1860",
  fld_registration_number: "MH/PUN/1860/51-54",
  fld_pfms_code: "MHPU00000001",
  fld_pfms_status: "Registered",
  fld_gia_since_year: "2016-17",
  fld_year_of_commencement_gia: "2016-17",
  fld_name_of_project: "Sankalp Seniors' Home",
  fld_institution_id: "SHR-MH-PUN-0042",
  fld_startup_company_name: "",
  fld_services_available_in_district:
    "Pune district has two homes for indigent senior citizens, at Shivajinagar and Pimpri, together holding 60 residents. Both report waiting lists. No home serves the eastern taluks of Hadapsar, Haveli and Daund, where the District Social Welfare Office recorded 214 destitute senior citizens in its 2025 survey.",
  fld_other_justification:
    "The Society has run a day-care centre for senior citizens at Hadapsar since 2019 and already serves 88 persons who would be eligible for residential care. The building is owned by the Society and needs no rent.",
  fld_org_profile_writeup:
    "Sankalp Seva Sansthan was registered in 2012 and works with senior citizens and persons in recovery in Pune and Satara districts. The proposed home will admit 25 indigent senior citizens from April 2027, with medical care, recreation and daily meals, run by eight staff under the Superintendent.",
  fld_org_area_specialisation: "Care of indigent senior citizens; de-addiction and rehabilitation.",
  fld_org_geographical_coverage: "Pune and Satara districts, Maharashtra.",
  fld_org_govt_projects: "Day-care centre for senior citizens under the State Government's scheme, 2019–2024.",
  fld_org_tg_experience: "Six years of outreach with the transgender community in Pune, including 140 identity certificates facilitated.",
  fld_proj_rehab_strategies: "Skill training in tailoring and beauty services, placement with partner employers, and self-help groups for self-employment.",
  fld_strength_convergence: "Ayushman Bharat health cover for residents; Indira Gandhi National Old Age Pension for eligible residents.",
  fld_managing_committee_note: "Seven members elected for three years; President Dr Rajesh Sharma, Secretary Sunita Deshpande, Treasurer Anil Deshpande.",
  fld_pmc_composition: "Project Director (chair), Superintendent, Counsellor, one resident's representative and one member of the Managing Committee.",
  fld_prior_projects_other: "Vocational training for women, Hadapsar, 2020–2024, 240 trainees, funded by CSR partners.",
  fld_gia_released_last_3yrs: "F.No. 11-22/2023-SM2 dated 14 July 2023, ₹38,40,000 sanctioned, ₹38,40,000 utilised; F.No. 11-22/2024-SM2 dated 2 August 2024, ₹38,40,000 sanctioned, ₹38,40,000 utilised.",
  fld_fcra_80g_details: "80G registration AAATS0000AF20214 valid until 2026-27. Not registered under FCRA.",
  fld_rent_particulars: "Not applicable — the building is owned by the Society.",
  fld_details_of_usages: "Ground floor: dining hall, kitchen, medical room. First floor: four dormitories of six beds, recreation room.",
  fld_counselling_room_details: "One room of 120 sq ft on the ground floor, with a door that closes.",
  fld_hygiene_details: "Cleaned twice a day by two support staff; pest control every quarter.",
  fld_kitchen_details: "One kitchen of 180 sq ft with LPG, a water purifier and separate storage.",
  fld_toilet_details: "Eight toilets and bathrooms, four on each floor, with grab rails.",
  fld_residents_list: "Listed in the uploaded beneficiary list.",
  fld_tg_beneficiaries_details: "Listed in the uploaded beneficiary list.",
  fld_track_nature_of_work: "Residential care for indigent senior citizens.",
  fld_track_coverage: "25 residents a year from Pune district.",
  fld_track_funding: "State Government grant, ₹18,00,000 a year.",
  fld_track_outcome: "District Collector's commendation, 2023.",
  // Counts and areas that must agree with each other and with the cost norms.
  fld_infra_area_sqft: "6400",
  fld_area_of_building_sqm: "595",
  fld_premises_office_area_sqm: "18",
  fld_infra_rooms: "14",
  fld_no_of_rooms: "14",
  fld_no_of_class_rooms: "4",
  fld_infra_toilets: "8",
  fld_no_of_toilets: "8",
  fld_no_of_veranda: "2",
  fld_distance_to_nearest_similar: "18",
  fld_beneficiaries_women: "12",
  fld_beneficiaries_sc: "18",
  fld_beneficiaries_other: "7",
  fld_beneficiaries_prev_year: "88",
  fld_beneficiaries_previous_year: "88",
  fld_sanctioned_capacity: "25",
  fld_strength_outreach_workers: "6",
  fld_strength_tg_rehabilitated: "32",
  fld_proj_tg_id_handheld: "140",
};

/** Options the demo applicant would choose, where the list offers them. Earlier wins. */
const PREFERRED_OPTIONS: readonly string[] = [
  "Maharashtra", "Pune", "Yes", "Functional", "Owned", "Graduate", "Post Graduate",
  "Superintendent", "NGO", "Registered",
];

export function preferredOption(options: readonly string[]): string {
  return PREFERRED_OPTIONS.find((o) => options.includes(o)) ?? options[0] ?? "";
}

/**
 * The demo applicant's answer to one free-text field, or `undefined` where the caller's generic
 * answer is right (a rule-shaped value, a date, a checkbox).
 */
export function demoAnswer(f: FieldDef): string | undefined {
  if (f.name in BY_NAME) return fit(BY_NAME[f.name]!, f);

  if (f.rule === "lettersOnly") {
    const person = PEOPLE.find(([re]) => re.test(f.name));
    if (person) return /designation/.test(f.name) ? person[2] : person[1];
    return /designation/.test(f.name) ? "Superintendent" : "Sunita Deshpande";
  }
  if (f.kind === "tel") {
    if (!/mobile|contact/i.test(`${f.name} ${f.label}`)) return DEMO_APPLICANT.telephone;
    return MOBILES.find(([re]) => re.test(f.name))?.[1] ?? DEMO_APPLICANT.mobile;
  }
  if (f.kind === "email") {
    if (/auth_person/.test(f.name)) return "sunita.deshpande@sankalpseva.example.org";
    if (/incharge/.test(f.name)) return "home@sankalpseva.example.org";
    return DEMO_APPLICANT.email;
  }
  if (f.kind === "textarea") return fit("Recorded in the Society's register and available for inspection at the registered office.", f);
  return undefined;
}

const fit = (text: string, f: FieldDef) => (f.maxLength ? text.slice(0, f.maxLength) : text);
