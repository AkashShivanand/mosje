// Role definitions match the live SMILE Admin portal.
export type RoleKey =
  | "super_admin"
  | "central_admin"
  | "state_nodal_officer"
  | "district_nodal_officer";

export interface Account {
  mobile: string;
  password: string;
  role: RoleKey;
  name: string;
  email: string;
  stateId?: number;
  stateName?: string;
  districtId?: number;
  districtName?: string;
}

export const ACCOUNTS: Account[] = [
  {
    mobile: "9000000900",
    password: "Password@123",
    role: "super_admin",
    name: "Test Super Admin",
    email: "test.superadmin@smile.gov.in",
  },
  {
    mobile: "9000000901",
    password: "Password@123",
    role: "central_admin",
    name: "Test Central Admin",
    email: "test.centraladmin@smile.gov.in",
  },
  {
    mobile: "9000000902",
    password: "Password@123",
    role: "state_nodal_officer",
    name: "Test State Nodal Officer",
    email: "test.snokms@smile.gov.in",
    stateId: 14,
    stateName: "Maharashtra",
  },
  {
    mobile: "9000000903",
    password: "Password@123",
    role: "district_nodal_officer",
    name: "Test NO Mumbai",
    email: "test.no.mumbai@smile.gov.in",
    stateId: 14,
    stateName: "Maharashtra",
    districtId: 1401,
    districtName: "Mumbai",
  },
  {
    mobile: "9000000904",
    password: "Password@123",
    role: "district_nodal_officer",
    name: "Test NO Pune",
    email: "test.no.pune@smile.gov.in",
    stateId: 14,
    stateName: "Maharashtra",
    districtId: 1403,
    districtName: "Pune",
  },
  {
    mobile: "9000000905",
    password: "Password@123",
    role: "district_nodal_officer",
    name: "Test NO New Delhi",
    email: "test.no.newdelhi@smile.gov.in",
    stateId: 33,
    stateName: "Delhi",
    districtId: 3301,
    districtName: "New Delhi",
  },
];

export const ROLE_LABELS: Record<RoleKey, string> = {
  super_admin: "Super Admin",
  central_admin: "Central Admin",
  state_nodal_officer: "State Nodal Officer",
  district_nodal_officer: "District Nodal Officer",
};

export const ROLE_SCOPES: Record<RoleKey, string> = {
  super_admin: "All India",
  central_admin: "All India",
  state_nodal_officer: "State",
  district_nodal_officer: "District",
};
