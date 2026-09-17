/**
 * The weekly attendance an officer reads for one project: who was present on each day, each
 * person's week, and the two flags an officer acts on — staff below the attendance threshold, and
 * beneficiaries absent for a long unbroken stretch (e-Anudaan parity brief §D item 3).
 *
 * The prototype keeps no daily marks in the store — the NGO's weekly register certifies totals —
 * so the marks are drawn deterministically from the person and the date, on the same high band the
 * monthly returns report. A day after today, or before the project owes returns, has no mark.
 *
 * Run: node --test src/lib/e-anudaan/weekly-attendance.test.ts
 */

export const STAFF_THRESHOLD_PERCENT = 75;
/** A beneficiary absent this many days running, up to the end of the week, is flagged. */
export const LONG_ABSENCE_DAYS = 7;
const STREAK_LOOKBACK_DAYS = 60;

export type Kind = "beneficiaries" | "staff";
/** Present, absent, or no mark owed that day. */
export type Mark = "P" | "A" | null;

const DAY = 86_400_000;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** `yyyy-mm-dd` of a local date. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Monday 00:00 of the week `date` falls in. */
export function mondayOf(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

/**
 * Whether a mark is owed on `day`: not after today, and not before the project began owing returns
 * (`since`; `undefined` means it was already running, `null` that it owes none).
 */
export function markOwed(day: Date, now: Date, since: string | null | undefined): boolean {
  if (since === null) return false;
  if (dayKey(day) > dayKey(now)) return false;
  return !since || dayKey(day) >= since.slice(0, 10);
}

/** One person's mark on one day. Deterministic. */
export function markOn(personId: string, kind: Kind, day: Date, now: Date, since: string | null | undefined): Mark {
  if (!markOwed(day, now, since)) return null;
  const who = hash(`${kind}:${personId}`);
  const dayNo = Math.floor(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()) / DAY);
  if (kind === "beneficiaries") {
    // About one resident in twenty-three is away for a fortnight in every six weeks.
    if (who % 23 === 5 && Math.floor((dayNo + (who % 42)) / 14) % 3 === 0) return "A";
    return hash(`${personId}:${dayNo}`) % 100 < 3 ? "A" : "P";
  }
  // About one member of staff in five misses three days a week.
  if (who % 5 === 2) return hash(`${personId}:${dayNo}`) % 7 < 3 ? "A" : "P";
  return hash(`${personId}:${dayNo}`) % 100 < 6 ? "A" : "P";
}

export interface WeekPerson {
  id: string;
  name: string;
  /** A second line: designation, or a masked identity. */
  detail?: string;
}

export interface PersonWeek extends WeekPerson {
  marks: Mark[];
  present: number;
  /** Days a mark is owed this week. */
  recorded: number;
  percent: number | null;
  /** Consecutive absent days ending on the last day marked this week. */
  absentStreak: number;
  flag?: "below-threshold" | "long-absence";
}

export interface WeekReading {
  weekStart: string;
  days: string[];
  rows: PersonWeek[];
  /** Days of the week a mark is owed on. */
  recordedDays: number;
  /** Person-days present over person-days owed, one decimal. Null when nothing is owed. */
  percent: number | null;
  flagged: number;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** The week, for every person on the roll, with its flags. One reading for the table and the totals. */
export function readWeek(people: readonly WeekPerson[], kind: Kind, weekStart: Date, now: Date, since: string | null | undefined): WeekReading {
  const start = mondayOf(weekStart);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  let present = 0;
  let owed = 0;
  let flagged = 0;
  const rows = people.map((p): PersonWeek => {
    const marks = days.map((d) => markOn(p.id, kind, d, now, since));
    const own = marks.filter((m) => m === "P").length;
    const recorded = marks.filter((m) => m !== null).length;
    present += own;
    owed += recorded;
    const last = [...days].reverse().find((d) => markOwed(d, now, since));
    let absentStreak = 0;
    if (last) {
      for (let i = 0; i < STREAK_LOOKBACK_DAYS; i++) {
        const d = new Date(last.getFullYear(), last.getMonth(), last.getDate() - i);
        if (markOn(p.id, kind, d, now, since) !== "A") break;
        absentStreak += 1;
      }
    }
    const percent = recorded ? round1((own / recorded) * 100) : null;
    const flag =
      kind === "staff" && percent !== null && percent < STAFF_THRESHOLD_PERCENT
        ? "below-threshold"
        : kind === "beneficiaries" && absentStreak >= LONG_ABSENCE_DAYS
          ? "long-absence"
          : undefined;
    if (flag) flagged += 1;
    return { ...p, marks, present: own, recorded, percent, absentStreak, flag };
  });
  return {
    weekStart: dayKey(start),
    days: days.map(dayKey),
    rows,
    recordedDays: days.filter((d) => markOwed(d, now, since)).length,
    percent: owed ? round1((present / owed) * 100) : null,
    flagged,
  };
}
