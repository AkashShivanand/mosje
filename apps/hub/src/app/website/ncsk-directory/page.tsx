import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website-next/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "NCSK Directory";
const DESCRIPTION =
  "Telephone directory of the National Commission for Safai Karamcharis (NCSK) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | National Commission for Safai Karamcharis`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/ncsk-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("NCSK")}
    />
  );
}
