import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Database,
  FileText,
  FolderCog,
  GitMerge,
  Landmark,
  ListChecks,
  Network,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: Array<{ label: string; href: string }>;
};

export type TableScreen = {
  title: string;
  addLabel?: string;
  searchPlaceholder: string;
  filters?: string[];
  columns: string[];
  rows: string[][];
  totalItems: number;
  variant?: "map-tabs" | "expenditure" | "default";
};

export type DashboardMetric = {
  label: string;
  value: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Ministries Dashboard", href: "/ministries-dashboard", icon: TrendingUp },
  { label: "Manage Financial Year", href: "/admin/financial-year-management", icon: CalendarDays },
  { label: "Manage Ministry", href: "/ministry-management", icon: Landmark },
  { label: "Manage Scheme", href: "/scheme-management", icon: ListChecks },
  { label: "Manage Outcome", href: "/manage-outcome", icon: Target },
  { label: "Manage Documents", href: "/document-management", icon: FileText },
  { label: "Map Ministry/Schemes", href: "/map-ministry", icon: Network },
  { label: "Map Schema", href: "/map-schema", icon: GitMerge },
  { label: "Physical Progress", href: "/ministry/physical-progress-data", icon: TrendingUp },
  {
    label: "Reports",
    href: "/reports/financial-summary",
    icon: BarChart3,
    children: [
      { label: "Financial Summary", href: "/reports/financial-summary" },
      { label: "Statement 10A", href: "/reports/statement-10a" },
    ],
  },
  { label: "User Management", href: "/user-management", icon: Users },
  { label: "Role Management", href: "/role-management", icon: ShieldCheck },
  { label: "PFMS Logs", href: "/pfms-logs", icon: Database },
];

export const dashboardSummary: DashboardMetric[] = [
  { label: "Total Ministry", value: "38" },
  { label: "Schemes as per 10A", value: "239" },
  { label: "Mapped Schemes", value: "0" },
  { label: "Pending Schemes", value: "239" },
];

export const progressCards: DashboardMetric[] = [
  { label: "Ministry/Departments & UTS", value: "38" },
  { label: "Total Schemes", value: "239" },
  { label: "Budget Estimates (CR.)", value: "₹1,96,397.15" },
  { label: "Revised Estimates (CR.)", value: "₹0.00" },
  { label: "DAPSC Releases (CR.) as on 08 Jun 2026", value: "₹12,471.93" },
  { label: "Releases W.R.T budget Estimates as on 08 Jun 2026", value: "6.35 %" },
  { label: "Releases W.R.T revised Estimates as on 08 Jun 2026", value: "0.00 %" },
];

export const expenditureLegend = [
  ["Department of Rural Development", "var(--chart-danger)"],
  ["Department of Fertilisers", "var(--chart-warning)"],
  ["Social Justice and Empowerment", "var(--chart-primary-soft)"],
  ["Department of Higher Education", "var(--chart-danger-soft)"],
  ["Department of Food and Public Distribution", "var(--chart-success-soft)"],
  ["New and Renewable Energy", "var(--chart-orange)"],
] as const;

