import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { documentListColumns } from "@/data/website/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Notices | DoSJE",
  description:
    "Public notices and announcements issued by the Department of Social Justice & Empowerment.",
};

const rows = getDocumentsByType("Notice").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Notices"
      breadcrumb={[{ label: "Documents" }, { label: "Notices" }]}
      lastUpdated={getContentSyncedDate()}
      description="Public notices and announcements issued by the Department."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search notices…"
    />
  );
}
