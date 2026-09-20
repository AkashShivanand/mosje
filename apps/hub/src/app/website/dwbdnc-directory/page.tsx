import type { Metadata } from "next";
import { OfficialsDirectory } from "@/components/website/templates/OfficialsDirectory";
import { getContentSyncedDate, getOfficialsByOrganisation } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "DWBDNC Directory";
const DESCRIPTION =
  "Telephone directory of the Development and Welfare Board for De-Notified, Nomadic and Semi-Nomadic Communities (DWBDNC) — officers with intercom and contact details.";

export const metadata: Metadata = {
  title: `${TITLE} | Development and Welfare Board for De-Notified, Nomadic and Semi-Nomadic Communities`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/dwbdnc-directory" }),
};

export default function Page() {
  return (
    <OfficialsDirectory
      title={TITLE}
      breadcrumb={[{ label: "Associated Organisations" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      officials={getOfficialsByOrganisation("DWBDNC")}
    />
  );
}
