import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimLinkList } from "@/components/website-dbim/utility/LinkList";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import { DBIM_IMPORTANT_LINKS } from "@/lib/website-dbim/utility";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Important Links | Department of Social Justice and Empowerment",
  description: "The divisions of the Department of Social Justice & Empowerment and where to find their work.",
};

export default function Page() {
  return (
    <DbimPage spacing="flush" title="Important Links" crumbs={[{ label: "Important Links" }]} path="/important-links" hero={DBIM_HEROES.default}>
      <div className="db-u-flush">
        <DbimLinkList rows={DBIM_IMPORTANT_LINKS} searchLabel="Search..." perPage label="Important Links" />
      </div>
    </DbimPage>
  );
}
