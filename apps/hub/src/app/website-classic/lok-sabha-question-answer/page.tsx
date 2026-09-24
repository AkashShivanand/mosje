import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Lok Sabha Question & Answer";
const DESCRIPTION =
  "Questions raised in Parliament on subjects administered by the Department, with the replies laid on the table of the House.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/lok-sabha-question-answer" }),
};

export default function Page() {
  const records = getDocumentsOfType("Parliament Questions");

  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={records}
      detailBase="/website/documents"
      noun="replies"
      nounSingular="reply"
    />
  );
}
