/**
 * Pure helpers for the redesign's record rows: titles, file labels, dates.
 * Server- and client-safe (no React, no DOM).
 */

/**
 * Record titles arrive with runs of spaces, surrounding quotes and a trailing
 * full stop or colon (issue CON-20). Tidy the punctuation; never rewrite words.
 */
export function tidyTitle(value: string | undefined | null): string {
  if (!value) return "";
  let t = value.replace(/\s+/g, " ").trim();
  const quoted = /^["'“‘](.*)["'”’]$/.exec(t);
  /* Only a single wrapping pair: “A”, “B” is two quoted names, not one quoted title. */
  if (quoted && !/["“”‘’]/.test(quoted[1] ?? "")) t = (quoted[1] ?? "").trim();
  return t.replace(/[\s.:;,]+$/, "").trim();
}

/** A destination that leaves this site, and therefore opens in a new window. */
export const isExternal = (href: string | undefined | null): boolean => /^https?:\/\//i.test(href ?? "");

/** A value the register did not publish: empty, a dash, or the classic site's "NA" (CON-07). */
export function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  const s = String(value).trim();
  return s === "" || /^(—|–|-|NA|N\/A|null|undefined)$/i.test(s);
}

/** The file type, from the record where it says, else from the URL's extension. */
export function fileTypeOf(url: string | undefined | null, declared?: string | null): string | undefined {
  if (declared && declared.trim()) return declared.trim().toUpperCase();
  if (!url) return undefined;
  const m = /\.([a-z0-9]{2,5})(?:[?#]|$)/i.exec(url);
  if (!m) return undefined;
  const ext = (m[1] ?? "").toUpperCase();
  return ["PDF", "DOC", "DOCX", "XLS", "XLSX", "PPT", "PPTX", "ZIP", "CSV", "ODT", "ODS"].includes(ext) ? ext : undefined;
}

/**
 * One way to print a size (issue DOC-02): KB below 1 MB, MB to one decimal
 * above it. A value that does not parse is dropped, never guessed at.
 */
export function formatFileSize(value: string | undefined | null): string | undefined {
  if (isBlank(value)) return undefined;
  const m = /([\d.]+)\s*(KB|MB|GB|B)\b/i.exec(String(value));
  if (!m) return undefined;
  const n = Number.parseFloat(m[1] ?? "");
  if (!Number.isFinite(n) || n <= 0) return undefined;
  const unit = (m[2] ?? "").toUpperCase();
  const kb = unit === "GB" ? n * 1024 * 1024 : unit === "MB" ? n * 1024 : unit === "KB" ? n : n / 1024;
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`;
  const mb = kb / 1024;
  return `${mb >= 100 ? Math.round(mb) : Math.round(mb * 10) / 10} MB`;
}

/** "(PDF, 4.2 MB)" — the parts that are known, or undefined when neither is. */
export function fileMeta(url: string | undefined | null, type?: string | null, size?: string | null): string | undefined {
  const parts = [fileTypeOf(url, type), formatFileSize(size)].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

/** Milliseconds for sorting; unparseable dates sort last. */
export function dateValue(value: unknown): number {
  if (isBlank(value)) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(String(value));
  return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
}

/** The archive rule (issue MAN-06): published more than twelve months before `now`. */
export const ARCHIVE_MONTHS = 12;

export function archiveCutoff(now: Date = new Date()): number {
  const d = new Date(now);
  d.setMonth(d.getMonth() - ARCHIVE_MONTHS);
  return d.getTime();
}

export function isArchived(date: string | undefined, now: Date = new Date()): boolean {
  const t = dateValue(date);
  return t !== Number.NEGATIVE_INFINITY && t < archiveCutoff(now);
}

/** The date an item moved to the Archives under the twelve-month rule, as YYYY-MM-DD. */
export function archivedOn(date: string | undefined): string | undefined {
  const t = dateValue(date);
  if (t === Number.NEGATIVE_INFINITY) return undefined;
  const d = new Date(t);
  d.setUTCMonth(d.getUTCMonth() + ARCHIVE_MONTHS);
  return d.toISOString().slice(0, 10);
}

/* ── Annual reports ─────────────────────────────────────────────────────── */

/**
 * The year a report COVERS, read from its own title — never the register's
 * `year` field, which on this set is the upload year (the Dr. Ambedkar
 * Foundation's "Annual Report 2024-25" carries 2026) and is missing from the
 * Department's own 2025-26 report.
 *
 * - A financial year, however written ("2024-25", "2025-2026", "2019 – 22"),
 *   prints as "2024-25"; one that crosses a century keeps both ("1999-2000").
 * - Two financial years print as "A & B"; three or more as "first to last".
 *   A two-digit start ("97 – 98") is read in the century of the year before it.
 * - Otherwise, a title naming exactly one calendar year ("Annual Report PCR
 *   2016") gives that year, and one naming two gives both ("1991 & 1992").
 *   Anything else is undefined, and the table prints "–".
 */
export function reportYear(title: string | undefined | null): string | undefined {
  if (!title) return undefined;
  const spans: [number, number][] = [];
  const re = /(?<![\d./])(\d{4}|\d{2})\s*[-–]\s*(\d{4}|\d{2})(?![\d./])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(title))) {
    const a = m[1] ?? "";
    const b = m[2] ?? "";
    let start: number;
    if (a.length === 4) start = Number(a);
    else {
      const prev = spans[spans.length - 1];
      if (!prev) continue;
      start = Math.floor(prev[0] / 100) * 100 + Number(a);
      if (start < prev[0]) start += 100;
    }
    let end = b.length === 4 ? Number(b) : Math.floor(start / 100) * 100 + Number(b);
    if (b.length === 2 && end <= start) end += 100;
    if (start < 1950 || start > 2099 || end <= start || end - start > 5) continue;
    spans.push([start, end]);
  }
  const fy = ([s, e]: [number, number]) =>
    Math.floor(s / 100) === Math.floor(e / 100) ? `${s}-${String(e % 100).padStart(2, "0")}` : `${s}-${e}`;
  if (spans.length === 1) return fy(spans[0]!);
  if (spans.length === 2) return `${fy(spans[0]!)} & ${fy(spans[1]!)}`;
  if (spans.length > 2) return `${fy(spans[0]!)} to ${fy(spans[spans.length - 1]!)}`;
  const years = [...new Set(title.match(/(?<![\d./])(19[5-9]\d|20\d{2})(?![\d./])/g) ?? [])];
  if (years.length === 1) return years[0];
  /* "Annual Report (1991 & 1992)", "Annual Report (1993 to 1995)". */
  if (years.length === 2) return `${years[0]}${/\bto\b/i.test(title) ? " to " : " & "}${years[1]}`;
  return undefined;
}

/** The first year a report covers, for ordering; undefined where the title names none. */
export function reportYearStart(title: string | undefined | null): number | undefined {
  const y = reportYear(title);
  return y ? Number(y.slice(0, 4)) : undefined;
}

/* ── Tender and vacancy notices ─────────────────────────────────────────── */

/**
 * A title the ingest cut short. 53 tender titles in the register stop at the
 * twelfth character ("Annual Contr", "Award of Wor"), and their slugs were made
 * from the cut text, so there is no longer title anywhere in the record to
 * recover. No tender notice can be named in twelve characters, so a tender
 * title of twelve or fewer is taken as cut. Only call this on tender titles:
 * "Car Driver" is a whole vacancy title.
 */
export const TRUNCATED_TITLE_MAX = 12;

export function isTruncatedTitle(title: string | undefined | null): boolean {
  const t = (title ?? "").trim();
  return t.length > 0 && t.length <= TRUNCATED_TITLE_MAX && !/[.)\]]$/.test(t);
}

/** A cut title is never shown as though it were whole: it ends in an ellipsis. */
export function displayNoticeTitle(title: string): string {
  const t = tidyTitle(title);
  return isTruncatedTitle(title) ? `${t}…` : t;
}

/**
 * Drop notices the register publishes twice: the same title (spacing and case
 * ignored) on the same date. Cut titles are exempt — seven "Offers are i"
 * posts on one day are seven notices whose names were lost, not one notice
 * repeated, and removing six of them would hide real tenders.
 */
export function dedupeNotices<T extends { title: string; date?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    if (isTruncatedTitle(i.title)) return true;
    const key = `${i.title.replace(/\s+/g, " ").trim().toLowerCase()}|${i.date ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
