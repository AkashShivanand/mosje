import { LatestUpdatesPanel } from "@/components/website/LatestUpdatesPanel";
import { getDocuments, getTenders, getVacancies } from "@/lib/website/content";
import type { FileRecord } from "@/types/website/content";
import type { TickerItem } from "@mosje/design-system";

/**
 * The website's Latest Updates panel.
 *
 * ── IT READS THE DEPARTMENT'S OWN RECORDS ─────────────────────────────────
 * It used to be eight notices typed into this file. The ingested content has
 * 1,624 documents, 137 vacancies and 305 tenders, all with real dates — so the
 * list was both stale and, more to the point, SHORTER THAN THE PANEL. A panel
 * taller than its list has nothing to scroll past, so the marquee stopped
 * running and the pause control disappeared with it. Feeding it the real feed
 * fixes the symptom by removing the cause.
 *
 * ── WHY THIS IS A SERVER COMPONENT ────────────────────────────────────────
 * Because the records must NOT reach the browser. Importing the content module
 * into a client component bundles every one of those 2,000+ entries into the
 * page. The selection happens here and only the chosen handful crosses over;
 * `LatestUpdatesPanel` is the client half, and exists solely so `next/link` can
 * be passed as `linkAs`.
 *
 * ── WHAT COUNTS AS AN UPDATE ──────────────────────────────────────────────
 * Notices, circulars, vacancies and tenders — the four kinds a citizen would
 * call news. Deliberately NOT the whole document library: "Advices" alone is 734
 * records and "Resources" 233, and neither is an announcement. Everything is
 * sorted by date, newest first, and a record without one is dropped rather than
 * floated to the top by an empty string.
 */

const COUNT = 24;

/** The four kinds that are announcements, and what to call each in the rail. */
const KINDS: Array<{ records: () => FileRecord[]; only?: string[]; label: (r: FileRecord) => string }> = [
  {
    records: getDocuments,
    only: ["Notice", "Circulars & Notifications"],
    label: (r) => (r.category === "Notice" ? "Notice" : "Circular"),
  },
  { records: getVacancies, label: () => "Vacancy" },
  { records: getTenders, label: () => "Tender" },
];

/**
 * "18 Aug 2026" — `en-IN` in IST, stated EXPLICITLY rather than left to the
 * visitor's locale. This is a server component, so the format is fixed at build
 * time and cannot disagree with what the browser would have rendered; naming the
 * zone also keeps a date from sliding a day either side of midnight.
 */
function displayDate(iso: string): string {
  return new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function latestUpdates(): TickerItem[] {
  const pool = KINDS.flatMap(({ records, only, label }) =>
    records()
      .filter((r) => r.date && (!only || (r.category && only.includes(r.category))))
      .map((r) => ({ record: r, kind: label(r) })),
  );

  return pool
    .sort((a, b) => (b.record.date ?? "").localeCompare(a.record.date ?? ""))
    .slice(0, COUNT)
    .map(({ record, kind }) => ({
      id: `${kind}-${record.slug}`,
      title: record.title,
      description: kind,
      date: displayDate(record.date as string),
      dateTime: record.date,
      // The record's own page on the department's site. `fileUrl` is the PDF
      // itself where there is one, which is what a citizen following a notice
      // actually wants.
      href: record.fileUrl ?? record.sourceUrl,
    }));
}

export function LatestUpdates() {
  return <LatestUpdatesPanel items={latestUpdates()} />;
}
