/**
 * Whether a record is CURRENT or ARCHIVED — one rule, for every website design.
 *
 * dosje.gov.in marks each scheme, tender and vacancy Active or Archived by hand
 * (`component_status`), and the live Tenders page lists the two groups under tabs
 * of their own. The ingest keeps that tag (`apps/hub/scripts/ingest/collections.mjs`),
 * and this is the only place that reads it, so the New design, the DBIM design and
 * the Archives page cannot disagree about what is open.
 *
 * THE DATE IS THE FALLBACK, NOT THE RULE. Until 30 Sep 2026 the estate had no tag to
 * read and guessed: anything published within twelve months counted as current. That
 * showed **305 of 312 tenders and 152 of 165 vacancies as open**, including tenders
 * from 2025 the Department had long since closed — a citizen could not tell which
 * were live. The twelve-month rule survives only for a record ingested before the tag
 * was kept, so nothing disappears from a register that has not been re-read yet.
 */
import { isArchived } from "@/components/website-next/ui/records";

/**
 * A record as far as this rule is concerned: live's tag, and the publish date.
 *
 * `status` is typed as a plain string because the ingest does not constrain it on the
 * rich collections (`schema.mjs` takes any term there), and a third term appearing on
 * dosje.gov.in should not fail an ingest. The rule below decides what to do with one.
 */
export interface StatusBearingRecord {
  status?: string;
  date?: string;
}

/**
 * True when the Department has archived this record — its own tag first, the date
 * only if it has none.
 *
 * ONE ARGUMENT, DELIBERATELY. Both of these are handed straight to `Array.filter`,
 * which passes the index as the second argument; a `now: Date = new Date()` second
 * parameter compiles as `now: number` there and silently changes the cutoff. Take a
 * clock with `archivedAt()` instead of adding one here.
 */
export function isArchivedRecord(record: StatusBearingRecord): boolean {
  if (record.status === "Archived") return true;
  if (record.status === "Active") return false;
  /* No tag, or a term we do not recognise: fall back rather than guess which side an
     unfamiliar word means. A record ingested before the tag was kept lands here. */
  return isArchived(record.date);
}

/** The counterpart, for a filter that reads better as a positive. */
export function isCurrentRecord(record: StatusBearingRecord): boolean {
  return !isArchivedRecord(record);
}

/** The same rule against a stated clock, for a test or a dated report. */
export function archivedAt(record: StatusBearingRecord, now: Date): boolean {
  if (record.status === "Archived") return true;
  if (record.status === "Active") return false;
  return isArchived(record.date, now);
}
