import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "NHAA Directory";
const DESCRIPTION =
  "Telephone directory of the National Helpline Against Atrocities (NHAA) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | National Helpline Against Atrocities`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/nhaa-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("NHAA")}
    />
  );
}
