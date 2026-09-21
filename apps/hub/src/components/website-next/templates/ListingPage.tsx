import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { PageHeaderProps } from "@/components/website-next/layout/PageHeader";
import { ListingTable, type ListingTableColumn } from "@/components/website/ui/data-table";

interface ListingPageProps extends PageHeaderProps {
  columns: ListingTableColumn[];
  rows: Record<string, unknown>[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  intro?: React.ReactNode;
}

/** T2/T3 — Listing. The page header over a searchable, sortable, paged table. */
export function ListingPage({ columns, rows, searchKeys, searchPlaceholder, pageSize, intro, ...header }: ListingPageProps) {
  return (
    <PageLayout {...header}>
      <div className="wn-section">
        <div className="sa-container">
          {intro && <div className="wn-prose" style={{ marginBottom: "var(--sa-stack-24)" }}>{intro}</div>}
          <ListingTable
            caption={header.title}
            columns={columns}
            rows={rows}
            searchKeys={searchKeys}
            searchPlaceholder={searchPlaceholder ?? "Search this list…"}
            pageSize={pageSize}
          />
        </div>
      </div>
    </PageLayout>
  );
}
