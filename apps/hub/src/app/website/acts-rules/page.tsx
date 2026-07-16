import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { documentListColumns } from "@/data/website/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Acts & Rules | DoSJE",
  description:
    "Acts, rules and statutory regulations administered by the Department of Social Justice & Empowerment.",
};

const rows = getDocumentsByType("Acts & Rules").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Acts & Rules"
      breadcrumb={[{ label: "Documents" }, { label: "Acts & Rules" }]}
      lastUpdated={getContentSyncedDate()}
      description="Acts, rules and statutory regulations administered by the Department."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search acts & rules…"
    />
  );
}
