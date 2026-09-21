import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website-next/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Chairperson's Office";
const DESCRIPTION =
  "Directory of the National Commission for Scheduled Castes — the Chairperson, Members and supporting secretariat officers, with contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | National Commission for Scheduled Castes`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/chairpersons-office" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Connect" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("NCSC")}
    />
  );
}
