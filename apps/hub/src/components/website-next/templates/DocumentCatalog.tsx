import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { Crumb } from "@/components/website-next/layout/PageHeader";
import { RecordTable, type RecordColumn, type RecordFilter } from "@/components/website-next/ui/RecordTable";
import { tidyTitle } from "@/components/website-next/ui/records";
import "./records.css";

export interface DocumentRecord {
  title: string;
  category?: string;
  date?: string;
  /** The file. */
  sourceUrl?: string;
  /** The record's own page, under `detailBase`. */
  slug?: string;
  /** As published, e.g. "0.74 MB". Omit when not known — never a description. */
  fileSize?: string;
  fileType?: string;
  language?: string;
  organisation?: string;
}

export interface DocumentCatalogProps {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  documents: DocumentRecord[];
  /** Kept for the page files' props; the Type filter is derived from the rows. */
  categories?: string[];
  lastUpdated?: string;
  /** Where a record's own page lives, e.g. "/website/tenders". Rows link there when given. */
  detailBase?: string;
  noun?: string;
  nounSingular?: string;
  /** A one-line pointer to where older items went (issue MAN-06). */
  archive?: { href: string; text: string };
  emptyMessage?: string;
  intro?: React.ReactNode;
}

/**
 * Tenders, vacancies and other short document catalogues (issue NAV-14).
 *
 * The classic site drew these as cards, which cannot be compared; here they
 * are the same record table as every other register — sortable, newest first,
 * one action per row. A filter appears only where the rows give it more than
 * one option (NAV-15).
 */
export function DocumentCatalog({
  title,
  description,
  breadcrumb,
  documents,
  lastUpdated,
  detailBase,
  noun = "documents",
  nounSingular,
  archive,
  emptyMessage,
  intro,
}: DocumentCatalogProps) {
  const rows = documents.map((d) => ({
    title: tidyTitle(d.title),
    href: detailBase && d.slug ? `${detailBase}/${d.slug}` : undefined,
    type: d.category,
    organisation: d.organisation,
    language: d.language,
    published: d.date,
    year: d.date ? String(new Date(Date.parse(d.date)).getFullYear() || "") : undefined,
    fileUrl: d.sourceUrl,
    fileType: d.fileType,
    fileSize: d.fileSize,
  }));

  const types = new Set(rows.map((r) => r.type).filter(Boolean));

  const columns: RecordColumn[] = [
    { key: "title", label: "Title", type: "record", sortable: true, chipKey: types.size > 1 ? "type" : undefined },
    { key: "organisation", label: "Organisation", sortable: true },
    { key: "language", label: "Language" },
    { key: "published", label: "Published", type: "date", sortable: true },
    { key: "document", label: "Document", type: "link", hrefKey: "fileUrl" },
  ];

  const filters: RecordFilter[] = [
    { key: "type", label: "Type", allLabel: "All Types" },
    { key: "organisation", label: "Organisation", allLabel: "All Organisations" },
    { key: "year", label: "Year", allLabel: "All Years", order: "desc" },
  ];

  return (
    <PageLayout title={title} description={description} breadcrumb={breadcrumb} lastUpdated={lastUpdated}>
      <div className="wn-section">
        <div className="sa-container">
          {intro && <div className="wn-prose wn-rec-intro">{intro}</div>}
          {archive && (
            <p className="wn-rec-note">
              <Icon name="inventory_2" size={20} aria-hidden />
              <span>
                {archive.text} <Link href={archive.href}>View the Archives</Link>
              </span>
            </p>
          )}
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
