import type {
  ActivityItem,
  AdminUser,
  AssistedDevice,
  EventRow,
  Facility,
  IpsrcHome,
  SageApplication,
  VolunteerRow,
} from "./types";

// ---------------------------------------------------------------------------
// Data captured verbatim from the SCW UAT portals (visual-replica mock data).
// ---------------------------------------------------------------------------

export const DASHBOARD_STATS = {
  totalPledges: "5,22,113",
  volunteerRegistrations: "356",
  sageApplications: "407",
};

export const SAGE_APPLICATIONS: SageApplication[] = [
  { id: "sage00763", organisation: "iuutrt", date: "8 Jun 2026", status: "Approved" },
  { id: "sage00762", organisation: "Swabhimaan Eldertech Private Limited", date: "7 Apr 2026", status: "Awaiting Evaluation" },
  { id: "sage00761", organisation: "Vectorise Global Private Limited", date: "22 Mar 2026", status: "Awaiting Evaluation" },
  { id: "sage00760", organisation: "HattaKatta Tech Private Limited", date: "27 Feb 2026", status: "Awaiting Evaluation" },
  { id: "sage00759", organisation: "Izuv Solutions", date: "26 Feb 2026", status: "Awaiting Evaluation" },
  { id: "sage00758", organisation: "Cettlx Services Pvt Ltd", date: "12 Feb 2026", status: "Awaiting Evaluation" },
  { id: "sage00757", organisation: "VASUDHAIVA KUTUMBAKAM SOFTWARE SOLUTIONS PRIVATE LIMITED", date: "12 Feb 2026", status: "Awaiting Evaluation" },
  { id: "sage00756", organisation: "NANO PHYTO CARE PRIVATE LIMITED", date: "10 Feb 2026", status: "Awaiting Evaluation" },
  { id: "sage00755", organisation: "Chaperone Services", date: "4 Feb 2026", status: "Awaiting Evaluation" },
  { id: "sage00754", organisation: "NEERA TECHNOLOGIES PRIVATE LIMITED", date: "1 Feb 2026", status: "Awaiting Evaluation" },
];

export const SAGE_TOTAL = 407;

// Detail record for a single SAGE application (Swabhimaan Eldertech) — 5 tabs.
export const SAGE_DETAIL = {
  organisation: "Swabhimaan Eldertech Private Limited",
  status: "Awaiting Evaluation" as const,
  submitted: "07 Apr 2026",
  updated: "15 May 2026",
  company: [
    ["Email", "rv@swabhimaan.co.in"],
    ["Dipp Id", "DIPP206659"],
    ["Incubated", "Yes"],
    ["Any Funded", "-"],
    ["Court Case", "-"],
    ["Investment", "100000"],
    ["Website Url", "https://swabhimaan.co.in/"],
    ["Blacklisted", "-"],
    ["Company Name", "Swabhimaan Eldertech Private Limited"],
    ["Founder Name", "Rakesh Vanarse"],
    ["Service Cast", "-"],
    ["Founder Mobile", "9223466218"],
    ["Loan From Banks", "0"],
    ["Paid Up Capital", "-"],
    ["Type Of Company", "1"],
    ["Application Id", "S26270136"],
    ["Investor Pitch", "69d4ba0a700b6_91bEggjd9soMc51muJVWdIuLmR2.pdf"],
    ["Origin Country", "India"],
    ["Co Founder Mobile", "9867410029"],
    ["Incubator Details", "Launchpad 29, NSRCEL, IIM, Bangalore"],
    ["Number Of Employees", "2"],
    ["Operation Since Year", "2025"],
    ["Registered With D I P P", "Yes"],
    ["Date Of Incorporation", "2025-05-27"],
    ["Why Funds Required", "For Business Operations to acquire 1,000 User and 200 Sellers."],
    ["Objective Strategy", "To provide Senior Citizens Homes for 24x7 Care, Comfort, Convenience and Safety, Security and Support"],
    ["Registered Office Address", "J 263, Tarapore Garden CHS, Oshiwara, Mumbai 400053"],
    ["Authorised Representative", "Yes"],
  ] as [string, string][],
  product: [
    ["Proposed", "25000 per month upwards"],
    ["Launch Year", "2025"],
    ["Popularity", "We have launched in May 2025. We have over 450 Qualified Leads."],
    ["Description", "Senior Citizens Homes and Stays Booking platform for Independent Living, Assisted Living and related areas"],
    ["Product Name", "Swabhimaan Senior Citizens Homes And Stays"],
    ["Achievements", "We have Validation with over 450 Qualified Leads"],
    ["Major Features", "Web Based, Scalable"],
    ["Target Audience", "B2C"],
    ["Technology Used", "Website"],
    ["Total Customers", "0"],
    ["Customer Support", "Yes"],
    ["Is Copyright Patent", "No"],
    ["Product Technology", "Website and App upcoming"],
    ["Runs Independently", "Yes"],
    ["Uses Proprietary Tech", "Yes"],
    ["Countries Implemented", "India"],
    ["Infrastructure Details", "Smart phone, Laptop or Tab"],
    ["Minimum Infrastructure", "Based out of Oshiwara, Mumbai"],
    ["Unique Selling Proposition", "Booking site for Senior Homes, 6,80,000 Seeking Rental Homes Option, MVP, Pre-seed and Pre-Revenue"],
    ["Requires Trained Facilitators", "Yes"],
  ] as [string, string][],
};

