import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "MoSJE Directory";
const DESCRIPTION =
  "Telephone directory of the Ministry of Social Justice & Empowerment — Ministers, secretariat officers and section officers, with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | Ministry of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/mosje-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Department" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("MoSJE")}
    />
  );
}
