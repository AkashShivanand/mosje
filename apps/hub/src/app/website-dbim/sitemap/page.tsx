import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimSitemapTree } from "@/components/website-dbim/utility/SitemapTree";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Sitemap | Department of Social Justice and Empowerment",
  description: "Every section of the website of the Department of Social Justice & Empowerment on one page.",
};

export default function Page() {
  return (
    <DbimPage spacing="flush" title="Sitemap" crumbs={[{ label: "Sitemap" }]} path="/sitemap" hero={DBIM_HEROES.default}>
      <div className="db-u-flush">
        <DbimSitemapTree />
      </div>
    </DbimPage>
  );
}
