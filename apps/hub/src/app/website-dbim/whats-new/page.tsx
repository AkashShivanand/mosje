import type { Metadata } from "next";
import { DbimPage } from "@/components/website-dbim/layout/DbimPage";
import { WhatsNewList } from "@/components/website-dbim/documents/WhatsNewList";
import { DBIM_HEROES } from "@/lib/website-dbim/nav";
import { whatsNewDocuments, whatsNewUpdates } from "@/lib/website-dbim/documents";

export const metadata: Metadata = { title: "What's New | Department of Social Justice and Empowerment" };

export default function DbimWhatsNewPage() {
  return (
    <DbimPage title="What's New" crumbs={[{ label: "What's New", path: "/whats-new" }]} path="/whats-new" hero={DBIM_HEROES.default}>
      <WhatsNewList groups={whatsNewDocuments()} updates={whatsNewUpdates()} />
    </DbimPage>
  );
}
