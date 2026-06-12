import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  Database,
  FileText,
  Landmark,
  ListChecks,
  Network,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export type Role = "admin" | "ministry";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: Array<{ label: string; href: string }>;
};

export type TableScreen = {
  title: string;
  subtitle?: string;
  addLabel?: string;
  searchPlaceholder: string;
  filters?: string[];
  columns: string[];
  rows: string[][];
  totalItems: number;
  variant?: "map-tabs" | "expenditure" | "report-viewer" | "pfms" | "default";
};

export type FormField = {
  label: string;
  type: "text" | "number" | "email" | "password" | "date" | "select" | "combobox" | "textarea" | "file" | "readonly";
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  options?: string[];
};

export type FormDef = {
  title: string;
  fields: FormField[];
  submitLabel: string;
};

export type DashboardMetric = { label: string; value: string };

// ── Navigation ───────────────────────────────────────────────────────────────

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Manage Financial Year", href: "/admin/financial-year-management", icon: CalendarDays },
  { label: "Manage Ministry", href: "/ministry-management", icon: Landmark },
  { label: "Manage Scheme", href: "/scheme-management", icon: ListChecks },
  { label: "Manage Outcome", href: "/manage-outcome", icon: Target },
  { label: "Manage Documents", href: "/document-management", icon: FileText },
  {
    label: "Map Ministry/Schemes",
    href: "/map-ministry",
    icon: Network,
  },
  {
    label: "Reports",
    href: "/reports/statement-10a",
    icon: BarChart3,
    children: [
      { label: "Statement 10A", href: "/reports/statement-10a" },
      { label: "Financial Summary", href: "/reports/financial-summary" },
    ],
  },
  { label: "User Management", href: "/user-management", icon: Users },
  { label: "Role Management", href: "/role-management", icon: ShieldCheck },
  { label: "PFMS Logs", href: "/pfms-logs", icon: Database },
];

export const ministryNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Physical Progress", href: "/ministry/physical-progress-data", icon: TrendingUp },
  { label: "Manage Scheme", href: "/scheme-management", icon: ListChecks },
  { label: "Manage Outcome", href: "/manage-outcome", icon: Target },
  {
    label: "Reports",
    href: "/reports/statement-10a",
    icon: BarChart3,
    children: [
      { label: "Statement 10A", href: "/reports/statement-10a" },
      { label: "Financial Summary", href: "/reports/financial-summary" },
    ],
  },
];

// ── Dashboard data ────────────────────────────────────────────────────────────

export const adminDashboardSummary: DashboardMetric[] = [
  { label: "Total Ministry", value: "38" },
  { label: "Schemes as per 10A", value: "235" },
  { label: "Mapped Schemes", value: "203" },
  { label: "Pending Schemes", value: "32" },
];

export const ministryDashboardSummary: DashboardMetric[] = [
  { label: "Schemes as per 10A", value: "0" },
  { label: "Mapped Schemes", value: "0" },
  { label: "Pendency", value: "0" },
  { label: "Pending Schemes", value: "0" },
];

export const adminProgressCards: DashboardMetric[] = [
  { label: "Ministry/Departments & UTS", value: "38" },
  { label: "Total Schemes", value: "235" },
  { label: "Budget Estimates (CR.)", value: "₹1,68,482.06" },
  { label: "Revised Estimates (CR.)", value: "₹1,61,201.98" },
  { label: "DAPSC Releases (CR.) as on 10 Jun 2026", value: "₹1,41,537.45" },
  { label: "Releases W.R.T budget Estimates as on 10 Jun 2026", value: "84.01 %" },
  { label: "Releases W.R.T revised Estimates as on 10 Jun 2026", value: "87.80 %" },
];

export const ministryProgressCards: DashboardMetric[] = [
  { label: "Total Schemes", value: "0" },
  { label: "Budget Estimates (CR.)", value: "₹0.00" },
  { label: "Revised Estimates (CR.)", value: "₹0.00" },
  { label: "DAPSC Releases (CR.) as on 10 Jun 2026", value: "₹239.25" },
  { label: "Transfer Entry (CR.) as on 10 Jun 2026", value: "₹-1.97" },
  { label: "Releases W.R.T budget Estimates as on 10 Jun 2026", value: "0.00 %" },
  { label: "Releases W.R.T revised Estimates as on 10 Jun 2026", value: "0.00 %" },
];

