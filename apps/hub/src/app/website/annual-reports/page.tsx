import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { documentListColumns } from "@/data/website/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Annual Reports | DoSJE",
  description:
    "Annual reports of the Department of Social Justice & Empowerment and the National Commission for Safai Karamcharis.",
};

const rows = getDocumentsByType("Annual Reports").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Annual Reports"
      breadcrumb={[{ label: "Documents" }, { label: "Annual Reports" }]}
      lastUpdated={getContentSyncedDate()}
      description="Annual reports published by the Department of Social Justice & Empowerment and the National Commission for Safai Karamcharis."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search annual reports…"
    />
  );
}
