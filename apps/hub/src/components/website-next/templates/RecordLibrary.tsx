import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { Crumb } from "@/components/website-next/layout/PageHeader";
import { RecordTable, type RecordColumn, type RecordFilter } from "@/components/website-next/ui/RecordTable";
import { tidyTitle } from "@/components/website-next/ui/records";
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
}: RecordLibraryProps) {
  const rows = records.map((r) => ({
    title: tidyTitle(r.title),
    href: `${detailBase}/${r.slug}`,
    type: r.category ?? r.types?.[0],
    organisation: r.organisation,
    year: r.year,
    published: r.publishStart ?? r.date,
    fileUrl: r.fileUrl ?? r.externalUrl,
    fileType: r.fileUrl ? r.fileType : undefined,
    fileSize: r.fileUrl ? r.fileSize : undefined,
  }));

  const columns: RecordColumn[] = [
    { key: "title", label: "Title", type: "record", sortable: true, chipKey: showCategory ? "type" : undefined },
    ...(showOrganisation ? [{ key: "organisation", label: "Organisation", sortable: true } satisfies RecordColumn] : []),
    ...(showYear ? [{ key: "year", label: "Year", sortable: true } satisfies RecordColumn] : []),
    { key: "published", label: "Published", type: "date", sortable: true },
    { key: "document", label: "Document", type: "link", hrefKey: "fileUrl" },
  ];

  const filters: RecordFilter[] = [
    ...(showCategory ? [{ key: "type", label: "Type", allLabel: "All Types" }] : []),
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
            defaultSort={{ key: "published", dir: "desc" }}
            emptyMessage={emptyMessage}
            layout="stack"
          />
        </div>
      </div>
    </PageLayout>
  );
}
