import type { Metadata } from "next";
import { RecordLibrary } from "@/components/website/templates/RecordLibrary";
import { getContentSyncedDate, getSchemeDocuments } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Scheme Documents";
const DESCRIPTION =
  "Guidelines, performance statements and circulars published against a scheme of the Department and its organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/scheme-documents" }),
};

/*
 * The listing every scheme document's own page already pointed at.
 *
 * The detail pages shipped with `breadcrumb` and `backHref` set to
 * `/website/scheme-documents` while the route held only `[slug]`, so the way back
 * from any of the hundred documents was a 404. The collection also had no way in
 * at all: nothing on the site linked it. This is that page, built on the same
 * RecordLibrary as the other document libraries.
 */
export default function Page() {
  return (
    <RecordLibrary
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
      records={getSchemeDocuments()}
      detailBase="/website/scheme-documents"
      noun="scheme documents"
      nounSingular="document"
    />
  );
}
