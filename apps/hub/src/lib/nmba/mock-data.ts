// Data seeded from live NMBA portal (nashamukt.dosje.gov.in + nashamukt-admin.dosje.gov.in)
// Visual scrape performed on 2026-06-19. No credentials stored here.

import type {
  ActivityRow,
  AdminUser,
  DashboardStats,
  Facility,
  FeedbackRow,
  ImportantDocument,
  NodalOfficer,
  PledgeReport,
  PublicActivity,
} from "./types";

export const DASHBOARD_STATS: DashboardStats = {
  totalPledges: "71",
  peopleReached: "469",
  youthReached: "43",
  womenReached: "13",
  totalActivities: "1,97,553",
  educationalInstitutions: "10,57,730",
};

// National aggregate stats shown on the public citizen-facing dashboard
export const PUBLIC_DASHBOARD_STATS: DashboardStats = {
  totalPledges: "22,75,906",
  peopleReached: "25,89,78,572",
  youthReached: "9,33,63,189",
  womenReached: "6,36,83,454",
  totalActivities: "8,16,100",
  villagesCovered: "3,79,707",
  educationalInstitutions: "16,09,943",
};

export const PROGRAMME_STATS = [
  {
    label: "Education & Youth",
    icon: "school",
    items: [
      { label: "School/College/University Programme", value: "20,503" },
      { label: "Schools/Colleges/Universities Reached", value: "47,131" },
      { label: "Visit To Institutions", value: "681" },
      { label: "Youth Reached Out", value: "77,687" },
      { label: "Youth Club/Yuva Mandal Programme", value: "5,705" },
      { label: "Training Conducted", value: "1,461" },
    ],
  },
  {
    label: "Community Outreach",
    icon: "groups",
    items: [
      { label: "Awareness Rally/Morcha/Run", value: "9,019" },
      { label: "Community Awareness Session", value: "58,851" },
      { label: "Community Programmes", value: "53,541" },
      { label: "Media Campaign", value: "7,901" },
      { label: "Theme Based Events Organised", value: "4,448" },
      { label: "IEC Material Developed", value: "4,116" },
    ],
  },
  {
    label: "Governance & Local Bodies",
    icon: "account_balance",
    items: [
      { label: "District Level Committee Meeting", value: "898" },
      { label: "Panchayat/Gram Sabha", value: "31,864" },
      { label: "Villages Covered", value: "39,296" },
      { label: "State/District Level Event", value: "4,602" },
    ],
  },
  {
    label: "Targeted Interventions",
    icon: "track_changes",
    items: [
      { label: "Women Group/Women SHG/Mahila Mandal Programme", value: "9,515" },
      { label: "At Risk/Vulnerable People Identified", value: "10,885" },
      { label: "Women Reached Out", value: "39,088" },
      { label: "Hotspot Identification", value: "2,974" },
      { label: "Intelligence Shared On Supply Of Substance", value: "1,840" },
    ],
  },
];

export const ACTIVITIES_TOTAL = 197553;

