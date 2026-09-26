import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website-next/templates/RecordLibrary";
import { getContentSyncedDate, getDocumentsOfType } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Memoranda of Understanding";
const DESCRIPTION =
  "Memoranda of Understanding entered into by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/mou" }),
};

export default function Page() {
  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={getDocumentsOfType("MOU")}
      detailBase="/website/documents"
      noun="memoranda"
      nounSingular="memorandum"
    />
  );
}
