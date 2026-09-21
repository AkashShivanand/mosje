/**
 * The office-holders the website publishes above each body's directory — ministers,
 * chairpersons, members and secretaries — and the shape they share.
 *
 * WHAT USED TO BE HERE, AND WHY IT IS GONE. Until 2026-09-21 this file also held
 * `OFFICIALS`: 115 "secretariat" rows across fifteen bodies, gathered on 2026-08-23 from
 * rows that fifteen page files had each carried inline since the first clone. They were
 * placeholders. Checked against the Department's own register
 * (`content/website/official.json`, 452 officers ingested from dosje.gov.in on 2026-09-18),
 * 111 of the 115 names appeared nowhere in it, and some were not plausible at all — a
 * "Satyendra Nath Bose" was filed under PM-AJAY. The block below already called them mock.
 *
 * Nothing rendered them by then: the directory pages, `official/[slug]` and the site search
 * all read the ingested register. But `directoryRows()` still reached them, one import away
 * from putting invented officers of the Government of India on a public page. So they are
 * deleted rather than kept "for reconciliation" — there was nothing to reconcile them with.
 *
 * The telephone directories are the ingested register: `getOfficialsByOrganisation()` in
 * `lib/website/content`.
 */

export interface Official {
  name: string;
  /** The post held, e.g. "Deputy Secretary (NSAP)". */
  designation: string;
  /** Internal extension. */
  intercom?: string;
  phone?: string;
  email?: string;
  address?: string;
  /** Room number, where published separately from the address. */
  room?: string;
  photo?: string;
}

/** Ministry offices that hold a directory but are neither an organisation nor a division. */
export type MinistryOfficeId = "ministry-leadership" | "ministry-staff" | "chairpersons-office";

/**
 * Office-holders — the senior post-holders a body publishes above its telephone directory.
 * whos-who renders these; the directory pages render the ingested register.
 *
 * These are real, externally checkable people, and they are the one hand-kept list of
 * officials left on the website. (The mock secretariat this note used to be compared with
 * is gone; see the top of the file.)
 *
 * CHECKED AGAINST LIVE DATA, 2026-08-23, using dosje.gov.in's own register
 * (`/wp-json/wp/v2/official`, 497 records, organisation read from `organisation_cat`):
 *
 *   confirmed, organisation agrees (7)  Dr. Virendra Kumar, Shri Ramdas Athawale and
 *                                       Shri B. L. Verma under MoSJE; Mr. Nandu Shaw under
 *                                       DAIC; Shri Kishor Makwana, Shri Love Kush Kumar and
 *                                       Shri Vaddepalli Ramchander under NCSC
 *   name matches, ORGANISATION DIFFERS  Shri Rajesh Kumar — under NCBC here, under DAIC on
 *                                       the live register. NOT changed: it is a very common
 *                                       name and these may be two different people. Needs a
 *                                       human to confirm before either entry moves.
 *   absent from the live register (6)   Shri V. Appa Rao, Shri Vikas Trivedi and
 *                                       Hemant Kumar Srivastava (DAIC); Shri Hansraj
 *                                       Gangaram Ahir, Shri Bhuvan Bhushan Kamal and
 *                                       Ms. Meeta Rajivlochan (NCBC)
 *
 * The NCBC Secretary conflict CANNOT be settled this way, and that is the finding. Neither
 * Ms. Meeta Rajivlochan nor Renuka Patil appears in the live register, and NCBC holds only
 * two records there — Shri Kiran Umesh Mahalle and Sadhvi Niranjan Jyoti — with no
 * designation recorded against either. The live Who's Who renders client-side from an
 * endpoint its HTML does not expose, so the roster behind it is not reachable. Settling this
 * needs NCBC's own published list, not another pass at the API.
 *
 * What the same check DID settle: every abbreviation in organisations.ts exists as a live
 * `organisation_cat` term, SCW included — the registry's names are the Department's own.
 */
