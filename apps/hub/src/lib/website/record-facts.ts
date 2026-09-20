import type { DescriptionItem } from "@mosje/design-system";
import type { DocumentRecord, LabelledFile } from "@/types/website/content";

/**
 * The register's own fields, turned into a description list.
 *
 * ── ONE DERIVATION, NOT ONE PER PAGE ─────────────────────────────────────────
 * Five routes render a `DocumentRecord`: the library, the Central List of OBCs,
 * scheme documents, suo-moto disclosures and the type-specific pages. They must
 * print the same field the same way — a size that reads "0.11 MB" on one page
 * and "0.11 mb" on another is the register contradicting itself.
 *
 * ── A FIELD THE RECORD DOES NOT PUBLISH IS LEFT OFF ──────────────────────────
 * Not rendered as "Not available". 1,019 documents publish no size and 77 carry
 * no file at all; a column of "Not available" is the pipeline talking about
 * itself, which `ui-restraint-and-copy.md` bans from the screen. What the
 * department published is shown; what it did not is absent.
 */

/** The site prints dd/mm/yyyy; the ingest normalised to yyyy-mm-dd where it parsed. */
export function humanDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });
}

/** Drop every row whose value the record does not publish. */
export function facts(
  rows: { term: string; value: string | undefined; wide?: boolean }[],
): DescriptionItem[] {
  return rows
    .filter((r): r is { term: string; value: string; wide?: boolean } => Boolean(r.value))
    .map((r) => ({ term: r.term, value: r.value, wide: r.wide }));
}

export function documentFacts(doc: DocumentRecord): DescriptionItem[] {
  return facts([
    { term: "Organisation", value: doc.organisations?.join(", ") ?? doc.organisation },
    { term: "Type", value: doc.types?.join(", ") ?? doc.category },
    { term: "Year", value: doc.year },
    { term: "File Size", value: doc.fileSize },
    { term: "File Type", value: doc.fileType },
    { term: "Published From", value: humanDate(doc.publishStart) },
    { term: "Published Until", value: humanDate(doc.publishEnd) },
    { term: "Record Date", value: humanDate(doc.date) },
    { term: "Scheme", value: doc.scheme },
    { term: "Commission", value: doc.commission },
    { term: "State", value: doc.states?.join(", ") },
    { term: "Serial Number", value: doc.serialNumber },
    { term: "Status", value: doc.status },
    { term: "Tags", value: doc.tags?.join(", "), wide: true },
  ]);
}

/**
 * The files a document record attaches.
 *
 * `fileUrl` is an upload on the department's CDN; `externalUrl` is the "View"
 * link the theme renders where there is no upload. 179 records also publish a
 * Hindi file, and it is offered as its own labelled entry rather than folded
 * into the English one — a reader who wants the Hindi version should not have
 * to open the English one to find out whether it exists.
 */
export function documentFiles(doc: DocumentRecord): LabelledFile[] {
  const out: LabelledFile[] = [];
  if (doc.fileUrl) {
    out.push({
      label: doc.fileSize ? `Open Document (${doc.fileSize})` : "Open Document",
      url: doc.fileUrl,
      fileType: doc.fileType,
    });
  } else if (doc.externalUrl) {
    out.push({ label: "Open Document", url: doc.externalUrl });
  }
  if (doc.fileUrlHi) {
    out.push({
      label: doc.fileSizeHi ? `हिंदी संस्करण (${doc.fileSizeHi})` : "हिंदी संस्करण",
      url: doc.fileUrlHi,
    });
  }
  return out;
}