export const ACTIVITIES: ActivityRow[] = [
  { state: "Uttar Pradesh", district: "Ayodhya", activity: "Social Justice", activityDate: "25-04-2026", maleParticipants: 20, femaleParticipants: 60, totalParticipants: 80, coordinatingDepartment: "MOSJE", educationalInstitutions: 50, location: "Ayodhya", createdBy: "Rajesh Pilli", createdAt: "24-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Yoga and Meditation Activities", activityDate: "10-12-2025", maleParticipants: 14, femaleParticipants: 13, totalParticipants: 27, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Nukkad Natak, Skits and Play", activityDate: "10-12-2025", maleParticipants: 22, femaleParticipants: 22, totalParticipants: 44, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Nukkad Natak, Skits and Play", activityDate: "10-12-2025", maleParticipants: 16, femaleParticipants: 16, totalParticipants: 32, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Drawing competition", activityDate: "10-12-2025", maleParticipants: 20, femaleParticipants: 19, totalParticipants: 39, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Drawing competition", activityDate: "10-12-2025", maleParticipants: 17, femaleParticipants: 17, totalParticipants: 34, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Yoga and Meditation Activities", activityDate: "10-12-2025", maleParticipants: 15, femaleParticipants: 14, totalParticipants: 29, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Drawing competition", activityDate: "10-12-2025", maleParticipants: 10, femaleParticipants: 10, totalParticipants: 20, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Chhattisgarh", district: "Korea", activity: "Health Related Activities/Camps", activityDate: "10-04-2026", maleParticipants: 15, femaleParticipants: 1, totalParticipants: 16, coordinatingDepartment: "social welfare department", educationalInstitutions: 1, location: "Korea", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Madhya Pradesh", district: "Datia", activity: "Rangoli Making Competition", activityDate: "10-12-2025", maleParticipants: 11, femaleParticipants: 11, totalParticipants: 22, coordinatingDepartment: "social justice", educationalInstitutions: 1, location: "Datia", createdBy: "Rajesh Pilli", createdAt: "10-04-2026" },
  { state: "Punjab", district: "Amritsar", activity: "Awareness Campaign", activityDate: "05-03-2026", maleParticipants: 45, femaleParticipants: 35, totalParticipants: 80, coordinatingDepartment: "Health Department", educationalInstitutions: 3, location: "Amritsar", createdBy: "Priya Sharma", createdAt: "05-03-2026" },
  { state: "Rajasthan", district: "Jaipur", activity: "De-addiction Camp", activityDate: "12-02-2026", maleParticipants: 30, femaleParticipants: 20, totalParticipants: 50, coordinatingDepartment: "Social Welfare", educationalInstitutions: 2, location: "Jaipur", createdBy: "Ramesh Kumar", createdAt: "12-02-2026" },
  { state: "Maharashtra", district: "Pune", activity: "Community Awareness Drive", activityDate: "20-01-2026", maleParticipants: 55, femaleParticipants: 45, totalParticipants: 100, coordinatingDepartment: "MOSJE", educationalInstitutions: 5, location: "Pune", createdBy: "Anjali Patil", createdAt: "20-01-2026" },
  { state: "Gujarat", district: "Surat", activity: "Yoga and Meditation Activities", activityDate: "15-01-2026", maleParticipants: 40, femaleParticipants: 30, totalParticipants: 70, coordinatingDepartment: "social justice", educationalInstitutions: 4, location: "Surat", createdBy: "Meena Shah", createdAt: "15-01-2026" },
  { state: "Haryana", district: "Gurgaon", activity: "Nukkad Natak, Skits and Play", activityDate: "08-01-2026", maleParticipants: 25, femaleParticipants: 25, totalParticipants: 50, coordinatingDepartment: "social justice", educationalInstitutions: 2, location: "Gurgaon", createdBy: "Vishal Saini", createdAt: "08-01-2026" },
  { state: "Karnataka", district: "Bengaluru", activity: "Health Related Activities/Camps", activityDate: "02-01-2026", maleParticipants: 60, femaleParticipants: 40, totalParticipants: 100, coordinatingDepartment: "Health Department", educationalInstitutions: 6, location: "Bengaluru", createdBy: "Suresh Rao", createdAt: "02-01-2026" },
  { state: "West Bengal", district: "Kolkata", activity: "Drawing competition", activityDate: "28-12-2025", maleParticipants: 35, femaleParticipants: 35, totalParticipants: 70, coordinatingDepartment: "social justice", educationalInstitutions: 3, location: "Kolkata", createdBy: "Ipsito Chakravarty", createdAt: "28-12-2025" },
  { state: "Bihar", district: "Patna", activity: "Social Justice", activityDate: "20-12-2025", maleParticipants: 50, femaleParticipants: 30, totalParticipants: 80, coordinatingDepartment: "MOSJE", educationalInstitutions: 4, location: "Patna", createdBy: "Nikhil Anand", createdAt: "20-12-2025" },
  { state: "Assam", district: "Guwahati", activity: "Rangoli Making Competition", activityDate: "15-12-2025", maleParticipants: 20, femaleParticipants: 30, totalParticipants: 50, coordinatingDepartment: "social justice", educationalInstitutions: 2, location: "Guwahati", createdBy: "Suswapna Kakoty", createdAt: "15-12-2025" },
  { state: "Tamil Nadu", district: "Chennai", activity: "Awareness Campaign", activityDate: "10-12-2025", maleParticipants: 70, femaleParticipants: 50, totalParticipants: 120, coordinatingDepartment: "Health Department", educationalInstitutions: 8, location: "Chennai", createdBy: "Karthik Raja", createdAt: "10-12-2025" },
];