export const RECENT_ACTIVITY: ActivityItem[] = [
  { text: "SAGE application of {{e}} has been approved.", emphasis: "HSAGE976152", when: "6 days ago" },
  { text: "New SAGE application ({{e}}) submitted awaiting evaluation.", emphasis: "HSAGE976152", when: "6 days ago" },
  { text: "Volunteer application of {{e}} has been approved.", emphasis: "Mallu Vikram Sai Reddy", when: "16 days ago" },
  { text: "{{e}} successfully registered as an active Volunteer.", emphasis: "Mallu Vikram Sai Reddy", when: "16 days ago" },
  { text: "{{e}} has taken the pledge.", emphasis: "Akshay", when: "17 days ago" },
];

export const ADMIN_USERS: AdminUser[] = [
  { name: "Rohit Jain", mobile: "7300133251", email: "ssraj.sje@rajasthan.gov.in", role: "Nodal Officer" },
  { name: "Charanjeet Singh Mann", mobile: "9417677900", email: "jd.ss@punjab.gov.in", role: "Nodal Officer" },
  { name: "Mr Lalramchuanzela", mobile: "9862558637", email: "missionfoundation2013@gmail.com", role: "Nodal Officer" },
  { name: "Dishank", mobile: "9971350240", email: "ba2.dosje-dl@govcontractor.in", role: "Nodal Officer" },
  { name: "Ashish", mobile: "9451227223", email: "prog.dosje-dl@supportgov.in", role: "Nodal Officer" },
  { name: "Ipsito Chakravarty", mobile: "9051772156", email: "ipsito1234@gmail.com", role: "Nodal Officer" },
  { name: "Priya pilli", mobile: "9888888888", email: "priya@gmail.com", role: "Nodal Officer" },
  { name: "PRASANA KUMAR LIMMA", mobile: "7319532823", email: "prasanakumarlimma@gmail.com", role: "Nodal Officer" },
  { name: "Gurudayal Shah", mobile: "7835945603", email: "gurdayal.shah@nic.in", role: "Nodal Officer" },
  { name: "Mrs Nilima Mahesh Yetkar", mobile: "9820874622", email: "cssc.nsp50@gmail.com", role: "Nodal Officer" },
];
export const USERS_TOTAL = 35;

