import { PageLayout } from "@/components/website/layout/PageLayout";
import type { PageHeroProps } from "@/components/website/layout/PageHero";
import { DataTable, type DataTableColumn } from "@/components/website/ui/data-table";

interface ListingPageProps extends PageHeroProps {
  columns: DataTableColumn[];
  rows: Record<string, unknown>[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  /** Optional intro paragraph above the table. */
  intro?: React.ReactNode;
}

/**
 * T2/T3 — Listing template. A title band over a searchable, sortable, paginated DataTable.
 * Used by document listings (annual reports, notices, circulars, schemes, tenders…) and
 * directories (mosje-directory, who's who, org directories).
 */
export function ListingPage({
  columns,
  rows,
  searchKeys,
  searchPlaceholder,
  pageSize,
  intro,
  ...hero
}: ListingPageProps) {
  return (
    <PageLayout {...hero}>
      <section>
        <div className="sa-container py-10 md:py-12">
          {intro && <div className="gov-prose mb-6 max-w-measure">{intro}</div>}
          <DataTable
            caption={hero.title}
            columns={columns}
            rows={rows}
            searchKeys={searchKeys}
            searchPlaceholder={searchPlaceholder ?? "Search…"}
            pageSize={pageSize}
          />
        </div>
      </section>
    </PageLayout>
  );
}