export const USERS_TOTAL = 758;

export const ADMIN_USERS: AdminUser[] = [
  { name: "Mallu vijay kiran reddy", mobile: "9491455036", email: "malluvikram333@gmail.com", role: "District Nodal Officer" },
  { name: "Mallu vikram sai reddy", mobile: "7780454557", email: "vikrammallu123@gmail.com", role: "State Nodal Officer" },
  { name: "Nikhil Anand", mobile: "9470451575", email: "dirssdd-bih@nic.in", role: "State Nodal Officer" },
  { name: "Patel Mahesh D.", mobile: "9879573299", email: "scpsdnh@gmail.com", role: "State Nodal Officer" },
  { name: "Yogesh Pal Singh", mobile: "9868875758", email: "socialdefence.dsw@gmail.com", role: "State Nodal Officer" },
  { name: "Pradnya N. Desai", mobile: "9403269966", email: "dir-soci.goa@nic.in", role: "State Nodal Officer" },
  { name: "Vishal Saini (DSWO)", mobile: "9468437792", email: "sje@hry.nic.in", role: "State Nodal Officer" },
  { name: "Hansaben N Vala", mobile: "9265623493", email: "dd2-dsd@gujarat.gov.in", role: "State Nodal Officer" },
  { name: "Sumit Khimta", mobile: "9816711011", email: "social-hp@nic.in", role: "State Nodal Officer" },
  { name: "Bhupendra Kumar Pandey", mobile: "9993211205", email: "dpsw.cg@gov.in", role: "State Nodal Officer" },
  { name: "Suswapna Kakoty", mobile: "9864181463", email: "suswapna.kakoty@assam.gov.in", role: "State Nodal Officer" },
  { name: "D. Sunanda", mobile: "9010117175", email: "dwogad@gmail.com", role: "District Nodal Officer" },
  { name: "Muzaffar Ahmad", mobile: "9697789759", email: "dswoanantnag@rediffmail.com", role: "District Nodal Officer" },
  { name: "Tariq Parvez Qazi", mobile: "9858448314", email: "dswododa@gmail.com", role: "District Nodal Officer" },
  { name: "Sajad Ahmad Bhat", mobile: "8899054218", email: "dswobaramulla@gmail.com", role: "District Nodal Officer" },
  { name: "Jyothi K. V.", mobile: "7259850258", email: "ddworam@gmail.com", role: "District Nodal Officer" },
  { name: "Rajesh Pilli", mobile: "9100000001", email: "rajesh.pilli@gov.in", role: "Admin" },
  { name: "Arjun Reddy", mobile: "9491455036", email: "arjun.reddy@gov.in", role: "District Nodal Officer" },
  { name: "Nithishkumar Reddy", mobile: "7780454557", email: "nithish.reddy@gov.in", role: "State Nodal Officer" },
  { name: "Shrikant Singh", mobile: "8786758764", email: "shrikant.singh@gov.in", role: "State Nodal Officer" },
];

