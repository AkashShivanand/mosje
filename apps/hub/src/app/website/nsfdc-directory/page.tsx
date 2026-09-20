import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "NSFDC Directory";
const DESCRIPTION =
  "Telephone directory of the National Scheduled Castes Finance & Development Corporation (NSFDC) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | National Scheduled Castes Finance & Development Corporation`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/nsfdc-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("NSFDC")}
    />
  );
}
