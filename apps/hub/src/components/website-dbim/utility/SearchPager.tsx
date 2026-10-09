"use client";

import { useRouter } from "next/navigation";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";
import { dbimHref } from "@/lib/website-dbim/nav";
import { searchHref, type DbimSearchCategory, type DbimSearchSort } from "@/lib/website-dbim/search-params";

/** The results pager. Query, category, sort and page live in the URL, so every result page is shareable. */
export function DbimSearchPager({
  query,
  category,
  sort,
  page,
  pageCount,
}: {
  query: string;
  category?: DbimSearchCategory;
  sort?: DbimSearchSort;
  page: number;
  pageCount: number;
}) {
  const router = useRouter();
  return (
    <DbimPagination
      page={page}
      pageCount={pageCount}
      label="Search result pages"
      onChange={(n) => router.push(searchHref(dbimHref("/search"), query, { category, sort, page: n }))}
    />
  );
}