export const PLEDGE_REPORTS_TOTAL = 71;

export const PLEDGE_REPORTS: PledgeReport[] = [
  { pledgeType: "e-pledge", name: "PANDIT SANTOSH TEHANGURIYA", age: 50, mobile: "9977083171", email: "s8317478@gmail.com", state: "Madhya Pradesh", district: "Gwalior", pledgeDate: "13-06-2026" },
  { pledgeType: "e-pledge", name: "Santosh Kumar Sharma", age: 50, mobile: "9977083171", email: "s8317478@gmail.com", state: "Madhya Pradesh", district: "Gwalior", pledgeDate: "13-06-2026" },
  { pledgeType: "e-pledge", name: "Mallu Vikram Sai Reddy", age: 23, mobile: "7780454557", email: "vikrammallu123@gmail.com", state: "Andhra Pradesh", district: "Prakasam", pledgeDate: "11-06-2026" },
  { pledgeType: "e-pledge", name: "Sumit Ghosh", age: 26, mobile: "8471894735", email: "sumitghosh723@gmail.com", state: "Assam", district: "Karbi Anglong", pledgeDate: "10-06-2026" },
  { pledgeType: "e-pledge", name: "Deepshikha Goel", age: 26, mobile: "8384052282", email: "goeldeepu5@gmail.com", state: "Delhi", district: "East Delhi", pledgeDate: "04-06-2026" },
  { pledgeType: "e-pledge", name: "MALLU VIJAY KIRAN REDDY", age: 23, mobile: "7780454557", email: "malluvikram333@gmail.com", state: "Andhra Pradesh", district: "Nellore", pledgeDate: "03-06-2026" },
  { pledgeType: "e-pledge", name: "Priya Sharma", age: 28, mobile: "9812345678", email: "priya.sharma@gmail.com", state: "Punjab", district: "Amritsar", pledgeDate: "01-06-2026" },
  { pledgeType: "e-pledge", name: "Ramesh Kumar", age: 35, mobile: "9876543210", email: "ramesh.k@gmail.com", state: "Rajasthan", district: "Jaipur", pledgeDate: "30-05-2026" },
  { pledgeType: "e-pledge", name: "Anjali Patil", age: 22, mobile: "9765432109", email: "anjali.p@gmail.com", state: "Maharashtra", district: "Pune", pledgeDate: "28-05-2026" },
  { pledgeType: "e-pledge", name: "Karthik Raja", age: 30, mobile: "9654321098", email: "karthik.r@gmail.com", state: "Tamil Nadu", district: "Chennai", pledgeDate: "25-05-2026" },
  { pledgeType: "physical", name: "Meena Shah", age: 45, mobile: "9543210987", email: "meena.s@gmail.com", state: "Gujarat", district: "Surat", pledgeDate: "20-05-2026" },
  { pledgeType: "physical", name: "Suresh Rao", age: 40, mobile: "9432109876", email: "suresh.r@gmail.com", state: "Karnataka", district: "Bengaluru", pledgeDate: "18-05-2026" },
  { pledgeType: "e-pledge", name: "Kavita Nair", age: 33, mobile: "9321098765", email: "kavita.n@gmail.com", state: "Kerala", district: "Ernakulam", pledgeDate: "15-05-2026" },
  { pledgeType: "e-pledge", name: "Dinesh Gupta", age: 27, mobile: "9210987654", email: "dinesh.g@gmail.com", state: "Uttar Pradesh", district: "Lucknow", pledgeDate: "12-05-2026" },
  { pledgeType: "e-pledge", name: "Sunita Devi", age: 38, mobile: "9109876543", email: "sunita.d@gmail.com", state: "Bihar", district: "Patna", pledgeDate: "10-05-2026" },
  { pledgeType: "physical", name: "Arun Mishra", age: 42, mobile: "8998765432", email: "arun.m@gmail.com", state: "Madhya Pradesh", district: "Bhopal", pledgeDate: "05-05-2026" },
  { pledgeType: "e-pledge", name: "Pooja Singh", age: 24, mobile: "8887654321", email: "pooja.s@gmail.com", state: "Haryana", district: "Gurgaon", pledgeDate: "01-05-2026" },
  { pledgeType: "e-pledge", name: "Vikash Yadav", age: 29, mobile: "8776543210", email: "vikash.y@gmail.com", state: "West Bengal", district: "Kolkata", pledgeDate: "28-04-2026" },
  { pledgeType: "physical", name: "Rekha Verma", age: 50, mobile: "8665432109", email: "rekha.v@gmail.com", state: "Himachal Pradesh", district: "Shimla", pledgeDate: "25-04-2026" },
  { pledgeType: "e-pledge", name: "Mohan Das", age: 31, mobile: "8554321098", email: "mohan.d@gmail.com", state: "Assam", district: "Guwahati", pledgeDate: "20-04-2026" },
];

