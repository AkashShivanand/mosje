/**
 * Every official the website publishes, keyed by the body they are posted in.
 *
 * These 115 records previously lived inline in 15 separate page.tsx files, one `rows`
 * array each, all of the same shape. Nothing could read them but the page they sat in —
 * which is why whos-who could not show a real preview of a directory and had to carry its
 * own, separately-worded copy of a handful of officials.
 *
 * VOCABULARY. The two sources named the same fields differently — the directory pages used
 * designation/contact/address, whos-who used role/phone/location. One name per concept now:
 *
 *   designation   (was: role)        the post held
 *   phone         (was: contact)     the published telephone number
 *   address       (was: location)    where the officer sits
 *   photo         (was: image)       portrait, where one exists
 *
 * `sno` is gone. It was a row number, not a fact about a person; the table renders it.
 *
 * OWNERS. A key is an organisation id from organisations.ts, a division id from
 * divisions.ts, or one of the Ministry's own offices. Note `scheduled-caste-welfare` is a
 * DIVISION — the SCW abbreviation is also used by the Senior Citizens Welfare portal, and
 * conflating them is the reason that directory looked like an organisation's.
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

export const OFFICIALS: Record<string, Official[]> = {
  "babu-jagjivan-ram-national-foundation": [
    {
      name: "Krishna Murari Lal Das",
      designation: "Member Secretary, BJRNF",
      intercom: "550",
      phone: "011-23320591",
      email: "ms-bjrnf[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Sushma Vaidya",
      designation: "Director (Programmes), BJRNF",
      intercom: "553",
      phone: "011-23320594",
      email: "dir-prog-bjrnf[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Mahesh Chandra Vyas",
      designation: "Director (Administration), BJRNF",
      intercom: "556",
      phone: "011-23320597",
      email: "dir-admin-bjrnf[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Roshni Mahato",
      designation: "Deputy Director, BJRNF",
      intercom: "559",
      phone: "011-23320600",
      email: "dd-bjrnf[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Vinod Kumar Tyagi",
      designation: "Accounts Officer, BJRNF",
      intercom: "562",
      phone: "011-23320603",
      email: "ao-bjrnf[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Anjana Srivastava",
      designation: "Under Secretary, BJRNF",
      intercom: "565",
      phone: "011-23320606",
      email: "us-bjrnf[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Dilip Singh Rana",
      designation: "Research Officer, BJRNF",
      intercom: "568",
      phone: "011-23320609",
      email: "ro-bjrnf[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
  ],
  "dr-ambedkar-foundation": [
    {
      name: "Bhagwan Das Khatana",
      designation: "Member Secretary, Dr. Ambedkar Foundation",
      intercom: "701",
      phone: "011-23320571",
      email: "ms-daf[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Suman Lata Arya",
      designation: "Director (Programmes), DAF",
      intercom: "704",
      phone: "011-23320574",
      email: "dir-prog-daf[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Yashpal Solanki",
      designation: "Director (Administration), DAF",
      intercom: "707",
      phone: "011-23320577",
      email: "dir-admin-daf[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Neha Chaturvedi",
      designation: "Deputy Director, DAF",
      intercom: "710",
      phone: "011-23320580",
      email: "dd-daf[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Tarun Sethi",
      designation: "Accounts Officer, DAF",
      intercom: "713",
      phone: "011-23320583",
      email: "ao-daf[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Kiran Bedi Negi",
      designation: "Under Secretary, DAF",
      intercom: "716",
      phone: "011-23320586",
      email: "us-daf[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Sandeep Kaushik",
      designation: "Research Officer, DAF",
      intercom: "719",
      phone: "011-23320589",
      email: "ro-daf[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
  ],
  "dr-ambedkar-international-centre": [
    {
      name: "Lt. Gen. (Retd.) Prakash Menon",
      designation: "Director General, DAIC",
      intercom: "801",
      phone: "011-23062387",
      email: "dg-daic[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Dr. Shalini Bhardwaj",
      designation: "Director (Research & Studies), DAIC",
      intercom: "804",
      phone: "011-23062390",
      email: "dir-rs-daic[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Vikram Aditya Rao",
      designation: "Director (Operations), DAIC",
      intercom: "807",
      phone: "011-23062393",
      email: "dir-ops-daic[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Preeti Wadhwa",
      designation: "Deputy Director (Events), DAIC",
      intercom: "810",
      phone: "011-23062396",
      email: "dd-events-daic[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Anand Mohan Jha",
      designation: "Manager (Facilities), DAIC",
      intercom: "813",
      phone: "011-23062399",
      email: "mgr-fac-daic[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Ritika Malhotra",
      designation: "Accounts Officer, DAIC",
      intercom: "816",
      phone: "011-23062402",
      email: "ao-daic[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
    {
      name: "Suraj Prakash Dubey",
      designation: "Research Associate, DAIC",
      intercom: "819",
      phone: "011-23062405",
      email: "ra-daic[at]nic[dot]in",
      address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
    },
  ],
  "development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic-communities": [
    {
      name: "Bhiku Ramji Idate",
      designation: "Chairman, DWBDNC",
      intercom: "601",
      phone: "011-22904915",
      email: "chairman-dwbdnc[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Dr. Gangaram Bhopi",
      designation: "Member, DWBDNC",
      intercom: "604",
      phone: "011-22904918",
      email: "member1-dwbdnc[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Sunita Kale",
      designation: "Member, DWBDNC",
      intercom: "607",
      phone: "011-22904921",
      email: "member2-dwbdnc[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Rameshwar Nath Pandey",
      designation: "Member Secretary, DWBDNC",
      intercom: "610",
      phone: "011-22904924",
      email: "ms-dwbdnc[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Vandana Rathore",
      designation: "Director, DWBDNC",
      intercom: "613",
      phone: "011-22904927",
      email: "dir-dwbdnc[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Ashok Kumar Pawar",
      designation: "Deputy Director, DWBDNC",
      intercom: "616",
      phone: "011-22904930",
      email: "dd-dwbdnc[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
    {
      name: "Firoz Alam Ansari",
      designation: "Under Secretary, DWBDNC",
      intercom: "619",
      phone: "011-22904933",
      email: "us-dwbdnc[at]nic[dot]in",
      address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
    },
  ],
  "ministry-leadership": [
    {
      name: "Dr. Virendra Kumar, HMSJE",
      designation: "Union Minister of Social Justice and Empowerment",
      intercom: "110",
      phone: "011-24105009, 24105011, 26110251",
      email: "min-sje[at]nic[dot]in",
      address: "Room No. 8605, 8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi",
    },
    {
      name: "Jatin Chopra, IRTS",
      designation: "Private Secretary",
      intercom: "110",
      phone: "011-24105009, 24105011",
      email: "min-sje[at]nic[dot]in",
      address: "8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi",
    },
    {
      name: "Prabhat Kumar Tripathy",
      designation: "Additional Private Secretary",
      intercom: "110",
      phone: "011-24105009",
      email: "min-sje[at]nic[dot]in",
      address: "8th Floor, Zone-6, GPOA-3, New Delhi",
    },
    {
      name: "Bharat",
      designation: "Assistant Private Secretary",
      intercom: "110",
      phone: "011-24105009",
      email: "min-sje[at]nic[dot]in",
      address: "8th Floor, Zone-6, GPOA-3, New Delhi",
    },
    {
      name: "Amit Yadav, IAS",
      designation: "Secretary",
      intercom: "121",
      phone: "011-23381001, 23386946",
      email: "secy-sje[at]nic[dot]in",
      address: "Room No. 615, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Surendra Singh, IAS",
      designation: "Additional Secretary",
      intercom: "134",
      phone: "011-23070315",
      email: "as-sje[at]nic[dot]in",
      address: "Room No. 605, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Rajiv Sharma, IAS",
      designation: "Joint Secretary (SCD)",
      intercom: "145",
      phone: "011-23381322",
      email: "js-scd[at]nic[dot]in",
      address: "Room No. 729, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Anita Bhatnagar, IES",
      designation: "Economic Adviser",
      intercom: "158",
      phone: "011-23386578",
      email: "ea-sje[at]nic[dot]in",
      address: "Room No. 712, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Mahendra Pratap Singh",
      designation: "Chief Controller of Accounts",
      intercom: "162",
      phone: "011-24369280",
      email: "cca-sje[at]nic[dot]in",
      address: "Room No. 7, B-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Sunita Verma",
      designation: "Deputy Secretary (Admin)",
      intercom: "176",
      phone: "011-23386152",
      email: "ds-admin[at]nic[dot]in",
      address: "Room No. 543, A-Wing, Shastri Bhawan, New Delhi",
    },
  ],
  "national-backward-classes-finance-and-development-corporation": [
    {
      name: "Naveen Kumar Sinha",
      designation: "Chairman-cum-Managing Director, NBCFDC",
      intercom: "901",
      phone: "011-45854400",
      email: "cmd-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, August Kranti Marg, New Delhi",
    },
    {
      name: "Rajeshwari Pillai",
      designation: "General Manager (Finance), NBCFDC",
      intercom: "904",
      phone: "011-45854404",
      email: "gm-fin-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
    },
    {
      name: "Devraj Hooda",
      designation: "General Manager (Schemes), NBCFDC",
      intercom: "907",
      phone: "011-45854408",
      email: "gm-sch-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
    },
    {
      name: "Sneha Kulshrestha",
      designation: "Deputy General Manager, NBCFDC",
      intercom: "910",
      phone: "011-45854412",
      email: "dgm-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
    },
    {
      name: "Imran Sheikh",
      designation: "Assistant General Manager, NBCFDC",
      intercom: "913",
      phone: "011-45854416",
      email: "agm-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
    },
    {
      name: "Pallavi Deshpande",
      designation: "Company Secretary, NBCFDC",
      intercom: "916",
      phone: "011-45854420",
      email: "cs-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
    },
    {
      name: "Gaurav Tandon",
      designation: "Manager (IT), NBCFDC",
      intercom: "919",
      phone: "011-45854424",
      email: "mgr-it-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
    },
    {
      name: "Anuradha Bhise",
      designation: "Manager (HR), NBCFDC",
      intercom: "922",
      phone: "011-45854428",
      email: "mgr-hr-nbcfdc[at]nic[dot]in",
      address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
    },
  ],
  "national-commission-for-backward-classes-ncbc": [
    {
      name: "Hansraj Gangaram Ahir",
      designation: "Chairman, NCBC",
      intercom: "401",
      phone: "011-24360801",
      email: "chairman-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Dr. Suresh Pal",
      designation: "Vice-Chairman, NCBC",
      intercom: "404",
      phone: "011-24360805",
      email: "vc-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Kashim Ali Khan",
      designation: "Member, NCBC",
      intercom: "407",
      phone: "011-24360808",
      email: "member1-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Bhagwan Lal Sahni",
      designation: "Member, NCBC",
      intercom: "410",
      phone: "011-24360811",
      email: "member2-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Renuka Patil",
      designation: "Secretary, NCBC",
      intercom: "413",
      phone: "011-24360815",
      email: "secy-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Dinesh Chand Meena",
      designation: "Joint Secretary, NCBC",
      intercom: "416",
      phone: "011-24360818",
      email: "js-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Aarti Singhania",
      designation: "Deputy Secretary, NCBC",
      intercom: "419",
      phone: "011-24360821",
      email: "ds-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Mohan Lal Yadav",
      designation: "Under Secretary, NCBC",
      intercom: "422",
      phone: "011-24360824",
      email: "us-ncbc[at]nic[dot]in",
      address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
  ],
  "national-commission-for-safai-karamcharis": [
    {
      name: "M. Venkatesan",
      designation: "Chairman, NCSK",
      intercom: "501",
      phone: "011-22054393",
      email: "chairman-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
    {
      name: "Jagdish Prasad Ahirwar",
      designation: "Vice-Chairman, NCSK",
      intercom: "504",
      phone: "011-22054396",
      email: "vc-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
    {
      name: "Manju Diwakar",
      designation: "Member, NCSK",
      intercom: "507",
      phone: "011-22054399",
      email: "member1-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
    {
      name: "Sukhdev Singh Patwa",
      designation: "Member, NCSK",
      intercom: "510",
      phone: "011-22054402",
      email: "member2-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
    {
      name: "Praveen Kumar Lal",
      designation: "Secretary, NCSK",
      intercom: "513",
      phone: "011-22054405",
      email: "secy-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
    {
      name: "Sarita Bairwa",
      designation: "Director, NCSK",
      intercom: "516",
      phone: "011-22054408",
      email: "dir-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
    {
      name: "Omkar Nath Tiwari",
      designation: "Under Secretary, NCSK",
      intercom: "519",
      phone: "011-22054411",
      email: "us-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
    {
      name: "Bhuvneshwar Paswan",
      designation: "Research Officer, NCSK",
      intercom: "522",
      phone: "011-22054414",
      email: "ro-ncsk[at]nic[dot]in",
      address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
    },
  ],
  "national-institute-of-social-defence": [
    {
      name: "Dr. Ashok Kumar Bhola",
      designation: "Director General, NISD",
      intercom: "120",
      phone: "011-26852316",
      email: "dg-nisd[at]nic[dot]in",
      address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
    },
    {
      name: "Dr. Savita Nagpal",
      designation: "Registrar, NISD",
      intercom: "123",
      phone: "011-26852319",
      email: "registrar-nisd[at]nic[dot]in",
      address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
    },
    {
      name: "Prof. Harbans Lal Khanna",
      designation: "Head, Department of Geriatric Care, NISD",
      intercom: "126",
      phone: "011-26852322",
      email: "geriatric-nisd[at]nic[dot]in",
      address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
    },
    {
      name: "Dr. Lalita Mohanlal",
      designation: "Head, Department of Drug Abuse Prevention, NISD",
      intercom: "129",
      phone: "011-26852325",
      email: "drug-nisd[at]nic[dot]in",
      address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
    },
    {
      name: "Subrata Banerjee",
      designation: "Assistant Director (Training), NISD",
      intercom: "132",
      phone: "011-26852328",
      email: "ad-train-nisd[at]nic[dot]in",
      address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
    },
    {
      name: "Komal Aggarwal",
      designation: "Accounts Officer, NISD",
      intercom: "135",
      phone: "011-26852331",
      email: "ao-nisd[at]nic[dot]in",
      address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
    },
    {
      name: "Yogesh Khandelwal",
      designation: "Research Officer, NISD",
      intercom: "138",
      phone: "011-26852334",
      email: "ro-nisd[at]nic[dot]in",
      address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
    },
  ],
  "national-scheduled-castes-finance-and-development-corporation": [
    {
      name: "Rajesh Kumar Bansal",
      designation: "Chairman-cum-Managing Director, NSFDC",
      intercom: "210",
      phone: "011-26449653",
      email: "cmd-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
    {
      name: "Shobha Rani Naidu",
      designation: "General Manager (Operations), NSFDC",
      intercom: "213",
      phone: "011-26449657",
      email: "gm-ops-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
    {
      name: "Brijesh Mohan Gupta",
      designation: "General Manager (Finance), NSFDC",
      intercom: "216",
      phone: "011-26449661",
      email: "gm-fin-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
    {
      name: "Karuna Sengupta",
      designation: "Deputy General Manager, NSFDC",
      intercom: "219",
      phone: "011-26449665",
      email: "dgm-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
    {
      name: "Aniruddh Choudhary",
      designation: "Assistant General Manager, NSFDC",
      intercom: "222",
      phone: "011-26449669",
      email: "agm-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
    {
      name: "Meera Krishnan",
      designation: "Company Secretary, NSFDC",
      intercom: "225",
      phone: "011-26449673",
      email: "cs-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
    {
      name: "Hemant Wankhede",
      designation: "Manager (Schemes), NSFDC",
      intercom: "228",
      phone: "011-26449677",
      email: "mgr-sch-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
    {
      name: "Divya Ranganathan",
      designation: "Manager (IT), NSFDC",
      intercom: "231",
      phone: "011-26449681",
      email: "mgr-it-nsfdc[at]nic[dot]in",
      address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
    },
  ],
  "national-safai-karamcharis-finance-and-development-corporation": [
    {
      name: "Ashutosh Niranjan Tiwari",
      designation: "Chairman-cum-Managing Director, NSKFDC",
      intercom: "330",
      phone: "011-26382476",
      email: "cmd-nskfdc[at]nic[dot]in",
      address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
    },
    {
      name: "Vijaya Lakshmi Reddy",
      designation: "General Manager (Projects), NSKFDC",
      intercom: "333",
      phone: "011-26382480",
      email: "gm-proj-nskfdc[at]nic[dot]in",
      address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
    },
    {
      name: "Manohar Lal Saini",
      designation: "General Manager (Finance), NSKFDC",
      intercom: "336",
      phone: "011-26382484",
      email: "gm-fin-nskfdc[at]nic[dot]in",
      address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
    },
    {
      name: "Swati Patankar",
      designation: "Deputy General Manager, NSKFDC",
      intercom: "339",
      phone: "011-26382488",
      email: "dgm-nskfdc[at]nic[dot]in",
      address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
    },
    {
      name: "Naveen Bhatt",
      designation: "Assistant General Manager, NSKFDC",
      intercom: "342",
      phone: "011-26382492",
      email: "agm-nskfdc[at]nic[dot]in",
      address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
    },
    {
      name: "Rukmini Devi Patel",
      designation: "Company Secretary, NSKFDC",
      intercom: "345",
      phone: "011-26382496",
      email: "cs-nskfdc[at]nic[dot]in",
      address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
    },
    {
      name: "Sudhanshu Mohanty",
      designation: "Manager (Sanitation), NSKFDC",
      intercom: "348",
      phone: "011-26382500",
      email: "mgr-san-nskfdc[at]nic[dot]in",
      address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
    },
  ],
  "pradhan-mantri-anusuchit-jaati-abhyuday-yojna": [
    {
      name: "Alok Ranjan Pandey, IAS",
      designation: "Mission Director, PM-AJAY",
      intercom: "470",
      phone: "011-23386551",
      email: "md-pmajay[at]nic[dot]in",
      address: "Room No. 705, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Deepika Rawat",
      designation: "Project Director (Adarsh Gram), PM-AJAY",
      intercom: "473",
      phone: "011-23386555",
      email: "pd-ag-pmajay[at]nic[dot]in",
      address: "Room No. 708, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Satyendra Nath Bose",
      designation: "Project Director (Grants-in-Aid), PM-AJAY",
      intercom: "476",
      phone: "011-23386559",
      email: "pd-gia-pmajay[at]nic[dot]in",
      address: "Room No. 711, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Nazia Parveen",
      designation: "Deputy Director (Hostels), PM-AJAY",
      intercom: "479",
      phone: "011-23386563",
      email: "dd-hostel-pmajay[at]nic[dot]in",
      address: "Room No. 714, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Ramesh Babu Konda",
      designation: "Monitoring & Evaluation Officer, PM-AJAY",
      intercom: "482",
      phone: "011-23386567",
      email: "me-pmajay[at]nic[dot]in",
      address: "Room No. 717, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Sheetal Aggrawal",
      designation: "Finance Officer, PM-AJAY",
      intercom: "485",
      phone: "011-23386571",
      email: "fo-pmajay[at]nic[dot]in",
      address: "Room No. 720, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Pankaj Mohanty",
      designation: "IT Consultant, PM-AJAY PMU",
      intercom: "488",
      phone: "011-23386575",
      email: "it-pmajay[at]nic[dot]in",
      address: "Room No. 723, A-Wing, Shastri Bhawan, New Delhi",
    },
  ],
  "scheduled-caste-welfare": [
    {
      name: "Dr. Ramakant Solanki",
      designation: "Director (SC Welfare)",
      intercom: "440",
      phone: "011-23386521",
      email: "dir-scw[at]nic[dot]in",
      address: "Room No. 808, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Manisha Borkar",
      designation: "Deputy Secretary (SCW Schemes)",
      intercom: "443",
      phone: "011-23386525",
      email: "ds-scw[at]nic[dot]in",
      address: "Room No. 811, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Gopal Krishna Murthy",
      designation: "Deputy Secretary (Scholarships, SCW)",
      intercom: "446",
      phone: "011-23386529",
      email: "ds-sch-scw[at]nic[dot]in",
      address: "Room No. 814, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Farida Begum",
      designation: "Under Secretary (SCW)",
      intercom: "449",
      phone: "011-23386533",
      email: "us-scw[at]nic[dot]in",
      address: "Room No. 817, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Prashant Deshmukh",
      designation: "Section Officer (SCW Coordination)",
      intercom: "452",
      phone: "011-23386537",
      email: "so-scw[at]nic[dot]in",
      address: "Room No. 820, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Lata Mangeshkar Pawar",
      designation: "Research Officer (SCW)",
      intercom: "455",
      phone: "011-23386541",
      email: "ro-scw[at]nic[dot]in",
      address: "Room No. 823, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Abhishek Raghuvanshi",
      designation: "Assistant Director (SCW Monitoring)",
      intercom: "458",
      phone: "011-23386545",
      email: "ad-scw[at]nic[dot]in",
      address: "Room No. 826, A-Wing, Shastri Bhawan, New Delhi",
    },
  ],
  "ministry-staff": [
    {
      name: "Pradeep Nautiyal",
      designation: "Director (Scholarships)",
      intercom: "203",
      phone: "011-23385973",
      email: "dir-sch[at]nic[dot]in",
      address: "Room No. 718, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Kavita Rani",
      designation: "Director (Disability Affairs)",
      intercom: "211",
      phone: "011-23386154",
      email: "dir-da[at]nic[dot]in",
      address: "Room No. 521, B-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Sanjay Kulkarni",
      designation: "Deputy Secretary (NSAP)",
      intercom: "218",
      phone: "011-23070281",
      email: "ds-nsap[at]nic[dot]in",
      address: "Room No. 634, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Reena Mathew",
      designation: "Under Secretary (Coordination)",
      intercom: "226",
      phone: "011-23386440",
      email: "us-coord[at]nic[dot]in",
      address: "Room No. 309, B-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Devendra Pal",
      designation: "Under Secretary (Establishment)",
      intercom: "233",
      phone: "011-23386901",
      email: "us-estt[at]nic[dot]in",
      address: "Room No. 312, B-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Lakshmi Narayanan",
      designation: "Section Officer (Budget)",
      intercom: "241",
      phone: "011-23385612",
      email: "so-budget[at]nic[dot]in",
      address: "Room No. 118, B-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Pooja Aggarwal",
      designation: "Section Officer (Parliament)",
      intercom: "248",
      phone: "011-23385619",
      email: "so-parl[at]nic[dot]in",
      address: "Room No. 124, B-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Harish Chandra Joshi",
      designation: "Senior Technical Director (NIC)",
      intercom: "255",
      phone: "011-23074512",
      email: "std-nic[at]nic[dot]in",
      address: "NIC Cell, Ground Floor, A-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Nidhi Saxena",
      designation: "Assistant Director (OL)",
      intercom: "262",
      phone: "011-23386773",
      email: "ad-ol[at]nic[dot]in",
      address: "Room No. 207, B-Wing, Shastri Bhawan, New Delhi",
    },
    {
      name: "Mukesh Ranjan",
      designation: "Accounts Officer",
      intercom: "270",
      phone: "011-24369285",
      email: "ao-sje[at]nic[dot]in",
      address: "PAO (SJE), Lok Nayak Bhawan, Khan Market, New Delhi",
    },
  ],
  "chairpersons-office": [
    {
      name: "Justice (Retd.) Hansraj Gangaram Ahir",
      designation: "Chairperson",
      intercom: "301",
      phone: "011-24360801",
      email: "chairperson[at]nic[dot]in",
      address: "Room No. 101, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Sudhir Vasant Deshpande",
      designation: "Secretary to Chairperson",
      intercom: "303",
      phone: "011-24360805",
      email: "secy-cp[at]nic[dot]in",
      address: "Room No. 104, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Anjali Deshmukh",
      designation: "Private Secretary",
      intercom: "305",
      phone: "011-24360808",
      email: "ps-cp[at]nic[dot]in",
      address: "Room No. 106, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Ravindra Kumar Singh",
      designation: "Deputy Director",
      intercom: "308",
      phone: "011-24360812",
      email: "dd-cp[at]nic[dot]in",
      address: "Room No. 110, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Geeta Chauhan",
      designation: "Under Secretary",
      intercom: "311",
      phone: "011-24360816",
      email: "us-cp[at]nic[dot]in",
      address: "Room No. 114, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Naresh Babu",
      designation: "Section Officer",
      intercom: "314",
      phone: "011-24360820",
      email: "so-cp[at]nic[dot]in",
      address: "Room No. 118, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
    {
      name: "Shabnam Khatoon",
      designation: "Research Officer",
      intercom: "317",
      phone: "011-24360824",
      email: "ro-cp[at]nic[dot]in",
      address: "Room No. 121, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
    },
  ],
};

/**
 * Office-holders — the senior post-holders a body publishes above its telephone directory.
 * whos-who renders these; the directory pages render SECRETARIAT.
 *
 * They are kept as a separate record rather than folded into one list per body, because the
 * two sets disagree and merging them would assert something untrue:
 *
 *   • NCBC has two different Secretaries — Ms. Meeta Rajivlochan here, Renuka Patil in the
 *     directory. Both cannot hold the post.
 *   • Dr. Virendra Kumar appears in both, spelled differently ("Dr. Virendra Kumar" vs
 *     "Dr. Virendra Kumar, HMSJE"), as does Hansraj Gangaram Ahir ("Shri" prefix).
 *   • DAIC's two sets share no one at all: a Director General here, a Member Secretary there.
 *
 * The office-holders are real, externally checkable people; the secretariat rows are mock.
 * Reconciling them is a content decision, not a refactor, so nothing has been merged and no
 * rendered page changed. Resolve it and these two records can become one.
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

/** Officials of one body, or an empty list when it publishes no directory. */
export function getOfficials(ownerId: string): Official[] {
  return OFFICIALS[ownerId] ?? [];
}

/**
 * The first `count` officials of a body — what a preview surface such as whos-who shows
 * above its "View All" link. Order is the published order, which is seniority.
 */
export function getOfficialsPreview(ownerId: string, count = 4): Official[] {
  return getOfficials(ownerId).slice(0, count);
}

/** Senior post-holders of one body — what whos-who shows above its "View All" link. */
export function getOfficeHolders(ownerId: string): Official[] {
  return OFFICE_HOLDERS[ownerId] ?? [];
}

/** Bodies that publish office-holders, in registry order. */
export const BODIES_WITH_OFFICE_HOLDERS = Object.keys(OFFICE_HOLDERS);