export const VOLUNTEERS: VolunteerRow[] = [
  { id: "LGVOL000356", name: "Mallu Vikram Sai Reddy", type: "INDIVIDUAL", date: "29 May 2026", status: "Approved" },
  { id: "LGVOL000355", name: "Keerthivasa", type: "INDIVIDUAL", date: "19 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000354", name: "Nikhil Kumar", type: "INDIVIDUAL", date: "18 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000353", name: "Padmakar", type: "INDIVIDUAL", date: "18 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000352", name: "KoushikBarman", type: "INDIVIDUAL", date: "18 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000351", name: "Shrutika Rassay", type: "INDIVIDUAL", date: "16 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000350", name: "Zahid Ayoub", type: "INDIVIDUAL", date: "16 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000349", name: "DIPESH", type: "INDIVIDUAL", date: "16 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000348", name: "SAYYED YASIN", type: "INDIVIDUAL", date: "16 Apr 2026", status: "Awaiting Evaluation" },
  { id: "LGVOL000347", name: "Abhay Ram", type: "INDIVIDUAL", date: "15 Apr 2026", status: "Awaiting Evaluation" },
];
export const VOLUNTEERS_TOTAL = 356;

export const VOLUNTEER_DETAIL = {
  name: "Keerthivasa",
  type: "INDIVIDUAL",
  gender: "Male",
  dob: "-",
  status: "Awaiting Evaluation" as const,
  address: "No 1 Gomathi illam, singaravellar road, karaikalmedu, karaikal",
  state: "Telangana",
  district: "-",
  pincode: "609605",
  mobile: "7639223073",
  email: "keerthi2006kv@gmail.com",
  interests: ["Meal Delivery"],
  submitted: "19 Apr 2026",
};

export const EVENTS: EventRow[] = [
  { sno: 1, name: "Bengali New year", start: "15 Apr 2026, 09:16 pm", end: "—", hours: "—", address: "Kolkata howrah West Bengal" },
  { sno: 2, name: "Sensitisation and awareness activities", start: "24 Mar 2026, 03:30 pm", end: "—", hours: "—", address: "DC Complex, SAS Nagar" },
  { sno: 3, name: "One Day Programme for staff of NGOs, senior citizen hom", start: "23 Mar 2026, 04:30 pm", end: "—", hours: "—", address: "High school veng, Mamit" },
  { sno: 4, name: "02 Day Training of Functionaries of Senior Citizen Home", start: "22 Mar 2026, 04:30 pm", end: "—", hours: "—", address: "GNB Rd, Tinsukia, Assam" },
  { sno: 5, name: "Intergenerational and Bonding activities conducted unde", start: "21 Mar 2026, 03:30 pm", end: "—", hours: "—", address: "DC Complex, Barnala" },
  { sno: 6, name: "Kinetic and Mental Skill Improvement programme conducte", start: "21 Mar 2026, 03:30 pm", end: "—", hours: "—", address: "DC Complex, Barnala" },
  { sno: 7, name: "Intergenerational Bonding activities under Sade Buzurg", start: "20 Mar 2026, 03:30 pm", end: "—", hours: "—", address: "DC Complex, Bathinda" },
  { sno: 8, name: "Productive and Traditional Ageing Camp under Sade Buzur", start: "20 Mar 2026, 03:30 pm", end: "—", hours: "—", address: "DC Complex, Bathinda" },
  { sno: 9, name: "Productive and Traditional Ageing Camp under Sade Buzur", start: "19 Mar 2026, 03:30 pm", end: "—", hours: "—", address: "DC Complex" },
  { sno: 10, name: "Job60+ Mini Job Fair for senior citizen", start: "18 Mar 2026, 05:53 pm", end: "—", hours: "—", address: "Silver Jubilee hall, Malleshwaram" },
];
export const EVENTS_TOTAL = 234;

export const FACILITY_TYPES = [
  "Continuous Care Homes",
  "Mobile Medicare Units",
  "Physiotherapy Clinics",
  "Senior Citizen Homes",
];

