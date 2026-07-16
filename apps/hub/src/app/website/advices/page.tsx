import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { documentListColumns } from "@/data/website/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Advices | DoSJE",
  description:
    "Advisories and advices issued by the Department of Social Justice & Empowerment to States and implementing agencies.",
};

const rows = getDocumentsByType("Advices").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Advices"
      breadcrumb={[{ label: "Documents" }, { label: "Advices" }]}
      lastUpdated={getContentSyncedDate()}
      description="Advisories issued by the Department to States, UTs and implementing agencies."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search advices…"
    />
  );
}
