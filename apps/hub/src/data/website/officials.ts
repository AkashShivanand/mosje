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
  /**
   * The officer's own page on this site, `/website/official/<slug>`. The live Who's Who
   * links every name to `dosje.gov.in/official/<slug>`, and each of those records is in the
   * ingested register, so the name here links to the same record the Department's does.
   */
  slug?: string;
}

/** Ministry offices that hold a directory but are neither an organisation nor a division. */
export type MinistryOfficeId = "ministry-leadership" | "ministry-staff" | "chairpersons-office";

/**
 * Office-holders — the senior post-holders each body shows on the Who's Who page, above a
 * link to its full directory.
 *
 * MIRRORED FROM THE LIVE PAGE, 2026-09-21. Every entry below is what dosje.gov.in/whos-who/
 * shows — the same eleven teams, in the same order, the same people, posts, telephone,
 * intercom, email, address, photograph and profile link. It was read from the page's own
 * feed (`admin-ajax.php`, action `filter_membercard_list`), not retyped from the screen.
 *
 * Two things were normalised, and nothing else: whitespace (a space before a comma
 * removed, a space before an opening bracket added), and email addresses, which the
 * Department prints as `name[at]gov[dot]in` and this page needs as real addresses to link.
 * Every word, spelling and number is the Department's, including the ones that look wrong;
 * those are listed for the Department in the PR that made this change, because a clone
 * that quietly corrected them would stop being evidence of what the live site says.
 *
 * WHAT THIS REPLACED. The previous record held fourteen people checked on 2026-08-23. Six
 * were not in the register — and the register itself explains why: the Department reuses
 * a departing officer's record for the successor, so the live page for the DAF Member
 * Secretary, Shri Parveen Kumar Thind, still sits at `/official/shri-v-appa-rao-3/`. The
 * clone was showing the predecessors.
 */
