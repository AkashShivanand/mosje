import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website-next/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Circulars & Notifications";
const DESCRIPTION =
  "Circulars, office memoranda and notifications issued by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/circulars-notifications" }),
};

export default function Page() {
  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={getDocumentsOfType("Circulars & Notifications")}
      detailBase="/website/documents"
      noun="circulars"
      nounSingular="circular"
    />
  );
}
