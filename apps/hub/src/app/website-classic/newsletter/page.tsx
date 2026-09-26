import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Newsletter";
const DESCRIPTION =
  "Newsletters published by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/newsletter" }),
};

export default function Page() {
  const records = getDocumentsOfType("Newsletter");

  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={records}
      detailBase="/website/documents"
      noun="newsletters"
      nounSingular="newsletter"
    />
  );
}