export const OFFICE_HOLDERS: Record<string, Official[]> = {
  "ministry-leadership": [
    {
      name: "Dr. Virendra Kumar",
      designation: "Union Minister of Social Justice and Empowerment",
      phone: "011-23381001, 23381390, 23381902(Fax)",
      email: "min-sje@nic.in",
      address: "201 C-Wing, Shastri Bhawan, New Delhi",
      room: "110",
      photo: "/website/images/Dr.-Virendra-Kumar.png",
    },
    {
      name: "Shri Ramdas Athawale",
      designation: "Minister of State for Social Justice & Empowerment",
      phone: "011-23381656, 011-23381657, 011-23018978(Fax)",
      email: "mos3-msje@gov.in",
      address: "101C-Wing, Shastri Bhawan, New Delhi",
      room: "125",
      photo: "/website/images/Shri-Ramdas-Athawale.png",
    },
    {
      name: "Shri B. L. Verma",
      designation: "Minister of State for Social Justice & Empowerment",
      phone: "011-23072192, 23072193",
      email: "mosoffice-sje@gov.in",
      address: "Room No. 623, A-Wing, Shastri Bhawan, New Delhi",
      room: "141, 142",
      photo: "/website/images/sri-l-b-verma.png",
    },
  ],
  "dr-ambedkar-international-centre": [
    {
      name: "Shri V. Appa Rao",
      designation: "Member Secretary",
      phone: "011-23477499",
      email: "dir-daic-mosje@gov.in",
      address: "2nd Floor, DAIC, 15 Janpath, New Delhi",
    },
    {
      name: "Shri Vikas Trivedi",
      designation: "Director",
      phone: "011-23477493",
      email: "dir-daic-mosje@gov.in",
      address: "2nd Floor, DAIC, 15 Janpath, New Delhi",
    },
    {
      name: "Hemant Kumar Srivastava",
      designation: "Financial Advisor",
      phone: "011-23477499",
      email: "dir-daic-mosje@gov.in",
      address: "2nd Floor, DAIC, 15 Janpath, New Delhi",
    },
    {
      name: "Mr. Nandu Shaw",
      designation: "Sr. Accounts Officer",
      phone: "011-23477499",
      email: "dir-daic-mosje@gov.in",
      address: "2nd Floor, DAIC, 15 Janpath, New Delhi",
    },
  ],
  "national-commission-for-backward-classes-ncbc": [
    {
      name: "Shri Hansraj Gangaram Ahir",
      designation: "Hon'ble Chairperson",
      phone: "011-26183152, 011-26182388",
      email: "chairman-office@ncbc.nic.in",
      room: "101",
    },
    {
      name: "Shri Bhuvan Bhushan Kamal",
      designation: "Hon'ble Member",
      phone: "011-26185478",
      email: "member-office@ncbc.nic.in",
      room: "103",
    },
    {
      name: "Ms. Meeta Rajivlochan, I.A.S.",
      designation: "Secretary",
      phone: "011-26183190",
      email: "secy-ncbc@nic.in",
      room: "102",
    },
    {
      name: "Shri Rajesh Kumar",
      designation: "Advisor to the Commission",
      phone: "011-26714874",
      room: "212",
    },
  ],
  "national-commission-for-scheduled-castes": [
    {
      name: "Shri Kishor Makwana",
      designation: "Chairperson",
      phone: "011-24620435",
      email: "chairman-ncsc@nic.in",
    },
    {
      name: "Shri Love Kush Kumar",
      designation: "Hon'ble Member",
      phone: "011-24623296",
      email: "lovekush.ncsc@gov.in",
    },
    {
      name: "Shri Vaddepalli Ramchander",
      designation: "Hon'ble Member",
      phone: "011-24624801",
      email: "vaddepalli.ncsc@gov.in",
    },
  ],
};

/** Senior post-holders of one body — what whos-who shows above its "View All" link. */
export function getOfficeHolders(ownerId: string): Official[] {
  return OFFICE_HOLDERS[ownerId] ?? [];
}

/** Bodies that publish office-holders, in registry order. */
export const BODIES_WITH_OFFICE_HOLDERS = Object.keys(OFFICE_HOLDERS);
