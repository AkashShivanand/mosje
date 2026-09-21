import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { PageHeaderProps } from "@/components/website-next/layout/PageHeader";
import { RecordTable, type RecordColumn, type RecordFilter } from "@/components/website-next/ui/RecordTable";
import "./records.css";

/** The column contract the page files describe. Structurally the classic `ListingTableColumn`. */
export type ListingColumn = RecordColumn;

interface ListingPageProps extends PageHeaderProps {
  columns: ListingColumn[];
  rows: Record<string, unknown>[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  /** Department text above the table, rendered as prose. */
  intro?: React.ReactNode;
  filters?: RecordFilter[];
  /** What one row is called, in running text. @default "records" */
  noun?: string;
  nounSingular?: string;
  emptyMessage?: string;
}

/**
 * T2/T3 — Listing. The page header over the redesign's one record table:
 * searchable, sortable through real header buttons, paged with the page in the
 * URL, and a result count read out as it changes (issues NAV-14, ACC-16, ACC-21,
 * LAY-03, MOB-03, TYP-05).
 */
export function ListingPage({
  columns,
  rows,
  searchKeys,
  searchPlaceholder,
  pageSize,
  intro,
  filters,
  noun,
  nounSingular,
  emptyMessage,
  ...header
}: ListingPageProps) {
  return (
    <PageLayout {...header}>
      <div className="wn-section">
        <div className="sa-container">
          {intro && <div className="wn-prose wn-rec-intro">{intro}</div>}
          <RecordTable
            caption={header.title}
            columns={columns}
            rows={rows}
            searchKeys={searchKeys}
            searchPlaceholder={searchPlaceholder?.replace(/…$/, "")}
            pageSize={pageSize}
            filters={filters}
            noun={noun}
            nounSingular={nounSingular}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    </PageLayout>
  );
}
