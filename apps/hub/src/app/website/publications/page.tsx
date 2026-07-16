import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { documentListColumns } from "@/data/website/columns";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Publications | DoSJE",
  description:
    "Reports, studies, brochures and other publications released by the Department of Social Justice & Empowerment.",
};

const rows = getDocumentsByType("Publications").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Publications"
      breadcrumb={[{ label: "Documents" }, { label: "Publications" }]}
      lastUpdated={getContentSyncedDate()}
      description="Reports, studies, compendiums and brochures released by the Department."
      columns={documentListColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search publications…"
    />
  );
}
