import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { documentListColumns } from "@/data/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Resources | DoSJE",
  description:
    "Useful resources, toolkits and reference material from the Department of Social Justice & Empowerment.",
};

const rows = getDocumentsByType("Resources").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Resources"
      breadcrumb={[{ label: "Documents" }, { label: "Resources" }]}
      lastUpdated={getContentSyncedDate()}
      description="Toolkits, manuals and reference material to support scheme implementation and outreach."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search resources…"
    />
  );
}
