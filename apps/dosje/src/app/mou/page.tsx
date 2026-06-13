import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { documentListColumns } from "@/data/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Memoranda of Understanding | DoSJE",
  description:
    "Memoranda of Understanding signed by the Department of Social Justice & Empowerment with partner institutions.",
};

const rows = getDocumentsByType("MOU").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Memoranda of Understanding"
      breadcrumb={[{ label: "Documents" }, { label: "MoU" }]}
      lastUpdated={getContentSyncedDate()}
      description="Memoranda of Understanding signed by the Department with partner institutions and agencies."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search MoUs…"
    />
  );
}
