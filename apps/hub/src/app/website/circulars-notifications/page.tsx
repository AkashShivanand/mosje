import type { Metadata } from "next";
import { DocumentCatalog } from "@/components/website/templates/DocumentCatalog";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/website/content";

export const metadata: Metadata = {
  title: "Circulars & Notifications | DoSJE",
  description:
    "Official circulars, notifications, and gazette orders published by the Department of Social Justice & Empowerment.",
};

export default function CircularsNotificationsPage() {
  const docs = getDocumentsByType("Circulars & Notifications").map((d) => ({
    slug: d.slug,
    title: d.title,
    date: d.date,
    category: "Notification",
    sourceUrl: d.fileUrl ?? d.sourceUrl,
    fileSize: "PDF",
  }));

  return (
    <DocumentCatalog
      title="Circulars & Notifications"
      description="Official administrative circulars, gazette notifications, and policy directives issued by the Department."
      breadcrumb={[{ label: "Documents", href: "/website/circulars-notifications" }, { label: "Circulars & Notifications" }]}
      lastUpdated={getContentSyncedDate()}
      documents={docs}
      categories={["Notification"]}
    />
  );
}