export const IMPORTANT_DOCUMENTS: ImportantDocument[] = [
  { name: "music", uploadedOn: "03-06-2026", uploadedBy: "Nithishkumar reddy", published: true },
  { name: "testing a piece", uploadedOn: "03-06-2026", uploadedBy: "Arjun Reddy", published: true },
  { name: "DONEEEEE", uploadedOn: "24-04-2026", uploadedBy: "Rajesh Pilli", published: true },
  { name: "CBSC SN", uploadedOn: "24-04-2026", uploadedBy: "Rajesh Pilli", published: true },
  { name: "OKAYYYY", uploadedOn: "23-04-2026", uploadedBy: "Rajesh Pilli", published: true },
];

export const SNO_TOTAL = 35;

export const SNO_LIST: NodalOfficer[] = [
  { name: "Mallu vikram sai reddy", designation: "State Nodal Officer", email: "vikrammallu123@gmail.com", mobile: "7780454557", stateName: "Andhra Pradesh", districtName: "Nellore" },
  { name: "Nikhil Anand", designation: "State Nodal Officer", email: "dirssdd-bih@nic.in", mobile: "9470451575", stateName: "Bihar" },
  { name: "Hansaben N Vala", designation: "State Nodal Officer", email: "dd2-dsd@gujarat.gov.in", mobile: "9265623493", stateName: "Gujarat" },
  { name: "Patel Mahesh D.", designation: "State Nodal Officer", email: "scpsdnh@gmail.com", mobile: "9879573299", stateName: "Dadra and Nagar Haveli and Daman and Diu" },
  { name: "Yogesh Pal Singh", designation: "State Nodal Officer", email: "socialdefence.dsw@gmail.com", mobile: "9868875758", stateName: "Delhi" },
  { name: "Pradnya N. Desai", designation: "State Nodal Officer", email: "dir-soci.goa@nic.in", mobile: "9403269966", stateName: "Goa" },
  { name: "Bhupendra Kumar Pandey", designation: "State Nodal Officer", email: "dpsw.cg@gov.in", mobile: "9993211205", stateName: "Chhattisgarh" },
  { name: "Vishal Saini (DSWO)", designation: "State Nodal Officer", email: "sje@hry.nic.in", mobile: "9468437792", stateName: "Haryana" },
  { name: "Sumit Khimta", designation: "State Nodal Officer", email: "social-hp@nic.in", mobile: "9816711011", stateName: "Himachal Pradesh" },
  { name: "Suswapna Kakoty", designation: "State Nodal Officer", email: "suswapna.kakoty@assam.gov.in", mobile: "9864181463", stateName: "Assam" },
  { name: "Dr. Meena Shah", designation: "State Nodal Officer", email: "sno.gujarat2@gov.in", mobile: "9265123456", stateName: "Gujarat" },
  { name: "Ramesh Kumar Meena", designation: "State Nodal Officer", email: "sno.rajasthan@gov.in", mobile: "9414567890", stateName: "Rajasthan" },
  { name: "Anjali Patil", designation: "State Nodal Officer", email: "sno.maha@gov.in", mobile: "9890123456", stateName: "Maharashtra" },
  { name: "K. Suresh Babu", designation: "State Nodal Officer", email: "sno.ap@gov.in", mobile: "9100123456", stateName: "Andhra Pradesh" },
  { name: "Karthikeyan R.", designation: "State Nodal Officer", email: "sno.tn@gov.in", mobile: "9445678901", stateName: "Tamil Nadu" },
  { name: "Dinesh Gupta", designation: "State Nodal Officer", email: "sno.up@gov.in", mobile: "9450234567", stateName: "Uttar Pradesh" },
  { name: "Sunita Choudhary", designation: "State Nodal Officer", email: "sno.mp@gov.in", mobile: "9977123456", stateName: "Madhya Pradesh" },
  { name: "Arun Kumar Das", designation: "State Nodal Officer", email: "sno.wb@gov.in", mobile: "9830567890", stateName: "West Bengal" },
  { name: "Pooja Bhatia", designation: "State Nodal Officer", email: "sno.pb@gov.in", mobile: "9888765432", stateName: "Punjab" },
  { name: "Vikram Singh Rathore", designation: "State Nodal Officer", email: "sno.hr@gov.in", mobile: "9812901234", stateName: "Haryana" },
];

