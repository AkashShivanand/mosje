import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Resources";
const DESCRIPTION =
  "Toolkits, manuals and reference material published to support the implementation and outreach of the Department's schemes.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/resources" }),
};

export default function Page() {
  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={getDocumentsOfType("Resources")}
      detailBase="/website/documents"
      noun="resources"
      nounSingular="resource"
    />
  );
}