export const IPSRC_HOMES: IpsrcHome[] = [
  { ngo: "Grassroot Outreach", projectType: "Physiotherapy Clinics", state: "Tamil Nadu", district: "Tiruvannamalai", address: "8, Ground Floor, Boopalan Advocate Building, Municipal Element" },
  { ngo: "Centre For Rehabilitation", projectType: "Physiotherapy Clinics", state: "Odisha", district: "Bhadrak", address: "4508/6775, Ground Floor, Backside of Old Dalda factory, Daha" },
  { ngo: "Eco Club", projectType: "Physiotherapy Clinics", state: "Haryana", district: "Bhiwani", address: "HOUSE, GROUND, BUILDING, SIWANI MANDI, WARD NO 12, NEAR" },
  { ngo: "Seulipur Udayan Club", projectType: "Mobile Medicare Units", state: "West Bengal", district: "Purba Medinipur", address: "61, Ground Floor, KakraTarunSangha Nillkanth" },
  { ngo: "Madhar Nala Thondu", projectType: "Mobile Medicare Units", state: "Tamil Nadu", district: "Cuddalore", address: "3, 1, Murugalaya Mandabam, Padhirikuppam, Cuddalore" },
  { ngo: "Calcutta Metropolitan", projectType: "Mobile Medicare Units", state: "West Bengal", district: "Kolkata", address: "E/1, 1st, Sopan Kutir, Beliaghata Post Office, Beliaghata" },
  { ngo: "Indiramma Mahila Mandali", projectType: "Mobile Medicare Units", state: "Andhra Pradesh", district: "Nellore", address: "16-11-235, Ground Floor, Caring Hands Building" },
  { ngo: "People's Action For Social Service", projectType: "Mobile Medicare Units", state: "Andhra Pradesh", district: "Chittoor", address: "000, Ground floor, Damalacheruvu, Chukkavaripalli" },
  { ngo: "Bhartiya Aushadhi Anusandhan Sanstha", projectType: "Mobile Medicare Units", state: "Maharashtra", district: "Bhandara", address: "26, Ist Floor, Dr. Wankhede Building, Near sambhaji nagar" },
  { ngo: "Kalaiselvi Karunalaya Social Service Society", projectType: "Mobile Medicare Units", state: "Tamil Nadu", district: "Chennai", address: "PP1, Ground Floor, Individual Building, MGR Street" },
];
export const IPSRC_TOTAL = 732;

export const ASSISTED_DEVICES: AssistedDevice[] = [
  { title: "Hearing Kit", description: "Hearing kit", active: true },
  { title: "Hand stick", description: "Quality walking device", active: true },
  { title: "जेल फोम कुशन", description: "वर्णन यह उन वरिष्ठ नागरिकों के लिए उपयोगी है जिन्हें लंबे समय तक जगह पर बैठना पड़ता है, या संवेदनशील त्वचा या व्हील चेयर उपयोगकर्ता के लिए उपयोगी है। दबाव दर्द को रोकें अधिकतम आराम के लिए दोहरी परत सॉफ्ट जेल बीन्स की विशेषताएँ।", active: true },
  { title: "कमोड के साथ मोड़ने वाली कुर्सी", description: "यह वरिष्ठ नागरिकों के लिए उपयोगी है जो बिस्तर पर हैं और भारतीय शैली के शौचालय का उपयोग नहीं कर सकते हैं। फोल्डेबल डिजाइन जगह बचाता है और परिवहन को आसान बनाता है।", active: true },
  { title: "फूट केअर किट", description: "मधुमेह, न्यूरोपॅथिक आणि संधिवात ग्रस्त व्यक्तींमुळे पाय आणि घोट्यात अल्सर/दुखी असलेल्या ज्येष्ठ नागरिकांसाठी फूट केअर किट डिझाइन केलेले.", active: true },
  { title: "ವೀಲ್‌ಚೇರ್‌ಗಳು (ಕಮೋಡ್‌ನೊಂದಿಗೆ ಮಡಿಸುವ)", description: "ಹಾಸಿಗೆ ಹಿಡಿದಿರುವ / ಸಹಾಯಕ ಸಾಧನಗಳೊಂದಿಗೆ ನಡೆಯಲು ಸಾಧ್ಯವಾಗದ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಉಪಯುಕ್ತವಾಗಿದೆ.", active: true },
  { title: "વ્હીલચેર ફોલ્ડિંગ", description: "પરિમાણો: એકંદર લંબાઈ: 1000-1100 મીમી એકંદર પહોળાઈ (ખુલ્લી): 650-720 મીમી. સખત અને મજબૂત ટ્યુબ્યુલર બાંધકામ, લિંક પ્રકાર ફોલ્ડિંગ મિકેનિઝમ.", active: true },
  { title: "হাঁটু বন্ধনী", description: "মাত্রা: দৈর্ঘ্য : 440 মিমি প্রস্থ : 250 মিমি উদ্দেশ্য ব্যবহার: পলিসেন্ট্রিক, নাইলন ওয়েবিং হাঁটু জয়েন্ট হালকা হাঁটুর বাতের ব্যথা এবং ফোলাতে সাহায্য করে।", active: true },
  { title: "কাণৰ শ্ৰৱণ সহায়ক (Type III)", description: "কম ওজনৰ আৰু ব্যৱহাৰকাৰী-অনুকূল শ্ৰৱণ সহায়ক গুৰুতৰ শ্ৰৱণ ক্ষমতা হ্ৰাস হোৱা ব্যক্তিসকলৰ বাবে উপযুক্ত।", active: true },
  { title: "Wheelchair Folding", description: "Quality folding wheelchair with removable commode for bed-ridden senior citizens.", active: false },
];
export const DEVICES_TOTAL = 223;