export const expenditureLegend = [
  ["Department of Food and Public Distribution", "var(--chart-danger)"],
  ["Department of Rural Development", "var(--chart-warning)"],
  ["Department of Fertilisers", "var(--chart-primary-soft)"],
  ["Department of School Education and Literacy", "var(--chart-danger-soft)"],
  ["Department of Agriculture and Farmers Welfare", "var(--chart-success-soft)"],
  ["Department of Health and Family Welfare", "var(--chart-orange)"],
] as const;

// ── Table screens ─────────────────────────────────────────────────────────────

export const tableScreens: Record<string, TableScreen> = {
  "/admin/financial-year-management": {
    title: "Financial Year List",
    addLabel: "Add Financial Year",
    searchPlaceholder: "Search for",
    columns: ["Financial Year", "Current Financial Year", ""],
    totalItems: 10,
    rows: [
      ["2026-2027", "", "Edit Delete"],
      ["2025-2026", "checked", "Edit Delete"],
      ["2024-2025", "", "Edit Delete"],
      ["2023-2024", "", "Edit Delete"],
      ["2022-2023", "", "Edit Delete"],
      ["2021-2022", "", "Edit Delete"],
      ["2020-2021", "", "Edit Delete"],
      ["2019-2020", "", "Edit Delete"],
      ["2018-2019", "", "Edit Delete"],
      ["2017-2018", "", "Edit Delete"],
    ],
  },
  "/ministry-management": {
    title: "Ministry/Department List",
    addLabel: "Add Ministry/Department",
    searchPlaceholder: "Search for",
    filters: ["2025-2026", "Updated At", "Descending"],
    columns: ["Ministry/Department", "Financial Year", "Grant 10A", "Grant No. PFMS"],
    totalItems: 38,
    rows: [
      ["Department of Consumer Affairs", "2025-2026", "014", "014"],
      ["Department of Empowerment of Persons with Disabilities", "2025-2026", "094", "094"],
      ["Department of Fertilisers", "2025-2026", "006", "006"],
      ["Department of Fisheries", "2025-2026", "043", "043"],
      ["Department of Food and Public Distribution", "2025-2026", "015", "015"],
      ["Department of Health and Family Welfare", "2025-2026", "046", "046"],
      ["Department of Higher Education", "2025-2026", "026", "026"],
      ["Department of Land Resources", "2025-2026", "088", "088"],
      ["Department of Pharmaceuticals", "2025-2026", "007", "007"],
      ["Ministry of Coal", "2025-2026", "004", "004"],
    ],
  },
  "/scheme-management": {
    title: "Scheme List",
    addLabel: "Add Scheme",
    searchPlaceholder: "Search for",
    filters: ["2025-2026", "All Department"],
    columns: ["Scheme Name", "Ministry/Department", "FY", "BE", "RE", ""],
    totalItems: 235,
    rows: [
      ["National Mission on Natural Farming", "Department of Agriculture and Farmers Welfare", "2025-2026", "616.01", "97.88", "menu"],
      ["Krishionnati Yojana", "Department of Agriculture and Farmers Welfare", "2025-2026", "8000.00", "777.24", "menu"],
      ["Pradhan Mantri Kisan Samman Nidhi (PM-Kisan)", "Department of Agriculture and Farmers Welfare", "2025-2026", "63500.00", "11707.50", "menu"],
      ["Formation and Promotion of 10,000 FPOs", "Department of Agriculture and Farmers Welfare", "2025-2026", "584.00", "112.99", "menu"],
      ["Rashtriya Krishi Vikas Yojna", "Department of Agriculture and Farmers Welfare", "2025-2026", "8500.00", "1115.58", "menu"],
      ["Modified Interest Subvention Scheme (MISS)", "Department of Agriculture and Farmers Welfare", "2025-2026", "22600.00", "3993.60", "menu"],
      ["Pradhan Mantri Annadata Aay Sanrakshan Yojna", "Department of Agriculture and Farmers Welfare", "2025-2026", "6100.00", "1283.15", "menu"],
    ],
  },
  "/manage-outcome": {
    title: "Scheme wise Outcome List",
    addLabel: "Add Outcome",
    searchPlaceholder: "Search for",
    filters: ["2025-2026", "All Department"],
    columns: ["Scheme Name", "Ministry/Department", "FY", "Scheme Type", ""],
    totalItems: 0,
    rows: [],
  },
  "/document-management": {
    title: "Documents List",
    addLabel: "Add Document",
    searchPlaceholder: "Search for",
    columns: ["Doc Type", "Subject", "Date / FY", ""],
    totalItems: 1,
    rows: [
      ["Statement 10A", "Statement 10A 2025-2026", "2025-2026", "View"],
    ],
  },
  "/map-ministry": {
    title: "Mapped Ministry List",
    searchPlaceholder: "Search for",
    filters: ["Mapped", "2025-2026"],
    columns: ["Ministry Name", "PFMS Ministry", "Financial Year", "Type", ""],
    totalItems: 38,
    variant: "map-tabs",
    rows: [
      ["Department of Consumer Affairs", "Department of Consumer Affairs", "2025-2026", "Mapped", "Unmap"],
      ["Department of Empowerment of Persons with Disabilities", "Department of Empowerment of Persons with Disabilities", "2025-2026", "Mapped", "Unmap"],
      ["Department of Fertilisers", "Department of Fertilisers", "2025-2026", "Mapped", "Unmap"],
      ["Department of Fisheries", "Department of Fisheries", "2025-2026", "Mapped", "Unmap"],
      ["Department of Food and Public Distribution", "Department of Food and Public Distribution", "2025-2026", "Mapped", "Unmap"],
      ["Department of Health and Family Welfare", "Department of Health and Family Welfare", "2025-2026", "Mapped", "Unmap"],
      ["Department of Higher Education", "Department of Higher Education", "2025-2026", "Mapped", "Unmap"],
    ],
  },
  "/map-schema": {
    title: "Mapped Schemes List",
    searchPlaceholder: "Search for",
    filters: ["Mapped", "2025-2026"],
    columns: ["Scheme Name", "Ministry", "PFMS Scheme", "Financial Year", "Type", ""],
    totalItems: 203,
    variant: "map-tabs",
    rows: [
      ["National Mission on Natural Farming", "Department of Agriculture and Farmers Welfare", "NATIONAL MISSION ON NATURAL FARMING (CSS)", "2025-2026", "Mapped", "Unmap"],
      ["Krishionnati Yojana", "Department of Agriculture and Farmers Welfare", "KRISHIONNATI YOJANA", "2025-2026", "Mapped", "Unmap"],
      ["Pradhan Mantri Kisan Samman Nidhi (PM-Kisan)", "Department of Agriculture and Farmers Welfare", "PRADHAN MANTRI KISAN SAMMAN NIDHI", "2025-2026", "Mapped", "Unmap"],
      ["Formation and Promotion of 10,000 FPOs", "Department of Agriculture and Farmers Welfare", "FORMATION AND PROMOTION OF 10000 FARMER PRODUCER ORGANISATIONS (FPOs)", "2025-2026", "Mapped", "Unmap"],
      ["Rashtriya Krishi Vikas Yojna", "Department of Agriculture and Farmers Welfare", "RASHTRIYA KRISHI VIKAS YOJNA", "2025-2026", "Mapped", "Unmap"],
    ],
  },
  "/user-management": {
    title: "User List",
    addLabel: "Add user",
    searchPlaceholder: "Search for",
    filters: ["All Years"],
    columns: ["Officer Name", "User ID", "Email", "Phone Number", "Ministry/Department", "User Type", "Status", "Login Hours", ""],
    totalItems: 69,
    rows: [
      ["Shivendra", "shivendra123", "shivendras@dewsolutions.in", "6387899459", "Dept of Agricultural Research and Education", "Ministry", "Active", "—", "Edit"],
      ["Anand Verma", "anand.verma21", "anand.verma21@nic.in", "9990041133", "N/A", "Super Admin", "Active", "—", "Edit"],
      ["Jagdeep Kaur", "as2-msje", "horafed558@nike4s.com", "9000000078", "N/A", "Super Admin", "Active", "—", "Edit"],
      ["Ankur Singh", "ankursingh114039", "ankursingh114039@gmail.com", "8745866597", "N/A", "Super Admin", "Active", "—", "Edit"],
      ["Sh Akhilesh Kumar", "mott-dapsc", "Akhilesh.kumar99@gov.in", "N/A", "Ministry of Textiles", "Ministry", "Active", "—", "Edit"],
      ["Arpita Barman", "hod-sje", "hod-sje@nic.in", "9810218079", "N/A", "Super Admin", "Active", "—", "Edit"],
    ],
  },
  "/role-management": {
    title: "Role Management",
    addLabel: "Add Role",
    searchPlaceholder: "Search for Roles",
    columns: ["Role", "Role Description", "Actions"],
    totalItems: 1,
    rows: [
      ["Ministry", "Ministry", "role-actions"],
    ],
  },
  "/pfms-logs": {
    title: "PFMS Ingestion Logs",
    addLabel: "Trigger PFMS Refresh",
    searchPlaceholder: "Search for",
    filters: ["All financial years", "All tables", "All statuses"],
    columns: ["S.No.", "Started At", "Target Table", "Financial Year", "Status", "Attempt", "Previous", "Fetched", "Inserted", "Duration", "Finished At", "Job ID", "Message"],
    totalItems: 24,
    variant: "pfms",
    rows: [
      ["1", "23 May 2026, 15:19:17", "t_transfer_entry", "2026-2027", "success", "1", "4", "4", "4", "724 ms", "23 May 2026, 15:19:18", "job-001", "—"],
      ["2", "23 May 2026, 15:19:13", "t_release", "2026-2027", "success", "1", "7,008", "7,008", "7,008", "3.5 s", "23 May 2026, 15:19:16", "job-002", "—"],
      ["3", "23 May 2026, 15:03:55", "t_release", "2026-2027", "failed", "1", "7,008", "—", "—", "15m 18s", "23 May 2026, 15:19:13", "job-003", "Timeout"],
      ["4", "23 May 2026, 13:59:54", "t_transfer_entry", "2026-2027", "success", "1", "4", "4", "4", "709 ms", "23 May 2026, 13:59:55", "job-004", "—"],
      ["5", "23 May 2026, 13:59:50", "t_release", "2026-2027", "success", "1", "7,008", "7,008", "7,008", "4.1 s", "23 May 2026, 13:59:54", "job-005", "—"],
      ["6", "23 May 2026, 13:28:17", "t_transfer_entry", "2026-2027", "failed", "1", "4", "—", "—", "15m 47s", "23 May 2026, 13:44:04", "job-006", "Timeout"],
    ],
  },
  "/reports/financial-summary": {
    title: "Financial Summary",
    addLabel: "Export",
    searchPlaceholder: "Search for",
    filters: ["2025-2026"],
    columns: ["S.No", "Ministry/Department Name", "Total Allocation (Cr.)", "DAPSC Allocation (Cr.)", "% DAPSC w.r.t. Total", "Allocated DAPSC (%)", "Revised Allocation (Cr.)", "% Revised w.r.t. Total", "Expenditure (Cr.)", "Transfer Entry (Cr.)", "Total Expenditure (Cr.)", "% Expenditure w.r.t. Revised"],
    totalItems: 38,
    variant: "expenditure",
    rows: [
      ["1", "Department of Agricultural Research and Education", "3219.22", "267.19", "8.30 %", "8.30 %", "3219.22", "100.00 %", "250.45", "16.74", "267.19", "8.30 %"],
      ["2", "Department of Agriculture and Farmers Welfare", "123883.64", "22173.41", "17.90 %", "16.60 %", "133150.24", "107.48 %", "20948.22", "1225.19", "22173.41", "16.65 %"],
      ["3", "Department of Animal Husbandry and Dairying", "3780.00", "559.50", "14.80 %", "16.60 %", "4000.00", "105.82 %", "524.12", "35.38", "559.50", "13.99 %"],
      ["4", "Department of Commerce", "1698.67", "14.21", "0.84 %", "8.30 %", "1698.67", "100.00 %", "13.44", "0.77", "14.21", "0.84 %"],
      ["5", "Department of Consumer Affairs", "17.99", "1.50", "8.34 %", "8.30 %", "17.99", "100.00 %", "1.42", "0.08", "1.50", "8.34 %"],
      ["6", "Department of Empowerment of Persons with Disabilities", "741.80", "115.66", "15.59 %", "16.60 %", "741.80", "100.00 %", "109.22", "6.44", "115.66", "15.59 %"],
    ],
  },
  "/reports/statement-10a": {
    title: "Statement 10A as per budget document",
    subtitle: "(Allocation for the welfare of Scheduled Castes)",
    addLabel: "Export",
    searchPlaceholder: "Select a Financial Year and click View to load data.",
    filters: ["2025-2026", "-- All Ministries --"],
    columns: ["S.No", "Ministry/Department", "Scheme Name", "Total Allocation (Cr.)", "DAPSC Allocation (Cr.)", "% DAPSC Allocation w.r.t. Total Allocation", "Revised Allocation (Cr.)", "% Revised Allocation w.r.t. Total Allocation", "Expenditure (Cr.)", "% Expenditure w.r.t. Revised Allocation"],
    totalItems: 235,
    variant: "report-viewer",
    rows: [
      ["1", "Dept of Agricultural Research and Education", "Agricultural Production and Post-Production Mechanization", "95.74", "7.95", "8.30 %", "95.74", "100.00 %", "7.49", "7.82 %"],
      ["2", "Dept of Agricultural Research and Education", "Crop Science for Food and Nutritional Security", "965.46", "80.13", "8.30 %", "965.46", "100.00 %", "75.64", "7.83 %"],
      ["3", "Dept of Agricultural Research and Education", "Fisheries and Aquaculture for Sustainable Development", "192.81", "16.00", "8.30 %", "192.81", "100.00 %", "15.12", "7.84 %"],
      ["4", "Dept of Agricultural Research and Education", "Natural Resource Management", "229.09", "19.01", "8.30 %", "229.09", "100.00 %", "17.94", "7.83 %"],
    ],
  },
  "/ministry/physical-progress-data": {
    title: "Physical Progress Data",
    addLabel: "Add Progress",
    searchPlaceholder: "Search for",
    filters: ["All Financial Years", "All Schemes", "All Departments"],
    columns: ["Scheme Name", "Ministry/Department", "FY", "Quarter", "Physical Target", "Achievements", "Target Description", "Released Amount", "Remark", ""],
    totalItems: 0,
    variant: "expenditure",
    rows: [],
  },
};

