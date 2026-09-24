import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { Crumb } from "@/components/website-next/layout/PageHeader";
import { RecordTable, type RecordColumn, type RecordFilter } from "@/components/website-next/ui/RecordTable";
import { dateValue, reportYear, reportYearStart, tidyTitle } from "@/components/website-next/ui/records";
import type { DocumentRecord } from "@/types/website/content";
import "./records.css";

export interface RecordLibraryProps {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  lastUpdated?: string;
  /** The register, already narrowed to this page's heading. */
  records: DocumentRecord[];
  /** Where a record's own page lives, e.g. "/website/documents". */
  detailBase: string;
  /** What one row is called, in running text. @default "documents" */
  noun?: string;
  nounSingular?: string;
  /** Allow the Year column and filter. Dropped anyway where no record has a year. @default true */
  showYear?: boolean;
  /** Kept for the page files' props. The redesign shows one Published date per row. */
  showPublishWindow?: boolean;
  /** Allow the Organisation column and filter. @default true */
  showOrganisation?: boolean;
  /** A type chip on each row and a Type filter — for a page holding several types. */
  showCategory?: boolean;
  /** Sentence shown when the Department publishes nothing under this heading. */
  emptyMessage?: string;
  /** Department text above the register, rendered as prose. */
  intro?: React.ReactNode;
  /**
   * Read the Year from the record's TITLE (`reportYear`) instead of the
   * register's `year`, which on some sets is the upload year. Also orders the
   * rows by the year covered, newest first. @default false
   */
  yearFromTitle?: boolean;
  /**
   * With `yearFromTitle`: this organisation's most recent report leads the
   * list, ahead of every other body's (the Department's own current report
   * first on Annual Reports).
   */
  leadOrganisation?: string;
  /**
   * Separates records of another kind that the register files under this
   * heading (a company's MGT-7 return among annual reports). Returns the kind,
   * or undefined for `defaultKind`. A chip marks the other kinds, and a Type
   * filter appears once there is more than one.
   */
  kindOf?: (r: DocumentRecord) => string | undefined;
  defaultKind?: string;
}

/**
 * A document register (Advices, Circulars, Annual Reports …) in the redesign.
 *
 * One row per document, the same row everywhere (issue LAY-08): the title,
 * which opens the record's own page and makes the whole row one link; its
 * organisation; its year where the register gives one; the date it was
 * published; and one action, "View Document", with the file type and size
 * (issues ACC-27, CON-21, DOC-02). Newest first (X-FR-02). A server component:
 * it shapes the rows, and the table does the searching, sorting and paging.
 */
export function RecordLibrary({
  title,
  description,
  breadcrumb,
  lastUpdated,
  records,
  detailBase,
  noun = "documents",
  nounSingular,
  showYear = true,
  showOrganisation = true,
  showCategory = false,
  emptyMessage,
  intro,
  yearFromTitle = false,
  leadOrganisation,
  kindOf,
  defaultKind,
}: RecordLibraryProps) {
  const ordered = yearFromTitle ? orderByYearCovered(records, leadOrganisation) : records;
  const rows = ordered.map((r) => {
    const kind = kindOf ? (kindOf(r) ?? defaultKind) : undefined;
    return {
      title: tidyTitle(r.title),
      href: `${detailBase}/${r.slug}`,
      type: kindOf ? kind : (r.category ?? r.types?.[0]),
      /* Only a kind other than the page's own earns a chip. */
      chip: kindOf ? (kind !== defaultKind ? kind : undefined) : (r.category ?? r.types?.[0]),
      organisation: r.organisation,
      year: yearFromTitle ? reportYear(r.title) : r.year,
      published: r.publishStart ?? r.date,
      fileUrl: r.fileUrl ?? r.externalUrl,
      fileType: r.fileUrl ? r.fileType : undefined,
      fileSize: r.fileUrl ? r.fileSize : undefined,
    };
  });
  const chips = showCategory || !!kindOf;

  const columns: RecordColumn[] = [
    { key: "title", label: "Title", type: "record", sortable: true, chipKey: chips ? "chip" : undefined },
    ...(showOrganisation ? [{ key: "organisation", label: "Organisation", sortable: true } satisfies RecordColumn] : []),
    ...(showYear ? [{ key: "year", label: "Year", sortable: true } satisfies RecordColumn] : []),
    { key: "published", label: "Published", type: "date", sortable: true },
    { key: "document", label: "Document", type: "link", hrefKey: "fileUrl" },
  ];

  const filters: RecordFilter[] = [
    ...(chips ? [{ key: "type", label: "Type", allLabel: "All Types" }] : []),
    ...(showOrganisation ? [{ key: "organisation", label: "Organisation", allLabel: "All Organisations" }] : []),
    ...(showYear ? [{ key: "year", label: "Year", allLabel: "All Years", order: "desc" as const }] : []),
  ];

  return (
    <PageLayout title={title} description={description} breadcrumb={breadcrumb} lastUpdated={lastUpdated}>
      <div className="wn-section">
        <div className="sa-container">
          {intro && <div className="wn-prose wn-rec-intro">{intro}</div>}
          <RecordTable
            caption={title}
            columns={columns}
            rows={rows}
            filters={filters}
            searchKeys={["title"]}
            searchPlaceholder={`Search ${noun} by title`}
            noun={noun}
            nounSingular={nounSingular}
            /* Ordered here by the year covered; a column sort still overrides it. */
            defaultSort={yearFromTitle ? null : { key: "published", dir: "desc" }}
            emptyMessage={emptyMessage}
            layout="stack"
          />
        </div>
      </div>
    </PageLayout>
  );
}

/**
 * Newest year covered first; within a year, the lead organisation, then the
 * latest published. A record whose title names no year follows the dated ones,
 * newest published first. Then the lead organisation's most recent report is
 * lifted to the top, so the Department's current report is the first row.
 */
function orderByYearCovered(records: DocumentRecord[], lead?: string): DocumentRecord[] {
  const published = (r: DocumentRecord) => dateValue(r.publishStart ?? r.date);
  /* Descending, with unknowns (-Infinity) last and never NaN. */
  const desc = (a: number, b: number) => (a === b ? 0 : a > b ? -1 : 1);
  const sorted = [...records].sort((a, b) => {
    const ya = reportYearStart(a.title) ?? Number.NEGATIVE_INFINITY;
    const yb = reportYearStart(b.title) ?? Number.NEGATIVE_INFINITY;
    if (ya !== yb) return desc(ya, yb);
    const la = a.organisation === lead ? 0 : 1;
    const lb = b.organisation === lead ? 0 : 1;
    if (la !== lb) return la - lb;
    return desc(published(a), published(b));
  });
  if (!lead) return sorted;
  const own = sorted.filter((r) => r.organisation === lead && reportYearStart(r.title) !== undefined);
  const latest = own[0] ? reportYearStart(own[0].title) : undefined;
  if (latest === undefined) return sorted;
  const current = own.filter((r) => reportYearStart(r.title) === latest);
  return [...current, ...sorted.filter((r) => !current.includes(r))];
}
