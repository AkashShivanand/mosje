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
