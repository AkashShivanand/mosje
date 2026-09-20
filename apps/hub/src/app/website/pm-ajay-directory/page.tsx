import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "PM-AJAY Directory";
const DESCRIPTION =
  "Telephone directory of the Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | Pradhan Mantri Anusuchit Jaati Abhyuday Yojana`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/pm-ajay-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("PMAJAY")}
    />
  );
}
