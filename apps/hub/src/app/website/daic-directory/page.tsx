import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website-next/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "DAIC Directory";
const DESCRIPTION =
  "Telephone directory of the Dr. Ambedkar International Centre (DAIC) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | Dr. Ambedkar International Centre`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/daic-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("DAIC")}
    />
  );
}
