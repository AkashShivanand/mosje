"use client";

import { useRouter } from "next/navigation";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";
import { dbimHref } from "@/lib/website-dbim/nav";

/** The results pager. The page lives in the URL (`?q=…&page=…`), so a result page is shareable. */
export function DbimSearchPager({ query, page, pageCount }: { query: string; page: number; pageCount: number }) {
  const router = useRouter();
  return (
    <DbimPagination
      page={page}
      pageCount={pageCount}
      label="Search result pages"
      onChange={(n) => {
        const qs = new URLSearchParams({ q: query });
        if (n > 1) qs.set("page", String(n));
        router.push(`${dbimHref("/search")}?${qs.toString()}`);
      }}
    />
  );
}