export const OFFICE_HOLDERS: Record<string, Official[]> = {
  "ministry-leadership": [
    {
      name: "Dr. Virendra Kumar",
      designation: "Union Minister of Social Justice and Empowerment",
      phone: "Office - 011-23381001, 23381390, 23381902(Fax) / Mobile - 011-23012175,23012195",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Dr.-Virendra-Kumar.png",
      slug: "dr-virendra-kumar",
    },
    {
      name: "Shri B. L. Verma",
      designation: "Minister of State",
      intercom: "110",
      phone: "23072192, 23072193",
      email: "mosoffice-sje@gov.in",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Image-2.png",
      slug: "shri-b-l-verma",
    },
    {
      name: "Shri Ramdas Athawale",
      designation: "Minister of State",
      phone: "011-23381656, 011-23381657, 011-23381669(Fax), 011-23018975, 011-23018978 (Fax)",
      email: "mos3-msje@gov.in, mosathawale@gmail.com",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Shri-Ramdas-Athawale.png",
      slug: "shri-ramdas-athawale",
    },
    /*
     * THE SECRETARY — the one place on this site the Secretary is named; every page that
     * names the post reads `getDepartmentSecretary()` below.
     *
     * Verified 22 Sep 2026 against the live site:
     *  - dosje.gov.in/about-us/ — "Shri Sudhansh Pant (IAS, RJ:1991) is the Secretary of
     *    Department of Social Justice & Empowerment", and its Former Secretaries table closes
     *    No. 27, Shri Amit Yadav, on 30.11.2025.
     *  - dosje.gov.in/official/sudhansh-pant-ias/ — designation "Secretary", intercom 121,
     *    011-26115006, secywel[at]nic[dot]in, Room No. 8201 (the register record of that slug).
     * The live Who's Who does not show him, which is why the mirror above omitted him. That
     * record publishes no photograph, so none is shown; the portrait is the designed
     * placeholder. The name is written as the About Us sentence writes it.
     */
    {
      name: "Shri Sudhansh Pant",
      designation: "Secretary",
      intercom: "121",
      phone: "011-26115006",
      email: "secywel@nic.in",
      address: "Room No. 8201, 8th Floor, Zone-2, GPOA-3, Netaji Nagar, New Delhi-110023",
      slug: "sudhansh-pant-ias",
    },
  ],
  "national-commission-for-scheduled-castes": [
    {
      name: "Shri Kishor Makwana",
      designation: "Chairperson",
      phone: "011-24620435",
      email: "chairman-ncsc@nic.in",
      address: "5th Floor Lok Nayak Bhawan, Khan Market, New Delhi – 110 003. Phone: 011-24620435",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Shri-Kishor-Makwana.png",
      slug: "shri-kishor-makwana",
    },
    {
      name: "Shri Love Kush Kumar",
      designation: "Member's office (LKK)",
      phone: "011-24620435",
      email: "lovekush.ncsc@ncsc.gov.in",
      address: "5th Floor Lok Nayak Bhawan, Khan Market, New Delhi – 110 003. Phone: 011-24620435",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Shri-Love-Kush-Kumar.png",
      slug: "shri-love-kush-kumar",
    },
    {
      name: "Shri Vaddepalli Ramchander",
      designation: "Member's office (VDR)",
      phone: "011-24620435",
      email: "chairman-ncsc@nic.in",
      address: "5th Floor Lok Nayak Bhawan, Khan Market, New Delhi – 110 003. Phone: 011-24620435",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Shri-Vaddepalli-Ramchander.png",
      slug: "shri-vaddepalli-ramchander",
    },
    {
      name: "Dr. Partha Biswas",
      designation: "Member",
      phone: "011-24626061",
      email: "partha.biswas@ncsc.gov.in",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/04/Dr-Partha-Biswas.jpg",
      slug: "dr-partha-biswas",
    },
  ],
  "national-commission-for-safai-karamcharis": [
    {
      name: "Shri Bhagwat Prasad Makwana",
      designation: "Chairperson (Rank of Union Minister of State)",
      email: "chairperson.ncsk@gov.in",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/05/chairperson.jpeg",
      slug: "vacant-cp",
    },
    {
      name: "Shri Kaishab Bihari",
      designation: "Vice-Chairperson (Rank of Secretary to the Government of India)",
      email: "hvc.ncsk@gov.in",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/05/Kaisav-Bihari-HVC.jpg",
      slug: "shri-hardeep-singh-gill-2",
    },
    {
      name: "Shri Rahul Kashyap",
      designation: "Secretary",
      phone: "011-24648922",
      email: "secy-ncsk@gov.in",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/WhatsApp-Image-2026-06-02-at-1.13.17-PM.jpeg",
      slug: "shri-rahul-kashyap",
    },
  ],
  "national-commission-for-backward-classes-ncbc": [
    {
      name: "Sadhvi Niranjan Jyoti",
      designation: "Hon'ble Chairperson",
      email: "chairman-office@ncbc.nic.in",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/04/Sadhvi-Niranjan-Jyoti-e1784101931886.png",
      slug: "sadhvi-niranjan-jyoti",
    },
    {
      name: "Shri Kiran Umesh Mahalle",
      designation: "Member",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/04/Shri-Kiran-Umesh-Mahalle.jpeg",
      slug: "shri-kiran-umesh-mahalle",
    },
  ],
  "national-scheduled-castes-finance-and-development-corporation": [
    {
      name: "Shri Prabhat Tyagi",
      designation: "Chairman-cum-Managing Director",
      email: "prabhat.tyagi@nic.in",
      address: "14th Floor Core 1 & 2 SCOPE Minar Laxmi Nagar District Centre Delhi-110092",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/CMD-Photo-Sh.-Prabhat-Tyagi.png",
      slug: "shri-prabhat-tyagi",
    },
  ],
  "national-backward-classes-financeand-development-corporationnbcfdc": [
    {
      name: "Shri Rajan Sehgal",
      designation: "Managing Director",
      phone: "01145854410",
      address: "5th Floor, NCUI Building, 3, Siri Institutional Area, August Kranti Marg, New Delhi-110 016",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Rajan-Sehgal_1_0.png",
      slug: "shri-rajan-sehgal",
    },
    {
      name: "Ms. Debolina Thakur",
      designation: "Director, Joint Secretary & FA",
      address: "Ministry of Social Justice & Empowerment Shashtri Bhawan New Delhi-110 001.",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Ms.-Debolina-Thakur-Director.jpg",
      slug: "ms-debolina-thakur-3",
    },
    {
      name: "Shri Parveen Kumar Thind",
      designation: "Director & Joint Secretary (BC) Govt. of India",
      address: "Shashtri Bhavan, New Delhi-110001",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Board-of-Directors-Image.png",
      slug: "shri-parveen-kumar-thind",
    },
  ],
  "national-safai-karamcharis-finance-development-corporation": [
    {
      name: "Shri Prabhat Kumar Singh",
      designation: "Managing Director",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/md_Pic-157x222-1-1.jpeg",
      slug: "shri-prabhat-kumar-singh",
    },
    {
      name: "Shri Rohit Kakkar",
      designation: "Deputy Advisor (PHE)",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Rohit_kakkar-185x186-1-1.jpg",
      slug: "shri-rohit-kakkar",
    },
    {
      name: "Sh. Suresh Kumar",
      designation: "Chief Manager (Admin)",
      phone: "011-26382476, 26382477",
      email: "suresh-nskfdc@nic.in",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/Profile-Image-2.png",
      slug: "sh-suresh-kumar",
    },
  ],
  "dr-ambedkar-foundation": [
    {
      name: "Shri Parveen Kumar Thind",
      designation: "Member Secretary",
      email: "jsbcd-msje@gov.in",
      address: "3rd Floor, Dr. Ambedkar International Centre, 15 Janpath, New Delhi - 110001",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/MS-Sir-Pic.png",
      slug: "shri-v-appa-rao-3",
    },
    {
      name: "Shri Vinesh Pachnanda",
      designation: "Director",
      email: "dir.daf-msje@gov.in",
      address: "2nd Floor, Dr. Ambedkar International Centre, 15 Janpath, New Delhi - 110001",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/Shri-Vinesh-Pachnanda.jpeg",
      slug: "shri-sudhanshu-kumar-pandey-2",
    },
  ],
  "dr-ambedkar-international-centre": [
    {
      name: "Dr. Virendra Kumar",
      designation: "Chairman Union Minister of Social Justice and Empowerment O/o Minister SJE",
      intercom: "110",
      phone: "011-24105009, 24105011, 26110251",
      email: "min-sje@nic.in",
      address: "Room No. 8605, 8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi-110023",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Dr.-Virendra-Kumar.png",
      slug: "dr-virendra-kumar-9",
    },
    {
      name: "Shri Parveen Kumar Thind",
      designation: "Member Secretary",
      phone: "011-26113455, 011-26113428",
      email: "jsbcd-msje@gov.in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi - 110001",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/04/WhatsApp-Image-2026-09-08-at-2.54.12-PM.jpeg",
      slug: "shri-shailendra-kumar",
    },
    {
      name: "Akash Patil",
      designation: "Director",
      phone: "011-23477499",
      email: "dir-daic-mosje@gov.in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi - 110001",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/akash-patil.png",
      slug: "akash-patil",
    },
  ],
  "babu-jagjivan-ram-national-foundation-jrf": [
    {
      name: "Dr. Virendra Kumar",
      designation: "Hon'ble Minister of Social Justice & Empowerment and President, BJRNF",
      photo: "https://www.dosje.gov.in/wp-content/uploads/2025/11/Dr.-Virendra-Kumar.png",
      slug: "dr-virendra-kumar-3",
    },
    {
      name: "Smt. Swati Kumar",
      designation: "Executive Vice-President, BJRNF",
      email: "evp-bjrnf@jagjivanramfoundation.nic.in",
      address: "6, Krishna Menon Marg, New Delhi- 110011",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/EVP-Mam-Pic.jpg",
      slug: "smt-swati-kumar-2",
    },
    {
      name: "Shri Parveen Kumar Thind",
      designation: "Member Secretary, BJRNF",
      email: "jsbcd-msje@gov.in",
      address: "Ministry of Social Justice & Empowerment, Government of India, 8th Floor, Zone-5, GPOA-3, Netaji Nagar, New Delhi-110023",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/MS-Sir-Pic-1.png",
      slug: "shri-parveen-kumar-thind-2",
    },
    {
      name: "Shri Vinesh Pachnanda",
      designation: "Director, BJRNF",
      email: "vinesh.pachnanda@nic.in",
      address: "6, Krishna Menon Marg, New Delhi- 110011",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/08/Shri-Vinesh-Pachnanda.jpeg",
      slug: "shri-vinesh-pachnanda-2",
    },
  ],
  "national-institute-of-social-defence": [
    {
      name: "Dr. Virendra Kumar",
      designation: "Union Minister of Social Justice and Empowerment",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/minister_1.png",
      slug: "dr-virendra-kumar-8",
    },
    {
      name: "Shri Ramdas Athawale",
      designation: "Minister of State of Social Justice & Empowerment",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/minister_2.png",
      slug: "shri-ramdas-athawale-5-2",
    },
    {
      name: "Shri B. L. Verma",
      designation: "Minister of State of Social Justice & Empowerment",
      photo: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/minister_3.png",
      slug: "shri-b-l-verma-5-2",
    },
  ],
};

/** Senior post-holders of one body — what whos-who shows above its "View All" link. */
export function getOfficeHolders(ownerId: string): Official[] {
  return OFFICE_HOLDERS[ownerId] ?? [];
}

/**
 * The Secretary of the Department of Social Justice & Empowerment — the single source for
 * every page that names the post. Throws at build time rather than let a page print a
 * sentence with no name in it.
 */
export function getDepartmentSecretary(): Official {
  const secretary = OFFICE_HOLDERS["ministry-leadership"]?.find((o) => o.designation === "Secretary");
  if (!secretary) throw new Error("officials: no Secretary in ministry-leadership");
  return secretary;
}

/** Bodies that publish office-holders, in registry order. */
export const BODIES_WITH_OFFICE_HOLDERS = Object.keys(OFFICE_HOLDERS);