export const tableScreens: Record<string, TableScreen> = {
  "/admin/financial-year-management": {
    title: "Financial Year List",
    addLabel: "Add Financial Year",
    searchPlaceholder: "Search for",
    columns: ["Financial Year", "Current Financial Year", ""],
    totalItems: 10,
    rows: [
      ["2026-2027", "checked", "Edit"],
      ["2025-2026", "", "Edit"],
      ["2024-2025", "", "Edit"],
      ["2023-2024", "", "Edit"],
      ["2022-2023", "", "Edit"],
      ["2021-2022", "", "Edit"],
      ["2020-2021", "", "Edit"],
      ["2019-2020", "", "Edit"],
      ["2018-2019", "", "Edit"],
      ["2017-2018", "", "Edit"],
    ],
  },
  "/ministry-management": {
    title: "Ministry/Department List",
    addLabel: "Add Ministry/Department",
    searchPlaceholder: "Search for",
    columns: ["Ministry/Department", "Grant 10A", "Grant No. PFMS", ""],
    totalItems: 1500,
    rows: [
      ["Ministry of Power", "079", "006", "Edit Delete"],
      ["Dept of Agriculture Cooperation and Farmers Welfare", "001", "004", "Edit Delete"],
      ["Dept of Fertilisers", "006", "007", "Edit Delete"],
      ["Dept of Pharmaceuticals", "079", "009", "Edit Delete"],
      ["Ministry of Coal", "004", "010", "Edit Delete"],
      ["Department of Rural Development", "086", "084", "Edit Delete"],
      ["Department of Higher Education", "027", "057", "Edit Delete"],
    ],
  },
  "/ministry-management/edit": {
    title: "Ministry/Department List",
    addLabel: "Add Ministry/Department",
    searchPlaceholder: "Search for",
    columns: ["Ministry/Department", "Grant 10A", "Grant No. PFMS", ""],
    totalItems: 1500,
    rows: [
      ["Ministry of Power", "079", "006", "Edit Delete"],
      ["Dept of Agriculture Cooperation and Farmers Welfare", "001", "004", "Edit Delete"],
      ["Dept of Fertilisers", "006", "007", "Edit Delete"],
      ["Dept of Pharmaceuticals", "079", "009", "Edit Delete"],
      ["Ministry of Coal", "004", "010", "Edit Delete"],
      ["Department of Rural Development", "086", "084", "Edit Delete"],
      ["Department of Higher Education", "027", "057", "Edit Delete"],
    ],
  },
  "/scheme-management": {
    title: "Scheme List",
    addLabel: "Add Scheme",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Department"],
    columns: ["Scheme Name", "Ministry/Department", "FY", "BE", "RE", ""],
    totalItems: 239,
    rows: [
      ["PM Surya Ghar Muft Bijli Yojana", "Ministry of New and Renewable Energy", "2026-2027", "22000.00", "0.00", "menu"],
      ["Crop Insurance Scheme", "Department of Agriculture and Farmers Welfare", "2026-2027", "12200.00", "0.00", "menu"],
      ["National Mission on Natural Farming", "Department of Agriculture and Farmers Welfare", "2026-2027", "750.00", "0.00", "menu"],
      ["Krishionnati Yojna", "Department of Agriculture and Farmers Welfare", "2026-2027", "11200.00", "0.00", "menu"],
      ["Pradhan Mantri Kisan Samman Nidhi (PM-Kisan)", "Department of Agriculture and Farmers Welfare", "2026-2027", "63500.00", "0.00", "menu"],
      ["Formation and Promotion of 10,000 Farmer Producer Organizations (FPOs)", "Department of Agriculture and Farmers Welfare", "2026-2027", "500.00", "0.00", "menu"],
      ["Rashtriya Krishi Vikas Yojna", "Department of Agriculture and Farmers Welfare", "2026-2027", "8550.00", "0.00", "menu"],
      ["Modified Interest Subvention Scheme (MISS)", "Department of Agriculture and Farmers Welfare", "2026-2027", "22600.00", "0.00", "menu"],
      ["Pradhan Mantri Annadata Aay Sanrakshan Yojna (PM-AASHA)", "Department of Agriculture and Farmers Welfare", "2026-2027", "7200.00", "0.00", "menu"],
      ["Green Energy Corridor", "Ministry of New and Renewable Energy", "2026-2027", "599.99", "0.00", "menu"],
    ],
  },
  "/scheme-management/edit": {
    title: "Scheme List",
    addLabel: "Add Scheme",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Department"],
    columns: ["Scheme Name", "Ministry/Department", "FY", "BE", "RE", ""],
    totalItems: 239,
    rows: [
      ["PM Surya Ghar Muft Bijli Yojana", "Ministry of New and Renewable Energy", "2026-2027", "22000.00", "0.00", "menu"],
      ["Crop Insurance Scheme", "Department of Agriculture and Farmers Welfare", "2026-2027", "12200.00", "0.00", "menu"],
      ["National Mission on Natural Farming", "Department of Agriculture and Farmers Welfare", "2026-2027", "750.00", "0.00", "menu"],
      ["Krishionnati Yojna", "Department of Agriculture and Farmers Welfare", "2026-2027", "11200.00", "0.00", "menu"],
      ["Pradhan Mantri Kisan Samman Nidhi (PM-Kisan)", "Department of Agriculture and Farmers Welfare", "2026-2027", "63500.00", "0.00", "menu"],
    ],
  },
  "/manage-outcome": {
    title: "Manage Outcome",
    addLabel: "Add Outcome",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Department"],
    columns: ["Outcome", "Scheme", "FY", "Target", "Achievement", ""],
    totalItems: 178,
    rows: [
      ["Beneficiaries covered under scholarship support", "Post Matric Scholarship", "2026-2027", "42,00,000", "18,42,113", "menu"],
      ["Districts saturated through livelihood grants", "PM-AJAY", "2026-2027", "500", "213", "menu"],
      ["Skill training candidates enrolled", "SMILE", "2026-2027", "80,000", "31,840", "menu"],
      ["Hostels upgraded for SC students", "Babu Jagjivan Ram Chhatrawas", "2026-2027", "120", "44", "menu"],
      ["Awareness events conducted", "NMBA", "2026-2027", "14,000", "7,552", "menu"],
    ],
  },
  "/document-management": {
    title: "Documents",
    addLabel: "Add Document",
    searchPlaceholder: "Search for",
    columns: ["Document Name", "Document Type", "Financial Year", "Uploaded On", ""],
    totalItems: 42,
    rows: [
      ["Statement 10A", "PDF", "2026-2027", "08 Jun 2026", "View"],
      ["Budget Estimates Upload", "XLSX", "2026-2027", "28 May 2026", "View"],
      ["PFMS Mapping Template", "XLSX", "2026-2027", "17 May 2026", "View"],
      ["Ministry Grant Reference", "PDF", "2025-2026", "13 Apr 2026", "View"],
      ["Scheme Outcome Master", "CSV", "2026-2027", "02 Apr 2026", "View"],
    ],
  },
  "/document-management/edit": {
    title: "Documents",
    addLabel: "Add Document",
    searchPlaceholder: "Search for",
    columns: ["Document Name", "Document Type", "Financial Year", "Uploaded On", ""],
    totalItems: 42,
    rows: [
      ["Statement 10A", "PDF", "2026-2027", "08 Jun 2026", "View"],
      ["Budget Estimates Upload", "XLSX", "2026-2027", "28 May 2026", "View"],
      ["PFMS Mapping Template", "XLSX", "2026-2027", "17 May 2026", "View"],
      ["Ministry Grant Reference", "PDF", "2025-2026", "13 Apr 2026", "View"],
      ["Scheme Outcome Master", "CSV", "2026-2027", "02 Apr 2026", "View"],
    ],
  },
  "/map-ministry": {
    title: "Map Ministry/Schemes",
    addLabel: "Map Scheme",
    searchPlaceholder: "Search for",
    filters: ["All Ministry", "Pending Mapping"],
    columns: ["Ministry/Department", "Mapped Schemes", "Pending Schemes", "Last Updated", ""],
    totalItems: 38,
    variant: "map-tabs",
    rows: [
      ["Department of Agriculture and Farmers Welfare", "48", "12", "08 Jun 2026", "Map"],
      ["Ministry of New and Renewable Energy", "8", "2", "08 Jun 2026", "Map"],
      ["Department of Rural Development", "16", "3", "07 Jun 2026", "Map"],
      ["Department of Fertilisers", "4", "1", "07 Jun 2026", "Map"],
      ["Department of Higher Education", "12", "5", "06 Jun 2026", "Map"],
    ],
  },
  "/map-schema": {
    title: "Map Ministry/Schemes",
    addLabel: "Map Scheme",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Ministry"],
    columns: ["Scheme Name", "Ministry/Department", "PFMS Grant No.", "Mapped", "Status", ""],
    totalItems: 239,
    variant: "map-tabs",
    rows: [
      ["PM Surya Ghar Muft Bijli Yojana", "Ministry of New and Renewable Energy", "—", "No", "Pending", "Map"],
      ["Crop Insurance Scheme", "Dept of Agriculture and Farmers Welfare", "001", "Yes", "Active", "Unmap"],
      ["National Mission on Natural Farming", "Dept of Agriculture and Farmers Welfare", "—", "No", "Pending", "Map"],
      ["Krishionnati Yojna", "Dept of Agriculture and Farmers Welfare", "001", "Yes", "Active", "Unmap"],
      ["Pradhan Mantri Kisan Samman Nidhi", "Dept of Agriculture and Farmers Welfare", "001", "Yes", "Active", "Unmap"],
      ["Formation and Promotion of 10,000 FPOs", "Dept of Agriculture and Farmers Welfare", "—", "No", "Pending", "Map"],
      ["Rashtriya Krishi Vikas Yojna", "Dept of Agriculture and Farmers Welfare", "001", "Yes", "Active", "Unmap"],
    ],
  },
  "/ministries-dashboard": {
    title: "Ministries Dashboard",
    addLabel: "Trigger Refresh",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Ministry"],
    columns: [
      "S.No", "Ministry/Department", "Total Allocation (Cr.)", "DAPSC Allocation (Cr.)",
      "% DAPSC w.r.t. Total", "Revised Allocation (Cr.)", "% Revised w.r.t. Total",
      "Expenditure (Cr.)", "Transfer Entry (Cr.)", "Total Expenditure (Cr.)", "% Expenditure w.r.t. Revised",
    ],
    totalItems: 38,
    variant: "expenditure",
    rows: [
      ["1", "Department of Rural Development", "86,000.00", "10,214.82", "11.88", "0.00", "0.00", "9,842.10", "372.72", "10,214.82", "0.00"],
      ["2", "Department of Fertilisers", "43,200.00", "8,242.18", "19.08", "0.00", "0.00", "7,918.42", "323.76", "8,242.18", "0.00"],
      ["3", "Social Justice and Empowerment", "14,225.00", "2,145.93", "15.09", "0.00", "0.00", "2,022.14", "123.79", "2,145.93", "0.00"],
      ["4", "Department of Higher Education", "28,412.00", "1,225.50", "4.31", "0.00", "0.00", "1,148.22", "77.28", "1,225.50", "0.00"],
      ["5", "New and Renewable Energy", "22,000.00", "842.12", "3.83", "0.00", "0.00", "804.18", "37.94", "842.12", "0.00"],
      ["6", "Department of Food and Public Distribution", "21,000.00", "4,012.44", "19.11", "0.00", "0.00", "3,822.80", "189.64", "4,012.44", "0.00"],
    ],
  },
  "/ministry/physical-progress-data": {
    title: "Physical Progress Data",
    addLabel: "Add Entry",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Ministry"],
    columns: ["Ministry/Department", "Scheme Name", "FY", "Budget Estimate (Cr.)", "DAPSC Release (Cr.)", "Expenditure (Cr.)", "Transfer Entry (Cr.)", "Total Expenditure (Cr.)", "% w.r.t. Revised", ""],
    totalItems: 85,
    variant: "expenditure",
    rows: [
      ["Social Justice and Empowerment", "Post Matric Scholarship", "2026-2027", "4,280.00", "648.22", "612.44", "35.78", "648.22", "0.00", "Edit"],
      ["Social Justice and Empowerment", "Pre Matric Scholarship", "2026-2027", "1,250.00", "188.14", "172.80", "15.34", "188.14", "0.00", "Edit"],
      ["Social Justice and Empowerment", "PM-AJAY", "2026-2027", "9,250.00", "842.18", "810.22", "31.96", "842.18", "0.00", "Edit"],
      ["Social Justice and Empowerment", "SMILE (Beggary)", "2026-2027", "152.00", "18.44", "16.22", "2.22", "18.44", "0.00", "Edit"],
      ["Social Justice and Empowerment", "NMBA", "2026-2027", "48.00", "4.82", "4.44", "0.38", "4.82", "0.00", "Edit"],
    ],
  },
  "/user-management": {
    title: "User List",
    addLabel: "Add User",
    searchPlaceholder: "Search for",
    columns: ["Name", "Email", "Role", "Status", ""],
    totalItems: 36,
    rows: [
      ["Admin User", "admin.eutthan@gov.in", "Super Admin", "Active", "Edit"],
      ["Vikas S", "vikas.s@gov.in", "Admin", "Active", "Edit"],
      ["Renu Sharma", "renu.sharma@gov.in", "Ministry User", "Active", "Edit"],
      ["Shivendra Kumar", "shivendra.kumar@gov.in", "Ministry User", "Inactive", "Edit"],
      ["PFMS Operator", "pfms.operator@gov.in", "Data Operator", "Active", "Edit"],
    ],
  },
  "/user-management/edit": {
    title: "User List",
    addLabel: "Add User",
    searchPlaceholder: "Search for",
    columns: ["Name", "Email", "Role", "Status", ""],
    totalItems: 36,
    rows: [
      ["Admin User", "admin.eutthan@gov.in", "Super Admin", "Active", "Edit"],
      ["Vikas S", "vikas.s@gov.in", "Admin", "Active", "Edit"],
      ["Renu Sharma", "renu.sharma@gov.in", "Ministry User", "Active", "Edit"],
      ["Shivendra Kumar", "shivendra.kumar@gov.in", "Ministry User", "Inactive", "Edit"],
      ["PFMS Operator", "pfms.operator@gov.in", "Data Operator", "Active", "Edit"],
    ],
  },
  "/role-management": {
    title: "Role Management",
    addLabel: "Add Role",
    searchPlaceholder: "Search for",
    columns: ["Role Name", "Users", "Permissions", "Status", ""],
    totalItems: 7,
    rows: [
      ["Super Admin", "2", "All modules", "Active", "Edit"],
      ["Admin", "8", "Masters, mapping, reports", "Active", "Edit"],
      ["Ministry User", "18", "Dashboard, scheme progress", "Active", "Edit"],
      ["Data Operator", "6", "Uploads, PFMS logs", "Active", "Edit"],
      ["Viewer", "2", "Read only", "Inactive", "Edit"],
    ],
  },
  "/pfms-logs": {
    title: "PFMS Logs",
    addLabel: "Trigger PFMS Sync",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Status"],
    columns: ["Run ID", "Financial Year", "Started On", "Records", "Status", ""],
    totalItems: 24,
    rows: [
      ["PFMS-260608-01", "2026-2027", "08 Jun 2026 10:30", "1,245", "Success", "View"],
      ["PFMS-260607-02", "2026-2027", "07 Jun 2026 18:45", "1,238", "Success", "View"],
      ["PFMS-260606-01", "2026-2027", "06 Jun 2026 09:15", "1,210", "Failed", "Retry"],
      ["PFMS-260605-01", "2026-2027", "05 Jun 2026 09:30", "1,205", "Success", "View"],
    ],
  },
  "/reports/financial-summary": {
    title: "Financial Summary Report",
    addLabel: "Export",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Ministry"],
    columns: ["S.No", "Ministry/Department", "Total Allocation (Cr.)", "DAPSC Allocation (Cr.)", "% DAPSC w.r.t. Total", "Revised Allocation (Cr.)", "% Revised w.r.t. Total", "Expenditure (Cr.)", "Transfer Entry (Cr.)", "Total Expenditure (Cr.)", "% Expenditure w.r.t. Revised"],
    totalItems: 38,
    variant: "expenditure",
    rows: [
      ["1", "Department of Rural Development", "86,000.00", "10,214.82", "11.88", "0.00", "0.00", "9,842.10", "372.72", "10,214.82", "0.00"],
      ["2", "Department of Fertilisers", "43,200.00", "8,242.18", "19.08", "0.00", "0.00", "7,918.42", "323.76", "8,242.18", "0.00"],
      ["3", "Social Justice and Empowerment", "14,225.00", "2,145.93", "15.09", "0.00", "0.00", "2,022.14", "123.79", "2,145.93", "0.00"],
      ["4", "Department of Higher Education", "28,412.00", "1,225.50", "4.31", "0.00", "0.00", "1,148.22", "77.28", "1,225.50", "0.00"],
      ["5", "New and Renewable Energy", "22,000.00", "842.12", "3.83", "0.00", "0.00", "804.18", "37.94", "842.12", "0.00"],
      ["6", "Dept of Food and Public Distribution", "21,000.00", "4,012.44", "19.11", "0.00", "0.00", "3,822.80", "189.64", "4,012.44", "0.00"],
    ],
  },
  "/reports/statement-10a": {
    title: "Statement 10A",
    addLabel: "Download 10A",
    searchPlaceholder: "Search for",
    filters: ["2026-2027", "All Department"],
    columns: ["Scheme Name", "Grant No.", "Budget Head", "BE", "RE", "Transfer Entry (Cr.)", ""],
    totalItems: 239,
    rows: [
      ["PM Surya Ghar Muft Bijli Yojana", "079", "2801.00.101.01", "22000.00", "0.00", "0.00", "View"],
      ["Crop Insurance Scheme", "001", "2401.00.110.12", "12200.00", "0.00", "0.00", "View"],
      ["Pradhan Mantri Kisan Samman Nidhi", "001", "2401.00.789.24", "63500.00", "0.00", "0.00", "View"],
      ["Rashtriya Krishi Vikas Yojna", "001", "2401.00.102.32", "8550.00", "0.00", "0.00", "View"],
    ],
  },
};

