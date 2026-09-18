import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "NBCFDC Directory";
const DESCRIPTION =
  "Telephone directory of the National Backward Classes Finance & Development Corporation (NBCFDC) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | National Backward Classes Finance & Development Corporation`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/nbcfdc-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("NBCFDC")}
    />
  );
}
