/**
 * The attendance roster — beneficiaries, employees and the weekly/monthly returns behind the
 * live "Weekly Attendance" and "Attendance Master" screens.
 *
 * Field lists, option sets and the empty-state copy are transcribed from the live portal
 * (walkthrough 2026-08-22). Names below are fictional; the live account carries real residents.
 */
import { formatDate } from "./format.ts";


export const GENDERS = ["Male", "Female", "Other"] as const;
export const CATEGORIES = ["General", "OBC", "SC", "ST", "Other"] as const;

/** The live "ID Type" select, in the live order. */
export const ID_TYPES = [
  "Aadhaar",
  "Voter Card No",
  "Ration Card No",
  "Govt. Issue ID card",
  "Student ID Card",
  "BPL Card No",
  "UDID Card No",
  "UDID Enrollment No",
  "Pan Card No",
  "Driving Licence",
  "Passport No",
] as const;

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export interface Beneficiary {
  id: string;
  /** Project ID (`Institution.id`). A beneficiary belongs to one project, not to the NGO. */
  projectId: string;
  admissionDate?: string;
  name: string;
  gender: string;
  category?: string;
  idType: string;
  idNumber: string;
  mobile?: string;
  dob?: string;
  guardian?: string;
  remarks?: string;
  active: boolean;
}

/** The qualification ladder offered on Add Employee. */
export const QUALIFICATIONS = [
  "Class 10",
  "Class 12",
  "Diploma / ITI",
  "Graduate",
  "Post-graduate",
  "Professional (B.Ed., Nursing, Social Work)",
  "Other",
] as const;

export const DESIGNATIONS = [
  "Superintendent / Warden",
  "Teacher",
  "Counsellor",
  "Nurse",
  "Cook",
  "Accountant",
  "Security Guard",
  "Other",
] as const;

export interface QualificationDoc {
  fileName: string;
  sizeKb: number;
}

export interface Employee {
  id: string;
  projectId: string;
  name: string;
  designation?: string;
  category?: string;
  mobile?: string;
  /** When the employee's own mobile was confirmed by OTP. */
  mobileVerifiedAt?: string;
  qualification?: string;
  /** Certificates for the stated qualification. At least one is required on Add Employee. */
  qualificationDocs?: QualificationDoc[];
  joiningDate?: string;
  active: boolean;
}

export interface MonthlyReturn {
  month: string;
  fy: string;
  beneficiaries: number;
  avgPresent: number;
  percent: number;
  status: "Submitted" | "Awaiting Submission";
  submittedOn?: string;
}

export interface ReturnRow {
  /** First day of the month, ISO. */
  monthStart: string;
  fy: string;
  beneficiaries: number;
  /** Null when no return was submitted. */
  avgPresent: number | null;
  percent: number | null;
  status: "Submitted" | "Due" | "Not Submitted";
  submittedOn?: string;
}

/**
 * Every month of the running financial year up to today, and every month of the one before.
 *
 * The earlier table listed only the eleven submitted months of FY 2025-26, so the five months
 * of FY 2026-27 already over were simply absent while the page said "Awaiting Submission: 1"
 * (review panel, 13 Sep 2026). A month with no return is now a row that says so: "Due" for the
 * month running, "Not Submitted" for any month already past. June 2025 is kept as the gap the
 * live account shows.
 */