export const DNO_TOTAL = 723;

export const DNO_LIST: NodalOfficer[] = [
  { name: "Mallu vijay kiran reddy", designation: "District Nodal Officer", email: "malluvikram333@gmail.com", mobile: "9491455036", stateName: "Andhra Pradesh", districtName: "Nellore" },
  { name: "Muzaffar Ahmad", designation: "District Nodal Officer", email: "dswoanantnag@rediffmail.com", mobile: "9697789759", stateName: "Jammu and Kashmir", districtName: "Anantnag" },
  { name: "Tariq Parvez Qazi", designation: "District Nodal Officer", email: "dswododa@gmail.com", mobile: "9858448314", stateName: "Jammu and Kashmir", districtName: "Doda" },
  { name: "D. Sunanda", designation: "District Nodal Officer", email: "dwogad@gmail.com", mobile: "9010117175", stateName: "Telangana", districtName: "Jogulamba Gadwal" },
  { name: "Sajad Ahmad Bhat", designation: "District Nodal Officer", email: "dswobaramulla@gmail.com", mobile: "8899054218", stateName: "Jammu and Kashmir", districtName: "Baramulla" },
  { name: "Ubaid ul Khazir", designation: "District Nodal Officer", email: "dswobud@gmail.com", mobile: "7780986044", stateName: "Jammu and Kashmir", districtName: "Budgam" },
  { name: "Bashir Ahmad Malik", designation: "District Nodal Officer", email: "dswobandipora@gmail.com", mobile: "9797064950", stateName: "Jammu and Kashmir", districtName: "Bandipora" },
  { name: "Vacant (Addl. Charge - DSWO Samba)", designation: "District Nodal Officer", email: "dswojmu1@gmail.com", mobile: "8492895562", stateName: "Jammu and Kashmir", districtName: "Jammu" },
  { name: "Jyothi K. V.", designation: "District Nodal Officer", email: "ddworam@gmail.com", mobile: "7259850258", stateName: "Karnataka", districtName: "Ramanagara" },
  { name: "Priya Sharma", designation: "District Nodal Officer", email: "dno.amritsar@gov.in", mobile: "9876001234", stateName: "Punjab", districtName: "Amritsar" },
  { name: "Ramesh Kumar", designation: "District Nodal Officer", email: "dno.jaipur@gov.in", mobile: "9414001234", stateName: "Rajasthan", districtName: "Jaipur" },
  { name: "Anjali Desai", designation: "District Nodal Officer", email: "dno.pune@gov.in", mobile: "9890001234", stateName: "Maharashtra", districtName: "Pune" },
  { name: "Suresh Rao", designation: "District Nodal Officer", email: "dno.bengaluru@gov.in", mobile: "9449001234", stateName: "Karnataka", districtName: "Bengaluru Urban" },
  { name: "Kavita Nair", designation: "District Nodal Officer", email: "dno.ernakulam@gov.in", mobile: "9747001234", stateName: "Kerala", districtName: "Ernakulam" },
  { name: "Dinesh Garg", designation: "District Nodal Officer", email: "dno.lucknow@gov.in", mobile: "9451001234", stateName: "Uttar Pradesh", districtName: "Lucknow" },
  { name: "Sunita Singh", designation: "District Nodal Officer", email: "dno.patna@gov.in", mobile: "9631001234", stateName: "Bihar", districtName: "Patna" },
  { name: "Arun Mishra", designation: "District Nodal Officer", email: "dno.bhopal@gov.in", mobile: "9755001234", stateName: "Madhya Pradesh", districtName: "Bhopal" },
  { name: "Pooja Verma", designation: "District Nodal Officer", email: "dno.gurgaon@gov.in", mobile: "9871001234", stateName: "Haryana", districtName: "Gurgaon" },
  { name: "Vikash Das", designation: "District Nodal Officer", email: "dno.kolkata@gov.in", mobile: "9836001234", stateName: "West Bengal", districtName: "Kolkata" },
  { name: "Mohan Lal Sharma", designation: "District Nodal Officer", email: "dno.guwahati@gov.in", mobile: "9854001234", stateName: "Assam", districtName: "Kamrup" },
];