export const FACILITIES: Facility[] = [
  { category: "Senior Citizen Homes", name: "Rupa Educational Society", address: "26-3-2135, Ground Floor, Near Srinivasa ITI College, Modugapalle, Hindupur Near Srinivasa ITI College - 515201", distance: "1642.1 KM" },
  { category: "Senior Citizen Homes", name: "Sree Venkateswara Convent Educational Society", address: "26-4-812, Ground Floor, Building, Near ERTC Busstand, Balajinagar, Hindupur Near ERTC Busstand - 515201", distance: "1645.3 KM" },
  { category: "Mobile Medicare Units", name: "Calcutta Metropolitan", address: "E/1, 1st Floor, Sopan Kutir, Beliaghata Post Office, Beliaghata, Kolkata - 700010", distance: "1789.4 KM" },
  { category: "Physiotherapy Clinics", name: "Grassroot Outreach", address: "8, Ground Floor, Boopalan Advocate Building, Municipal Element, Tiruvannamalai - 606601", distance: "1820.7 KM" },
  { category: "Continuous Care Homes", name: "Kalaiselvi Karunalaya Social Service Society", address: "PP1, Ground Floor, Individual Building, MGR Street, Chennai - 600001", distance: "1901.2 KM" },
];

export const FACILITY_LEGEND = [
  { label: "Senior Citizen Homes", count: 699, color: "var(--ds-chart-cat-1)" },
  { label: "Continuous Care Homes", count: 13, color: "var(--ds-chart-cat-3)" },
  { label: "Mobile Medicare Units", count: 17, color: "var(--ds-chart-cat-2)" },
  { label: "Physiotherapy Clinics", count: 3, color: "var(--ds-chart-cat-4)" },
];

export const VOLUNTEER_INTERESTS = [
  "Digital Literacy Training",
  "Companionship & Reading",
  "Meal Delivery",
  "Healthcare & Mobility Support",
  "Administrative Support",
  "Event Assistance",
  "Transportation Assistance",
  "Others",
];

export const PLEDGE_POINTS = [
  "I pledge to respect love and care for the senior citizens in my family and community throughout my life.",
  "I promise to treat senior citizens with kindness and empathy.",
  "I will respect their knowledge and experience, and is fully committed to being their voice and in supporting them in their efforts.",
  "I am committed to creating awareness about their rights, interests and fighting against mistreatment of our elders.",
  "Let us together resolve to create a supportive and inclusive society for our senior citizens, where they can live with respect love and dignity.",
];
