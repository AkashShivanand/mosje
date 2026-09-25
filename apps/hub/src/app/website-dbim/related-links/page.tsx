import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { DbimLinkList } from "@/components/website-dbim/utility/LinkList";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import { DBIM_RELATED_LINKS } from "@/lib/website-dbim/utility";
import "@/components/website-dbim/utility/utility.css";

export const metadata: Metadata = {
  title: "Related Links | Department of Social Justice and Empowerment",
  description: "National portals and platforms related to the work of the Department of Social Justice & Empowerment.",
};

export default function Page() {
  return (
    <DbimPage spacing="flush" title="Related Links" crumbs={[{ label: "Related Links" }]} path="/related-links" hero={DBIM_HEROES.relatedLinks}>
      <div className="db-u-flush">
        <DbimLinkList rows={DBIM_RELATED_LINKS} searchLabel="Search Related Links" label="Related Links" spaced />
      </div>
    </DbimPage>
  );
}
