export type AppStatus = "Approved" | "Awaiting Evaluation" | "Rejected";

export interface SageApplication {
  id: string;
  organisation: string;
  date: string;
  status: AppStatus;
}

export interface VolunteerRow {
  id: string;
  name: string;
  type: "INDIVIDUAL" | "ORGANISATION";
  date: string;
  status: AppStatus;
}

export interface AdminUser {
  name: string;
  mobile: string;
  email: string;
  role: string;
}

export interface EventRow {
  sno: number;
  name: string;
  start: string;
  end: string;
  hours: string;
  address: string;
}

export interface IpsrcHome {
  ngo: string;
  projectType: string;
  state: string;
  district: string;
  address: string;
}

export interface AssistedDevice {
  title: string;
  description: string;
  active: boolean;
}

export interface Facility {
  category: string;
  name: string;
  address: string;
  distance: string;
}

export interface ActivityItem {
  text: string;
  emphasis?: string;
  when: string;
}
