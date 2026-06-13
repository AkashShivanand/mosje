import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { documentListColumns } from "@/data/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Circulars & Notifications | DoSJE",
  description:
    "Official circulars and notifications issued by the Department of Social Justice & Empowerment.",
};

const rows = getDocumentsByType("Circulars & Notifications").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Circulars & Notifications"
      breadcrumb={[{ label: "Documents" }, { label: "Circulars & Notifications" }]}
      lastUpdated={getContentSyncedDate()}
      description="Official circulars, office memoranda and notifications issued by the Department."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search circulars…"
    />
  );
}
