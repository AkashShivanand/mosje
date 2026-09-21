import type { Metadata } from "next";
import { ListingPage } from "@/components/website-next/templates/ListingPage";
import { SOCIAL_WELFARE_STATISTICS } from "@/data/website";
import { grantDocumentColumns } from "@/data/website/columns";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Handbook on Social Welfare Statistics";
const DESCRIPTION =
  "The Handbook on Social Welfare Statistics, compiled by the Statistics Division of the Department of Social Justice & Empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/handbook-on-social-welfare-statistics" }),
};

export default function Page() {
  /* `grantDocumentColumns` reads `title`, `date`, `fileSize` and `fileUrl`. */
  const rows = SOCIAL_WELFARE_STATISTICS.map((d, i) => ({
    sno: i + 1,
    title: d.label,
    date: d.date,
    fileSize: d.fileSize,
    fileUrl: d.href,
  }));

  return (
    <ListingPage
      title={TITLE}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="18 Sep 2026"
      columns={grantDocumentColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search editions by title"
      noun="editions"
      nounSingular="edition"
    />
  );
}
