/**
 * The attendance roster — beneficiaries, employees and the weekly/monthly returns behind the
 * live "Weekly Attendance" and "Attendance Master" screens.
 *
 * Field lists, option sets and the empty-state copy are transcribed from the live portal
 * (walkthrough 2026-08-22). Names below are fictional; the live account carries real residents.
 */
import { formatDate } from "./format";


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

export interface Employee {
  id: string;
  name: string;
  designation?: string;
  mobile?: string;
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
export function buildBeneficiaries(count = 110, deactivated = 14): Beneficiary[] {
  const out: Beneficiary[] = [];
  for (let i = 0; i < count + deactivated; i++) {
    // Surname advances only after every given name is used, so no two residents share a name.
    const name = `${FIRST[i % FIRST.length]} ${LAST[Math.floor(i / FIRST.length) % LAST.length]}`;
    out.push({
      id: `ben-${(i + 1).toString().padStart(3, "0")}`,
      name,
      gender: "Female",
      category: "SC",
      idType: ID_TYPES[i % 3 === 0 ? 0 : i % 3 === 1 ? 4 : 2]!,
      idNumber: `${(100000000000 + i * 7919).toString()}`,
      guardian: GUARDIANS[i % GUARDIANS.length],
      active: i < count,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
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
