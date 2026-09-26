import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website-next/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "NSKFDC Directory";
const DESCRIPTION =
  "Telephone directory of the National Safai Karamcharis Finance & Development Corporation (NSKFDC) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | National Safai Karamcharis Finance & Development Corporation`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/nskfdc-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("NSKFDC")}
    />
  );
}