export function buildReturnRows(now: Date, strength: number, runningSince?: string | null): ReturnRow[] {
  // A project that has never been sanctioned owes no returns; one sanctioned on the portal owes
  // them from the month after its sanction. `undefined` is a project already running before the
  // portal's records begin, which owes the full window. See `projectRunningSince`.
  if (runningSince === null) return [];
  const sinceMonth = runningSince ? new Date(runningSince) : undefined;
  const firstDue = sinceMonth ? Date.UTC(sinceMonth.getUTCFullYear(), sinceMonth.getUTCMonth() + 1, 1) : -Infinity;
  const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const rows: ReturnRow[] = [];
  const fyOf = (y: number) => `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
  for (let startYear = fyStartYear - 1; startYear <= fyStartYear; startYear++) {
    for (let m = 0; m < 12; m++) {
      const year = m <= 8 ? startYear : startYear + 1;
      const monthIndex = (m + 3) % 12;
      const start = new Date(Date.UTC(year, monthIndex, 1));
      if (start.getTime() > now.getTime()) break;
      if (start.getTime() < firstDue) continue;
      const current = year === now.getFullYear() && monthIndex === now.getMonth();
      const gap = year === 2025 && monthIndex === 5;
      if (current || gap) {
        rows.push({ monthStart: start.toISOString(), fy: fyOf(startYear), beneficiaries: strength, avgPresent: null, percent: null, status: current ? "Due" : "Not Submitted" });
        continue;
      }
      const present = strength - ((m * 7 + startYear) % 4);
      rows.push({
        monthStart: start.toISOString(),
        fy: fyOf(startYear),
        beneficiaries: strength,
        avgPresent: present,
        percent: Math.round((present / Math.max(strength, 1)) * 1000) / 10,
        status: "Submitted",
        submittedOn: new Date(Date.UTC(year, monthIndex, 28, 6, 30)).toISOString(),
      });
    }
  }
  return rows.reverse();
}

const FIRST = [
  "Aarti", "Aditi", "Ananya", "Anjali", "Archana", "Arohi", "Bhavna", "Bhumika", "Chandana",
  "Darshita", "Deepali", "Diksha", "Dipika", "Divya", "Garima", "Gauri", "Heena", "Ishita",
  "Jyoti", "Kavita", "Komal", "Lata", "Madhuri", "Manisha", "Meena", "Neha", "Nisha", "Pooja",
  "Priya", "Radha", "Rekha", "Ritu", "Sangeeta", "Sarita", "Seema", "Shalini", "Shweta",
  "Sunita", "Swati", "Usha", "Vandana", "Vidya", "Yamini", "Anita", "Bindu",
];
const LAST = ["Devi", "Kumari", "Sharma", "Patil", "More", "Jadhav", "Pawar", "Gaikwad", "Rane", "Sawant"];
const GUARDIANS = [
  "Vijay Pal", "Vivek Kumar", "Sanjeev Kumar", "Surendra Singh", "Raju Prasad", "Ram Lal",
  "Rajendra Singh", "Yogesh Kumar", "Vinod Kumar", "Prem Singh",
];

/** A deterministic roster, so the demo reads the same on every load. */
export function buildBeneficiaries(projectId: string, count = 110, deactivated = 14, offset = 0): Beneficiary[] {
  const out: Beneficiary[] = [];
  for (let i = 0; i < count + deactivated; i++) {
    // Surname advances only after every given name is used, so no two residents share a name.
    const k = i + offset;
    const name = `${FIRST[k % FIRST.length]} ${LAST[Math.floor(k / FIRST.length) % LAST.length]}`;
    out.push({
      id: `ben-${projectId}-${(i + 1).toString().padStart(3, "0")}`,
      projectId,
      admissionDate: `20${24 + (i % 3)}-0${1 + (i % 9)}-1${i % 9}`,
      name,
      gender: "Female",
      category: "SC",
      idType: ID_TYPES[i % 3 === 0 ? 0 : i % 3 === 1 ? 4 : 2]!,
      idNumber: `${(100000000000 + k * 7919).toString()}`,
      guardian: GUARDIANS[i % GUARDIANS.length],
      active: i < count,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

const STAFF: readonly [string, (typeof DESIGNATIONS)[number], (typeof QUALIFICATIONS)[number]][] = [
  ["Sunanda Kulkarni", "Superintendent / Warden", "Post-graduate"],
  ["Mahesh Bhosale", "Teacher", "Professional (B.Ed., Nursing, Social Work)"],
  ["Rohini Deshmukh", "Teacher", "Graduate"],
  ["Anil Shinde", "Counsellor", "Post-graduate"],
  ["Lalita Waghmare", "Nurse", "Professional (B.Ed., Nursing, Social Work)"],
  ["Ganesh Kamble", "Cook", "Class 10"],
  ["Prakash Salunkhe", "Security Guard", "Class 12"],
];

/** Staff for one project — every employee verified and carrying a certificate. */
export function buildEmployees(projectId: string, count = STAFF.length): Employee[] {
  return STAFF.slice(0, count).map(([name, designation, qualification], i) => ({
    id: `emp-${projectId}-${i + 1}`,
    projectId,
    name,
    designation,
    category: i % 3 === 0 ? "SC" : "General",
    mobile: `98${(22014530 + i * 1379).toString().slice(0, 8)}`,
    mobileVerifiedAt: "2026-04-02T05:30:00.000Z",
    qualification,
    qualificationDocs: [{ fileName: `${name.split(" ")[0]!.toLowerCase()}-certificate.pdf`, sizeKb: 180 + i * 37 }],
    joiningDate: `20${19 + (i % 6)}-06-01`,
    active: true,
  }));
}

/** Monday of the week containing `date`. */
export function weekStart(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeekLabel(date: Date): string {
  const start = weekStart(date);
  return `Week of ${formatDate(start)} (Mon–Sun)`;
}

const MONTHS = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

/** The eleven submitted months the live Attendance Master shows for FY 2025-26. */
export function buildMonthlyReturns(): MonthlyReturn[] {
  const strength = 113;
  const present = [111, 112, 0, 112, 112, 113, 111, 110, 110, 110, 111, 112];
  const rows: MonthlyReturn[] = [];
  MONTHS.forEach((m, i) => {
    const avg = present[i]!;
    if (avg === 0) return; // June is not on record, exactly as the live account shows
    const calendarYear = i <= 8 ? 2025 : 2026;
    const monthIndex = i <= 8 ? i + 3 : i - 9;
    const submitted = new Date(Date.UTC(calendarYear, monthIndex, 28, 6, 30));
    rows.push({
      month: `${m} ${calendarYear}`,
      fy: "2025-26",
      beneficiaries: strength,
      avgPresent: avg,
      percent: Math.round((avg / strength) * 1000) / 10,
      status: "Submitted",
      submittedOn: submitted.toISOString().slice(0, 16).replace("T", " "),
    });
  });
  return rows.reverse();
}
