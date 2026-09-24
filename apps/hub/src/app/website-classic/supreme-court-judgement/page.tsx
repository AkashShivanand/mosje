import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Supreme Court Judgement";
const DESCRIPTION =
  "Judgments of the Hon'ble Supreme Court of India published by the National Commission for Safai Karamcharis.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/supreme-court-judgement" }),
};

export default function Page() {
  const records = getDocumentsOfType("Supreme Court Judgement");

  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={records}
      detailBase="/website/documents"
      noun="judgments"
      nounSingular="judgment"
    />
  );
}
