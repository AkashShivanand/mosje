import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { documentListColumns } from "@/data/website/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Policies | DoSJE",
  description:
    "Policy documents and frameworks of the Department of Social Justice & Empowerment.",
};

const rows = getDocumentsByType("POLICY").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Policies"
      breadcrumb={[{ label: "Documents" }, { label: "Policies" }]}
      lastUpdated={getContentSyncedDate()}
      description="Policy documents and frameworks governing the Department's programmes and operations."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search policies…"
    />
  );
}