// ── Form definitions ──────────────────────────────────────────────────────────

export const formDefs: Record<string, FormDef> = {
  "/admin/financial-year-management/add": {
    title: "Add Financial Year",
    submitLabel: "Add",
    fields: [
      { label: "Financial Year *", type: "text", placeholder: "e.g. 2025-2026", required: true },
      { label: "Current Financial *", type: "select", options: ["No", "Yes"], required: true },
    ],
  },
  "/admin/financial-year-management/edit": {
    title: "Edit Financial Year",
    submitLabel: "Update",
    fields: [
      { label: "Financial Year *", type: "text", placeholder: "e.g. 2025-2026", required: true },
      { label: "Current Financial *", type: "select", options: ["No", "Yes"], required: true },
    ],
  },
  "/ministry-management/add": {
    title: "Add Ministry/Department",
    submitLabel: "Add",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "2025-2026", required: true },
      { label: "Ministry/Department for Previous ID *", type: "select", placeholder: "Select Ministry/Department", required: true },
      { label: "Ministry/Department Name *", type: "text", placeholder: "Enter ministry/department name", required: true, fullWidth: true },
      { label: "Grant No. 10A *", type: "text", placeholder: "Enter Grant No. 10A", required: true },
      { label: "Grant No. PFMS *", type: "combobox", placeholder: "Select or type Grant No. PFMS", required: true },
    ],
  },
  "/ministry-management/edit": {
    title: "Edit Ministry/Department",
    submitLabel: "Update",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "2025-2026", required: true },
      { label: "Ministry/Department for Previous ID *", type: "select", placeholder: "Select Ministry/Department", required: true },
      { label: "Ministry/Department Name *", type: "text", placeholder: "Enter ministry/department name", required: true, fullWidth: true },
      { label: "Grant No. 10A *", type: "text", placeholder: "Enter Grant No. 10A", required: true },
      { label: "Grant No. PFMS *", type: "combobox", placeholder: "Select or type Grant No. PFMS", required: true },
    ],
  },
  "/scheme-management/add": {
    title: "Add Scheme",
    submitLabel: "Add",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "Select financial year", required: true },
      { label: "Ministry/Department *", type: "select", placeholder: "Select Ministry/Department", required: true },
      { label: "Scheme Code *", type: "text", placeholder: "Enter scheme code", required: true },
      { label: "Scheme Name *", type: "text", placeholder: "Enter scheme name", required: true },
      { label: "Sub Scheme Code", type: "text", placeholder: "Enter sub scheme code" },
      { label: "Sub Scheme Name", type: "text", placeholder: "Enter sub scheme name" },
      { label: "Total Allocation (Cr.) *", type: "number", placeholder: "0", required: true },
      { label: "DAPSC Allocation (Cr.) *", type: "number", placeholder: "0", required: true },
      { label: "Allocation Percent (%)", type: "number", placeholder: "0" },
      { label: "Revised Estimates (Cr)", type: "number", placeholder: "0" },
      { label: "Scheme Code PFMS (as per PFMS, if available)", type: "text", placeholder: "Enter scheme code PFMS", fullWidth: true },
    ],
  },
  "/scheme-management/edit": {
    title: "Edit Scheme",
    submitLabel: "Update",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "Select financial year", required: true },
      { label: "Ministry/Department *", type: "select", placeholder: "Select Ministry/Department", required: true },
      { label: "Scheme Code *", type: "text", placeholder: "Enter scheme code", required: true },
      { label: "Scheme Name *", type: "text", placeholder: "Enter scheme name", required: true },
      { label: "Sub Scheme Code", type: "text", placeholder: "Enter sub scheme code" },
      { label: "Sub Scheme Name", type: "text", placeholder: "Enter sub scheme name" },
      { label: "Total Allocation (Cr.) *", type: "number", placeholder: "0", required: true },
      { label: "DAPSC Allocation (Cr.) *", type: "number", placeholder: "0", required: true },
      { label: "Allocation Percent (%)", type: "number", placeholder: "0" },
      { label: "Revised Estimates (Cr)", type: "number", placeholder: "0" },
      { label: "Scheme Code PFMS (as per PFMS, if available)", type: "text", placeholder: "Enter scheme code PFMS", fullWidth: true },
    ],
  },
  "/manage-outcome/add": {
    title: "Add Outcome",
    submitLabel: "Add",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "2026-2027", required: true },
      { label: "Ministry/Department for Previous ID *", type: "select", placeholder: "Select Ministry/Department", required: true },
      { label: "Scheme Type *", type: "select", placeholder: "Select Scheme Type", required: true },
      { label: "Scheme Name *", type: "select", placeholder: "Select Scheme Name", required: true },
    ],
  },
  "/manage-outcome/edit": {
    title: "Edit Outcome",
    submitLabel: "Update",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "2026-2027", required: true },
      { label: "Ministry/Department for Previous ID *", type: "select", placeholder: "Select Ministry/Department", required: true },
      { label: "Scheme Type *", type: "select", placeholder: "Select Scheme Type", required: true },
      { label: "Scheme Name *", type: "select", placeholder: "Select Scheme Name", required: true },
    ],
  },
  "/document-management/add": {
    title: "Add Document",
    submitLabel: "Add",
    fields: [
      { label: "Document Type *", type: "select", placeholder: "Select document type", required: true },
      { label: "Date *", type: "date", required: true },
      { label: "Financial Year *", type: "select", placeholder: "Select financial year", required: true },
      { label: "Subject", type: "text", placeholder: "Enter subject" },
      { label: "Upload Document (PDF, max 10 MB)", type: "file", fullWidth: true },
    ],
  },
  "/document-management/edit": {
    title: "Edit Document",
    submitLabel: "Update",
    fields: [
      { label: "Document Type *", type: "select", placeholder: "Select document type", required: true },
      { label: "Date *", type: "date", required: true },
      { label: "Financial Year *", type: "select", placeholder: "Select financial year", required: true },
      { label: "Subject", type: "text", placeholder: "Enter subject" },
      { label: "Upload Document (PDF, max 10 MB)", type: "file", fullWidth: true },
    ],
  },
  "/user-management/add": {
    title: "Add User",
    submitLabel: "Add",
    fields: [
      { label: "Ministry/Department *", type: "select", placeholder: "Select Ministry/Department", required: true, fullWidth: true },
      { label: "Officer Name *", type: "text", placeholder: "Enter officer name", required: true },
      { label: "Designation *", type: "text", placeholder: "Enter designation", required: true },
      { label: "User Type *", type: "select", placeholder: "Select user type", required: true },
      { label: "User ID *", type: "text", placeholder: "Enter user ID", required: true },
      { label: "Phone Number", type: "text", placeholder: "Enter phone number" },
      { label: "Email ID *", type: "email", placeholder: "Enter email ID", required: true },
      { label: "Password *", type: "password", placeholder: "Enter password", required: true },
      { label: "Office Address *", type: "textarea", placeholder: "Enter office address", required: true, fullWidth: true },
    ],
  },
  "/user-management/edit": {
    title: "Edit User",
    submitLabel: "Update",
    fields: [
      { label: "Ministry/Department *", type: "select", placeholder: "Select Ministry/Department", required: true, fullWidth: true },
      { label: "Officer Name *", type: "text", placeholder: "Enter officer name", required: true },
      { label: "Designation *", type: "text", placeholder: "Enter designation", required: true },
      { label: "User Type *", type: "select", placeholder: "Select user type", required: true },
      { label: "User ID *", type: "text", placeholder: "Enter user ID", required: true },
      { label: "Phone Number", type: "text", placeholder: "Enter phone number" },
      { label: "Email ID *", type: "email", placeholder: "Enter email ID", required: true },
      { label: "Office Address *", type: "textarea", placeholder: "Enter office address", required: true, fullWidth: true },
    ],
  },
  "/ministry/physical-progress-data/add": {
    title: "Add Physical Progress",
    submitLabel: "Add",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "Select Financial Year", required: true },
      { label: "Grant Number (as per Statement 10A) *", type: "select", placeholder: "Select Financial Year first", required: true },
      { label: "Ministry Name (Auto-filled)", type: "readonly", placeholder: "Select Grant Number first" },
      { label: "Scheme Name *", type: "select", placeholder: "Select Grant Number first", required: true },
      { label: "Quarter *", type: "select", placeholder: "Select Quarter", required: true, options: ["Q1", "Q2", "Q3", "Q4", "Annual"] },
      { label: "Scheme Code PFMS (Auto-filled)", type: "readonly", placeholder: "Select scheme first" },
      { label: "Physical Target", type: "number", placeholder: "Enter Physical Target" },
      { label: "Achievement", type: "number", placeholder: "Enter Achievement" },
      { label: "Target Unit", type: "text", placeholder: "e.g. km, households, no. of beneficiaries" },
      { label: "Released Amount", type: "number", placeholder: "Enter Released Amount" },
      { label: "Target Description", type: "textarea", placeholder: "Enter Target Description" },
      { label: "Remarks *", type: "textarea", placeholder: "Enter Remarks", required: true },
    ],
  },
  "/ministry/physical-progress-data/edit": {
    title: "Edit Physical Progress",
    submitLabel: "Update",
    fields: [
      { label: "Financial Year *", type: "select", placeholder: "Select Financial Year", required: true },
      { label: "Grant Number (as per Statement 10A) *", type: "select", placeholder: "Select Financial Year first", required: true },
      { label: "Ministry Name (Auto-filled)", type: "readonly", placeholder: "Select Grant Number first" },
      { label: "Scheme Name *", type: "select", placeholder: "Select Grant Number first", required: true },
      { label: "Quarter *", type: "select", placeholder: "Select Quarter", required: true, options: ["Q1", "Q2", "Q3", "Q4", "Annual"] },
      { label: "Scheme Code PFMS (Auto-filled)", type: "readonly", placeholder: "Select scheme first" },
      { label: "Physical Target", type: "number", placeholder: "Enter Physical Target" },
      { label: "Achievement", type: "number", placeholder: "Enter Achievement" },
      { label: "Target Unit", type: "text", placeholder: "e.g. km, households, no. of beneficiaries" },
      { label: "Released Amount", type: "number", placeholder: "Enter Released Amount" },
      { label: "Target Description", type: "textarea", placeholder: "Enter Target Description" },
      { label: "Remarks *", type: "textarea", placeholder: "Enter Remarks", required: true },
    ],
  },
};

