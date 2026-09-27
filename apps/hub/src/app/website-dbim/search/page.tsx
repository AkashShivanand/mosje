import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimSearchResults } from "@/components/website-dbim/utility/SearchResults";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Search | Department of Social Justice and Empowerment",
  description: "Search the website of the Department of Social Justice & Empowerment.",
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const query = one(params.q).trim();
  const page = Math.max(1, Number(one(params.page)) || 1);
  return (
    <DbimPage spacing="flush" title="Search" crumbs={[{ label: "Search" }]} path="/search" hero={DBIM_HEROES.default}>
      <div className="db-u-flush">
        <DbimSearchResults query={query} page={page} />
      </div>
    </DbimPage>
  );
}