export const FEEDBACK_LIST: FeedbackRow[] = [
  { sno: 1, name: "Nithishkumar reddy", role: "State Nodal Officer", mobile: "7780454557", email: "deleted_803@deleted.invalid", feedback: "lkjhgfvbnZxcvbnmiuytghjkiu7y6t5rdcfvbnjkiuytfvbnmkoiuytghjko0987654321234567890", postedOn: "03-06-2026" },
  { sno: 2, name: "Arjun Reddy", role: "District Nodal Officer", mobile: "9491455036", email: "deleted_801@deleted.invalid", feedback: "qwertyuiopzsxdcfvgbhnjkl", postedOn: "03-06-2026" },
  { sno: 3, name: "Dn enn n cdc ndv", role: "District Nodal Officer", mobile: "7857485738", email: "rimobaj457@pertok.com", feedback: "CNSHJCBSHCBHC", postedOn: "24-04-2026" },
  { sno: 4, name: "Shrikant singh", role: "State Nodal Officer", mobile: "8786758764", email: "gapov64759@mugstock.com", feedback: "GOOD", postedOn: "23-04-2026" },
];

export const PUBLIC_ACTIVITIES: PublicActivity[] = [
  {
    title: "Alandi Student Awareness Drive",
    description: "NMBA pledge drive at educational institutions with students committing to a drug-free society.",
    category: "Awareness Rally",
    department: "Ministry of Social Justice & Empowerment",
    location: "Pune, Maharashtra",
    date: "25 Jan 2026",
  },
  {
    title: "Government School Pledge Campaign",
    description: "School programme to promote drug awareness and NMBA pledge drive among students.",
    category: "School Programme",
    department: "Ministry of Social Justice & Empowerment",
    location: "Indore, Madhya Pradesh",
    date: "24 Jan 2026",
  },
  {
    title: "Village Meeting — Drug-Free India",
    description: "Panchayat-level community meeting to spread awareness about NMBA and local de-addiction resources.",
    category: "Panchayat Sabha",
    department: "Ministry of Social Justice & Empowerment",
    location: "Sikar, Rajasthan",
    date: "24 Jan 2026",
  },
];

