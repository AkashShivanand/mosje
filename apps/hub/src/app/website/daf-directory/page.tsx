import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website-next/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "DAF Directory";
const DESCRIPTION =
  "Telephone directory of the Dr. Ambedkar Foundation (DAF) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | Dr. Ambedkar Foundation`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/daf-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("DAF")}
    />
  );
}
