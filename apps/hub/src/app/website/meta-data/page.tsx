import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website-next/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Meta Data";
const DESCRIPTION =
  "Scheme metadata published by the Department under the Open Government Data policy.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/meta-data" }),
};

export default function Page() {
  const records = getDocumentsOfType("Meta Data");

  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={records}
      detailBase="/website/documents"
      noun="records"
      nounSingular="record"
    />
  );
}
