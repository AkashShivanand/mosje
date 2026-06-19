export type ActivityRow = {
  state: string;
  district: string;
  activity: string;
  activityDate: string;
  maleParticipants: number;
  femaleParticipants: number;
  totalParticipants: number;
  coordinatingDepartment: string;
  educationalInstitutions: number;
  location: string;
  createdBy: string;
  createdAt: string;
};

export type AdminUser = {
  name: string;
  mobile: string;
  email: string;
  role: "Admin" | "State Nodal Officer" | "District Nodal Officer";
};

export type PledgeReport = {
  pledgeType: "e-pledge" | "physical";
  name: string;
  age: number;
  mobile: string;
  email: string;
  state: string;
  district: string;
  pledgeDate: string;
};

export type ImportantDocument = {
  name: string;
  uploadedOn: string;
  uploadedBy: string;
  published: boolean;
};

export type NodalOfficer = {
  name: string;
  designation: string;
  email: string;
  mobile: string;
  stateName: string;
  districtName?: string;
};

export type FeedbackRow = {
  sno: number;
  name: string;
  role: string;
  mobile: string;
  email: string;
  feedback: string;
  postedOn: string;
};

export type FacilityType = "IRCA" | "CPLI" | "ODIC" | "DDAC" | "ATF";

export type Facility = {
  type: FacilityType;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type PublicActivity = {
  title: string;
  description: string;
  department: string;
  location: string;
  date: string;
};

export type DashboardStats = {
  totalPledges: string;
  peopleReached: string;
  youthReached: string;
  womenReached: string;
  totalActivities: string;
  educationalInstitutions: string;
};