export const formRoutes: Record<string, { title: string; subtitle: string; icon: LucideIcon }> = {
  "/admin/financial-year-management/add": {
    title: "Add Financial Year",
    subtitle: "Create a new financial year and mark current year status.",
    icon: CalendarDays,
  },
  "/admin/financial-year-management/edit": {
    title: "Edit Financial Year",
    subtitle: "Update the financial year details or change the current year marker.",
    icon: CalendarDays,
  },
  "/ministry-management/add": {
    title: "Add Ministry/Department",
    subtitle: "Register ministry details, 10A grant and PFMS grant mapping.",
    icon: Building2,
  },
  "/scheme-management/add": {
    title: "Add Scheme",
    subtitle: "Capture scheme details, ministry ownership, budget estimates and revised estimates.",
    icon: BriefcaseBusiness,
  },
  "/manage-outcome/add": {
    title: "Add Outcome",
    subtitle: "Define outcome targets linked to a scheme and financial year.",
    icon: Target,
  },
  "/document-management/add": {
    title: "Add Document",
    subtitle: "Upload a document with type, year and visibility metadata.",
    icon: FolderCog,
  },
  "/user-management/add": {
    title: "Add User",
    subtitle: "Invite a user and assign their role for the E-Utthan portal.",
    icon: Users,
  },
  "/ministry/physical-progress-data/add": {
    title: "Add Physical Progress Entry",
    subtitle: "Enter expenditure and transfer entry data for a scheme and financial year.",
    icon: TrendingUp,
  },
  "/ministry/physical-progress-data/edit": {
    title: "Edit Physical Progress Entry",
    subtitle: "Update expenditure and transfer entry data for the selected scheme.",
    icon: TrendingUp,
  },
};

export const loginCards = [
  ["Admin access", "Manage schemes, ministries, PFMS logs and reports."],
  ["Ministry access", "Update physical progress and outcome data."],
  ["Secure workflow", "Role-based access with OTP-style entry points."],
];
