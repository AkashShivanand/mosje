import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website-next/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "SCW Directory";
const DESCRIPTION =
  "Telephone directory of the Scheduled Caste Welfare division — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | Scheduled Caste Welfare`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/scw-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("SCW")}
    />
  );
}