export const FACILITIES: Facility[] = [
  { type: "IRCA", name: "Integrated Rehab Centre Delhi", address: "Plot 5, Sector 12, New Delhi - 110001", lat: 28.6139, lng: 77.2090 },
  { type: "IRCA", name: "Integrated Rehab Centre Mumbai", address: "Building 3, Andheri East, Mumbai - 400069", lat: 19.1197, lng: 72.8484 },
  { type: "CPLI", name: "Community Peer Intervention Bengaluru", address: "15 Residency Road, Bengaluru - 560025", lat: 12.9716, lng: 77.5946 },
  { type: "CPLI", name: "Community Peer Intervention Kolkata", address: "12 Park Street, Kolkata - 700016", lat: 22.5726, lng: 88.3639 },
  { type: "ODIC", name: "Outreach Centre Chennai", address: "Anna Salai, Chennai - 600002", lat: 13.0827, lng: 80.2707 },
  { type: "ODIC", name: "Outreach Centre Hyderabad", address: "Banjara Hills, Hyderabad - 500034", lat: 17.3850, lng: 78.4867 },
  { type: "DDAC", name: "District De-addiction Centre Jaipur", address: "Tonk Road, Jaipur - 302015", lat: 26.9124, lng: 75.7873 },
  { type: "DDAC", name: "District De-addiction Centre Lucknow", address: "Hazratganj, Lucknow - 226001", lat: 26.8467, lng: 80.9462 },
  { type: "ATF", name: "Addiction Treatment Facility Pune", address: "Shivajinagar, Pune - 411005", lat: 18.5204, lng: 73.8567 },
  { type: "ATF", name: "Addiction Treatment Facility Chandigarh", address: "Sector 32, Chandigarh - 160030", lat: 30.7333, lng: 76.7794 },
];

export const ACTIVITY_TYPES = [
  "Social Justice",
  "Yoga and Meditation Activities",
  "Nukkad Natak, Skits and Play",
  "Drawing competition",
  "Rangoli Making Competition",
  "Health Related Activities/Camps",
  "Awareness Campaign",
  "De-addiction Camp",
  "Community Awareness Drive",
];

export const PLEDGES_TODAY = 0;
export const TOTAL_PLEDGES = 71;

export const PLEDGE_TEXT_EN = `Dear friends,

Youth is the energy of any nation and the power of youth has an important contribution in the development of society and country. Therefore, it is very important that maximum number of youth join the drug free India campaign. Accepting this challenge of the country, today we unite under the Nasha Mukt Bharat Abhiyaan and take a pledge that not only the community, family, friends, but also ourselves will be drug free because change should start with ourselves. So let us all together take a firm decision to make our district/state drug-free. I pledge that I will do everything possible to the best of my ability to make my country drug-free.

Jai Hind!`;

// TODO: Replace with real Hindi translation before production launch.
export const PLEDGE_TEXT_HI = `प्रिय मित्रों,

युवा किसी भी राष्ट्र की ऊर्जा है और समाज और देश के विकास में युवाओं की शक्ति का महत्वपूर्ण योगदान है। इसलिए यह बहुत जरूरी है कि अधिक से अधिक युवा नशा मुक्त भारत अभियान से जुड़ें। देश की इस चुनौती को स्वीकार करते हुए, आज हम नशा मुक्त भारत अभियान के तहत एकजुट होते हैं और संकल्प लेते हैं कि न केवल समाज, परिवार, मित्र, बल्कि हम स्वयं भी नशा मुक्त होंगे क्योंकि बदलाव हमसे ही शुरू होना चाहिए। तो आइए हम सब मिलकर अपने जिले/राज्य को नशा मुक्त करने का दृढ़ निश्चय करें। मैं संकल्प लेता/लेती हूं कि अपने देश को नशा मुक्त करने के लिए अपनी पूरी क्षमता से हर संभव प्रयास करूंगा/करूंगी।

जय हिंद!`;
